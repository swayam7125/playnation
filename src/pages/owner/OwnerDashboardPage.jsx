import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import {
  FaRupeeSign, FaCalendarCheck, FaChartLine, FaFutbol, FaClock,
  FaTrophy, FaCalendarAlt, FaArrowUp, FaArrowDown,
} from "react-icons/fa";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

const KpiCard = ({ icon, title, value, growth, subtitle }) => (
  <div className="bg-card-bg border border-border-color rounded-xl p-6 flex items-center gap-4 transition duration-300 shadow-md hover:-translate-y-1 hover:shadow-xl hover:border-primary-green">
    <div className="bg-primary-green text-white p-5 rounded-xl text-2xl flex items-center justify-center shadow-md">
      {icon}
    </div>
    <div className="flex flex-col flex-1 gap-1">
      <span className="text-sm text-light-text font-semibold uppercase tracking-wider">{title}</span>
      <span className="text-3xl font-extrabold text-dark-text leading-tight">{value}</span>
      {subtitle && <span className="text-xs text-light-text font-medium">{subtitle}</span>}
      {growth !== undefined && (
        <span className={`flex items-center gap-1.5 text-xs font-bold mt-1 px-3 py-1 rounded-full w-fit ${growth >= 0 ? "text-emerald-800 bg-emerald-100" : "text-red-800 bg-red-100"}`}>
          {growth >= 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(growth)}% vs last month
        </span>
      )}
    </div>
  </div>
);

const initialStats = {
  todays_revenue: 0, monthly_revenue: 0, total_revenue: 0, todays_bookings: 0,
  upcoming_bookings: 0, most_popular_sport: "N/A", mom_revenue_growth: 0,
  revenue_by_facility: [], peak_booking_hours: [], revenue_trend: [], sport_distribution: [],
};

function OwnerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("30days");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) { setLoading(false); return; }
      setLoading(true);
      try {
        const days = timeframe === "7days" ? 7 : timeframe === "90days" ? 90 : 30;
        const { data, error } = await supabase.rpc('get_owner_dashboard_statistics', { days_to_track: days });
        if (error) throw error;
        setStats({
          todays_revenue: data.todays_revenue || 0, monthly_revenue: data.monthly_revenue || 0,
          total_revenue: data.total_revenue || 0, todays_bookings: data.todays_bookings || 0,
          upcoming_bookings: data.upcoming_bookings || 0, most_popular_sport: data.most_popular_sport || "N/A",
          mom_revenue_growth: data.mom_revenue_growth || 0, revenue_by_facility: data.revenue_by_facility || [],
          peak_booking_hours: data.peak_booking_hours || [], revenue_trend: data.revenue_trend || [],
          sport_distribution: data.sport_distribution || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats(initialStats);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, [user, timeframe]);

  if (loading) return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center gap-6">
      <div className="w-12 h-12 border-4 border-border-color border-t-primary-green rounded-full animate-spin"></div>
      <p>Loading Dashboard...</p>
    </div>
  );

  const COLORS = ["#10B981", "#059669", "#047857", "#065F46", "#064E3B", "#034E3B"];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card-bg border border-border-color rounded-xl p-4 shadow-xl">
          <p className="font-bold text-dark-text mb-2 pb-2 border-b border-border-color">{label}</p>
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
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 p-8 bg-card-bg rounded-xl shadow-lg border border-border-color">
        <div>
          <h1 className="text-2xl font-bold text-dark-text">Dashboard Overview</h1>
          <p className="text-light-text mt-1">Track your venue performance and revenue insights</p>
        </div>
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <div className="flex bg-card-bg border border-border-color rounded-xl overflow-hidden shadow-sm">
            <button className={`py-2 px-5 font-semibold text-sm transition ${timeframe === "7days" ? "bg-primary-green text-white" : "hover:bg-light-green-bg hover:text-primary-green"}`} onClick={() => setTimeframe("7days")}>7D</button>
            <button className={`py-2 px-5 font-semibold text-sm transition ${timeframe === "30days" ? "bg-primary-green text-white" : "hover:bg-light-green-bg hover:text-primary-green"}`} onClick={() => setTimeframe("30days")}>30D</button>
            <button className={`py-2 px-5 font-semibold text-sm transition ${timeframe === "90days" ? "bg-primary-green text-white" : "hover:bg-light-green-bg hover:text-primary-green"}`} onClick={() => setTimeframe("90days")}>90D</button>
          </div>
          <Link to="/owner/my-venues" className="py-3 px-6 rounded-lg font-semibold text-sm transition duration-300 no-underline bg-primary-green text-white shadow-sm hover:bg-primary-green-dark hover:-translate-y-px hover:shadow-md">Manage Venues</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <KpiCard icon={<FaRupeeSign />} title="Today's Revenue" value={`₹${stats.todays_revenue.toLocaleString("en-IN")}`} subtitle={`${stats.todays_bookings} bookings today`} />
        <KpiCard icon={<FaCalendarAlt />} title="This Month's Revenue" value={`₹${stats.monthly_revenue.toLocaleString("en-IN")}`} growth={stats.mom_revenue_growth} />
        <KpiCard icon={<FaChartLine />} title="Total Revenue (All Time)" value={`₹${stats.total_revenue.toLocaleString("en-IN")}`} subtitle="Across all venues" />
        <Link to="/owner/calendar" className="no-underline"><KpiCard icon={<FaCalendarCheck />} title="Upcoming Bookings" value={stats.upcoming_bookings} subtitle={`${stats.todays_bookings} today`} /></Link>
        <KpiCard icon={<FaFutbol />} title="Most Popular Sport" value={stats.most_popular_sport} subtitle={`${stats.sport_distribution[0]?.bookings || 0} bookings`} />
        <KpiCard icon={<FaClock />} title="Peak Hour Today" value={stats.peak_booking_hours[0]?.hour || "N/A"} subtitle={`${stats.peak_booking_hours[0]?.bookings || 0} bookings`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2 bg-card-bg border border-border-color rounded-xl p-6 shadow-lg">
          <h3 className="flex items-center gap-4 text-xl font-bold text-dark-text mb-8 pb-4 border-b border-border-color"><FaChartLine className="text-primary-green" /> Revenue Trend ({timeframe === "7days" ? "7 Days" : timeframe === "30days" ? "30 Days" : "90 Days"})</h3>
          {stats.revenue_trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.revenue_trend}><defs><linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.8} /><stop offset="95%" stopColor="#10B981" stopOpacity={0.1} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="date" stroke="#6B7280" /><YAxis stroke="#6B7280" /><Tooltip content={<CustomTooltip />} /><Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} /></AreaChart>
            </ResponsiveContainer>
          ) : <div className="h-[300px] grid place-content-center text-medium-text">No revenue data available</div>}
        </div>

        <div className="bg-card-bg border border-border-color rounded-xl p-6 shadow-lg">
          <h3 className="flex items-center gap-4 text-xl font-bold text-dark-text mb-8 pb-4 border-b border-border-color"><FaTrophy className="text-primary-green" /> Revenue by Facility</h3>
          {stats.revenue_by_facility.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.revenue_by_facility.slice(0, 6)}><CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" /><XAxis dataKey="name" stroke="#6B7280" angle={-45} textAnchor="end" height={80} /><YAxis stroke="#6B7280" /><Tooltip content={<CustomTooltip />} /><Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          ) : <div className="h-[300px] grid place-content-center text-medium-text">No facility data available</div>}
        </div>

        <div className="bg-card-bg border border-border-color rounded-xl p-6 shadow-lg">
          <h3 className="flex items-center gap-4 text-xl font-bold text-dark-text mb-8 pb-4 border-b border-border-color"><FaFutbol className="text-primary-green" /> Sport Distribution</h3>
          {stats.sport_distribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart><Pie data={stats.sport_distribution} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="bookings">{stats.sport_distribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip content={<CustomTooltip />} /></PieChart>
            </ResponsiveContainer>
          ) : <div className="h-[300px] grid place-content-center text-medium-text">No sport data available</div>}
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboardPage;