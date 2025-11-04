import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import VenueCard from "../components/venues/VenueCard";
import useVenues from "../hooks/useVenues";
import Loader from "../components/common/Loader";
import FilterDropdown from "../components/common/FilterDropdown";
import SegmentedControl from "../components/common/SegmentedControl";

function ExplorePage() {
  const [sports, setSports] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sportsLoading, setSportsLoading] = useState(true);
  const [amenities, setAmenities] = useState([]);
  const [amenitiesLoading, setAmenitiesLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sportId = searchParams.get("sportId");
    if (sportId) {
      setSelectedSports([sportId]);
    }
  }, [searchParams]);

  // Get venues with filters
  const { venues, loading, error } = useVenues({
    selectedSports,
    selectedAmenities,
    searchTerm,
    sortBy,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sports
        const { data: sportsData, error: sportsError } = await supabase
          .from("sports")
          .select("*");
        if (sportsError) throw sportsError;
        setSports(sportsData || []);
        
        // Fetch amenities
        const { data: amenitiesData, error: amenitiesError } = await supabase
          .from("amenities")
          .select("*");
        if (amenitiesError) throw amenitiesError;
        setAmenities(amenitiesData || []);
      } catch (err) {
        console.error("Error fetching data:", err.message);
      } finally {
        setSportsLoading(false);
        setAmenitiesLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAndSortedVenues = venues;

  const clearFilters = () => {
    setSelectedSports([]);
    setSelectedAmenities([]);
    setSearchTerm("");
    setSortBy("name");
  };

  const activeFiltersCount = [
    selectedSports.length > 0,
    selectedAmenities.length > 0,
    searchTerm.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-br from-primary-green to-green-600 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-2">
            Explore Amazing Venues
          </h1>
          <p className="text-lg text-green-200 mb-6 max-w-2xl mx-auto">
            Discover and book the perfect sports venues in your area.
          </p>
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search by venue name, sport, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 px-6 pr-12 rounded-full border-0 text-gray-800 text-base shadow-lg focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-6 h-6 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FilterDropdown
              options={sports.map((sport) => ({
                id: sport.sport_id,
                name: sport.name,
              }))}
              selectedValues={selectedSports}
              onChange={setSelectedSports}
              loading={sportsLoading}
              placeholder="Filter by Sports"
            />
            <FilterDropdown
              options={amenities.map((amenity) => ({
                id: amenity.amenity_id,
                name: amenity.name,
              }))}
              selectedValues={selectedAmenities}
              onChange={setSelectedAmenities}
              loading={amenitiesLoading}
              placeholder="Filter by Amenities"
            />
            <div className="flex items-center justify-between gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
              </select>
              <SegmentedControl
                options={[
                  { value: "grid", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
                  { value: "list", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
                ]}
                value={viewMode}
                onChange={setViewMode}
              />
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
                </span>
                <span className="bg-primary-green text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {filteredAndSortedVenues.length} results
                </span>
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-green hover:text-primary-green-dark font-semibold transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {loading && <Loader text="Loading venues..." />}

        {error && (
          <div className="bg-red-100 border border-red-300 rounded-2xl p-8 text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-red-800 text-xl font-semibold mb-2">
              Oops! Something went wrong
            </p>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && filteredAndSortedVenues.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              No venues found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedSports.length > 0 || selectedAmenities.length > 0
                ? "Try adjusting your filters or search terms"
                : "We couldn't find any venues at the moment"}
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="bg-primary-green text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-green-dark transition-colors duration-300 shadow-lg transform hover:-translate-y-0.5"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && filteredAndSortedVenues.length > 0 && (
          <div
            className={viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "flex flex-col gap-6 max-w-4xl mx-auto"}>
            {filteredAndSortedVenues.map((venue) => (
              <div key={venue.venue_id} className="transition-transform duration-300 ease-in-out hover:scale-105">
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