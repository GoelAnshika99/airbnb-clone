import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProfileUpdatePage from './pages/ProfileUpdatePage';
import ProfileViewPage from './pages/ProfileViewPage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import FavoritesPage from './pages/FavoritesPage';
import logo from './logo.svg';
import './App.css';
function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}
function MainLayout() {
  const location = useLocation();
  return (
    <div className="App">
      {location.pathname === '/' && (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Welcome to the Airbnb Clone</p>
          <Link to="/home">
            <button className="start-button">Start</button>
          </Link>
        </header>
      )}
      <div className="App-content">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile/view" element={<ProfileViewPage />} />
          <Route path="/profile/update" element={<ProfileUpdatePage />} />
          <Route path="/booking/:propertyId" element={<BookingPage />} />
          <Route path="/confirmation" element={<ConfirmationPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/" element={<div />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;