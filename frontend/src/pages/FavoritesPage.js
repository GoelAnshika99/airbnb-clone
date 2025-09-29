import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
const FavoritesPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/properties/${propertyId}`)
      .then((response) => {
        setProperty(response.data);
      })
      .catch((err) => {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details.");
      });
  }, [propertyId]);
  const handleUnfavorite = () => {
    axios
      .delete(`http://localhost:5000/api/favorites/${propertyId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then(() => {
        navigate('/dashboard');
      })
      .catch((err) => {
        console.error("Error removing from favorites:", err);
        setError("Failed to remove property from favorites.");
      });
  };
  return (
    <div className="favorites-page">
      {error && <div className="alert alert-danger">{error}</div>}
      {property ? (
        <div>
          <h1>{property.name}</h1>
          <p>{property.type}</p>
          <p>{property.amenities}</p>
          <p>{property.city}, {property.state}, {property.country}</p>
          <p>Price: ${property.price}</p>
          <button className="btn btn-danger" onClick={handleUnfavorite}>
            Unfavorite
          </button>
        </div>
      ) : (
        <p>Loading property details...</p>
      )}
    </div>
  );
};
export default FavoritesPage;
