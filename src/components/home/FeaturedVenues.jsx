import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import VenueCard from "../venues/VenueCard";
import FeaturedVenuesSkeleton from "../skeletons/FeaturedVenuesSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import useSkeletonLoader from "../../hooks/useSkeletonLoader";

const FeaturedVenues = ({ venues, loading, error }) => {
  const showContent = useSkeletonLoader(loading);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16">
          <div>
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              Featured Venues
            </h2>
            <p className="text-xl text-medium-text">
              Premium venues verified by our team
            </p>
          </div>
          <Link
            to="/explore"
            className="mt-4 sm:mt-0 text-primary-green font-semibold flex items-center gap-2 hover:gap-3 transition-all duration-300"
          >
            View All Venues
            <FaArrowRight />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {loading && !showContent ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <FeaturedVenuesSkeleton />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {error ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-xl text-red-500">Could not load venues.</p>
                  <p className="text-sm text-medium-text">
                    {error.message || error.toString()}
                  </p>
                </div>
              ) : venues.length > 0 ? (
                venues.map((venue) => (
                  <div
                    key={venue.venue_id}
                    className="transform hover:scale-105 transition-transform duration-300"
                  >
                    <VenueCard venue={venue} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="text-6xl text-border-color mb-4">🏟️</div>
                  <p className="text-xl text-medium-text">
                    No venues available at the moment.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FeaturedVenues;
