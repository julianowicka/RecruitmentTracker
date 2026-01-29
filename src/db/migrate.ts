import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';

const sqlite = new Database('sqlite.db');
const db = drizzle(sqlite);

async function runMigrations() {
  console.log('🚀 Running migrations...');
  
  try {
    migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
  
  sqlite.close();
}

runMigrations();

