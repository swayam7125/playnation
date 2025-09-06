import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FaClock, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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

  const filteredTimeSlots = useMemo(() => {
    if (!selectedFacility) return [];
    
    return selectedFacility.time_slots
      .filter(slot => {
        const slotDate = new Date(slot.start_time).toISOString().split('T')[0];
        const isFutureSlot = new Date(slot.start_time) > new Date();
        return slot.is_available && slotDate === selectedDate && isFutureSlot;
      })
      .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
      
  }, [selectedFacility, selectedDate]);

  const handleFacilityChange = (facility) => {
    setSelectedFacilityId(facility.facility_id);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleProceedToBook = () => {
    if (!selectedSlot || !selectedFacility) return;
    const finalPrice = selectedSlot.price_override ?? selectedFacility.hourly_rate;
    navigate('/booking', { state: { venue, facility: selectedFacility, slot: selectedSlot, price: finalPrice } });
  };
  
  const changeDate = (days) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    if (currentDate < new Date(getTodayString())) return;
    setSelectedDate(currentDate.toISOString().split('T')[0]);
  };
  
  const allAmenities = venue?.facilities.flatMap(f => f.facility_amenities?.map(fa => fa.amenities?.name) ?? []).filter(Boolean);
  const uniqueAmenities = [...new Set(allAmenities)];
  
  const displayPrice = selectedSlot?.price_override ?? selectedFacility?.hourly_rate;

  if (loading) return <p className="container mx-auto text-center p-12">Loading venue details...</p>;
  if (error) return <p className="container mx-auto text-center text-red-600 p-12">Error: {error}</p>;
  if (!venue) return <p className="container mx-auto text-center p-12">Venue not found.</p>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="border-b border-border-color pb-12 mb-12 relative after:content-[''] after:absolute after:-bottom-px after:left-0 after:w-24 after:h-1 after:bg-primary-green">
        <h1 className="text-4xl font-extrabold mb-4 text-dark-text">{venue.name}</h1>
        <p className="text-lg text-light-text">{venue.address}, {venue.city}, {venue.state}</p>
        <p className="max-w-3xl text-light-text leading-relaxed">{venue.description}</p>
        <div className="mt-8">
          <div className="flex flex-wrap gap-3">
            {uniqueAmenities.map(amenity => (
              <span key={amenity} className="inline-flex items-center gap-2 bg-light-green-bg text-emerald-800 py-1.5 px-4 rounded-full text-xs font-semibold border border-emerald-200">
                <FaStar className="text-xs" /> {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-12 pb-8 border-b border-border-color">
        {venue.facilities.map(facility => (
          <button
            key={facility.facility_id}
            onClick={() => handleFacilityChange(facility)}
            className={`py-3 px-6 font-sans text-sm font-semibold rounded-lg cursor-pointer transition duration-300 ${selectedFacilityId === facility.facility_id ? 'bg-primary-green text-white shadow-md' : 'bg-hover-bg text-medium-text'}`}
          >
            {facility.name} ({facility.sports.name})
          </button>
        ))}
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-8 text-dark-text relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-primary-green after:rounded-sm">Available Time Slots</h2>
        
        <div className="flex items-center gap-4 mb-8 max-w-sm">
          <button onClick={() => changeDate(-1)} disabled={selectedDate <= getTodayString()} className="py-2 px-4 border border-border-color rounded-lg font-semibold text-sm transition duration-300 bg-card-bg text-medium-text shadow-sm hover:bg-hover-bg disabled:opacity-50 disabled:cursor-not-allowed">
            <FaChevronLeft />
          </button>
          <input 
            type="date" 
            className="flex-grow py-2 px-3 border border-border-color rounded-lg font-semibold text-center"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getTodayString()}
          />
          <button onClick={() => changeDate(1)} className="py-2 px-4 border border-border-color rounded-lg font-semibold text-sm transition duration-300 bg-card-bg text-medium-text shadow-sm hover:bg-hover-bg">
            <FaChevronRight />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredTimeSlots.length > 0 ? (
            filteredTimeSlots.map(slot => (
              <button
                key={slot.slot_id}
                onClick={() => handleSlotSelect(slot)}
                className={`py-5 font-sans text-sm font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-2 transition duration-300 shadow-sm
                  ${selectedSlot?.slot_id === slot.slot_id 
                    ? 'bg-primary-green text-white scale-105 shadow-md' 
                    : 'bg-card-bg text-primary-green border-2 border-primary-green hover:bg-primary-green hover:text-white hover:-translate-y-px hover:shadow-md'}`
                }
              >
                <FaClock />
                {formatTime(slot.start_time)}
              </button>
            ))
          ) : (
            <p className="col-span-full">No available slots for the selected date.</p>
          )}
        </div>
      </div>
      
      {selectedSlot && (
        <div className="sticky bottom-0 bg-card-bg py-6 px-8 border-t border-border-color shadow-xl flex justify-end -mx-4 -mb-12 rounded-t-xl">
          <button onClick={handleProceedToBook} className="py-4 px-12 text-lg font-bold rounded-lg bg-primary-green text-white shadow-sm hover:bg-primary-green-dark transition duration-300">
            Book Now (₹{displayPrice})
          </button>
        </div>
      )}
    </div>
  );
}

export default VenuePage;