import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const DashboardPage = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [properties, setProperties] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all?fields=name")
      .then((response) => setCountries(response.data.map((country) => country.name.common)))
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);
  useEffect(() => {
    if (selectedCountry) {
      axios.get(`/api/states/${selectedCountry}`)
        .then((response) => setStates(response.data))
        .catch((error) => console.error("Error fetching states:", error));
    }
  }, [selectedCountry]);
  useEffect(() => {
    if (selectedState) {
      axios.get(`/api/cities/${selectedState}`)
        .then((response) => setCities(response.data))
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [selectedState]);
   useEffect(() => {
    axios
      .get("http://localhost:5000/api/properties")
      .then((response) => setProperties(response.data.properties))
      .catch((error) => console.error("Error fetching properties:", error));
  }, []);
  const handleBook = (propertyId) => {
    navigate(`/booking/${propertyId}`);
  };
  const handleAddToFavorites = (propertyId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found. Please log in.");
    return;
  }
  axios
    .post(
      `http://localhost:5000/api/favorites/${propertyId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      console.log("Added to favorites");
      navigate(`/favorites/${propertyId}`);
    })
    .catch((error) => {
      console.error("Error adding to favorites", error);
      if (error.response) {
        if (error.response.status === 400 && error.response.data.message === "Property already in favorites") {
          alert("This property is already in your favorites.");
        } else {
          alert("Error adding to favorites. Please try again later.");
        }
      }
    });
};
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const handleGoToProfile = () => {
    navigate("/profile/view");
  };
  const handleGoToUpdateProfile = () => {
    navigate("/profile/update");
  };
  const handleGoToFavorites = () => {
    navigate("/favorites");
  };
  const handleGoToHistory = () => {
    navigate("/history");
  };
  return (
    <div className="container">
      <header className="d-flex justify-content-between align-items-center mt-3">
        <nav>
          <button onClick={handleGoToProfile}>View Profile</button>
          <button onClick={handleGoToUpdateProfile}>Update Profile</button>
          <button onClick={handleGoToFavorites}>Favorites</button>
          <button onClick={handleGoToHistory}>History</button>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header>
      <div className="filters mt-4">
        <div className="row">
          <div className="col-md-3">
            <select className="form-control" onChange={(e) => setSelectedCountry(e.target.value)}>
              <option value="">Select Country</option>
              {countries.map((country, idx) => (
                <option key={idx} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-control" onChange={(e) => setSelectedState(e.target.value)} disabled={!selectedCountry}>
              <option value="">Select State</option>
              {states.map((state, idx) => (
                <option key={idx} value={state}>{state}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select className="form-control" onChange={(e) => setSelectedCity(e.target.value)} disabled={!selectedState}>
              <option value="">Select City</option>
              {cities.map((city, idx) => (
                <option key={idx} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
            />
          </div>
        </div>
      </div>
      <div className="properties mt-4">
        {properties.length === 0 ? (
          <p>No properties available.</p>
        ): (
          properties.map((property) => (
            <div className="property-card mb-4" key={property.id}>
              <h5>{property.name}</h5>
              <p>{property.type}</p>
              <div>{property.amenities}</div>
              <img 
              src={`data:image/jpeg;base64,${property.propertyPicture}`}
              alt={property.name} 
              className="img-fluid" 
            />
            <p><strong>Price:</strong> ${property.price} / night</p>
            <p><strong>Bedrooms:</strong> {property.bedrooms}</p>
            <p><strong>Bathrooms:</strong> {property.bathrooms}</p>
            <p><strong>Max Guests:</strong> {property.maxGuests}</p>
             <p><strong>Location:</strong> {property.city}, {property.state}, {property.country}</p>
            <p><strong>Available From:</strong> {property.availableFrom}</p>
            <p><strong>Available Until:</strong> {property.availableUntil}</p>
            <button onClick={() => handleBook(property.id)} className="btn btn-primary">
              Book Now
            </button>
            <button onClick={() => handleAddToFavorites(property.id)} className="btn btn-secondary ml-2">
              Add to Favorites
            </button>
            </div>
          ))
        )}
      </div>
      </div>
  );
};
export default DashboardPage;