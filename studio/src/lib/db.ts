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
const poolConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || process.env.DB_DATABASE,
  waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS === 'true',
  connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10'),
  queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || '0'),
  ssl: process.env.DB_SSL === 'true' || process.env.DB_PORT === '4000' || process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false', // Default to true for security
  } : undefined,
  // Session variables
  timezone: 'Z', // UTC
  charset: 'utf8mb4',
};

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
    console.error(`Database Query Error: ${error.message}`);
    throw new Error(`Database operation failed: ${error.code || 'UNKNOWN_ERROR'}`);
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
