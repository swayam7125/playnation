import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  // Destructure price from location.state, with a fallback to the facility's hourly rate
  const { venue, facility, slot, price } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // If there's no essential booking data, redirect to explore page
  if (!venue || !facility || !slot || price === undefined) {
    // Using navigate directly inside render is an anti-pattern,
    // it's better to handle this with a useEffect or conditional rendering.
    // However, for a simple redirect, this is a common approach.
    React.useEffect(() => {
        navigate('/explore');
    }, [navigate]);
    return null;
  }
  
  const totalAmount = price;

  const handleConfirmBooking = async () => {
    if (!user) {
      alert("Please log in to make a booking.");
      navigate('/auth');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Step 1: Create the booking record
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          facility_id: facility.facility_id,
          slot_id: slot.slot_id,
          booking_date: new Date(),
          start_time: slot.start_time,
          end_time: slot.end_time,
          total_amount: totalAmount, // Use the price from the state
          status: 'confirmed',
          payment_status: 'paid', // Simulating a successful payment
        })
        .select()
        .single();
      
      if (bookingError) throw bookingError;

      // Step 2: Update the time slot to be unavailable
      const { error: slotError } = await supabase
        .from('time_slots')
        .update({ is_available: false })
        .eq('slot_id', slot.slot_id);
      
      if (slotError) throw slotError;

      alert("Booking confirmed successfully!");
      navigate('/my-bookings');

    } catch (err) {
      setError(err.message);
      alert(`Booking failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container dashboard-page">
      <h1 className="section-heading" style={{ textAlign: 'center', fontSize: '2rem' }}>Confirm Your Booking</h1>
      {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}

      <div className="booking-summary-card">
        <h3>{venue.name}</h3>
        <p><strong>Facility:</strong> {facility.name} ({facility.sports.name})</p>
        <p><strong>Date:</strong> {formatDate(slot.start_time)}</p>
        <p><strong>Time:</strong> {formatTime(slot.start_time)} - {formatTime(slot.end_time)}</p>
        <div className="summary-total">
          <span>Total Amount</span>
          <strong>₹{totalAmount}</strong>
        </div>
        <button onClick={handleConfirmBooking} className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
          {loading ? 'Processing...' : 'Proceed to Pay'}
        </button>
      </div>
    </div>
  );
}

export default BookingPage;