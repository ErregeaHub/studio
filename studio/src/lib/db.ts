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
const rawUser = process.env.TIDB_USER || process.env.DB_USERNAME || process.env.DB_USER;
const resolvedUser = cleanEnv(rawUser);
const resolvedHost = cleanEnv(process.env.TIDB_HOST || process.env.DB_HOST);
const resolvedPassword = cleanEnv(process.env.TIDB_PASSWORD || process.env.DB_PASSWORD);
const resolvedDatabase = cleanEnv(process.env.TIDB_NAME || process.env.DB_NAME || process.env.DB_DATABASE);

// Diagnostic info for identifying which env var is being used
const userSource = process.env.TIDB_USER ? 'TIDB_USER' : (process.env.DB_USERNAME ? 'DB_USERNAME' : (process.env.DB_USER ? 'DB_USER' : 'NONE'));

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
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false,
  },
  timezone: 'Z',
  charset: 'utf8mb4',
};

// Enhanced Debug Log (masked)
const userStatus = resolvedUser 
  ? (resolvedUser.includes('.') ? `PREFIX_DETECTED (${resolvedUser.split('.')[0]}.***)` : `NO_DOT_IN_USERNAME (Value: ${resolvedUser})`)
  : 'UNDEFINED';

console.log('--- TiDB Connection Diagnostic ---');
console.log('Host:', resolvedHost);
console.log('User Source:', userSource);
console.log('User Status:', userStatus);
console.log('Database:', resolvedDatabase);
console.log('SSL Config: minVersion=TLSv1.2, rejectUnauthorized=false');
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
    const errorMsg = error.message || '';
    const errorCode = error.code || '';
    const fullError = `${errorCode} ${errorMsg}`.toLowerCase();
    
    const isPrefixError = fullError.includes('user name prefix') || 
                         fullError.includes('prefix') || 
                         (fullError.includes('er_unknown_error') && (userStatus.includes('NO_DOT') || userStatus === 'UNDEFINED'));
    
    console.error('Database Query Error Details:', {
      message: error.message,
      code: error.code,
      userStatus: userStatus,
      userSource: userSource,
      isPrefixError: isPrefixError
    });
    
    if (isPrefixError) {
      throw new Error(`TiDB Configuration Error: Missing user name prefix. Current user from ${userSource} is "${resolvedUser}". TiDB Cloud requires the format "prefix.user".`);
    }
    
    throw new Error(`Database operation failed: ${error.code || 'UNKNOWN_ERROR'} (${error.message})`);
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
