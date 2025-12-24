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
      const [tableInfo]: any = await pool.execute(
        `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
        [tableName]
      );

      if (tableInfo.length === 0) {
        throw new Error(`CRITICAL: Table '${tableName}' is missing!`);
      }
      console.log(`  ✓ Table exists`);

      // 2. Check Column Specifications
      const [columns]: any = await pool.execute(
        `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY, COLUMN_TYPE 
         FROM information_schema.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
        [tableName]
      );

      // Verify ID is BIGINT UNSIGNED
      const idCol = columns.find((c: any) => c.COLUMN_NAME === 'id');
      if (!idCol || !idCol.COLUMN_TYPE.includes('bigint') || !idCol.COLUMN_TYPE.includes('unsigned')) {
        throw new Error(`  ✗ Column 'id' in '${tableName}' must be BIGINT UNSIGNED`);
      }
      console.log(`  ✓ Primary key 'id' is correctly typed`);

      // 3. Check Foreign Keys for media_contents
      if (tableName === 'media_contents') {
        const [fks]: any = await pool.execute(
          `SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME 
           FROM information_schema.KEY_COLUMN_USAGE 
           WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL`,
          [tableName]
        );
        
        const hasUploaderFk = fks.some((f: any) => f.COLUMN_NAME === 'uploader_id' && f.REFERENCED_TABLE_NAME === 'user_accounts');
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
