import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext";
import { useNavigate } from "react-router-dom";
import ChangePasswordForm from "../../components/auth/ChangePasswordForm";
import { FaSave, FaUser, FaPhone, FaEnvelope } from "react-icons/fa";

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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {success && (
        <div className="fixed top-24 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-down z-50">
          {success}
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={updateProfile}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Account Details
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <img
                        src={
                          avatarPreview ||
                          avatarUrl ||
                          `https://api.dicebear.com/8.x/initials/svg?seed=${user?.email}`
                        }
                        alt="Avatar"
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary-green shadow-lg"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer bg-primary-green text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-primary-green-dark transition-colors shadow-md"
                      >
                        {uploading ? "Uploading..." : "Choose Picture"}
                      </label>
                      {avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg text-sm hover:bg-red-600 transition-colors shadow-md"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <FaEnvelope className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="email"
                      value={user?.email}
                      disabled
                      className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                    />
                  </div>
                  <div className="relative">
                    <FaUser className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-primary-green focus:border-primary-green"
                    />
                  </div>
                  <div className="relative">
                    <FaPhone className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-primary-green focus:border-primary-green"
                    />
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="py-3 px-8 rounded-lg font-semibold text-white bg-primary-green hover:bg-primary-green-dark disabled:opacity-50 transition-all duration-300 flex items-center gap-2 shadow-lg transform hover:-translate-y-0.5"
                    >
                      <FaSave />
                      {loading ? "Saving..." : "Save All Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <ChangePasswordForm />

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Account Actions
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Sign out of your account on this device
              </p>
              <button
                onClick={handleLogout}
                className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:-translate-y-0.5"
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