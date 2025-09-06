import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Reusable classes for the main navigation links to keep the JSX clean
  const navLinkClasses = "no-underline text-medium-text font-semibold text-sm transition duration-300 relative py-2 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-1/2 after:bg-primary-green after:transition-all after:duration-300 after:-translate-x-1/2 hover:text-primary-green hover:after:w-full";

  return (
    <nav className="bg-card-bg border-b border-border-color py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-4 no-underline transition duration-300 hover:scale-105">
            <div className="bg-primary-green text-white font-extrabold text-base h-9 w-9 grid place-content-center rounded-lg shadow-md">
              PN
            </div>
            <span className="font-extrabold text-xl text-dark-text">PlayNation</span>
          </Link>

          {/* Main Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-10">
            {/* Links for Players and Guests */}
            {profile?.role !== 'venue_owner' && profile?.role !== 'admin' && (
              <>
                <Link to="/explore" className={navLinkClasses}>Explore</Link>
                {user && <Link to="/my-bookings" className={navLinkClasses}>My Bookings</Link>}
              </>
            )}

            {/* Links for Venue Owners */}
            {profile?.role === 'venue_owner' && (
              <>
                <Link to="/owner/dashboard" className={navLinkClasses}>Dashboard</Link>
                <Link to="/owner/my-venues" className={navLinkClasses}>My Venues</Link>
                <Link to="/owner/calendar" className={navLinkClasses}>Bookings</Link>
                <Link to="/owner/manage-slots" className={navLinkClasses}>Manage Slots</Link>
              </>
            )}

            {/* Links for Admins */}
            {profile?.role === 'admin' && (
              <>
                <Link to="/admin/venues" className={navLinkClasses}>Manage Venues</Link>
              </>
            )}
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:inline font-semibold text-medium-text text-sm">
                Hi, {profile?.username || 'User'}
              </span>
              <button onClick={handleLogout} className="bg-transparent border-none font-sans text-sm font-semibold text-medium-text cursor-pointer py-2 px-4 rounded-md transition duration-300 hover:bg-hover-bg hover:text-primary-green">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="py-2 px-5 rounded-lg font-semibold text-sm transition duration-300 no-underline bg-card-bg text-medium-text border border-border-color shadow-sm hover:bg-hover-bg hover:border-primary-green hover:text-primary-green hover:-translate-y-px hover:shadow-md">Login</Link>
              <Link to="/signup" className="py-2 px-5 rounded-lg font-semibold text-sm transition duration-300 no-underline bg-primary-green text-white shadow-sm hover:bg-primary-green-dark hover:-translate-y-px hover:shadow-md">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;