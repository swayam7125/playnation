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
  FaQuoteLeft,
  FaAngleRight // Icon for dashboard link
} from "react-icons/fa";

export default function HomePage() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [topVenues, setTopVenues] = useState([]);
  const [heroOffers, setHeroOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE FOR PLAYER PERSONALIZATION ---
  const [nextBooking, setNextBooking] = useState(null);
  const [favoriteVenues, setFavoriteVenues] = useState([]); // Array now holds favorited venues
  const [loadingPersonalData, setLoadingPersonalData] = useState(false);

  // --- START REDIRECTION LOGIC ---
  useEffect(() => {
    if (user && profile) {
      if (profile.role === "venue_owner") {
        navigate("/owner/dashboard", { replace: true });
        return;
      }
      if (profile.role === "admin") {
        navigate("/admin", { replace: true });
        return;
      }
    }
  }, [user, profile, navigate]);
  // --- END REDIRECTION LOGIC ---

  // RENDER GUARD: If redirection is imminent, return null instantly for a cleaner switch.
  const isRedirecting = profile?.role === "venue_owner" || profile?.role === "admin";
  if (isRedirecting) {
      return null;
  }

  // --- NEW: FETCH PLAYER PERSONALIZED DATA ---
  useEffect(() => {
    const fetchPersonalData = async () => {
      if (!user || profile?.role !== "player") return;
      
      setLoadingPersonalData(true);
      const today = new Date();
      // Use toISOString() on the current date for the GTE filter to work correctly
      const todayISO = today.toISOString(); 

      try {
        // 1. Fetch Next Upcoming Booking
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            booking_id, start_time, 
            facilities(
              venue_id, name, 
              venues(name, address, city, state)
            )
          `)
          .eq('user_id', user.id)
          .gte('start_time', todayISO)
          .eq('status', 'confirmed')
          .order('start_time', { ascending: true })
          .limit(1);

        if (bookingError) console.error("Booking fetch error:", bookingError);
        setNextBooking(bookingData?.[0] || null);

        // 2. Fetch Top 3 Favorite Venues using the RPC function
        const { data: favoriteData, error: favoriteError } = await supabase.rpc('get_favorite_venues', { p_user_id: user.id });

        if (favoriteError) {
          console.error("RPC 'get_favorite_venues' failed:", favoriteError);
          setFavoriteVenues([]);
        } else {
          setFavoriteVenues(favoriteData || []);
        }

      } catch (error) {
        console.error("Error fetching personalized data:", error);
      } finally {
        setLoadingPersonalData(false);
      }
    };

    fetchPersonalData();
  }, [user, profile]);

  // --- EXISTING: FETCH GENERAL TOP VENUES AND OFFERS ---
  useEffect(() => {
    const fetchGeneralData = async () => {
      setLoading(true);
      try {
        // Fetch top 4 general approved venues
        const { data: venuesData, error: venuesError } = await supabase
          .from("venues")
          .select(
            `*, image_url, facilities (sports (name), facility_amenities ( amenities (name) ) )`
          )
          .eq("is_approved", true)
          .order("created_at", { ascending: false })
          .limit(4);
        if (venuesError) throw venuesError;
        setTopVenues(venuesData);
        
        // Fetch global offers
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

        if (heroOffersError) throw heroOffersError;
        setHeroOffers(heroOffersData || []);
        
      } catch (error) {
        console.error("Error fetching general data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data only if the user is a 'player' or anonymous
    if (!user || profile?.role === "player") {
      fetchGeneralData();
    }
  }, [user, profile]);


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

  const isPlayer = user && profile?.role === 'player';

  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <div className="bg-background">
      {/* --- 1. PERSONALIZED DASHBOARD SECTION (FOR LOGGED-IN PLAYERS) --- */}
      {isPlayer && (
        <section className="bg-gradient-to-br from-white via-blue-50 to-emerald-50 py-12 border-b border-border-color-light">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-dark-text mb-6">
              Welcome Back, {profile.username || profile.first_name || 'Player'}!
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Your Next Game (Hover working) */}
              <div className="md:col-span-1 bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-xl border border-primary-green/20 
                             group transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
               {loadingPersonalData ? (
                  <div className="h-24 animate-pulse bg-gray-100 rounded-lg"></div>
                ) : nextBooking ? (
                  <>
                    <h3 className="text-sm font-semibold text-primary-green flex items-center gap-2 mb-3">
                      <FaCalendarAlt className="text-xl" /> YOUR NEXT GAME
                    </h3>
                    <p className="text-3xl font-extrabold text-dark-text leading-snug truncate">
                      {nextBooking.facilities.name} 
                    </p>
                    <p className="text-medium-text mt-1 text-sm truncate">
                      {nextBooking.facilities.venues.name}, {nextBooking.facilities.venues.city}
                    </p>
                    {/* Highlight the Time/Status prominently */}
                    <div className="mt-4">
                        <span className="text-lg font-bold text-white bg-primary-green px-4 py-2 rounded-full w-fit 
                                       inline-flex items-center gap-2 shadow-md group-hover:bg-primary-green-dark transition-colors">
                          <FaClock className="text-sm" /> 
                          {/* Display time and check if it's today */}
                          {new Date(nextBooking.start_time).toDateString() === new Date().toDateString() 
                             ? `${formatTime(nextBooking.start_time)} today` 
                             : formatTime(nextBooking.start_time)
                          }
                        </span>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-dark-text mb-2">
                      No Upcoming Bookings
                    </h3>
                    <p className="text-medium-text mb-4">
                      It's time to hit the courts!
                    </p>
                    <Link to="/explore" className="text-primary-green font-medium flex items-center gap-1 hover:gap-2 transition-all text-sm">
                      Browse Venues <FaAngleRight className="w-3 h-3" />
                    </Link>
                  </>
                )}
              
              </div>
              
              {/* Card 2 & 3: Favorites Suggestion & Offers */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Card 2: Favorites Suggestion (FIXED HOVER) */}
                <div className="bg-card-bg rounded-2xl p-6 shadow-lg border border-border-color-light 
                             group transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer"> 
                    <h3 className="text-xl font-bold text-dark-text mb-4 border-b border-border-color-light pb-3">
                      Book Your Favorites Again:
                    </h3>
                    {loadingPersonalData ? (
                        <div className="h-20 animate-pulse bg-gray-100 rounded-lg"></div>
                    ) : favoriteVenues.length > 0 ? (
                        <div className="space-y-3 pt-2">
                        {favoriteVenues.map((venue) => (
                            <Link 
                            key={venue.venue_id}
                            to={`/venues/${venue.venue_id}`}
                            // Hover effect for links is set inside the map
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-hover-bg transition-colors no-underline"
                            >
                            <div className="flex items-center gap-3">
                                <FaStar className="text-yellow-500 text-base" />
                                <span className="font-medium text-dark-text group-hover:text-primary-green transition-colors">
                                    {venue.name}
                                </span>
                            </div>
                            
                            {/* Display Booking Count as a Badge */}
                            <span className="text-xs font-bold text-white bg-blue-500 px-3 py-1 rounded-full flex-shrink-0">
                                {venue.booking_count} bookings
                            </span>
                            
                            <FaArrowRight className="text-primary-green w-3 h-3 transition-transform" />
                            </Link>
                        ))}
                        </div>
                    ) : (
                        <p className="text-medium-text text-sm">Book more venues to see your favorites here!</p>
                    )}
                </div>
                
                {/* Card 3: New Offers Available (FIXED HOVER) */}
                <div className="bg-gradient-to-tr from-cyan-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-indigo-200 flex flex-col justify-between
                             group transform transition duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
                    
                    {/* Icon or Graphic Placeholder */}
                    <div className="text-4xl text-cyan-600 mb-3">🏷️</div> 
                    
                    <div>
                        <h3 className="text-xl font-bold text-dark-text mb-2">
                            New Offers Available!
                        </h3>
                        <p className="text-medium-text mb-4">
                            Don't miss out on special discounts! Find deals on courts and fields near you.
                        </p>
                    </div>
                    
                    {/* Link Button */}
                    <Link 
                        to="/explore" 
                        className="text-primary-green font-medium flex items-center gap-2 hover:gap-3 transition-all text-sm w-fit mt-3"
                    >
                        See Latest Deals 
                        <FaAngleRight className="w-4 h-4" />
                    </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- 2. HERO/MARKETING SECTION (FOR GUESTS/FALLBACK) --- */}
      {(!isPlayer || loadingPersonalData) && ( // Show this if not a player, or while player data is loading
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
      )}


      <div className="container mx-auto px-6">
        {/* Dynamic Hero Offer Carousel */}
        <section className="py-16">
          <HeroOfferCarousel />
        </section>

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