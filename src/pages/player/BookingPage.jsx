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
  const { showModal } = useModal();
  const { venue, facility, slot, price } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!venue || !facility || !slot || price === undefined) {
    React.useEffect(() => {
        navigate('/explore');
    }, [navigate]);
    return null;
  }
  
  const totalAmount = price;

  const handleConfirmBooking = async () => {
    if (!user) {
      showModal({ title: "Login Required", message: "Please log in to make a booking." });
      navigate('/login', { state: { from: location } });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error: bookingError } = await supabase
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
        });
      
      if (bookingError) throw bookingError;

      const { error: slotError } = await supabase
        .from('time_slots')
        .update({ is_available: false })
        .eq('slot_id', slot.slot_id);
      
      if (slotError) throw slotError;

      await showModal({ title: "Booking Confirmed", message: "Your booking has been confirmed successfully!" });
      navigate('/my-bookings');

    } catch (err) {
      setError(err.message);
      showModal({ title: "Booking Failed", message: `Booking failed: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-center text-3xl font-bold mb-8 text-dark-text">Confirm Your Booking</h1>
      {error && <p className="text-center text-red-600 mb-4">Error: {error}</p>}

      <div className="max-w-lg mx-auto bg-card-bg p-8 rounded-xl border border-border-color shadow-lg">
        <h3 className="text-2xl font-bold text-dark-text mb-2">{venue.name}</h3>
        <p className="text-medium-text mb-6"><strong>Facility:</strong> {facility.name} ({facility.sports.name})</p>
        <div className="space-y-4 text-medium-text border-t border-b border-border-color py-6">
            <p><strong>Date:</strong> {formatDate(slot.start_time)}</p>
            <p><strong>Time:</strong> {formatTime(slot.start_time)} - {formatTime(slot.end_time)}</p>
        </div>
        <div className="flex justify-between items-center text-xl font-bold text-dark-text mt-6">
          <span>Total Amount</span>
          <span>₹{totalAmount}</span>
        </div>
        <button onClick={handleConfirmBooking} className="w-full mt-8 py-4 px-6 rounded-lg font-semibold text-lg transition duration-300 bg-primary-green text-white shadow-sm hover:bg-primary-green-dark hover:-translate-y-px hover:shadow-md disabled:bg-gray-400" disabled={loading}>
          {loading ? 'Processing...' : 'Proceed to Pay'}
        </button>
      </div>
    </div>
  );
}

export default BookingPage;