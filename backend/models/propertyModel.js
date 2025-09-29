const db = require('../config/db');
const Property = {
  // create: async (property) => {
  //   const { name, type, amenities, image, price, bedrooms, bathrooms, maxGuests, city, country, state, availableFrom, availableUntil } = property;
  //   const query = `
  //     INSERT INTO properties (name, type, amenities, image, price, bedrooms, bathrooms, maxGuests, city, country, state, availableFrom, availableUntil)
  //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  //   `;
  //   try {
  //     const [result] = await db.promise().query(query, [name, type, amenities, image, price, bedrooms, bathrooms, maxGuests, city, country, state, availableFrom, availableUntil]);
  //     return result;
  //   } catch (err) {
  //     throw new Error('Error adding property');
  //   }
  // },
  getAll: async () => {
    const query = 'SELECT name, type, amenities, price, bedrooms, bathrooms, maxGuests, city, country, state, availableFrom, availableUntil FROM properties';
    try {
      const [results] = await db.promise().query(query);
      return results;
    } catch (err) {
      console.error(err);
      throw new Error('Error fetching properties' + err.message);
    }
  },
  getFiltered: async (filters) => {
    let query = 'SELECT * FROM properties WHERE 1=1';
    const values = [];
    if (filters.city) {
      query += ' AND city = ?';
      values.push(filters.city);
    }
    if (filters.country) {
      query += ' AND country = ?';
      values.push(filters.country);
    }
    if (filters.state) {
      query += ' AND state = ?';
      values.push(filters.state);
    }
    if (filters.type) {
      query += ' AND type = ?';
      values.push(filters.type);
    }
    if (filters.priceMin) {
      query += ' AND price >= ?';
      values.push(filters.priceMin);
    }
    if (filters.priceMax) {
      query += ' AND price <= ?';
      values.push(filters.priceMax);
    }
    if (filters.startDate && filters.endDate) {
      query += ' AND availableFrom <= ? AND availableUntil >= ?';
      values.push(filters.startDate, filters.endDate);
    }  
    try {
      const [results] = await db.promise().query(query, values);
      return results;
    } catch (err) {
      throw new Error('Error fetching filtered properties');
    }
  }
};
module.exports = Property;