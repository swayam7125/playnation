import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useVenues from "../hooks/useVenues";
import useSports from "../hooks/useSports";

// Components
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import FeaturedVenues from "../components/home/FeaturedVenues";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import Categories from "../components/home/Categories";
import HomePageSkeleton from "../components/skeletons/HomePageSkeleton";

export default function HomePage() {
  const topVenuesOptions = useMemo(
    () => ({
      limit: 4,
      sortBy: "rating",
    }),
    []
  );

  const { venues: topVenues, loading: venuesLoading, error: venuesError } =
    useVenues(topVenuesOptions);
  const { sports, loading: sportsLoading, error: sportsError } = useSports();

  const isLoading = venuesLoading || sportsLoading;
  const [showContent, setShowContent] = useState(false);

  // Add a slight delay (0.3s) between skeleton → content
  useEffect(() => {
    if (!isLoading) {
      const timeout = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timeout);
    } else {
      setShowContent(false);
    }
  }, [isLoading]);

  if (venuesError || sportsError) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500 font-semibold">
        Oops! Something went wrong while loading the data. Please try again.
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading && !showContent ? (
          // 🩶 Skeleton shown first
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <HomePageSkeleton />
          </motion.div>
        ) : (
          // ✅ Fade in the real content after a small delay
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Hero />
            <Categories categories={sports} />
            <HowItWorks />
            <FeaturedVenues venues={topVenues} />
            <WhyChooseUs />
            <Testimonials />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
