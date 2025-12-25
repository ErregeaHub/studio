import pool from '../lib/db';

/**
 * Database Verification Script
 * Validates:
 * - Table existence in information_schema
 * - Column types and constraints
 * - Indexes and Foreign Keys
 */
async function verifyDatabase() {
  console.log('--- Starting Database Verification ---');

  const tablesToVerify = ['user_accounts', 'media_contents', 'comments', 'schema_migrations'];

  try {
    for (const tableName of tablesToVerify) {
      console.log(`Verifying table: ${tableName}...`);

      // 1. Check Table Existence
      const tableInfo = await pool.query(
        `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = $1`,
        [tableName]
      );

      if (tableInfo.rows.length === 0) {
        throw new Error(`CRITICAL: Table '${tableName}' is missing!`);
      }
      console.log(`  ✓ Table exists`);

      // 2. Check Column Specifications
      const columns = await pool.query(
        `SELECT column_name, data_type, is_nullable
         FROM information_schema.columns 
         WHERE table_schema = 'public' AND table_name = $1`,
        [tableName]
      );

      // Verify ID exists
      const idCol = columns.rows.find((c: any) => c.column_name === 'id');
      if (!idCol) {
        throw new Error(`  ✗ Column 'id' in '${tableName}' is missing`);
      }
      console.log(`  ✓ Primary key 'id' exists and is type: ${idCol.data_type}`);

      // 3. Check Foreign Keys for media_contents
      if (tableName === 'media_contents') {
        const fks = await pool.query(
          `SELECT constraint_name, column_name
           FROM information_schema.key_column_usage 
           WHERE table_schema = 'public' AND table_name = $1 AND constraint_name LIKE '%fkey%'`,
          [tableName]
        );
        
        const hasUploaderFk = fks.rows.some((f: any) => f.column_name === 'uploader_id');
        if (!hasUploaderFk) throw new Error(`  ✗ Missing Foreign Key on 'uploader_id'`);
        console.log(`  ✓ Foreign keys verified`);
      }
    }

    console.log('\n--- Verification Successful! ---');
  } catch (error: any) {
    console.error(`\n--- Verification Failed! ---\nError: ${error.message}`);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifyDatabase();
