const db = require('../config/db');
exports.bookProperty = async (req, res) => {
  const { propertyId } = req.params;
  const { startDate, endDate, numberOfGuests } = req.body;
  const travelerId = req.user.id;
  try {
    const [property] = await db.query('SELECT * FROM properties WHERE id = ?', [propertyId]);
    console.log(property);
    if (property.length === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    const { price, maxGuests } = property[0];
    const pricePerNight = parseFloat(price);
    console.log('Price per night: ', pricePerNight);
    if (numberOfGuests > maxGuests) {
      return res.status(400).json({ message: `Number of guests cannot exceed ${maxGuests}` });
    }
    console.log('Start Date:', startDate, 'End Date:', endDate);
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: 'Start date should be before end date' });
    }
    if (new Date(startDate) < new Date()) {
      return res.status(400).json({ message: 'Booking cannot be in the past' });
    }
    const diffInTime = new Date(endDate) - new Date(startDate);
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    console.log('Days Difference:', diffInDays);
    const totalPrice = diffInDays * pricePerNight;
    const [result] = await db.query('INSERT INTO bookings (travelerId, propertyId, startDate, endDate, pricePerNight, totalPrice, numberOfGuests) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      travelerId,
      propertyId,
      startDate,
      endDate,
      pricePerNight,
      totalPrice,
      numberOfGuests,
    ]);
    res.status(200).json({ message: 'Booking created successfully', bookingId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error booking property' });
  }
};
exports.getBookingHistory = async (req, res) => {
  const travelerId = req.user.id;
  try {
    const [bookings] = await db.query(`
      SELECT b.id AS bookingId, p.name AS propertyName, b.startDate, b.endDate, 
             b.pricePerNight, b.totalPrice, b.numberOfGuests, b.status 
      FROM bookings b
      JOIN properties p ON b.propertyId = p.id
      WHERE b.travelerId = ?
      ORDER BY b.startDate DESC
    `, [travelerId]);
    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found' });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching booking history' });
  }
};