
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../db/movies.db');
const ratingsPath = path.resolve(__dirname, '../../db/ratings.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to movies.db:', err.message);
  } else {
    console.log('✅ Connected to movies.db');

    // Attach the ratings.db 
    db.exec(`ATTACH DATABASE '${ratingsPath}' AS ratingsDb`, (err) => {
      if (err) {
        console.error('Failed to attach ratings.db:', err.message);
      } else {
        console.log('✅ Attached ratings.db as ratingsDb');
      }
    });
  }
});

module.exports = db;
