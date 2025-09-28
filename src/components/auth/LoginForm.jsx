import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";

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
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (signInError) throw signInError;

      const userProfile = await updateUser();

      // Redirect based on role
      if (userProfile?.role === "venue_owner") {
        navigate("/owner/dashboard");
      } else if (userProfile?.role === "admin") {
        navigate("/admin/venues");
      } else if (from) {
        // If there was a page they were trying to access before login
        navigate(from.pathname, { state: from.state, replace: true });
      } else {
        // Default redirect for players
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "w-full py-3 px-4 border border-border-color rounded-lg text-sm bg-card-bg text-dark-text transition duration-300 focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20";
  const labelStyles = "font-semibold text-sm text-dark-text";

  return (
    <form onSubmit={handleLogin} className="flex flex-col">
      {error && (
        <p className="bg-red-100 text-red-700 p-4 rounded-lg text-center text-sm border border-red-300 mb-6">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className={labelStyles}>
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputStyles}
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-primary-green text-white p-4 rounded-lg text-base font-bold cursor-pointer transition duration-300 mt-4 hover:bg-primary-green-dark hover:-translate-y-px hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

export default LoginForm;
