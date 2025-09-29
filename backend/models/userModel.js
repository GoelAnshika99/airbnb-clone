const db = require('../config/db');
const bcrypt = require('bcryptjs');
const User = {
  create: async ({ name, email, password, role }) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, email, hashedPassword, role]);
    return result;
  },
  findByEmail: async (email) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows;
  },
  updateProfile: async (userId, phone, aboutMe, gender, language, country, state, city) => {
    const query = `
      UPDATE users 
      SET phone = ?, aboutMe = ?, gender = ?, language = ?, country = ?, state = ?, city = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [phone, aboutMe, gender, language, country, state, city, userId]);
    return result;
  }
};
module.exports = User;