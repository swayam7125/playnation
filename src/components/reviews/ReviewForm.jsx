// src/components/reviews/ReviewForm.jsx

import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { supabase } from "../../supabaseClient";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

// --- Star Rating Component ---
const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-7 w-7 cursor-pointer transition-all ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300 hover:text-gray-400"
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
};

// --- Review Form Component ---
const ReviewForm = ({ booking, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || rating === 0) {
      toast.error("Please select a rating to submit your review.");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Submitting your review...");

    try {
      // 1. Insert the review
      const { data: reviewData, error: reviewError } = await supabase
        .from("reviews")
        .insert({
          user_id: user.id,
          venue_id: booking.facilities.venues.venue_id,
          facility_id: booking.facilities.facility_id,
          booking_id: booking.booking_id,
          rating: rating,
          comment: comment,
        })
        .select()
        .single();

      if (reviewError) throw reviewError;

      // 2. Mark the booking as reviewed
      const { error: bookingError } = await supabase
        .from("bookings")
        .update({ has_been_reviewed: true })
        .eq("booking_id", booking.booking_id);

      if (bookingError) throw bookingError;

      // 3. (Optional but recommended) Recalculate average rating
      // You should have a Supabase Function to do this automatically
      // For now, we'll just show success
      await supabase.rpc("calculate_venue_avg_rating", {
        p_venue_id: booking.facilities.venues.venue_id,
      });

      toast.success("Thank you for your review!", { id: loadingToast });
      onSuccess(); // Close modal and refresh list
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.message || "Failed to submit review.", {
        id: loadingToast,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-dark-text">
          Your Rating
        </label>
        <StarRating rating={rating} setRating={setRating} />
      </div>

      <div>
        <label
          htmlFor="comment"
          className="mb-2 block text-sm font-semibold text-dark-text"
        >
          Your Review (Optional)
        </label>
        <textarea
          id="comment"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like or dislike?"
          className="w-full rounded-lg border border-border-color bg-background p-3 text-sm text-dark-text focus:border-primary-green focus:ring-1 focus:ring-primary-green"
        />
      </div>

      <div className="flex justify-end gap-3 pt-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-lg border-2 border-border-color px-5 py-2.5 text-sm font-semibold text-medium-text transition hover:bg-hover-bg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || rating === 0}
          className="rounded-lg bg-primary-green px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-green-dark disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;