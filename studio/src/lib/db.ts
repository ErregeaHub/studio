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
  // Remove any quotes (single or double) and trim whitespace
  const cleaned = val.replace(/['"]/g, '').trim();
  return cleaned === '' ? undefined : cleaned;
};

// Explicitly resolve the user to handle potential Vercel collisions
const resolvedUser = cleanEnv(process.env.TIDB_USER || process.env.DB_USERNAME || process.env.DB_USER);
const resolvedHost = cleanEnv(process.env.TIDB_HOST || process.env.DB_HOST);
const resolvedPassword = cleanEnv(process.env.TIDB_PASSWORD || process.env.DB_PASSWORD);
const resolvedDatabase = cleanEnv(process.env.TIDB_NAME || process.env.DB_NAME || process.env.DB_DATABASE);

const poolConfig: mysql.PoolOptions = {
  host: resolvedHost,
  port: parseInt(cleanEnv(process.env.TIDB_PORT || process.env.DB_PORT) || '4000'),
  user: resolvedUser,
  password: resolvedPassword,
  database: resolvedDatabase,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false,
  },
  timezone: 'Z',
  charset: 'utf8mb4',
};

// Enhanced Debug Log (masked)
const userStatus = resolvedUser 
  ? (resolvedUser.includes('.') ? `PREFIX_DETECTED (${resolvedUser.split('.')[0]}.***)` : 'NO_DOT_IN_USERNAME')
  : 'UNDEFINED';

console.log('--- TiDB Connection Diagnostic ---');
console.log('Host:', resolvedHost);
console.log('User Status:', userStatus);
console.log('Database:', resolvedDatabase);
console.log('Source Priority: TIDB_USER > DB_USERNAME > DB_USER');
console.log('----------------------------------');

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
      userStatus: userStatus,
      hint: isPrefixError ? 'TiDB Cloud requires the username to be in the format "prefix.user". Check your environment variables.' : undefined
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
