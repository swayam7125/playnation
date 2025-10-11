import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const useVenues = (options = {}) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { limit, selectedSport, searchTerm, sortBy } = options;

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("venues")
          .select(`
            *,
            facilities (
              *,
              sports(*),
              facility_amenities(amenities(name))
            )
          `)
          .eq("is_approved", true);

        // Apply search filter
        if (searchTerm) {
          const searchPattern = `%${searchTerm.toLowerCase()}%`;
          query = query.or(
            `name.ilike.${searchPattern},address.ilike.${searchPattern},description.ilike.${searchPattern}`
          );
        }

        // Apply limit
        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;

        // Client-side filtering by sport (since Supabase doesn't support nested filtering easily)
        let filteredVenues = data || [];
        
        if (selectedSport && selectedSport !== 'all') {
          filteredVenues = filteredVenues.filter(venue => {
            // Check if any facility at this venue has the selected sport
            return venue.facilities && venue.facilities.some(
              facility => facility.sport_id === selectedSport
            );
          });
        }

        // Client-side sorting (after filtering)
        if (sortBy === 'name') {
          filteredVenues.sort((a, b) => {
            const nameA = (a.name || '').toLowerCase();
            const nameB = (b.name || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });
        } else if (sortBy === 'rating') {
          // Sort by average rating from reviews (if available)
          filteredVenues.sort((a, b) => {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            return ratingB - ratingA; // Descending
          });
        } else if (sortBy === 'price') {
          // Sort by minimum hourly rate from facilities
          filteredVenues.sort((a, b) => {
            const minPriceA = a.facilities?.length 
              ? Math.min(...a.facilities.map(f => f.hourly_rate || Infinity))
              : Infinity;
            const minPriceB = b.facilities?.length 
              ? Math.min(...b.facilities.map(f => f.hourly_rate || Infinity))
              : Infinity;
            return minPriceA - minPriceB; // Ascending
          });
        } else {
          // Default: sort by created_at (newest first)
          filteredVenues.sort((a, b) => {
            const dateA = new Date(a.created_at || 0);
            const dateB = new Date(b.created_at || 0);
            return dateB - dateA; // Descending
          });
        }

        setVenues(filteredVenues);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [limit, selectedSport, searchTerm, sortBy]);

  return { venues, loading, error };
};

export default useVenues;