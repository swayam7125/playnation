import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaEdit, FaCheckCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import ReviewForm from '../reviews/ReviewForm';

const BookingCard = ({ booking, onReviewSubmitted, onCancelBooking }) => {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    if (!booking || !booking.facilities || !booking.facilities.venues) {
        return (
            <div className="bg-card-bg rounded-xl shadow-md p-6 border border-border-color-light text-center">
                <p className="text-medium-text">Booking information is currently unavailable.</p>
            </div>
        );
    }

    const { facilities, start_time, end_time, total_amount, status, has_been_reviewed } = booking;
    const { venues, name: facilityName, sports } = facilities;
    const sportName = sports?.name || 'Sport';

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            setIsCancelling(true);
            await onCancelBooking(booking.booking_id);
            setIsCancelling(false);
        }
    };
    
    const isPastBooking = new Date(start_time) < new Date();
    const canReview = status === 'completed' && !has_been_reviewed;

    const statusClasses = {
        confirmed: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800',
    };

    return (
        <>
            <div className="bg-card-bg rounded-xl shadow-md overflow-hidden transform transition-all hover:shadow-lg hover:-translate-y-1 w-full border border-border-color-light">
                <div className="md:flex">
                    <div className="md:flex-shrink-0">
                        <img className="h-48 w-full object-cover md:w-48" src={venues.image_url?.[0] || 'https://via.placeholder.com/150'} alt={venues.name} />
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="uppercase tracking-wide text-sm text-primary-green font-semibold">{facilityName} ({sportName})</p>
                                    <Link to={`/venue/${venues.venue_id}`} className="block mt-1 text-lg leading-tight font-bold text-dark-text hover:underline">{venues.name}</Link>
                                    <p className="mt-2 text-sm text-medium-text flex items-center gap-2"><FaMapMarkerAlt /> {venues.address}, {venues.city}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
                                    {status}
                                </span>
                            </div>
                            <div className="mt-4 flex flex-col gap-2 text-sm text-medium-text">
                                <p className="flex items-center gap-2"><FaCalendarAlt className="text-primary-green" /> {format(new Date(start_time), 'EEE, dd MMM yyyy')}</p>
                                <p className="flex items-center gap-2"><FaClock className="text-primary-green" /> {format(new Date(start_time), 'p')} - {format(new Date(end_time), 'p')}</p>
                            </div>
                        </div>
                        <div className="mt-4 border-t border-border-color-light pt-4 flex justify-between items-center">
                            <p className="text-xl font-bold text-dark-text">₹{total_amount}</p>
                            <div className="flex items-center gap-3">
                                {status === 'confirmed' && !isPastBooking && (
                                    <button
                                        onClick={handleCancel}
                                        disabled={isCancelling}
                                        className="py-2 px-4 rounded-lg font-semibold text-sm bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400"
                                    >
                                        {isCancelling ? 'Cancelling...' : 'Cancel'}
                                    </button>
                                )}
                                {canReview && (
                                    <button
                                        onClick={() => setShowReviewForm(true)}
                                        className="py-2 px-4 rounded-lg font-semibold text-sm bg-primary-green text-white shadow-sm hover:bg-primary-green-dark flex items-center gap-2"
                                    >
                                        <FaEdit /> Leave a Review
                                    </button>
                                )}
                                {has_been_reviewed && (
                                    <p className="flex items-center gap-2 text-sm font-semibold text-green-600">
                                      <FaCheckCircle /> Review Submitted
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showReviewForm && (
                <ReviewForm
                    booking={booking}
                    onClose={() => setShowReviewForm(false)}
                    onReviewSubmitted={() => {
                        setShowReviewForm(false);
                        onReviewSubmitted(); // This refreshes the booking list
                    }}
                />
            )}
        </>
    );
};

export default BookingCard;