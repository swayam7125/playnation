import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from './supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user;
        setUser(currentUser ?? null);

        if (currentUser) {
          const { data: userProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', currentUser.id)
            .single();
          
          if (error) {
            console.error("Error fetching user profile:", error);
          } else {
            setProfile(userProfile);
          }
        }
      } catch (error) {
        console.error("Error in auth useEffect:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session.user);
          fetchUserData();
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    loading,      // <-- Added loading state to context
    setProfile,   // <-- Added setProfile function to context
    logout: async () => {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}