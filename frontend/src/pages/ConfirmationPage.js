import React from "react";
import { useNavigate } from "react-router-dom";
const ConfirmationPage = () => {
  const navigate = useNavigate();
  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };
  return (
    <div className="confirmation-page">
      <h1>Booking Created Successfully!!!</h1>
      <p>Your booking has been confirmed. You can now continue browsing other properties.</p>
      <button className="btn btn-primary" onClick={handleGoToDashboard}>
        Go to Dashboard
      </button>
    </div>
  );
};
export default ConfirmationPage;