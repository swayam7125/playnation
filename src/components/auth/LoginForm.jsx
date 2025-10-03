// src/components/auth/LoginForm.jsx

import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { FaGoogle, FaFacebook } from "react-icons/fa";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from || null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      const user = authData.user;
      if (user) {
        const { data: userRole, error: roleError } = await supabase.rpc(
          "get_user_role"
        );

        if (roleError) {
          console.error("Error fetching user role:", roleError);
          throw new Error("Could not fetch user role.");
        }

        await updateUser();

      if (userRole === "owner") {
          navigate("/owner/dashboard");
        } else if (userRole === "admin") {
          navigate("/admin/venues");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error during login process:", error);
      setError(
        error.message ||
          "Failed to log in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full py-2 px-3 bg-background border-2 border-border-color rounded-lg text-sm text-dark-text transition duration-300 focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20"; // Smaller padding
  const labelStyles = "font-semibold text-xs text-dark-text mb-1 block"; // Smaller font and margin

  return (
    <div className="space-y-4">
      <form onSubmit={handleLogin} className="space-y-3">
        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded-md text-center text-xs border border-red-200"> {/* Smaller padding */}
            {error}
          </p>
        )}
        <div>
          <label htmlFor="email" className={labelStyles}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputStyles}
          />
        </div>
        <div>
          <label htmlFor="password" className={labelStyles}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputStyles}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary-green text-white py-2.5 rounded-lg text-sm font-bold transition duration-300 hover:bg-primary-green-dark hover:-translate-y-0.5 transform disabled:opacity-50 disabled:transform-none shadow-md hover:shadow-primary-green/30" // Smaller padding and font
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border-color"></div>
        </div>
        <div className="relative flex justify-center text-xs"> {/* Smaller text */}
          <span className="bg-card-bg px-2 text-medium-text">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border-2 border-border-color rounded-lg hover:bg-hover-bg transition duration-300">
          <FaGoogle className="text-red-500" />
          <span className="font-semibold text-xs text-dark-text">Google</span>
        </button>
        <button className="flex items-center justify-center gap-2 w-full py-2 px-4 border-2 border-border-color rounded-lg hover:bg-hover-bg transition duration-300">
          <FaFacebook className="text-blue-600" />
          <span className="font-semibold text-xs text-dark-text">Facebook</span>
        </button>
      </div>
    </div>
  );
}

export default LoginForm;