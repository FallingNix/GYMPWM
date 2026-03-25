const sqlite3 = require('sqlite3').verbose();
const path = require('path');


const dbPath = path.resolve(__dirname, 'gym.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Errore nell'aprire il database", err.message);
  } else {
    console.log('Connesso al database SQLite.');
    db.exec('PRAGMA foreign_keys = ON;', (err) => {
      if (err) console.error("Impossibile abilitare le foreign keys:", err.message);
    });
  }
});

module.exports = db;