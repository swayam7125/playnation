// src/components/auth/RegisterForm.jsx

import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";

function RegisterForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    role: "player",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from || null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // ... (rest of the logic is the same)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            username: formData.username,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            role: formData.role,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user)
        throw new Error("Registration failed, please try again.");

      const userProfile = await updateUser();

      if (userProfile && userProfile.role === "venue_owner") {
        navigate("/owner/dashboard");
      } else if (from) {
        navigate(from.pathname, { state: from.state, replace: true });
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full py-2 px-3 bg-background border-2 border-border-color rounded-lg text-sm text-dark-text transition duration-300 focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20"; // Smaller padding
  const labelStyles = "font-semibold text-xs text-dark-text mb-1 block"; // Smaller font and margin

  return (
    <form onSubmit={handleRegister} className="space-y-3"> {/* Reduced spacing */}
      {error && (
        <p className="bg-red-100 text-red-700 p-2 rounded-md text-center text-xs border border-red-200 col-span-2"> {/* Smaller padding */}
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2"> {/* Reduced gaps */}
        <div>
          <label htmlFor="first_name" className={labelStyles}>
            First Name
          </label>
          <input
            id="first_name"
            name="first_name"
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            required
            className={inputStyles}
            placeholder="John"
          />
        </div>
        <div>
          <label htmlFor="last_name" className={labelStyles}>
            Last Name
          </label>
          <input
            id="last_name"
            name="last_name"
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            required
            className={inputStyles}
            placeholder="Doe"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="username" className={labelStyles}>
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            className={inputStyles}
            placeholder="johndoe"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="email" className={labelStyles}>
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputStyles}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className={labelStyles}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength="6"
            value={formData.password}
            onChange={handleChange}
            required
            className={inputStyles}
            placeholder="Min. 6 characters"
          />
        </div>
        <div>
          <label htmlFor="confirm_password" className={labelStyles}>
            Confirm Password
          </label>
          <input
            id="confirm_password"
            name="confirm_password"
            type="password"
            minLength="6"
            value={formData.confirm_password}
            onChange={handleChange}
            required
            className={inputStyles}
            placeholder="Re-enter password"
          />
        </div>
         <div className="md:col-span-2">
          <label htmlFor="role" className={labelStyles}>
            I am a...
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={inputStyles}
          >
            <option value="player">Player</option>
            <option value="venue_owner">Venue Owner</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-primary-green text-white py-2.5 rounded-lg text-sm font-bold transition duration-300 hover:bg-primary-green-dark hover:-translate-y-0.5 transform disabled:opacity-50 disabled:transform-none shadow-md hover:shadow-primary-green/30 !mt-4" // Smaller padding and specific margin
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}

export default RegisterForm;