import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../AuthContext";
import {
  FaRupeeSign, FaCalendarCheck, FaChartLine, FaFutbol, FaClock,
  FaTrophy, FaCalendarAlt, FaArrowUp, FaArrowDown, FaEye,
} from "react-icons/fa";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";

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
            {trend && (
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
        
        {growth !== undefined && (
          <div className={`inline-flex items-center space-x-1 text-xs font-bold mt-2 px-2 py-1 rounded-full ${growth >= 0 ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-red-700 bg-red-50 border border-red-200"}`}>
            {growth >= 0 ? <FaArrowUp className="w-2 h-2" /> : <FaArrowDown className="w-2 h-2" />}
            <span>{Math.abs(growth)}% vs last month</span>
          </div>
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
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7days");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) { setLoading(false); return; }
      setLoading(true);
      try {
        // Keeping days calculation for potential future database filtering via RPC argument
        const days = timeframe === "7days" ? 7 : timeframe === "90days" ? 90 : 30;
        
        // RPC Call: Faster server-side data aggregation
        const { data: dashboardData, error } = await supabase.rpc('get_owner_dashboard_statistics', { days_to_track: days });
        
        if (error) throw error;
        if (!dashboardData) throw new Error("No data received from dashboard function.");

        // Streamlined state setting using the spread operator and defensive defaults for arrays
        setStats({
          ...dashboardData,
          revenue_by_facility: dashboardData.revenue_by_facility || [],
          peak_booking_hours: dashboardData.peak_booking_hours || [],
          revenue_trend: dashboardData.revenue_trend || [],
          sport_distribution: dashboardData.sport_distribution || [],
        });

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats(initialStats);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, [user, timeframe]); // Dependency on timeframe kept to re-fetch if filter changes

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-light-green-bg/30 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-green/30 border-t-primary-green mx-auto"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary-green/10"></div>
        </div>
        <p className="text-medium-text font-medium">Loading Dashboard...</p>
        <p className="text-sm text-light-text">Fetching your latest metrics</p>
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
        
        {/* Premium Header */}
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
                  <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                  <p className="text-white/80 text-sm">Real-time venue performance insights</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KpiCard 
            icon={<FaRupeeSign />} 
            title="Today's Revenue" 
            value={`₹${stats.todays_revenue.toLocaleString("en-IN")}`} 
            subtitle={`${stats.todays_bookings} bookings today`}
            trend={12}
          />
          <KpiCard 
            icon={<FaCalendarAlt />} 
            title="Monthly Revenue" 
            value={`₹${stats.monthly_revenue.toLocaleString("en-IN")}`} 
            growth={stats.mom_revenue_growth}
          />
          <KpiCard 
            icon={<FaChartLine />} 
            title="Total Revenue" 
            value={`₹${stats.total_revenue.toLocaleString("en-IN")}`} 
            subtitle="All time across venues"
          />
          <Link to="/owner/calendar" className="no-underline">
            <KpiCard 
              icon={<FaCalendarCheck />} 
              title="Upcoming Bookings" 
              value={stats.upcoming_bookings} 
              subtitle={`${stats.todays_bookings} scheduled today`}
              trend={8}
            />
          </Link>
          <KpiCard 
            icon={<FaFutbol />} 
            title="Most Popular Sport" 
            value={stats.most_popular_sport} 
            subtitle={`${stats.sport_distribution[0]?.bookings || 0} total bookings`}
          />
          <KpiCard 
            icon={<FaClock />} 
            title="Peak Hour Today" 
            value={stats.peak_booking_hours[0]?.hour || "N/A"} 
            subtitle={`${stats.peak_booking_hours[0]?.bookings || 0} bookings`}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Trend - Full Width */}
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
                <p className="font-medium">No revenue data available</p>
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
              <h3 className="text-lg font-bold text-dark-text">Revenue by Facility</h3>
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
                <p className="font-medium">No facility data available</p>
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
              <h3 className="text-lg font-bold text-dark-text">Sport Distribution</h3>
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
                <p className="font-medium">No sport data available</p>
                <p className="text-sm text-light-text">Sports breakdown will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboardPage;