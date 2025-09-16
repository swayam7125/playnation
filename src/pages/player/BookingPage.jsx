import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { useModal } from '../../ModalContext';

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
const formatTime = (dateString) => new Date(dateString).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

function BookingPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, profile } = useAuth(); // Get the user's profile for pre-filling data
    const { showModal } = useModal();
    const { venue, facility, slot, price } = location.state || {};
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!venue || !facility || !slot || price === undefined) {
        React.useEffect(() => { navigate('/explore'); }, [navigate]);
        return null;
    }

    const totalAmount = price;

    const handlePayment = async () => {
        if (!user) {
            showModal({ title: "Login Required", message: "Please log in to make a booking." });
            navigate('/login', { state: { from: location } });
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Step 1: Call our Edge Function to create a Razorpay order
            const { data: order, error: orderError } = await supabase.functions.invoke('create-order', {
                body: { slot_id: slot.slot_id },
            });

            if (orderError) throw new Error(orderError.message);
            
            // Step 2: Configure Razorpay Checkout options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Your public Razorpay Key ID
                amount: order.amount,
                currency: order.currency,
                name: "Play Nation Booking",
                description: `Booking for ${facility.name} at ${venue.name}`,
                order_id: order.id,
                handler: async function (response) {
                    // This function is called on successful payment.
                    // The actual booking confirmation happens in the webhook for security.
                    await showModal({ title: "Payment Successful!", message: "Your payment was successful. We are confirming your booking." });
                    navigate('/my-bookings');
                },
                prefill: {
                    name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
                    email: user.email,
                    contact: profile.phone_number || '',
                },
                theme: {
                    color: '#10b981', // Matches your primary green
                },
                notes: {
                    booking_details: `Slot ID: ${slot.slot_id}, User ID: ${user.id}`
                }
            };

            // Step 3: Open the Razorpay payment window
            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', function (response) {
                showModal({ title: "Payment Failed", message: `Your payment failed. Please try again. Reason: ${response.error.description}` });
            });

        } catch (err) {
            setError(err.message);
            showModal({ title: "Payment Failed", message: `An error occurred while initializing payment: ${err.message}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-center text-3xl font-bold mb-8 text-dark-text">Confirm Your Booking</h1>
            {error && <p className="text-center text-red-600 mb-4">Error: {error}</p>}

            <div className="max-w-lg mx-auto bg-card-bg p-8 rounded-xl border border-border-color shadow-lg">
                <h3 className="text-2xl font-bold text-dark-text mb-2">{venue.name}</h3>
                <p className="text-medium-text mb-6"><strong>Facility:</strong> {facility.name} ({facility.sports.name})</p>
                <div className="space-y-4 text-medium-text border-t border-b border-border-color py-6">
                    <p><strong>Date:</strong> {formatDate(slot.start_time)}</p>
                    <p><strong>Time:</strong> {formatTime(slot.start_time)} - {formatTime(slot.end_time)}</p>
                </div>
                <div className="flex justify-between items-center text-xl font-bold text-dark-text mt-6">
                    <span>Total Amount</span>
                    <span>₹{totalAmount}</span>
                </div>
                <button onClick={handlePayment} className="w-full mt-8 py-4 px-6 rounded-lg font-semibold text-lg transition duration-300 bg-primary-green text-white shadow-sm hover:bg-primary-green-dark hover:-translate-y-px hover:shadow-md disabled:bg-gray-400" disabled={loading}>
                    {loading ? 'Initializing Payment...' : 'Proceed to Pay'}
                </button>
            </div>
        </div>
    );
}

export default BookingPage;