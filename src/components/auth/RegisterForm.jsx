import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import toast from "react-hot-toast";

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

  const from = location.state?.from || null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirm_password) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Creating your account...");

    try {
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

      if (authData.user) {
        const { error: profileError } = await supabase.from("users").insert([
          {
            id: authData.user.id,
            username: formData.username,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            role: formData.role,
            email: formData.email,
          },
        ]);

        if (profileError) throw profileError;

        toast.dismiss(loadingToast);
        toast.success("Account created! Check your email for verification.");
        updateUser(authData.user);

        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-green focus:border-primary-green transition-all";
  const labelStyles = "block mb-1 text-xs font-medium text-gray-700";

  return (
    <form onSubmit={handleRegister}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-2">
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
            placeholder="johndoe123"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="email" className={labelStyles}>
            Email
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
        <div className="md:col-span-2">
          <label htmlFor="phone_number" className={labelStyles}>
            Phone Number
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className={inputStyles}
            placeholder="123-456-7890"
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
            placeholder="••••••••"
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
        className="w-full bg-primary-green text-white py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:bg-primary-green-dark hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none shadow-md hover:shadow-lg mt-3"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}

export default RegisterForm;