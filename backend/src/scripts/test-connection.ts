import 'dotenv/config';
import { pool } from '../config/db';

async function main(): Promise<void> {
  try {
    const info = await pool.query<{
      one: number;
      db: string;
      usr: string;
      ver: string;
    }>(`SELECT 1 AS one,
               current_database() AS db,
               current_user       AS usr,
               version()          AS ver`);

    const row = info.rows[0];
    console.log('\n✅ Connection successful');
    console.log(`   database : ${row?.db}`);
    console.log(`   user     : ${row?.usr}`);
    console.log(`   version  : ${row?.ver?.split(' ').slice(0, 2).join(' ')}`);

    const canWrite = await pool.query<{ exists: boolean }>(
      `SELECT has_schema_privilege(current_user, 'public', 'CREATE') AS exists`
    );
    console.log(`   can CREATE in public: ${canWrite.rows[0]?.exists}`);
  } catch (err) {
    console.error('\n❌ Connection failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

main();
