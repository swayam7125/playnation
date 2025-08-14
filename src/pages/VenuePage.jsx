import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';
import { FaClock, FaStar } from 'react-icons/fa';

// Helper to get today's date in YYYY-MM-DD format
const getTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const todayWithOffset = new Date(today.getTime() - (offset * 60 * 1000));
    return todayWithOffset.toISOString().split('T')[0];
};

const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

function VenuePage() {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayString());

  useEffect(() => {
    const fetchVenueDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase.from('venues').select(`*, facilities (*, sports (name), time_slots (*), facility_amenities (*, amenities (name)))`).eq('venue_id', venueId).single();
        if (error) throw error;
        setVenue(data);
        if (data.facilities && data.facilities.length > 0) {
          setSelectedFacilityId(data.facilities[0].facility_id);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [venueId]);

  const selectedFacility = venue?.facilities.find(f => f.facility_id === selectedFacilityId);

  // --- THIS LOGIC IS NOW CORRECTED ---
  const filteredTimeSlots = useMemo(() => {
    if (!selectedFacility) return [];
    
    const now = new Date(); // Get the current time

    return selectedFacility.time_slots.filter(slot => {
      const slotDate = new Date(slot.start_time).toISOString().split('T')[0];
      
      // New condition: Check if the slot's start time is in the future
      const isFutureSlot = new Date(slot.start_time) > now;

      // Return the slot only if it's available, on the selected date, AND in the future
      return slot.is_available && slotDate === selectedDate && isFutureSlot;
    });
  }, [selectedFacility, selectedDate]);


  const handleFacilityChange = (facility) => {
    setSelectedFacilityId(facility.facility_id);
    setSelectedSlot(null);
  };
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };
  const handleProceedToBook = () => {
    if (!selectedSlot) return;
    navigate('/booking', { state: { venue, facility: selectedFacility, slot: selectedSlot } });
  };
  
  const allAmenities = venue?.facilities.flatMap(f => f.facility_amenities?.map(fa => fa.amenities?.name) ?? []).filter(Boolean);
  const uniqueAmenities = [...new Set(allAmenities)];

  if (loading) return <p className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading venue details...</p>;
  if (error) return <p className="container" style={{ textAlign: 'center', color: 'red', padding: '50px' }}>Error: {error}</p>;
  if (!venue) return <p className="container" style={{ textAlign: 'center', padding: '50px' }}>Venue not found.</p>;

  return (
    <div className="container venue-page">
      <div className="venue-header">
        <h1>{venue.name}</h1>
        <p>{venue.address}, {venue.city}, {venue.state}</p>
        <p>{venue.description}</p>
        <div className="amenities-section">
          <div className="feature-list">
            {uniqueAmenities.length > 0 && uniqueAmenities.map(amenity => (
              <span key={amenity} className="feature-item">
                <FaStar style={{ fontSize: '0.75rem' }}/> {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="facility-tabs">
        {venue.facilities.map(facility => (
          <button
            key={facility.facility_id}
            onClick={() => handleFacilityChange(facility)}
            className={`facility-tab-btn ${selectedFacilityId === facility.facility_id ? 'active' : ''}`}
          >
            {facility.name} ({facility.sports.name})
          </button>
        ))}
      </div>

      <div className="time-slots-section">
        <h2 className="section-heading">Available Time Slots</h2>
        
        <div className="date-picker-container form-group">
          <label htmlFor="slot-date">Select Date</label>
          <input 
            type="date" 
            id="slot-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getTodayString()}
          />
        </div>

        <div className="time-slots-grid">
          {filteredTimeSlots.length > 0 ? (
            filteredTimeSlots.map(slot => (
              <button
                key={slot.slot_id}
                onClick={() => handleSlotSelect(slot)}
                className={`slot-btn available ${selectedSlot?.slot_id === slot.slot_id ? 'selected' : ''}`}
              >
                <FaClock />
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </button>
            ))
          ) : (
            <p>No available slots for the selected date.</p>
          )}
        </div>
      </div>
      
      {selectedSlot && (
        <div className="booking-action-bar">
          <button onClick={handleProceedToBook} className="btn btn-primary">
            Book Now (₹{selectedFacility.hourly_rate})
          </button>
        </div>
      )}
    </div>
  );
}

export default VenuePage;