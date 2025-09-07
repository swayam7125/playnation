import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { FaTrash, FaPlusCircle, FaTimesCircle, FaEdit, FaBan, FaCheck, FaTimes, FaChevronLeft, FaChevronRight, FaClock, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const getTodayString = () => new Date().toISOString().split('T')[0];

// Helper component for form fields in the control panel
const ControlField = ({ label, icon: Icon, children }) => (
    <div className="space-y-3">
        <label className="flex items-center gap-2 font-semibold text-dark-text"><Icon className="text-primary-green" />{label}</label>
        {children}
    </div>
);

// Helper component for rendering each time slot card
const TimeSlotCard = ({ item, isSelected, facility, actions }) => {
    const { hour, slot, status, booking_id } = item;
    const { editingSlot, customPrice } = actions.editState;

    const baseClasses = 'relative rounded-2xl p-6 min-h-[160px] flex flex-col justify-between transition-all duration-300 border-2';
    const statusClasses = {
        empty: 'border-border-color-light bg-hover-bg hover:border-primary-green hover:shadow-lg cursor-pointer transform hover:-translate-y-1',
        selected: 'border-primary-green bg-light-green-bg shadow-lg ring-4 ring-primary-green/20 transform -translate-y-1',
        available: 'border-primary-green/30 bg-card-bg shadow-md',
        booked: 'border-red-200 bg-red-50 shadow-md',
        blocked: 'border-gray-300 bg-gray-100 shadow-md'
    };
    const finalClass = `${baseClasses} ${status === 'empty' && isSelected ? statusClasses.selected : statusClasses[status]}`;
    const stopPropagation = (fn) => (e) => { e.stopPropagation(); fn(); };

    const renderContent = () => {
        switch (status) {
            case 'available':
                return (
                    <div className="space-y-4">
                        <div className="text-center">
                            {editingSlot === slot.slot_id ? (
                                <div className="space-y-2">
                                    <input type="number" value={customPrice} onChange={(e) => actions.editState.setCustomPrice(e.target.value)} placeholder={`₹${facility?.hourly_rate}`} className="w-full text-center p-2 rounded-lg border border-border-color text-lg font-bold" />
                                    <div className="flex justify-center gap-1">
                                        <button onClick={stopPropagation(() => actions.onSavePrice(slot.slot_id))} className="p-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark"><FaCheck className="text-sm" /></button>
                                        <button onClick={stopPropagation(() => actions.editState.setEditingSlot(null))} className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"><FaTimes className="text-sm" /></button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-2xl font-bold text-primary-green">₹{slot.price_override || facility?.hourly_rate}</span>
                                        <button onClick={stopPropagation(() => actions.onEditPrice(slot))} className="p-1 text-medium-text hover:text-primary-green"><FaEdit /></button>
                                    </div>
                                    <div className="inline-block px-3 py-1 bg-primary-green/10 text-primary-green rounded-full text-xs font-medium">Available</div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center gap-2">
                            <button onClick={stopPropagation(() => actions.onBlock(slot))} className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200" title="Block this slot"><FaBan /></button>
                            <button onClick={stopPropagation(() => actions.onDelete(slot.slot_id))} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Delete slot"><FaTrash /></button>
                        </div>
                    </div>
                );
            case 'booked':
                return (
                    <div className="text-center space-y-4">
                        <div className="space-y-2">
                            <div className="p-3 bg-red-100 rounded-full w-12 h-12 mx-auto flex items-center justify-center"><FaTimesCircle className="text-red-600 text-lg" /></div>
                            <div className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">BOOKED</div>
                        </div>
                        <button onClick={stopPropagation(() => actions.onCancelBooking(booking_id, slot.slot_id))} className="w-full p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium" title="Cancel Booking">Cancel Booking</button>
                    </div>
                );
            case 'blocked':
                return (
                    <div className="text-center space-y-4">
                        <div className="space-y-2">
                            <div className="p-3 bg-gray-200 rounded-full w-12 h-12 mx-auto flex items-center justify-center"><FaBan className="text-gray-600 text-lg" /></div>
                            <div className="inline-block px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-xs font-bold">BLOCKED</div>
                            {slot.block_reason && <p className="text-gray-600 text-xs leading-tight">{slot.block_reason}</p>}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={stopPropagation(() => actions.onUnblock(slot.slot_id))} className="flex-1 p-2 bg-primary-green text-white rounded-lg hover:bg-primary-green-dark text-sm font-medium" title="Unblock">Unblock</button>
                            <button onClick={stopPropagation(() => actions.onDelete(slot.slot_id))} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Delete slot"><FaTrash /></button>
                        </div>
                    </div>
                );
            default: // 'empty'
                return (
                    <div className="text-center flex-1 flex flex-col justify-center">
                        <div className="space-y-2">
                            <div className={`p-3 rounded-full w-12 h-12 mx-auto flex items-center justify-center ${isSelected ? 'bg-primary-green/10' : 'bg-gray-100'}`}>
                                {isSelected ? <FaCheck className="text-primary-green text-lg" /> : <FaPlusCircle className="text-gray-400 text-lg" />}
                            </div>
                            <p className={`font-semibold text-sm ${isSelected ? 'text-primary-green' : 'text-medium-text'}`}>{isSelected ? 'Selected' : 'Click to Add'}</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={finalClass} onClick={() => status === 'empty' && actions.onToggleSelection(hour)}>
            <div className="text-center mb-4">
                <div className="font-bold text-xl text-dark-text mb-1">{hour}:00</div>
                <div className="text-xs text-medium-text">{hour}:00 - {hour + 1}:00</div>
            </div>
            {renderContent()}
        </div>
    );
};

function ManageSlotsPage() {
    const { user } = useAuth();
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVenueId, setSelectedVenueId] = useState('');
    const [selectedFacilityId, setSelectedFacilityId] = useState('');
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [slotsToCreate, setSlotsToCreate] = useState(new Set());
    // State for modal forms
    const [editingSlot, setEditingSlot] = useState(null);
    const [customPrice, setCustomPrice] = useState('');
    const [slotToBlock, setSlotToBlock] = useState(null);
    const [blockReason, setBlockReason] = useState('');

    const fetchOwnerVenues = async () => {
        if (!user) { setLoading(false); return; }
        setLoading(true);
        try {
            const { data, error } = await supabase.from('venues').select(`*, facilities(*, sports(name), time_slots(*, bookings(booking_id, status)))`).eq('owner_id', user.id);
            if (error) throw error;
            setVenues(data || []);
            if (data?.length > 0 && !selectedVenueId) {
                setSelectedVenueId(data[0].venue_id);
                setSelectedFacilityId(data[0].facilities?.[0]?.facility_id || '');
            }
        } catch (err) {
            console.error("Error fetching venues:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (user) fetchOwnerVenues(); }, [user]);

    const handleVenueChange = (e) => {
        const newVenueId = e.target.value;
        setSelectedVenueId(newVenueId);
        const venue = venues.find(v => v.venue_id === newVenueId);
        setSelectedFacilityId(venue?.facilities?.[0]?.facility_id || '');
    };
    
    const runSupabaseAction = async (action, successMsg, errorMsgPrefix) => {
        try {
            const { error } = await action();
            if (error) throw error;
            alert(successMsg);
            fetchOwnerVenues();
        } catch (error) {
            alert(`${errorMsgPrefix}: ${error.message}`);
        }
    };

    const handleDeleteSlot = async (slotId) => {
        if (window.confirm("Delete this available slot?")) {
            await runSupabaseAction(() => supabase.from('time_slots').delete().eq('slot_id', slotId), "Slot deleted.", "Error deleting slot");
        }
    };
    
    const handleOwnerCancelBooking = async (bookingId, slotId) => {
        if (window.confirm("Cancel this user's booking? This is irreversible.")) {
            await runSupabaseAction(async () => {
                const { error: bookingError } = await supabase.from('bookings').update({ status: 'cancelled', payment_status: 'refunded', cancelled_by: user.id }).eq('booking_id', bookingId);
                if (bookingError) throw bookingError;
                return supabase.from('time_slots').update({ is_available: true }).eq('slot_id', slotId);
            }, "Booking cancelled and slot is now available.", "Error cancelling booking");
        }
    };

    const handleSavePrice = async (slotId) => {
        const priceValue = customPrice.trim() === '' ? null : parseFloat(customPrice);
        if (customPrice.trim() !== '' && (isNaN(priceValue) || priceValue < 0)) {
            alert("Please enter a valid price."); return;
        }
        await runSupabaseAction(() => supabase.from('time_slots').update({ price_override: priceValue }).eq('slot_id', slotId), "Price updated!", "Error updating price");
        setEditingSlot(null); setCustomPrice('');
    };

    const closeBlockForm = () => { setSlotToBlock(null); setBlockReason(''); };
    
    const handleConfirmBlock = async () => {
        await runSupabaseAction(() => supabase.from('time_slots').update({ is_available: false, block_reason: blockReason.trim() || 'Blocked by owner' }).eq('slot_id', slotToBlock.slot_id), "Slot blocked!", "Error blocking slot");
        closeBlockForm();
    };

    const handleUnblockSlot = async (slotId) => {
        if (window.confirm("Unblock this slot?")) {
            await runSupabaseAction(() => supabase.from('time_slots').update({ is_available: true, block_reason: null }).eq('slot_id', slotId), "Slot unblocked!", "Error unblocking slot");
        }
    };

    const handleBulkAddSlots = async () => {
        if (slotsToCreate.size === 0) { alert("Please select empty slots to add."); return; }
        const slotsToInsert = Array.from(slotsToCreate).map(hour => ({
            facility_id: selectedFacilityId,
            start_time: `${selectedDate}T${String(hour).padStart(2, '0')}:00:00`,
            end_time: `${selectedDate}T${String(hour + 1).padStart(2, '0')}:00:00`,
        }));
        await runSupabaseAction(() => supabase.from('time_slots').insert(slotsToInsert), `${slotsToInsert.length} slot(s) added successfully!`, "Error adding slots");
        setSlotsToCreate(new Set());
    };
    
    const toggleSlotForCreation = (hour) => setSlotsToCreate(prev => {
        const newSlots = new Set(prev);
        newSlots.has(hour) ? newSlots.delete(hour) : newSlots.add(hour);
        return newSlots;
    });

    const changeDate = (days) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + days);
        setSelectedDate(date.toISOString().split('T')[0]);
    };

    const selectedVenue = venues.find(v => v.venue_id === selectedVenueId);
    const currentFacility = selectedVenue?.facilities?.find(f => f.facility_id === selectedFacilityId);

    const daySchedule = useMemo(() => {
        if (!selectedVenue?.opening_time || !selectedVenue?.closing_time) return [];
        const openingHour = parseInt(selectedVenue.opening_time.split(':')[0], 10);
        const closingHour = parseInt(selectedVenue.closing_time.split(':')[0], 10);
        
        const schedule = Array.from({ length: closingHour - openingHour }, (_, i) => ({ hour: openingHour + i, slot: null, status: 'empty' }));
        const slotsForDate = currentFacility?.time_slots?.filter(s => new Date(s.start_time).toISOString().split('T')[0] === selectedDate) || [];

        return schedule.map(item => {
            const slot = slotsForDate.find(s => new Date(s.start_time).getHours() === item.hour);
            if (!slot) return item;
            
            const bookingForSlot = (slot.bookings || []).find(b => b.status === 'confirmed');
            const status = bookingForSlot ? 'booked' : (!slot.is_available ? 'blocked' : 'available');
            return { hour: item.hour, slot, status, booking_id: bookingForSlot?.booking_id };
        });
    }, [selectedVenue, currentFacility, selectedDate]);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    if (loading) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
                <p className="text-medium-text font-medium">Loading your venues...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <div className="bg-gradient-to-r from-primary-green to-primary-green-light">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex items-center gap-3 mb-2"><div className="p-2 bg-white/20 rounded-xl"><FaClock className="text-white text-xl" /></div><h1 className="text-3xl font-bold text-white">Manage Time Slots</h1></div>
                    <p className="text-white/90 text-lg">Create, edit, and manage your facility time slots</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {venues.length === 0 ? (
                    <div className="bg-card-bg rounded-2xl border border-border-color p-16 text-center shadow-sm">
                        <div className="max-w-md mx-auto"><div className="p-4 bg-light-green-bg rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"><FaMapMarkerAlt className="text-primary-green text-2xl" /></div><h3 className="text-xl font-semibold text-dark-text mb-2">No Venues Found</h3><p className="text-medium-text">You need to add a venue first before managing time slots.</p></div>
                    </div>
                ) : (
                    <>
                        {slotsToCreate.size > 0 && (
                            <div className="sticky top-4 z-50 mb-6">
                                <div className="bg-card-bg rounded-2xl border border-primary-green shadow-2xl p-6">
                                    <div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className="p-3 bg-primary-green/10 rounded-xl"><FaPlusCircle className="text-primary-green text-xl" /></div><div><h4 className="font-semibold text-dark-text">{slotsToCreate.size} time slot{slotsToCreate.size !== 1 && 's'} selected</h4><p className="text-medium-text text-sm">Ready to create new time slots</p></div></div><div className="flex items-center gap-3"><button onClick={() => setSlotsToCreate(new Set())} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">Clear Selection</button><button onClick={handleBulkAddSlots} className="px-8 py-3 bg-primary-green text-white rounded-xl font-semibold shadow-lg hover:bg-primary-green-dark transition-transform hover:scale-105 flex items-center gap-2"><FaPlusCircle />Create Selected Slots</button></div></div>
                                </div>
                            </div>
                        )}

                        <div className="bg-card-bg rounded-2xl border border-border-color p-8 shadow-sm mb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <ControlField label="Select Venue" icon={FaMapMarkerAlt}>
                                    <select value={selectedVenueId} onChange={handleVenueChange} className="w-full p-4 border border-border-color rounded-xl bg-card-bg focus:border-primary-green focus:ring-4 focus:ring-primary-green/10 hover:border-primary-green/50">{venues.map(v => (<option key={v.venue_id} value={v.venue_id}>{v.name}</option>))}</select>
                                </ControlField>
                                <ControlField label="Select Facility" icon={FaClock}>
                                    <select value={selectedFacilityId} onChange={e => setSelectedFacilityId(e.target.value)} disabled={!selectedVenueId} className="w-full p-4 border border-border-color rounded-xl bg-card-bg focus:border-primary-green focus:ring-4 focus:ring-primary-green/10 hover:border-primary-green/50 disabled:bg-hover-bg disabled:cursor-not-allowed"><option value="">Select a facility</option>{selectedVenue?.facilities?.map(f => (<option key={f.facility_id} value={f.facility_id}>{f.name} ({f.sports?.name})</option>))}</select>
                                </ControlField>
                                <ControlField label="Select Date" icon={FaCalendarAlt}>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => changeDate(-1)} className="p-4 border border-border-color rounded-xl hover:bg-hover-bg hover:border-primary-green"><FaChevronLeft className="text-medium-text" /></button>
                                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="flex-1 p-4 border border-border-color rounded-xl bg-card-bg focus:border-primary-green focus:ring-4 focus:ring-primary-green/10" />
                                        <button onClick={() => changeDate(1)} className="p-4 border border-border-color rounded-xl hover:bg-hover-bg hover:border-primary-green"><FaChevronRight className="text-medium-text" /></button>
                                    </div>
                                </ControlField>
                            </div>
                            {selectedDate && <div className="mt-6 pt-6 border-t border-border-color text-center"><h3 className="text-lg font-semibold text-dark-text">Schedule for {formatDate(selectedDate)}</h3></div>}
                        </div>
                        
                        {selectedFacilityId ? (
                            <div className="bg-card-bg rounded-2xl border border-border-color p-8 shadow-sm pb-12">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                    {daySchedule.map(item => <TimeSlotCard key={item.hour} item={item} facility={currentFacility} isSelected={slotsToCreate.has(item.hour)} actions={{onToggleSelection: toggleSlotForCreation, onEditPrice: (slot) => {setEditingSlot(slot.slot_id); setCustomPrice(slot.price_override || '');}, onSavePrice: handleSavePrice, onDelete: handleDeleteSlot, onBlock: (slot) => setSlotToBlock(slot), onUnblock: handleUnblockSlot, onCancelBooking: handleOwnerCancelBooking, editState: { editingSlot, setEditingSlot, customPrice, setCustomPrice }}} />)}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-card-bg rounded-2xl border border-border-color p-16 text-center shadow-sm"><div className="max-w-md mx-auto"><div className="p-4 bg-light-green-bg rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center"><FaClock className="text-primary-green text-2xl" /></div><h3 className="text-xl font-semibold text-dark-text mb-2">Select Facility</h3><p className="text-medium-text">Please select a venue and facility to view and manage time slots.</p></div></div>
                        )}
                    </>
                )}
            </div>

            {slotToBlock && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-card-bg rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-8">
                            <div className="text-center mb-6"><div className="p-4 bg-yellow-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center"><FaBan className="text-yellow-600 text-2xl" /></div><h3 className="text-2xl font-bold text-dark-text mb-2">Block Time Slot</h3><p className="text-medium-text">Time: {new Date(slotToBlock.start_time).getHours()}:00 - {new Date(slotToBlock.start_time).getHours() + 1}:00</p></div>
                            <div className="space-y-4 mb-8"><label htmlFor="block-reason" className="block font-semibold text-dark-text">Reason for blocking (optional)</label><input id="block-reason" type="text" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="e.g., Maintenance, Private event..." className="w-full p-4 border border-border-color rounded-xl bg-card-bg focus:border-primary-green focus:ring-4 focus:ring-primary-green/10" /></div>
                            <div className="flex gap-4"><button onClick={closeBlockForm} className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">Cancel</button><button onClick={handleConfirmBlock} className="flex-1 py-3 px-6 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 flex items-center justify-center gap-2"><FaBan />Block Slot</button></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageSlotsPage;