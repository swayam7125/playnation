import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import AdminDashboardSkeleton from "../../components/skeletons/admin/AdminDashboardSkeleton";
import { FaUsers, FaBuilding, FaCalendarCheck, FaRupeeSign, FaUserPlus, FaClock, FaChartLine, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DownloadDropdown from '../../components/common/DownloadDropdown';

// KpiCard, SectionCard, and ActivityItem components remain unchanged
const KpiCard = ({ icon, title, value, subtitle, trend }) => (
  <div className="group relative overflow-hidden bg-white border border-border-color rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-green/10 hover:-translate-y-1">
    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary-green/10 via-primary-green/5 to-transparent rounded-full blur-3xl -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-700"></div>
    
    <div className="relative">
      <div className="flex items-start justify-between mb-4">
        <div className="w-14 h-14 bg-gradient-to-br from-primary-green via-primary-green to-primary-green-dark text-white rounded-xl flex items-center justify-center text-xl shadow-lg shadow-primary-green/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          {icon}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-semibold text-primary-green bg-light-green-bg px-2 py-1 rounded-full">
            <FaChartLine className="text-[10px]" />
            <span>{trend}</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-light-text uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-dark-text bg-gradient-to-r from-dark-text to-medium-text bg-clip-text">{value}</p>
        {subtitle && (
          <p className="text-xs text-medium-text font-medium mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  </div>
);

const SectionCard = ({ title, children, className = "" }) => (
  <div className={`bg-white border border-border-color rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
    <h3 className="text-xl font-bold text-dark-text mb-6 flex items-center gap-2">
      <div className="w-1 h-6 bg-gradient-to-b from-primary-green to-primary-green-dark rounded-full"></div>
      {title}
    </h3>
    {children}
  </div>
);

const ActivityItem = ({ title, subtitle, icon }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-hover-bg transition-all duration-200 group cursor-pointer">
    {icon && (
      <div className="w-10 h-10 bg-light-green-bg rounded-lg flex items-center justify-center text-primary-green group-hover:scale-110 transition-transform duration-200">
        {icon}
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-dark-text truncate">{title}</p>
      <p className="text-sm text-medium-text truncate">{subtitle}</p>
    </div>
  </div>
);


function AdminDashboardPage() {

  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingVenuesList, setPendingVenuesList] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);

  // handleDownloadReport, handleApproveVenue, handleRejectVenue remain unchanged
  const handleDownloadReport = async (format) => {
    setIsDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-admin-report', {
        body: { format },
      });
      if (error) throw error;

      const blob = new Blob([data], { type: format === 'pdf' ? 'application/pdf' : 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `playnation-report-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApproveVenue = async (venueId) => {
    const { error } = await supabase.from('venues').update({ is_approved: true }).eq('venue_id', venueId);
    if (error) {
      console.error('Error approving venue:', error);
    } else {
      fetchAdminDashboardData(); // Refetch all data
    }
  };

  const handleRejectVenue = async (venueId) => {
    const { error } = await supabase.from('venues').delete().eq('venue_id', venueId);
    if (error) {
      console.error('Error rejecting venue:', error);
    } else {
      fetchAdminDashboardData(); // Refetch all data
    }
  };

  // fetchAdminDashboardData remains unchanged from the previous version
  const fetchAdminDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Call our all-in-one function
      const { data, error: rpcError } = await supabase.rpc('get_admin_dashboard_all_data');
      if (rpcError) throw rpcError;
      
      if (!data) {
        throw new Error("Could not fetch admin stats. RPC returned empty.");
      }
      
      // Fetch pending venues (this is the only separate query, and it's fine)
      const { data: pendingVenuesData, error: pendingVenuesError } = await supabase
        .from('venues')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });
      if (pendingVenuesError) throw pendingVenuesError;
      setPendingVenuesList(pendingVenuesData);

      // Set all stats from our single RPC call
      setStats({
        ...data.stats, // Unpack all KPI stats
        pendingVenues: pendingVenuesData.length,
      });

      // Set chart data
      setChartData({
        bookingTrend: data.booking_trend,
        userRoleDistribution: data.user_roles,
      });

      // Set activity data
      setRecentActivity({
        recentUsers: data.recent_users,
        recentVenues: data.recent_venues,
        recentBookings: data.recent_bookings,
        topVenues: data.top_venues,
        topUsers: data.top_users,
      });

    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchAdminDashboardData();
  }, [fetchAdminDashboardData]);

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-white to-light-green-bg flex items-center justify-center">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md">
          <p className="text-red-600 font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-medium-text">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-white to-light-green-bg flex items-center justify-center">
        <p className="text-medium-text">No stats available.</p>
      </div>
    );
  }

  const COLORS = ['#10B981', '#059669', '#047857'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-light-green-bg/40">
      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-primary-green to-primary-green-dark rounded-full"></div>
              <h1 className="text-3xl sm:text-4xl font-bold text-dark-text">Admin Dashboard</h1>
            </div>
                        <DownloadDropdown onSelect={handleDownloadReport} isDownloading={isDownloading} />
          </div>
          <p className="text-medium-text ml-5">Monitor and manage your platform's performance</p>
        </div>

        {/* --- ALL FIXES ARE IN THIS SECTION --- */}
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <KpiCard 
            icon={<FaUsers />} 
            title="Total Users" 
            value={(stats.total_users || 0).toLocaleString()} 
            trend="+12%"
          />
          <KpiCard 
            icon={<FaBuilding />} 
            title="Total Venues" 
            value={(stats.total_venues || 0).toLocaleString()} 
            trend="+8%"
          />
          <KpiCard 
            icon={<FaCalendarCheck />} 
            title="Total Bookings" 
            value={(stats.total_bookings || 0).toLocaleString()} 
            trend="+15%"
          />
          <KpiCard 
            icon={<FaRupeeSign />} 
            title="Total Revenue" 
            value={`₹${(stats.total_revenue || 0).toLocaleString('en-IN')}`}
            trend="+24%"
          />
          <KpiCard 
            icon={<FaUserPlus />} 
            title="New Users (30d)" 
            value={(stats.new_users || 0).toLocaleString()}
            subtitle="Last 30 days"
          />
          <KpiCard 
            icon={<FaClock />} 
            title="Pending Venues" 
            value={(stats.pendingVenues || 0).toLocaleString()}
            subtitle="Awaiting approval"
          />
        </div>
        {/* --- END OF FIXES --- */}


        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SectionCard title="Booking Trends (30 Days)" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData?.bookingTrend}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="User Role Distribution">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie 
                  data={chartData?.userRoleDistribution} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelStyle={{ fontSize: '12px', fontWeight: '600' }}
                >
                  {chartData?.userRoleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SectionCard title="Top Venues">
            <div className="space-y-2">
              {recentActivity?.topVenues.map(venue => (
                <ActivityItem
                  key={venue.venue_id}
                  title={venue.name}
                  subtitle={`${venue.booking_count} bookings`}
                  icon={<FaBuilding className="text-sm" />}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Top Users">
            <div className="space-y-2">
              {recentActivity?.topUsers.map(user => (
                <ActivityItem
                  key={user.user_id}
                  title={user.username}
                  subtitle={`${user.booking_count} bookings`}
                  icon={<FaUsers className="text-sm" />}
                />
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Recent Bookings">
            <div className="space-y-2">
              {recentActivity?.recentBookings.map(booking => (
                <ActivityItem
                  key={booking.booking_id}
                  title={booking.venue_name}
                  subtitle={new Date(booking.start_time).toLocaleDateString()}
                  icon={<FaCalendarCheck className="text-sm" />}
                />
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Pending Venues Section */}
        <SectionCard title="Venues Pending Approval" className="lg:col-span-3">
          {pendingVenuesList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-light-green-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-3xl text-primary-green" />
              </div>
              <p className="text-medium-text font-medium">All venues approved! 🎉</p>
              <p className="text-sm text-light-text mt-1">No pending approvals at the moment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingVenuesList.map(venue => (
                <div 
                  key={venue.venue_id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border-color hover:border-primary-green/30 hover:bg-light-green-bg/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-green/20 to-primary-green/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaBuilding className="text-primary-green text-lg" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-dark-text truncate">{venue.name}</p>
                      <p className="text-sm text-medium-text truncate">{venue.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 sm:flex-shrink-0">
                    <button 
                      onClick={() => handleApproveVenue(venue.venue_id)} 
                      className="flex items-center gap-2 bg-gradient-to-r from-primary-green to-primary-green-dark text-white px-4 py-2.5 rounded-xl font-medium hover:shadow-lg hover:shadow-primary-green/30 hover:-translate-y-0.5 transition-all duration-200 flex-1 sm:flex-initial justify-center"
                    >
                      <FaCheckCircle />
                      <span>Approve</span>
                    </button>
                    <button 
                      onClick={() => handleRejectVenue(venue.venue_id)} 
                      className="flex items-center gap-2 bg-white border-2 border-red-500 text-red-500 px-4 py-2.5 rounded-xl font-medium hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 transition-all duration-200 flex-1 sm:flex-initial justify-center"
                    >
                      <FaTimesCircle />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

export default AdminDashboardPage;