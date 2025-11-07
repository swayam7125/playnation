import React from 'react';
import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import useSupabaseQuery from '../../hooks/useSupabaseQuery';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { Link } from 'react-router-dom';
import Skeleton from '../../components/common/Skeleton';
import { 
  Calendar, 
  Wallet, 
  Receipt, 
  Star, 
  Ticket, 
  AlertTriangle,
  Award
} from 'lucide-react';
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/formatters';
import useVenues from '../../hooks/useVenues';
import FeaturedVenues from '../../components/home/FeaturedVenues';
import FeaturedVenuesSkeleton from '../../components/skeletons/FeaturedVenuesSkeleton';

// Fade-in animation variants
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

// Stat Card Skeleton
function StatCardSkeleton() {
  return (
    <div className="bg-primary-green-dark border border-primary-green rounded-xl shadow-lg p-6 flex items-center space-x-4">
      <Skeleton className="h-14 w-14 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

// Stat Card (Unchanged)
function StatCard({ title, value, icon }) {
  return (
    <motion.div 
      className="bg-primary-green-dark border border-primary-green rounded-xl shadow-lg p-6 flex items-center space-x-4 transition-transform hover:scale-105 duration-300"
      variants={fadeInVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="p-4 rounded-full bg-white"> 
        {React.cloneElement(icon, { className: "h-7 w-7 text-primary-green-dark" })}
      </div>
      <div>
        <p className="text-sm text-gray-200 font-medium uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}

// Upcoming Bookings Skeleton
function UpcomingBookingsSkeleton() {
  return (
    <div className="bg-card-bg border border-border-color-light rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-border-color-light flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-7 w-48" />
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
      <ul className="divide-y divide-border-color-light">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="text-left md:text-right mt-2 md:mt-0 space-y-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Favorite Venues Skeleton
function FavoriteVenuesSkeleton() {
  return (
    <div className="bg-card-bg border border-border-color-light rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-border-color-light">
        <Skeleton className="h-7 w-48" />
      </div>
      <ul className="divide-y divide-border-color-light">
        {Array.from({ length: 3 }).map((_, i) => (
          <li key={i} className="p-6 flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-10 w-24 rounded-md" />
          </li>
        ))}
      </ul>
    </div>
  );
}

// Current Offers Skeleton
function CurrentOffersSkeleton() {
  return (
    <div className="bg-card-bg border border-border-color-light rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-border-color-light">
        <Skeleton className="h-7 w-36" />
      </div>
      <ul className="divide-y divide-border-color-light">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="p-4 flex items-center space-x-4">
            <Skeleton className="h-11 w-11 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Error Component (Unchanged)
function DashboardError({ error, title }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center space-x-4">
      <AlertTriangle className="h-8 w-8 text-red-500" />
      <div>
        <p className="font-bold text-lg">{title}</p>
        <p className="text-sm">{error.message}. Please check your connection or RLS policies.</p>
      </div>
    </div>
  )
}

// Main Dashboard Component
export default function PlayerDashboardPage() {
  const { user } = useAuth();

  // --- Data Fetching (Unchanged) ---
  const fetchDashboardStats = useCallback(() => {
    return supabase.rpc('get_player_dashboard_stats');
  }, []);

  const fetchCurrentOffers = useCallback(() => {
    return supabase
      .from('offers')
      .select('offer_id, title, description, discount_percentage, fixed_discount_amount, offer_type')
      .eq('is_active', true)
      .or(`valid_until.is.null,valid_until.gt.${new Date().toISOString()}`)
      .limit(4);
  }, []);

  const { 
    data: statsData, 
    isLoading: isLoadingStats, 
    error: statsError 
  } = useSupabaseQuery(
    'playerDashboardStats',
    fetchDashboardStats,
    { enabled: !!user, refetchOnWindowFocus: true }
  );

  const topVenuesOptions = useMemo(() => ({
    limit: 4,
    sortBy: "rating",
  }), []);

  const { 
    venues: topVenues, 
    loading: isLoadingTopVenues, 
    error: topVenuesError 
  } = useVenues(topVenuesOptions);
  
  const { 
    data: offersData, 
    isLoading: isLoadingOffers,
    error: offersError
  } = useSupabaseQuery(
    'currentOffers',
    fetchCurrentOffers,
    { refetchOnWindowFocus: true } 
  );
  // --- End Data Fetching ---

  const dashboardStats = statsData || {};
  const offers = offersData || [];

  const {
    upcoming_bookings_count = 0, 
    favorite_venues = [],
    credit_balance = 0,
    total_bookings_count = 0,
    total_spent = 0,
    upcoming_bookings_list = [],
    most_played_sport = 'N/A'
  } = dashboardStats;

  return (
    <div className="bg-background min-h-screen">
      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Welcome Header */}
        <h1 className="text-4xl font-bold text-primary-green-dark mb-8">
          Hello, {user?.user_metadata?.first_name || 'Player'}!
        </h1>
        
        {/* Error Section */}
        {statsError && (
          <div className="mb-6">
            <DashboardError error={statsError} title="Error Loading Your Stats" />
          </div>
        )}
        {topVenuesError && (
          <div className="mb-6">
            <DashboardError error={topVenuesError} title="Error Loading Featured Venues" />
          </div>
        )}
        {offersError && (
          <div className="mb-6">
            <DashboardError error={offersError} title="Error Loading Current Offers" />
          </div>
        )}

        {/* --- Main Two-Column Layout --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Left Column (2/3 width) --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* --- Stats Grid --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoadingStats ? (
                <>
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                  <StatCardSkeleton />
                </>
              ) : (
                <>
                  <StatCard
                    title="Total Bookings"
                    value={total_bookings_count}
                    icon={<Receipt />}
                  />
                  <StatCard
                    title="Favorite Sport"
                    value={most_played_sport || 'N/A'}
                    icon={<Award />}
                  />
                  <StatCard
                    title="Credit Balance"
                    value={formatCurrency(credit_balance)}
                    icon={<Wallet />}
                  />
                  <StatCard
                    title="Total Spent"
                    value={formatCurrency(total_spent)}
                    icon={<Receipt />}
                  />
                </>
              )}
            </div>

            {/* Upcoming Bookings Card */}
            {isLoadingStats ? (
              <UpcomingBookingsSkeleton />
            ) : (
              <motion.div 
                className="bg-card-bg border border-border-color-light rounded-xl shadow-lg overflow-hidden"
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="p-6 border-b border-border-color-light flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-xl font-bold text-primary-green-dark">
                      Your Next Bookings
                    </h2>
                    {upcoming_bookings_count > 0 && (
                      <span className="bg-primary-green text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {upcoming_bookings_count}
                      </span>
                    )}
                  </div>
                  <Link to="/my-bookings" className="text-sm font-medium text-primary-green hover:text-primary-green-dark">
                    View All
                  </Link>
                </div>
                
                {upcoming_bookings_list && upcoming_bookings_list.length > 0 ? (
                  <ul className="divide-y divide-border-color-light">
                    {upcoming_bookings_list.map((booking) => (
                      <li key={booking.booking_id} className="p-6 hover:bg-hover-bg transition-colors duration-200">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <p className="font-semibold text-primary-green text-lg">{booking.venue_name}</p>
                            <p className="text-medium-text">{booking.facility_name}</p>
                          </div>
                          <div className="text-left md:text-right mt-2 md:mt-0">
                            <p className="text-dark-text font-medium">
                              {format(new Date(booking.start_time), 'eee, dd MMM yyyy')}
                            </p>
                            <p className="text-light-text text-sm">
                              {format(new Date(booking.start_time), 'p')}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-6 text-medium-text">You have no upcoming bookings.</p>
                )}
              </motion.div>
            )}
          </div>

          {/* --- Right Column (1/3 width) --- */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Favorite Venues Card */}
            {isLoadingStats ? (
              <FavoriteVenuesSkeleton />
            ) : (
              <motion.div 
                className="bg-card-bg border border-border-color-light rounded-xl shadow-lg overflow-hidden"
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="p-6 border-b border-border-color-light">
                  <h2 className="text-xl font-bold text-primary-green-dark">
                    Your Favorite Venues
                  </h2>
                </div>
                
                {favorite_venues && favorite_venues.length > 0 ? (
                  <ul className="divide-y divide-border-color-light">
                    {favorite_venues.map((venue) => (
                      <li key={venue.venue_id} className="p-6 flex justify-between items-center hover:bg-hover-bg transition-colors duration-200">
                        <div>
                          <p className="font-semibold text-primary-green text-lg">{venue.name}</p>
                          <p className="text-medium-text text-sm">{venue.booking_count} {venue.booking_count > 1 ? 'bookings' : 'booking'}</p>
                        </div>
                        <Link
                          to={`/venue/${venue.venue_id}`}
                          className="px-4 py-2 bg-primary-green text-white text-sm font-medium rounded-md hover:bg-primary-green-dark transition-colors"
                        >
                          Book Again
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="p-6 text-medium-text">You don't have any favorite venues yet. Start booking!</p>
                )}
              </motion.div>
            )}

            {/* Current Offers Card */}
            {isLoadingOffers ? (
              <CurrentOffersSkeleton />
            ) : (
              <motion.div 
                className="bg-card-bg border border-border-color-light rounded-xl shadow-lg overflow-hidden"
                variants={fadeInVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="p-6 border-b border-border-color-light">
                  <h2 className="text-xl font-bold text-primary-green-dark">
                    Current Offers
                  </h2>
                </div>
                <ul className="divide-y divide-border-color-light">
                  {offers && offers.length > 0 ? (
                    offers.map((offer) => (
                      <li key={offer.offer_id} className="p-4 flex items-center space-x-4 hover:bg-hover-bg">
                        <div className="p-3 rounded-full bg-light-green-bg">
                          <Ticket className="h-5 w-5 text-primary-green" />
                        </div>
                        <div>
                          <p className="font-semibold text-dark-text">{offer.title}</p>
                          <p className="text-sm text-medium-text">
                            {offer.offer_type === 'percentage_discount' 
                              ? `${offer.discount_percentage}% OFF` 
                              : `${formatCurrency(offer.fixed_discount_amount)} OFF`}
                          </p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="p-6 text-medium-text">No offers available at the moment.</p>
                  )}
                </ul>
              </motion.div>
            )}
          </div>
        </div>

        {/* Featured Venues Section (Full Width, below the columns) */}
        <div className="mt-10">
          {isLoadingTopVenues ? (
            <motion.section 
              className="py-20 bg-background"
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="container mx-auto px-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16">
                  <div>
                    <h2 className="text-4xl font-bold text-dark-text mb-4">
                      Featured Venues
                    </h2>
                    <p className="text-xl text-medium-text">
                      Premium venues verified by our team
                    </p>
                  </div>
                  <Skeleton className="h-6 w-36 mt-4 sm:mt-0" />
                </div>
                <FeaturedVenuesSkeleton />
              </div>
            </motion.section>
          ) : (
            <motion.div
              variants={fadeInVariants}
              initial="hidden"
              animate="visible"
            >
              <FeaturedVenues 
                venues={topVenues} 
                loading={isLoadingTopVenues} 
                error={topVenuesError} 
              />
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}