import fs from 'node:fs';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import Database from 'better-sqlite3';
import { SERVER_CONFIG } from '../../server/lib/config';

const databasePath = SERVER_CONFIG.DATABASE_URL;
const databaseDirectory = path.dirname(databasePath);

if (databasePath !== ':memory:' && databaseDirectory !== '.') {
  fs.mkdirSync(databaseDirectory, { recursive: true });
}

const sqlite = new Database(databasePath);
const db = drizzle(sqlite);

async function runMigrations() {
  console.log('Running migrations...');
  
  try {
    migrate(db, { migrationsFolder: './drizzle' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
  
  sqlite.close();
}

runMigrations();

