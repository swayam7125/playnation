import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import VenueCard from '../components/venues/VenueCard';
import useVenues from '../hooks/useVenues'; // Import the custom hook

function ExplorePage() {
  const { venues, loading, error } = useVenues(); // Use the custom hook to fetch all venues
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState('all');
  const [sportsLoading, setSportsLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const { data: sportsData, error: sportsError } = await supabase
          .from('sports')
          .select('*');
        
        if (sportsError) throw sportsError;

        setSports(sportsData);
      } catch (err) {
        console.error("Error fetching sports:", err.message);
      } finally {
        setSportsLoading(false);
      }
    };

    fetchSports();
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
        {!sportsLoading && sports.map(sport => (
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