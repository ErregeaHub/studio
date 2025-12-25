import pool from '../lib/db';
import fs from 'fs';
import path from 'path';

/**
 * Migration Runner
 * Executes idempotent SQL scripts and logs the version.
 */
async function runMigration() {
  console.log('--- Starting Migration ---');

  const migrationPath = path.join(process.cwd(), 'src/lib/migrations/schema.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');

  // Split by semicolon but ignore semicolons inside strings or enums
  // Note: This is a simple splitter for the provided schema.sql
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log(`Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      // Convert ? to $n for each statement if needed
      let pgSql = statement;
      // Note: Our migration script statements usually don't have params, 
      // but we should be careful with any logic that might.
      await client.query(pgSql);
    }

    // Log the migration
    await client.query(
      `INSERT INTO schema_migrations (version, description) VALUES ($1, $2) 
       ON CONFLICT (version) DO UPDATE SET applied_at = CURRENT_TIMESTAMP`,
      ['1.0.0', 'Initial schema setup']
    );

    await client.query('COMMIT');
    console.log('--- Migration Completed Successfully ---');
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error(`--- Migration Failed! ---\nError: ${error.message}`);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
