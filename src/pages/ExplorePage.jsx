import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import VenueCard from '../components/venues/VenueCard';
import useVenues from '../hooks/useVenues';

function ExplorePage() {
  const { venues, loading, error } = useVenues();
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [sportsLoading, setSportsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const { data: sportsData, error: sportsError } = await supabase
          .from('sports')
          .select('*');
        if (sportsError) throw sportsError;
        setSports(sportsData);
      } catch (err) {
        console.error("Error fetching sports:", err.message);
      } finally {
        setSportsLoading(false);
      }
    };
    fetchSports();
  }, []);

  // Enhanced filtering and sorting logic
  const filteredAndSortedVenues = React.useMemo(() => {
    let filtered = venues;

    // Filter by sport
    if (selectedSport !== 'all') {
      filtered = filtered.filter(venue => 
        venue.facilities?.some(facility => facility.sport_id === selectedSport)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(venue =>
        venue.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort venues
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'price':
          return (a.price_per_hour || 0) - (b.price_per_hour || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [venues, selectedSport, searchTerm, sortBy]);

  const clearFilters = () => {
    setSelectedSport('all');
    setSearchTerm('');
    setSortBy('name');
  };

  const activeFiltersCount = [
    selectedSport !== 'all',
    searchTerm.length > 0,
    sortBy !== 'name'
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-green to-primary-green-dark text-white py-10 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Explore Amazing Venues
          </h1>
          <p className="text-lg text-primary-green-light mb-6 max-w-2xl mx-auto">
            Discover the perfect sports venues in your area. Filter by sport, location, and more to find your ideal playing ground.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search venues by name, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 px-6 pr-12 rounded-full border-0 text-dark-text text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 transition-all duration-300"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-6 h-6 text-light-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Controls */}
        <div className="bg-card-bg rounded-2xl shadow-lg p-6 mb-8 border border-border-color-light">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Sport Filter */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-dark-text mb-3">Filter by Sport</label>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSelectedSport('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedSport === 'all' 
                      ? 'bg-primary-green text-white shadow-md' 
                      : 'bg-light-green-bg text-primary-green border border-primary-green/20 hover:bg-primary-green hover:text-white hover:shadow-md'
                  }`}
                >
                  All Sports
                </button>
                {!sportsLoading && sports.map(sport => (
                  <button 
                    key={sport.sport_id} 
                    onClick={() => setSelectedSport(sport.sport_id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedSport === sport.sport_id 
                        ? 'bg-primary-green text-white shadow-md' 
                        : 'bg-light-green-bg text-primary-green border border-primary-green/20 hover:bg-primary-green hover:text-white hover:shadow-md'
                    }`}
                  >
                    {sport.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-dark-text mb-2">Sort by</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-border-color rounded-lg text-dark-text bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="price">Price</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div>
                <label className="block text-sm font-semibold text-dark-text mb-2">View</label>
                <div className="flex border border-border-color rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 ${
                      viewMode === 'grid' 
                        ? 'bg-primary-green text-white' 
                        : 'bg-card-bg text-medium-text hover:bg-hover-bg'
                    } transition-colors duration-200`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 ${
                      viewMode === 'list' 
                        ? 'bg-primary-green text-white' 
                        : 'bg-card-bg text-medium-text hover:bg-hover-bg'
                    } transition-colors duration-200`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 pt-4 border-t border-border-color-light flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-medium-text">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                </span>
                <span className="bg-primary-green text-white text-xs px-2 py-1 rounded-full">
                  {filteredAndSortedVenues.length} result{filteredAndSortedVenues.length !== 1 ? 's' : ''}
                </span>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-green hover:text-primary-green-dark font-medium transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-green mb-4"></div>
            <p className="text-medium-text text-lg">Loading amazing venues...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 text-lg font-semibold mb-2">Oops! Something went wrong</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && filteredAndSortedVenues.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-light-text mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-dark-text mb-2">No venues found</h3>
            <p className="text-medium-text mb-6">
              {searchTerm || selectedSport !== 'all' 
                ? "Try adjusting your filters or search terms to discover more venues."
                : "We couldn't find any venues at the moment."
              }
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="bg-primary-green text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-green-dark transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && filteredAndSortedVenues.length > 0 && (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredAndSortedVenues.map(venue => (
              <div 
                key={venue.venue_id}
                className={viewMode === 'list' ? 'transform hover:scale-[1.02] transition-transform duration-200' : ''}
              >
                <VenueCard venue={venue} viewMode={viewMode} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExplorePage;