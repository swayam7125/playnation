import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import {
  FaRupeeSign, FaCalendarCheck, FaChartLine, FaFutbol, FaClock,
  FaTrophy, FaCalendarAlt, FaArrowUp, FaArrowDown, FaEye, FaChartBar,
  FaChevronDown // 👈 Added icon
} from "react-icons/fa";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { format, parseISO, startOfDay, endOfDay } from "date-fns"; // 👈 Import date-fns functions

// KpiCard component retained from the original dashboard (with growth/trend logic)
const KpiCard = ({ icon, title, value, growth, subtitle, trend }) => (
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
            {trend !== undefined && trend !== null && (
              <div className={`flex items-center space-x-1 text-xs font-bold ${trend > 0 ? 'text-emerald-600' : trend < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {trend > 0 ? <FaArrowUp className="w-2 h-2" /> : trend < 0 ? <FaArrowDown className="w-2 h-2" /> : null}
                <span>{trend !== 0 ? `${Math.abs(trend)}%` : 'No change'}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mb-2">
          <span className="text-2xl font-bold text-dark-text">{value}</span>
        </div>
        
        {subtitle && (
          <p className="text-xs text-medium-text font-medium">{subtitle}</p>
        )}
        
        {growth !== undefined && growth !== null && (
          <div className={`inline-flex items-center space-x-1 text-xs font-bold mt-2 px-2 py-1 rounded-full ${growth >= 0 ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-red-700 bg-red-50 border border-red-200"}`}>
            {growth >= 0 ? <FaArrowUp className="w-2 h-2" /> : <FaArrowDown className="w-2 h-2" />}
            <span>{Math.abs(growth)}% vs last month</span>
          </div>
        )}
      </div>
    </div>
  </div>
);

// Updated structure to hold all stats, including new period revenue
const initialStats = {
  todays_revenue: 0,
  monthly_revenue: 0, // Calendar month revenue
  selected_period_revenue: 0, // Revenue for 7, 30, or 90 days
  total_revenue: 0,
  todays_bookings: 0,
  upcoming_bookings: 0,
  most_popular_sport: "N/A",
  mom_revenue_growth: 0,
  revenue_by_facility: [],
  peak_booking_hours: [],
  revenue_trend: [],
  sport_distribution: [],
};

// RENAMED COMPONENT
function ReportsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const [timeframe, setTimeframe] = useState("30days"); // Default report period
  const [venues, setVenues] = useState([]); // Added venues state
  const [selectedVenue, setSelectedVenue] = useState("all"); // Added selected venue state

  // New data fetch logic adapted from OwnerDashboardPage to support venue filtering
  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch owner's approved venues (for the dropdown)
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('venue_id, name')
        .eq('owner_id', user.id)
        .eq('is_approved', true);

      if (venuesError) throw venuesError;
      setVenues(venuesData || []);

      if (!venuesData || venuesData.length === 0) {
        setStats(initialStats);
        setLoading(false);
        return;
      }

      // 2. Determine which venue IDs to filter by
      const venueIds =
        selectedVenue === "all"
          ? venuesData.map((v) => v.venue_id)
          : [selectedVenue];

      // 3. Fetch facilities for these venues
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from('facilities')
        .select('facility_id, name, venue_id, sports(name)')
        .in('venue_id', venueIds);

      if (facilitiesError) throw facilitiesError;

      const facilityIds = facilitiesData?.map(f => f.facility_id) || [];

      if (facilityIds.length === 0) {
        setStats(initialStats);
        setLoading(false);
        return;
      }

      // 4. Fetch all *confirmed* bookings for these facilities
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('booking_id, facility_id, start_time, total_amount, status')
        .in('facility_id', facilityIds)
        .eq('status', 'confirmed');

      if (bookingsError) throw bookingsError;

      const allBookings = bookingsData || [];

      // 5. Define Time Ranges based on 'timeframe' state
      const today = new Date();
      const days = timeframe === "7days" ? 7 : timeframe === "90days" ? 90 : 30;
      const periodEnd = endOfDay(today);
      const periodStart = startOfDay(new Date(today.getTime() - (days - 1) * 24 * 60 * 60 * 1000));
      
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);
      
      const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
      const lastMonthStart = new Date(lastMonthEnd.getFullYear(), lastMonthEnd.getMonth(), 1);

      // 6. Filter bookings by time ranges
      const periodBookings = allBookings.filter(b => {
        const bookingDate = new Date(b.start_time);
        return bookingDate >= periodStart && bookingDate <= periodEnd;
      });
      
      const todaysBookingsList = allBookings.filter(b => {
        const bookingDate = new Date(b.start_time);
        return bookingDate >= todayStart && bookingDate <= todayEnd;
      });
      
      const currentMonthBookings = allBookings.filter(b => {
        const bookingDate = new Date(b.start_time);
        return bookingDate >= currentMonthStart && bookingDate <= periodEnd;
      });
      
      const lastMonthBookings = allBookings.filter(b => {
        const bookingDate = new Date(b.start_time);
        return bookingDate >= lastMonthStart && bookingDate <= lastMonthEnd;
      });

      // 7. Calculate Stats
      const todays_revenue = todaysBookingsList.reduce((sum, b) => sum + (b.total_amount || 0), 0);
      const todays_bookings = todaysBookingsList.length;
      const upcoming_bookings = allBookings.filter(b => new Date(b.start_time) > today).length;
      
      const selected_period_revenue = periodBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
      const total_revenue = allBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
      
      // Calendar month revenue
      const monthly_revenue = currentMonthBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);
      const lastMonthRevenue = lastMonthBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);

      let mom_revenue_growth = 0;
      if (lastMonthRevenue > 0) {
        mom_revenue_growth = Math.round(((monthly_revenue - lastMonthRevenue) / lastMonthRevenue) * 100 * 100) / 100;
      } else if (monthly_revenue > 0) {
        mom_revenue_growth = 100; // Cap at 100% if last month was 0
      }
      
      // 8. Calculate Chart Data (based on *periodBookings*)
      
      // Revenue Trend
      const trendMap = new Map();
      for (let i = 0; i < days; i++) {
        const date = new Date(periodStart.getTime() + i * 24 * 60 * 60 * 1000);
        const dateString = format(date, 'yyyy-MM-dd');
        trendMap.set(dateString, { date: dateString, revenue: 0 });
      }
      periodBookings.forEach(b => {
        const dateStr = format(new Date(b.start_time), 'yyyy-MM-dd');
        if (trendMap.has(dateStr)) {
          trendMap.get(dateStr).revenue += (b.total_amount || 0);
        }
      });
      const revenue_trend = Array.from(trendMap.values());

      // Peak Hours (by booking count for the period)
      const hourlyMap = {};
      periodBookings.forEach(b => {
        const hour = new Date(b.start_time).getHours();
        const hourLabel = `${String(hour).padStart(2, '0')}:00`;
        hourlyMap[hourLabel] = (hourlyMap[hourLabel] || 0) + 1; // Count bookings
      });
      const peak_booking_hours = Object.entries(hourlyMap)
        .map(([hour, bookings]) => ({ hour, bookings, hourNum: parseInt(hour) }))
        .sort((a, b) => b.bookings - a.bookings || a.hourNum - b.hourNum);

      // Facility Revenue (for the period)
      const facilityRevenueMap = {};
      periodBookings.forEach(b => {
        const facility = facilitiesData.find(f => f.facility_id === b.facility_id);
        if (facility) {
          facilityRevenueMap[facility.facility_id] = {
            name: facility.name,
            revenue: (facilityRevenueMap[facility.facility_id]?.revenue || 0) + (b.total_amount || 0)
          };
        }
      });
      const revenue_by_facility = Object.values(facilityRevenueMap)
        .sort((a, b) => b.revenue - a.revenue);

      // Sport Distribution (for the period)
      const sportMap = {};
      periodBookings.forEach(b => {
        const facility = facilitiesData.find(f => f.facility_id === b.facility_id);
        const sportName = facility?.sports?.name || 'Unknown';
        sportMap[sportName] = (sportMap[sportName] || 0) + 1;
      });
      const sport_distribution = Object.entries(sportMap)
        .map(([name, bookings]) => ({ name, bookings }))
        .sort((a, b) => b.bookings - a.bookings);
      const most_popular_sport = sport_distribution[0]?.name || "N/A";

      // 9. Set all stats
      setStats({
        todays_revenue,
        todays_bookings,
        upcoming_bookings,
        monthly_revenue, // Calendar month revenue
        selected_period_revenue, // Selected period revenue
        total_revenue,
        most_popular_sport,
        mom_revenue_growth,
        peak_booking_hours,
        revenue_by_facility,
        sport_distribution,
        revenue_trend
      });

    } catch (error) {
      console.error("Error fetching report stats:", error);
      setError(error.message);
      setStats(initialStats);
    } finally {
      setLoading(false);
    }
  }, [user, selectedVenue, timeframe]); // Dependencies updated

  // Replaced old useEffect with this one
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]); 

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-light-green-bg/30 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-green/30 border-t-primary-green mx-auto"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary-green/10"></div>
        </div>
        <p className="text-medium-text font-medium">Loading Reports...</p>
        <p className="text-sm text-light-text">Fetching your detailed metrics</p>
      </div>
    </div>
  );

  // Added Error handling block
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-light-green-bg/30 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl border border-border-color shadow-lg max-w-md">
        <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <FaChartLine className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-dark-text mb-2">Error Loading Reports</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="px-6 py-2 bg-primary-green text-white rounded-xl hover:bg-primary-green-dark transition-colors"
        >
          Retry
        </button>
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
        
        {/* Header with Timeframe and NEW Venue Filter */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-green via-primary-green-dark to-primary-green rounded-3xl shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>
          
          <div className="relative px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
                  <FaChartBar className="w-7 h-7 text-white" /> {/* Changed Icon */}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">Venue Performance Reports</h1>
                  <p className="text-white/80 text-sm">Detailed weekly and monthly analytics</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* TIMEFRAME SELECTOR */}
                <div className="flex bg-white/10 backdrop-blur rounded-2xl p-1 border border-white/20">
                  {[
                    { key: "7days", label: "7D" },
                    { key: "30days", label: "30D" },
                    { key: "90days", label: "90D" }
                  ].map((period) => (
                    <button 
                      key={period.key}
                      className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                        timeframe === period.key 
                          ? "bg-white text-primary-green shadow-lg" 
                          : "text-white/80 hover:text-white hover:bg-white/10"
                      }`} 
                      onClick={() => setTimeframe(period.key)}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
                
                {/* --- STYLED VENUE FILTER --- */}
                <div className="relative bg-white/10 backdrop-blur rounded-2xl border border-white/20">
                  <select
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                    className="appearance-none w-full bg-transparent text-white text-sm font-semibold rounded-2xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
                  >
                    <option value="all" className="text-dark-text bg-white">All Venues</option>
                    {venues.map((venue) => (
                      <option key={venue.venue_id} value={venue.venue_id} className="text-dark-text bg-white">
                        {venue.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <FaChevronDown className="w-4 h-4 text-white/70" />
                  </div>
                </div>
                {/* --- END STYLED VENUE FILTER --- */}
                
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

        {/* KPI Cards Grid - Updated to use new stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KpiCard 
            icon={<FaRupeeSign />} 
            title="Revenue (Selected Period)" 
            value={`₹${stats.selected_period_revenue.toLocaleString("en-IN")}`} 
            subtitle={`Total revenue over the last ${timeframe === '7days' ? '7 days' : timeframe === '30days' ? '30 days' : '90 days'}`}
          />
          <KpiCard 
            icon={<FaCalendarAlt />} 
            title="Revenue (This Month)" 
            value={`₹${stats.monthly_revenue.toLocaleString("en-IN")}`} 
            growth={stats.mom_revenue_growth}
          />
          <KpiCard 
            icon={<FaChartLine />} 
            title="Total Revenue (All Time)" 
            value={`₹${stats.total_revenue.toLocaleString("en-IN")}`} 
            subtitle={`For ${selectedVenue === 'all' ? 'all venues' : 'selected venue'}`}
          />
          <Link to="/owner/calendar" className="no-underline">
            <KpiCard 
              icon={<FaCalendarCheck />} 
              title="Upcoming Bookings" 
              value={stats.upcoming_bookings} 
              subtitle={`${stats.todays_bookings} scheduled today`}
            />
          </Link>
          <KpiCard 
            icon={<FaFutbol />} 
            title="Most Popular Sport" 
            value={stats.most_popular_sport} 
            subtitle={`Total bookings in period: ${stats.sport_distribution[0]?.bookings || 0}`}
          />
          <KpiCard 
            icon={<FaClock />} 
            title="Peak Booking Hour" 
            value={stats.peak_booking_hours[0]?.hour || "N/A"} 
            subtitle={`With ${stats.peak_booking_hours[0]?.bookings || 0} bookings (in period)`}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend */}
          <div className="lg:col-span-3 bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                  <FaChartLine className="w-5 h-5 text-primary-green" />
                </div>
                <h3 className="text-lg font-bold text-dark-text">
                  Revenue Trend ({timeframe === "7days" ? "7 Days" : timeframe === "30days" ? "30 Days" : "90 Days"})
                </h3>
              </div>
              <div className="flex items-center space-x-2 text-sm text-medium-text">
                <div className="w-3 h-3 bg-primary-green rounded-full"></div>
                <span>Revenue</span>
              </div>
            </div>
            
            {stats.revenue_trend.length > 0 && stats.revenue_trend.some(d => d.revenue > 0) ? (
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
                <p className="font-medium">No revenue data available for this period</p>
                <p className="text-sm text-light-text">Data will appear once you start receiving bookings</p>
              </div>
            )}
          </div>

          {/* Revenue by Facility */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                <FaTrophy className="w-5 h-5 text-primary-green" />
              </div>
              <h3 className="text-lg font-bold text-dark-text">Revenue by Facility (Selected Period)</h3>
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
                <p className="font-medium">No facility data available for this period</p>
                <p className="text-sm text-light-text">Add venues to see facility performance</p>
              </div>
            )}
          </div>

          {/* Sport Distribution */}
          <div className="bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                <FaFutbol className="w-5 h-5 text-primary-green" />
              </div>
              <h3 className="text-lg font-bold text-dark-text">Sport Distribution (Selected Period)</h3>
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
                <p className="font-medium">No sport data available for this period</p>
                <p className="text-sm text-light-text">Sports breakdown will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;