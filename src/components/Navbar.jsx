import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="nav-links">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-box">PN</div>
            <span className="nav-logo-text">PlayNation</span>
          </Link>
          {profile?.role !== 'venue_owner' && (
            <>
              <Link to="/explore">Explore</Link>
              {user && <Link to="/my-bookings">My Bookings</Link>}
            </>
          )}
          {profile?.role === 'venue_owner' && (
            <>
              <Link to="/owner/dashboard">Dashboard</Link>
              {/* --- REFERENCE UPDATED HERE --- */}
              <Link to="/owner/my-venues">My Venues</Link>
            </>
          )}
        </div>
        <div className="nav-auth-buttons">
            {user ? (
                <>
                <span className="nav-user-greeting">
                    Hi, {profile?.username || 'User'}
                </span>
                <button onClick={handleLogout} className="nav-logout-button">
                    Logout
                </button>
                </>
            ) : (
                <>
                <Link to="/auth" className="btn btn-secondary">Login</Link>
                <Link to="/auth" className="btn btn-primary">Sign up</Link>
                </>
            )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;