import React, { useMemo } from 'react';
import { Shield, Clock, Calendar, CreditCard, Settings, Award, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/common/StatsCard';
import Loader from '../../components/common/Loader';
import { LoadingSpinner, ErrorState } from '../../components/common/LoadingAndError';
import { useAuth } from '../../AuthContext';
import useSupabaseQuery from '../../hooks/useSupabaseQuery';
import { supabase } from '../../supabaseClient';
import HeroOfferCarousel from '../../components/offers/HeroOfferCarousel';
import FeaturedVenues from '../../components/home/FeaturedVenues';
import useVenues from '../../hooks/useVenues';

const PlayerDashboardPage = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Fetch upcoming booking
  const { 
    data: upcomingBooking, 
    isLoading: isLoadingBooking,
    error: bookingError,
    refetch: refetchBooking 
  } = useSupabaseQuery(
    'upcoming-booking',
    () =>
      supabase
        .from('bookings')
        .select(
          '*, facilities(name, venues(name)), time_slots(start_time, end_time)'
        )
        .eq('user_id', profile?.user_id)
        .eq('status', 'confirmed')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(1)
        .single(),
    { enabled: !!profile }
  );

  const { data: bookingsMade, isLoading: isLoadingBookingsMade } = useSupabaseQuery(
    'bookings-made',
    () =>
      supabase
        .from('bookings')
        .select('booking_id', { count: 'exact' })
        .eq('user_id', profile?.user_id),
    { enabled: !!profile }
  );

  // Fetch recent bookings for activity history
  const {
    data: recentBookings,
    isLoading: isLoadingRecent,
    error: recentError,
    refetch: refetchRecent
  } = useSupabaseQuery(
    'recent-bookings',
    () =>
      supabase
        .from('bookings')
        .select('*, facilities(name, venues(name)), time_slots(start_time, end_time)')
        .eq('user_id', profile?.user_id)
        .order('created_at', { ascending: false })
        .limit(5),
    { enabled: !!profile }
  );

  const topVenuesOptions = useMemo(() => ({
    limit: 4,
    sortBy: 'rating',
  }), []);

  const { venues: topVenues, loading: loadingVenues, error: errorVenues } = useVenues(topVenuesOptions);

  // Fetch player statistics from bookings
  const { data: playerStats, isLoading: isLoadingStats } = useSupabaseQuery(
    'player-stats',
    async () => {
      // Fetch favorite sport (most booked facility type)
      const { data: favoriteActivity } = await supabase
        .from('bookings')
        .select('facilities(type)')
        .eq('user_id', profile?.user_id)
        .then(({ data }) => {
          const typeCounts = data?.reduce((acc, booking) => {
            const type = booking.facilities?.type;
            if (type) {
              acc[type] = (acc[type] || 0) + 1;
            }
            return acc;
          }, {});
          const favorite = Object.entries(typeCounts || {})
            .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Not set';
          return { data: favorite };
        });

      return {
        favoriteSport: favoriteActivity,
        memberSince: profile ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'
      };
    },
    { enabled: !!profile }
  );

  // Fetch credit transactions history
  const { data: creditHistory } = useSupabaseQuery(
    'credit-history',
    () =>
      supabase
        .from('credit_transactions')
        .select('*')
        .eq('user_id', profile?.user_id)
        .order('created_at', { ascending: false })
        .limit(5),
    { enabled: !!profile }
  );

  const renderRecentActivity = () => {
    if (isLoadingRecent) return <LoadingSpinner />;
    if (recentError) return <ErrorState error={recentError.message} onRetry={() => refetchRecent()} />;
    
    return recentBookings?.map((booking) => (
      <div key={booking.booking_id} className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="bg-blue-100 p-3 rounded-full">
          <Calendar className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{booking.facilities?.venues?.name}</h4>
          <p className="text-sm text-gray-500">
            {new Date(booking.time_slots?.start_time).toLocaleDateString()} at{" "}
            {new Date(booking.time_slots?.start_time).toLocaleTimeString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>
    ));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Profile Summary */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Player Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back, {profile?.username}! Here's a summary of your
              activity.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={CreditCard}
            title="Available Credits"
            count={isLoadingStats ? "..." : profile?.credits ?? 0}
            bgColor="bg-emerald-100"
            textColor="text-emerald-500"
          />
          <StatsCard
            icon={Shield}
            title="Bookings Made"
            count={isLoadingBookingsMade ? "..." : bookingsMade?.count ?? 0}
            bgColor="bg-blue-100"
            textColor="text-blue-500"
          />
          <StatsCard
            icon={Award}
            title="Favorite Sport"
            count={
              isLoadingStats ? "..." : playerStats?.favoriteSport ?? "Not set"
            }
            bgColor="bg-purple-100"
            textColor="text-purple-500"
          />
          <StatsCard
            icon={Clock}
            title="Member Since"
            count={isLoadingStats ? "..." : playerStats?.memberSince ?? "N/A"}
            bgColor="bg-indigo-100"
            textColor="text-indigo-500"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Bookings & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Booking Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Upcoming Booking
                </h2>
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  View All →
                </button>
              </div>

              {isLoadingBooking ? (
                <Loader />
              ) : upcomingBooking ? (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
                  <h3 className="font-bold text-lg text-gray-800">
                    {upcomingBooking.facilities?.venues?.name}
                  </h3>
                  <p className="text-gray-600">
                    {upcomingBooking.facilities?.name}
                  </p>
                  <div className="flex items-center text-gray-500 mt-2">
                    <Clock size={16} className="mr-2" />
                    <span>
                      {new Date(
                        upcomingBooking.time_slots?.start_time
                      ).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(
                        upcomingBooking.time_slots?.start_time
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={() =>
                        navigate("/my-bookings", {
                          state: { highlightedId: upcomingBooking.booking_id },
                        })
                      }
                      className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/venues/${upcomingBooking.facilities?.venues?.id}`
                        )
                      }
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      View Venue
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center bg-gray-50 rounded-lg p-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No upcoming bookings.</p>
                  <button
                    onClick={() => navigate("/explore")}
                    className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Explore Venues
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions & Resources */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Actions Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/explore")}
                  className="w-full flex items-center space-x-3 bg-primary-green text-white p-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                  <span className="flex-1 text-left">Book a Venue</span>
                </button>
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="w-full flex items-center space-x-3 bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="flex-1 text-left text-gray-700">
                    My Bookings
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <HeroOfferCarousel />
        </div>

        <div className="mb-8">
          <FeaturedVenues
            venues={topVenues}
            loading={loadingVenues}
            error={errorVenues}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerDashboardPage;