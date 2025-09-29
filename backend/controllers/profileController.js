const db = require('../config/db');
exports.updateProfile = async (req, res) => {
  const { phone, aboutMe, gender, language, country, state, city } = req.body;
  const userId = req.user?.id;
  console.log("Incoming profile update request:");
  console.log("User ID:", userId);
  console.log("Body:", req.body);
  console.log("File:", req.file);
  if (!userId) {
    return res.status(400).json({ message: "User not authenticated" });
  }
  const profilePicture = req.file ? req.file.buffer : null;
  try {
    let query, params;

    if (profilePicture) {
      query = `
        UPDATE users 
        SET phone = ?, aboutMe = ?, gender = ?, language = ?, country = ?, state = ?, city = ?, profilePicture = ?
        WHERE id = ?
      `;
      params = [phone, aboutMe, gender, language, country, state, city, profilePicture, userId];
    } else {
      query = `
        UPDATE users 
        SET phone = ?, aboutMe = ?, gender = ?, language = ?, country = ?, state = ?, city = ?
        WHERE id = ?
      `;
      params = [phone, aboutMe, gender, language, country, state, city, userId];
    }
    const [results] = await db.execute(query, params);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or no changes were made" });
    }
    res.status(200).json({
      message: "Profile updated successfully",
      user: { phone, aboutMe, gender, language, country, state, city }
    })
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Profile update failed", error: error.message });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("req.user:", req.user);
    const [rows] = await db.execute("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    let base64Image = null;
    if (user.profilePicture) {
      base64Image = Buffer.from(user.profilePicture).toString("base64");
    }

    res.status(200).json({
      ...user,
      profilePicture: base64Image,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};