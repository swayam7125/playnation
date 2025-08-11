import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../AuthContext";
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
  LineChart,
  Line,
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
  Area,
  AreaChart,
} from "recharts";

const KpiCard = ({ icon, title, value, growth, subtitle, trend }) => (
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
      {trend && <div className="stat-trend">{trend}</div>}
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
  const [timeframe, setTimeframe] = useState("7days"); // 7days, 30days, 90days

  useEffect(() => {
    const fetchAndCalculateStats = async () => {
      setLoading(true);
      try {
        if (!user) {
          setStats(initialStats);
          return;
        }

        // 1. Get all venues and facilities owned by the current user
        const { data: venuesData, error: venuesError } = await supabase
          .from("venues")
          .select(
            `
            venue_id,
            name,
            facilities(
              facility_id, 
              name, 
              sports(name)
            )
          `
          )
          .eq("owner_id", user.id);

        if (venuesError) throw venuesError;

        const facilityIds = venuesData.flatMap((v) =>
          v.facilities.map((f) => f.facility_id)
        );
        const facilities = venuesData.flatMap((v) => v.facilities);

        if (facilityIds.length === 0) {
          setStats(initialStats);
          return;
        }

        // 2. Get all bookings for those facilities
        const { data: bookingsData, error: bookingsError } = await supabase
          .from("bookings")
          .select("*")
          .in("facility_id", facilityIds);

        if (bookingsError) throw bookingsError;

        if (!bookingsData || bookingsData.length === 0) {
          setStats({
            ...initialStats,
            revenue_by_facility: facilities.map((f) => ({
              name: f.name,
              revenue: 0,
              bookings: 0,
              sport: f.sports?.name || "Unknown",
            })),
          });
          return;
        }

        // 3. Calculate all statistics
        const now = new Date();
        const today = now.toISOString().split("T")[0];
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        let todays_revenue = 0;
        let monthly_revenue = 0;
        let last_monthly_revenue = 0;
        let total_revenue = 0;

        // Calculate revenue trends based on timeframe
        const days =
          timeframe === "7days" ? 7 : timeframe === "30days" ? 30 : 90;
        const revenueTrend = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          const dayRevenue = bookingsData
            .filter((b) =>
              new Date(b.start_time).toISOString().startsWith(dateStr)
            )
            .reduce((sum, b) => sum + b.total_amount, 0);

          revenueTrend.push({
            date: date.toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
            }),
            revenue: dayRevenue,
            bookings: bookingsData.filter((b) =>
              new Date(b.start_time).toISOString().startsWith(dateStr)
            ).length,
          });
        }

        // Calculate facility performance
        const facilityPerformance = facilities
          .map((facility) => {
            const facilityBookings = bookingsData.filter(
              (b) => b.facility_id === facility.facility_id
            );
            return {
              name: facility.name,
              revenue: facilityBookings.reduce(
                (sum, b) => sum + b.total_amount,
                0
              ),
              bookings: facilityBookings.length,
              sport: facility.sports?.name || "Unknown",
            };
          })
          .filter((f) => f.revenue > 0 || f.bookings > 0);

        // Calculate peak booking hours
        const hourlyBookings = Array(24).fill(0);
        bookingsData.forEach((b) => {
          const hour = new Date(b.start_time).getHours();
          hourlyBookings[hour]++;
        });

        const peakHours = hourlyBookings
          .map((count, hour) => ({
            hour: `${hour.toString().padStart(2, "0")}:00`,
            bookings: count,
            hourNum: hour,
          }))
          .filter((h) => h.bookings > 0)
          .sort((a, b) => b.bookings - a.bookings)
          .slice(0, 8);

        // Calculate sport distribution
        const sportCounts = {};
        facilities.forEach((f) => {
          const sport = f.sports?.name || "Unknown";
          const facilityBookings = bookingsData.filter(
            (b) => b.facility_id === f.facility_id
          ).length;
          const facilityRevenue = bookingsData
            .filter((b) => b.facility_id === f.facility_id)
            .reduce((sum, b) => sum + b.total_amount, 0);

          if (!sportCounts[sport]) {
            sportCounts[sport] = { bookings: 0, revenue: 0 };
          }
          sportCounts[sport].bookings += facilityBookings;
          sportCounts[sport].revenue += facilityRevenue;
        });

        const sportDistribution = Object.entries(sportCounts)
          .map(([sport, data]) => ({
            name: sport,
            bookings: data.bookings,
            revenue: data.revenue,
          }))
          .filter((s) => s.bookings > 0)
          .sort((a, b) => b.revenue - a.revenue);

        const mostPopularSport = sportDistribution[0]?.name || "N/A";

        // Calculate revenues
        bookingsData.forEach((b) => {
          const bookingDate = new Date(b.start_time);
          total_revenue += b.total_amount;

          if (bookingDate.toISOString().startsWith(today)) {
            todays_revenue += b.total_amount;
          }
          if (bookingDate >= monthStart) {
            monthly_revenue += b.total_amount;
          }
          if (bookingDate >= lastMonthStart && bookingDate <= lastMonthEnd) {
            last_monthly_revenue += b.total_amount;
          }
        });

        const mom_revenue_growth =
          last_monthly_revenue > 0
            ? Math.round(
              ((monthly_revenue - last_monthly_revenue) /
                last_monthly_revenue) *
              100
            )
            : monthly_revenue > 0
              ? 100
              : 0;

        // Count bookings
        const todaysBookings = bookingsData.filter((b) =>
          new Date(b.start_time).toISOString().startsWith(today)
        ).length;

        const upcomingBookings = bookingsData.filter(
          (b) => new Date(b.start_time) > now
        ).length;

        setStats({
          todays_revenue,
          monthly_revenue,
          total_revenue,
          todays_bookings: todaysBookings,
          upcoming_bookings: upcomingBookings,
          most_popular_sport: mostPopularSport,
          mom_revenue_growth,
          revenue_by_facility: facilityPerformance,
          peak_booking_hours: peakHours,
          revenue_trend: revenueTrend,
          sport_distribution: sportDistribution,
        });
      } catch (error) {
        console.error("Error calculating dashboard data:", error);
        setStats(initialStats);
      } finally {
        setLoading(false);
      }
    };

    fetchAndCalculateStats();
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
              className={`timeframe-btn ${timeframe === "7days" ? "active" : ""
                }`}
              onClick={() => setTimeframe("7days")}
            >
              7D
            </button>
            <button
              className={`timeframe-btn ${timeframe === "30days" ? "active" : ""
                }`}
              onClick={() => setTimeframe("30days")}
            >
              30D
            </button>
            <button
              className={`timeframe-btn ${timeframe === "90days" ? "active" : ""
                }`}
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
        <KpiCard
          icon={<FaCalendarCheck />}
          title="Upcoming Bookings"
          value={stats.upcoming_bookings}
          subtitle={`${stats.todays_bookings} today`}
        />
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
              {stats.peak_booking_hours.map((hour, index) => (
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
