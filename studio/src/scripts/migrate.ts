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

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    console.log(`Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      await connection.execute(statement);
    }

    // Log the migration
    await connection.execute(
      `INSERT INTO schema_migrations (version, description) VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE applied_at = CURRENT_TIMESTAMP`,
      ['1.0.0', 'Initial schema setup']
    );

    await connection.commit();
    console.log('--- Migration Completed Successfully ---');
  } catch (error: any) {
    await connection.rollback();
    console.error(`--- Migration Failed! ---\nError: ${error.message}`);
    process.exit(1);
  } finally {
    connection.release();
    await pool.end();
  }
}

runMigration();
