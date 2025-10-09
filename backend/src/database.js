import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPromise = open({
  filename: path.join(__dirname, '../data/consents.db'),
  driver: sqlite3.Database
}).then(async (db) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Consentimentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      consentido INTEGER NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  return db;
});

export const getDb = () => dbPromise;
