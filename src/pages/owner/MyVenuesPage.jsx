import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import OwnerVenueCard from '../../components/venues/OwnerVenueCard';

function MyVenuesPage() {
  const { user } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchOwnerVenues = async () => {
      if (!user) { setLoading(false); return; }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('venues')
          .select(`*, facilities (*, sports (name), facility_amenities (amenities (name)))`)
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setVenues(data || []);
      } catch (error) {
        console.error("Error fetching owner venues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerVenues();
  }, [user]);

  const filteredVenues = venues.filter(venue => {
    if (activeTab === 'all') return true;
    if (activeTab === 'approved') return venue.is_approved;
    if (activeTab === 'pending') return !venue.is_approved && !venue.rejection_reason;
    if (activeTab === 'rejected') return !!venue.rejection_reason;
    return false;
  });

  const tabData = [
    { key: 'all', label: 'All Venues', count: venues.length, color: 'text-primary-green', bg: 'bg-primary-green/5' },
    { key: 'pending', label: 'Pending', count: venues.filter(v => !v.is_approved && !v.rejection_reason).length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { key: 'approved', label: 'Active', count: venues.filter(v => v.is_approved).length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { key: 'rejected', label: 'Review', count: venues.filter(v => !!v.rejection_reason).length, color: 'text-red-600', bg: 'bg-red-50' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-light-green-bg/30">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* Elegant Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-green to-primary-green-dark rounded-2xl shadow-xl mb-8">
          <div className="absolute inset-0 bg-black/5"></div>
          <div className="relative px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">My Venues</h1>
                  <p className="text-white/80 text-sm">Professional venue management</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link 
                  to="/owner/add-venue" 
                  className="group bg-white text-primary-green px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/95 transition-all duration-200 no-underline flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Venue</span>
                </Link>
                
                <Link to="/owner/dashboard" className="bg-white/10 backdrop-blur text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/20 transition-all duration-200 border border-white/20">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics
                </Link>
              </div>
            </div>
            
            {/* Refined Stats Cards */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              {tabData.map((tab, index) => (
                <div key={tab.key} className="bg-white/15 backdrop-blur rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200 group cursor-pointer" onClick={() => setActiveTab(tab.key)}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white/70 text-xs font-medium uppercase tracking-wide">{tab.label}</p>
                      <p className="text-white text-xl font-bold mt-1">{tab.count}</p>
                    </div>
                    <div className={`w-2 h-8 rounded-full ${activeTab === tab.key ? 'bg-white' : 'bg-white/30 group-hover:bg-white/50'} transition-colors duration-200`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sophisticated Filter Tabs */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 bg-white/80 backdrop-blur rounded-2xl p-2 border border-border-color/50 shadow-lg">
            {tabData.map(tab => (
              <button 
                key={tab.key} 
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex-1 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 group ${
                  activeTab === tab.key 
                    ? 'bg-primary-green text-white shadow-lg transform scale-[1.02]' 
                    : 'text-medium-text hover:text-dark-text hover:bg-white/70'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>{tab.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-primary-green/10 text-primary-green'
                  }`}>
                    {tab.count}
                  </span>
                </div>
                {activeTab === tab.key && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white/50 backdrop-blur rounded-2xl border border-border-color/50">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-green/30 border-t-primary-green"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary-green/10"></div>
            </div>
            <p className="text-medium-text font-medium mt-4">Loading your venues...</p>
            <p className="text-light-text text-sm">Please wait</p>
          </div>
        ) : filteredVenues.length > 0 ? (
          <div>
            {/* Results Bar */}
            <div className="flex items-center justify-between mb-6 bg-white/60 backdrop-blur rounded-xl px-6 py-4 border border-border-color/50">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-bold text-dark-text">
                  {tabData.find(tab => tab.key === activeTab)?.label}
                </h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary-green rounded-full animate-pulse"></div>
                  <span className="text-sm text-medium-text font-medium">
                    {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/70 border border-border-color/50 rounded-lg text-sm font-medium text-medium-text hover:bg-white hover:shadow-md transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  <span>Filter</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-white/70 border border-border-color/50 rounded-lg text-sm font-medium text-medium-text hover:bg-white hover:shadow-md transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  <span>Sort</span>
                </button>
              </div>
            </div>
            
            {/* Venues Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVenues.map(venue => (
                <div key={venue.venue_id} className="transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl">
                  <OwnerVenueCard venue={venue} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Elegant Empty State */
          <div className="text-center py-16 bg-gradient-to-br from-white/80 to-light-green-bg/50 backdrop-blur rounded-2xl border border-border-color/50">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-green/10 to-primary-green-light/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur">
                <svg className="w-10 h-10 text-primary-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-dark-text mb-3">
                {activeTab === 'all' ? 'Ready to add your first venue?' : `No ${tabData.find(tab => tab.key === activeTab)?.label.toLowerCase()} venues`}
              </h3>
              <p className="text-medium-text mb-6 leading-relaxed">
                {activeTab === 'all' 
                  ? "Start building your sports venue portfolio and connect with athletes in your area." 
                  : `Your ${tabData.find(tab => tab.key === activeTab)?.label.toLowerCase()} venues will appear here.`
                }
              </p>
              {activeTab === 'all' && (
                <Link 
                  to="/owner/add-venue" 
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-green to-primary-green-dark text-white px-8 py-3 rounded-xl font-semibold hover:from-primary-green-dark hover:to-primary-green transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 no-underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Your First Venue</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyVenuesPage;