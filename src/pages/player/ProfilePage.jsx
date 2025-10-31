// src/pages/player/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";
import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";
import { FaSave } from "react-icons/fa";

const ProfilePage = () => {
  const { user, profile, setProfile, logout, loading: authLoading } = useAuth();
  const { showModal } = useModal();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setPhone(profile.phone_number || "");
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  async function updateProfile(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let newAvatarUrl = avatarUrl;
      if (avatarFile) {
        setUploading(true);
        const fileExt = avatarFile.name.split(".").pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        newAvatarUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
        setUploading(false);
      }

      const updates = {
        user_id: user.id,
        email: user.email,
        username,
        phone_number: phone,
        avatar_url: newAvatarUrl,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("users").upsert(updates);
      if (error) throw error;

      setProfile((prevProfile) => ({ ...prevProfile, ...updates }));
      setAvatarUrl(newAvatarUrl);

      setAvatarFile(null);
      setAvatarPreview(null);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  }

  const handleAvatarChange = (event) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleRemoveAvatar = async () => {
    setError("");
    setSuccess("");
    setAvatarPreview(null);
    setAvatarUrl(null);
    setAvatarFile(null);

    try {
      const { error } = await supabase
        .from("users")
        .update({ avatar_url: null })
        .eq("user_id", user.id);
      if (error) throw error;
      setProfile((prev) => ({ ...prev, avatar_url: null }));
      setSuccess("Avatar removed.");
    } catch (err) {
      setError(`Failed to remove avatar: ${err.message}`);
      setAvatarUrl(profile.avatar_url);
    }
  };

  const handleLogout = () => {
    showModal({
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      confirmText: "Logout",
      confirmStyle: "danger",
      showCancel: true,
      onConfirm: () => {
        logout();
        navigate("/");
      },
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-medium-text text-lg">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Success Toast Notification */}
      {success && (
        <div className="fixed top-24 right-5 bg-primary-green text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down z-50">
          {success}
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-dark-text mb-8">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={updateProfile}>
              <div className="bg-card-bg border border-border-color rounded-2xl p-8 shadow-sm">
                <h2 className="text-xl font-bold text-dark-text mb-6">
                  Account Details
                </h2>
                <div className="space-y-4">
                  <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                    <img
                      src={
                        avatarPreview ||
                        avatarUrl ||
                        `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`
                      }
                      alt="Avatar"
                      className="w-28 h-28 rounded-full object-cover border-4 border-primary-green shadow-md"
                    />
                    <div className="flex-grow flex flex-col items-center sm:items-start gap-3 pt-2">
                      <div className="flex gap-3">
                        <label
                          htmlFor="avatar-upload"
                          className="cursor-pointer bg-light-green-bg text-primary-green font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-green/20 transition-colors"
                        >
                          {uploading ? "Uploading..." : "Choose Picture"}
                        </label>
                        <input
                          type="file"
                          id="avatar-upload"
                          className="hidden"
                          onChange={handleAvatarChange}
                          accept="image/*"
                          disabled={uploading}
                        />

                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={handleRemoveAvatar}
                            className="bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-red-200 transition-colors flex items-center gap-2"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-light-text text-center sm:text-left">
                        PNG, JPG, GIF up to 10MB. <br /> Changes will be saved
                        when you click "Save Changes".
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-medium-text mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      id="email"
                      value={user?.email}
                      disabled
                      className="w-full px-4 py-2 bg-gray-200 border border-border-color rounded-lg cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-medium-text mb-2"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-2 bg-background border border-border-color rounded-lg focus:ring-primary-green focus:border-primary-green"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-medium-text mb-2"
                    >
                      Phone
                    </label>
                    <input
                      type="text"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2 bg-background border border-border-color rounded-lg focus:ring-primary-green focus:border-primary-green"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="py-3 px-6 rounded-lg font-semibold text-sm bg-primary-green text-white shadow-sm hover:bg-primary-green-dark disabled:opacity-50 transition-all duration-300 flex items-center gap-2"
                    >
                      <FaSave />
                      {loading ? "Saving..." : "Save All Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            {/* Change Password Section */}
            <ChangePasswordForm />

            {/* Logout Section */}
            <div className="bg-card-bg border border-border-color rounded-2xl p-8 shadow-sm">
              <h2 className="text-xl font-bold text-dark-text mb-4">
                Account Actions
              </h2>
              <p className="text-sm text-medium-text mb-6">
                Sign out of your account on this device
              </p>
              <button
                onClick={handleLogout}
                className="w-full py-3 px-6 rounded-lg font-semibold text-sm bg-red-600 text-white shadow-sm hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;