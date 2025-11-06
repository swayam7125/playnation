import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../supabaseClient";
import VenueCard from "../components/venues/VenueCard";
import useVenues from "../hooks/useVenues";
import FilterDropdown from "../components/common/FilterDropdown";
import SegmentedControl from "../components/common/SegmentedControl";
import ExploreSkeleton from "../components/skeletons/ExploreSkeleton";

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
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sportId = searchParams.get("sportId");
    if (sportId) setSelectedSports([sportId]);
  }, [searchParams]);

  const { venues, loading: venuesLoading, error } = useVenues({
    selectedSports,
    selectedAmenities,
    searchTerm,
    sortBy,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sportsData, error: sportsError } = await supabase
          .from("sports")
          .select("*");
        if (sportsError) throw sportsError;
        setSports(sportsData || []);

        const { data: amenitiesData, error: amenitiesError } = await supabase
          .from("amenities")
          .select("*");
        if (amenitiesError) throw amenitiesError;
        setAmenities(amenitiesData || []);
      } catch (err) {
        console.error("Error fetching filters:", err.message);
      } finally {
        setSportsLoading(false);
        setAmenitiesLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredVenues = venues;
  const isLoading = venuesLoading || sportsLoading || amenitiesLoading;

  // 🎬 Handle smooth transition delay
  const [showContent, setShowContent] = useState(false);
  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timeout);
    } else {
      setShowContent(false);
    }
  }, [isLoading]);

  const clearFilters = () => {
    setSelectedSports([]);
    setSelectedAmenities([]);
    setSearchTerm("");
    setSortBy("name");
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-600 font-semibold">
        Oops! Something went wrong while loading venues. Please try again.
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading && !showContent ? (
          // 🩶 Skeleton State
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ExploreSkeleton />
          </motion.div>
        ) : (
          // ✅ Real Page Content (Fades In)
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-green to-green-600 text-white py-12 px-4">
              <div className="container mx-auto text-center">
                <h1 className="text-4xl font-bold mb-2">Explore Amazing Venues</h1>
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
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <svg
                      className="w-6 h-6"
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

            {/* Filters Section */}
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
                    placeholder="Filter by Sports"
                  />
                  <FilterDropdown
                    options={amenities.map((amenity) => ({
                      id: amenity.amenity_id,
                      name: amenity.name,
                    }))}
                    selectedValues={selectedAmenities}
                    onChange={setSelectedAmenities}
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
                        {
                          value: "grid",
                          icon: (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h4v4H4V6zM10 6h4v4h-4V6zM16 6h4v4h-4V6zM4 12h4v4H4v-4zM10 12h4v4h-4v-4zM16 12h4v4h-4v-4z"
                              />
                            </svg>
                          ),
                        },
                        {
                          value: "list",
                          icon: (
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                              />
                            </svg>
                          ),
                        },
                      ]}
                      value={viewMode}
                      onChange={setViewMode}
                    />
                  </div>
                </div>
              </div>

              {/* Venues Grid */}
              {filteredVenues.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                      : "flex flex-col gap-6 max-w-4xl mx-auto"
                  }
                >
                  {filteredVenues.map((venue) => (
                    <div
                      key={venue.venue_id}
                      className="transition-transform duration-300 hover:scale-105"
                    >
                      <VenueCard venue={venue} viewMode={viewMode} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-gray-600">
                  No venues found. Try adjusting your filters.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ExplorePage;
