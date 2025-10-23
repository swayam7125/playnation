// src/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Initial state is TRUE

  const updateUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const currentUser = session?.user;
      setUser(currentUser ?? null);

      if (currentUser) {
        const { data: userProfile, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", currentUser.id)
          .single();

        if (error) throw error;

        setProfile(userProfile);
        return userProfile;
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    return null;
  };

  useEffect(() => {
    // Initial Load: Check session and user profile immediately.
    updateUser().finally(() => setLoading(false));

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          // --- THIS IS THE FIX ---
          // We set the user and update the profile in the background.
          // We DO NOT set loading to true, as this unmounts the app
          // and loses the navigation state from the login form.
          setUser(session.user);
          updateUser();
          // --- END OF FIX ---
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
          setLoading(false);
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
    loading,
    updateUser,
    logout: async () => {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex justify-center items-center h-screen w-screen bg-background">
          <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
