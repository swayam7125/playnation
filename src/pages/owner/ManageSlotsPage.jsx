import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { useModal } from '../../ModalContext';
import { FaTrash, FaPlusCircle, FaTimesCircle, FaPlus, FaEdit, FaBan, FaCheck, FaTimes } from 'react-icons/fa';

const getTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const todayWithOffset = new Date(today.getTime() - (offset * 60 * 1000));
    return todayWithOffset.toISOString().split('T')[0];
};

function ManageSlotsPage() {
    const { user } = useAuth();
    const { showModal } = useModal();
    const [loading, setLoading] = useState(true);
    const [venues, setVenues] = useState([]);
    const [selectedVenueId, setSelectedVenueId] = useState('');
    const [selectedFacilityId, setSelectedFacilityId] = useState('');
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [slotsToCreate, setSlotsToCreate] = useState(new Set());
    
    const [editingSlot, setEditingSlot] = useState(null);
    const [customPrice, setCustomPrice] = useState('');
    const [blockReason, setBlockReason] = useState('');
    const [showBlockForm, setShowBlockForm] = useState(false);
    const [slotToBlock, setSlotToBlock] = useState(null);

    const fetchOwnerVenues = async () => {
        if (!user) { setLoading(false); return; }
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('venues')
                .select(`*, facilities(*, sports(name), time_slots(*, bookings(booking_id)))`)
                .eq('owner_id', user.id);
            if (error) throw error;
            setVenues(data || []);
            if (data && data.length > 0 && !selectedVenueId) {
                setSelectedVenueId(data[0].venue_id);
                if (data[0].facilities && data[0].facilities.length > 0) {
                    setSelectedFacilityId(data[0].facilities[0].facility_id);
                }
            }
        } catch (err) {
            console.error("Error fetching venues:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOwnerVenues();
        }
    }, [user]);

    const handleVenueChange = (e) => {
        const newVenueId = e.target.value;
        setSelectedVenueId(newVenueId);
        const venue = venues.find(v => v.venue_id === newVenueId);
        if (venue && venue.facilities.length > 0) {
            setSelectedFacilityId(venue.facilities[0].facility_id);
        } else {
            setSelectedFacilityId('');
        }
    };

    const handleDeleteSlot = async (slotId) => {
        const confirmed = await showModal({
            type: 'confirm',
            title: 'Confirm Deletion',
            message: "Are you sure you want to delete this available slot?",
            confirmText: 'Delete'
        });
        if (confirmed) {
            const { error } = await supabase.from('time_slots').delete().eq('slot_id', slotId);
            if (error) {
                await showModal({ type: 'error', title: 'Error', message: `Error deleting slot: ${error.message}` });
            } else {
                await showModal({ type: 'info', title: 'Success', message: 'Slot deleted.' });
                fetchOwnerVenues();
            }
        }
    };

    const handleOwnerCancelBooking = async (bookingId, slotId) => {
        const confirmed = await showModal({
            type: 'confirm',
            title: 'Confirm Cancellation',
            message: "Are you sure you want to cancel this user's booking? This action cannot be undone.",
            confirmText: 'Cancel Booking'
        });
        if (confirmed) {
            try {
                const { error: bookingError } = await supabase.from('bookings').update({ status: 'cancelled', payment_status: 'refunded', cancelled_by: user.id }).eq('booking_id', bookingId);
                if (bookingError) throw bookingError;
                const { error: slotError } = await supabase.from('time_slots').update({ is_available: true }).eq('slot_id', slotId);
                if (slotError) throw slotError;
                await showModal({ type: 'info', title: 'Success', message: "Booking has been cancelled and the slot is now available." });
                fetchOwnerVenues(); 
            } catch (error) {
                await showModal({ type: 'error', title: 'Error', message: `Error cancelling booking: ${error.message}` });
            }
        }
    };

    const handleEditPrice = (slot) => {
        setEditingSlot(slot.slot_id);
        setCustomPrice(slot.price_override || '');
    };

    const handleSavePrice = async (slotId) => {
        try {
            const priceValue = customPrice.trim() === '' ? null : parseFloat(customPrice);
            if (customPrice.trim() !== '' && (isNaN(priceValue) || priceValue < 0)) {
                await showModal({ type: 'error', title: 'Invalid Price', message: "Please enter a valid price (or leave empty to use default rate)." });
                return;
            }
            const { error } = await supabase.from('time_slots').update({ price_override: priceValue }).eq('slot_id', slotId);
            if (error) throw error;
            await showModal({ type: 'info', title: 'Success', message: "Price updated successfully!" });
            setEditingSlot(null);
            setCustomPrice('');
            fetchOwnerVenues();
        } catch (error) {
            await showModal({ type: 'error', title: 'Error', message: `Error updating price: ${error.message}` });
        }
    };

    const handleCancelPriceEdit = () => {
        setEditingSlot(null);
        setCustomPrice('');
    };

    const handleBlockSlot = (slot) => {
        setSlotToBlock(slot);
        setBlockReason('');
        setShowBlockForm(true);
    };

    const handleConfirmBlock = async () => {
        try {
            const { error } = await supabase.from('time_slots').update({ 
                is_available: false, 
                block_reason: blockReason.trim() || 'Blocked by owner'
            }).eq('slot_id', slotToBlock.slot_id);
            if (error) throw error;
            await showModal({ type: 'info', title: 'Success', message: "Slot blocked successfully!" });
            setShowBlockForm(false);
            setSlotToBlock(null);
            setBlockReason('');
            fetchOwnerVenues();
        } catch (error) {
            await showModal({ type: 'error', title: 'Error', message: `Error blocking slot: ${error.message}` });
        }
    };

    const handleUnblockSlot = async (slotId) => {
        const confirmed = await showModal({
            type: 'confirm',
            title: 'Confirm Unblock',
            message: 'Are you sure you want to unblock this slot and make it available for booking?',
            confirmText: 'Unblock'
        });
        if (confirmed) {
            try {
                const { error } = await supabase.from('time_slots').update({ 
                    is_available: true, 
                    block_reason: null 
                }).eq('slot_id', slotId);
                if (error) throw error;
                await showModal({ type: 'info', title: 'Success', message: "Slot unblocked successfully!" });
                fetchOwnerVenues();
            } catch (error) {
                await showModal({ type: 'error', title: 'Error', message: `Error unblocking slot: ${error.message}` });
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
        if (slotsToCreate.size === 0) { 
            await showModal({ type: 'info', title: 'No Slots Selected', message: "Please select one or more empty slots to add." });
            return;
        }
        const slotsToInsert = Array.from(slotsToCreate).map(hour => ({
            facility_id: selectedFacilityId,
            start_time: `${selectedDate}T${hour.toString().padStart(2, '0')}:00:00`,
            end_time: `${selectedDate}T${(hour + 1).toString().padStart(2, '0')}:00:00`,
        }));
        const { error } = await supabase.from('time_slots').insert(slotsToInsert);
        if (error) {
            await showModal({ type: 'error', title: 'Error', message: `Error adding slots: ${error.message}` });
        } else {
            await showModal({ type: 'info', title: 'Success', message: `${slotsToInsert.length} slot(s) added successfully!` });
            setSlotsToCreate(new Set());
            fetchOwnerVenues();
        }
    };
    
    const selectedVenue = venues.find(v => v.venue_id === selectedVenueId);

    const daySchedule = useMemo(() => {
        if (!selectedVenue?.opening_time || !selectedVenue?.closing_time) return [];
        const openingHour = parseInt(selectedVenue.opening_time.split(':')[0], 10);
        const closingHour = parseInt(selectedVenue.closing_time.split(':')[0], 10);
        const schedule = [];
        for (let i = openingHour; i < closingHour; i++) {
            schedule.push({ hour: i, slot: null, status: 'empty' });
        }
        const selectedFacility = selectedVenue?.facilities.find(f => f.facility_id === selectedFacilityId);
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
    }, [selectedVenue, selectedFacilityId, selectedDate]);

    const currentFacility = selectedVenue?.facilities.find(f => f.facility_id === selectedFacilityId);

    if (loading) return <p className="container">Loading...</p>;

    return (
        <div className="container dashboard-page">
            <h1 className="section-heading">Manage Time Slots</h1>
            <div className="slot-manager-container">
                {venues.length === 0 ? (
                    <div className="no-facilities-warning">
                        <p>No venues found. Please add a venue first.</p>
                    </div>
                ) : (
                    <>
                        <div className="slot-manager-controls">
                            <div className="form-group">
                                <label>Select Venue</label>
                                <select value={selectedVenueId} onChange={handleVenueChange}>
                                    {venues.map(v => (
                                        <option key={v.venue_id} value={v.venue_id}>{v.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Select Facility</label>
                                <select value={selectedFacilityId} onChange={e => setSelectedFacilityId(e.target.value)} disabled={!selectedVenueId}>
                                    <option value="">Select a facility</option>
                                    {selectedVenue?.facilities.map(f => (
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
                        
                        {selectedFacilityId ? (
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
                                                                            className="save-price-btn" title="Save price"
                                                                        ><FaCheck /></button>
                                                                        <button
                                                                            onClick={(e) => { e.stopPropagation(); handleCancelPriceEdit(); }}
                                                                            className="cancel-price-btn" title="Cancel"
                                                                        ><FaTimes /></button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="price-info">
                                                                    <span className="price-amount">
                                                                        ₹{slot.price_override || currentFacility?.hourly_rate}
                                                                        {slot.price_override && <span className="custom-price-indicator">(Custom)</span>}
                                                                    </span>
                                                                    <button
                                                                        onClick={(e) => { e.stopPropagation(); handleEditPrice(slot); }}
                                                                        className="edit-price-btn" title="Edit price"
                                                                    ><FaEdit /></button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="slot-actions">
                                                        <button onClick={(e) => { e.stopPropagation(); handleBlockSlot(slot); }} className="block-slot-btn" title="Block this slot"><FaBan /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slot.slot_id); }} className="delete-slot-btn" title="Delete slot"><FaTrash /></button>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {status === 'booked' && (
                                                <div className="slot-details">
                                                    <span className="status-text">Booked</span>
                                                    <div className="price-display">
                                                        <span className="price-amount">₹{slot.price_override || currentFacility?.hourly_rate}</span>
                                                    </div>
                                                    <button onClick={(e) => { e.stopPropagation(); handleOwnerCancelBooking(booking_id, slot.slot_id); }} className="delete-slot-btn" title="Cancel this user's booking"><FaTimesCircle /></button>
                                                </div>
                                            )}
                                            
                                            {status === 'blocked' && (
                                                <div className="slot-details">
                                                    <span className="status-text blocked">Blocked</span>
                                                    <div className="block-reason">
                                                        {slot.block_reason && <small className="block-reason-text">Reason: {slot.block_reason}</small>}
                                                    </div>
                                                    <div className="slot-actions">
                                                        <button onClick={(e) => { e.stopPropagation(); handleUnblockSlot(slot.slot_id); }} className="unblock-slot-btn" title="Unblock this slot"><FaCheck /></button>
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteSlot(slot.slot_id); }} className="delete-slot-btn" title="Delete slot"><FaTrash /></button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>Please select a venue and facility to see the time slots.</p>
                        )}
                        
                        {slotsToCreate.size > 0 && (
                            <div className="bulk-add-bar">
                                <span>{slotsToCreate.size} new slot(s) selected.</span>
                                <button onClick={handleBulkAddSlots} className="btn btn-primary"><FaPlusCircle />Create Selected Slots</button>
                            </div>
                        )}

                        {showBlockForm && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h3>Block Time Slot</h3>
                                    <p>Block slot: {new Date(slotToBlock?.start_time).getHours()}:00 - {new Date(slotToBlock?.start_time).getHours() + 1}:00</p>
                                    <div className="form-group">
                                        <label htmlFor="block-reason">Reason for blocking (optional)</label>
                                        <select id="block-reason" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} className="block-reason-select">
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
                                            <input id="custom-reason" type="text" value={blockReason === 'Other' ? '' : blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Enter custom reason" />
                                        </div>
                                    )}
                                    <div className="modal-actions">
                                        <button onClick={handleConfirmBlock} className="btn btn-primary"><FaBan /> Block Slot</button>
                                        <button onClick={() => { setShowBlockForm(false); setSlotToBlock(null); setBlockReason(''); }} className="btn btn-secondary">Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ManageSlotsPage;