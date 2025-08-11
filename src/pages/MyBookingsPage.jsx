import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../AuthContext';
import BookingCard from '../components/BookingCard';

function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            facilities (
              name,
              sports (name),
              venues (name)
            )
          `)
          .eq('user_id', user.id)
          .order('start_time', { ascending: false }); // Get latest bookings first

        if (error) throw error;
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  // Get current time to filter bookings
  const now = new Date();
  const upcomingBookings = bookings.filter(b => new Date(b.start_time) >= now);
  const pastBookings = bookings.filter(b => new Date(b.start_time) < now);

  if (loading) return <p className="container" style={{ textAlign: 'center', padding: '50px' }}>Loading your bookings...</p>;
  if (error) return <p className="container" style={{ textAlign: 'center', color: 'red', padding: '50px' }}>Error: {error}</p>;
  if (!user) return <p className="container" style={{ textAlign: 'center', padding: '50px' }}>Please log in to see your bookings.</p>;

  return (
    <div className="container dashboard-page">
      <h1 className="section-heading" style={{ textAlign: 'center', fontSize: '2rem' }}>My Bookings</h1>

      {/* Tab Navigation */}
      <div className="booking-tabs">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
        >
          History
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {activeTab === 'upcoming' && (
          upcomingBookings.length > 0
            ? upcomingBookings.map(booking => <BookingCard key={booking.booking_id} booking={booking} />)
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