// src/pages/owner/OwnerDashboardPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import {
  FaRupeeSign,
  FaCalendarCheck,
  FaList,
  FaChartBar,
  FaRegClock,
  FaBan,
  FaPen,
  FaBolt,
  FaUsers
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { FiAlertCircle } from "react-icons/fi"; // FiLoader removed
import { formatCurrency } from "../../utils/formatters";

// --- IMPORTS ADDED ---
import useSkeletonLoader from "../../hooks/useSkeletonLoader"; //
import { OwnerDashboardSkeleton } from "../../components/skeletons/owner"; //

// Stat Card (Unchanged)
const StatCard = ({ title, value, icon }) => (
  <div className="bg-primary-green-dark border border-primary-green rounded-xl shadow-lg p-6 flex items-center space-x-4 transition-transform hover:scale-105 duration-300">
    <div className="p-4 rounded-full bg-white"> 
      {React.cloneElement(icon, { className: "h-7 w-7 text-primary-green-dark" })}
    </div>
    <div>
      <p className="text-sm text-gray-200 font-medium uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

// Formatter for the X-axis (hours) (Unchanged)
const formatHour = (hour) => {
  if (hour === 0) return '12 AM';
  if (hour === 12) return '12 PM';
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
};

// Custom Tooltip for Charts (Unchanged)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const hourLabel = formatHour(label);
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-border-color-light">
        <p className="text-sm text-medium-text">{`Time: ${hourLabel}`}</p>
        <p className="text-dark-text font-medium">{`Revenue: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};


function OwnerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- HOOK ADDED ---
  // Use the skeleton loader hook to manage the transition
  const showContent = useSkeletonLoader(loading);

  // Data fetching logic (Unchanged)
  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error } = await supabase.rpc("get_owner_today_dashboard", {
          p_owner_id: user.id 
        }); 
        if (error) throw error;
        
        const defaultStats = {
          today_revenue: 0,
          today_bookings_count: 0,
          upcoming_bookings_count_total: 0,
          hourly_revenue_trend: [],
          upcoming_bookings_list: [],
          today_cancellations: 0,
          today_new_reviews: 0,
        };
        
        setStats(data || defaultStats);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [user]);

  // Calculate Busiest Hour (Unchanged)
  const busiestHourData = useMemo(() => {
    if (!stats?.hourly_revenue_trend || stats.hourly_revenue_trend.length === 0) {
      return { hour: 'N/A' };
    }
    const busiest = stats.hourly_revenue_trend.reduce(
      (max, hour) => (hour.revenue > max.revenue ? hour : max),
      { revenue: -1 } 
    );
    if (busiest.revenue <= 0) { 
      return { hour: 'N/A' };
    }
    return { hour: formatHour(busiest.hour_of_day) };
  }, [stats?.hourly_revenue_trend]);

  
  // --- RENDER LOGIC UPDATED ---

  // 1. Handle Error State First
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center space-x-4">
          <FiAlertCircle className="h-8 w-8 text-red-500" />
          <div>
            <p className="font-bold text-lg">Error Loading Dashboard</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Show Skeleton while loading or during transition delay
  // 'showContent' will be false if loading=true, or for a brief period after loading=false
  if (!showContent) {
    return <OwnerDashboardSkeleton />; //
  }

  // 3. Show Page Content (Unchanged from original)
  // This is only reached if error is null AND showContent is true.
  
  // Check if there is valid chart data to show
  const hasChartData = stats?.hourly_revenue_trend && stats.hourly_revenue_trend.length > 0 && stats.hourly_revenue_trend.some(h => h.revenue > 0);

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Header with buttons (Unchanged) */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <h1 className="text-4xl font-bold text-primary-green-dark">
            Today's Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <Link
              to="/owner/my-venues"
              className="py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-primary-green text-white hover:bg-primary-green-dark flex items-center gap-2"
            >
              <FaList />
              <span>Manage Venues</span>
            </Link>
            <Link
              to="/owner/reports"
              className="py-2 px-4 rounded-lg text-sm font-medium transition-colors bg-card-bg text-primary-green border border-border-color-light hover:bg-hover-bg flex items-center gap-2"
            >
              <FaChartBar />
              <span>View Reports</span>
            </Link>
          </div>
        </div>

        {/* --- NEW LAYOUT: 6 Stat Cards (Full Width) (Unchanged) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Today's Revenue"
            value={formatCurrency(stats?.today_revenue || 0)}
            icon={<FaRupeeSign />}
          />
          <StatCard
            title="Today's Bookings"
            value={stats?.today_bookings_count || 0}
            icon={<FaCalendarCheck />}
          />
          <StatCard
            title="Upcoming Bookings"
            value={stats?.upcoming_bookings_count_total || 0}
            icon={<FaRegClock />}
          />
          <StatCard
            title="Today's Cancellations"
            value={stats?.today_cancellations || 0}
            icon={<FaBan />}
          />
          <StatCard
            title="Today's New Reviews"
            value={stats?.today_new_reviews || 0}
            icon={<FaPen />}
          />
          <StatCard
            title="Today's Unique Players"
            value={stats?.todays_unique_players || 0}
            icon={<FaUsers />}
          />
        </div>

        {/* --- NEW LAYOUT: Chart and Bookings List Grid (Unchanged) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Left Column (Chart) --- */}
          <div className="lg:col-span-2 space-y-8 min-w-0">
            {/* Hourly Revenue Chart */}
            <div className="bg-card-bg border border-border-color-light rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-border-color-light">
                <h2 className="text-xl font-bold text-primary-green-dark">
                  Today's Revenue (by Hour)
                </h2>
              </div>
              
              <div className="p-6 h-[300px]">
                {hasChartData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.hourly_revenue_trend} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                      <XAxis dataKey="hour_of_day" tickFormatter={formatHour} />
                      <YAxis tickFormatter={(val) => `₹${val}`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area type="monotone" dataKey="revenue" stroke="#046241" fill="#059669" fillOpacity={0.1} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-medium-text">
                    <p className="font-medium">No revenue data for today yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- Right Column (Bookings List) --- */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card-bg border border-border-color-light rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-border-color-light">
                <h2 className="text-xl font-bold text-primary-green-dark">
                  Today's Upcoming Bookings
                </h2>
              </div>
              <div className="p-4">
                {stats && stats.upcoming_bookings_list && stats.upcoming_bookings_list.length > 0 ? (
                  <ul className="divide-y divide-border-color-light">
                    {stats.upcoming_bookings_list.map((booking) => (
                      <li key={booking.booking_id} className="py-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-semibold text-dark-text">{booking.player_name || 'Player'}</p>
                            <p className="text-xs text-medium-text">{booking.facility_name} at {booking.venue_name}</p>

                          </div>
                          <p className="text-sm font-bold text-primary-green">
                            {format(new Date(booking.start_time), 'p')}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-medium-text">
                    <p className="font-medium">No more bookings for today</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboardPage;