import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import OwnerProtectedRoute from './components/auth/OwnerProtectedRoute';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import ExplorePage from './pages/ExplorePage';
import VenuePage from './pages/VenuePage';

// Player Pages
import MyBookingsPage from './pages/player/MyBookingsPage';
import BookingPage from './pages/player/BookingPage';

// Owner Pages
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import AddVenuePage from './pages/owner/AddVenuePage';
import EditVenuePage from './pages/owner/EditVenuePage';
import MyVenuesPage from './pages/owner/MyVenuesPage';
import BookingCalendarPage from './pages/owner/BookingCalendarPage';
import ManageSlotsPage from './pages/owner/ManageSlotsPage';

// Admin Pages
import AdminVenueManagementPage from './pages/admin/AdminVenueManagementPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage'; // New import

function App() {
  const location = useLocation();
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
          <Route path="/venue/:venueId" element={<VenuePage />} />
          
          {/* Player-specific routes */}
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          
          {/* Owner Protected Routes */}
          <Route element={<OwnerProtectedRoute />}>
            <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/owner/add-venue" element={<AddVenuePage />} />
            <Route path="/owner/edit-venue/:venueId" element={<EditVenuePage />} />
            <Route path="/owner/my-venues" element={<MyVenuesPage />} />
            <Route path="/owner/calendar" element={<BookingCalendarPage />} />
            <Route path="/owner/manage-slots" element={<ManageSlotsPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/venues" element={<AdminVenueManagementPage />} />
            <Route path="/admin/users" element={<AdminUserManagementPage />} /> {/* New Route */}
          </Route>
        </Routes>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default App;