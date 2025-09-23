// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { supabase } from "../supabaseClient";
import heroImage from "../assets/images/hero/hero-img-1.svg";
import CategoryCard from "../components/home/CategoryCard/CategoryCard";
import VenueCard from "../components/venues/VenueCard";
import HeroOfferCarousel from "../components/offers/HeroOfferCarousel";
import { categories } from "../constants/categories";
import { FaSearch, FaCalendarAlt, FaPlay } from "react-icons/fa";

export default function HomePage() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [topVenues, setTopVenues] = useState([]);
  const [heroOffers, setHeroOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === "venue_owner") {
      navigate("/owner/dashboard");
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: venuesData, error: venuesError } = await supabase
          .from("venues")
          .select(
            `*, image_url,facilities (sports (name), facility_amenities ( amenities (name) ) )`
          )
          .eq("is_approved", true)
          .order("created_at", { ascending: false })
          .limit(4);
        if (venuesError) throw venuesError;
        setTopVenues(venuesData);

        // --- QUERY UPDATED FOR ACTIVE OFFERS ---
        const today = new Date().toISOString();
        const { data: heroOffersData, error: heroOffersError } = await supabase
          .from("offers")
          .select("*")
          .eq("is_global", true)
          .not("offer_code", "is", null)
          .lte("valid_from", today) // Offer must have started
          .or(`valid_until.is.null,valid_until.gte.${today}`) // and either has no end date or hasn't ended yet
          .order("created_at", { ascending: false })
          .limit(5);

        if (heroOffersError) {
          throw heroOffersError;
        }
        setHeroOffers(heroOffersData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!profile || profile?.role !== "venue_owner") {
      fetchData();
    }
  }, [profile]);

  if (profile?.role === "venue_owner") {
    return <p className="container mx-auto text-center p-12">Redirecting...</p>;
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-12 mb-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 min-h-[450px]">
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl font-extrabold leading-tight text-dark-text">
              PlayNation: Book sports slots in seconds
            </h1>
            <p className="text-lg text-light-text font-normal leading-relaxed">
              Real-time availability across turfs and tables near you. No calls.
              No waiting. Just play.
            </p>
            <div className="flex gap-4 my-4">
              <Link
                to="/explore"
                className="py-3 px-6 rounded-lg font-semibold text-sm cursor-pointer transition duration-300 inline-flex items-center justify-center gap-2 no-underline whitespace-nowrap bg-primary-green text-white shadow-sm hover:bg-primary-green-dark hover:-translate-y-px hover:shadow-md"
              >
                Let's go!!
              </Link>
            </div>
          </div>
          <div className="w-full h-auto max-w-2xl">
            <img
              src={heroImage}
              alt="Collage of sports venues"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* Dynamic Hero Offer Carousel */}
        {!loading && heroOffers.length > 0 && (
          <HeroOfferCarousel offers={heroOffers} />
        )}

        {/* Popular Categories Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-dark-text relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-primary-green after:rounded-sm">
            Popular categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* Top Venues Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-dark-text relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-primary-green after:rounded-sm">
            Top Venues
          </h2>
          {loading ? (
            <p>Loading top venues...</p>
          ) : (
            // Updated container to hide the scrollbar
            <div className="flex flex-nowrap overflow-x-auto gap-6 pb-4 scrollbar-hide">
              {topVenues.length > 0 ? (
                topVenues.map((venue) => (
                  <VenueCard key={venue.venue_id} venue={venue} />
                ))
              ) : (
                <p>No venues available at the moment.</p>
              )}
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-dark-text text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-light-green-bg p-4 rounded-full mb-4">
                <FaSearch className="text-primary-green text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-dark-text mb-2">
                1. Discover
              </h3>
              <p className="text-light-text">
                Find the best sports venues near you.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-light-green-bg p-4 rounded-full mb-4">
                <FaCalendarAlt className="text-primary-green text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-dark-text mb-2">
                2. Book
              </h3>
              <p className="text-light-text">
                Select your preferred time slot and book instantly.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-light-green-bg p-4 rounded-full mb-4">
                <FaPlay className="text-primary-green text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-dark-text mb-2">
                3. Play
              </h3>
              <p className="text-light-text">
                Arrive at the venue and enjoy your game.
              </p>
            </div>
          </div>
        </section>

        {/* CTA for Venue Owners */}
        <section className="mb-20 bg-light-green-bg rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-dark-text mb-4">
            Are you a Venue Owner?
          </h2>
          <p className="text-medium-text mb-6">
            Join PlayNation and reach a wider audience of sports enthusiasts.
          </p>
          <Link
            to="/signup"
            className="py-3 px-6 rounded-lg font-semibold text-sm cursor-pointer transition duration-300 inline-flex items-center justify-center gap-2 no-underline whitespace-nowrap bg-primary-green text-white shadow-sm hover:bg-primary-green-dark hover:-translate-y-px hover:shadow-md"
          >
            List Your Venue
          </Link>
        </section>
      </div>
    </div>
  );
}
