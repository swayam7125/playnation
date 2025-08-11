import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function OwnerProtectedRoute() {
  const { user, profile, loading } = useAuth();

  // Wait until the initial loading is done
  if (loading) {
    return <p className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading...</p>;
  }

  // If the user is logged in AND their role is 'venue_owner', show the page.
  // Otherwise, redirect them to the homepage.
  if (user && profile?.role === 'venue_owner') {
    return <Outlet />; // Renders the child route element
  } else {
    return <Navigate to="/" />;
  }
}

export default OwnerProtectedRoute;