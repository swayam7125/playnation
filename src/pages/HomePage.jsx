import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';
import heroImage from '../assets/images/hero/hero-img-1.svg';
import { FeatureCard } from '../components/home/FeatureCard/FeatureCard';
import { CategoryCard } from '../components/home/CategoryCard/CategoryCard';
import VenueCard from '../components/venues/VenueCard';
import { categories } from '../constants/categories';

export default function HomePage() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [topVenues, setTopVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile?.role === 'venue_owner') {
      navigate('/owner/dashboard');
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    const fetchTopVenues = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('venues')
          .select(`*, facilities (sports (name), facility_amenities ( amenities (name) ) )`)
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(4);
        if (error) throw error;
        setTopVenues(data);
      } catch (error) {
        console.error("Error fetching top venues:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!profile || profile.role !== 'venue_owner') {
      fetchTopVenues();
    }
  }, [profile]);

  if (profile?.role === 'venue_owner') {
    return <p className="container mx-auto text-center p-12">Redirecting...</p>;
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-12 mb-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 min-h-[450px]">
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl font-extrabold leading-tight text-dark-text">PlayNation: Book sports slots in seconds</h1>
            <p className="text-lg text-light-text font-normal leading-relaxed">
              Real-time availability across turfs and tables near you. No calls. No waiting. Just play.
            </p>
            <div className="flex gap-4 my-4">
              <Link to="/explore" className="py-3 px-6 rounded-lg font-semibold text-sm cursor-pointer transition duration-300 inline-flex items-center justify-center gap-2 no-underline whitespace-nowrap bg-primary-green text-white shadow-sm hover:bg-primary-green-dark hover:-translate-y-px hover:shadow-md">
                Let's go!!
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <FeatureCard icon="⚡️" title="Fast" description="Instant slot visibility" />
              <FeatureCard icon="🛡️" title="Secure" description="Reliable & Safe" />
              <FeatureCard icon="🏟️" title="Top Venues" description="Verified Facilities" />
              <FeatureCard icon="👥" title="Users" description="Satisfied Users" />
            </div>
          </div>
          <div className="w-full h-auto max-w-2xl rounded-xl shadow-md overflow-hidden">
            <img src={heroImage} alt="Collage of sports venues" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* Offer Banner Section */}
        <section className="mb-20">
          <div className="h-44 bg-light-green-bg rounded-xl flex items-center justify-center text-3xl font-bold text-primary-green shadow-md border border-primary-green">
            <p>Flat 20% Off on Weekday Morning Slots</p>
          </div>
        </section>

        {/* Popular Categories Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-dark-text relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-primary-green after:rounded-sm">Popular categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map(category => (
              <CategoryCard 
                key={category.id}
                imgSrc={category.image} 
                name={category.name}
              />
            ))}
          </div>
        </section>

        {/* Top Venues Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-dark-text relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-primary-green after:rounded-sm">Top Venues</h2>
          {loading ? (
            <p>Loading top venues...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topVenues.length > 0 ? (
                topVenues.map((venue) => <VenueCard key={venue.venue_id} venue={venue} />)
              ) : (
                <p>No venues available at the moment.</p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}