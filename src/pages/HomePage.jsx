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
import { 
  FaSearch, 
  FaCalendarAlt, 
  FaPlay, 
  FaArrowRight, 
  FaStar, 
  FaMapMarkerAlt,
  FaUsers,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaQuoteLeft
} from "react-icons/fa";

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

        const today = new Date().toISOString();
        const { data: heroOffersData, error: heroOffersError } = await supabase
          .from("offers")
          .select("*")
          .eq("is_global", true)
          .not("offer_code", "is", null)
          .lte("valid_from", today)
          .or(`valid_until.is.null,valid_until.gte.${today}`)
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-medium-text font-medium">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: FaShieldAlt,
      title: "Verified Venues",
      description: "All venues are verified and maintain high quality standards"
    },
    {
      icon: FaClock,
      title: "Real-time Booking",
      description: "Instant booking confirmation with live availability updates"
    },
    {
      icon: FaUsers,
      title: "Community Driven",
      description: "Connect with fellow sports enthusiasts in your area"
    }
  ];

  const stats = [
    { number: "1000+", label: "Active Venues" },
    { number: "50K+", label: "Happy Players" },
    { number: "100K+", label: "Bookings Made" },
    { number: "25+", label: "Sports Available" }
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Cricket Enthusiast",
      content: "PlayNation made booking our weekly cricket matches so much easier. No more calling around!",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "Badminton Player",
      content: "Love how I can see real-time availability and book instantly. The app is super user-friendly.",
      rating: 5
    },
    {
      name: "Amit Kumar",
      role: "Football Coach",
      content: "Managing team bookings has never been simpler. PlayNation is a game-changer for sports communities.",
      rating: 5
    }
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-green/5 to-primary-green-light/10"></div>
        
        <div className="container mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 min-h-[600px] py-16">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-light-green-bg px-4 py-2 rounded-full text-primary-green font-medium text-sm">
                  <FaCheckCircle className="w-4 h-4" />
                  India's #1 Sports Booking Platform
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-dark-text">
                  Book Sports Slots in
                  <span className="text-primary-green block">Seconds</span>
                </h1>
                
                <p className="text-xl text-medium-text leading-relaxed max-w-lg">
                  Real-time availability across turfs and tables near you. No calls, no waiting, just play.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/explore"
                  className="group bg-primary-green text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:bg-primary-green-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3"
                >
                  Start Playing
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                
                <Link
                  to="/how-it-works"
                  className="bg-card-bg text-dark-text px-8 py-4 rounded-xl font-semibold text-lg border-2 border-border-color hover:border-primary-green transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-lg"
                >
                  <FaPlay className="text-primary-green" />
                  How It Works
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-8 pt-8">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary-green">{stat.number}</div>
                    <div className="text-medium-text text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-green/20 to-primary-green-light/20 rounded-3xl blur-3xl transform -rotate-6 scale-110"></div>
              <div className="relative bg-card-bg rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src={heroImage}
                  alt="Sports venues and activities"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6">
        {/* Dynamic Hero Offer Carousel */}
        {!loading && heroOffers.length > 0 && (
          <section className="py-16">
            <HeroOfferCarousel offers={heroOffers} />
          </section>
        )}

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              Why Choose PlayNation?
            </h2>
            <p className="text-xl text-medium-text max-w-2xl mx-auto">
              Experience the future of sports booking with our innovative platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-card-bg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border-color-light">
                <div className="bg-light-green-bg p-4 rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-primary-green text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-dark-text mb-4">{feature.title}</h3>
                <p className="text-medium-text leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Categories Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              Popular Sports Categories
            </h2>
            <p className="text-xl text-medium-text">
              Discover and book your favorite sports
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category) => (
              <div key={category.id} className="transform hover:scale-105 transition-transform duration-300">
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        </section>

        {/* Top Venues Section */}
        <section className="py-20">
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
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-card-bg rounded-2xl p-6 shadow-lg animate-pulse">
                  <div className="h-48 bg-border-color-light rounded-xl mb-4"></div>
                  <div className="h-6 bg-border-color-light rounded mb-2"></div>
                  <div className="h-4 bg-border-color-light rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topVenues.length > 0 ? (
                topVenues.map((venue) => (
                  <div key={venue.venue_id} className="transform hover:scale-105 transition-transform duration-300">
                    <VenueCard venue={venue} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="text-6xl text-border-color mb-4">🏟️</div>
                  <p className="text-xl text-medium-text">No venues available at the moment.</p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              How It Works
            </h2>
            <p className="text-xl text-medium-text">
              Get started in three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaSearch,
                title: "Discover",
                description: "Find the best sports venues near you with real-time availability and verified reviews.",
                step: "01"
              },
              {
                icon: FaCalendarAlt,
                title: "Book",
                description: "Select your preferred time slot and book instantly with our secure payment system.",
                step: "02"
              },
              {
                icon: FaPlay,
                title: "Play",
                description: "Arrive at the venue and enjoy your game with friends or meet new players.",
                step: "03"
              }
            ].map((item, index) => (
              <div key={index} className="relative text-center group">
                <div className="absolute -top-4 -right-4 text-6xl font-bold text-primary-green/10 group-hover:text-primary-green/20 transition-colors duration-300">
                  {item.step}
                </div>
                <div className="bg-gradient-to-br from-primary-green to-primary-green-dark p-6 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-semibold text-dark-text mb-4">{item.title}</h3>
                <p className="text-medium-text leading-relaxed">{item.description}</p>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 -right-8 text-primary-green/30">
                    <FaArrowRight className="text-2xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        {/* <section className="py-20">
          <div className="bg-gradient-to-r from-primary-green to-primary-green-dark rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Join Thousands of Happy Players
            </h2>
            <p className="text-xl opacity-90 mb-12">
              Be part of India's largest sports community
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                  <div className="text-lg opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Testimonials Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-medium-text">
              Real feedback from our sports community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-card-bg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-border-color-light">
                <div className="mb-6">
                  <FaQuoteLeft className="text-primary-green text-2xl mb-4" />
                  <p className="text-medium-text leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-dark-text">{testimonial.name}</h4>
                    <p className="text-sm text-light-text">{testimonial.role}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-yellow-400 text-sm" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA for Venue Owners */}
        <section className="py-20">
          <div className="bg-gradient-to-br from-light-green-bg to-primary-green/5 rounded-3xl p-12 text-center border border-primary-green/10">
            <div className="max-w-3xl mx-auto">
              <div className="bg-primary-green/10 p-4 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-8">
                <FaMapMarkerAlt className="text-primary-green text-2xl" />
              </div>
              
              <h2 className="text-4xl font-bold text-dark-text mb-6">
                Are you a Venue Owner?
              </h2>
              <p className="text-xl text-medium-text mb-8 leading-relaxed">
                Join PlayNation and reach thousands of sports enthusiasts. Grow your business with our powerful booking platform and management tools.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="bg-primary-green text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:bg-primary-green-dark transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3"
                >
                  List Your Venue
                  <FaArrowRight />
                </Link>
                
                <Link
                  to="/venue-benefits"
                  className="bg-card-bg text-dark-text px-8 py-4 rounded-xl font-semibold text-lg border-2 border-border-color hover:border-primary-green transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}