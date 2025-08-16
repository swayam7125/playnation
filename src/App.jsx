import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import OwnerProtectedRoute from './components/auth/OwnerProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
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

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/auth" element={<AuthPage />} />
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
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;