import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ProfilePage = () => {
  const [user, setUser] = useState({});
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profile/view", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = response.data;
        setUser(userData);
        if (userData.profilePicture) {
          const dataUrl = `data:image/jpeg;base64,${userData.profilePicture}`;
          setProfileImagePreview(dataUrl);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);
   const userName = user.name;
   const handleBackToDashboard = () => {
    navigate("/dashboard");
  };
  return (
    <div className="container">
      <h2 className="mt-5">{userName}'s Profile</h2>
      <div className="mb-3">
        {profileImagePreview && (
          <img
            src={profileImagePreview}
            alt="Profile"
            style={{ width: "150px", height: "150px", objectFit: "cover", marginBottom: "10px", borderRadius: "8px" }}
          />
        )}
      </div>
      <div>
        <p><strong>Phone Number:</strong> {user.phone}</p>
        <p><strong>About Me:</strong> {user.aboutMe}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Language:</strong> {user.language}</p>
        <p><strong>Country:</strong> {user.country}</p>
        <p><strong>State:</strong> {user.state}</p>
        <p><strong>City:</strong> {user.city}</p>
      </div>
      <div className="mt-4">
        <button
          className="btn btn-secondary"
          onClick={handleBackToDashboard}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
export default ProfilePage;