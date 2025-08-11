import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';
import { FaTrash, FaPlusCircle } from 'react-icons/fa';

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

    const fetchVenue = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('venues').select('*, facilities(*, time_slots(*))').eq('venue_id', venueId).single();
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
        if (user) fetchVenue();
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
        if (window.confirm("Are you sure you want to delete this slot?")) {
            const { error } = await supabase.from('time_slots').delete().eq('slot_id', slotId);
            if (error) { alert(`Error deleting slot: ${error.message}`); } else { alert("Slot deleted."); fetchVenue(); }
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
    
    // --- THIS LOGIC IS UPDATED ---
    const daySchedule = useMemo(() => {
        if (!venue?.opening_time || !venue?.closing_time) {
            return []; // Return empty if venue times are not set
        }

        // Parse the opening and closing times to get hour numbers
        const openingHour = parseInt(venue.opening_time.split(':')[0], 10);
        const closingHour = parseInt(venue.closing_time.split(':')[0], 10);

        // Generate the schedule array only for the hours the venue is open
        const schedule = [];
        for (let i = openingHour; i < closingHour; i++) {
            schedule.push({ hour: i, slot: null, status: 'empty' });
        }

        // Fill in the schedule with existing slots
        const selectedFacility = venue?.facilities.find(f => f.facility_id === selectedFacilityId);
        if (selectedFacility) {
            selectedFacility.time_slots.forEach(slot => {
                const slotDate = new Date(slot.start_time).toISOString().split('T')[0];
                if (slotDate === selectedDate) {
                    const startHour = new Date(slot.start_time).getHours();
                    const scheduleIndex = schedule.findIndex(item => item.hour === startHour);
                    if (scheduleIndex !== -1) {
                        schedule[scheduleIndex] = { hour: startHour, slot: slot, status: slot.is_available ? 'available' : 'booked' };
                    }
                }
            });
        }
        return schedule;
    }, [venue, selectedFacilityId, selectedDate]);


    if (loading) return <p className="container">Loading...</p>;
    if (!venue) return <p className="container">Venue not found or you do not have permission to view it.</p>;

    return (
        <div className="container dashboard-page">
            <h1 className="section-heading">Edit: {venue.name}</h1>
            <div className="booking-tabs">
                <button onClick={() => setActiveTab('details')} className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}>Edit Details</button>
                <button onClick={() => setActiveTab('slots')} className={`tab-btn ${activeTab === 'slots' ? 'active' : ''}`}>Manage Time Slots</button>
            </div>

            {activeTab === 'details' && (
                <form onSubmit={handleDetailsUpdate} className="auth-card" style={{ margin: 'auto', maxWidth: '900px' }}>
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

            {activeTab === 'slots' && (
                <div className="slot-manager-container">
                    <div className="slot-manager-controls">
                        <div className="form-group"><label>Select Facility</label><select value={selectedFacilityId} onChange={e => setSelectedFacilityId(e.target.value)}>{venue.facilities.map(f => <option key={f.facility_id} value={f.facility_id}>{f.name}</option>)}</select></div>
                        <div className="form-group"><label>Select Date</label><input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} /></div>
                    </div>
                    <div className="day-view-grid">
                        {daySchedule.map(({ hour, slot, status }) => {
                            const isSelectedForCreation = slotsToCreate.has(hour);
                            let className = `hour-block ${status}`;
                            if (isSelectedForCreation) className += ' to-create';
                            return (
                                <div key={hour} className={className} onClick={() => status === 'empty' && toggleSlotForCreation(hour)}>
                                    <div className="hour-label">{hour}:00 - {hour + 1}:00</div>
                                    {status === 'empty' && (isSelectedForCreation ? <span className="status-text">Selected</span> : <span className="status-text">Click to Add</span>)}
                                    {status === 'available' && <span className="status-text">Available</span>}
                                    {status === 'booked' && <span className="status-text">Booked</span>}
                                    {status !== 'empty' && <button onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slot.slot_id); }} className="delete-slot-btn"><FaTrash /></button>}
                                </div>
                            );
                        })}
                    </div>
                    {slotsToCreate.size > 0 && (
                        <div className="bulk-add-bar">
                            <span>{slotsToCreate.size} new slot(s) selected.</span>
                            <button onClick={handleBulkAddSlots} className="btn btn-primary"><FaPlusCircle />Create Selected Slots</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default EditVenuePage;