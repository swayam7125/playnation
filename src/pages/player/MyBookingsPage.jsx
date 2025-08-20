import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import BookingCard from '../../components/bookings/BookingCard';

function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  const fetchBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`*, facilities (*, sports (name), venues (name))`)
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });
      if (error) throw error;
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (booking) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        // Step 1: Update the booking status
        const { data: updatedBooking, error: bookingError } = await supabase
          .from('bookings')
          .update({ 
            status: 'cancelled', 
            payment_status: 'refunded',
            cancelled_by: user.id
          })
          .eq('booking_id', booking.booking_id)
          .select()
          .single();
        
        if (bookingError) throw bookingError;

        // Step 2: Make the associated time slot available again
        const { error: slotError } = await supabase
          .from('time_slots')
          .update({ is_available: true })
          .eq('slot_id', booking.slot_id);

        if (slotError) throw slotError;

        alert("Booking cancelled successfully.");
        setBookings(currentBookings => 
          currentBookings.map(b => b.booking_id === booking.booking_id ? updatedBooking : b)
        );
      } catch (error) {
        alert(`Error in cancelling booking: ${error.message}`);
      }
    }
  };

  const now = new Date();
  const upcomingBookings = bookings.filter(b => new Date(b.start_time) >= now && b.status === 'confirmed');
  const pastBookings = bookings.filter(b => new Date(b.start_time) < now || b.status !== 'confirmed');

  if (loading) return <p className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading your bookings...</p>;
  if (error) return <p className="container" style={{ textAlign: 'center', color: 'red', padding: '50px' }}>Error: {error}</p>;
  if (!user) return <p className="container" style={{ textAlign: 'center', padding: '50px' }}>Please log in to see your bookings.</p>;

  return (
    <div className="container dashboard-page">
      <h1 className="section-heading" style={{ textAlign: 'center', fontSize: '2rem' }}>My Bookings</h1>
      <div className="booking-tabs">
        <button onClick={() => setActiveTab('upcoming')} className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}>Upcoming</button>
        <button onClick={() => setActiveTab('past')} className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}>History</button>
      </div>
      <div className="bookings-list">
        {activeTab === 'upcoming' && (
          upcomingBookings.length > 0
            ? upcomingBookings.map(booking => (
                <BookingCard 
                  key={booking.booking_id} 
                  booking={booking} 
                  isUpcoming={true} 
                  onCancel={() => handleCancelBooking(booking)} 
                />
              ))
            : <p>You have no upcoming bookings.</p>
        )}
        {activeTab === 'past' && (
          pastBookings.length > 0
            ? pastBookings.map(booking => <BookingCard key={booking.booking_id} booking={booking} />)
            : <p>You have no past bookings.</p>
        )}
      </div>
    </div>
  );
}

export default MyBookingsPage;