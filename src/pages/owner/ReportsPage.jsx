import React, { useState, useEffect } from "react";
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
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaChartBar,
  FaChevronDown,
  FaBook,
  FaList, // --- THIS IS THE FIX ---
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
import { format, parseISO, startOfMonth, subMonths } from "date-fns";
import { FiLoader, FiAlertCircle } from "react-icons/fi";

// Helper function to get date string in YYYY-MM-DD format
const getLocalDateString = (date) => {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().split("T")[0];
};

// Get default date range (current month)
const defaultStartDate = getLocalDateString(startOfMonth(new Date()));
const defaultEndDate = getLocalDateString(new Date()); // Today

const KpiCard = ({ icon, title, value, growth, subtitle, trend }) => (
  <div className="group relative overflow-hidden bg-gradient-to-br from-white to-white/50 backdrop-blur-sm border border-border-color/60 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-green/50">
    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-green/5 to-transparent rounded-full -translate-y-16 translate-x-1/4 opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-green/10 to-primary-green/20 text-primary-green flex items-center justify-center">
          {icon}
        </div>
        {growth != null && ( // Added check for null
          <span
            className={`font-semibold text-xs px-2 py-1 rounded-full flex items-center ${
              growth > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {growth > 0 ? (
              <FaArrowUp className="w-3 h-3 mr-1" />
            ) : (
              <FaArrowDown className="w-3 h-3 mr-1" />
            )}
            {growth}%
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-dark-text mt-3">{value}</p>
      <p className="text-sm font-medium text-medium-text">{title}</p>
      {subtitle && (
        <p className="text-xs text-light-text mt-1">{subtitle}</p>
      )}
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
          style={{ color: payload[0].fill || "#059669" }}
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

// Loader component for charts
const ChartLoader = () => (
  <div className="h-[280px] flex items-center justify-center">
    <FiLoader className="animate-spin text-primary-green text-3xl" />
  </div>
);

// Helper to format large numbers
const formatStatValue = (value) => {
    if (value == null) return "₹0"; // Handle null or undefined
    const numValue = Number(value);
    if (isNaN(numValue)) return "₹0";

    if (numValue >= 10000000) return `₹${(numValue / 10000000).toFixed(1)} Cr`;
    if (numValue >= 100000) return `₹${(numValue / 100000).toFixed(1)} L`;
    if (numValue >= 1000) return `₹${(numValue / 1000).toFixed(1)} K`;
    return `₹${numValue.toFixed(0)}`;
};

// Helper to format currency
const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);


function ReportsPage() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [activePreset, setActivePreset] = useState("monthly");

  // Single effect to fetch stats based on the selected date range
  useEffect(() => {
    const fetchReportStats = async () => {
      if (!user || !startDate || !endDate) return;

      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.rpc('get_owner_report_stats', {
        p_start_date: startDate,
        p_end_date: endDate
      });

      if (error) {
        console.error("Error fetching report stats:", error);
        setError(error.message);
      } else {
        setStats(data);
      }
      setLoading(false);
    };

    fetchReportStats();
  }, [user, startDate, endDate]); // Re-fetches if user or dates change

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    if (name === "startDate") setStartDate(value);
    if (name === "endDate") setEndDate(value);
    setActivePreset(null); // Custom range
  };

  const setPreset = (preset) => {
    setActivePreset(preset);
    const today = new Date();
    const end = getLocalDateString(today); // Today
    let start;

    if (preset === "weekly") {
      start = getLocalDateString(new Date(new Date().setDate(today.getDate() - 6))); // Last 7 days
    } else if (preset === "monthly") {
      start = getLocalDateString(startOfMonth(new Date())); // This month
    } else if (preset === "quarterly") {
      start = getLocalDateString(startOfMonth(subMonths(new Date(), 2))); // This quarter
    }
    
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <div className="min-h-screen bg-background text-dark-text p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header & Date Picker */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark-text">Reports</h1>
            <p className="text-lg text-medium-text mt-1">
              Your performance snapshot.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-medium-text mb-1"
                >
                  From
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={startDate}
                  onChange={handleDateChange}
                  className="block w-full rounded-lg border-border-color/60 shadow-sm focus:border-primary-green focus:ring-primary-green sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-medium-text mb-1"
                >
                  To
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={endDate}
                  onChange={handleDateChange}
                  className="block w-full rounded-lg border-border-color/60 shadow-sm focus:border-primary-green focus:ring-primary-green sm:text-sm"
                />
              </div>
            </div>

            <div className="flex items-end">
              <div className="relative">
                <button
                  onClick={() => setPreset(activePreset || 'monthly')} // Re-apply current or default
                  className="flex items-center gap-2 text-sm font-medium text-medium-text bg-white border border-border-color/60 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors h-full"
                >
                  <FaCalendarAlt className="text-gray-400" />
                  <span>
                    {activePreset
                      ? `This ${activePreset.charAt(0).toUpperCase() + activePreset.slice(1)}`
                      : "Custom"}
                  </span>
                  <FaChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preset buttons from original file */}
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => setPreset("weekly")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
              activePreset === "weekly"
                ? "bg-primary-green text-white"
                : "bg-white text-medium-text border border-border-color/60 hover:bg-gray-50"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setPreset("monthly")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
              activePreset === "monthly"
                ? "bg-primary-green text-white"
                : "bg-white text-medium-text border border-border-color/60 hover:bg-gray-50"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPreset("quarterly")}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
              activePreset === "quarterly"
                ? "bg-primary-green text-white"
                : "bg-white text-medium-text border border-border-color/60 hover:bg-gray-50"
            }`}
          >
            This Quarter
          </button>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <FiLoader className="animate-spin text-primary-green text-4xl" />
          </div>
        )}
        {!loading && error && (
          <div className="p-6 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center justify-center gap-3">
            <FiAlertCircle size={24} />
            <span className="font-medium">Error: {error}</span>
          </div>
        )}

        {/* Main Stats Grid */}
        {!loading && !error && stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <KpiCard
                icon={<FaRupeeSign size={20} />}
                title="Total Revenue"
                value={formatCurrency(stats.total_revenue)}
                subtitle={`For selected period`}
              />
              <KpiCard
                icon={<FaBook size={20} />}
                title="Total Bookings"
                value={stats.total_bookings}
                subtitle={`For selected period`}
              />
              <KpiCard
                icon={<FaChartLine size={20} />}
                title="Avg. Booking Value"
                value={formatCurrency(stats.avg_booking_value)}
                subtitle={`For selected period`}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Over Time Chart */}
              <div className="lg:col-span-2 bg-white border border-border-color/60 shadow-sm rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-dark-text mb-4">
                  Revenue Over Time
                </h2>
                {stats.revenue_over_time?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={stats.revenue_over_time}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(val) => format(parseISO(val), "d MMM")}
                        stroke="#6b7280"
                        fontSize={12}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        stroke="#6b7280"
                        fontSize={12}
                        tickFormatter={(val) => `₹${formatStatValue(val).replace('₹','')}`}
                      />
                      <Tooltip 
                        content={<CustomTooltip />} 
                        labelFormatter={(label) => format(parseISO(label), "MMM d, yyyy")}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
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
                    <p className="font-medium">No revenue data for this period</p>
                    <p className="text-sm text-light-text">
                      Try selecting a different date range.
                    </p>
                  </div>
                )}
              </div>

              {/* Sport Distribution Chart */}
              <div className="bg-white border border-border-color/60 shadow-sm rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-dark-text mb-4">
                  Sport Distribution
                </h2>
                {stats.sport_distribution?.length > 0 ? (
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
                        nameKey="name"
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
                    <p className="font-medium">No sport data available for this period</p>
                    <p className="text-sm text-light-text">
                      Sports breakdown will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Bookings by Venue Table */}
            <div className="mt-8 bg-white border border-border-color/60 shadow-sm rounded-2xl overflow-hidden">
              <div className="flex justify-between items-center p-6">
                <h2 className="text-xl font-semibold text-dark-text">
                  Performance by Venue
                </h2>
                <Link
                  to="/owner/venues"
                  className="flex items-center gap-2 text-sm font-medium text-primary-green hover:text-primary-green-dark transition-colors"
                >
                  <span>Manage Venues</span>
                  <FaEye />
                </Link>
              </div>
              {stats.bookings_by_venue.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border-color/30">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-medium-text uppercase tracking-wider">
                          Venue Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-medium-text uppercase tracking-wider">
                          Total Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-medium-text uppercase tracking-wider">
                          Total Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-border-color/30">
                      {stats.bookings_by_venue.map((venue) => (
                        <tr key={venue.venue_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-dark-text">
                              {venue.name}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-medium-text">
                              {venue.bookings}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-dark-text">
                              {formatCurrency(venue.revenue)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                 <div className="h-40 flex flex-col items-center justify-center text-medium-text border-t border-border-color/30">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                    <FaList className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium">No venue data for this period</p>
                  <p className="text-sm text-light-text">
                    Venue performance will be listed here.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;