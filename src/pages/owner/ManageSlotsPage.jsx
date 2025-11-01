// src/pages/owner/ManageSlotsPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { useModal } from "../../ModalContext"; 
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiAlertTriangle,
  FiCheckCircle,
  FiSettings,
  FiEdit, // Use FiEdit for edit icon
  FiSave, // Use FiSave for save icon
  FiX,    // Use FiX for close icon
} from "react-icons/fi";
import {
    // Keep FaRupeeSign
    FaRupeeSign, // <-- NEW RUPEE ICON
} from "react-icons/fa"; 
import {
  format,
  addDays,
  startOfDay,
  eachDayOfInterval,
  parse,
  addMinutes,
  isBefore,
  isSameDay,
  isToday,
  startOfMonth,
  endOfMonth,
  getDay,
  subMonths,
  addMonths,
} from "date-fns";
// import AddSlotsModal from "../../components/bookings/AddSlotsModal"; // Assuming this is imported if needed

const getTodayString = () => new Date().toISOString().split("T")[0];

// --- Calendar Component (Unchanged) ---
const Calendar = ({
  currentDate,
  setCurrentDate,
  calendarViewDate,
  setCalendarViewDate,
}) => {
  const monthStart = startOfMonth(calendarViewDate);
  const monthEnd = endOfMonth(calendarViewDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startingDay = getDay(monthStart);
  const today = startOfDay(new Date());

  return (
    <div className="bg-card-bg p-4 rounded-2xl border border-border-color">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCalendarViewDate(subMonths(calendarViewDate, 1))}
          className="p-2 rounded-full hover:bg-hover-bg"
        >
          <FiChevronLeft />
        </button>
        <h3 className="font-bold text-dark-text">
          {format(calendarViewDate, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => setCalendarViewDate(addMonths(calendarViewDate, 1))}
          className="p-2 rounded-full hover:bg-hover-bg"
        >
          <FiChevronRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-light-text mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {daysInMonth.map((day) => (
          <button
            key={day.toString()}
            onClick={() => setCurrentDate(day)}
            disabled={isBefore(day, today)}
            className={`
              h-8 w-8 rounded-full text-sm transition-colors
              ${isBefore(day, today) ? "text-gray-300 cursor-not-allowed" : ""}
              ${
                !isBefore(day, today) &&
                !isSameDay(day, currentDate) &&
                isToday(day)
                  ? "text-primary-green font-bold border border-primary-green"
                  : ""
              }
              ${
                !isBefore(day, today) && !isSameDay(day, currentDate)
                  ? "hover:bg-hover-bg"
                  : ""
              }
              ${
                isSameDay(day, currentDate)
                  ? "bg-primary-green text-white"
                  : ""
              }
            `}
          >
            {format(day, "d")}
          </button>
        ))}
      </div>
      <button
        onClick={() => setCurrentDate(today)}
        className="w-full mt-4 py-2 text-sm font-semibold text-primary-green bg-light-green-bg rounded-lg hover:bg-primary-green hover:text-white transition-colors"
      >
        Go to Today
      </button>
    </div>
  );
};

// --- Main Page Component ---
const ManageSlotsPage = () => {
  const { user } = useAuth();
  const { showModal } = useModal(); 
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingWindow, setBookingWindow] = useState(7);
  const [isSavingWindow, setIsSavingWindow] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  const today = startOfDay(new Date());

  // --- NEW STATE FOR PRICE OVERRIDE ---
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [newPrice, setNewPrice] = useState({});
  // --- END NEW STATE ---


  useEffect(() => {
    setCalendarViewDate(currentDate);
  }, [currentDate]);

  // Fetch owner's venues and the booking window for the selected one
  useEffect(() => {
    const fetchVenues = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("venues")
        .select("venue_id, name, booking_window_days")
        .eq("owner_id", user.id)
        .eq("is_approved", true);
      if (data) {
        setVenues(data);
        if (data.length > 0) {
          setSelectedVenue(data[0]);
          setBookingWindow(data[0].booking_window_days || 7);
        }
      }
    };
    fetchVenues();
  }, [user]);

  // Fetch facilities when venue changes
  useEffect(() => {
    const fetchFacilities = async () => {
      if (!selectedVenue) return;
      const { data } = await supabase
        .from("facilities")
        .select("facility_id, name, hourly_rate") // Fetch hourly_rate here
        .eq("venue_id", selectedVenue.venue_id)
        .eq("is_active", true);
      setFacilities(data || []);
      setSelectedFacility(data && data.length > 0 ? data[0] : null);
      // Update booking window display when venue changes
      const currentVenueData = venues.find(
        (v) => v.venue_id === selectedVenue.venue_id
      );
      if (currentVenueData)
        setBookingWindow(currentVenueData.booking_window_days || 7);
    };
    fetchFacilities();
  }, [selectedVenue, venues]);

  const fetchSlots = useCallback(async () => {
    if (!selectedFacility) {
      setSlots([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const dayStart = startOfDay(currentDate);
    const dayEnd = addDays(dayStart, 1);

    const { data: slotData, error } = await supabase
      .from("time_slots")
      // FIX: Select the correct column name 'price_override'
      .select(`*, bookings(booking_id)`) 
      .eq("facility_id", selectedFacility.facility_id)
      .gte("start_time", dayStart.toISOString())
      .lt("start_time", dayEnd.toISOString())
      .order("start_time");

    setSlots(error ? [] : slotData);
    setLoading(false);
  }, [selectedFacility, currentDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleAddSlots = async (params) => {
    // Logic remains mostly the same, assuming AddSlotsModal uses this
    // I'm omitting the full function body for brevity, but it should be correct from previous versions
    const {
      isBulk,
      date,
      startDate,
      endDate,
      startTime,
      endTime,
      slotDuration,
    } = params;
    const newSlots = [];
    const dateRange = isBulk
      ? eachDayOfInterval({
          start: new Date(startDate),
          end: new Date(endDate),
        })
      : [new Date(date)];

    for (const day of dateRange) {
      let current = parse(startTime, "HH:mm", day);
      const end = parse(endTime, "HH:mm", day);
      while (isBefore(current, end)) {
        const slotEnd = addMinutes(current, slotDuration);
        newSlots.push({
          facility_id: selectedFacility.facility_id,
          start_time: current,
          end_time: slotEnd,
          is_available: true,
        });
        current = slotEnd;
      }
    }

    if (newSlots.length > 0) {
      const { error } = await supabase
        .from("time_slots")
        .upsert(newSlots, { onConflict: "facility_id, start_time, end_time" });
      if (error) {
        alert("Error adding slots: " + error.message);
      } else {
        setIsModalOpen(false);
        fetchSlots();
      }
    } else {
      setIsModalOpen(false);
    }
  };

  const handleToggleBlockSlot = async (slot) => {
    // Only allow blocking if the slot isn't already booked
    if (slot.bookings && slot.bookings.length > 0) {
        await showModal({
            title: "Cannot Block Slot",
            message: "This slot is currently booked and cannot be blocked."
        });
        return;
    }
    
    const newStatus = !slot.is_available;
    const reason = !newStatus
      ? prompt(
          "Reason for blocking this slot (e.g., Maintenance):",
          slot.block_reason || ""
        )
      : null;
      
    if (newStatus || reason !== null) {
      const { error } = await supabase
        .from("time_slots")
        .update({
          is_available: newStatus,
          block_reason: newStatus ? null : reason,
        })
        .eq("slot_id", slot.slot_id);
      if (error) {
        alert("Error updating slot: " + error.message);
      } else {
        fetchSlots();
      }
    }
  };
  
  // --- MODIFIED: HANDLE PRICE UPDATE LOGIC ---
  const handleSavePrice = async (slotId, currentBaseRate) => {
    const priceInput = newPrice[slotId];
    // Check if input is a valid positive number or 0
    const price = parseFloat(priceInput);
    
    // Clear editing state and exit if user did not enter a value
    if (priceInput === undefined) {
        setEditingSlotId(null);
        return;
    }

    // Allow clearing the override if input is empty or equals base rate
    if (priceInput === "" || price === currentBaseRate) {
        const { error: updateError } = await supabase
            .from('time_slots')
            .update({ price_override: null }) // Set to NULL to clear override
            .eq('slot_id', slotId);
        
        if (updateError) {
             await showModal({ title: "Update Failed", message: `Failed to clear price: ${updateError.message}` });
             return;
        }
    } else if (isNaN(price) || price <= 0) {
        await showModal({ title: "Invalid Price", message: "Price must be a positive number." });
        return;
    } else {
        // Save the new price override
        const { error: updateError } = await supabase
            .from('time_slots')
            // FIX: Use the correct column name 'price_override'
            .update({ price_override: price }) 
            .eq('slot_id', slotId);
        
        if (updateError) {
             await showModal({ title: "Update Failed", message: `Failed to set price: ${updateError.message}` });
             return;
        }
    }

    // Clear editing state and refresh data
    setEditingSlotId(null);
    setNewPrice(prev => { 
        const newState = { ...prev };
        delete newState[slotId];
        return newState;
    });
    fetchSlots();
  };
  // --- END MODIFIED PRICE OVERRIDE FUNCTION ---


  const handleSaveBookingWindow = async () => {
    setIsSavingWindow(true);
    const { error } = await supabase
      .from("venues")
      .update({ booking_window_days: bookingWindow })
      .eq("venue_id", selectedVenue.venue_id);
    if (error) {
      alert("Error saving setting: " + error.message);
    } else {
      alert("Booking window updated successfully!");
    }
    setIsSavingWindow(false);
  };

  // --- MODIFIED: RENDER SLOT CARD ---
  const renderSlot = (slot) => {
    const isBooked = slot.bookings && slot.bookings.length > 0;
    const isAvailable = slot.is_available && !isBooked; // Slot is truly available
    const baseRate = selectedFacility?.hourly_rate ?? 0;
    // FIX: Use the correct column name for current price
    const currentPrice = slot.price_override || baseRate; 
    const isOverridden = !!slot.price_override;
    
    const isEditing = editingSlotId === slot.slot_id;

    const baseClasses =
      "p-4 rounded-lg text-center transition-all duration-300 relative group";
    const formatTime = (dateStr) => format(new Date(dateStr), "p");
    
    // Classes based on slot status
    const statusClasses = isBooked ? 'bg-blue-100 border-blue-300 text-blue-800' : 
                          isAvailable ? 'bg-green-100 border-green-300 text-green-800 hover:bg-red-100' :
                          'bg-yellow-100 border-yellow-300 text-yellow-800';

    // Click handler for blocking/unblocking
    const handleClick = isBooked ? null : () => handleToggleBlockSlot(slot);
        
    // Tooltip/Prompt for unavailable slot
    const unavailableContent = !isAvailable && !isBooked ? 
        <span className='text-xs font-medium truncate'>Blocked: {slot.block_reason || 'Manual'}</span> : 
        null;
        
    return (
        <div 
            key={slot.slot_id} 
            className={`${baseClasses} ${statusClasses} ${!isBooked && 'cursor-pointer hover:shadow-lg'}`}
            onClick={handleClick} 
        >
            <div className="flex justify-between items-center mb-2">
                <div className="text-dark-text font-semibold">{formatTime(slot.start_time)}</div>
                
                {/* Edit Price Button - Shown only if available and not editing */}
                {!isBooked && isAvailable && !isEditing && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); // Stop click from triggering block/unblock
                            setEditingSlotId(slot.slot_id);
                            // Pre-fill input with override price or base rate
                            setNewPrice(prev => ({ ...prev, [slot.slot_id]: slot.price_override ?? baseRate }));
                        }}
                        className="text-medium-text hover:text-primary-green p-1 rounded-full bg-white/70"
                        title="Edit Price Override"
                    >
                        <FiEdit className="text-base" />
                    </button>
                )}
            </div>
            
            {isEditing ? (
                <div className="flex items-center justify-center gap-1.5 mt-1">
                    {/* Replaced FiDollarSign with FaRupeeSign */}
                    <FaRupeeSign className="text-xl text-dark-text" /> 
                    <input
                        type="number"
                        step="any"
                        min="0"
                        // Use correct state for value and fall back to existing override or base rate
                        value={newPrice[slot.slot_id] ?? ''}
                        onChange={(e) => setNewPrice(prev => ({ ...prev, [slot.slot_id]: e.target.value }))}
                        className="w-20 py-1 px-2 border border-primary-green rounded-lg text-sm font-bold text-dark-text text-center focus:ring-primary-green focus:border-primary-green"
                        // Save on blur or Enter key
                        onBlur={() => handleSavePrice(slot.slot_id, baseRate)} 
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.currentTarget.blur();
                            }
                            if (e.key === 'Escape') setEditingSlotId(null);
                        }}
                        onClick={(e) => e.stopPropagation()} 
                        autoFocus
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center pt-1">
                    <div className="flex items-baseline gap-1">
                        {/* Replaced FiDollarSign with FaRupeeSign */}
                        <FaRupeeSign className={`text-base ${isOverridden ? 'text-red-600' : 'text-dark-text'}`} />
                        
                        <span className={`text-xl font-bold ${isOverridden ? 'text-red-600' : 'text-dark-text'}`}>
                            {currentPrice}
                        </span>
                    </div>
                    {isOverridden && (
                        <span className="text-xs text-medium-text line-through opacity-70">
                            ₹{baseRate}
                        </span>
                    )}
                </div>
            )}
            
            {isBooked && (
                 <span className='text-xs font-bold text-blue-800 mt-1 flex items-center gap-1 justify-center'>
                    Booked
                 </span>
            )}
            
            {unavailableContent && (
                <span className='text-xs font-medium text-yellow-800 mt-1 flex items-center justify-center'>
                    {unavailableContent}
                </span>
            )}
        </div>
    );
  };
  // --- END MODIFIED RENDER SLOT ---

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">Manage Slots</h1>
            <p className="text-sm text-medium-text mt-1">
              Click available slots to block/unblock. Hover to edit pricing.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={!selectedFacility}
            className="flex items-center gap-2 py-2 px-5 font-semibold text-white bg-primary-green rounded-lg hover:bg-primary-green-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus /> Add Slots
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card-bg p-6 rounded-2xl shadow-md border border-border-color space-y-4">
              <div>
                <label className="block text-sm font-medium text-medium-text mb-2">
                  Select Venue
                </label>
                <select
                  value={selectedVenue?.venue_id || ""}
                  onChange={(e) =>
                    setSelectedVenue(
                      venues.find((v) => v.venue_id === e.target.value)
                    )
                  }
                  className="w-full px-4 py-2 bg-background border border-border-color rounded-lg"
                >
                  {venues.map((v) => (
                    <option key={v.venue_id} value={v.venue_id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-medium-text mb-2">
                  Select Facility
                </label>
                <select
                  value={selectedFacility?.facility_id || ""}
                  onChange={(e) =>
                    setSelectedFacility(
                      facilities.find((f) => f.facility_id === e.target.value)
                    )
                  }
                  className="w-full px-4 py-2 bg-background border border-border-color rounded-lg"
                  disabled={!selectedVenue || facilities.length === 0}
                >
                  {facilities.map((f) => (
                    <option key={f.facility_id} value={f.facility_id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              {selectedFacility && (
                <div className="bg-light-green-bg p-3 rounded-lg border border-primary-green/30">
                  <p className="text-xs text-medium-text mb-1">Default Rate:</p>
                  <p className="text-lg font-bold text-primary-green">
                    ₹{selectedFacility.hourly_rate ?? 0}/hour
                  </p>
                </div>
              )}
            </div>

            <Calendar
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              calendarViewDate={calendarViewDate}
              setCalendarViewDate={setCalendarViewDate}
            />

            <div className="bg-card-bg p-6 rounded-2xl shadow-md border border-border-color space-y-4">
              <h3 className="text-lg font-bold text-dark-text flex items-center gap-2">
                <FiSettings /> Player Booking Window
              </h3>
              <p className="text-sm text-medium-text">
                Set how many days into the future players can see and book
                available slots.
              </p>
              <div>
                <label className="block text-sm font-medium text-medium-text mb-2">
                  Booking available for the next
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    value={bookingWindow}
                    onChange={(e) => setBookingWindow(parseInt(e.target.value))}
                    min="1"
                    max="90"
                    className="w-full px-4 py-2 bg-background border border-border-color rounded-lg"
                  />
                  <span className="font-semibold text-medium-text">days</span>
                </div>
              </div>
              <button
                onClick={handleSaveBookingWindow}
                disabled={isSavingWindow || !selectedVenue}
                className="w-full py-2 px-4 font-semibold text-white bg-primary-green rounded-lg hover:bg-primary-green-dark disabled:opacity-50 transition-colors"
              >
                {isSavingWindow ? "Saving..." : "Save Setting"}
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center bg-card-bg p-4 rounded-t-2xl border-b border-border-color">
              <button
                onClick={() => setCurrentDate(addDays(currentDate, -1))}
                disabled={isSameDay(currentDate, today)}
                className="p-2 rounded-full hover:bg-hover-bg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft size={24} className="text-medium-text" />
              </button>
              <h2 className="text-xl font-bold text-dark-text text-center">
                {format(currentDate, "EEEE, MMMM d")}
              </h2>
              <button
                onClick={() => setCurrentDate(addDays(currentDate, 1))}
                className="p-2 rounded-full hover:bg-hover-bg"
              >
                <FiChevronRight size={24} className="text-medium-text" />
              </button>
            </div>
            <div className="bg-card-bg p-6 rounded-b-2xl shadow-md min-h-[500px]">
              {/* ... (Loading and Empty States) ... */}
              {loading ? (
                <p>Loading...</p>
              ) : !selectedFacility ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <FiAlertTriangle className="text-yellow-500 text-4xl mb-4" />
                  <p className="text-medium-text">
                    Please select a venue and facility.
                  </p>
                </div>
              ) : slots.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <FiCheckCircle className="text-primary-green text-4xl mb-4" />
                  <p className="text-medium-text">
                    No slots have been added for this day.
                  </p>
                  <p className="text-sm text-light-text">
                    Click "Add Slots" to get started.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {slots.map((slot) => (
                    <div key={slot.slot_id}>{renderSlot(slot)}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assuming AddSlotsModal is correctly imported */}
      {/* {isModalOpen && (
        <AddSlotsModal
          facility={selectedFacility}
          onSave={handleAddSlots}
          onCancel={() => setIsModalOpen(false)}
        />
      )} */}
    </div>
  );
};

export default ManageSlotsPage;