import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const useVenues = ({ limit, selectedSports = [], selectedAmenities = [], searchTerm, sortBy }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      setError(null);

      try {
        // --- Call the RPC function ---
        // The data comes back as a single JSON array
        let { data, error: fetchError } = await supabase
          .rpc('get_explore_page_venues');
        
        if (fetchError) throw fetchError;

        // The 'data' is the JSON array from the function
        let processedVenues = data || [];

        // Apply search filter (client-side)
        if (searchTerm) {
          const searchPattern = searchTerm.toLowerCase();
          processedVenues = processedVenues.filter(venue =>
            venue.name?.toLowerCase().includes(searchPattern) ||
            venue.address?.toLowerCase().includes(searchPattern) ||
            venue.description?.toLowerCase().includes(searchPattern)
          );
        }
        
        // Client-side filtering by sports
        if (selectedSports.length > 0) {
          processedVenues = processedVenues.filter(venue => {
            return venue.facilities && venue.facilities.some(
              facility => selectedSports.includes(facility.sport_id)
            );
          });
        }

        // Client-side filtering by amenities
        if (selectedAmenities.length > 0) {
          processedVenues = processedVenues.filter(venue => {
            return venue.amenities && selectedAmenities.every(
              amenityId => venue.amenities.includes(amenityId)
            );
          });
        }

        // Client-side sorting
        if (sortBy === 'name') {
          processedVenues.sort((a, b) => {
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });
        } else if (sortBy === 'rating') {
          // Sort by the 'avg_rating' property from the function
          processedVenues.sort((a, b) => {
            const ratingA = a.avg_rating || 0;
            const ratingB = b.avg_rating || 0;
            return ratingB - ratingA; // Descending
          });
        } else if (sortBy === 'price') {
          processedVenues.sort((a, b) => {
            const minPriceA = a.facilities?.length 
              ? Math.min(...a.facilities.map(f => f.hourly_rate || Infinity))
              : Infinity;
            const minPriceB = b.facilities?.length 
              ? Math.min(...b.facilities.map(f => f.hourly_rate || Infinity))
              : Infinity;
            return minPriceA - minPriceB;
          });
        } else {
          processedVenues.sort((a, b) => {
            const dateA = new Date(a.created_at || 0);
            const dateB = new Date(b.created_at || 0);
            return dateB - dateA; // Descending
          });
        }

        // Apply limit (client-side)
        if (limit) {
          processedVenues = processedVenues.slice(0, limit);
        }

        setVenues(processedVenues);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [limit, JSON.stringify(selectedSports), JSON.stringify(selectedAmenities), searchTerm, sortBy]);

  // This return value is what's causing the error in your component
  return { venues, loading, error };
};

export default useVenues;