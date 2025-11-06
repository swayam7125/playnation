// src/pages/owner/ReportsPage.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import { FaRupeeSign, FaCalendarCheck, FaCalculator, FaList, FaUsers, FaBuilding } from "react-icons/fa";
import { format, subDays } from "date-fns";
import { FiLoader, FiAlertCircle } from "react-icons/fi";
import { formatCurrency } from "../../utils/formatters";

// --- Import new components ---
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DownloadReportButton from "../../components/common/DownloadReportButton"; // <-- 1. IMPORT

// ... (All helper functions and StatCard component are unchanged) ...
const getLocalDateString = (date) => {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
  return adjustedDate.toISOString().split("T")[0];
};
const PRESETS = { '7d': '7 Days', '30d': '30 Days', '90d': '90 Days', 'all': 'All Time', 'custom': 'Custom Range' };
const COLORS = ["#059669", "#047857", "#065f46", "#064e3b"];
const StatCard = ({ title, value, icon }) => (
  <div className="bg-primary-green-dark border border-primary-green rounded-xl shadow-lg p-6 flex items-center space-x-4">
    <div className="p-4 rounded-full bg-white"> 
      {React.cloneElement(icon, { className: "h-7 w-7 text-primary-green-dark" })}
    </div>
    <div>
      <p className="text-sm text-gray-200 font-medium uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);
const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-border-color-light">
        <p className="text-sm text-medium-text">{`${label}`}</p>
        <p className="text-dark-text font-medium">{`Revenue: ${formatCurrency(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
// ... (End of unchanged components) ...


function ReportsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [dateRangePreset, setDateRangePreset] = useState('7d');
  
  const [startDate, setStartDate] = useState(() => getLocalDateString(subDays(new Date(), 29)));
  const [endDate, setEndDate] = useState(() => getLocalDateString(new Date()));
  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState('');

  // ... (All useEffects are unchanged) ...
  useEffect(() => {
    async function fetchOwnerVenues() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('venue_id, name')
          .eq('owner_id', user.id);
        if (error) throw error;
        setVenues(data || []);
      } catch (err) { console.error("Error fetching venues:", err); }
    }
    fetchOwnerVenues();
  }, [user]);

  useEffect(() => {
    if (dateRangePreset === 'custom') return;
    const today = new Date();
    let newStartDate, newEndDate;

    if (dateRangePreset === 'all') {
      newStartDate = null;
      newEndDate = null;
    } else {
      newEndDate = getLocalDateString(today);
      if (dateRangePreset === '7d') newStartDate = getLocalDateString(subDays(today, 6));
      else if (dateRangePreset === '30d') newStartDate = getLocalDateString(subDays(today, 29));
      else if (dateRangePreset === '90d') newStartDate = getLocalDateString(subDays(today, 89));
    }
    
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  }, [dateRangePreset]);

  useEffect(() => {
    async function fetchReportData() {
      if (!user) return;
      try {
        setLoading(true);
        const venue_ids_param = selectedVenueId ? [selectedVenueId] : null;
        const { data, error } = await supabase.rpc("get_owner_report_stats", {
          p_owner_id: user.id,
          p_start_date: startDate,
          p_end_date: endDate,
          p_venue_ids: venue_ids_param
        });
        if (error) throw error;
        const defaultData = { total_revenue: 0, total_bookings: 0, avg_booking_value: 0, venue_revenue: [] };
        setStats(data || defaultData);
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError(err.message || "Failed to load report data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchReportData();
  }, [user, startDate, endDate, selectedVenueId]);
  // ... (End of unchanged useEffects) ...


  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold text-primary-green-dark mb-8">
          Reports
        </h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl flex items-center space-x-4">
            <FiAlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <p className="font-bold text-lg">Error Loading Reports</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Stat Cards Grid (Unchanged) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* ... StatCards (unchanged) ... */}
          <StatCard
            title="Total Revenue"
            value={formatCurrency(stats?.total_revenue || 0)}
            icon={<FaRupeeSign />}
          />
          <StatCard
            title="Total Bookings"
            value={stats?.total_bookings || 0}
            icon={<FaCalendarCheck />}
          />
          <StatCard
            title="Avg. Booking Value"
            value={formatCurrency(stats?.avg_booking_value || 0)}
            icon={<FaCalculator />}
          />
          <StatCard
            title="Unique Players"
            value={stats?.unique_players || 0}
            icon={<FaUsers />}
          />
          <StatCard
            title="Most Booked Facility"
            value={stats?.most_booked_facility || 'N/A'}
            icon={<FaBuilding />}
          />
        </div>

        {/* Main Content Card (White) */}
        <div className="bg-card-bg border border-border-color-light rounded-xl shadow-lg overflow-hidden">
          
          {/* Header and Date Pickers */}
          <div className="p-6 border-b border-border-color-light space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <h2 className="text-xl font-bold text-primary-green-dark mb-4 md:mb-0">
                Revenue by Venue
              </h2>
              
              {/* Date Preset Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {Object.entries(PRESETS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setDateRangePreset(key)}
                    className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center gap-2
                      ${dateRangePreset === key 
                        ? 'bg-primary-green text-white hover:bg-primary-green-dark' 
                        : 'bg-card-bg text-primary-green border border-border-color-light hover:bg-hover-bg'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* --- MODIFIED: Added Download Button --- */}
            <div className="flex flex-col md:flex-row gap-4 w-full items-end">
              {/* Venue Dropdown */}
              <div className="w-full md:w-auto md:flex-grow lg:flex-grow-0 lg:w-48">
                <label htmlFor="venueSelect" className="block text-sm font-medium text-medium-text mb-1">Venue</label>
                <select
                  id="venueSelect"
                  value={selectedVenueId}
                  onChange={(e) => setSelectedVenueId(e.target.value)}
                  className="w-full bg-background border border-border-color rounded-md shadow-sm p-2 text-dark-text focus:ring-primary-green focus:border-primary-green"
                >
                  <option value="">All Venues</option>
                  {venues.map((venue) => (
                    <option key={venue.venue_id} value={venue.venue_id}>
                      {venue.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Conditional Custom Date Pickers */}
              {dateRangePreset === 'custom' && (
                <>
                  <div className="w-full md:w-auto">
                    <label htmlFor="startDate" className="block text-sm font-medium text-medium-text mb-1">Start Date</label>
                    <input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-background border border-border-color rounded-md shadow-sm p-2 text-dark-text"
                    />
                  </div>
                  <div className="w-full md:w-auto">
                    <label htmlFor="endDate" className="block text-sm font-medium text-medium-text mb-1">End Date</label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-background border border-border-color rounded-md shadow-sm p-2 text-dark-text"
                    />
                  </div>
                </>
              )}

              {/* --- 2. ADD THE BUTTON --- */}
              <div className="md:ml-auto">
                <DownloadReportButton
                  startDate={startDate}
                  endDate={endDate}
                  selectedVenueId={selectedVenueId}
                />
              </div>

            </div>
          </div>

          {/* ... (Table Container and Visualization Section are unchanged) ... */}
          {loading ? (
            <div className="h-60 flex justify-center items-center">
              <FiLoader className="animate-spin text-primary-green h-8 w-8" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              {stats?.venue_revenue && stats.venue_revenue.length > 0 ? (
                <table className="min-w-full divide-y divide-border-color-light">
                  <thead className="bg-hover-bg">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-text uppercase tracking-wider">
                        Venue
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-text uppercase tracking-wider">
                        Bookings
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-medium-text uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card-bg divide-y divide-border-color-light">
                    {stats.venue_revenue.map((venue) => (
                      <tr key={venue.venue_id} className="hover:bg-hover-bg">
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
              ) : (
                <div className="h-40 flex flex-col items-center justify-center text-medium-text">
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
          )}
        </div>

        {!loading && stats?.venue_revenue && stats.venue_revenue.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-primary-green-dark mb-4">
              Visualizations
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              <div className="bg-card-bg border border-border-color-light rounded-xl shadow-lg p-6 min-w-0">
                <h3 className="text-xl font-bold text-primary-green-dark mb-4">
                  Revenue by Venue
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.venue_revenue} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                      <XAxis dataKey="name" tick={false} />
                      <YAxis tickFormatter={(val) => `₹${val / 1000}k`} />
                      <Tooltip content={<CustomBarTooltip />} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#059669" name="Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-card-bg border border-border-color-light rounded-xl shadow-lg p-6 min-w-0">
                <h3 className="text-xl font-bold text-primary-green-dark mb-4">
                  Booking Distribution
                </h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.venue_revenue}
                        dataKey="bookings"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        labelLine={false}
                        label={renderCustomizedLabel}
                      >
                        {stats.venue_revenue.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportsPage;