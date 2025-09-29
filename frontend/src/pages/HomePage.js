import React from "react";
import { Link } from "react-router-dom";
const HomePage = () => {
  return (
    <div className="container text-center mt-5">
      <h1>Welcome to Travel App</h1>
      <p>Join our community of travelers and explore amazing destinations.</p>
      <div>
        <Link to="/signup" className="btn btn-primary mx-2">
          Sign Up | 
        </Link>
        <Link to="/login" className="btn btn-secondary mx-2">
          Login
        </Link>
      </div>
    </div>
  );
};
export default HomePage;