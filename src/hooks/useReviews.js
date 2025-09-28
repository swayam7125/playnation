import { useState, useCallback } from "react";
import { supabase } from "../supabaseClient";
import useSupabaseQuery from "./useSupabaseQuery";

const useReviews = (venueId) => {
  const {
    data: reviews,
    loading,
    error,
    refetch,
  } = useSupabaseQuery(
    "reviews",
    // Corrected Query: Fetches profile information for the user
    `*, profile:profiles (full_name, avatar_url)`,
    `venue_id=eq.${venueId}`
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = useCallback(
    async (review) => {
      setIsSubmitting(true);
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError || !sessionData.session?.user) {
          throw new Error("User not authenticated. Please log in to submit a review.");
        }

        const user = sessionData.session.user;
        const newReview = {
          ...review,
          venue_id: venueId,
          user_id: user.id,
        };

        const { data, error } = await supabase.from("reviews").insert([newReview]).select();
        if (error) throw error;

        // Refetch reviews to show the new one instantly
        refetch();

        return data;
      } finally {
        setIsSubmitting(false);
      }
    },
    [venueId, refetch]
  );

  return { reviews, loading, error, submitReview, isSubmitting };
};

export default useReviews;