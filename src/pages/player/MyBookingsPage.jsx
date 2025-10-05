import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import BookingCard from "../../components/bookings/BookingCard";
import {
  LoadingSpinner,
  ErrorState,
} from "../../components/common/LoadingAndError";
import { Calendar } from "lucide-react";

function MyBookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("upcoming");
  const [refreshKey, setRefreshKey] = useState(0);

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
        )
        .eq("user_id", user.id);

      if (fetchError) throw fetchError;

      const now = new Date();
      const allBookings = data || [];

      const upcomingBookings = allBookings
        .filter((b) => new Date(b.start_time) >= now)
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

      const pastBookings = allBookings
        .filter((b) => new Date(b.start_time) < now)
        .sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

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

  const handleCancelBooking = async (bookingId) => {
    console.log("Cancelling booking:", bookingId);
    handleRefresh();
  };

  const handleReviewSubmitted = () => {
    handleRefresh();
  };

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
          {view === "upcoming" ? "Time to get a game in!" : "You haven't played in a while."}
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