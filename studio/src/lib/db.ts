import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Database connection pool configuration for PostgreSQL
 */
// Helper to clean environment variables (removes quotes if present)
const cleanEnv = (val: string | undefined) => {
  if (!val || val === 'undefined' || val === 'null') return undefined;
  // Remove any quotes (single or double) and trim whitespace
  const cleaned = val.replace(/['"]/g, '').trim();
  return cleaned === '' ? undefined : cleaned;
};

// Explicitly resolve connection parameters
let connectionString = cleanEnv(process.env.POSTGRES_URL || process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL);

// If connection string contains sslmode, it might interfere with our JS config.
// We'll handle SSL explicitly in the pool config.
if (connectionString && connectionString.includes('sslmode=')) {
  connectionString = connectionString.replace(/([?&])sslmode=[^&]*/, '$1').replace(/[?&]$/, '');
}
const resolvedHost = cleanEnv(process.env.DB_HOST || process.env.DATABASE_HOST || process.env.POSTGRES_HOST || process.env.SUPABASE_HOST);
const resolvedPort = cleanEnv(process.env.DB_PORT || process.env.DATABASE_PORT || process.env.POSTGRES_PORT || process.env.SUPABASE_PORT) || '5432';
const resolvedUser = cleanEnv(process.env.DB_USERNAME || process.env.DB_USER || process.env.DATABASE_USERNAME || process.env.DATABASE_USER || process.env.POSTGRES_USER || process.env.SUPABASE_USER);
const resolvedPassword = cleanEnv(process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || process.env.POSTGRES_PASSWORD || process.env.SUPABASE_PASSWORD);
const resolvedDatabase = cleanEnv(process.env.DB_NAME || process.env.DB_DATABASE || process.env.DATABASE_NAME || process.env.POSTGRES_DATABASE || process.env.POSTGRES_NAME || process.env.SUPABASE_DATABASE);
const useSSL = cleanEnv(process.env.DB_SSL || process.env.DATABASE_SSL || process.env.SUPABASE_SSL) !== 'false';

const poolConfig: any = connectionString ? {
  connectionString,
  ssl: useSSL ? {
    rejectUnauthorized: false,
  } : false,
} : {
  host: resolvedHost,
  port: parseInt(resolvedPort),
  user: resolvedUser,
  password: resolvedPassword,
  database: resolvedDatabase,
  ssl: useSSL ? {
    rejectUnauthorized: false, // Required for Supabase and other managed PG services
  } : false,
};

// Force rejectUnauthorized: false globally for the pg library if SSL is requested
if (useSSL && typeof poolConfig.ssl === 'object') {
  poolConfig.ssl.rejectUnauthorized = false;
}

const pool = new Pool({
  ...poolConfig,
  max: 20, // Increased for Supabase
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

console.log('--- Supabase (PostgreSQL) Connection Diagnostic ---');
if (connectionString) {
  console.log('Using Connection String (Masked):', connectionString.replace(/:([^:@]+)@/, ':****@'));
} else {
  console.log('Host:', resolvedHost);
  console.log('Port:', resolvedPort);
  console.log('User:', resolvedUser);
  console.log('Database:', resolvedDatabase);
}
console.log('SSL:', useSSL);
console.log('---------------------------------------');

/**
 * Execute a query using a prepared statement
 */
export async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    // Convert MySQL style "?" to PostgreSQL style "$1, $2, ..."
    let pgSql = sql;
    if (params && params.length > 0) {
      let index = 1;
      pgSql = sql.replace(/\?/g, () => `$${index++}`);
    }

    const result = await pool.query(pgSql, params);
    
    // MySQL returns results directly for SELECT, PG returns rows
    if (pgSql.trim().toUpperCase().startsWith('SELECT')) {
      return result.rows as any as T;
    }
    
    // For INSERT/UPDATE/DELETE, return the result object or rowCount
    return result as any as T;
  } catch (error: any) {
    console.error('Database Query Error:', error.message);
    throw new Error(`Database operation failed: ${error.message}`);
  }
}

/**
 * Transaction wrapper for atomic operations
 */
export async function withTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction failed, rolled back:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
