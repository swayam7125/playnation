import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import VenueCard from "../components/venues/VenueCard";
import useVenues from "../hooks/useVenues";
import Loader from "../components/common/Loader";
import FilterDropdown from "../components/common/FilterDropdown";

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

  // Note: Your useVenues hook now handles all filtering and sorting
  // so this line is correct.
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
    <div className="min-h-screen bg-background">
      {/* ... Hero Section (no changes) ... */}
      <div className="bg-gradient-to-br from-primary-green to-primary-green-dark text-white py-6 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Explore Amazing Venues
          </h1>
          <p className="text-sm text-green-200 mb-4 max-w-2xl mx-auto">
            Discover the perfect sports venues in your area
          </p>
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 px-4 pr-10 rounded-full border-0 text-dark-text text-sm shadow-md focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-light-text"
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

      <div className="container mx-auto px-4 py-4">
        {/* Filter Controls Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-10 md:grid-cols-4 gap-4 items-end">
            {/* Filter by Sports */}
            <div className="md:col-span-1 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Sports
              </label>
              <FilterDropdown
                options={sports.map((sport) => ({
                  id: sport.sport_id,
                  name: sport.name,
                }))}
                selectedValues={selectedSports}
                onChange={setSelectedSports}
                loading={sportsLoading}
                placeholder="Select Sports"
              />
            </div>

            {/* Filter by Amenities */}
            <div className="md:col-span-1 lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Amenities
              </label>
              <FilterDropdown
                options={amenities.map((amenity) => ({
                  id: amenity.amenity_id,
                  name: amenity.name,
                }))}
                selectedValues={selectedAmenities}
                onChange={setSelectedAmenities}
                loading={amenitiesLoading}
                placeholder="Select Amenities"
              />
            </div>
            <div className="md:col-span-1 lg:col-span-2"></div>
            {/* Sort Dropdown */}
            <div className="md:col-span-1 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="md:col-span-1 lg:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                View
              </label>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 px-4 py-2.5 ${
                    viewMode === "grid"
                      ? "bg-primary-green text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 px-4 py-2.5 ${
                    viewMode === "list"
                      ? "bg-primary-green text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <svg
                    className="w-5 h-5 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Compact Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="mt-3 pt-3 border-t border-border-color-light flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-medium-text">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
                  active
                </span>
                <span className="bg-primary-green text-white text-xs px-2 py-0.5 rounded-full">
                  {filteredAndSortedVenues.length}
                </span>
              </div>
              <button
                onClick={clearFilters}
                className="text-xs text-primary-green hover:text-primary-green-dark font-medium transition-colors duration-200"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* --- START FIX 2: Use the variables for conditional rendering --- */}

        {/* Use 'loading' (a boolean) */}
        {loading && <Loader text="Loading venues..." />}

        {/* Use 'error' (a string) */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <svg
              className="w-10 h-10 text-red-400 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-red-800 text-base font-semibold mb-1">
              Oops! Something went wrong
            </p>
            {/* 'error' is a string (e.g., error.message), so it's safe to render */}
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Use 'venues' (an array) */}
        {!loading && !error && filteredAndSortedVenues.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-light-text mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-lg font-semibold text-dark-text mb-1">
              No venues found
            </h3>
            <p className="text-medium-text text-sm mb-4">
              {searchTerm ||
              selectedSports.length > 0 ||
              selectedAmenities.length > 0
                ? "Try adjusting your filters or search terms"
                : "We couldn't find any venues at the moment"}
            </p>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="bg-primary-green text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary-green-dark transition-colors duration-200 shadow-md"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Use 'venues' (an array) */}
        {!loading && !error && filteredAndSortedVenues.length > 0 && (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                : "flex flex-col gap-4 max-w-4xl mx-auto"
            }
          >
            {/* Map over the 'venues' array */}
            {filteredAndSortedVenues.map((venue) => (
              <div
                key={venue.venue_id} // <-- BUGFIX: Use venue.venue_id
                className={
                  viewMode === "list"
                    ? "transform hover:scale-[1.01] transition-transform duration-200"
                    : ""
                }
              >
                <VenueCard venue={venue} viewMode={viewMode} />
              </div>
            ))}
          </div>
        )}
        {/* --- END FIX 2 --- */}
      </div>
    </div>
  );
}

export default ExplorePage;