import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { useModal } from '../../ModalContext';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

function BookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { venue, facility, slot, price } = location.state || {};
  const [loading, setLoading] = useState(false);
  const { showModal } = useModal();

  if (!venue || !facility || !slot || price === undefined) {
    React.useEffect(() => {
        navigate('/explore');
    }, [navigate]);
    return null;
  }
  
  const totalAmount = price;

  const handleConfirmBooking = async () => {
    if (!user) {
      const wantsToLogin = await showModal({
        type: 'confirm',
        title: 'Authentication Required',
        message: 'You need to be logged in to make a booking. Would you like to log in now?',
        confirmText: 'Login',
        cancelText: 'Cancel'
      });
      if (wantsToLogin) {
        navigate('/login', { state: { from: location } });
      }
      return;
    }

    setLoading(true);
    try {
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          facility_id: facility.facility_id,
          slot_id: slot.slot_id,
          booking_date: new Date(),
          start_time: slot.start_time,
          end_time: slot.end_time,
          total_amount: totalAmount,
          status: 'confirmed',
          payment_status: 'paid',
        })
        .select()
        .single();
      
      if (bookingError) throw bookingError;

      const { error: slotError } = await supabase
        .from('time_slots')
        .update({ is_available: false })
        .eq('slot_id', slot.slot_id);
      
      if (slotError) throw slotError;

      await showModal({
        type: 'info',
        title: 'Success!',
        message: 'Your booking has been confirmed.',
        confirmText: 'View My Bookings'
      });
      navigate('/my-bookings');

    } catch (err) {
      let userMessage = "An unexpected error occurred during booking. Please try again.";
      if (err.code === '23505') {
        userMessage = "Sorry, this time slot was just booked by someone else. Please select a different slot.";
      }
      
      await showModal({
        type: 'error',
        title: 'Booking Failed',
        message: userMessage,
      });

      if (err.code === '23505') {
        navigate(`/venue/${venue.venue_id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container dashboard-page">
      <h1 className="section-heading" style={{ textAlign: 'center', fontSize: '2rem' }}>Confirm Your Booking</h1>
      <div className="booking-summary-card" style={{ maxWidth: '600px', margin: 'auto' }}>
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