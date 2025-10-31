// src/components/layout/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";

function Navbar() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showModal } = useModal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    showModal({
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      confirmText: "Logout",
      confirmStyle: "danger",
      showCancel: true,
      onConfirm: () => {
        logout();
        navigate("/");
        setIsMobileMenuOpen(false);
      },
    });
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsMobileMenuOpen(false);
  };

  const navLinkClasses =
    "relative px-4 py-2 text-sm font-medium text-medium-text transition-all duration-300 rounded-lg hover:text-primary-green hover:bg-light-green-bg/50 group";

  const activeLinkClasses =
    "text-primary-green bg-light-green-bg shadow-sm ring-1 ring-primary-green/20";

  const mobileNavLinkClasses =
    "block px-4 py-3 text-medium-text font-medium transition-all duration-200 rounded-lg hover:text-primary-green hover:bg-light-green-bg/50";

  const getNavLinks = () => {
    if (profile?.role !== "venue_owner" && profile?.role !== "admin") {
      const links = [{ to: "/explore", label: "Explore" }];
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
    if (profile?.role === "venue_owner") {
      return [
        { to: "/owner/dashboard", label: "Dashboard" },
        { to: "/owner/my-venues", label: "My Venues" },
        { to: "/owner/manage-offers", label: "Manage Offers" },
        { to: "/owner/calendar", label: "Bookings" },
        { to: "/owner/manage-slots", label: "Manage Slots" },
      ];
    }
    if (profile?.role === "admin") {
      return [
        { to: "/admin/venues", label: "Manage Venues" },
        { to: "/admin/users", label: "Manage Users" },
        { to: "/admin/bookings", label: "Manage Bookings" },
        { to: "/admin/manage-offers", label: "Manage Offers" },
        { to: "/admin/notify", label: "Notify Players" },
      ];
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
            <span className="font-bold text-xl bg-gradient-to-r from-dark-text to-medium-text bg-clip-text text-transparent group-hover:from-primary-green group-hover:to-primary-green-dark transition-all duration-300 hidden lg:inline">
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
            {/* Desktop Auth - Profile Button Only (No Logout) */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <button
                  onClick={handleProfileClick}
                  aria-label={
                    profile?.username
                      ? `Open profile for ${profile.username}`
                      : "Open profile"
                  }
                  className="w-10 h-10 p-0 rounded-full overflow-hidden transition-all duration-200 hover:scale-105 focus:outline-none"
                >
                  {/* If an avatar URL exists, render it full-bleed; otherwise render the gradient initial */}
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={(profile?.username || "User") + " avatar"}
                      className="w-full h-full object-cover block"
                      onError={(e) => {
                        // hide broken image so fallback initial below (if any) will show
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-green to-primary-green-dark flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {(profile?.username || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </button>
              ) : (
                <>
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
                </>
              )}
            </div>

            {/* Mobile Menu Button - Always shows profile image */}
            <div className="lg:hidden relative">
              {user ? (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="transition-all duration-300"
                  aria-label="Open user menu"
                >
                  {isMobileMenuOpen ? (
                    <svg
                      className="w-8 h-8 text-medium-text"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <div className="w-10 h-10 p-0 rounded-full overflow-hidden transition-all duration-200 hover:scale-105">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={(profile?.username || "User") + " avatar"}
                          className="w-full h-full object-cover block"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-green to-primary-green-dark flex items-center justify-center">
                          <span className="text-white font-semibold text-base">
                            {(profile?.username || "U").charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-medium-text hover:text-primary-green transition-colors duration-300"
                  aria-label="Open main menu"
                >
                  {isMobileMenuOpen ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 py-4 border-t border-border-color-light">
            <div className="space-y-2">
              {/* User info section for logged in users */}
              {user && (
                <div className="px-4 py-3 mb-2 bg-light-green-bg/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-green to-primary-green-dark rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {(profile?.username || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-dark-text">
                        {profile?.username || "User"}
                      </p>
                      <p className="text-xs text-light-text capitalize">
                        {profile?.role?.replace("_", " ") || "Player"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
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

              {/* My Profile Link (for all logged-in users) */}
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

              {/* Auth Actions */}
              <div className="pt-2 mt-2 border-t border-border-color-light/50">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className={`${mobileNavLinkClasses} w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700`}
                  >
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Logout</span>
                    </div>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${mobileNavLinkClasses} ${
                      location.pathname === "/login"
                        ? "text-primary-green bg-light-green-bg/50"
                        : ""
                    }`}
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
