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
  user: cleanEnv(process.env.DB_USER || process.env.DB_USERNAME),
  password: cleanEnv(process.env.DB_PASSWORD),
  database: cleanEnv(process.env.DB_NAME || process.env.DB_DATABASE),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
  },
  // Session variables
  timezone: 'Z',
  charset: 'utf8mb4',
};

// Debug log for connection (safe version)
console.log('Database Connection Attempt:', {
  host: poolConfig.host,
  port: poolConfig.port,
  user: poolConfig.user ? `${poolConfig.user.split('.')[0]}.***` : 'undefined',
  database: poolConfig.database,
  ssl: !!poolConfig.ssl,
  node_env: process.env.NODE_ENV
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
    const isPrefixError = error.message?.includes('user name prefix');
    
    console.error('Database Query Error:', {
      message: error.message,
      code: error.code,
      hint: isPrefixError ? 'TiDB Cloud requires the username to be in the format "prefix.user"' : undefined
    });
    
    throw new Error(isPrefixError ? `TiDB Error: ${error.message}` : `Database operation failed: ${error.code || 'UNKNOWN_ERROR'}`);
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
