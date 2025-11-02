import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import {
  FaRupeeSign, FaCalendarCheck, FaChartLine, FaFutbol, FaClock,
  FaTrophy, FaCalendarAlt, FaEye, FaList, FaChartBar
} from "react-icons/fa";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";

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

function OwnerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todays_revenue: 0,
    todays_bookings: 0,
    monthly_revenue: 0,
    total_revenue: 0,
    most_popular_sport: "N/A",
    peak_hour: "N/A",
    revenue_by_facility: [],
    sport_distribution: [],
    hourly_revenue: []
  });
  const [todaysBookings, setTodaysBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch owner's approved venues
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('venue_id, name')
        .eq('owner_id', user.id)
        .eq('is_approved', true);

      if (venuesError) throw venuesError;

      if (!venuesData || venuesData.length === 0) {
        setStats({
          todays_revenue: 0,
          todays_bookings: 0,
          monthly_revenue: 0,
          total_revenue: 0,
          most_popular_sport: "N/A",
          peak_hour: "N/A",
          revenue_by_facility: [],
          sport_distribution: [],
          hourly_revenue: []
        });
        setTodaysBookings([]);
        setLoading(false);
        return;
      }

      const venueIds = venuesData.map(v => v.venue_id);

      // 2. Fetch facilities for these venues
      const { data: facilitiesData, error: facilitiesError } = await supabase
        .from('facilities')
        .select('facility_id, name, venue_id, sports(name)')
        .in('venue_id', venueIds);

      if (facilitiesError) throw facilitiesError;

      const facilityIds = facilitiesData?.map(f => f.facility_id) || [];

      if (facilityIds.length === 0) {
        setStats({
          todays_revenue: 0,
          todays_bookings: 0,
          monthly_revenue: 0,
          total_revenue: 0,
          most_popular_sport: "N/A",
          peak_hour: "N/A",
          revenue_by_facility: [],
          sport_distribution: [],
          hourly_revenue: []
        });
        setTodaysBookings([]);
        setLoading(false);
        return;
      }

      // 3. Fetch all bookings for these facilities
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('booking_id, facility_id, start_time, total_amount, status, users:users!bookings_user_id_fkey(username, first_name, last_name, email)')
        .in('facility_id', facilityIds)
        .eq('status', 'confirmed');

      if (bookingsError) throw bookingsError;

      const allBookings = bookingsData || [];

      // 4. Calculate today's stats
      const today = new Date();
      const todayStart = startOfDay(today);
      const todayEnd = endOfDay(today);

      const todaysBookingsList = allBookings.filter(b => {
        const bookingDate = new Date(b.start_time);
        return bookingDate >= todayStart && bookingDate <= todayEnd;
      });

      const todays_revenue = todaysBookingsList.reduce((sum, b) => sum + (b.total_amount || 0), 0);
      const todays_bookings = todaysBookingsList.length;

      // 5. Calculate monthly revenue (current month)
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthlyBookings = allBookings.filter(b => {
        const bookingDate = new Date(b.start_time);
        return bookingDate >= monthStart;
      });
      const monthly_revenue = monthlyBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);

      // 6. Calculate total revenue
      const total_revenue = allBookings.reduce((sum, b) => sum + (b.total_amount || 0), 0);

      // 7. Calculate hourly revenue for today
      const hourlyMap = {};
      todaysBookingsList.forEach(b => {
        const hour = new Date(b.start_time).getHours();
        const hourLabel = `${hour}:00`;
        hourlyMap[hourLabel] = (hourlyMap[hourLabel] || 0) + (b.total_amount || 0);
      });

      const hourly_revenue = Object.entries(hourlyMap)
        .map(([hour, revenue]) => ({ date: hour, revenue }))
        .sort((a, b) => parseInt(a.date) - parseInt(b.date));

      // 8. Find peak hour
      const peakHourEntry = Object.entries(hourlyMap)
        .sort((a, b) => b[1] - a[1])[0];
      const peak_hour = peakHourEntry ? peakHourEntry[0] : "N/A";

      // 9. Revenue by facility (today)
      const facilityRevenueMap = {};
      todaysBookingsList.forEach(b => {
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

      // 10. Sport distribution (today)
      const sportMap = {};
      todaysBookingsList.forEach(b => {
        const facility = facilitiesData.find(f => f.facility_id === b.facility_id);
        const sportName = facility?.sports?.name || 'Unknown';
        sportMap[sportName] = (sportMap[sportName] || 0) + 1;
      });

      const sport_distribution = Object.entries(sportMap)
        .map(([name, bookings]) => ({ name, bookings }))
        .sort((a, b) => b.bookings - a.bookings);

      const most_popular_sport = sport_distribution[0]?.name || "N/A";

      // 11. Set all stats
      setStats({
        todays_revenue,
        todays_bookings,
        monthly_revenue,
        total_revenue,
        most_popular_sport,
        peak_hour,
        revenue_by_facility,
        sport_distribution,
        hourly_revenue
      });

      // 12. Set upcoming bookings (future bookings today)
      const upcomingBookings = todaysBookingsList
        .filter(b => new Date(b.start_time) > new Date())
        .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
        .slice(0, 10)
        .map(b => {
          const facility = facilitiesData.find(f => f.facility_id === b.facility_id);
          const venue = venuesData.find(v => v.venue_id === facility?.venue_id);
          return {
            ...b,
            facility_name: facility?.name || 'Unknown',
            venue_name: venue?.name || 'Unknown'
          };
        });

      setTodaysBookings(upcomingBookings);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

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
        <p className="text-medium-text font-medium">Loading Today's Dashboard...</p>
        <p className="text-sm text-light-text">Fetching your latest operational metrics</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-light-green-bg/30 flex items-center justify-center">
      <div className="text-center p-8 bg-white rounded-2xl border border-border-color shadow-lg max-w-md">
        <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <FaChartLine className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-dark-text mb-2">Error Loading Dashboard</h3>
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
        
        {/* Header */}
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
                <Link 
                  to="/owner/reports"
                  className="bg-white/10 backdrop-blur text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20 no-underline flex items-center space-x-2"
                >
                  <FaChartBar className="w-4 h-4" />
                  <span>View Reports</span>
                </Link>
                <Link 
                  to="/owner/calendar"
                  className="bg-white/10 backdrop-blur text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/20 transition-all duration-200 border border-white/20 no-underline flex items-center space-x-2"
                >
                  <FaCalendarAlt className="w-4 h-4" />
                  <span>View Calendar</span>
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

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <KpiCard 
            icon={<FaRupeeSign />} 
            title="Today's Revenue" 
            value={`₹${stats.todays_revenue.toLocaleString("en-IN")}`} 
            subtitle={`${stats.todays_bookings} bookings today`}
          />
          <KpiCard 
            icon={<FaCalendarCheck />} 
            title="Today's Bookings" 
            value={stats.todays_bookings} 
            subtitle={`${todaysBookings.length} upcoming`}
          />
          <KpiCard 
            icon={<FaClock />} 
            title="Peak Hour Today" 
            value={stats.peak_hour} 
            subtitle="Busiest time slot"
          />
          <KpiCard 
            icon={<FaFutbol />} 
            title="Most Popular Sport" 
            value={stats.most_popular_sport} 
            subtitle={`${stats.sport_distribution[0]?.bookings || 0} bookings`}
          />
          <KpiCard 
            icon={<FaCalendarAlt />} 
            title="Monthly Revenue" 
            value={`₹${stats.monthly_revenue.toLocaleString("en-IN")}`} 
            subtitle="Current month"
          />
          <KpiCard 
            icon={<FaChartLine />} 
            title="Total Revenue" 
            value={`₹${stats.total_revenue.toLocaleString("en-IN")}`} 
            subtitle="All time across venues"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Upcoming Bookings List */}
          <div className="lg:col-span-1 bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                <FaList className="w-5 h-5 text-primary-green" />
              </div>
              <h3 className="text-lg font-bold text-dark-text">Upcoming Bookings</h3>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {todaysBookings.length > 0 ? (
                todaysBookings.map((booking) => (
                  <div key={booking.booking_id} className="p-3 bg-light-green-bg/50 border-l-4 border-primary-green rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-dark-text text-sm">
                          {format(parseISO(booking.start_time), 'h:mm a')}
                        </p>
                        <p className="text-xs text-medium-text">
                          {booking.facility_name}
                        </p>
                        <p className="text-xs text-light-text">
                          {booking.venue_name}
                        </p>
                      </div>
                      <span className="font-bold text-primary-green">
                        ₹{booking.total_amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {booking.users && (
                      <p className="text-xs text-medium-text">
                        {booking.users.first_name || booking.users.username}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-medium-text">
                  <FaCalendarCheck className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                  <p className="font-medium">No upcoming bookings today</p>
                  <p className="text-sm text-light-text">New bookings will appear here</p>
                </div>
              )}
            </div>
            <Link to="/owner/calendar" className="text-primary-green text-sm font-semibold mt-4 block text-center hover:underline">
              View Full Calendar
            </Link>
          </div>

          {/* Hourly Revenue Trend (Default on Dashboard) */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                  <FaChartLine className="w-5 h-5 text-primary-green" />
                </div>
                <h3 className="text-lg font-bold text-dark-text">Hourly Revenue Trend (Today)</h3>
              </div>
              <div className="flex items-center space-x-2 text-sm text-medium-text">
                <div className="w-3 h-3 bg-primary-green rounded-full"></div>
                <span>Revenue</span>
              </div>
            </div>
            
            {stats.hourly_revenue.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={stats.hourly_revenue}>
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
                <p className="font-medium">No revenue data for today yet</p>
                <p className="text-sm text-light-text">Data will appear after bookings</p>
                <Link to="/owner/reports" className="text-primary-green text-sm font-semibold mt-4 block hover:underline">
                  View Long-Term Reports
                </Link>
              </div>
            )}
          </div>

          {/* Revenue by Facility & Sport Distribution */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Revenue by Facility */}
            <div className="bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                  <FaTrophy className="w-5 h-5 text-primary-green" />
                </div>
                <h3 className="text-lg font-bold text-dark-text">Revenue by Facility (Today)</h3>
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
                  <p className="font-medium">No facility data yet</p>
                  <p className="text-sm text-light-text">Data will appear after bookings</p>
                </div>
              )}
            </div>

            {/* Sport Distribution */}
            <div className="bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-primary-green/10 rounded-xl flex items-center justify-center">
                  <FaFutbol className="w-5 h-5 text-primary-green" />
                </div>
                <h3 className="text-lg font-bold text-dark-text">Sport Distribution (Today)</h3>
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
                  <p className="font-medium">No sport data yet</p>
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