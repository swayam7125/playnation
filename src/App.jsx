import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage'; // Import HomePage
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import ExplorePage from './pages/ExplorePage';
import VenuePage from './pages/VenuePage';
import MyBookingsPage from './pages/MyBookingsPage';
import BookingPage from './pages/BookingPage';
import OwnerProtectedRoute from './components/OwnerProtectedRoute';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AddVenuePage from './pages/AddVenuePage';
import EditVenuePage from './pages/EditVenuePage';
import MyVenuesPage from './pages/MyVenuesPage';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* --- CHANGE THIS LINE --- */}
          <Route path="/" element={<HomePage />} /> 
          
          {/* Other Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/venue/:venueId" element={<VenuePage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          
          {/* Owner Protected Routes */}
          <Route element={<OwnerProtectedRoute />}>
            <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
            <Route path="/owner/add-venue" element={<AddVenuePage />} />
            <Route path="/owner/edit-venue/:venueId" element={<EditVenuePage />} />
            <Route path="/owner/my-venues" element={<MyVenuesPage />} />
          </Route>
        </Routes>
      </main>
    </Router>
  );
}

export default App;
