import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, Tag, Landmark, MessageSquarePlus, X, XCircle, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '../../utils/formatters';
import ReviewForm from '../reviews/ReviewForm';

const BookingCard = ({ booking, onReviewSubmitted, onCancelBooking }) => {
  const [isReviewing, setIsReviewing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { facilities, start_time, end_time, total_amount, status, reviews } = booking || {};
  const venue = facilities?.venues;

  if (!booking || !venue || !facilities) {
    return (
      <div className="bg-card-bg rounded-lg shadow p-4 border border-border-color-light text-center">
        <p className="text-sm text-medium-text">Booking information unavailable</p>
      </div>
    );
  }

  const now = new Date();
  const bookingStartTime = new Date(start_time);
  const isUpcoming = bookingStartTime >= now;
  
  const canCancel = isUpcoming && status === 'confirmed';
  const canReview = status === 'completed' && (!reviews || reviews.length === 0);

  const getStatusClass = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  const handleReviewSuccess = () => {
    setIsReviewing(false);
    if (onReviewSubmitted) {
      onReviewSubmitted();
    }
  };

  const handleCancelClick = () => {
    setIsCancelling(true);
    setCancellationReason('');
  };

  const handleCancelConfirm = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    setIsProcessing(true);
    const success = await onCancelBooking(booking.booking_id, cancellationReason);
    setIsProcessing(false);
    
    if (success) {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <div className="bg-card-bg rounded-lg shadow-md border border-border-color-light overflow-hidden hover:shadow-lg transition-shadow">
        {/* Image Section - Smaller */}
        <div className="relative">
          <img
            src={venue.image_url?.[0] || 'https://via.placeholder.com/400x150?text=No+Image'}
            alt={venue.name}
            className="w-full h-32 object-cover"
          />
          <div className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusClass(status)}`}>
            {status.toUpperCase()}
          </div>
        </div>

        {/* Content Section - Compact */}
        <div className="p-4">
          {/* Venue Info - Compact */}
          <div className="mb-3">
            <p className="text-xs text-medium-text font-medium flex items-center gap-1.5 mb-1">
               <Landmark size={12} /> {facilities.name} • {facilities.sports?.name || 'General'}
            </p>
            <h3 className="text-base font-bold text-dark-text leading-tight mb-1">
              <Link to={`/venues/${venue.venue_id}`} className="hover:text-primary-green transition-colors line-clamp-1">
                  {venue.name}
              </Link>
            </h3>
            <p className="text-xs text-medium-text flex items-center gap-1.5 line-clamp-1">
              <MapPin size={12} /> {venue.address}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-border-color my-3"></div>

          {/* Booking Details - Compact Grid */}
          <div className="space-y-2 text-xs">
             <div className="flex items-center justify-between">
                  <span className="text-medium-text flex items-center gap-1.5">
                    <Calendar size={13}/> Date
                  </span>
                  <span className="font-semibold text-dark-text">{format(new Date(start_time), 'PP')}</span>
             </div>
             <div className="flex items-center justify-between">
                  <span className="text-medium-text flex items-center gap-1.5">
                    <Clock size={13}/> Time
                  </span>
                  <span className="font-semibold text-dark-text">
                    {format(new Date(start_time), 'p')} - {format(new Date(end_time), 'p')}
                  </span>
             </div>
             <div className="flex items-center justify-between">
                  <span className="text-medium-text flex items-center gap-1.5">
                    <Tag size={13}/> Amount
                  </span>
                  <span className="font-bold text-primary-green text-sm">{formatCurrency(total_amount)}</span>
             </div>
          </div>
          
          {/* Action Buttons - Compact */}
          {(canCancel || canReview) && (
            <div className="mt-3 pt-3 border-t border-border-color-light space-y-2">
              {canCancel && (
                <button
                  onClick={handleCancelClick}
                  className="w-full bg-red-500 text-white text-xs font-semibold py-2 rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-1.5"
                >
                  <XCircle size={14} />
                  Cancel Booking
                </button>
              )}
              
              {canReview && (
                <button
                  onClick={() => setIsReviewing(true)}
                  className="w-full bg-blue-500 text-white text-xs font-semibold py-2 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-1.5"
                >
                  <MessageSquarePlus size={14} />
                  Add Review
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Cancellation Confirmation Modal */}
      {isCancelling && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsCancelling(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
              disabled={isProcessing}
            >
              <X size={24} />
            </button>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="text-red-500" size={28} />
                <h2 className="text-xl font-bold text-gray-900">Cancel Booking</h2>
              </div>
              
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>Important:</strong>
                </p>
                <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                  <li>The time slot will be made available for others</li>
                  <li>Payment status remains as "Paid"</li>
                  <li>Request refund from venue owner directly</li>
                </ul>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-2 font-semibold">
                  Booking Details:
                </p>
                <p className="text-sm text-gray-900 font-semibold">
                  {venue.name}
                </p>
                <p className="text-sm text-gray-700">
                  {facilities.name} - {facilities.sports?.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {format(new Date(start_time), 'PPP')} at {format(new Date(start_time), 'p')}
                </p>
                <p className="text-sm text-green-600 font-semibold mt-1">
                  Amount: {formatCurrency(total_amount)}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Reason for Cancellation <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="e.g., Change of plans, found another venue..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows="3"
                  disabled={isProcessing}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsCancelling(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-semibold text-sm"
                  disabled={isProcessing}
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isProcessing || !cancellationReason.trim()}
                >
                  {isProcessing ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Review Form Overlay */}
      {isReviewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsReviewing(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
            >
              <X size={24} />
            </button>
            <div className="p-6">
               <h2 className="text-xl font-bold text-gray-900 mb-4">Review: {venue.name}</h2>
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