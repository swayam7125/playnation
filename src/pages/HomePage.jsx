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
    return <p className="container" style={{ textAlign: 'center', padding: '50px' }}>Redirecting...</p>;
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Hero Section */}
        <section className="section hero-section">
          <div className="hero-content">
            <h1 className="hero-title">PlayNation: Book sports slots in seconds</h1>
            <p className="hero-subtitle">
              Real-time availability across turfs and tables near you. No calls. No waiting. Just play.
            </p>
            <div className="hero-buttons">
              <Link to="/explore" className="btn btn-primary">Let's goo!!</Link>
            </div>
            <div className="hero-features">
              <FeatureCard icon="⚡️" title="Fast" description="Instant slot visibility" />
              <FeatureCard icon="🛡️" title="Secure" description="Reliable & Safe" />
              <FeatureCard icon="🏟️" title="Venues" description="Verified Facilities" />
              <FeatureCard icon="👥" title="Users" description="Satisfied Users" />
            </div>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Collage of sports venues" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-xl)' }} />
          </div>
        </section>

        {/* Offer Banner Section */}
        <section className="section">
          <div className="offer-banner">
            <p>Flat 20% Off on Weekday Morning Slots</p>
          </div>
        </section>

        {/* Popular Categories Section */}
        <section className="section">
          <h2 className="section-heading">Popular categories</h2>
          <div className="sports-grid">
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
        <section className="section">
          <h2 className="section-heading">Top Venues</h2>
          {loading ? (
            <p>Loading top venues...</p>
          ) : (
            <div className="venue-grid">
              {topVenues.length > 0 ? (
                topVenues.map((venue) => <VenueCard key={venue.venue_id} venue={venue} />)
              ) : (
                <p>No venues available at the moment.</p>
              )}
            </div>
          )}
        </section>

        {/* Footer Section */}
        <footer className="section">
          <p className="text-center text-light">Footer</p>
        </footer>
      </div>
    </div>
  );
}