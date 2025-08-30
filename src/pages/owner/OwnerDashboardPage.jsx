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

const KpiCard = ({ icon, title, value, growth, subtitle }) => (
  <div className="stat-card">
    <div className="stat-icon">{icon}</div>
    <div className="stat-info">
      <span className="stat-title">{title}</span>
      <span className="stat-value">{value}</span>
      {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      {growth !== undefined && (
        <span
          className={`stat-growth ${growth >= 0 ? "positive" : "negative"}`}
        >
          {growth >= 0 ? <FaArrowUp /> : <FaArrowDown />} {Math.abs(growth)}% vs
          last month
        </span>
      )}
    </div>
  </div>
);

// Define an initial empty state for the stats
const initialStats = {
  todays_revenue: 0,
  monthly_revenue: 0,
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

function OwnerDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("30days");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const days = timeframe === "7days" ? 7 : timeframe === "90days" ? 90 : 30;
        
        const { data, error } = await supabase.rpc('get_owner_dashboard_statistics', {
          days_to_track: days 
        });

        if (error) throw error;

        setStats({
          todays_revenue: data.todays_revenue || 0,
          monthly_revenue: data.monthly_revenue || 0,
          total_revenue: data.total_revenue || 0,
          todays_bookings: data.todays_bookings || 0,
          upcoming_bookings: data.upcoming_bookings || 0,
          most_popular_sport: data.most_popular_sport || "N/A",
          mom_revenue_growth: data.mom_revenue_growth || 0,
          revenue_by_facility: data.revenue_by_facility || [],
          peak_booking_hours: data.peak_booking_hours || [],
          revenue_trend: data.revenue_trend || [],
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

  if (loading)
    return (
      <div className="container dashboard-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );

  const COLORS = [
    "#10B981",
    "#059669",
    "#047857",
    "#065F46",
    "#064E3B",
    "#034E3B",
  ];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={index}
              className="tooltip-value"
              style={{ color: entry.color }}
            >
              {entry.name}:{" "}
              {entry.name.includes("Revenue")
                ? `₹${entry.value.toLocaleString("en-IN")}`
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (

    
    <div className="container dashboard-page">
      <div className="owner-header">
        <div>
          <h1 className="section-heading">Dashboard Overview</h1>
          <p className="dashboard-subtitle">
            Track your venue performance and revenue insights
          </p>
        </div>
        <div className="header-actions">
          <div className="timeframe-selector">
            <button
              className={`timeframe-btn ${timeframe === "7days" ? "active" : ""}`}
              onClick={() => setTimeframe("7days")}
            >
              7D
            </button>
            <button
              className={`timeframe-btn ${timeframe === "30days" ? "active" : ""}`}
              onClick={() => setTimeframe("30days")}
            >
              30D
            </button>
            <button
              className={`timeframe-btn ${timeframe === "90days" ? "active" : ""}`}
              onClick={() => setTimeframe("90days")}
            >
              90D
            </button>
          </div>
          <Link to="/owner/my-venues" className="btn btn-primary">
            Manage Venues
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <KpiCard
          icon={<FaRupeeSign />}
          title="Today's Revenue"
          value={`₹${stats.todays_revenue.toLocaleString("en-IN")}`}
          subtitle={`${stats.todays_bookings} bookings today`}
        />
        <KpiCard
          icon={<FaCalendarAlt />}
          title="This Month's Revenue"
          value={`₹${stats.monthly_revenue.toLocaleString("en-IN")}`}
          growth={stats.mom_revenue_growth}
        />
        <KpiCard
          icon={<FaChartLine />}
          title="Total Revenue (All Time)"
          value={`₹${stats.total_revenue.toLocaleString("en-IN")}`}
          subtitle={`Across all venues`}
        />
        
        <Link to="/owner/calendar" className="kpi-card-link">
          <KpiCard
            icon={<FaCalendarCheck />}
            title="Upcoming Bookings"
            value={stats.upcoming_bookings}
            subtitle={`${stats.todays_bookings} today`}
          />
        </Link>
        
        <KpiCard
          icon={<FaFutbol />}
          title="Most Popular Sport"
          value={stats.most_popular_sport}
          subtitle={`${stats.sport_distribution[0]?.bookings || 0} bookings`}
        />
        <KpiCard
          icon={<FaClock />}
          title="Peak Hour Today"
          value={stats.peak_booking_hours[0]?.hour || "N/A"}
          subtitle={`${stats.peak_booking_hours[0]?.bookings || 0} bookings`}
        />
      </div>

      {/* Charts Grid */}
      <div className="dashboard-grid">
        {/* Revenue Trend Chart */}
        <div className="chart-card large">
          <h3 className="card-title">
            <FaChartLine /> Revenue Trend (
            {timeframe === "7days"
              ? "7 Days"
              : timeframe === "30days"
                ? "30 Days"
                : "90 Days"}
            )
          </h3>
          {stats.revenue_trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.revenue_trend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-placeholder">No revenue data available</div>
          )}
        </div>

        {/* Revenue by Facility */}
        <div className="chart-card">
          <h3 className="card-title">
            <FaTrophy /> Revenue by Facility
          </h3>
          {stats.revenue_by_facility.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.revenue_by_facility.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  stroke="#6B7280"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="#6B7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="chart-placeholder">No facility data available</div>
          )}
        </div>

        {/* Sport Distribution */}
        <div className="chart-card">
          <h3 className="card-title">
            <FaFutbol /> Sport Distribution
          </h3>
          {stats.sport_distribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.sport_distribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="bookings"
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
            <div className="chart-placeholder">No sport data available</div>
          )}
        </div>

        {/* Peak Booking Hours */}
        <div className="list-card">
          <h3 className="card-title">
            <FaClock /> Peak Booking Hours
          </h3>
          {stats.peak_booking_hours.length > 0 ? (
            <div className="peak-hours-list">
              {stats.peak_booking_hours.map((hour) => (
                <div key={hour.hour} className="peak-hour-item">
                  <div className="hour-info">
                    <span className="hour-time">{hour.hour}</span>
                    <span className="hour-period">
                      {hour.hourNum < 12 ? "AM" : "PM"}
                    </span>
                  </div>
                  <div className="hour-stats">
                    <span className="hour-bookings">{hour.bookings}</span>
                    <span className="hour-label">bookings</span>
                  </div>
                  <div className="hour-bar">
                    <div
                      className="hour-bar-fill"
                      style={{
                        width: `${(hour.bookings /
                            Math.max(
                              ...stats.peak_booking_hours.map((h) => h.bookings)
                            )) *
                          100
                          }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="chart-placeholder">No booking data available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboardPage;