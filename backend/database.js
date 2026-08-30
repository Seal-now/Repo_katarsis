const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "katarsis.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS tutors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    emoji TEXT NOT NULL,
    photo TEXT,
    price TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 5.0,
    sessions INTEGER NOT NULL DEFAULT 0,
    bio TEXT,
    color TEXT DEFAULT '#F4BFC9',
    vibe TEXT,
    style TEXT,
    pace TEXT,
    feedback TEXT,
    goal TEXT,
    tags TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

module.exports = db;
