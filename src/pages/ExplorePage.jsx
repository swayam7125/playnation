import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import VenueCard from '../components/venues/VenueCard';
import useVenues from '../hooks/useVenues';

function ExplorePage() {
  const { venues, loading, error } = useVenues();
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

  const buttonBaseStyles = "py-3 px-6 font-sans text-sm font-semibold border border-border-color bg-card-bg text-medium-text rounded-full cursor-pointer transition duration-300 shadow-sm";
  const buttonHoverStyles = "hover:bg-light-green-bg hover:border-primary-green hover:text-primary-green hover:-translate-y-px hover:shadow-md";
  const buttonActiveStyles = "bg-primary-green text-white border-primary-green shadow-md";

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-center text-3xl font-bold mb-12 text-dark-text relative after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:w-20 after:h-1 after:bg-primary-green after:rounded-sm after:-translate-x-1/2">Explore Venues</h1>
      
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        <button 
          onClick={() => setSelectedSport('all')}
          className={`${buttonBaseStyles} ${selectedSport === 'all' ? buttonActiveStyles : buttonHoverStyles}`}
        >
          All Sports
        </button>
        {!sportsLoading && sports.map(sport => (
          <button 
            key={sport.sport_id} 
            onClick={() => setSelectedSport(sport.sport_id)}
            className={`${buttonBaseStyles} ${selectedSport === sport.sport_id ? buttonActiveStyles : buttonHoverStyles}`}
          >
            {sport.name}
          </button>
        ))}
      </div>
      
      {loading && <p className="text-center">Loading venues...</p>}
      {error && <p className="text-center text-red-600">Error: {error}</p>}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVenues.length > 0 ? (
            filteredVenues.map(venue => <VenueCard key={venue.venue_id} venue={venue} />)
          ) : (
            <p className="text-center col-span-full">No venues found for the selected sport.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ExplorePage;