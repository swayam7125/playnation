import React, { useMemo } from "react";
import useVenues from "../hooks/useVenues";
import useSports from "../hooks/useSports";
import Loader from "../components/common/Loader";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import FeaturedVenues from "../components/home/FeaturedVenues";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Testimonials from "../components/home/Testimonials";
import Categories from "../components/home/Categories";

export default function HomePage() {
  const topVenuesOptions = useMemo(() => ({
    limit: 4,
    sortBy: "rating",
  }), []);

  const { venues: topVenues, loading, error } = useVenues(topVenuesOptions);

  const { sports, loading: sportsLoading, error: sportsError } = useSports();

  return (
    <div className="bg-background">
      <Hero />
      <Categories categories={sports} />
      <HowItWorks />
      <FeaturedVenues venues={topVenues} loading={loading} error={error} />
      <WhyChooseUs />
      <Testimonials />
    </div>
  );
}