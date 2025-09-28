import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";

function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showModal } = useModal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const isConfirmed = await showModal({
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      confirmText: "Logout",
      confirmStyle: "danger",
    });

    if (isConfirmed) {
      logout();
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsMobileMenuOpen(false); // Close mobile menu if open
  };

  const navLinkClasses =
    "relative px-4 py-2 text-sm font-medium text-medium-text transition-all duration-300 rounded-lg hover:text-primary-green hover:bg-light-green-bg/50 group";
  
  const activeLinkClasses = 
    "text-primary-green bg-light-green-bg shadow-sm ring-1 ring-primary-green/20";

  const mobileNavLinkClasses =
    "block px-4 py-3 text-medium-text font-medium transition-all duration-200 rounded-lg hover:text-primary-green hover:bg-light-green-bg/50";

  const getNavLinks = () => {
    // Links for Players and Guests
    if (profile?.role !== "venue_owner" && profile?.role !== "admin") {
      const links = [
        { to: "/explore", label: "Explore" },
      ];
      
      // Only add About Us and Contact Us if user is NOT logged in
      if (!user) {
        links.push(
          { to: "/about", label: "About Us" },
          { to: "/contact", label: "Contact Us" }
        );
      }
      
      if (user) {
        links.push({ to: "/my-bookings", label: "My Bookings" });
      }
      
      return links;
    }

    // Links for Venue Owners
    if (profile?.role === "venue_owner") {
      const links = [
        { to: "/owner/dashboard", label: "Dashboard" },
        { to: "/owner/my-venues", label: "My Venues" },
        { to: "/owner/manage-offers", label: "Manage Offers" },
        { to: "/owner/calendar", label: "Bookings" },
        { to: "/owner/manage-slots", label: "Manage Slots" },
      ];
      
      // Only add About Us and Contact Us if user is NOT logged in (shouldn't happen for venue owners, but for consistency)
      if (!user) {
        links.push(
          { to: "/about", label: "About Us" },
          { to: "/contact", label: "Contact Us" }
        );
      }
      
      return links;
    }

    // Links for Admins
    if (profile?.role === "admin") {
      const links = [
        { to: "/admin/venues", label: "Manage Venues" },
        { to: "/admin/users", label: "Manage Users" },
        { to: "/admin/bookings", label: "Manage Bookings" },
        { to: "/admin/manage-offers", label: "Manage Offers" },
        { to: "/admin/notify", label: "Notify Players" },
      ];
      
      // Only add About Us and Contact Us if user is NOT logged in (shouldn't happen for admins, but for consistency)
      if (!user) {
        links.push(
          { to: "/about", label: "About Us" },
          { to: "/contact", label: "Contact Us" }
        );
      }
      
      return links;
    }

    return [];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-card-bg/95 backdrop-blur-md border-b border-border-color-light sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 no-underline group transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-primary-green to-primary-green-dark text-white font-bold text-lg h-11 w-11 grid place-content-center rounded-xl shadow-lg group-hover:shadow-primary-green/25 group-hover:scale-105 transition-all duration-300">
              PN
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-dark-text to-medium-text bg-clip-text text-transparent group-hover:from-primary-green group-hover:to-primary-green-dark transition-all duration-300">
              PlayNation
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <div className="flex items-center gap-2 bg-background/60 rounded-xl p-2 border border-border-color-light">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`${navLinkClasses} ${
                    location.pathname === link.to ? activeLinkClasses : ""
                  }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-green rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Clickable Profile Section */}
                <button
                  onClick={handleProfileClick}
                  className="hidden sm:flex items-center gap-3 px-4 py-2 bg-background/60 rounded-xl border border-border-color-light transition-all duration-300 hover:bg-light-green-bg/50 hover:border-primary-green/30 hover:shadow-sm cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {(profile?.username || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-medium text-medium-text text-sm hover:text-primary-green transition-colors duration-300">
                    {profile?.username || "User"}
                  </span>
                </button>
                
                {/* Mobile Profile Button */}
                <button
                  onClick={handleProfileClick}
                  className="sm:hidden w-8 h-8 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-full flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <span className="text-white font-semibold text-sm">
                    {(profile?.username || "U").charAt(0).toUpperCase()}
                  </span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-medium-text bg-background/60 border border-border-color-light rounded-lg transition-all duration-300 hover:text-primary-green hover:border-primary-green/30 hover:bg-light-green-bg/50 hover:shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-medium-text bg-background border border-border-color rounded-lg no-underline transition-all duration-300 hover:text-primary-green hover:border-primary-green/30 hover:bg-light-green-bg/50 hover:shadow-sm hover:-translate-y-0.5"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-green to-primary-green-dark rounded-lg no-underline shadow-lg transition-all duration-300 hover:shadow-primary-green/25 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-medium-text hover:text-primary-green transition-colors duration-300"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-border-color-light">
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${mobileNavLinkClasses} ${
                    location.pathname === link.to
                      ? "text-primary-green bg-light-green-bg/50"
                      : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Profile Link for logged in users */}
              {user && (
                <button
                  onClick={handleProfileClick}
                  className={`${mobileNavLinkClasses} ${
                    location.pathname === "/profile"
                      ? "text-primary-green bg-light-green-bg/50"
                      : ""
                  } w-full text-left`}
                >
                  My Profile
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;