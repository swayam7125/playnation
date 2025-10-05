import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

const useVenues = (options = {}) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true); // Start as true
  const [error, setError] = useState(null);

  const { limit, selectedSport, searchTerm, sortBy } = options;

  useEffect(() => {
    const fetchVenues = async () => {
      // Set loading to true at the start of the fetch operation
      setLoading(true);
      setError(null);

      try {
        let query = supabase.from("venues").select(`*, facilities (*, sports(*), facility_amenities(amenities(name)))`).eq("is_approved", true);

        if (searchTerm) {
          const searchPattern = `%${searchTerm.toLowerCase()}%`;
          query = query.or(`name.ilike.${searchPattern},address.ilike.${searchPattern},description.ilike.${searchPattern}`);
        }

        if (selectedSport && selectedSport !== 'all') {
          query = query.eq('facilities.sport_id', selectedSport);
        }

        // Corrected sorting logic
        if (sortBy === 'name') {
            query = query.order('name', { ascending: true });
        } else {
            query = query.order('created_at', { ascending: false });
        }


        if (limit) {
          query = query.limit(limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) throw fetchError;
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