import React, { Suspense, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import useVenues from "../hooks/useVenues";

const Hero = React.lazy(() => import("../components/home/Hero"));
const HowItWorks = React.lazy(() => import("../components/home/HowItWorks"));
const FeaturedVenues = React.lazy(() => import("../components/home/FeaturedVenues"));
const WhyChooseUs = React.lazy(() => import("../components/home/WhyChooseUs"));
const Testimonials = React.lazy(() => import("../components/home/Testimonials"));
const Categories = React.lazy(() => import("../components/home/Categories"));

const Loading = () => <div className="h-96 bg-gray-200 animate-pulse"></div>;

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
      <Suspense fallback={<Loading />}>
        <Hero />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <Categories categories={sports} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <FeaturedVenues venues={topVenues} loading={loading} error={error} />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<Loading />}>
        <Testimonials />
      </Suspense>
    </div>
  );
}