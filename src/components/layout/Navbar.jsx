import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";

function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showModal } = useModal();

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

  const navLinkClasses =
    "no-underline text-medium-text font-semibold text-sm transition duration-300 relative py-2 after:content-[''] after:absolute after:w-0 after:h-0.5 after:bottom-0 after:left-1/2 after:bg-primary-green after:transition-all after:duration-300 after:-translate-x-1/2 hover:text-primary-green hover:after:w-full";
  const activeLinkClasses = "text-primary-green after:w-full";

  return (
    <nav className="bg-card-bg border-b border-border-color py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-4 no-underline transition duration-300 hover:scale-105"
          >
            <div className="bg-primary-green text-white font-extrabold text-base h-9 w-9 grid place-content-center rounded-lg shadow-md">
              PN
            </div>
            <span className="font-extrabold text-xl text-dark-text">
              PlayNation
            </span>
          </Link>

          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            {/* Links for Players and Guests */}
            {profile?.role !== "venue_owner" && profile?.role !== "admin" && (
              <>
                <Link
                  to="/explore"
                  className={`${navLinkClasses} ${
                    location.pathname === "/explore" ? activeLinkClasses : ""
                  }`}
                >
                  Explore
                </Link>
                {user && (
                  <Link
                    to="/my-bookings"
                    className={`${navLinkClasses} ${
                      location.pathname === "/my-bookings"
                        ? activeLinkClasses
                        : ""
                    }`}
                  >
                    My Bookings
                  </Link>
                )}
                {user && (
                  <Link
                    to="/profile"
                    className={`${navLinkClasses} ${
                      location.pathname === "/profile" ? activeLinkClasses : ""
                    }`}
                  >
                    My Profile
                  </Link>
                )}
              </>
            )}

            {/* Links for Venue Owners */}
            {profile?.role === "venue_owner" && (
              <>
                <Link
                  to="/owner/dashboard"
                  className={`${navLinkClasses} ${
                    location.pathname === "/owner/dashboard"
                      ? activeLinkClasses
                      : ""
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/owner/my-venues"
                  className={`${navLinkClasses} ${
                    location.pathname === "/owner/my-venues"
                      ? activeLinkClasses
                      : ""
                  }`}
                >
                  My Venues
                </Link>
                <Link
                  to="/owner/calendar"
                  className={`${navLinkClasses} ${
                    location.pathname === "/owner/calendar"
                      ? activeLinkClasses
                      : ""
                  }`}
                >
                  Bookings
                </Link>
                <Link
                  to="/owner/manage-slots"
                  className={`${navLinkClasses} ${
                    location.pathname === "/owner/manage-slots"
                      ? activeLinkClasses
                      : ""
                  }`}
                >
                  Manage Slots
                </Link>
                {user && (
                  <Link
                    to="/profile"
                    className={`${navLinkClasses} ${
                      location.pathname === "/profile" ? activeLinkClasses : ""
                    }`}
                  >
                    My Profile
                  </Link>
                )}
              </>
            )}

            {/* Links for Admins: Duplicates removed */}
            {profile?.role === "admin" && (
              <>
                <Link
                  to="/admin/venues" // Corresponds to AdminVenueManagement.jsx
                  className={`${navLinkClasses} ${
                    location.pathname === "/admin/venues"
                      ? activeLinkClasses
                      : ""
                  }`}
                >
                  Manage Venues
                </Link>
                <Link
                  to="/admin/users" // Corresponds to AdminUserManagement.jsx
                  className={`${navLinkClasses} ${
                    location.pathname === "/admin/users"
                      ? activeLinkClasses
                      : ""
                  }`}
                >
                  Manage Users
                </Link>
                <Link
                  to="/admin/bookings" // Corresponds to AdminBooking.jsx
                  className={`${navLinkClasses} ${
                    location.pathname === "/admin/bookings"
                      ? activeLinkClasses
                      : ""
                  }`}
                >
                  Manage Bookings
                </Link>
                <Link
                  to="/admin/notify" // Corresponds to Admin Notify Page
                  className={`${navLinkClasses} ${
                    location.pathname === "/admin/notify"
                      ? activeLinkClasses
                      : ""
                  }`}
                >
                  Notify Players
                </Link>

                {user && (
                  <Link
                    to="/profile"
                    className={`${navLinkClasses} ${
                      location.pathname === "/profile" ? activeLinkClasses : ""
                    }`}
                  >
                    My Profile
                  </Link>
                )}
              </>
            )}
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:inline font-semibold text-medium-text text-sm">
                Hi, {profile?.username || "User"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-transparent border-none font-sans text-sm font-semibold text-medium-text cursor-pointer py-2 px-4 rounded-md transition duration-300 hover:bg-hover-bg hover:text-primary-green"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="py-2 px-5 rounded-lg font-semibold text-sm transition duration-300 no-underline bg-card-bg text-medium-text border border-border-color shadow-sm hover:bg-hover-bg hover:border-primary-green hover:text-primary-green hover:-translate-y-px hover:shadow-md"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="py-2 px-5 rounded-lg font-semibold text-sm transition duration-300 no-underline bg-primary-green text-white shadow-sm hover:bg-primary-green-dark hover:-translate-y-px hover:shadow-md"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;