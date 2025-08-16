import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import VenueCard from '../components/venues/VenueCard'; // Corrected import path

function ExplorePage() {
  const [venues, setVenues] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: venueData, error: venueError } = await supabase
          .from('venues')
          .select(`
            *,
            facilities (
              *,
              sports (name),
              facility_amenities (
                amenities (name)
              )
            )
          `)
          .eq('is_approved', true);

        if (venueError) throw venueError;

        const { data: sportsData, error: sportsError } = await supabase
          .from('sports')
          .select('*');
        
        if (sportsError) throw sportsError;

        setVenues(venueData);
        setSports(sportsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredVenues = selectedSport === 'all'
    ? venues
    : venues.filter(venue => 
        venue.facilities.some(facility => facility.sport_id === selectedSport)
      );

  return (
    <div className="container dashboard-page">
      <h1 className="section-heading" style={{ textAlign: 'center', fontSize: '2rem' }}>Explore Venues</h1>
      
      <div className="sports-filter-container">
        <button 
          onClick={() => setSelectedSport('all')}
          className={`filter-btn ${selectedSport === 'all' ? 'active' : ''}`}
        >
          All Sports
        </button>
        {sports.map(sport => (
          <button 
            key={sport.sport_id} 
            onClick={() => setSelectedSport(sport.sport_id)}
            className={`filter-btn ${selectedSport === sport.sport_id ? 'active' : ''}`}
          >
            {sport.name}
          </button>
        ))}
      </div>
      
      {loading && <p style={{ textAlign: 'center' }}>Loading venues...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <div className="venue-grid">
          {filteredVenues.length > 0 ? (
            filteredVenues.map(venue => <VenueCard key={venue.venue_id} venue={venue} />)
          ) : (
            <p style={{ textAlign: 'center' }}>No venues found for the selected sport.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ExplorePage;