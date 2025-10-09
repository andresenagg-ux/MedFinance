const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');
let initialized = false;

function runQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function runCallback(err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

function getQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

function allQuery(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

async function initializeDatabase() {
  if (initialized) {
    return;
  }

  await runQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);

  initialized = true;
}

async function resetDatabase() {
  if (!initialized) {
    return;
  }

  await runQuery('DELETE FROM users');
  await runQuery('DELETE FROM sqlite_sequence WHERE name = ?', ['users']);
}

async function createUser({ email, name, password }) {
  const result = await runQuery(
    'INSERT INTO users (email, name, password) VALUES (?, ?, ?)',
    [email, name, password]
  );

  return {
    id: result.lastID,
    email,
    name,
    password,
  };
}

async function findUserByEmail(email) {
  return getQuery('SELECT id, email, name, password FROM users WHERE email = ?', [email]);
}

async function listUsers() {
  return allQuery('SELECT id, email, name FROM users ORDER BY id ASC');
}

function closeDatabase() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  initializeDatabase,
  resetDatabase,
  createUser,
  findUserByEmail,
  listUsers,
  closeDatabase,
};
