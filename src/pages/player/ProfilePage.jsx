import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { FaUserEdit, FaLock } from 'react-icons/fa';

function ProfilePage() {
    const { user, profile, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone_number: '',
        email: ''
    });
    const [passwordData, setPasswordData] = useState({
        new_password: '',
        confirm_password: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (profile) {
            setFormData({
                first_name: profile.first_name || '',
                last_name: profile.last_name || '',
                phone_number: profile.phone_number || '',
                email: user?.email || ''
            });
        }
    }, [profile, user]);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase
                .from('users')
                .update({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone_number: formData.phone_number
                })
                .eq('user_id', user.id);

            if (error) throw error;
            await updateUser(); // Refresh the profile in AuthContext
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: `Error: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.new_password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
            return;
        }
        if (passwordData.new_password !== passwordData.confirm_password) {
            setMessage({ type: 'error', text: 'Passwords do not match.' });
            return;
        }
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase.auth.updateUser({ password: passwordData.new_password });
            if (error) throw error;
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setPasswordData({ new_password: '', confirm_password: '' });
        } catch (error) {
            setMessage({ type: 'error', text: `Error: ${error.message}` });
        } finally {
            setLoading(false);
        }
    };

    if (!profile) {
        return <p className="container mx-auto px-4 py-8 text-center">Loading profile...</p>;
    }

    return (
        <div className="bg-background py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-dark-text mb-8 text-center">My Profile</h1>
                {message.text && (
                    <div className={`max-w-3xl mx-auto p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}
                <div className="max-w-3xl mx-auto bg-card-bg p-8 rounded-2xl shadow-lg border border-border-color-light">
                    <form onSubmit={handleProfileUpdate}>
                        <h2 className="text-2xl font-semibold text-dark-text mb-6 flex items-center gap-3"><FaUserEdit className="text-primary-green" />Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="first_name" className="block text-sm font-medium text-medium-text mb-2">First Name</label>
                                <input id="first_name" name="first_name" type="text" value={formData.first_name} onChange={handleFormChange} className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"/>
                            </div>
                            <div>
                                <label htmlFor="last_name" className="block text-sm font-medium text-medium-text mb-2">Last Name</label>
                                <input id="last_name" name="last_name" type="text" value={formData.last_name} onChange={handleFormChange} className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"/>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="phone_number" className="block text-sm font-medium text-medium-text mb-2">Phone Number</label>
                                <input id="phone_number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleFormChange} className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"/>
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="email" className="block text-sm font-medium text-medium-text mb-2">Email</label>
                                <input id="email" name="email" type="email" value={formData.email} disabled className="w-full px-4 py-3 bg-border-color-light border border-border-color rounded-xl cursor-not-allowed"/>
                            </div>
                        </div>
                        <button type="submit" className="mt-6 w-full py-3 px-6 rounded-xl font-semibold text-white bg-primary-green hover:bg-primary-green-dark transition-all duration-300 shadow-sm hover:shadow-lg disabled:bg-gray-400" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>

                    <hr className="my-8 border-border-color" />

                    <form onSubmit={handlePasswordUpdate}>
                        <h2 className="text-2xl font-semibold text-dark-text mb-6 flex items-center gap-3"><FaLock className="text-primary-green" />Change Password</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="new_password">New Password</label>
                                <input id="new_password" name="new_password" type="password" value={passwordData.new_password} onChange={handlePasswordChange} required className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"/>
                            </div>
                            <div>
                                <label htmlFor="confirm_password">Confirm New Password</label>
                                <input id="confirm_password" name="confirm_password" type="password" value={passwordData.confirm_password} onChange={handlePasswordChange} required className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"/>
                            </div>
                        </div>
                        <button type="submit" className="mt-6 w-full py-3 px-6 rounded-xl font-semibold text-white bg-dark-text hover:bg-black transition-all duration-300 shadow-sm hover:shadow-lg disabled:bg-gray-400" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;