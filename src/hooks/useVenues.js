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
            ),
            reviews ( rating )
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
        
        // --- START FIX: Calculate average rating ---
        const venuesWithRating = (data || []).map(venue => {
          let avg_rating = 0;
          let review_count = 0;
          
          if (venue.reviews && venue.reviews.length > 0) {
            const totalRating = venue.reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
            avg_rating = totalRating / venue.reviews.length;
            review_count = venue.reviews.length;
          }

          return {
            ...venue,
            avg_rating: avg_rating, // New calculated property
            review_count: review_count // New calculated property
          };
        });
        // --- END FIX ---

        // Client-side filtering by sport (since Supabase doesn't support nested filtering easily)
        let filteredVenues = venuesWithRating; // Use the new processed array
        
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
          // --- START FIX: Sort by new 'avg_rating' property ---
          filteredVenues.sort((a, b) => {
            const ratingA = a.avg_rating || 0;
            const ratingB = b.avg_rating || 0;
            return ratingB - ratingA; // Descending
          });
          // --- END FIX ---
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