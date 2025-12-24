import pool from '../lib/db';

async function verifyTables() {
  try {
    const [rows] = await pool.execute("SHOW TABLES");
    console.log('Tables in database:', rows);
    process.exit(0);
  } catch (error) {
    console.error('Error verifying tables:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifyTables();
