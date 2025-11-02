import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import VenueCard from "../components/venues/VenueCard";
import useVenues from "../hooks/useVenues"; // Make sure this is imported

function ExplorePage() {
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState("all");
  const [sportsLoading, setSportsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sportId = searchParams.get("sportId");
    if (sportId) {
      setSelectedSport(sportId);
    }
  }, [searchParams]);

  // --- START FIX 1: Destructure the hook's return value ---
  const { venues, loading, error } = useVenues({
    selectedSport: selectedSport,
    searchTerm: searchTerm,
    sortBy: sortBy,
  });
  // --- END FIX 1 ---

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const { data: sportsData, error: sportsError } = await supabase
          .from("sports")
          .select("*");
        if (sportsError) throw sportsError;
        setSports(sportsData || []);
      } catch (err) {
        console.error("Error fetching sports:", err.message);
      } finally {
        setSportsLoading(false);
      }
    };
    fetchSports();
  }, []);

  // Note: Your useVenues hook now handles all filtering and sorting
  // so this line is correct.
  const filteredAndSortedVenues = venues;

  const clearFilters = () => {
    setSelectedSport("all");
    setSearchTerm("");
    setSortBy("name");
  };

  const activeFiltersCount = [
    selectedSport !== "all",
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
        {/* ... Filters and Controls (no changes) ... */}
        <div className="bg-card-bg rounded-xl shadow-md p-4 mb-4 border border-border-color-light">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Sport Filter */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-dark-text mb-2">
                Filter by Sport
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedSport("all")}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    selectedSport === "all"
                      ? "bg-primary-green text-white shadow-sm"
                      : "bg-light-green-bg text-primary-green border border-primary-green/20 hover:bg-primary-green hover:text-white"
                  }`}
                >
                  All Sports
                </button>
                {!sportsLoading &&
                  sports.map((sport) => (
                    <button
                      key={sport.sport_id}
                      onClick={() => setSelectedSport(String(sport.sport_id))}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        selectedSport === String(sport.sport_id)
                          ? "bg-primary-green text-white shadow-sm"
                          : "bg-light-green-bg text-primary-green border border-primary-green/20 hover:bg-primary-green hover:text-white"
                      }`}
                    >
                      {sport.name}
                    </button>
                  ))}
              </div>
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-dark-text mb-1.5">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 text-sm border border-border-color rounded-lg text-dark-text bg-card-bg focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="rating">
                    Rating
                  </option>
                  <option value="price">
                    Price
                  </option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div>
                <label className="block text-xs font-semibold text-dark-text mb-1.5">
                  View
                </label>
                <div className="flex border border-border-color rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-2.5 py-1.5 ${
                      viewMode === "grid"
                        ? "bg-primary-green text-white"
                        : "bg-card-bg text-medium-text hover:bg-hover-bg"
                    } transition-colors duration-200`}
                  >
                    <svg
                      className="w-4 h-4"
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
                    className={`px-2.5 py-1.5 ${
                      viewMode === "list"
                        ? "bg-primary-green text-white"
                        : "bg-card-bg text-medium-text hover:bg-hover-bg"
                    } transition-colors duration-200`}
                  >
                    <svg
                      className="w-4 h-4"
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
          </div>

          {/* Compact Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="mt-3 pt-3 border-t border-border-color-light flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-medium-text">
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} active
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
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary-green mb-3"></div>
            <p className="text-medium-text text-sm">Loading venues...</p>
          </div>
        )}

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
              {searchTerm || selectedSport !== "all"
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