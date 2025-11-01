import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import {
  FaRupeeSign, FaCalendarCheck, FaChartLine, FaFutbol, FaClock,
  FaTrophy, FaCalendarAlt, FaArrowUp, FaArrowDown, FaEye,
  FaList
} from "react-icons/fa";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { format, isToday, parseISO } from "date-fns"; // Import for formatting and date checks

// MODIFIED KpiCard: Simplified for daily data (removed growth and trend props)
const KpiCard = ({ icon, title, value, subtitle }) => (
  <div className="group relative overflow-hidden bg-gradient-to-br from-white to-white/50 backdrop-blur-sm border border-border-color/60 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-green/50">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-green/5 to-transparent rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-500"></div>
    
    <div className="relative flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-green to-primary-green-dark text-white rounded-xl flex items-center justify-center text-sm shadow-lg group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-light-text uppercase tracking-wider">{title}</p>
          </div>
        </div>
        
        <div className="mb-2">
          <span className="text-2xl font-bold text-dark-text">{value}</span>
        </div>
        
        {subtitle && (
          <p className="text-xs text-medium-text font-medium">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

// Defined default structure matching RPC output
const initialStats = {
  todays_revenue: 0, monthly_revenue: 0, total_revenue: 0, todays_bookings: 0,
  upcoming_bookings: 0, most_popular_sport: "N/A", mom_revenue_growth: 0,
  revenue_by_facility: [], peak_booking_hours: [], revenue_trend: [], sport_distribution: [],
};

function OwnerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const [todaysBookings, setTodaysBookings] = useState([]); // NEW STATE for specific list
  const [loading, setLoading] = useState(true);
  // REMOVED: const [timeframe, setTimeframe] = useState("7days"); 

  // Function to fetch the detailed list of today's bookings
  const fetchTodaysBookings = useCallback(async (venueIds) => {
    if (venueIds.length === 0) return;
    const todayStart = format(new Date(), 'yyyy-MM-dd') + 'T00:00:00.000Z';
    const todayEnd = format(new Date(), 'yyyy-MM-dd') + 'T23:59:59.999Z';

    const { data, error } = await supabase
        .from('bookings')
        .select(`
            booking_id, 
            amount, 
            is_confirmed,
            time_slots (start_time, end_time, facility (name, venue_id, venue (name)))
        `)
        .in('time_slots.facility.venue_id', venueIds)
        .gte('time_slots.start_time', todayStart)
        .lt('time_slots.start_time', todayEnd)
        .order('time_slots.start_time');

    if (error) {
        console.error("Error fetching today's bookings list:", error);
        setTodaysBookings([]);
        return;
    }

    setTodaysBookings(data || []);
  }, []);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) { setLoading(false); return; }
      setLoading(true);
      
      try {
        // Step 1: Fetch Owner's Venues to get IDs
        const { data: venueData, error: venueError } = await supabase
            .from('venues')
            .select('venue_id')
            .eq('owner_id', user.id);
        
        if (venueError) throw venueError;
        const venueIds = venueData.map(v => v.venue_id);

        // Step 2: RPC Call (FIXED: days_to_track set to 1 for today's data)
        const { data: dashboardData, error: rpcError } = await supabase.rpc('get_owner_dashboard_statistics', { days_to_track: 1, p_owner_id: user.id });
        
        if (rpcError) throw rpcError;
        if (!dashboardData) throw new Error("No data received from dashboard function.");

        setStats({
          ...dashboardData,
          revenue_by_facility: dashboardData.revenue_by_facility || [],
          peak_booking_hours: dashboardData.peak_booking_hours || [],
          revenue_trend: dashboardData.revenue_trend || [],
          sport_distribution: dashboardData.sport_distribution || [],
        });
        
        // Step 3: Fetch the detailed booking list
        fetchTodaysBookings(venueIds);

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats(initialStats);
        setTodaysBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, [user, fetchTodaysBookings]); // Dependencies simplified for daily focus

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-light-green-bg/30 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-green/30 border-t-primary-green mx-auto"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary-green/10"></div>
        </div>
        <p className="text-medium-text font-medium">Loading Today's Dashboard...</p>
        <p className="text-sm text-light-text">Fetching your latest operational metrics</p>
      </div>
    </div>
  );

  const COLORS = ["#10B981", "#059669", "#047857", "#065F46", "#064E3B", "#034E3B"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur border border-border-color/50 rounded-xl p-4 shadow-2xl">
          <p className="font-bold text-dark-text mb-2 pb-2 border-b border-border-color/50">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="font-semibold text-medium-text my-1" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes("Revenue") ? `₹${entry.value.toLocaleString("en-IN")}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-light-green-bg/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* Header - MODIFIED TITLE & REMOVED TIMEFRAME SELECTOR */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-green via-primary-green-dark to-primary-green rounded-3xl shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
          
          <div className="relative px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
                  <FaChartLine className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Today's Operational Dashboard</h1>
                  <p className="text-white/80 text-sm">Real-time metrics for {format(new Date(), "EEEE, MMMM d")}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* REMOVED: Timeframe Selector */}
                <Link 
                  to="/owner/reports" // SUGGESTED LINK TO NEW REPORTS PAGE
                  className="bg-white/10 backdrop-blur text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20 no-underline flex items-center space-x-2"
                >
                  <FaChartLine className="w-4 h-4" />
                  <span>View Reports</span>
                </Link>
                <Link 
                  to="/owner/my-venues" 
                  className="bg-white/10 backdrop-blur text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20 no-underline flex items-center space-x-2"
                >
                  <FaEye className="w-4 h-4" />
                  <span>Manage Venues</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards Grid - NOW FOCUSED ON TODAY */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <KpiCard 
            icon={<FaRupeeSign />} 
            title="Today's Revenue" 
            value={`₹${stats.todays_revenue.toLocaleString("en-IN")}`} 
            subtitle={`${stats.todays_bookings} bookings completed/scheduled`}
          />
          <KpiCard 
            icon={<FaCalendarCheck />} 
            title="Today's Bookings" 
            value={stats.todays_bookings} 
            subtitle={`${todaysBookings.length} bookings to go`}
          />
          <KpiCard 
            icon={<FaClock />} 
            title="Peak Hour Today" 
            value={stats.peak_booking_hours[0]?.hour || "N/A"} 
            subtitle={`${stats.peak_booking_hours[0]?.bookings || 0} bookings`}
          />
          <KpiCard 
            icon={<FaFutbol />} 
            title="Most Popular Sport" 
            value={stats.most_popular_sport} 
            subtitle={`${stats.sport_distribution[0]?.bookings || 0} bookings today`}
          />
          {/* We keep monthly/total stats but deemphasize them for the daily view */}
          <KpiCard 
            icon={<FaCalendarAlt />} 
            title="Monthly Revenue" 
            value={`₹${stats.monthly_revenue.toLocaleString("en-IN")}`} 
            subtitle={`MoM Change: ${stats.mom_revenue_growth}%`}
          />
          <KpiCard 
            icon={<FaChartLine />} 
            title="Total Revenue" 
            value={`₹${stats.total_revenue.toLocaleString("en-IN")}`} 
            subtitle="All time across venues"
          />
        </div>

        {/* New Section: Upcoming Bookings & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Upcoming Bookings List (New Card) */}
            <div className="lg:col-span-1 bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                        <FaList className="w-5 h-5 text-primary-green" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-text">Upcoming Bookings List</h3>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {todaysBookings.length > 0 ? (
                        todaysBookings
                            // Filter out past bookings (optional, but good practice for "Upcoming")
                            .filter(b => parseISO(b.time_slots.start_time) > new Date())
                            .slice(0, 10) // Show top 10 for a clean dashboard view
                            .map((booking, index) => (
                                <div key={booking.booking_id} className="p-3 bg-light-green-bg/50 border-l-4 border-primary-green rounded-lg flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-semibold text-dark-text">
                                            {format(parseISO(booking.time_slots.start_time), 'p')} - {format(parseISO(booking.time_slots.end_time), 'p')}
                                        </p>
                                        <p className="text-xs text-medium-text">
                                            {booking.time_slots.facility.name} @ {booking.time_slots.facility.venue.name}
                                        </p>
                                    </div>
                                    <span className="font-bold text-primary-green">
                                        ₹{booking.amount.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            ))
                    ) : (
                        <div className="text-center py-10 text-medium-text">
                            <FaCalendarCheck className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                            <p className="font-medium">No further bookings today.</p>
                            <p className="text-sm text-light-text">Time to relax or manage slots!</p>
                        </div>
                    )}
                </div>
                <Link to="/owner/calendar" className="text-primary-green text-sm font-semibold mt-4 block text-center">
                    Go to Slot Calendar
                </Link>
            </div>


            {/* Hourly Revenue Trend Chart (2/3 width) */}
            <div className="lg:col-span-2 bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                        <FaChartLine className="w-5 h-5 text-primary-green" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-text">
                        Hourly Revenue Trend (Today)
                    </h3>
                </div>
                <div className="flex items-center space-x-2 text-sm text-medium-text">
                    <div className="w-3 h-3 bg-primary-green rounded-full"></div>
                    <span>Revenue</span>
                </div>
                </div>
                
                {stats.revenue_trend.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={stats.revenue_trend}>
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10B981" 
                        fillOpacity={1} 
                        fill="url(#colorRevenue)" 
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
                    />
                    </AreaChart>
                </ResponsiveContainer>
                ) : (
                <div className="h-[280px] flex flex-col items-center justify-center text-medium-text">
                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <FaChartLine className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="font-medium">No revenue data available for today</p>
                    <p className="text-sm text-light-text">Data will appear once you start receiving bookings</p>
                </div>
                )}
            </div>

            {/* Revenue by Facility & Sport Distribution (Side-by-Side) */}
            <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Revenue by Facility - Today */}
                <div className="bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                        <FaTrophy className="w-5 h-5 text-primary-green" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-text">Today's Revenue by Facility</h3>
                    </div>
                    
                    {stats.revenue_by_facility.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={stats.revenue_by_facility.slice(0, 6)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                        <XAxis dataKey="name" stroke="#6B7280" fontSize={12} angle={-45} textAnchor="end" height={80} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="revenue" fill="#10B981" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    ) : (
                    <div className="h-[280px] flex flex-col items-center justify-center text-medium-text">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                        <FaTrophy className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="font-medium">No facility data available for today</p>
                        <p className="text-sm text-light-text">Activity will show here after first booking</p>
                    </div>
                    )}
                </div>

                {/* Sport Distribution - Today */}
                <div className="bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                        <FaFutbol className="w-5 h-5 text-primary-green" />
                    </div>
                    <h3 className="text-lg font-bold text-dark-text">Today's Sport Distribution</h3>
                    </div>
                    
                    {stats.sport_distribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                        <Pie 
                            data={stats.sport_distribution} 
                            cx="50%" 
                            cy="50%" 
                            labelLine={false} 
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} 
                            outerRadius={90} 
                            fill="#8884d8" 
                            dataKey="bookings"
                        >
                            {stats.sport_distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    ) : (
                    <div className="h-[280px] flex flex-col items-center justify-center text-medium-text">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                        <FaFutbol className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="font-medium">No sport data available for today</p>
                        <p className="text-sm text-light-text">Bookings will be categorized here</p>
                    </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboardPage;