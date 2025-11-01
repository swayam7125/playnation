import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast"; // Import toast
import { useNavigate, useLocation } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const form = location.state?.from || { pathname: "/" };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Show a loading toast
    const loadingToast = toast.loading("Signing in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Dismiss the loading toast
    toast.dismiss(loadingToast);

    if (error) {
      toast.error(error.message); // Show error toast
    } else {
      toast.success("Logged in successfully!"); // Show success toast
      navigate(form, { replace: true });
    }
    setLoading(false);
  };

  return (
    // Your form JSX remains the same
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Input */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-green focus:border-primary-green sm:text-sm"
          />
        </div>
      </div>
      {/* Password Input */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-green focus:border-primary-green sm:text-sm"
          />
        </div>
      </div>
      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-green hover:bg-primary-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;