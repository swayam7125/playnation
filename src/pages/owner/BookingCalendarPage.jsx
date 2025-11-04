import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
// Added more colorful icons for status
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaClock, FaFilter, FaRedo, FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaMoneyBillWave } from 'react-icons/fa';
import DownloadInvoiceButton from '../../components/common/DownloadInvoiceButton';

const getDateStringForInput = (date) => new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

// --- Custom Refund Modal Component (Unchanged) ---
const RefundConfirmationModal = ({ booking, onConfirm, onCancel }) => {
  if (!booking) return null;

  const { cancellation_reason } = booking;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full m-4 p-8 transform transition-all duration-300 scale-100 border-t-4 border-red-600">
        <div className="flex items-center space-x-4 mb-5">
          <FaExclamationTriangle className="text-red-600 text-3xl" />
          <h3 className="text-2xl font-bold text-dark-text">Confirm Refund</h3>
        </div>
        
        <p className="text-medium-text mb-4 leading-relaxed">
          You are about to process a **full refund** for the following cancelled booking. **This action cannot be undone.**
        </p>
        
        <div className="bg-red-50 p-4 rounded-xl border border-red-200 mb-6 space-y-2">
          <p className="text-sm"><strong>Customer:</strong> {booking.users?.first_name} {booking.users?.last_name || booking.users?.username}</p>
          <p className="text-sm"><strong>Booking ID:</strong> <span className="text-xs text-gray-700 truncate">{booking.booking_id}</span></p>
          
          {cancellation_reason && (
            <div className='pt-2 mt-2 border-t border-red-100'>
              <p className="text-sm font-semibold text-red-700 flex items-center gap-1">
                <FaTimesCircle className='w-4 h-4'/> Cancellation Reason:
              </p>
              <p className="text-sm text-gray-700 italic">"{cancellation_reason}"</p>
            </div>
          )}
          
          <p className="text-2xl font-extrabold text-red-600 pt-3 flex items-center gap-2">
            <FaMoneyBillWave className='w-5 h-5'/> ₹{booking.total_amount ? booking.total_amount.toLocaleString("en-IN") : 'N/A'}
          </p>
          <p className="text-xs text-red-500 font-medium mt-2">
            ⚠️ Final Step: You must ensure the actual refund is processed through your payment gateway.
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-xl text-medium-text font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(booking)}
            className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg shadow-red-300/50"
          >
            Yes, Process Refund
          </button>
        </div>
      </div>
    </div>
  );
};
// --- END: Custom Refund Modal Component ---

function BookingCalendarPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedVenueId, setSelectedVenueId] = useState('all');
  const [bookingToRefund, setBookingToRefund] = useState(null); 

  // Refactored fetch function to be reusable
  const fetchCalendarData = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      // Fetch venues
      const { data: venuesData, error: venuesError } = await supabase
        .from('venues')
        .select('venue_id, name, opening_time, closing_time, facilities (*, sports(name))')
        .eq('owner_id', user.id)
        .eq('is_approved', true);
      if (venuesError) throw venuesError;
      setVenues(venuesData || []);

      // Fetch bookings for all facilities owned
      const facilityIds = (venuesData || []).flatMap(v => (v.facilities || []).map(f => f.facility_id));
      if (facilityIds.length > 0) {
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          // Ensure cancellation_reason is selected here
          .select('booking_id, user_id, facility_id, slot_id, start_time, end_time, total_amount, status, payment_status, customer_name, customer_phone, created_at, has_been_reviewed, cancelled_at, cancelled_by, cancellation_reason, offer_id, discount_amount, users:users!bookings_user_id_fkey (username, first_name, last_name, email)')
          .in('facility_id', facilityIds)
          .order('start_time', { ascending: true }); 
          
        if (bookingsError) throw bookingsError;
        setBookings(bookingsData || []);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]); 

  // useEffect now uses the reusable fetch function
  useEffect(() => {
    fetchCalendarData();
  }, [user, fetchCalendarData]);

  // --- UPDATED REFUND HANDLER for robust error checking ---
  const confirmRefundAction = async (booking) => {
    setBookingToRefund(null); // Close the modal immediately
    setLoading(true);
    try {
      // Call the assumed backend RPC function to handle the refund
      const { data, error } = await supabase.rpc('process_booking_refund', {
        booking_id_in: booking.booking_id,
        refund_amount_in: booking.total_amount 
      });

      if (error) throw error;

      // FIX for ENUM error: Check for successful refund status from the RPC response
      const rpcStatus = data?.[0]?.status || data?.[0]?.payment_status;

      if (rpcStatus === 'refunded') {
        alert(`Refund processed successfully for Booking ID: ${booking.booking_id}.`);
      } else {
        // Show detailed error if the RPC did not return the expected success status
        alert(`Refund attempted, but the status is uncertain or the RPC returned an error. Message: ${data?.[0]?.message || 'Unknown error.'}`);
      }

      // Re-fetch data to update the calendar view
      await fetchCalendarData();

    } catch (error) {
      console.error("Error processing refund:", error);
      alert(`Refund failed: ${error.message}. Please check console for details.`);
    } finally {
      setLoading(false);
    }
  };
  
  // --- NEW: function to open the modal ---
  const handleRefundClick = (booking) => {
    setBookingToRefund(booking);
  };
  // -------------------------


  const facilitiesToDisplay = useMemo(() => {
    if (selectedVenueId === 'all') return venues.flatMap(v => v.facilities || []);
    return venues.find(v => v.venue_id === selectedVenueId)?.facilities || [];
  }, [venues, selectedVenueId]);

  const hours = useMemo(() => {
    if (facilitiesToDisplay.length === 0) return [];
    const venueIds = [...new Set(facilitiesToDisplay.map(f => f.venue_id))];
    let earliestOpen = 24, latestClose = 0;
    venueIds.forEach(venueId => {
        const venue = venues.find(v => v.venue_id === venueId);
        if (venue?.opening_time && venue?.closing_time) {
            earliestOpen = Math.min(earliestOpen, parseInt(venue.opening_time.split(':')[0]));
            latestClose = Math.max(latestClose, parseInt(venue.closing_time.split(':')[0]));
        }
    });
    if (earliestOpen === 24) { earliestOpen = 6; latestClose = 23; }
    return Array.from({ length: latestClose - earliestOpen + 1 }, (_, i) => earliestOpen + i);
  }, [venues, facilitiesToDisplay]);

  const changeDate = (days) => setCurrentDate(prev => {
    const newDate = new Date(prev);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  });

  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  const isToday = isSameDay(currentDate, new Date());

  const getBookingForSlot = (facilityId, hour) => {
    return bookings.find(b => {
        if (!b?.start_time) return false;
        const bookingStartTime = new Date(b.start_time);
        const isRelevantStatus = b.status === 'confirmed' || b.status === 'cancelled' || b.status === 'refunded';
        return b.facility_id === facilityId && isRelevantStatus && isSameDay(bookingStartTime, currentDate) && hour === bookingStartTime.getHours();
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (hour) => {
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const period = hour < 12 || hour === 24 ? 'AM' : 'PM';
    return `${displayHour}:00 ${period}`;
  };

  const todaysBookingsCount = bookings.filter(b => {
    if (!b?.start_time) return false;
    const bookingDate = new Date(b.start_time);
    return isSameDay(bookingDate, currentDate) && b.status === 'confirmed';
  }).length;


  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
        <p className="text-medium-text font-medium">Loading your booking calendar...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center p-8 bg-card-bg rounded-2xl border border-red-300 shadow-lg max-w-md">
        <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <FaCalendarAlt className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-dark-text mb-2">Error Loading Calendar</h3>
        <p className="text-red-600">{error}</p>
        <button onClick={fetchCalendarData} className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <FaRedo /> <span>Retry Fetch</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      
      {/* RENDER THE MODAL HERE */}
      <RefundConfirmationModal 
        booking={bookingToRefund}
        onConfirm={confirmRefundAction}
        onCancel={() => setBookingToRefund(null)}
      />
      
      {/* 🌟 Outer container for alignment 🌟 */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">

        {/* 🌟 Header Section (Green Stripe) 🌟 */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary-green via-primary-green-dark to-primary-green rounded-2xl shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/10"></div>
          
          <div className="relative px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 p-3 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaCalendarAlt className="text-white text-2xl" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">Schedule Dashboard</h1>
                  <p className="text-white/80 text-sm">Real-time management for all your facility bookings</p>
                </div>
              </div>
              {/* Today Button - Conditional styling for clear visual feedback */}
              <button 
                  onClick={() => setCurrentDate(new Date())} 
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-md ${
                      isToday 
                          ? 'bg-white text-primary-green' 
                          : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
              >
                  {isToday ? 'Viewing Today' : 'Go To Today'}
              </button>
            </div>
            
            {/* Stats Cards - Aligned below the header text */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              
              {/* Card 1: Date View */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:scale-[1.02] transition-transform duration-200 shadow-md">
                <p className="text-white/70 text-sm font-medium uppercase tracking-wider">Date View</p>
                <div className="flex items-center gap-2 mt-1">
                  <FaCalendarAlt className="text-white/80 w-5 h-5" />
                  <p className="text-white font-semibold text-xl">{currentDate.toLocaleDateString()}</p>
                </div>
              </div>
              
              {/* Card 2: Confirmed Bookings */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:scale-[1.02] transition-transform duration-200 shadow-md">
                <p className="text-white/70 text-sm font-medium uppercase tracking-wider">Confirmed Bookings</p>
                <div className="flex items-center gap-2 mt-1">
                  <FaCheckCircle className="text-light-green-bg w-5 h-5" />
                  <p className="text-white font-semibold text-2xl">{todaysBookingsCount}</p>
                </div>
              </div>
              
              {/* Card 3: Active Facilities */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:scale-[1.02] transition-transform duration-200 shadow-md">
                <p className="text-white/70 text-sm font-medium uppercase tracking-wider">Active Facilities</p>
                <div className="flex items-center gap-2 mt-1">
                  <FaMapMarkerAlt className="text-white/80 w-5 h-5" />
                  <p className="text-white font-semibold text-2xl">{facilitiesToDisplay.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* The rest of the content remains within the mx-auto container */}
        <div className="py-8">
          
          {/* 🌟 Control Panel 🌟 */}
          <div className="bg-white rounded-2xl border border-border-color p-6 shadow-2xl mb-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              
              {/* Date Navigation Block */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => changeDate(-1)} 
                  className="p-3 border border-border-color rounded-xl hover:bg-hover-bg hover:border-primary-green transition-all duration-200 group shadow-md"
                  aria-label="Previous Day"
                >
                  <FaChevronLeft className="text-medium-text group-hover:text-primary-green" />
                </button>
                
                {/* DATE INPUT FIX HERE */}
                <div className="relative flex items-center border border-border-color rounded-xl bg-white focus-within:border-primary-green focus-within:ring-4 focus-within:ring-primary-green/10 transition-all duration-200">
                  <input 
                    type="date" 
                    className="px-4 py-3 text-dark-text font-semibold text-center outline-none cursor-pointer w-40 bg-transparent opacity-0 absolute inset-0" 
                    value={getDateStringForInput(currentDate)} 
                    onChange={e => setCurrentDate(new Date(e.target.value))} 
                  />
                  
                  {/* Visual wrapper for the date text and icon */}
                  <div className="flex items-center justify-center space-x-2 px-4 py-3 w-40 pointer-events-none">
                      <span className="text-dark-text font-semibold">
                          {getDateStringForInput(currentDate).split('-').reverse().join('-')}
                      </span>
                      <FaCalendarAlt className="text-primary-green w-5 h-5" />
                  </div>
                </div>
                {/* END DATE INPUT FIX */}
                
                <button 
                  onClick={() => changeDate(1)} 
                  className="p-3 border border-border-color rounded-xl hover:bg-hover-bg hover:border-primary-green transition-all duration-200 group shadow-md"
                  aria-label="Next Day"
                >
                  <FaChevronRight className="text-medium-text group-hover:text-primary-green" />
                </button>
              </div>

              {/* Venue Filter Block */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-dark-text font-semibold">
                  <FaFilter className="text-primary-green" />
                  <span>Filter by Venue:</span>
                </div>
                <select 
                  value={selectedVenueId} 
                  onChange={(e) => setSelectedVenueId(e.target.value)} 
                  className="px-4 py-3 border border-border-color rounded-xl text-dark-text bg-white focus:outline-none focus:border-primary-green focus:ring-4 focus:ring-primary-green/10 transition-all duration-200 min-w-[200px] shadow-sm"
                >
                  <option value="all">All Venues ({venues.length})</option>
                  {venues.map(venue => (
                    <option key={venue.venue_id} value={venue.venue_id}>
                      {venue.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Selected Date Display */}
            <div className="mt-6 pt-6 border-t border-border-color text-center">
              <h3 className="text-xl font-bold text-dark-text">
                Viewing Schedule for <span className="text-primary-green">{formatDate(currentDate)}</span>
              </h3>
            </div>
          </div>
          
          {/* Calendar Content */}
          {facilitiesToDisplay.length === 0 ? (
            <div className="bg-white rounded-2xl border border-border-color p-16 text-center shadow-2xl">
              <div className="max-w-md mx-auto">
                <div className="p-4 bg-light-green-bg rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <FaMapMarkerAlt className="text-primary-green text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-dark-text mb-2">No Facilities Found</h3>
                <p className="text-medium-text">Please add facilities to your venues to view the booking calendar.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border-color shadow-2xl overflow-hidden">
              {/* Calendar Header */}
              <div className="bg-primary-green/10 border-b-2 border-primary-green/30">
                <div className="grid" style={{ gridTemplateColumns: `120px repeat(${facilitiesToDisplay.length}, minmax(200px, 1fr))` }}>
                  <div className="p-4 flex flex-col items-center justify-center border-r border-border-color bg-primary-green/10">
                    <FaClock className="text-primary-green text-xl mb-1" />
                    <span className="font-extrabold text-dark-text text-sm uppercase">Time Slot</span>
                  </div>
                  {facilitiesToDisplay.map((facility, index) => (
                    <div key={facility.facility_id} className={`p-4 text-center bg-primary-green/5 ${index < facilitiesToDisplay.length - 1 ? 'border-r border-border-color' : ''}`}>
                      <div className="space-y-1">
                        <h4 className="font-bold text-dark-text text-lg">{facility.name}</h4>
                        <div className="inline-flex items-center px-3 py-0.5 bg-primary-green/20 text-dark-text/80 rounded-full text-xs font-medium">
                          {facility.sports?.name || 'Sport'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar Body */}
              <div className="overflow-x-auto">
                <div className="grid" style={{ gridTemplateColumns: `120px repeat(${facilitiesToDisplay.length}, minmax(200px, 1fr))` }}>
                  {hours.map((hour, hourIndex) => (
                    <React.Fragment key={hour}>
                      {/* Time Column - Enhanced BG for time tracking */}
                      <div className={`p-4 flex flex-col items-center justify-center border-r border-border-color ${isToday && hour === new Date().getHours() ? 'bg-yellow-50 font-extrabold border-l-4 border-yellow-500' : 'bg-gray-50'} ${hourIndex < hours.length - 1 ? 'border-b border-border-color' : ''}`}>
                        <div className="text-center">
                          <div className={`font-semibold text-dark-text text-md ${isToday && hour === new Date().getHours() ? 'text-yellow-800' : ''}`}>{formatTime(hour)}</div>
                          <div className="text-xs text-medium-text">{hour}:00 - {hour + 1}:00</div>
                        </div>
                      </div>
                      
                      {/* Facility Columns */}
                      {facilitiesToDisplay.map((facility, facilityIndex) => {
                        const booking = getBookingForSlot(facility.facility_id, hour);
                        
                        const isCancelled = booking && booking.status === 'cancelled';
                        const isRefunded = booking && booking.payment_status === 'refunded';
                        const isConfirmed = booking && booking.status === 'confirmed';
                        const isRefundable = isCancelled && !isRefunded;

                        let slotBg = 'hover:bg-hover-bg';
                        let cardStyle = '';
                        let statusIcon = null;
                        
                        if (isConfirmed) {
                            slotBg = 'bg-primary-green-light/5';
                            cardStyle = 'bg-gradient-to-br from-primary-green to-primary-green-dark shadow-xl shadow-green-200/50 text-white';
                            statusIcon = <FaCheckCircle className="text-white/90" />;
                        } else if (isRefunded) {
                            slotBg = 'bg-gray-100';
                            cardStyle = 'bg-gray-500 shadow-lg text-white';
                            statusIcon = <FaMoneyBillWave className="text-white/90" />;
                        } else if (isCancelled) {
                            slotBg = 'bg-red-50'; 
                            cardStyle = 'bg-red-600 shadow-xl shadow-red-200/50 text-white';
                            statusIcon = <FaTimesCircle className="text-white/90" />;
                        }

                        return (
                          <div 
                            key={`${facility.facility_id}-${hour}`} 
                            className={`p-2 min-h-[100px] transition-all duration-200 ${
                              facilityIndex < facilitiesToDisplay.length - 1 ? 'border-r border-border-color' : ''
                            } ${
                              hourIndex < hours.length - 1 ? 'border-b border-border-color' : ''
                            } ${slotBg}`}
                          >
                            {booking ? (
                              <div className={`${cardStyle} p-3 rounded-xl h-full flex flex-col justify-between transform hover:scale-[1.03] transition-transform duration-200 border-2 border-transparent hover:border-white/50 cursor-pointer`}>
                                <div className="text-center space-y-1">
                                  <div className="flex items-center justify-center gap-2 mb-1">
                                    {statusIcon}
                                  </div>
                                  <div className="font-bold text-sm leading-tight truncate">
                                    {booking.users?.first_name} {booking.users?.last_name || booking.users?.username}
                                  </div>
                                  <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize 
                                    ${isConfirmed ? 'bg-white/30' : 'bg-white/40'}`}
                                  >
                                    {isRefunded ? 'Refunded' : (isCancelled ? 'Cancelled' : booking.status)}
                                  </div>
                                  <div className="text-sm font-semibold mt-1">
                                    ₹{booking.total_amount ? booking.total_amount.toLocaleString("en-IN") : 'N/A'}
                                  </div>
                                </div>
                                
                                {/* REFUND OPTION */}
                                {isRefundable && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleRefundClick(booking); }}
                                    className="mt-2 w-full flex items-center justify-center space-x-1 px-2 py-1 bg-white/95 text-red-600 rounded-lg text-xs font-semibold hover:bg-white transition-all duration-200 shadow-md"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Issue Refund</span>
                                  </button>
                                )}
                                {/* DOWNLOAD INVOICE BUTTON */}
                                {isConfirmed && (
                                  <DownloadInvoiceButton bookingId={booking.booking_id} />
                                )}
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-light-text">
                                <div className="text-center space-y-1">
                                  <div className="w-6 h-6 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                  </div>
                                  <div className="text-xs">Available</div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingCalendarPage;