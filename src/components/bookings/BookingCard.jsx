import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Tag, Landmark, MessageSquarePlus, X } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import ReviewForm from '../reviews/ReviewForm'; // This uses your existing form

const BookingCard = ({ booking, onReviewSubmitted }) => {
  const [isReviewing, setIsReviewing] = useState(false);
  
  const { facilities, start_time, total_amount, status, reviews } = booking || {};
  const venue = facilities?.venues;

  // --- DEBUGGING ---
  // This log will print information for each booking to your browser's console (F12)
  // It will help you see exactly why the "Add Review" button is or isn't showing.
  console.log(`Checking review status for booking at ${venue?.name}:`, {
    status: status,
    hasReview: reviews?.length > 0,
    canReview: status === 'completed' && (!reviews || reviews.length === 0),
  });
  // --- END DEBUGGING ---

  if (!booking || !venue || !facilities) {
    return (
      <div className="bg-card-bg rounded-xl shadow-md p-6 border border-border-color-light text-center">
        <p className="text-medium-text">Booking information is unavailable.</p>
      </div>
    );
  }

  // Simplified and more reliable logic for showing the button
  const canReview = status === 'completed' && (!reviews || reviews.length === 0);

  const getStatusClass = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleReviewSuccess = () => {
    setIsReviewing(false);
    if (onReviewSubmitted) {
      onReviewSubmitted();
    }
  };

  return (
    <>
      <div className="bg-card-bg rounded-xl shadow-lg border border-border-color-light overflow-hidden flex flex-col h-full">
        <div className="relative">
          <img
            src={venue.image_url?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
            alt={venue.name}
            className="w-full h-48 object-cover"
          />
          <div className={`absolute top-2 right-2 px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(status)}`}>
            {status.toUpperCase()}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <div className="mb-4">
            <p className="text-sm text-medium-text font-semibold flex items-center gap-2">
               <Landmark size={14} /> {facilities.name} ({facilities.sports?.name || 'General'})
            </p>
            <h3 className="text-xl font-bold text-dark-text truncate">
              <Link to={`/venues/${venue.venue_id}`} className="hover:text-primary-green transition-colors">
                  {venue.name}
              </Link>
            </h3>
            <p className="text-xs text-medium-text flex items-center gap-2 mt-1">
              <MapPin size={14} /> {venue.address}
            </p>
          </div>

          <div className="border-t border-border-color my-4"></div>

          <div className="space-y-3 text-sm flex-grow">
             <div className="flex items-center justify-between">
                  <span className="font-semibold text-medium-text flex items-center gap-2"><Calendar size={16}/> Date</span>
                  <span className="font-bold text-dark-text">{format(new Date(start_time), 'PPP')}</span>
             </div>
             <div className="flex items-center justify-between">
                  <span className="font-semibold text-medium-text flex items-center gap-2"><Clock size={16}/> Time</span>
                  <span className="font-bold text-dark-text">{`${format(new Date(booking.start_time), 'p')} - ${format(new Date(booking.end_time), 'p')}`}</span>
             </div>
             <div className="flex items-center justify-between">
                  <span className="font-semibold text-medium-text flex items-center gap-2"><Tag size={16}/> Amount Paid</span>
                  <span className="font-bold text-primary-green text-base">{formatCurrency(total_amount)}</span>
             </div>
          </div>
          
          {canReview && (
            <div className="mt-4 pt-4 border-t border-border-color-light">
              <button
                onClick={() => setIsReviewing(true)}
                className="w-full bg-blue-500 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <MessageSquarePlus size={16} />
                Add Review
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Review Form Overlay that uses your ReviewForm component */}
      {isReviewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-xl shadow-2xl w-full max-w-lg relative">
            <button 
              onClick={() => setIsReviewing(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <div className="p-6">
               <h2 className="text-xl font-bold text-dark-text mb-4">Reviewing: {venue.name}</h2>
               <ReviewForm
                bookingId={booking.booking_id}
                venueId={venue.venue_id}
                userId={booking.user_id}
                onClose={() => setIsReviewing(false)}
                onReviewSubmitted={handleReviewSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;