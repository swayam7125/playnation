import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { FaChartLine, FaRegCalendar, FaChevronDown, FaRupeeSign } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO, subDays } from 'date-fns';

function OwnerReportsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportTimeframe, setReportTimeframe] = useState('weekly');
  const [revenueTrendData, setRevenueTrendData] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState("all");
  const [allRevenueData, setAllRevenueData] = useState([]);

  const fetchRevenueTrend = useCallback(async (timeframe) => {
    if (!user) return;

    let daysToTrack;
    let formatLabel;

    switch (timeframe) {
      case 'weekly':
        daysToTrack = 7;
        formatLabel = (dateStr) => format(parseISO(dateStr), 'EEE, MMM d');
        break;
      case 'monthly':
        daysToTrack = 30;
        formatLabel = (dateStr) => format(parseISO(dateStr), 'MMM d');
        break;
      default:
        // Default to monthly if an unexpected value is somehow passed
        daysToTrack = 30;
        formatLabel = (dateStr) => format(parseISO(dateStr), 'MMM d');
        break;
    }

    setLoading(true);
    setError(null);
    try {
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('venue_id, name')
        .eq('owner_id', user.id)
        .eq('is_approved', true);

      if (venuesError) throw venuesError;
      setVenues(venuesData || []);

      // Use the existing PostgreSQL function to fetch metrics for the period
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_owner_dashboard_statistics', { days_to_track: daysToTrack });

      if (statsError) throw statsError;

      if (statsData?.[0]?.revenue_trend) {
        // Transform and enrich the data for the chart
        const trend = statsData[0].revenue_trend.map(item => ({
          ...item,
          name: formatLabel(item.date),
          Revenue: item.revenue // Key for Recharts
        }));
        setAllRevenueData(trend);
      } else {
        setAllRevenueData([]);
      }

    } catch (e) {
      console.error(`Error fetching ${timeframe} revenue trend:`, e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRevenueTrend(reportTimeframe);
  }, [reportTimeframe, fetchRevenueTrend]);

  useEffect(() => {
    if (selectedVenue === "all") {
      setRevenueTrendData(allRevenueData);
      const periodTotal = allRevenueData.reduce((sum, item) => sum + item.Revenue, 0);
      setTotalRevenue(periodTotal);
    } else {
      const filteredData = allRevenueData.filter(item => item.venue_id === selectedVenue);
      setRevenueTrendData(filteredData);
      const periodTotal = filteredData.reduce((sum, item) => sum + item.Revenue, 0);
      setTotalRevenue(periodTotal);
    }
  }, [selectedVenue, allRevenueData]);

  const getChartTitle = useMemo(() => {
    return reportTimeframe === 'weekly' 
      ? 'Revenue Trend: Last 7 Days'
      : 'Revenue Trend: Last 30 Days';
  }, [reportTimeframe]);

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
  
  // Loading and Error UI are kept lean on the reports page
  if (loading && totalRevenue === 0) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-medium-text font-medium">Loading Revenue Reports...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8 bg-card-bg rounded-2xl border border-border-color shadow-lg max-w-md">
        <h3 className="text-xl font-semibold text-dark-text mb-2">Error Loading Report</h3>
        <p className="text-red-600">{error}</p>
        <button 
          onClick={() => fetchRevenueTrend(reportTimeframe)}
          className="mt-4 px-6 py-2 bg-primary-green text-white rounded-xl hover:bg-primary-green-dark transition-colors"
        >
          Retry
        </button>
      </div>
    </div>
  );

  const COLORS = ["#10B981", "#059669", "#047857", "#065F46", "#064E3B", "#034E3B"]; // Retaining colors from Dashboard

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <h1 className="text-3xl font-bold text-dark-text mb-2 flex items-center gap-3">
            <FaChartLine className="text-primary-green"/> Revenue Reports
        </h1>
        <p className="text-medium-text mb-8">Analyze your venue's performance over longer periods.</p>

        {/* Control & Summary */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl mb-8">
             {/* Summary Card */}
             <div className="flex-1 min-w-[200px] mb-4 md:mb-0">
                <p className="text-sm text-light-text uppercase font-semibold">Total Revenue ({reportTimeframe.charAt(0).toUpperCase() + reportTimeframe.slice(1)})</p>
                <p className="text-4xl font-bold text-primary-green flex items-center">
                    <FaRupeeSign className="text-2xl mr-2"/>
                    {totalRevenue.toLocaleString("en-IN")}
                </p>
             </div>
             
             <div className="flex items-center">
               {/* Timeframe Selector */}
               <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border border-border-color text-sm font-semibold text-dark-text hover:bg-hover-bg transition-colors"
                  >
                    <FaRegCalendar className="w-4 h-4 text-primary-green" />
                    <span>{reportTimeframe.charAt(0).toUpperCase() + reportTimeframe.slice(1)} Report</span>
                    <FaChevronDown className={`w-3 h-3 text-medium-text transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-border-color rounded-lg shadow-xl z-10">
                      {/* Daily/Hourly removed as this page is for long-term reports */}
                      <button 
                        onClick={() => { setReportTimeframe('weekly'); setIsMenuOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm ${reportTimeframe === 'weekly' ? 'bg-primary-green text-white' : 'text-dark-text hover:bg-hover-bg'}`}
                      >
                        Weekly (Last 7 Days)
                      </button>
                      <button 
                        onClick={() => { setReportTimeframe('monthly'); setIsMenuOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm ${reportTimeframe === 'monthly' ? 'bg-primary-green text-white' : 'text-dark-text hover:bg-hover-bg'}`}
                      >
                        Monthly (Last 30 Days)
                      </button>
                    </div>
                  )}
               </div>

               {/* Venue Selector */}
               <div className="relative ml-4">
                  <select
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                    className="appearance-none w-full md:w-auto flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border border-border-color text-sm font-semibold text-dark-text hover:bg-hover-bg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-green"
                  >
                    <option value="all">All Venues</option>
                    {venues.map((venue) => (
                      <option key={venue.venue_id} value={venue.venue_id}>
                        {venue.name}
                      </option>
                    ))}
                  </select>
               </div>
             </div>
        </div>

        {/* Revenue Trend Chart */}
        <div className="bg-white/80 backdrop-blur border border-border-color/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-dark-text mb-6">{getChartTitle}</h3>
            {revenueTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} padding={{ left: 20, right: 20 }} />
                  <YAxis stroke="#6B7280" fontSize={12} domain={['auto', 'auto']} tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="Revenue" 
                    stroke="#10B981" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    strokeWidth={3}
                    name="Daily Revenue"
                    unit="₹"
                    activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center text-medium-text">
                <FaChartLine className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <p className="font-medium">No sufficient data for the {reportTimeframe} report.</p>
                <p className="text-sm text-light-text">Check back after more confirmed bookings have occurred.</p>
              </div>
            )}
        </div>
        
      </div>
    </div>
  );
}

export default OwnerReportsPage;
