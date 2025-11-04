// src/pages/owner/OwnerDashboardPage.jsx
import React, { useState, useEffect } from "react"; // Removed useCallback
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import {
  FaRupeeSign,
  FaCalendarCheck,
  FaChartLine,
  FaFutbol,
  FaClock,
  FaTrophy,
  FaCalendarAlt,
  FaEye,
  FaList,
  FaChartBar,
  FaChevronDown,
  FaBook, // Added FaBook
} from "react-icons/fa";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format, parseISO } from "date-fns"; // Removed startOfDay, endOfDay
import { FiLoader, FiAlertCircle } from "react-icons/fi"; // Added for loading/error

const KpiCard = ({ icon, title, value, subtitle }) => (
  <div className="group relative overflow-hidden bg-gradient-to-br from-white to-white/50 backdrop-blur-sm border border-border-color/60 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-green/50">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-green/5 to-transparent rounded-full -translate-y-1/3 translate-x-1/4 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-green/10 to-primary-green/20 text-primary-green flex items-center justify-center">
          {icon}
        </div>
        {subtitle && (
          <span
            className={`font-semibold text-xs px-2 py-1 rounded-full ${
              subtitle.startsWith("+")
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-dark-text mt-3">{value}</p>
      <p className="text-sm font-medium text-medium-text">{title}</p>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-lg p-3 border border-border-color/60">
        <p className="label font-semibold text-dark-text">{`${label}`}</p>
        <p
          className="intro text-primary-green"
          style={{ color: payload[0].fill }}
        >
          {`${payload[0].name}: ${
            payload[0].dataKey === "revenue"
              ? `₹${payload[0].value.toLocaleString("en-IN")}`
              : payload[0].value
          }`}
        </p>
      </div>
    );
  }
  return null;
};

const COLORS = ["#059669", "#10B981", "#34D399", "#6EE7B7", "#A7F3D0"];

function OwnerDashboardPage() {
  const { user } = useAuth();
  
  // --- REFACTORED STATE ---
  // A single state for all statistics
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- REFACTORED EFFECT ---
  // Single useEffect to fetch all stats from the new RPC function
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      setError(null);
      
      // Call the new function
      const { data, error } = await supabase.rpc('get_owner_dashboard_all_stats');

      if (error) {
        console.error("Error fetching dashboard statistics:", error);
        setError(error.message);
      } else {
        setStats(data);
      }
      setLoading(false);
    };

    if (user) {
      fetchDashboardStats();
    }
  }, [user]); // Re-fetches only if the user changes

  // Helper to format large numbers (from original file)
  const formatStatValue = (value) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(1)} L`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)} K`;
    return value;
  };

  // Loader component for charts (from original file)
  const ChartLoader = () => (
    <div className="h-[280px] flex items-center justify-center">
      <FiLoader className="animate-spin text-primary-green text-3xl" />
    </div>
  );
  
  // --- ALL OTHER STATE AND USEEFFECTS (for stats) ARE REMOVED ---

  return (
    <div className="min-h-screen bg-background text-dark-text p-4 md:p-8">
      {/* Header (Original Styling) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark-text">Dashboard</h1>
          <p className="text-lg text-medium-text mt-1">
            Welcome back, {user?.user_metadata?.first_name || "Owner"}!
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <Link
            to="/owner/reports"
            className="flex items-center gap-2 text-sm font-medium text-primary-green hover:text-primary-green-dark transition-colors"
          >
            <FaChartBar />
            <span>View Full Reports</span>
          </Link>
          <div className="relative">
            <button className="flex items-center gap-2 text-sm font-medium text-medium-text bg-white border border-border-color/60 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <FaCalendarAlt className="text-gray-400" />
              <span>Today</span>
              <FaChevronDown className="w-3 h-3 text-gray-400" />
            </button>
            {/* Dropdown can be added here if needed */}
          </div>
        </div>
      </div>

      {/* Main Stats Grid (Original Styling & KPIs) */}
      {loading && !stats ? (
        // Skeleton Loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gradient-to-br from-white to-white/50 border border-border-color/60 rounded-2xl p-5 h-[156px] animate-pulse">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div className="h-7 bg-gray-300 rounded w-1/2 mt-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        // Error Message
        <div className="mb-8 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-3">
          <FiAlertCircle size={20} />
          <span>Could not load dashboard statistics: {error}</span>
        </div>
      ) : stats ? (
        // Loaded Stats (Mapped from new `stats` object to ORIGINAL KPIs)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            icon={<FaRupeeSign size={20} />}
            title="Today's Revenue"
            value={`₹${formatStatValue(stats.todays_revenue)}`}
            subtitle={`${stats.todays_bookings} booking(s)`}
          />
          <KpiCard
            icon={<FaCalendarCheck size={20} />}
            title="Upcoming Bookings"
            value={stats.upcoming_bookings}
            subtitle="Future confirmed"
          />
          <KpiCard
            icon={<FaChartLine size={20} />}
            title="Total Revenue"
            value={`₹${formatStatValue(stats.total_revenue)}`}
            subtitle="All-time"
          />
          <KpiCard
            icon={<FaBook size={20} />}
            title="Total Bookings"
            value={formatStatValue(stats.total_bookings)}
            subtitle="All-time"
          />
        </div>
      ) : null}

      {/* Charts Section (Original Styling) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-white border border-border-color/60 shadow-sm rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-dark-text mb-4">
            Revenue Trend (Last 6 Months)
          </h2>
          {loading ? (
            <ChartLoader />
          ) : stats && stats.revenue_trend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stats.revenue_trend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="#10B981"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="#10B981"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickFormatter={(val) => format(parseISO(val), "MMM yy")}
                  stroke="#6b7280"
                  fontSize={12}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  stroke="#6b7280"
                  fontSize={12}
                  tickFormatter={(val) => `₹${formatStatValue(val)}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue" // Added name for tooltip
                  stroke="#059669"
                  fill="url(#colorRevenue)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#059669", fillOpacity: 1 }}
                  activeDot={{ r: 6, fill: "#fff", stroke: "#059669", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex flex-col items-center justify-center text-medium-text">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <FaChartLine className="w-8 h-8 text-gray-400" />
                </div>
                <p className="font-medium">No revenue data yet</p>
                <p className="text-sm text-light-text">
                  New bookings will appear here.
                </p>
              </div>
          )}
        </div>

        {/* Other Stats Column */}
        <div className="flex flex-col gap-6">
          {/* Peak Hours */}
          <div className="bg-white border border-border-color/60 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-dark-text mb-4">
              Peak Booking Hours
            </h2>
            {loading ? (
              <ChartLoader />
            ) : stats && stats.peak_hours?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.peak_hours.slice(0, 5)} layout="vertical" margin={{ left: 10, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    stroke="#6b7280"
                    fontSize={12}
                    width={50} // Explicit width for labels
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="bookings" name="Bookings" fill="#10B981" radius={[0, 8, 8, 0]} barSize={20}>
                    {stats.peak_hours.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center text-medium-text">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <FaClock className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium">No booking data yet</p>
                  <p className="text-sm text-light-text">
                    Peak hours will be calculated soon.
                  </p>
                </div>
            )}
          </div>

          {/* Sport Distribution */}
          <div className="bg-white border border-border-color/60 shadow-sm rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-dark-text mb-4">
              Sport Distribution
            </h2>
            {loading ? (
              <ChartLoader />
            ) : stats && stats.sport_distribution?.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={stats.sport_distribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="bookings"
                      nameKey="name" // Use nameKey to match the data
                    >
                      {stats.sport_distribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
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
                  <p className="text-sm text-light-text">
                    Bookings will be categorized here
                  </p>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboardPage;