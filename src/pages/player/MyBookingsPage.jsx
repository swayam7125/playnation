// src/pages/player/MyBookingsPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { useLocation } from "react-router-dom"; //
import toast from "react-hot-toast";
import BookingCard from "../../components/bookings/BookingCard";
import {
  LoadingSpinner,
  ErrorState,
} from "../../components/common/LoadingAndError";
import { Calendar } from "lucide-react";

function MyBookingsPage() {
  const { user } = useAuth();
  const location = useLocation(); //
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("upcoming");
  const [refreshKey, setRefreshKey] = useState(0);
  const highlightedId = location.state?.highlightedId; //

  const fetchBookings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("bookings")
        .select(
          `
          booking_id, start_time, end_time, total_amount, status, has_been_reviewed,
          facilities ( name, sports ( name ), venues ( venue_id, name, address, city, image_url ) ),
          reviews ( review_id )
        `
        ) //
        .eq("user_id", user.id);

      if (fetchError) throw fetchError;

      const now = new Date();
      const allBookings = data || [];

      // FIX: Upcoming bookings must be in the future AND have a 'confirmed' status.
      const upcomingBookings = allBookings
        .filter((b) => new Date(b.start_time) >= now && b.status === "confirmed") //
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

      // FIX: Past bookings include all bookings that are in the past OR any booking that is not 'confirmed' (cancelled/failed).
      const pastBookings = allBookings
        .filter((b) => new Date(b.start_time) < now || b.status !== "confirmed") //
        .sort((a, b) => new Date(b.start_time) - new Date(b.start_time));

      setBookings({
        upcoming: upcomingBookings,
        past: pastBookings,
      });
    } catch (err) {
      console.error("Error fetching bookings:", err.message);
      setError("Failed to load your bookings. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings, refreshKey]);

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const handleReviewSubmitted = () => {
    handleRefresh();
  };

  // 👇 --- THIS FUNCTION WAS INCORRECT ---
  // It must accept 'reason' and pass it to the RPC
  const handleCancelBooking = async (bookingId, reason) => {
    if (!user || !bookingId || !reason) return;

    // Start loading toast
    const loadingToast = toast.loading('Canceling booking...');

    try {
      // Call the secure PostgreSQL function using RPC
      const { error: rpcError } = await supabase.rpc(
        'cancel_booking_transaction', 
        { 
          p_booking_id: bookingId, 
          p_user_id: user.id,
          p_cancellation_reason: reason // 👈 Pass the reason here
        }
      );

      if (rpcError) {
        // Throw to enter catch block and handle DB errors
        throw new Error(rpcError.message);
      }

      // Success notification
      toast.success('Booking successfully cancelled and slot released.', { id: loadingToast });
      
      // Refresh the booking list
      handleRefresh();

    } catch (err) {
      console.error("Cancellation error:", err);
      const dbErrorMessage = err.message || "Could not cancel booking. Please try again.";
      let friendlyMessage;

      // Map specific database errors to friendly messages
      if (dbErrorMessage.includes('already cancelled')) {
        friendlyMessage = 'Booking is already cancelled.';
      } else if (dbErrorMessage.includes('Booking not found')) {
        friendlyMessage = 'Booking not found or not owned by you.';
      } else {
        friendlyMessage = dbErrorMessage; // Use the direct DB error if it's clear
      }

      // Error notification
      toast.error(friendlyMessage, { id: loadingToast });
    }
  };
  // 👆 --- END OF CORRECTED FUNCTION ---


  const RenderBookings = () => {
    const bookingsToShow = view === "upcoming" ? bookings.upcoming : bookings.past;

    if (loading) {
      return <LoadingSpinner text="Fetching your bookings..." />;
    }
    if (error) {
      return <ErrorState message={error} />;
    }
    if (bookingsToShow && bookingsToShow.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookingsToShow.map((booking) => (
            <BookingCard
              key={booking.booking_id}
              booking={booking}
              onReviewSubmitted={handleReviewSubmitted}
              onCancelBooking={handleCancelBooking}
              isHighlighted={booking.booking_id === highlightedId}
            />
          ))}
        </div>
      );
    }
    return (
      <div className="text-center py-16 bg-card-bg rounded-lg border border-border-color-light">
        <Calendar size={48} className="mx-auto text-medium-text/50 mb-4" />
        <h3 className="text-xl font-semibold text-dark-text">No {view} bookings found</h3>
        <p className="text-medium-text mt-2">
          {view === "upcoming" ? "Time to book your next game!" : "You haven't played in a while."}
        </p>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-dark-text mb-8">My Bookings</h1>
      <div className="flex justify-center mb-8 border-b border-border-color">
        <button
          onClick={() => setView("upcoming")}
          className={`px-6 py-3 font-semibold transition ${
            view === "upcoming"
              ? "text-primary-green border-b-2 border-primary-green"
              : "text-medium-text"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setView("past")}
          className={`px-6 py-3 font-semibold transition ${
            view === "past"
              ? "text-primary-green border-b-2 border-primary-green"
              : "text-medium-text"
          }`}
        >
          Past
        </button>
      </div>
      <RenderBookings />
    </div>
  );
}

export default MyBookingsPage;