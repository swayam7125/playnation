import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { useModal } from '../../ModalContext';
import { FaTrash, FaPlusCircle, FaPlus } from 'react-icons/fa';

function EditVenuePage() {
    const { venueId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { showModal } = useModal();
    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('details');
    const [venueDetails, setVenueDetails] = useState({
        name: '', address: '', city: '', state: '', zip_code: '',
        description: '', contact_email: '', contact_phone: '',
        opening_time: '', closing_time: ''
    });
    
    const [sports, setSports] = useState([]);
    const [showAddFacilityForm, setShowAddFacilityForm] = useState(false);
    const [newFacility, setNewFacility] = useState({
        name: '',
        sport_id: '',
        capacity: '',
        hourly_rate: '',
        description: ''
    });

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
        if (error) { 
            await showModal({ type: 'error', title: 'Update Error', message: `Error updating details: ${error.message}` });
        } else { 
            await showModal({ type: 'info', title: 'Success', message: "Venue details updated successfully!" });
        }
    };
    
    const handleNewFacilityChange = (e) => {
        setNewFacility({ ...newFacility, [e.target.name]: e.target.value });
    };

    const handleAddFacility = async (e) => {
        e.preventDefault();
        
        if (!newFacility.name.trim() || !newFacility.sport_id || !newFacility.capacity || !newFacility.hourly_rate) {
            await showModal({ type: 'error', title: 'Missing Fields', message: "Please fill all required facility fields." });
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
            await showModal({ type: 'info', title: 'Success', message: "Facility added successfully!" });
            setNewFacility({ name: '', sport_id: '', capacity: '', hourly_rate: '', description: '' });
            setShowAddFacilityForm(false);
            fetchVenue();
        } catch (error) {
            await showModal({ type: 'error', title: 'Error', message: `Error adding facility: ${error.message}` });
        }
    };

    const handleDeleteFacility = async (facilityId, facilityName) => {
        const confirmed = await showModal({
            type: 'confirm',
            title: 'Confirm Deletion',
            message: `Are you sure you want to delete the facility "${facilityName}"? This will also delete all associated time slots and bookings. This action cannot be undone.`,
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });

        if (confirmed) {
            try {
                const { error } = await supabase.from('facilities').delete().eq('facility_id', facilityId);
                if (error) throw error;
                await showModal({ type: 'info', title: 'Success', message: "Facility deleted successfully!" });
                fetchVenue();
            } catch (error) {
                await showModal({ type: 'error', title: 'Error', message: `Error deleting facility: ${error.message}` });
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
                        <button onClick={() => setShowAddFacilityForm(!showAddFacilityForm)} className="btn btn-primary add-facility-btn"><FaPlus /> Add New Facility</button>
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