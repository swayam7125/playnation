import React, { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BookingCard } from "../../components/bookings/BookingCard";
import {
  LoadingSpinner,
  ErrorState,
} from "../../components/common/LoadingAndError";
import { Calendar, Plus } from "lucide-react";
import SegmentedControl from "../../components/common/SegmentedControl";

// Constants outside component to prevent recreation
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const ITEMS_PER_PAGE = 36;

function MyBookingsPage() {
  const [view, setView] = useState("upcoming");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState({ upcoming: true, past: true });
  const [error, setError] = useState({ upcoming: null, past: null });
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const highlightedId = searchParams.get('highlight');

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 2023 + 1 }, (_, i) => 2024 + i);
  }, []);

  const months = useMemo(() => MONTHS, []);

  const fetchUpcomingBookings = useCallback(async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, upcoming: true }));
    setError(prev => ({ ...prev, upcoming: null }));

    try {
      const nowISO = new Date().toISOString();
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          booking_id, start_time, end_time, total_amount, status, has_been_reviewed,
          facilities ( name, sports ( name ), venues ( venue_id, name, address, city, image_url, cancellation_cutoff_hours ) ),
          reviews ( review_id )
        `)
        .eq("user_id", user.id)
        .eq("status", "confirmed")
        .gte("start_time", nowISO)
        .order("start_time", { ascending: true });

      if (error) throw error;
      setUpcomingBookings(data || []);
    } catch (err) {
      console.error("Error fetching upcoming bookings:", err.message);
      setError(prev => ({ ...prev, upcoming: "Failed to load upcoming bookings." }));
    } finally {
      setLoading(prev => ({ ...prev, upcoming: false }));
    }
  }, [user]);

  const fetchPastBookings = useCallback(async () => {
    if (!user) return;

    setLoading(prev => ({ ...prev, past: true }));
    setError(prev => ({ ...prev, past: null }));

    try {
      const nowISO = new Date().toISOString();
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          booking_id, start_time, end_time, total_amount, status, has_been_reviewed,
          facilities ( name, sports ( name ), venues ( venue_id, name, address, city, image_url, cancellation_cutoff_hours ) ),
          reviews ( review_id )
        `)
        .eq("user_id", user.id)
        .lt("start_time", nowISO)
        .filter("start_time", "gte", new Date(selectedYear, selectedMonth, 1).toISOString())
        .filter("start_time", "lt", new Date(selectedYear, selectedMonth + 1, 1).toISOString())
        .order("start_time", { ascending: false })
        .limit(ITEMS_PER_PAGE);
        
      if (error) throw error;
      setPastBookings(data || []);
    } catch (err) {
      console.error("Error fetching past bookings:", err.message);
      setError(prev => ({ ...prev, past: "Failed to load past bookings." }));
    } finally {
      setLoading(prev => ({ ...prev, past: false }));
    }
  }, [user, selectedMonth, selectedYear]);

  useEffect(() => {
    fetchUpcomingBookings();
    fetchPastBookings();
  }, [fetchUpcomingBookings, fetchPastBookings]);

  const handleRefresh = useCallback(() => {
    fetchUpcomingBookings();
    fetchPastBookings();
  }, [fetchUpcomingBookings, fetchPastBookings]);

  const handleReviewSubmitted = useCallback(() => {
    fetchPastBookings();
  }, [fetchPastBookings]);

  const handleCancelBooking = async (bookingId, reason) => {
    if (!user || !bookingId || !reason) return;

    const loadingToast = toast.loading('Canceling booking...');

    try {
      const { error: rpcError } = await supabase.rpc(
        'cancel_booking_transaction', 
        { 
          p_booking_id: bookingId, 
          p_user_id: user.id,
          p_cancellation_reason: reason
        }
      );

      if (rpcError) {
        throw new Error(rpcError.message);
      }

      toast.success('Booking successfully cancelled and slot released.', { id: loadingToast });
      
      handleRefresh();

    } catch (err) {
      console.error("Cancellation error:", err);
      const dbErrorMessage = err.message || "Could not cancel booking. Please try again.";
      let friendlyMessage;

      if (dbErrorMessage.includes('already cancelled')) {
        friendlyMessage = 'Booking is already cancelled.';
      } else if (dbErrorMessage.includes('Booking not found')) {
        friendlyMessage = 'Booking not found or not owned by you.';
      } else {
        friendlyMessage = dbErrorMessage;
      }

      toast.error(friendlyMessage, { id: loadingToast });
    }
  };

  const bookingsToShow = useMemo(() => 
    view === "upcoming" ? upcomingBookings : pastBookings,
    [view, upcomingBookings, pastBookings]
  );

  const isLoading = view === 'upcoming' ? loading.upcoming : loading.past;
  const currentError = view === 'upcoming' ? error.upcoming : error.past;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-dark-text">My Bookings</h1>
        <SegmentedControl 
          options={[{label: 'Upcoming', value: 'upcoming'}, {label: 'Past', value: 'past'}]}
          value={view}
          onChange={setView}
        />
      </div>

      {view === "past" && (
        <div className="mb-6 flex gap-4 items-center justify-start">
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {months.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="w-36">
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {isLoading ? (
        <LoadingSpinner text={`Fetching ${view} bookings...`} />
      ) : currentError ? (
        <ErrorState message={currentError} />
      ) : bookingsToShow.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookingsToShow.map((booking, index) => (
            <div key={booking.booking_id} className="fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <BookingCard
                booking={booking}
                onReviewSubmitted={handleReviewSubmitted}
                onCancelBooking={handleCancelBooking}
                isHighlighted={booking.booking_id === highlightedId}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card-bg rounded-lg border border-border-color-light">
          <Calendar size={48} className="mx-auto text-medium-text/50 mb-4" />
          <h3 className="text-xl font-semibold text-dark-text">No {view} bookings found</h3>
          <p className="text-medium-text mt-2 mb-4">
            {view === "upcoming" ? "Time to book your next game!" : 
             `No bookings found for ${months[selectedMonth]} ${selectedYear}`}
          </p>
          <button onClick={() => navigate('/explore')} className="bg-primary-green text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-green-dark transition-colors flex items-center mx-auto">
            <Plus size={16} className="mr-2" />
            Book a Venue
          </button>
        </div>
      )}

      {view === "past" && bookingsToShow.length === ITEMS_PER_PAGE && (
        <div className="mt-6 text-center text-sm text-gray-600">
          Showing first {ITEMS_PER_PAGE} bookings for {months[selectedMonth]} {selectedYear}
        </div>
      )}
    </div>
  );
}

export default MyBookingsPage;