import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const AdminProtectedRoute = () => {
    // Reads state directly from AuthContext
    const { user, profile, loading } = useAuth(); 

    if (loading) {
        // Waits for AuthContext to finish initial check
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg">Loading Auth...</p>
            </div>
        );
    }

    // Grants access only if user is logged in AND their role is 'admin'
    if (user && profile?.role === 'admin') {
        return <Outlet />;
    } else {
        // Redirects all unauthorized users
        return <Navigate to="/" replace />;
    }
};

export default AdminProtectedRoute;