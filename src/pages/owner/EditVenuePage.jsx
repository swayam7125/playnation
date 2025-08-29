import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { FaTrash, FaPlusCircle, FaPlus } from 'react-icons/fa';

function EditVenuePage() {
    const { venueId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details');
    const [venueDetails, setVenueDetails] = useState({
        name: '', address: '', city: '', state: '', zip_code: '',
        description: '', contact_email: '', contact_phone: '',
        opening_time: '', closing_time: ''
    });

    // State for handling image updates
    const [newImageFile, setNewImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    
    // New facility form state
    const [sports, setSports] = useState([]);
    const [showAddFacilityForm, setShowAddFacilityForm] = useState(false);
    const [newFacility, setNewFacility] = useState({
        name: '',
        sport_id: '',
        capacity: '',
        hourly_rate: '',
        description: ''
    });

    // Fetch sports for facility creation
    const fetchSports = async () => {
        try {
            const { data, error } = await supabase
                .from('sports')
                .select('sport_id, name')
                .order('name');
            if (error) throw error;
            setSports(data || []);
        } catch (err) {
            console.error("Error fetching sports:", err);
        }
    };

    const fetchVenue = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('venues')
                .select(`*, facilities(*, sports(name), time_slots(count))`)
                .eq('venue_id', venueId)
                .single();
            if (error) throw error;
            if (data.owner_id !== user.id) { navigate('/owner/dashboard'); return; }
            setVenue(data);
            setVenueDetails({
                name: data.name || '', address: data.address || '', city: data.city || '',
                state: data.state || '', zip_code: data.zip_code || '', description: data.description || '',
                contact_email: data.contact_email || '', contact_phone: data.contact_phone || '',
                opening_time: data.opening_time || '', closing_time: data.closing_time || '',
            });
        } catch (err) {
            console.error("Error fetching venue:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchVenue();
            fetchSports();
        }
    }, [user, venueId]);

    const handleDetailsChange = (e) => {
        setVenueDetails({ ...venueDetails, [e.target.name]: e.target.value });
    };

    const handleDetailsUpdate = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('venues').update(venueDetails).eq('venue_id', venueId);
        if (error) { alert(`Error updating details: ${error.message}`); } else { alert("Venue details updated successfully!"); }
    };
    
    // Handler for image file selection
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setNewImageFile(e.target.files[0]);
        }
    };

    // Handler for updating the image
    const handleImageUpdate = async () => {
        if (!newImageFile) {
            alert("Please select a new image to upload.");
            return;
        }
        setUploading(true);
        
        try {
            // Upload the new image first
            const fileExt = newImageFile.name.split('.').pop();
            const newFileName = `venue_${venueId}_${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('venue-images')
                .upload(newFileName, newImageFile);
            if (uploadError) throw uploadError;

            // Get the public URL of the new image
            const { data: urlData } = supabase.storage
                .from('venue-images')
                .getPublicUrl(newFileName);
            const newImageUrl = urlData.publicUrl;

            // Update the venue's image_url in the database
            const { error: dbError } = await supabase
                .from('venues')
                .update({ image_url: newImageUrl })
                .eq('venue_id', venueId);
            if (dbError) throw dbError;

            // If an old image exists, delete it (after successful update)
            if (venue.image_url) {
                const oldFileName = venue.image_url.split('/').pop();
                const { error: deleteError } = await supabase.rpc('delete_storage_object', {
                    bucket: 'venue-images',
                    object_path: oldFileName
                });
                if (deleteError) {
                    console.warn("Could not delete old image, please check storage policies.", deleteError);
                }
            }

            alert("Image updated successfully!");
            setNewImageFile(null);
            document.getElementById('new_image').value = ''; // Clear the file input
            
            fetchVenue(); // Refresh venue data to show new image
        } catch (error) {
            alert(`Error updating image: ${error.message}`);
            console.error("Full error:", error);
        } finally {
            setUploading(false);
        }
    };

    // Handler for deleting the image
    const handleImageDelete = async () => {
        if (!venue.image_url) {
            alert("There is no image to delete.");
            return;
        }
        if (window.confirm("Are you sure you want to delete the venue image? This action cannot be undone.")) {
            setUploading(true);
            try {
                // Delete the image file from storage using the RPC function
                const oldFileName = venue.image_url.split('/').pop();
                const { error: deleteError } = await supabase.rpc('delete_storage_object', {
                    bucket: 'venue-images',
                    object_path: oldFileName
                });
                if (deleteError) throw deleteError;

                // Set the image_url in the database to null
                const { error: dbError } = await supabase
                    .from('venues')
                    .update({ image_url: null })
                    .eq('venue_id', venueId);
                if (dbError) throw dbError;

                alert("Image deleted successfully!");
                fetchVenue(); // Refresh venue data
            } catch (error) {
                alert(`Error deleting image: ${error.message}`);
                console.error("Delete error details:", error);
            } finally {
                setUploading(false);
            }
        }
    };


    // New facility form handlers
    const handleNewFacilityChange = (e) => {
        setNewFacility({ ...newFacility, [e.target.name]: e.target.value });
    };

    const handleAddFacility = async (e) => {
        e.preventDefault();
        
        if (!newFacility.name.trim() || !newFacility.sport_id || !newFacility.capacity || !newFacility.hourly_rate) {
            alert("Please fill all required facility fields.");
            return;
        }

        try {
            const facilityData = {
                venue_id: venueId,
                name: newFacility.name.trim(),
                sport_id: newFacility.sport_id,
                capacity: parseInt(newFacility.capacity),
                hourly_rate: parseFloat(newFacility.hourly_rate),
                description: newFacility.description.trim() || null
            };
            const { error } = await supabase.from('facilities').insert([facilityData]);
            if (error) throw error;
            alert("Facility added successfully!");
            setNewFacility({ name: '', sport_id: '', capacity: '', hourly_rate: '', description: '' });
            setShowAddFacilityForm(false);
            fetchVenue();
        } catch (error) {
            alert(`Error adding facility: ${error.message}`);
        }
    };

    const handleDeleteFacility = async (facilityId, facilityName) => {
        if (window.confirm(`Are you sure you want to delete the facility "${facilityName}"? This will also delete all associated time slots and bookings. This action cannot be undone.`)) {
            try {
                const { error } = await supabase.from('facilities').delete().eq('facility_id', facilityId);
                if (error) throw error;
                alert("Facility deleted successfully!");
                fetchVenue();
            } catch (error) {
                alert(`Error deleting facility: ${error.message}`);
            }
        }
    };

    if (loading) return <p className="container">Loading...</p>;
    if (!venue) return <p className="container">Venue not found or you do not have permission to view it.</p>;

    return (
        <div className="container dashboard-page">
            <h1 className="section-heading">Edit: {venue.name}</h1>
            <div className="booking-tabs">
                <button onClick={() => setActiveTab('details')} className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}>Edit Details</button>
                <button onClick={() => setActiveTab('facilities')} className={`tab-btn ${activeTab === 'facilities' ? 'active' : ''}`}>Manage Facilities</button>
            </div>

            {activeTab === 'details' && (
                <form onSubmit={handleDetailsUpdate} className="auth-card venue-details-form">
                    {/* Image Update Section */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h3 className="form-section-title">Venue Image</h3>
                        <div className="form-group">
                            <label htmlFor="image">Current Image</label>
                            {venue.image_url ? (
                                <img src={venue.image_url} alt={venue.name} style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', marginBottom: '1rem' }} />
                            ) : (
                                <p>No image uploaded.</p>
                            )}
                        </div>
                        <div className="form-group">
                            <label htmlFor="new_image">Upload New Image</label>
                            <input id="new_image" type="file" accept="image/*" onChange={handleImageChange} />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                            <button type="button" onClick={handleImageUpdate} className="btn btn-secondary" disabled={uploading || !newImageFile}>
                                {uploading ? 'Uploading...' : 'Update Image'}
                            </button>
                            {venue.image_url && (
                                <button type="button" onClick={handleImageDelete} className="btn btn-danger" disabled={uploading}>
                                    {uploading ? 'Deleting...' : 'Delete Image'}
                                </button>
                            )}
                        </div>
                    </div>

                    <h3 className="form-section-title">Venue Details</h3>
                    <div className="form-grid">
                        <div className="form-group grid-col-span-2"><label htmlFor="name">Venue Name</label><input id="name" name="name" type="text" value={venueDetails.name} onChange={handleDetailsChange} /></div>
                        <div className="form-group grid-col-span-2"><label htmlFor="address">Address</label><input id="address" name="address" type="text" value={venueDetails.address} onChange={handleDetailsChange} /></div>
                        <div className="form-group"><label htmlFor="city">City</label><input id="city" name="city" type="text" value={venueDetails.city} onChange={handleDetailsChange} /></div>
                        <div className="form-group"><label htmlFor="state">State</label><input id="state" name="state" type="text" value={venueDetails.state} onChange={handleDetailsChange} /></div>
                        <div className="form-group"><label htmlFor="zip_code">Zip Code</label><input id="zip_code" name="zip_code" type="text" value={venueDetails.zip_code} onChange={handleDetailsChange} /></div>
                        <div className="form-group"><label htmlFor="contact_email">Contact Email</label><input id="contact_email" name="contact_email" type="email" value={venueDetails.contact_email} onChange={handleDetailsChange} /></div>
                        <div className="form-group"><label htmlFor="contact_phone">Contact Phone</label><input id="contact_phone" name="contact_phone" type="tel" value={venueDetails.contact_phone} onChange={handleDetailsChange} /></div>
                        <div className="form-group"><label htmlFor="opening_time">Opening Time</label><input id="opening_time" name="opening_time" type="time" value={venueDetails.opening_time} onChange={handleDetailsChange} /></div>
                        <div className="form-group"><label htmlFor="closing_time">Closing Time</label><input id="closing_time" name="closing_time" type="time" value={venueDetails.closing_time} onChange={handleDetailsChange} /></div>
                        <div className="form-group grid-col-span-2"><label htmlFor="description">Description</label><textarea id="description" name="description" rows="4" value={venueDetails.description} onChange={handleDetailsChange}></textarea></div>
                    </div>
                    <button type="submit" className="auth-submit-button">Save Changes</button>
                </form>
            )}

            {activeTab === 'facilities' && (
                <div className="facilities-manager">
                    <div className="facilities-header">
                        <h2>Manage Facilities</h2>
                        <button onClick={() => setShowAddFacilityForm(!showAddFacilityForm)} className="btn btn-primary add-facility-btn">
                            <FaPlus /> Add New Facility
                        </button>
                    </div>

                    {showAddFacilityForm && (
                        <div className="add-facility-form-container">
                            <form onSubmit={handleAddFacility} className="add-facility-form">
                                <h3>Add New Facility</h3>
                                <div className="form-grid">
                                    <div className="form-group"><label htmlFor="facility-name">Facility Name *</label><input id="facility-name" name="name" type="text" value={newFacility.name} onChange={handleNewFacilityChange} placeholder="e.g., Court 1, Field A" required /></div>
                                    <div className="form-group"><label htmlFor="facility-sport">Sport *</label><select id="facility-sport" name="sport_id" value={newFacility.sport_id} onChange={handleNewFacilityChange} required><option value="">Select a sport</option>{sports.map(sport => (<option key={sport.sport_id} value={sport.sport_id}>{sport.name}</option>))}</select></div>
                                    <div className="form-group"><label htmlFor="facility-capacity">Capacity *</label><input id="facility-capacity" name="capacity" type="number" min="1" value={newFacility.capacity} onChange={handleNewFacilityChange} placeholder="Max players" required /></div>
                                    <div className="form-group"><label htmlFor="facility-rate">Hourly Rate (₹) *</label><input id="facility-rate" name="hourly_rate" type="number" min="0" step="0.01" value={newFacility.hourly_rate} onChange={handleNewFacilityChange} placeholder="e.g., 500.00" required /></div>
                                    <div className="form-group grid-col-span-2"><label htmlFor="facility-description">Description</label><textarea id="facility-description" name="description" rows="3" value={newFacility.description} onChange={handleNewFacilityChange} placeholder="Optional description or special features" /></div>
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary"><FaPlusCircle /> Create Facility</button>
                                    <button type="button" onClick={() => setShowAddFacilityForm(false)} className="btn btn-secondary">Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="facilities-list">
                        <h3>Existing Facilities</h3>
                        {venue.facilities.length === 0 ? (
                            <p className="no-facilities-message">No facilities added yet. Create your first facility above!</p>
                        ) : (
                            <div className="facilities-grid">
                                {venue.facilities.map(facility => (
                                    <div key={facility.facility_id} className="facility-card">
                                        <div className="facility-header">
                                            <h4>{facility.name}</h4>
                                            <button onClick={() => handleDeleteFacility(facility.facility_id, facility.name)} className="delete-facility-btn" title="Delete facility"><FaTrash /></button>
                                        </div>
                                        <div className="facility-details">
                                            <p><strong>Sport:</strong> {facility.sports?.name || 'Unknown'}</p>
                                            <p><strong>Capacity:</strong> {facility.capacity} players</p>
                                            <p><strong>Hourly Rate:</strong> ₹{facility.hourly_rate}</p>
                                            {facility.description && (<p><strong>Description:</strong> {facility.description}</p>)}
                                            <p><strong>Time Slots:</strong> {(facility.time_slots[0]?.count) || 0} created</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditVenuePage;