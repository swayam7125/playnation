import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">PLAY NATION</Link>
        <nav className="nav-links">
          <Link to="/venues" className="nav-link">Venues</Link>
          <Link to="/games" className="nav-link">Games</Link>
          <Link to="/my-bookings" className="nav-link">My Bookings</Link>
        </nav>
      </div>
      <Link to="/login" className="login-btn">Login</Link>
    </header>
  );
};
