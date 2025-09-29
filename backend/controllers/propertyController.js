const Property = require('../models/propertyModel');
const db = require('../config/db');
exports.getAllProperties = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM properties");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No properties found" });
    }
    const properties = rows.map(property => {
      let base64Image = null;
      if (property.image) {
        base64Image = Buffer.from(property.image).toString("base64");
      }
      return {
        ...property,
        propertyPicture: base64Image
      };
    });
    res.status(200).json({ properties });
  } catch (error) {
    console.log("Error fetching properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.getPropertyById = async (req, res) => {
  const { propertyId } = req.params;
  try {
    const [property] = await db.query(
      "SELECT * FROM properties WHERE id = ?",
      [propertyId]
    );
    if (property.length === 0) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property[0]);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ message: "Error fetching property details" });
  }
};
exports.getFilteredProperties = async (req, res) => {
  const { city, country, state, type, priceMin, priceMax, startDate, endDate } = req.query;
  if ((startDate && !endDate) || (!startDate && startDate)) {
    return res.status(400).json({ message: 'Both start date and end date are required if filtering by date' });
  }

  const filters = {};
  if (city) filters.city = city;
  if (country) filters.country = country;
  if (state) filters.state = state;
  if (type) filters.type = type;
  if (priceMin) filters.priceMin = priceMin;
  if (priceMax) filters.priceMax = priceMax;
  if (startDate && endDate) {
    filters.startDate = startDate;
    filters.endDate = endDate;
  }

  try {
    const results = await Property.getFiltered(filters);
    res.status(200).json({ properties: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching filtered properties' });
  }
};