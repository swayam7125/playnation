import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const useVenues = (options = {}) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Destructure filtering and sorting options
  const { limit, selectedSport, searchTerm, sortBy } = options; 

  // Include filters in dependency array to re-fetch when they change
  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("venues")
          .select(
            `
            *,
            facilities (
              *,
              sports (sport_id, name),
              facility_amenities (
                amenities (name)
              )
            )
          `
          )
          .eq("is_approved", true);

        // --- SERVER-SIDE FILTERING LOGIC ---

        if (searchTerm) {
          const searchPattern = `%${searchTerm.toLowerCase()}%`;
          // Apply search filter across name, address, and description fields
          query = query.or(`name.ilike.${searchPattern},address.ilike.${searchPattern},description.ilike.${searchPattern}`);
        }

        if (selectedSport && selectedSport !== 'all') {
          // Filter by sport ID in the nested 'facilities' table
          query = query.eq('facilities.sport_id', selectedSport);
        }

        // Apply sorting directly in the query
        switch (sortBy) {
          case 'name':
            query = query.order('name', { ascending: true });
            break;
          case 'created_at': // Default fallback
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        setVenues(data || []);
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