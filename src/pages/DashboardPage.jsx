import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { supabase } from '../supabaseClient';
import VenueCard from '../components/VenueCard';
import { FaGolfBall, FaShieldAlt, FaTrophy, FaBolt } from 'react-icons/fa';
import { GiCricketBat } from "react-icons/gi";
import { IoIosAmericanFootball, IoIosTennisball } from "react-icons/io";

const sports = [
  { name: 'Football', icon: <IoIosAmericanFootball /> },
  { name: 'Cricket', icon: <GiCricketBat /> },
  { name: 'Badminton', icon: <FaTrophy /> },
  { name: 'Snooker', icon: <IoIosTennisball /> },
  { name: 'Golf', icon: <FaGolfBall /> },
];

function DashboardPage() {
  const { profile, user } = useAuth(); // Get user profile from context
  const navigate = useNavigate();
  const [topVenues, setTopVenues] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- NEW: This useEffect handles the redirect for owners ---
  useEffect(() => {
    // If a user is logged in and their role is 'venue_owner', redirect them.
    if (user && profile?.role === 'venue_owner') {
      navigate('/owner/dashboard');
    }
  }, [user, profile, navigate]); // Rerun this check if the user or profile changes


  // This useEffect fetches data for the public-facing dashboard
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

    // Only fetch the data if the user is NOT a venue owner
    if (!profile || profile.role !== 'venue_owner') {
        fetchTopVenues();
    }
  }, [profile]);

  // --- NEW: Prevent homepage flash for owners ---
  // If the user is an owner, show a simple loading message while they are being redirected.
  if (profile?.role === 'venue_owner') {
    return <p className="container" style={{ textAlign: 'center', padding: '50px' }}>Redirecting...</p>;
  }

  return (
    <div className="container dashboard-page">
      <section className="section hero-section">
        <div className="hero-content">
          <h1 className="hero-title">PlayNation: Book sports slots in seconds</h1>
          <p className="hero-subtitle">Real-time availability across turfs and tables near you. No calls. No waiting. Just play.</p>
          <div className="hero-buttons">
            <button className="btn btn-primary">Explore venues</button>
            <button className="btn btn-secondary">Get started</button>
          </div>
          <div className="hero-features">
            <div className="feature-item"><span className="icon"><FaBolt /></span><span className="title">Fast</span><span className="description">Instant slot visibility</span></div>
            <div className="feature-item"><span className="icon"><FaShieldAlt /></span><span className="title">Secure</span><span className="description">Reliable & safe</span></div>
            <div className="feature-item"><span className="icon"><FaTrophy /></span><span className="title">Top venues</span><span className="description">Verified facilities</span></div>
          </div>
        </div>
        <div className="hero-image"></div>
      </section>

      <section className="section">
        <div className="offer-banner"><p>Flat 20% Off on Weekday Morning Slots</p></div>
      </section>
      
      <section className="section">
        <h2 className="section-heading">Sports We Offer</h2>
        <div className="sports-grid">
          {sports.map((sport) => (
            <div key={sport.name} className="sport-card">
              <span className="icon">{sport.icon}</span>
              <span>{sport.name}</span>
            </div>
          ))}
        </div>
      </section>
      
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
    </div>
  );
}

export default DashboardPage;