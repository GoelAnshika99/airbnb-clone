import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
const BookingPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [pricePerNight, setPricePerNight] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/properties/${propertyId}`)
      .then((response) => {
        setPricePerNight(parseFloat(response.data.price));
      })
      .catch((err) => {
        console.error("Error fetching property:", err);
        setError("Failed to load property details.");
      });
  }, [propertyId]);
  useEffect(() => {
    if (!startDate || !endDate || !guests) {
      setError("All fields are required.");
      setTotalPrice(0);
      return;
    }   
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) {
      setError("Start date should be before end date");
      setTotalPrice(0);
      return;
    }
    if (start < new Date()) {
      setError("Start date cannot be in the past");
      setTotalPrice(0);
      return;
    }
    const diffInTime = end - start;
    const diffInDays = diffInTime / (1000 * 3600 * 24);
    if (diffInDays <= 0) {
      setError("Invalid date range");
      setTotalPrice(0);
      return;
    }
    if (guests <= 0) {
      setError("Number of guests must be at least 1.");
      setTotalPrice(0);
      return;
    }
    setError("");
    setTotalPrice(diffInDays * pricePerNight * guests);
  }, [startDate, endDate, guests, pricePerNight]);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        `http://localhost:5000/api/bookings/${propertyId}`,
        { startDate, endDate, numberOfGuests: guests },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then((response) => {
        // alert("Booking created successfully!");
        navigate("/confirmation");
      })
      .catch((err) => {
        console.error("Error creating booking:", err);
        setError(`Error creating booking. Please try again.`);
      });
  };
  return (
    <div className="booking-page">
      {error && <div className="alert alert-danger">{error}</div>}
      <h1>Book this Property</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Start Date:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>End Date:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)} // Only update endDate
            required
          />
        </div>
        <div className="form-group">
          <label>Number of Guests:</label>
          <input
            type="number"
            className="form-control"
            value={guests}
            onChange={(e) => setGuests(e.target.value)} // Only update guests
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <label>Price per Night: ${pricePerNight}</label>
        </div>
        <div className="form-group">
          <label>Total Price: ${totalPrice.toFixed(2)}</label>
        </div>
        <button type="submit" className="btn btn-primary">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingPage;
