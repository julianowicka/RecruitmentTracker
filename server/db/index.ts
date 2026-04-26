import fs from 'node:fs';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { SERVER_CONFIG } from '../lib/config';

const databasePath = SERVER_CONFIG.DATABASE_URL;
const databaseDirectory = path.dirname(databasePath);

if (databasePath !== ':memory:' && databaseDirectory !== '.') {
  fs.mkdirSync(databaseDirectory, { recursive: true });
}

const sqlite = new Database(databasePath);
export const db = drizzle(sqlite, { schema });

sqlite.pragma('foreign_keys = ON');
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('busy_timeout = 5000');

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'applied',
    link TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    tags TEXT,
    rating INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    category TEXT NOT NULL DEFAULT 'general',
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS status_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL,
    from_status TEXT,
    to_status TEXT NOT NULL,
    changed_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
  );
`);

sqlite.exec(`
  CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users(email);
`);

function hasColumn(tableName: string, columnName: string): boolean {
  const columns = sqlite.prepare(`PRAGMA table_info(${tableName})`).all() as Array<{ name: string }>;
  return columns.some((column) => column.name === columnName);
}

if (!hasColumn('applications', 'tags')) {
  sqlite.exec('ALTER TABLE applications ADD COLUMN tags TEXT;');
}

if (!hasColumn('applications', 'rating')) {
  sqlite.exec('ALTER TABLE applications ADD COLUMN rating INTEGER;');
}

if (!hasColumn('applications', 'user_id')) {
  sqlite.exec('ALTER TABLE applications ADD COLUMN user_id INTEGER;');
}

if (!hasColumn('notes', 'category')) {
  sqlite.exec("ALTER TABLE notes ADD COLUMN category TEXT NOT NULL DEFAULT 'general';");
}

console.log('Database initialized');
