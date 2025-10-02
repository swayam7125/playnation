import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar.jsx';
import OwnerProtectedRoute from './components/auth/OwnerProtectedRoute.jsx';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute.jsx';
import Footer from './components/layout/Footer.jsx';

// Public Pages
import HomePage from './pages/HomePage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import VenuePage from './pages/VenuePage.jsx';
import AboutUsPage from './pages/AboutUsPage.jsx';
import ContactUsPage from './pages/ContactUsPage.jsx'; 

// Player Pages
import MyBookingsPage from './pages/player/MyBookingsPage.jsx';
import BookingPage from './pages/player/BookingPage.jsx';
import ProfilePage from './pages/player/ProfilePage.jsx';

// Owner Pages
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage.jsx';
import AddVenuePage from './pages/owner/AddVenuePage.jsx';
import AddFacilitiesPage from './pages/owner/AddFacilitiesPage.jsx'; 
import EditVenuePage from './pages/owner/EditVenuePage.jsx';
import MyVenuesPage from './pages/owner/MyVenuesPage.jsx';
import BookingCalendarPage from './pages/owner/BookingCalendarPage.jsx';
import ManageSlotsPage from './pages/owner/ManageSlotsPage.jsx';
import ManageOffersPage from './pages/owner/ManageOffersPage.jsx';

// Admin Pages
import AdminVenueManagementPage from './pages/admin/AdminVenueManagementPage.jsx';
import AdminBookingsPage from './pages/admin/AdminBookingsPage.jsx';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage.jsx';
import AdminNotifyPage from './pages/admin/AdminNotifyPage.jsx';
import AdminManageOffersPage from './pages/admin/AdminManageOffersPage.jsx';

function App() {
  const location = useLocation();
  const hideFooter =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/venues/:venueId" element={<VenuePage />} />

          {/* Player-specific routes */}
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Owner Protected Routes */}
          <Route element={<OwnerProtectedRoute />}>
            <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/owner/add-venue" element={<AddVenuePage />} />
            <Route path="/owner/add-facilities" element={<AddFacilitiesPage />} />
            <Route
              path="/owner/edit-venue/:venueId"
              element={<EditVenuePage />}
            />
            <Route path="/owner/my-venues" element={<MyVenuesPage />} />
            <Route path="/owner/manage-offers" element={<ManageOffersPage />} />
            <Route path="/owner/calendar" element={<BookingCalendarPage />} />
            <Route path="/owner/manage-slots" element={<ManageSlotsPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route
              path="/admin/venues"
              element={<AdminVenueManagementPage />}
            />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/admin/users" element={<AdminUserManagementPage />} />
            <Route
              path="/admin/manage-offers"
              element={<AdminManageOffersPage />}
            />
            <Route path="/admin/notify" element={<AdminNotifyPage />} />
          </Route>
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;