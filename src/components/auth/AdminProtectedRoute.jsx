import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Corrected path

const AdminProtectedRoute = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { data: profile, error } = await supabase
                        .from('users')
                        .select('role')
                        .eq('user_id', user.id)
                        .single();

                    if (error) {
                        throw error;
                    }
                    
                    if (profile && profile.role === 'admin') {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false);
                    }
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error('Error checking admin role:', error);
                setIsAdmin(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkUserRole();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg">Loading Venues...</p>
            </div>
        );
    }

    return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminProtectedRoute;