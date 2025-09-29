const mysql = require('mysql2/promise');
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'booking_system_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
db.getConnection()
  .then(() => console.log('Connected to the database'))
  .catch((err) => console.error('Database connection failed:', err));
module.exports = db;
