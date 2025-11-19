import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import toast from "react-hot-toast";
import { ChevronDown } from "lucide-react";

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
  const [agreed, setAgreed] = useState(false);

  const from = location.state?.from || null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Client-side validation using toasts
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
      // The signUp function passes all profile data in options.data.
      // Your SQL trigger will use this to create the profile automatically.
      const { data, error } = await supabase.auth.signUp({
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

      if (error) {
        throw error; // Let the catch block handle the error toast
      }

      toast.dismiss(loadingToast);

      if (data.user) {
        toast.success("Account created! Please check your email for verification.");
        updateUser(data.user); // Update auth context

        // --- MODIFIED: Role-based redirection logic ---
        if (from) {
          navigate(from, { replace: true });
        } else {
          if (formData.role === 'venue_owner') {
            navigate("/owner/dashboard");
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full p-1.5 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-primary-green focus:border-primary-green transition-all";
  const labelStyles = "block mb-0.5 text-xs font-medium text-gray-700";

  return (
    <form onSubmit={handleRegister}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-1.5">
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
          <div className="relative">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={`${inputStyles} appearance-none pr-10 cursor-pointer`}
            >
              <option value="player">Player</option>
              <option value="venue_owner">Venue Owner</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="md:col-span-2 flex items-center mt-2">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded"
          />
          <label htmlFor="agree" className="ml-2 block text-xs text-gray-900">
            I agree to the{" "}
            <Link to="/terms-of-service" className="text-primary-green hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="text-primary-green hover:underline">
              Privacy Policy
            </Link>
            .
          </label>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-primary-green text-white py-1.5 rounded text-xs font-semibold transition-all duration-300 hover:bg-primary-green-dark disabled:opacity-50 shadow-md hover:shadow-lg mt-2"
        disabled={loading || !agreed}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );
}

export default RegisterForm;