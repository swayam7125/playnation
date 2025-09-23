// src/pages/EditVenuePage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { useModal } from '../../ModalContext';
import { 
  FaTrash, FaPlus, FaEdit, FaSave, FaTimes, FaMapMarkerAlt, 
  FaClock, FaPhone, FaEnvelope, FaUpload, FaEye, FaUsers, 
  FaRupeeSign, FaStar 
} from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid'; // Import uuid for unique filenames

// Placeholder image for when no images are available
const placeholderImage = 'https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=500';

// Utility function to upload a single image to Supabase Storage
const uploadVenueImage = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `venue-images/${userId}/${fileName}`;

    const { data, error } = await supabase.storage
        .from('venue-images')
        .upload(filePath, file);

    if (error) {
        console.error('Error uploading file:', error);
        return null;
    }
    return supabase.storage.from('venue-images').getPublicUrl(filePath).data.publicUrl;
};

function EditVenuePage() {
    const { venueId } = useParams();
    const { user } = useAuth();
    const { showModal } = useModal();
    const navigate = useNavigate();
    
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details');
    const [venueDetails, setVenueDetails] = useState({
        name: '', address: '', city: '', state: '', zip_code: '', description: '', 
        contact_email: '', contact_phone: '', opening_time: '', closing_time: ''
    });
    
    // State to manage images
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]); 
    
    const [sports, setSports] = useState([]);
    const [showAddFacilityForm, setShowAddFacilityForm] = useState(false);
    const [newFacility, setNewFacility] = useState({ 
        name: '', sport_id: '', capacity: '', hourly_rate: '', description: '' 
    });

    const fetchVenueData = async () => {
        setLoading(true);
        try {
            const { data: sportsData } = await supabase.from('sports').select('sport_id, name').order('name');
            setSports(sportsData || []);

            const { data: venueData, error } = await supabase
                .from('venues')
                .select(`*, facilities(*, sports(name), time_slots(count))`)
                .eq('venue_id', venueId)
                .single();
                
            if (error) throw error;
            if (venueData.owner_id !== user.id) { 
                navigate('/owner/my-venues'); 
                return; 
            }
            
            setVenue(venueData);
            setVenueDetails({
                name: venueData.name || '', 
                address: venueData.address || '', 
                city: venueData.city || '',
                state: venueData.state || '', 
                zip_code: venueData.zip_code || '', 
                description: venueData.description || '',
                contact_email: venueData.contact_email || '', 
                contact_phone: venueData.contact_phone || '',
                opening_time: venueData.opening_time || '', 
                closing_time: venueData.closing_time || '',
            });
            // Ensure existing images are stored as an array
            setExistingImages(venueData.image_url || []);
        } catch (err) {
            console.error("Error fetching data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchVenueData();
    }, [user, venueId]);

    const handleDetailsChange = (e) => setVenueDetails({ ...venueDetails, [e.target.name]: e.target.value });
    const handleNewFacilityChange = (e) => setNewFacility({ ...newFacility, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImageFiles(files);
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleRemoveNewImage = (index) => {
        const updatedFiles = newImageFiles.filter((_, i) => i !== index);
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
        setNewImageFiles(updatedFiles);
        setImagePreviews(updatedPreviews);
    };

    const handleRemoveExistingImage = async (imageUrl) => {
        const isConfirmed = await showModal({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this image? This action cannot be undone.",
            confirmText: "Delete",
            confirmStyle: "danger"
        });

        if (isConfirmed) {
            try {
                const imageName = imageUrl.split('/').pop();
                const { error: storageError } = await supabase.storage
                    .from('venue-images')
                    .remove([`${user.id}/${imageName}`]);
                if (storageError) throw storageError;

                const updatedImageArray = existingImages.filter(url => url !== imageUrl);
                const { error: updateError } = await supabase
                    .from('venues')
                    .update({ image_url: updatedImageArray })
                    .eq('venue_id', venueId);
                if (updateError) throw updateError;
                
                await showModal({ title: "Success", message: "Image deleted successfully!" });
                setExistingImages(updatedImageArray); 
            } catch (err) {
                await showModal({ title: "Deletion Failed", message: `Deletion failed: ${err.message}` });
            }
        }
    };

    const handleDetailsUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const uploadedImageUrls = [];
            if (newImageFiles.length > 0) {
                for (const file of newImageFiles) {
                    const publicURL = await uploadVenueImage(file, user.id);
                    if (publicURL) {
                        uploadedImageUrls.push(publicURL);
                    }
                }
            }

            const updatedImageArray = [...existingImages, ...uploadedImageUrls];
    
            const { error: updateError } = await supabase
                .from('venues')
                .update({ ...venueDetails, image_url: updatedImageArray }) 
                .eq('venue_id', venueId);
            if (updateError) throw updateError;

            await showModal({ title: "Success", message: "Venue details updated successfully!" });
            fetchVenueData();
        } catch (err) {
            await showModal({ title: "Update Failed", message: `Update failed: ${err.message}` });
        } finally {
            setLoading(false);
            setNewImageFiles([]);
            setImagePreviews([]);
        }
    };
    
    const handleAddFacility = async (e) => {
        e.preventDefault();
        if (!newFacility.name.trim() || !newFacility.sport_id || !newFacility.capacity || !newFacility.hourly_rate) {
            await showModal({ title: "Required Fields", message: "Please fill all required facility fields." }); 
            return;
        }
        try {
            const { error } = await supabase.from('facilities').insert([{ venue_id: venueId, ...newFacility }]);
            if (error) throw error;
            await showModal({ title: "Success", message: "Facility added successfully!" });
            setShowAddFacilityForm(false);
            setNewFacility({ name: '', sport_id: sports[0]?.sport_id || '', capacity: '', hourly_rate: '', description: '' });
            fetchVenueData();
        } catch (error) {
            await showModal({ title: "Error", message: `Error adding facility: ${error.message}` });
        }
    };

    const handleDeleteFacility = async (facilityId, facilityName) => {
        const isConfirmed = await showModal({
            title: "Confirm Deletion",
            message: `Are you sure you want to delete "${facilityName}"? This action cannot be undone.`,
            confirmText: "Delete",
            confirmStyle: "danger"
        });
        if (isConfirmed) {
            try {
                const { error } = await supabase.from('facilities').delete().eq('facility_id', facilityId);
                if (error) throw error;
                await showModal({ title: "Success", message: "Facility deleted!" });
                fetchVenueData();
            } catch (error) {
                await showModal({ title: "Error", message: `Error deleting facility: ${error.message}` });
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-green/20 border-t-primary-green mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading venue...</p>
                </div>
            </div>
        );
    }
    
    if (!venue) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                    <p className="text-xl text-slate-600">Venue not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
            <div className="max-w-6xl mx-auto">
                {/* Compact Header */}
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                Edit Venue
                            </h1>
                            <p className="text-slate-600 flex items-center gap-2 mt-1">
                                <FaMapMarkerAlt className="text-primary-green text-sm" />
                                {venue.name}
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-2xl text-sm font-semibold ${venue.is_approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {venue.is_approved ? '✓ Approved' : '⏳ Pending'}
                        </div>
                    </div>

                    {/* Compact Tab Navigation */}
                    <div className="flex bg-slate-100/50 rounded-2xl p-1 mt-4">
                        <button 
                            onClick={() => setActiveTab('details')} 
                            className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'details' 
                                    ? 'bg-white text-primary-green shadow-md' 
                                    : 'text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            <FaEdit className="text-xs" /> Details
                        </button>
                        <button 
                            onClick={() => setActiveTab('facilities')} 
                            className={`flex-1 py-2 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'facilities' 
                                    ? 'bg-white text-primary-green shadow-md' 
                                    : 'text-slate-600 hover:text-slate-800'
                            }`}
                        >
                            <FaEye className="text-xs" /> Facilities
                        </button>
                    </div>
                </div>

                {/* Details Tab */}
                {activeTab === 'details' && (
                    <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                        <div className="bg-gradient-to-r from-primary-green via-emerald-500 to-teal-500 p-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <FaEdit /> Venue Details
                            </h2>
                        </div>

                        <form onSubmit={handleDetailsUpdate} className="p-6 space-y-6">
                            {/* Compact Image Section */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Venue Images</label>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {existingImages.map((imageUrl, index) => (
                                        <div key={index} className="relative group rounded-xl overflow-hidden">
                                            <img 
                                                src={imageUrl} 
                                                alt={`Venue ${index}`}
                                                className="w-full h-32 object-cover"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveExistingImage(imageUrl)}
                                                className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </div>
                                    ))}
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group rounded-xl overflow-hidden">
                                            <img 
                                                src={preview} 
                                                alt={`New Image ${index}`} 
                                                className="w-full h-32 object-cover"
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => handleRemoveNewImage(index)}
                                                className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full"
                                            >
                                                <FaTimes className="text-xs" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="relative">
                                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-primary-green transition-colors cursor-pointer">
                                        <FaUpload className="mx-auto text-3xl text-slate-400 mb-2" />
                                        <p className="text-slate-600 font-medium">Upload new venue images</p>
                                        <p className="text-slate-400 text-sm">PNG, JPG up to 10MB</p>
                                    </div>
                                    <input 
                                        type="file" 
                                        onChange={handleImageChange} 
                                        multiple 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            {/* Compact Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <input 
                                        name="name" 
                                        type="text" 
                                        value={venueDetails.name} 
                                        onChange={handleDetailsChange} 
                                        className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                        placeholder="Venue Name"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <input 
                                        name="address" 
                                        type="text" 
                                        value={venueDetails.address} 
                                        onChange={handleDetailsChange} 
                                        className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                        placeholder="Address"
                                    />
                                </div>

                                <input 
                                    name="city" 
                                    type="text" 
                                    value={venueDetails.city} 
                                    onChange={handleDetailsChange} 
                                    className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                    placeholder="City"
                                />

                                <input 
                                    name="state" 
                                    type="text" 
                                    value={venueDetails.state} 
                                    onChange={handleDetailsChange} 
                                    className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                    placeholder="State"
                                />

                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-green text-sm" />
                                    <input 
                                        name="contact_email" 
                                        type="email" 
                                        value={venueDetails.contact_email} 
                                        onChange={handleDetailsChange} 
                                        className="w-full py-3 pl-10 pr-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                        placeholder="Email"
                                    />
                                </div>

                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-green text-sm" />
                                    <input 
                                        name="contact_phone" 
                                        type="tel" 
                                        value={venueDetails.contact_phone} 
                                        onChange={handleDetailsChange} 
                                        className="w-full py-3 pl-10 pr-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                        placeholder="Phone"
                                    />
                                </div>

                                <div className="relative">
                                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-green text-sm" />
                                    <input 
                                        name="opening_time" 
                                        type="time" 
                                        value={venueDetails.opening_time} 
                                        onChange={handleDetailsChange} 
                                        className="w-full py-3 pl-10 pr-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                    />
                                </div>

                                <div className="relative">
                                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-green text-sm" />
                                    <input 
                                        name="closing_time" 
                                        type="time" 
                                        value={venueDetails.closing_time} 
                                        onChange={handleDetailsChange} 
                                        className="w-full py-3 pl-10 pr-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <textarea 
                                        name="description" 
                                        rows="3" 
                                        value={venueDetails.description} 
                                        onChange={handleDetailsChange} 
                                        className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all resize-none"
                                        placeholder="Description"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="bg-gradient-to-r from-primary-green to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="text-sm" /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Facilities Tab */}
                {activeTab === 'facilities' && (
                    <div className="space-y-6">
                        {/* Compact Header */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Facilities</h2>
                                    <p className="text-slate-600 text-sm">Manage your venue facilities</p>
                                </div>
                                <button 
                                    onClick={() => setShowAddFacilityForm(!showAddFacilityForm)} 
                                    className="bg-gradient-to-r from-primary-green to-emerald-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                                >
                                    <FaPlus className="text-sm" /> Add Facility
                                </button>
                            </div>
                        </div>

                        {/* Compact Add Form */}
                        {showAddFacilityForm && (
                            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-4">
                                    <h3 className="font-bold text-white">Add New Facility</h3>
                                </div>
                                
                                <form onSubmit={handleAddFacility} className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <input 
                                            name="name" 
                                            type="text" 
                                            value={newFacility.name} 
                                            onChange={handleNewFacilityChange} 
                                            required 
                                            className="w-full py-2 px-3 bg-white/50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                            placeholder="Facility Name"
                                        />
                                        
                                        <select 
                                            name="sport_id" 
                                            value={newFacility.sport_id} 
                                            onChange={handleNewFacilityChange} 
                                            required 
                                            className="w-full py-2 px-3 bg-white/50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                        >
                                            <option value="">Select Sport</option>
                                            {sports.map(s => (
                                                <option key={s.sport_id} value={s.sport_id}>{s.name}</option>
                                            ))}
                                        </select>
                                        
                                        <input 
                                            name="capacity" 
                                            type="number" 
                                            min="1" 
                                            value={newFacility.capacity} 
                                            onChange={handleNewFacilityChange} 
                                            required 
                                            className="w-full py-2 px-3 bg-white/50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                            placeholder="Capacity"
                                        />
                                        
                                        <input 
                                            name="hourly_rate" 
                                            type="number" 
                                            min="0" 
                                            value={newFacility.hourly_rate} 
                                            onChange={handleNewFacilityChange} 
                                            required 
                                            className="w-full py-2 px-3 bg-white/50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                            placeholder="Rate (₹/hr)"
                                        />
                                    </div>
                                    
                                    <div className="flex justify-end gap-3">
                                        <button 
                                            type="button" 
                                            onClick={() => setShowAddFacilityForm(false)} 
                                            className="px-4 py-2 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="bg-gradient-to-r from-primary-green to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
                                        >
                                            <FaPlus className="text-sm" /> Add
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Compact Facilities List */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                            <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-4">
                                <h3 className="font-bold text-white">Facilities ({venue.facilities.length})</h3>
                            </div>

                            <div className="p-6">
                                {venue.facilities.length === 0 ? (
                                    <div className="text-center py-8">
                                        <div className="text-4xl text-slate-400 mb-2">🏟️</div>
                                        <p className="text-slate-600 font-medium">No facilities yet</p>
                                        <p className="text-slate-400 text-sm">Add your first facility</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                        {venue.facilities.map(facility => (
                                            <div key={facility.facility_id} className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 hover:shadow-md transition-all group">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-slate-800 mb-1">{facility.name}</h4>
                                                        <span className="px-2 py-1 bg-primary-green text-white text-xs rounded-full font-medium">
                                                            {facility.sports?.name || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleDeleteFacility(facility.facility_id, facility.name)} 
                                                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <FaTrash className="text-sm" />
                                                    </button>
                                                </div>
                                                
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center text-slate-600">
                                                        <FaUsers className="mr-2 text-primary-green text-xs" />
                                                        <span>{facility.capacity} players</span>
                                                    </div>
                                                    <div className="flex items-center text-slate-600">
                                                        <FaRupeeSign className="mr-2 text-primary-green text-xs" />
                                                        <span>₹{facility.hourly_rate}/hour</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EditVenuePage;