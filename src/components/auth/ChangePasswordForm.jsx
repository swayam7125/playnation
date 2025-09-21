// src/components/auth/ChangePasswordForm.jsx
import React, { useState } from "react";
import { supabase } from "../../supabaseClient";
import { FaLock } from "react-icons/fa";

const ChangePasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    // This call will either change the password instantly OR send a confirmation email,
    // depending on your Supabase settings. Both are handled now.
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(`Error: ${error.message}`);
    } else {
      // This success message works for both scenarios.
      setSuccess(
        "Request sent! If email confirmation is enabled, please check your inbox to finalize the change."
      );
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(""), 6000); // Show message for longer
    }
  };

  return (
    <div className="bg-card-bg border border-border-color rounded-2xl p-8 shadow-sm">
      <h2 className="text-xl font-bold text-dark-text mb-6 flex items-center gap-3">
        <FaLock />
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-medium-text mb-2"
          >
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full px-4 py-2 bg-background border border-border-color rounded-lg focus:ring-primary-green focus:border-primary-green"
            placeholder="Enter new password"
          />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-medium-text mb-2"
          >
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full px-4 py-2 bg-background border border-border-color rounded-lg focus:ring-primary-green focus:border-primary-green"
            placeholder="Confirm new password"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-semibold text-sm bg-primary-green text-white shadow-sm hover:bg-primary-green-dark disabled:opacity-50 transition-all duration-300"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
