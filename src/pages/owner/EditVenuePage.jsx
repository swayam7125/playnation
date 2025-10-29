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
import LocationPickerMap from '../../components/maps/LocationPickerMap'; // Import map picker

// Placeholder image for when no images are available
const placeholderImage = 'https://images.unsplash.com/photo-1593341646782-e02a_a4ff2ab?w=500';

// Utility function to upload a single image to Supabase Storage
const uploadVenueImage = async (file, userId) => {
    const fileExt = file.name.split('.').pop();
    // Ensure filename uniqueness and handle potential special characters
    const safeFileNameBase = uuidv4().replace(/-/g, '');
    const fileName = `${safeFileNameBase}.${fileExt}`;
    const filePath = `venue-images/${userId}/${fileName}`;

    console.log(`Uploading file: ${file.name} to path: ${filePath}`); // Log upload path

    const { data, error } = await supabase.storage
        .from('venue-images')
        .upload(filePath, file, {
          cacheControl: '3600', // Optional: Set cache control
          upsert: false // Optional: Don't overwrite existing files with the same name
        });

    if (error) {
        console.error('Supabase storage upload error:', error);
        // Attempt to parse Supabase specific error details if available
        let errorMessage = error.message;
        if (error.error && typeof error.error === 'string') {
             try {
                const parsedError = JSON.parse(error.error);
                if (parsedError.message) {
                    errorMessage += ` (${parsedError.message})`;
                }
             } catch(e) { /* Ignore parsing error */ }
        }
        throw new Error(`Upload failed: ${errorMessage}`); // Throw detailed error
    }

    // Get public URL after successful upload
     const { data: urlData } = supabase.storage.from('venue-images').getPublicUrl(filePath);

     if (!urlData || !urlData.publicUrl) {
         console.error('Error getting public URL for:', filePath);
         throw new Error('File uploaded, but failed to get public URL.');
     }

     console.log(`Upload successful, public URL: ${urlData.publicUrl}`); // Log success
     return urlData.publicUrl;
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
        contact_email: '', contact_phone: '', opening_time: '', closing_time: '', google_maps_url: ''
        // Removed latitude, longitude - will be handled by map state
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
    const [initialMapPosition, setInitialMapPosition] = useState(null); // For map initial center/marker
    const [updatedLocation, setUpdatedLocation] = useState(null); // Store map selection changes


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
            if (!venueData) {
                 await showModal({ title: "Error", message: "Venue not found." });
                 navigate('/owner/my-venues');
                 return;
            }
            if (venueData.owner_id !== user.id) {
                 await showModal({ title: "Unauthorized", message: "You do not own this venue." });
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
                google_maps_url: venueData.google_maps_url || ''
                // Don't set lat/lng in venueDetails directly anymore
            });
            // Set initial map position if coordinates exist
             if (venueData.latitude && venueData.longitude) {
                 // Ensure they are parsed as numbers
                 const lat = parseFloat(venueData.latitude);
                 const lng = parseFloat(venueData.longitude);
                 if (!isNaN(lat) && !isNaN(lng)) {
                     setInitialMapPosition({ lat, lng });
                 } else {
                      console.warn("Invalid latitude/longitude format:", venueData.latitude, venueData.longitude);
                      setInitialMapPosition(null);
                 }
            } else {
                 setInitialMapPosition(null);
            }

            // Ensure existing images are stored as an array
            setExistingImages(venueData.image_url || []);
        } catch (err) {
             console.error("Error fetching data:", err);
             await showModal({ title: "Error", message: `Failed to load venue data: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) { // Ensure user object and id are available
          fetchVenueData();
        } else if (user === null) { // Handle case where user logs out
           navigate('/login');
        }
        // Dependency on user.id ensures refetch if user changes
    }, [user?.id, venueId, navigate]);

     // Cleanup image previews
    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    const handleDetailsChange = (e) => setVenueDetails({ ...venueDetails, [e.target.name]: e.target.value });
    const handleNewFacilityChange = (e) => setNewFacility({ ...newFacility, [e.target.name]: e.target.value });

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        // Filter out non-image files if needed (basic check)
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        setNewImageFiles(prev => [...prev, ...imageFiles]);
        const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
        // Clear the file input for re-selection
        e.target.value = null;
    };


    const handleRemoveNewImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]); // Revoke URL before removing
        const updatedFiles = newImageFiles.filter((_, i) => i !== index);
        const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
        setNewImageFiles(updatedFiles);
        setImagePreviews(updatedPreviews);
    };

    const handleRemoveExistingImage = async (imageUrl) => {
         // Prevent deletion if it's the last image
        if (existingImages.length <= 1 && newImageFiles.length === 0) {
            await showModal({ title: "Cannot Delete", message: "You must have at least one image for the venue." });
            return;
        }

        const isConfirmed = await showModal({
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this image? This action cannot be undone.",
            confirmText: "Delete",
            confirmStyle: "danger"
        });

        if (isConfirmed) {
            try {
                // Extract the file path from the public URL
                 const urlParts = imageUrl.split('/venue-images/');
                 if (urlParts.length < 2) throw new Error("Invalid image URL format for deletion.");
                 const filePath = `venue-images/${urlParts[1]}`;

                console.log(`Attempting to remove storage object at path: ${filePath}`); // Log removal path

                const { error: storageError } = await supabase.storage
                    .from('venue-images')
                    .remove([filePath]); // Use the extracted path

                if (storageError) {
                     console.error("Storage removal error:", storageError);
                     // Provide more context if possible
                     if (storageError.message.includes("Object not found")) {
                        console.warn("Attempted to delete an image that might already be removed or path is incorrect:", filePath);
                         // Optionally proceed to update DB if file not found in storage
                     } else {
                        throw storageError; // Re-throw other storage errors
                    }
                 } else {
                     console.log("Image successfully removed from storage:", filePath);
                 }


                const updatedImageArray = existingImages.filter(url => url !== imageUrl);
                const { error: updateError } = await supabase
                    .from('venues')
                    .update({ image_url: updatedImageArray })
                    .eq('venue_id', venueId);
                if (updateError) throw updateError;

                await showModal({ title: "Success", message: "Image deleted successfully!" });
                setExistingImages(updatedImageArray);
            } catch (err) {
                 console.error("Deletion process failed:", err);
                 await showModal({ title: "Deletion Failed", message: `Deletion failed: ${err.message || 'Unknown error'}` });
            }
        }
    };

    const handleDetailsUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const uploadedImageUrls = [];
            if (newImageFiles.length > 0) {
                 console.log(`Attempting to upload ${newImageFiles.length} new images.`);
                for (const file of newImageFiles) {
                    try {
                        const publicURL = await uploadVenueImage(file, user.id);
                        if (publicURL) {
                            uploadedImageUrls.push(publicURL);
                        } else {
                             // Handle case where upload function returns null without throwing
                            console.warn(`Upload function returned null for file: ${file.name}`);
                         }
                    } catch (uploadError) {
                        console.error(`Failed to upload file ${file.name}:`, uploadError);
                         // Decide how to handle partial failures: show error and stop, or continue?
                         // For now, let's stop and show an error.
                         throw new Error(`Failed to upload image "${file.name}". Please try again.`);
                    }
                 }
                console.log(`Successfully uploaded ${uploadedImageUrls.length} images.`);
            }


            // Determine location to save
            let locationToSave = {};
            if (updatedLocation) { // If user picked a new location
              locationToSave = { latitude: updatedLocation.lat, longitude: updatedLocation.lng };
            } else if (initialMapPosition) { // Keep existing location if not changed
              locationToSave = { latitude: initialMapPosition.lat, longitude: initialMapPosition.lng };
            } // If neither exists, latitude/longitude will not be updated


            const updatedImageArray = [...existingImages, ...uploadedImageUrls];
             if (updatedImageArray.length === 0) {
                 throw new Error("Venue must have at least one image."); // Prevent saving with no images
             }


            const { error: updateError } = await supabase
                .from('venues')
                 .update({
                    ...venueDetails,
                    ...locationToSave, // Add latitude and longitude
                    image_url: updatedImageArray
                })
                .eq('venue_id', venueId);
            if (updateError) throw updateError;

            await showModal({ title: "Success", message: "Venue details updated successfully!" });
            // Manually update local state to reflect changes immediately
            setExistingImages(updatedImageArray);
            if(updatedLocation) setInitialMapPosition(updatedLocation); // Update map position state
            setNewImageFiles([]);
            setImagePreviews([]);
            setUpdatedLocation(null); // Reset updated location
            // Optionally re-fetch all data if needed: fetchVenueData();
        } catch (err) {
             console.error("Update process failed:", err);
             await showModal({ title: "Update Failed", message: `Update failed: ${err.message || 'Unknown error'}` });
        } finally {
            setLoading(false);
             // Ensure previews are cleared even on failure
             imagePreviews.forEach(url => URL.revokeObjectURL(url));
             setImagePreviews([]);
        }
    };


    const handleAddFacility = async (e) => {
        e.preventDefault();
        if (!newFacility.name.trim() || !newFacility.sport_id || !newFacility.capacity || !newFacility.hourly_rate) {
            await showModal({ title: "Required Fields", message: "Please fill all required facility fields (Name, Sport, Capacity, Rate)." });
            return;
        }
        try {
            const { error } = await supabase.from('facilities').insert([{ venue_id: venueId, ...newFacility }]);
            if (error) throw error;
            await showModal({ title: "Success", message: "Facility added successfully!" });
            setShowAddFacilityForm(false);
            setNewFacility({ name: '', sport_id: '', capacity: '', hourly_rate: '', description: '' }); // Reset form
            fetchVenueData(); // Refresh list
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
                fetchVenueData(); // Refresh list
            } catch (error) {
                await showModal({ title: "Error", message: `Error deleting facility: ${error.message}` });
            }
        }
    };

    if (loading && !venue) { // Show initial loading only if venue is not yet loaded
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-green/20 border-t-primary-green mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Loading venue...</p>
                </div>
            </div>
        );
    }

    if (!venue && !loading) { // Show not found only after loading is done
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                    <p className="text-xl text-slate-600">Venue not found or access denied.</p>
                     <button onClick={() => navigate('/owner/my-venues')} className="mt-4 bg-primary-green text-white px-4 py-2 rounded-lg">Go to My Venues</button>
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
                                {venue?.name || 'Loading...'}
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-2xl text-sm font-semibold ${venue?.is_approved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {venue?.is_approved ? '✓ Approved' : '⏳ Pending'}
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
                                        <div key={`existing-${index}`} className="relative group rounded-xl overflow-hidden shadow">
                                            <img
                                                src={imageUrl}
                                                alt={`Venue ${index + 1}`}
                                                className="w-full h-32 object-cover"
                                                onError={(e) => { e.target.src = placeholderImage; console.error("Error loading image:", imageUrl); }} // Added onError
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveExistingImage(imageUrl)}
                                                className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                                aria-label={`Remove image ${index + 1}`}
                                            >
                                                <FaTrash className="text-xs" />
                                            </button>
                                        </div>
                                    ))}
                                    {imagePreviews.map((preview, index) => (
                                        <div key={`new-${index}`} className="relative group rounded-xl overflow-hidden shadow">
                                            <img
                                                src={preview}
                                                alt={`New Image ${index + 1}`}
                                                className="w-full h-32 object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNewImage(index)}
                                                className="absolute top-1 right-1 bg-orange-500/80 text-white p-1 rounded-full"
                                                aria-label={`Remove new image ${index + 1}`}
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
                                        <p className="text-slate-400 text-sm">PNG, JPG, WEBP up to 10MB each</p>
                                    </div>
                                    <input
                                        type="file"
                                        onChange={handleImageChange}
                                        multiple
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept="image/png, image/jpeg, image/webp"
                                    />
                                </div>
                            </div>

                            {/* Compact Form Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                     <label htmlFor="venueName" className="sr-only">Venue Name</label>
                                    <input
                                        id="venueName"
                                        name="name"
                                        type="text"
                                        value={venueDetails.name}
                                        onChange={handleDetailsChange}
                                        required
                                        className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                        placeholder="Venue Name *"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                     <label htmlFor="venueAddress" className="sr-only">Address</label>
                                    <input
                                         id="venueAddress"
                                        name="address"
                                        type="text"
                                        value={venueDetails.address}
                                        onChange={handleDetailsChange}
                                        required
                                        className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                        placeholder="Address *"
                                    />
                                </div>
                                <input
                                    name="city"
                                    type="text"
                                    value={venueDetails.city}
                                    onChange={handleDetailsChange}
                                    required
                                    className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                    placeholder="City *"
                                />
                                <input
                                    name="state"
                                    type="text"
                                    value={venueDetails.state}
                                    onChange={handleDetailsChange}
                                    required
                                    className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                    placeholder="State *"
                                />
                                <input
                                    name="zip_code"
                                    type="text"
                                    value={venueDetails.zip_code}
                                    onChange={handleDetailsChange}
                                    className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                    placeholder="ZIP Code"
                                />
                                 <input
                                     name="google_maps_url"
                                     type="url"
                                     value={venueDetails.google_maps_url}
                                     onChange={handleDetailsChange}
                                     className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                     placeholder="Google Maps Share Link (Optional)"
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
                                     <label htmlFor="opening_time" className="sr-only">Opening Time</label>
                                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-green text-sm" />
                                    <input
                                        id="opening_time"
                                        name="opening_time"
                                        type="time"
                                        value={venueDetails.opening_time}
                                        onChange={handleDetailsChange}
                                        required
                                        className="w-full py-3 pl-10 pr-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                    />
                                </div>

                                <div className="relative">
                                     <label htmlFor="closing_time" className="sr-only">Closing Time</label>
                                    <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-green text-sm" />
                                    <input
                                         id="closing_time"
                                        name="closing_time"
                                        type="time"
                                        value={venueDetails.closing_time}
                                        onChange={handleDetailsChange}
                                        required
                                        className="w-full py-3 pl-10 pr-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                     <label htmlFor="venueDescription" className="sr-only">Description</label>
                                    <textarea
                                         id="venueDescription"
                                        name="description"
                                        rows="3"
                                        value={venueDetails.description}
                                        onChange={handleDetailsChange}
                                        className="w-full py-3 px-4 bg-white/50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-green/30 focus:border-primary-green transition-all resize-none"
                                        placeholder="Description"
                                    />
                                </div>

                                {/* Replace Lat/Lng inputs with Map Picker */}
                                <div className="md:col-span-2">
                                    <LocationPickerMap
                                        initialPosition={initialMapPosition}
                                        onLocationSelect={setUpdatedLocation}
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

                {/* Facilities Tab (Content remains largely the same, ensure fetchVenueData updates facilities) */}
                 {activeTab === 'facilities' && (
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
                             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                 <div>
                                     <h2 className="text-xl font-bold text-slate-800">Facilities</h2>
                                     <p className="text-slate-600 text-sm">Manage your venue facilities</p>
                                 </div>
                                 <button
                                     onClick={() => setShowAddFacilityForm(!showAddFacilityForm)}
                                     className="bg-gradient-to-r from-primary-green to-emerald-500 text-white px-4 py-2 rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2 text-sm"
                                 >
                                     <FaPlus /> {showAddFacilityForm ? 'Cancel Adding' : 'Add Facility'}
                                 </button>
                             </div>
                        </div>

                         {/* Add Form */}
                         {showAddFacilityForm && (
                             <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                                 <div className="bg-gradient-to-r from-emerald-400 to-teal-400 p-4">
                                     <h3 className="font-bold text-white">Add New Facility</h3>
                                 </div>
                                <form onSubmit={handleAddFacility} className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                         <input
                                             name="name" type="text" value={newFacility.name} onChange={handleNewFacilityChange} required
                                             className="w-full py-2 px-3 bg-white/50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-green" placeholder="Facility Name *"
                                         />
                                         <select
                                             name="sport_id" value={newFacility.sport_id} onChange={handleNewFacilityChange} required
                                             className="w-full py-2 px-3 bg-white/50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-green"
                                         >
                                             <option value="">Select Sport *</option>
                                             {sports.map(s => <option key={s.sport_id} value={s.sport_id}>{s.name}</option>)}
                                         </select>
                                         <input
                                             name="capacity" type="number" min="1" value={newFacility.capacity} onChange={handleNewFacilityChange} required
                                             className="w-full py-2 px-3 bg-white/50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-green" placeholder="Capacity *"
                                         />
                                         <input
                                             name="hourly_rate" type="number" min="0" step="0.01" value={newFacility.hourly_rate} onChange={handleNewFacilityChange} required
                                             className="w-full py-2 px-3 bg-white/50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-green" placeholder="Rate (₹/hr) *"
                                         />
                                         <textarea
                                              name="description" rows="2" value={newFacility.description} onChange={handleNewFacilityChange}
                                              className="sm:col-span-2 lg:col-span-4 w-full py-2 px-3 bg-white/50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-green resize-none" placeholder="Description (Optional)"
                                          />
                                     </div>
                                     <div className="flex justify-end gap-3">
                                         <button type="button" onClick={() => setShowAddFacilityForm(false)} className="px-4 py-2 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm">Cancel</button>
                                         <button type="submit" className="bg-gradient-to-r from-primary-green to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 text-sm"><FaPlus /> Add</button>
                                     </div>
                                 </form>
                             </div>
                         )}

                         {/* Facilities List */}
                         <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                             <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-4">
                                 <h3 className="font-bold text-white">Your Facilities ({venue?.facilities?.length || 0})</h3>
                             </div>
                             <div className="p-6">
                                 {venue?.facilities?.length === 0 ? (
                                     <div className="text-center py-8">
                                         <div className="text-4xl text-slate-400 mb-2">🏟️</div>
                                         <p className="text-slate-600 font-medium">No facilities yet</p>
                                         <p className="text-slate-400 text-sm">Use the "Add Facility" button above.</p>
                                     </div>
                                 ) : (
                                     <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                         {venue.facilities.map(facility => (
                                             <div key={facility.facility_id} className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 hover:shadow-md transition-all group relative">
                                                  <button
                                                      onClick={() => handleDeleteFacility(facility.facility_id, facility.name)}
                                                      className="absolute top-2 right-2 text-red-400 hover:text-red-600 hover:bg-red-100 p-1.5 rounded-full transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                      aria-label={`Delete ${facility.name}`}
                                                  >
                                                      <FaTrash className="text-sm" />
                                                  </button>
                                                 <div className="flex-1 mb-3">
                                                     <h4 className="font-bold text-slate-800 mb-1">{facility.name}</h4>
                                                     <span className="px-2 py-1 bg-primary-green text-white text-xs rounded-full font-medium">
                                                         {facility.sports?.name || 'N/A'}
                                                     </span>
                                                 </div>
                                                 <div className="space-y-1 text-sm">
                                                     <div className="flex items-center text-slate-600"><FaUsers className="mr-2 text-primary-green text-xs" /><span>{facility.capacity} players</span></div>
                                                     <div className="flex items-center text-slate-600"><FaRupeeSign className="mr-2 text-primary-green text-xs" /><span>₹{facility.hourly_rate}/hour</span></div>
                                                     {facility.description && <p className="text-xs text-slate-500 pt-1">{facility.description}</p>}
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