const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./timesheet.sqlite');

const init = () => {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      projectId INTEGER,
      date TEXT NOT NULL,
      startTime TEXT NOT NULL,
      endTime TEXT NOT NULL,
      totalHours REAL NOT NULL,
      description TEXT,
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(projectId) REFERENCES projects(id)
    )`);
    db.get(`SELECT COUNT(*) as c FROM users`, (err, row) => {
      if (row && row.c === 0) {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        bcrypt.hash('password', saltRounds, (err, hash) => {
          db.run(`INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)`, ['Admin Demo','demo@example.com',hash,'admin']);
          console.log('User seeded: demo@example.com (password: password)');
        });
      }
    });
    db.get(`SELECT COUNT(*) as c FROM projects`, (err, row) => {
      if (row && row.c === 0) {
        db.run(`INSERT INTO projects (name) VALUES (?), (?), (?)`, ['Proyecto A','Proyecto B','Proyecto C']);
        console.log('Seeded sample projects.');
      }
    });
  });
};
module.exports = { db, init };