import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Corrected Path
import { useAuth } from '../../AuthContext'; // Corrected Path
import { FaTrash, FaPlusCircle, FaTimesCircle, FaPlus, FaEdit, FaBan, FaCheck, FaTimes } from 'react-icons/fa';

const getTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const todayWithOffset = new Date(today.getTime() - (offset * 60 * 1000));
    return todayWithOffset.toISOString().split('T')[0];
};

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
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [selectedFacilityId, setSelectedFacilityId] = useState(null);
    const [slotsToCreate, setSlotsToCreate] = useState(new Set());
    
    // New states for custom pricing and blocking
    const [editingSlot, setEditingSlot] = useState(null);
    const [customPrice, setCustomPrice] = useState('');
    const [blockReason, setBlockReason] = useState('');
    const [showBlockForm, setShowBlockForm] = useState(false);
    const [slotToBlock, setSlotToBlock] = useState(null);
    
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
                .select(`*, facilities(*, sports(name), time_slots(*, bookings(booking_id)))`)
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
            if (data.facilities.length > 0 && !selectedFacilityId) {
                setSelectedFacilityId(data.facilities[0].facility_id);
            }
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

    const handleDeleteSlot = async (slotId) => {
        if (window.confirm("Are you sure you want to delete this available slot?")) {
            const { error } = await supabase.from('time_slots').delete().eq('slot_id', slotId);
            if (error) { alert(`Error deleting slot: ${error.message}`); } else { alert("Slot deleted."); fetchVenue(); }
        }
    };

    const handleOwnerCancelBooking = async (bookingId, slotId) => {
        if (window.confirm("Are you sure you want to cancel this user's booking? This action cannot be undone.")) {
            try {
                const { error: bookingError } = await supabase.from('bookings').update({ status: 'cancelled', payment_status: 'refunded', cancelled_by: user.id }).eq('booking_id', bookingId);
                if (bookingError) throw bookingError;
                const { error: slotError } = await supabase.from('time_slots').update({ is_available: true }).eq('slot_id', slotId);
                if (slotError) throw slotError;
                alert("Booking has been cancelled and the slot is now available.");
                fetchVenue(); 
            } catch (error) {
                alert(`Error cancelling booking: ${error.message}`);
            }
        }
    };

    // Custom pricing handlers
    const handleEditPrice = (slot) => {
        setEditingSlot(slot.slot_id);
        setCustomPrice(slot.price_override || '');
    };

    const handleSavePrice = async (slotId) => {
        try {
            const priceValue = customPrice.trim() === '' ? null : parseFloat(customPrice);
            if (customPrice.trim() !== '' && (isNaN(priceValue) || priceValue < 0)) {
                alert("Please enter a valid price (or leave empty to use default rate).");
                return;
            }

            const { error } = await supabase
                .from('time_slots')
                .update({ price_override: priceValue })
                .eq('slot_id', slotId);

            if (error) throw error;

            alert("Price updated successfully!");
            setEditingSlot(null);
            setCustomPrice('');
            fetchVenue();
        } catch (error) {
            alert(`Error updating price: ${error.message}`);
        }
    };

    const handleCancelPriceEdit = () => {
        setEditingSlot(null);
        setCustomPrice('');
    };

    // Blocking handlers
    const handleBlockSlot = (slot) => {
        setSlotToBlock(slot);
        setBlockReason('');
        setShowBlockForm(true);
    };

    const handleConfirmBlock = async () => {
        try {
            const { error } = await supabase
                .from('time_slots')
                .update({ 
                    is_available: false, 
                    block_reason: blockReason.trim() || 'Blocked by owner'
                })
                .eq('slot_id', slotToBlock.slot_id);

            if (error) throw error;

            alert("Slot blocked successfully!");
            setShowBlockForm(false);
            setSlotToBlock(null);
            setBlockReason('');
            fetchVenue();
        } catch (error) {
            alert(`Error blocking slot: ${error.message}`);
        }
    };

    const handleUnblockSlot = async (slotId) => {
        if (window.confirm("Are you sure you want to unblock this slot and make it available for booking?")) {
            try {
                const { error } = await supabase
                    .from('time_slots')
                    .update({ 
                        is_available: true, 
                        block_reason: null 
                    })
                    .eq('slot_id', slotId);

                if (error) throw error;

                alert("Slot unblocked successfully!");
                fetchVenue();
            } catch (error) {
                alert(`Error unblocking slot: ${error.message}`);
            }
        }
    };

    const toggleSlotForCreation = (hour) => {
        setSlotsToCreate(prev => {
            const newSlots = new Set(prev);
            if (newSlots.has(hour)) { newSlots.delete(hour); } else { newSlots.add(hour); }
            return newSlots;
        });
    };
    
    const handleBulkAddSlots = async () => {
        if (slotsToCreate.size === 0) { alert("Please select one or more empty slots to add."); return; }
        const slotsToInsert = Array.from(slotsToCreate).map(hour => ({
            facility_id: selectedFacilityId,
            start_time: `${selectedDate}T${hour.toString().padStart(2, '0')}:00:00`,
            end_time: `${selectedDate}T${(hour + 1).toString().padStart(2, '0')}:00:00`,
        }));
        const { error } = await supabase.from('time_slots').insert(slotsToInsert);
        if (error) { alert(`Error adding slots: ${error.message}`); } else { alert(`${slotsToInsert.length} slot(s) added successfully!`); setSlotsToCreate(new Set()); fetchVenue(); }
    };

    // New facility form handlers
    const handleNewFacilityChange = (e) => {
        setNewFacility({ ...newFacility, [e.target.name]: e.target.value });
    };

    const handleAddFacility = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!newFacility.name.trim()) {
            alert("Please enter a facility name.");
            return;
        }
        if (!newFacility.sport_id) {
            alert("Please select a sport.");
            return;
        }
        if (!newFacility.capacity || newFacility.capacity <= 0) {
            alert("Please enter a valid capacity.");
            return;
        }
        if (!newFacility.hourly_rate || newFacility.hourly_rate <= 0) {
            alert("Please enter a valid hourly rate.");
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

            const { error } = await supabase
                .from('facilities')
                .insert([facilityData]);

            if (error) throw error;

            alert("Facility added successfully!");
            
            // Reset form and hide it
            setNewFacility({
                name: '',
                sport_id: '',
                capacity: '',
                hourly_rate: '',
                description: ''
            });
            setShowAddFacilityForm(false);
            
            // Refresh venue data
            fetchVenue();
        } catch (error) {
            alert(`Error adding facility: ${error.message}`);
        }
    };

    const handleDeleteFacility = async (facilityId, facilityName) => {
        if (window.confirm(`Are you sure you want to delete the facility "${facilityName}"? This will also delete all associated time slots and bookings. This action cannot be undone.`)) {
            try {
                const { error } = await supabase
                    .from('facilities')
                    .delete()
                    .eq('facility_id', facilityId);

                if (error) throw error;

                alert("Facility deleted successfully!");
                
                // Reset selected facility if it was the deleted one
                if (selectedFacilityId === facilityId) {
                    setSelectedFacilityId(null);
                }
                
                fetchVenue();
            } catch (error) {
                alert(`Error deleting facility: ${error.message}`);
            }
        }
    };
    
    const daySchedule = useMemo(() => {
        if (!venue?.opening_time || !venue?.closing_time) return [];
        const openingHour = parseInt(venue.opening_time.split(':')[0], 10);
        const closingHour = parseInt(venue.closing_time.split(':')[0], 10);
        const schedule = [];
        for (let i = openingHour; i < closingHour; i++) {
            schedule.push({ hour: i, slot: null, status: 'empty' });
        }
        const selectedFacility = venue?.facilities.find(f => f.facility_id === selectedFacilityId);
        if (selectedFacility) {
            const sortedTimeSlots = [...selectedFacility.time_slots].sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
            sortedTimeSlots.forEach(slot => {
                const slotDate = new Date(slot.start_time).toISOString().split('T')[0];
                if (slotDate === selectedDate) {
                    const startHour = new Date(slot.start_time).getHours();
                    const scheduleIndex = schedule.findIndex(item => item.hour === startHour);
                    if (scheduleIndex !== -1) {
                        const bookingForSlot = (slot.bookings || [])[0];
                        let status;
                        if (bookingForSlot) {
                            status = 'booked';
                        } else if (!slot.is_available) {
                            status = 'blocked';
                        } else {
                            status = 'available';
                        }
                        schedule[scheduleIndex] = { 
                            hour: startHour, 
                            slot: slot, 
                            status, 
                            booking_id: bookingForSlot?.booking_id 
                        };
                    }
                }
            });
        }
        return schedule;
    }, [venue, selectedFacilityId, selectedDate]);

    // Get current facility for default rate display
    const currentFacility = venue?.facilities.find(f => f.facility_id === selectedFacilityId);

    if (loading) return <p className="container">Loading...</p>;
    if (!venue) return <p className="container">Venue not found or you do not have permission to view it.</p>;

    return (
        <div className="container dashboard-page">
            <h1 className="section-heading">Edit: {venue.name}</h1>
            <div className="booking-tabs">
                <button onClick={() => setActiveTab('details')} className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}>Edit Details</button>
                <button onClick={() => setActiveTab('facilities')} className={`tab-btn ${activeTab === 'facilities' ? 'active' : ''}`}>Manage Facilities</button>
                <button onClick={() => setActiveTab('slots')} className={`tab-btn ${activeTab === 'slots' ? 'active' : ''}`}>Manage Time Slots</button>
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
                        <button 
                            onClick={() => setShowAddFacilityForm(!showAddFacilityForm)}
                            className="btn btn-primary add-facility-btn"
                        >
                            <FaPlus /> Add New Facility
                        </button>
                    </div>

                    {showAddFacilityForm && (
                        <div className="add-facility-form-container">
                            <form onSubmit={handleAddFacility} className="add-facility-form">
                                <h3>Add New Facility</h3>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="facility-name">Facility Name *</label>
                                        <input 
                                            id="facility-name"
                                            name="name" 
                                            type="text" 
                                            value={newFacility.name}
                                            onChange={handleNewFacilityChange}
                                            placeholder="e.g., Court 1, Field A"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="facility-sport">Sport *</label>
                                        <select 
                                            id="facility-sport"
                                            name="sport_id" 
                                            value={newFacility.sport_id}
                                            onChange={handleNewFacilityChange}
                                            required
                                        >
                                            <option value="">Select a sport</option>
                                            {sports.map(sport => (
                                                <option key={sport.sport_id} value={sport.sport_id}>
                                                    {sport.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="facility-capacity">Capacity *</label>
                                        <input 
                                            id="facility-capacity"
                                            name="capacity" 
                                            type="number" 
                                            min="1"
                                            value={newFacility.capacity}
                                            onChange={handleNewFacilityChange}
                                            placeholder="Max players"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group">
                                        <label htmlFor="facility-rate">Hourly Rate (₹) *</label>
                                        <input 
                                            id="facility-rate"
                                            name="hourly_rate" 
                                            type="number" 
                                            min="0"
                                            step="0.01"
                                            value={newFacility.hourly_rate}
                                            onChange={handleNewFacilityChange}
                                            placeholder="e.g., 500.00"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="form-group grid-col-span-2">
                                        <label htmlFor="facility-description">Description</label>
                                        <textarea 
                                            id="facility-description"
                                            name="description" 
                                            rows="3"
                                            value={newFacility.description}
                                            onChange={handleNewFacilityChange}
                                            placeholder="Optional description or special features"
                                        />
                                    </div>
                                </div>
                                
                                <div className="form-actions">
                                    <button type="submit" className="btn btn-primary">
                                        <FaPlusCircle /> Create Facility
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowAddFacilityForm(false)}
                                        className="btn btn-secondary"
                                    >
                                        Cancel
                                    </button>
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
                                            <button 
                                                onClick={() => handleDeleteFacility(facility.facility_id, facility.name)}
                                                className="delete-facility-btn"
                                                title="Delete facility"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                        <div className="facility-details">
                                            <p><strong>Sport:</strong> {facility.sports?.name || 'Unknown'}</p>
                                            <p><strong>Capacity:</strong> {facility.capacity} players</p>
                                            <p><strong>Hourly Rate:</strong> ₹{facility.hourly_rate}</p>
                                            {facility.description && (
                                                <p><strong>Description:</strong> {facility.description}</p>
                                            )}
                                            <p><strong>Time Slots:</strong> {facility.time_slots?.length || 0} created</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'slots' && (
                <div className="slot-manager-container">
                    {venue.facilities.length === 0 ? (
                        <div className="no-facilities-warning">
                            <p>No facilities available. Please add facilities first before managing time slots.</p>
                            <button 
                                onClick={() => setActiveTab('facilities')}
                                className="btn btn-primary"
                            >
                                <FaPlus /> Add Facilities
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="slot-manager-controls">
                                <div className="form-group">
                                    <label>Select Facility</label>
                                    <select value={selectedFacilityId || ''} onChange={e => setSelectedFacilityId(e.target.value)}>
                                        <option value="">Select a facility</option>
                                        {venue.facilities.map(f => (
                                            <option key={f.facility_id} value={f.facility_id}>
                                                {f.name} ({f.sports?.name}) - Default: ₹{f.hourly_rate}/hr
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Select Date</label>
                                    <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                                </div>
                            </div>
                            
                            {selectedFacilityId && (
                                <div className="day-view-grid">
                                    {daySchedule.map(({ hour, slot, status, booking_id }) => {
                                        const isSelectedForCreation = slotsToCreate.has(hour);
                                        let className = `hour-block ${status}`;
                                        if (isSelectedForCreation) className += ' to-create';
                                        
                                        return (
                                            <div key={hour} className={className} onClick={() => status === 'empty' && toggleSlotForCreation(hour)}>
                                                <div className="hour-label">{hour}:00 - {hour + 1}:00</div>
                                                
                                                {status === 'empty' && (
                                                    isSelectedForCreation ? 
                                                    <span className="status-text">Selected</span> : 
                                                    <span className="status-text">Click to Add</span>
                                                )}
                                                
                                                {status === 'available' && (
                                                    <div className="slot-details">
                                                        <div className="slot-info">
                                                            <span className="status-text">Available</span>
                                                            <div className="price-display">
                                                                {editingSlot === slot.slot_id ? (
                                                                    <div className="price-edit-form">
                                                                        <input
                                                                            type="number"
                                                                            value={customPrice}
                                                                            onChange={(e) => setCustomPrice(e.target.value)}
                                                                            placeholder={`Default: ₹${currentFacility?.hourly_rate}`}
                                                                            className="price-input"
                                                                            step="0.01"
                                                                            min="0"
                                                                        />
                                                                        <div className="price-edit-actions">
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); handleSavePrice(slot.slot_id); }}
                                                                                className="save-price-btn"
                                                                                title="Save price"
                                                                            >
                                                                                <FaCheck />
                                                                            </button>
                                                                            <button
                                                                                onClick={(e) => { e.stopPropagation(); handleCancelPriceEdit(); }}
                                                                                className="cancel-price-btn"
                                                                                title="Cancel"
                                                                            >
                                                                                <FaTimes />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="price-info">
                                                                        <span className="price-amount">
                                                                            ₹{slot.price_override || currentFacility?.hourly_rate}
                                                                            {slot.price_override && (
                                                                                <span className="custom-price-indicator">(Custom)</span>
                                                                            )}
                                                                        </span>
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); handleEditPrice(slot); }}
                                                                            className="edit-price-btn"
                                                                            title="Edit price"
                                                                        >
                                                                            <FaEdit />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="slot-actions">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleBlockSlot(slot); }}
                                                                className="block-slot-btn"
                                                                title="Block this slot"
                                                            >
                                                                <FaBan />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slot.slot_id); }} 
                                                                className="delete-slot-btn"
                                                                title="Delete slot"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {status === 'booked' && (
                                                    <div className="slot-details">
                                                        <span className="status-text">Booked</span>
                                                        <div className="price-display">
                                                            <span className="price-amount">
                                                                ₹{slot.price_override || currentFacility?.hourly_rate}
                                                            </span>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleOwnerCancelBooking(booking_id, slot.slot_id); }} 
                                                            className="delete-slot-btn" 
                                                            title="Cancel this user's booking"
                                                        >
                                                            <FaTimesCircle />
                                                        </button>
                                                    </div>
                                                )}
                                                
                                                {status === 'blocked' && (
                                                    <div className="slot-details">
                                                        <span className="status-text blocked">Blocked</span>
                                                        <div className="block-reason">
                                                            {slot.block_reason && (
                                                                <small className="block-reason-text">
                                                                    Reason: {slot.block_reason}
                                                                </small>
                                                            )}
                                                        </div>
                                                        <div className="slot-actions">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleUnblockSlot(slot.slot_id); }}
                                                                className="unblock-slot-btn"
                                                                title="Unblock this slot"
                                                            >
                                                                <FaCheck />
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slot.slot_id); }} 
                                                                className="delete-slot-btn"
                                                                title="Delete slot"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            
                            {slotsToCreate.size > 0 && (
                                <div className="bulk-add-bar">
                                    <span>{slotsToCreate.size} new slot(s) selected.</span>
                                    <button onClick={handleBulkAddSlots} className="btn btn-primary">
                                        <FaPlusCircle />Create Selected Slots
                                    </button>
                                </div>
                            )}

                            {/* Block Slot Modal */}
                            {showBlockForm && (
                                <div className="modal-overlay">
                                    <div className="modal-content">
                                        <h3>Block Time Slot</h3>
                                        <p>Block slot: {slotToBlock?.hour || new Date(slotToBlock?.start_time).getHours()}:00 - {(slotToBlock?.hour || new Date(slotToBlock?.start_time).getHours()) + 1}:00</p>
                                        
                                        <div className="form-group">
                                            <label htmlFor="block-reason">Reason for blocking (optional)</label>
                                            <select 
                                                id="block-reason"
                                                value={blockReason}
                                                onChange={(e) => setBlockReason(e.target.value)}
                                                className="block-reason-select"
                                            >
                                                <option value="">Select a reason</option>
                                                <option value="Maintenance">Maintenance</option>
                                                <option value="Private Event">Private Event</option>
                                                <option value="Staff Training">Staff Training</option>
                                                <option value="Equipment Repair">Equipment Repair</option>
                                                <option value="Weather Conditions">Weather Conditions</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        
                                        {blockReason === 'Other' && (
                                            <div className="form-group">
                                                <label htmlFor="custom-reason">Custom reason</label>
                                                <input
                                                    id="custom-reason"
                                                    type="text"
                                                    value={blockReason === 'Other' ? '' : blockReason}
                                                    onChange={(e) => setBlockReason(e.target.value)}
                                                    placeholder="Enter custom reason"
                                                />
                                            </div>
                                        )}
                                        
                                        <div className="modal-actions">
                                            <button onClick={handleConfirmBlock} className="btn btn-primary">
                                                <FaBan /> Block Slot
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setShowBlockForm(false);
                                                    setSlotToBlock(null);
                                                    setBlockReason('');
                                                }}
                                                className="btn btn-secondary"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default EditVenuePage;