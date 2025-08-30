import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const useVenues = (options = {}) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
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
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        setVenues(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, [options.limit]); // Re-run effect if options.limit changes

  return { venues, loading, error };
};

export default useVenues;