import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const useFrequentlyBookedVenues = (userId) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFrequentlyBookedVenues = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the RPC function to get frequently booked venue IDs
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_frequently_booked_venues', {
        p_user_id: userId,
      });

      if (rpcError) {
        throw rpcError;
      }

      if (rpcData && rpcData.length > 0) {
        const venueIds = rpcData.map(item => item.venue_id);

        // Fetch full venue details for these IDs
        const { data: venueDetails, error: venueError } = await supabase
          .from('venues')
          .select('*, facilities(facility_id, name, sports(name))')
          .in('venue_id', venueIds);

        if (venueError) {
          throw venueError;
        }

        // Sort the venues based on the order returned by the RPC function
        const sortedVenues = venueDetails.sort((a, b) => {
          return venueIds.indexOf(a.venue_id) - venueIds.indexOf(b.venue_id);
        });

        setVenues(sortedVenues);
      } else {
        setVenues([]);
      }
    } catch (err) {
      console.error("Error fetching frequently booked venues:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchFrequentlyBookedVenues();
  }, [fetchFrequentlyBookedVenues]);

  return { venues, loading, error };
};

export default useFrequentlyBookedVenues;