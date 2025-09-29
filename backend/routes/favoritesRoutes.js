const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../config/db');
const router = express.Router();
router.post('/:propertyId', authMiddleware, async (req, res) => {
  const travelerId = req.user.id;
  const { propertyId } = req.params;
  try {
    const [existingFavorite] = await db.query(
      'SELECT * FROM favorites WHERE travelerId = ? AND propertyId = ?',
      [travelerId, propertyId]
    );
    if (existingFavorite.length > 0) {
      return res.status(400).json({ message: 'Property already in favorites' });
    }
    await db.query(
      'INSERT INTO favorites (travelerId, propertyId) VALUES (?, ?)',
      [travelerId, propertyId]
    );
    res.status(200).json({ message: 'Property added to favorites' });
  } catch (error) {
    console.error("Error adding to favorites:", error);
    res.status(500).json({ message: 'Error adding to favorites' });
  }
});
router.delete('/:propertyId', authMiddleware, async (req, res) => {
  const travelerId = req.user.id;
  const { propertyId } = req.params;
  try {
    const [result] = await db.query(
      'DELETE FROM favorites WHERE travelerId = ? AND propertyId = ?',
      [travelerId, propertyId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Property not found in favorites' });
    }
    res.status(200).json({ message: 'Property removed from favorites' });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    res.status(500).json({ message: 'Error removing from favorites' });
  }
});
router.get('/', authMiddleware, async (req, res) => {
  const travelerId = req.user.id;

  try {
    const [favorites] = await db.query(
      'SELECT properties.id, properties.name, properties.price, properties.city, properties.state, properties.country FROM properties INNER JOIN favorites ON properties.id = favorites.propertyId WHERE favorites.travelerId = ?',
      [travelerId]
    );
    if (favorites.length === 0) {
      return res.status(404).json({ message: 'No favorites found' });
    }
    res.status(200).json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});
router.get('/:propertyId', authMiddleware, async (req, res) => {
  const travelerId = req.user.id;
  const { propertyId } = req.params;
  try {
    const [favorite] = await db.query(
      'SELECT * FROM favorites WHERE travelerId = ? AND propertyId = ?',
      [travelerId, propertyId]
    );
    if (favorite.length === 0) {
      return res.status(404).json({ message: 'Property not found in favorites' });
    }
    const [property] = await db.query('SELECT * FROM properties WHERE id = ?', [propertyId]);
    res.status(200).json(property[0]);
  } catch (error) {
    console.error("Error fetching favorite property:", error);
    res.status(500).json({ message: 'Error fetching favorite property' });
  }
});
module.exports = router;