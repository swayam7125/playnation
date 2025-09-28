import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import BookingCard from '../../components/bookings/BookingCard';
// CORRECTED IMPORT: Import the specific named components.
import { LoadingSpinner, ErrorState } from '../../components/common/LoadingAndError';

function MyBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [view, setView] = useState('upcoming');
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchBookings = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    booking_id, start_time, end_time, total_amount, status, has_been_reviewed,
                    facilities ( name, venues ( venue_id, name, address, city, image_url ), sports ( name ) )
                `)
                .eq('user_id', user.id)
                .order('start_time', { ascending: view === 'upcoming' });

            if (error) throw error;

            const now = new Date();
            const processedBookings = data.map(b => ({
                ...b,
                status: b.status === 'confirmed' && new Date(b.start_time) < now ? 'completed' : b.status,
            }));

            const filteredBookings = processedBookings.filter(b => {
                const isPast = new Date(b.start_time) < now;
                return view === 'upcoming' ? !isPast : isPast;
            });

            setBookings(filteredBookings);
        } catch (err) {
            setError('Failed to fetch bookings. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [user, view, refreshKey]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);
    
    const handleReviewSubmitted = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            const { error } = await supabase.rpc('cancel_booking_transaction', {
                p_booking_id: bookingId,
                p_user_id: user.id
            });
            if (error) throw error;
            setRefreshKey(prevKey => prevKey + 1);
        } catch (error) {
            console.error('Cancellation failed:', error);
            alert(`Failed to cancel booking: ${error.message}`);
        }
    };

    // Helper function to render the main content
    const renderContent = () => {
        if (loading) {
            return <LoadingSpinner />;
        }
        if (error) {
            return <ErrorState error={error} onRetry={fetchBookings} />;
        }
        if (bookings.length > 0) {
            return (
                <div className="space-y-6">
                    {bookings.map(booking => (
                        <BookingCard
                            key={booking.booking_id}
                            booking={booking}
                            onReviewSubmitted={handleReviewSubmitted}
                            onCancelBooking={handleCancelBooking}
                        />
                    ))}
                </div>
            );
        }
        return (
            <div className="text-center py-16 bg-card-bg rounded-lg">
                <p className="text-medium-text">You have no {view} bookings.</p>
            </div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-dark-text mb-8">My Bookings</h1>

            <div className="flex justify-center mb-8 border-b border-border-color">
                <button
                    onClick={() => setView('upcoming')}
                    className={`px-6 py-3 font-semibold transition ${view === 'upcoming' ? 'text-primary-green border-b-2 border-primary-green' : 'text-medium-text'}`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setView('past')}
                    className={`px-6 py-3 font-semibold transition ${view === 'past' ? 'text-primary-green border-b-2 border-primary-green' : 'text-medium-text'}`}
                >
                    Past
                </button>
            </div>

            {/* CORRECTED RENDER LOGIC: Call the helper function */}
            {renderContent()}
        </div>
    );
}

export default MyBookingsPage;