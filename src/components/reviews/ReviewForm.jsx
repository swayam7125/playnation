import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { FaStar } from 'react-icons/fa';

function ReviewForm({ booking, onClose, onReviewSubmitted }) {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        setLoading(true);
        setError('');

        try {
            const { error: insertError } = await supabase
                .from('reviews')
                .insert({
                    user_id: user.id,
                    venue_id: booking.facilities.venues.venue_id,
                    booking_id: booking.booking_id,
                    rating: rating,
                    comment: comment,
                });

            if (insertError) throw insertError;

            // Mark the booking as reviewed
            const { error: updateError } = await supabase
                .from('bookings')
                .update({ has_been_reviewed: true })
                .eq('booking_id', booking.booking_id);
            
            if (updateError) throw updateError;
            
            onReviewSubmitted(); // This will refresh the bookings list in MyBookingsPage
            onClose(); // Close the modal

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-card-bg rounded-xl shadow-lg w-full max-w-md p-8">
                <h2 className="text-2xl font-bold text-dark-text mb-4">Leave a Review for {booking.facilities.venues.name}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-medium-text mb-2">Your Rating</label>
                        <div className="flex items-center gap-2">
                            {[...Array(5)].map((_, index) => {
                                const ratingValue = index + 1;
                                return (
                                    <label key={ratingValue}>
                                        <input type="radio" name="rating" value={ratingValue} onClick={() => setRating(ratingValue)} className="hidden" />
                                        <FaStar
                                            className="cursor-pointer transition-colors"
                                            color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                                            size={30}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(0)}
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="comment" className="block text-sm font-medium text-medium-text mb-2">Your Comments</label>
                        <textarea
                            id="comment"
                            rows="4"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full px-4 py-3 bg-hover-bg border border-border-color rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-green"
                            placeholder="Tell us about your experience..."
                        ></textarea>
                    </div>
                    {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="py-2 px-5 rounded-lg font-semibold text-sm bg-border-color-light hover:bg-border-color text-medium-text">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="py-2 px-5 rounded-lg font-semibold text-sm bg-primary-green text-white shadow-sm hover:bg-primary-green-dark disabled:bg-gray-400">
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReviewForm;