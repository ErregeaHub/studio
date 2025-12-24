import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Database connection pool configuration
 * Implements:
 * - TLS/SSL encryption
 * - Connection pooling with configurable parameters
 * - Session variables (character set, timezone, isolation level)
 */
// Helper to clean environment variables (removes quotes if present)
const cleanEnv = (val: string | undefined) => {
  if (!val || val === 'undefined' || val === 'null') return undefined;
  // Remove any quotes and trim
  return val.replace(/['"]/g, '').trim();
};

const poolConfig: mysql.PoolOptions = {
  host: cleanEnv(process.env.DB_HOST),
  port: parseInt(cleanEnv(process.env.DB_PORT) || '4000'), // TiDB Cloud default port is 4000
  user: cleanEnv(process.env.DB_USERNAME || process.env.DB_USER),
  password: cleanEnv(process.env.DB_PASSWORD),
  database: cleanEnv(process.env.DB_NAME || process.env.DB_DATABASE),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false, // TiDB Cloud often requires this for simple connections
  },
  // Session variables
  timezone: 'Z',
  charset: 'utf8mb4',
};

// Debug log for connection (safe version)
const maskedUser = poolConfig.user ? (poolConfig.user.includes('.') ? `${poolConfig.user.split('.')[0]}.***` : 'NO_PREFIX_DETECTED') : 'undefined';
console.log('Database Connection Info:', {
  host: poolConfig.host,
  port: poolConfig.port,
  user: maskedUser,
  database: poolConfig.database,
  ssl: !!poolConfig.ssl
});

// Create the connection pool
const pool = mysql.createPool(poolConfig);

/**
 * Set session variables on every new connection
 */
pool.on('connection', (connection) => {
  connection.query("SET SESSION time_zone = '+00:00'");
  connection.query("SET SESSION character_set_server = 'utf8mb4'");
  connection.query("SET SESSION collation_server = 'utf8mb4_unicode_ci'");
  connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED");
});

/**
 * Execute a query using a prepared statement
 * Supports comprehensive error handling
 */
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    const [results] = await pool.execute(sql, params);
    return results as T;
  } catch (error: any) {
    // Check for specific TiDB prefix error to provide better guidance
    const msg = error.message?.toLowerCase() || '';
    const isPrefixError = msg.includes('user name prefix') || msg.includes('prefix');
    
    console.error('Database Query Error:', {
      message: error.message,
      code: error.code,
      user: maskedUser,
      hint: isPrefixError ? 'TiDB Cloud requires the username to be in the format "prefix.user". Check your DB_USERNAME env var.' : undefined
    });
    
    throw new Error(isPrefixError ? `TiDB Configuration Error: ${error.message}` : `Database operation failed: ${error.code || 'UNKNOWN_ERROR'}`);
  }
}

/**
 * Transaction wrapper for atomic operations
 */
export async function withTransaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    console.error('Transaction failed, rolled back:', error);
    throw error;
  } finally {
    connection.release();
  }
}

export default pool;
