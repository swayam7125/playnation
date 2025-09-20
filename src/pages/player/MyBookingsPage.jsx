import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import BookingCard from '../../components/bookings/BookingCard';
import ReviewForm from '../../components/reviews/ReviewForm';
import { useModal } from '../../ModalContext';

function MyBookingsPage() {
  const { user } = useAuth();
  const { showModal } = useModal();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  const fetchBookings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`*, facilities (*, sports (name), venues (*))`)
        .eq('user_id', user.id)
        .order('start_time', { ascending: false });
      if (error) throw error;
      setBookings(data || []);
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
    const isConfirmed = await showModal({
      title: "Confirm Cancellation",
      message: "Are you sure you want to cancel this booking?",
      confirmText: "Yes, Cancel",
      confirmStyle: "danger"
    });

    if (isConfirmed) {
      try {
        // --- START OF ATOMIC SOLUTION ---
        // 1. Call the PostgreSQL RPC function to perform the cancellation transaction.
        const { error: rpcError } = await supabase.rpc('cancel_booking_transaction', {
          p_booking_id: booking.booking_id,
          p_user_id: user.id
        });

        if (rpcError) throw rpcError;
        // --- END OF ATOMIC SOLUTION ---

        // 2. Success Notification and Refresh
        await showModal({ 
            title: "Success", 
            message: "Booking cancelled successfully. The slot is now available." 
        });
        
        // Re-fetch all bookings to guarantee component state is consistent with the database.
        fetchBookings();
        
      } catch (error) {
        // Handle error message from the database function
        showModal({ 
            title: "Cancellation Failed", 
            message: `Error: ${error.message}. Please check your booking status.` 
        });
      }
    }
  };

  const handleOpenReviewModal = (booking) => {
    setSelectedBookingForReview(booking);
    setShowReviewModal(true);
  };

  const now = new Date();
  const upcomingBookings = bookings.filter(b => new Date(b.start_time) >= now && b.status === 'confirmed');
  const pastBookings = bookings.filter(b => new Date(b.start_time) < now || b.status !== 'confirmed');

  if (loading) return <p className="container mx-auto text-center p-12">Loading your bookings...</p>;
  if (error) return <p className="container mx-auto text-center text-red-600 p-12">Error: {error}</p>;
  if (!user) return <p className="container mx-auto text-center p-12">Please log in to see your bookings.</p>;

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-center text-3xl font-bold mb-8 text-dark-text">My Bookings</h1>
        <div className="flex justify-center gap-4 mb-12 border-b border-border-color">
          <button 
            onClick={() => setActiveTab('upcoming')} 
            className={`py-4 px-6 font-semibold text-base border-b-4 transition duration-300 ${activeTab === 'upcoming' ? 'border-primary-green text-primary-green' : 'border-transparent text-light-text hover:text-dark-text'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveTab('past')} 
            className={`py-4 px-6 font-semibold text-base border-b-4 transition duration-300 ${activeTab === 'past' ? 'border-primary-green text-primary-green' : 'border-transparent text-light-text hover:text-dark-text'}`}
          >
            History
          </button>
        </div>
        <div className="max-w-3xl mx-auto grid gap-8">
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
              : <p className="text-center text-light-text">You have no upcoming bookings.</p>
          )}
          {activeTab === 'past' && (
            pastBookings.length > 0
              ? pastBookings.map(booking => (
                  <BookingCard 
                    key={booking.booking_id} 
                    booking={booking}
                    onLeaveReview={() => handleOpenReviewModal(booking)}
                  />
                ))
              : <p className="text-center text-light-text">You have no past bookings.</p>
          )}
        </div>
      </div>
      {showReviewModal && selectedBookingForReview && (
        <ReviewForm 
          booking={selectedBookingForReview} 
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={fetchBookings}
        />
      )}
    </>
  );
}

export default MyBookingsPage;