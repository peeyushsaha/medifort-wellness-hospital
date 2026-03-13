const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '..', '..', 'medifort.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db = null;
let dbReady = null;

/**
 * Initialize the database. Returns a promise that resolves to the db instance.
 * sql.js uses an in-memory SQLite that we periodically persist to disk.
 */
async function initDb() {
  if (db) return db;

  const SQL = await initSqlJs();

  // Load existing database file if it exists
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Run schema
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.run(schema);

  // Save to disk
  saveDb();

  return db;
}

/**
 * Get the database instance (must be initialized first).
 */
function getDb() {
  if (!db) throw new Error('Database not initialized. Call initDb() first.');
  return db;
}

/**
 * Get or wait for the database to be ready.
 */
async function getDbAsync() {
  if (!dbReady) {
    dbReady = initDb();
  }
  return dbReady;
}

/**
 * Save database to disk.
 */
function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

/**
 * Helper: run a statement and return changes info.
 */
function run(sql, params = []) {
  const d = getDb();
  d.run(sql, params);
  const lastId = d.exec("SELECT last_insert_rowid() as id")[0]?.values[0]?.[0] || 0;
  saveDb();
  return { lastInsertRowid: lastId, changes: d.getRowsModified() };
}

/**
 * Helper: get one row.
 */
function get(sql, params = []) {
  const d = getDb();
  const stmt = d.prepare(sql);
  stmt.bind(params);
  let result = null;
  if (stmt.step()) {
    const cols = stmt.getColumnNames();
    const vals = stmt.get();
    result = {};
    cols.forEach((col, i) => result[col] = vals[i]);
  }
  stmt.free();
  return result;
}

/**
 * Helper: get all rows.
 */
function all(sql, params = []) {
  const d = getDb();
  const stmt = d.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    const cols = stmt.getColumnNames();
    const vals = stmt.get();
    const row = {};
    cols.forEach((col, i) => row[col] = vals[i]);
    results.push(row);
  }
  stmt.free();
  return results;
}

module.exports = { initDb, getDb, getDbAsync, saveDb, run, get, all };
