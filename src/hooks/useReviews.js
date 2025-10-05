import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabaseClient";

const useReviews = (venueId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false); // Start as false
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    if (!venueId) return; // Guard clause

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from("reviews")
        .select(`*, profiles (*)`)
        .eq("venue_id", venueId)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setReviews(data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [venueId]);

  useEffect(() => {
    // Only fetch if venueId is present
    if (venueId) {
      fetchReviews();
    } else {
      setLoading(false);
      setReviews([]);
    }
  }, [venueId, fetchReviews]);

  return { reviews, loading, error, refetch: fetchReviews };
};

export default useReviews;