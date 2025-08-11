import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // This function will now return the fetched profile
  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser ?? null);

      if (currentUser) {
        const { data: userProfile } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', currentUser.id)
          .single();
        setProfile(userProfile);
        return userProfile; // <-- Return the profile
      }
      return null; // <-- Return null if no user
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null; // <-- Return null on error
    } finally {
      if (loading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const value = {
    user,
    profile,
    updateUser: fetchUserData,
    logout: async () => {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}