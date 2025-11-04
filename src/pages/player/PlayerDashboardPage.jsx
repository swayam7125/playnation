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
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-primary-green text-white p-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">Player Dashboard</h1>
          <p className="mt-2 opacity-80">
            Welcome back, {profile?.username}! Here's a summary of your activity.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={CreditCard}
            title="Available Credits"
            count={isLoadingStats ? "..." : profile?.credits ?? 0}
            bgColor="bg-gradient-to-br from-emerald-500 to-green-500"
          />
          <StatsCard
            icon={Shield}
            title="Bookings Made"
            count={isLoadingBookingsMade ? "..." : bookingsMade?.count ?? 0}
            bgColor="bg-gradient-to-br from-blue-500 to-indigo-500"
          />
          <StatsCard
            icon={Award}
            title="Favorite Sport"
            count={
              isLoadingStats ? "..." : playerStats?.favoriteSport ?? "Not set"
            }
            bgColor="bg-gradient-to-br from-purple-500 to-pink-500"
          />
          <StatsCard
            icon={Clock}
            title="Member Since"
            count={isLoadingStats ? "..." : playerStats?.memberSince ?? "N/A"}
            bgColor="bg-gradient-to-br from-gray-700 to-gray-800"
          />
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Bookings & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Booking Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Upcoming Booking
                </h2>
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="text-sm font-medium text-primary-green hover:text-primary-green-dark transition-colors"
                >
                  View All →
                </button>
              </div>

              {isLoadingBooking ? (
                <Loader />
              ) : upcomingBooking ? (
                <div className="bg-light-green-bg border-l-4 border-primary-green p-6 rounded-lg">
                  <h3 className="font-bold text-2xl text-gray-800">
                    {upcomingBooking.facilities?.venues?.name}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {upcomingBooking.facilities?.name}
                  </p>
                  <div className="flex items-center text-gray-500 mt-4">
                    <Clock size={18} className="mr-2" />
                    <span className="font-medium">
                      {new Date(
                        upcomingBooking.time_slots?.start_time
                      ).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(
                        upcomingBooking.time_slots?.start_time
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mt-6 flex space-x-4">
                    <button
                      onClick={() =>
                        navigate("/my-bookings", {
                          state: { highlightedId: upcomingBooking.booking_id },
                        })
                      }
                      className="flex-1 bg-primary-green text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-green-dark transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() =>
                        navigate(
                          `/venues/${upcomingBooking.facilities?.venues?.id}`
                        )
                      }
                      className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-all duration-300"
                    >
                      View Venue
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center bg-gray-50 rounded-lg p-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                  <p className="text-lg text-gray-600 mb-6">No upcoming bookings.</p>
                  <button
                    onClick={() => navigate("/explore")}
                    className="bg-primary-green text-white py-3 px-8 rounded-lg font-semibold hover:bg-primary-green-dark transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Quick Actions
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/explore")}
                  className="w-full flex items-center space-x-4 bg-primary-green text-white p-5 rounded-xl hover:bg-primary-green-dark transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <Calendar className="h-6 w-6" />
                  <span className="flex-1 text-left font-semibold">Book a Venue</span>
                </button>
                <button
                  onClick={() => navigate("/my-bookings")}
                  className="w-full flex items-center space-x-4 bg-gray-200 text-gray-800 p-5 rounded-xl hover:bg-gray-300 transition-all duration-300"
                >
                  <Clock className="h-6 w-6" />
                  <span className="flex-1 text-left font-semibold">
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