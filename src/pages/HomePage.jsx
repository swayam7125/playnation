import React, { Suspense, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import useVenues from "../hooks/useVenues";
import Loader from "../components/common/Loader";

const Hero = React.lazy(() => import("../components/home/Hero"));
const HowItWorks = React.lazy(() => import("../components/home/HowItWorks"));
const FeaturedVenues = React.lazy(() => import("../components/home/FeaturedVenues"));
const WhyChooseUs = React.lazy(() => import("../components/home/WhyChooseUs"));
const Testimonials = React.lazy(() => import("../components/home/Testimonials"));
const Categories = React.lazy(() => import("../components/home/Categories"));

export default function HomePage() {
  const { venues: topVenues, loading, error } = useVenues({
    limit: 4,
    sortBy: "rating",
  });

  const [sports, setSports] = useState([]);

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
      }
    };
    fetchSports();
  }, []);

  return (
    <div className="bg-background">
      <Suspense fallback={<Loader />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <Categories categories={sports} />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <FeaturedVenues venues={topVenues} loading={loading} error={error} />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<Loader />}>
        <Testimonials />
      </Suspense>
    </div>
  );
}