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
    setLoading(true);

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
      if (!authData.user) throw new Error("Registration failed, please try again.");
      
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

  const inputStyles = "w-full py-3 px-4 border border-border-color rounded-lg text-sm bg-card-bg text-dark-text transition duration-300 focus:outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/20";
  const labelStyles = "font-semibold text-sm text-dark-text";

  return (
    <form onSubmit={handleRegister} className="flex flex-col">
      {error && (
        <p className="bg-red-100 text-red-700 p-4 rounded-lg text-center text-sm border border-red-300 mb-6 col-span-2">
          {error}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
        <div className="flex flex-col gap-2">
          <label htmlFor="first_name" className={labelStyles}>First Name</label>
          <input id="first_name" name="first_name" type="text" value={formData.first_name} onChange={handleChange} required className={inputStyles} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="last_name" className={labelStyles}>Last Name</label>
          <input id="last_name" name="last_name" type="text" value={formData.last_name} onChange={handleChange} required className={inputStyles} />
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <label htmlFor="username" className={labelStyles}>Username</label>
          <input id="username" name="username" type="text" value={formData.username} onChange={handleChange} required className={inputStyles} />
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <label htmlFor="email" className={labelStyles}>Email Address</label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className={inputStyles} />
        </div>
        <div className="flex flex-col gap-2 col-span-2">
          <label htmlFor="password" className={labelStyles}>Password</label>
          <input id="password" name="password" type="password" minLength="6" value={formData.password} onChange={handleChange} required className={inputStyles} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="phone_number" className={labelStyles}>Phone Number</label>
          <input id="phone_number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} className={inputStyles} />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="role" className={labelStyles}>I am a...</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange} className={inputStyles}>
            <option value="player">Player</option>
            <option value="venue_owner">Venue Owner</option>
          </select>
        </div>
      </div>
      <button type="submit" className="bg-primary-green text-white p-4 rounded-lg text-base font-bold cursor-pointer transition duration-300 mt-4 hover:bg-primary-green-dark hover:-translate-y-px hover:shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none" disabled={loading}>
        {loading ? "Registering..." : "Create Account"}
      </button>
    </form>
  );
}

export default RegisterForm;