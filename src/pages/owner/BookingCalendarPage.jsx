import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaClock, FaFilter } from 'react-icons/fa';

const getDateStringForInput = (date) => new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

function BookingCalendarPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedVenueId, setSelectedVenueId] = useState('all');

  useEffect(() => {
    const fetchCalendarData = async () => {
      if (!user) { setLoading(false); return; }
      setLoading(true);
      setError(null);
      try {
        const { data: venuesData, error: venuesError } = await supabase
          .from('venues')
          .select('venue_id, name, opening_time, closing_time, facilities (*, sports(name))')
          .eq('owner_id', user.id)
          .eq('is_approved', true);
        if (venuesError) throw venuesError;
        setVenues(venuesData || []);

        const facilityIds = (venuesData || []).flatMap(v => (v.facilities || []).map(f => f.facility_id));
        if (facilityIds.length > 0) {
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select('*, users:users!bookings_user_id_fkey (username, first_name, last_name, email)')
            .in('facility_id', facilityIds);
            
          if (bookingsError) throw bookingsError;
          setBookings(bookingsData || []);
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCalendarData();
  }, [user]);

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
    return Array.from({ length: latestClose - earliestOpen }, (_, i) => earliestOpen + i);
  }, [venues, facilitiesToDisplay]);

  const changeDate = (days) => setCurrentDate(prev => {
    const newDate = new Date(prev);
    newDate.setDate(newDate.getDate() + days);
    return newDate;
  });

  const isSameDay = (d1, d2) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

  const getBookingForSlot = (facilityId, hour) => {
    return bookings.find(b => {
        if (!b?.start_time) return false;
        const bookingStartTime = new Date(b.start_time);
        return b.facility_id === facilityId && b.status === 'confirmed' && isSameDay(bookingStartTime, currentDate) && hour === bookingStartTime.getHours();
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
      <div className="text-center p-8 bg-card-bg rounded-2xl border border-border-color shadow-lg max-w-md">
        <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <FaCalendarAlt className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-xl font-semibold text-dark-text mb-2">Error Loading Calendar</h3>
        <p className="text-red-600">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-green to-primary-green-light">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <FaCalendarAlt className="text-white text-xl" />
            </div>
            <h1 className="text-3xl font-bold text-white">Booking Calendar</h1>
          </div>
          <p className="text-white/90 text-lg mb-6">View and manage all your facility bookings</p>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaCalendarAlt className="text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Today's Date</p>
                  <p className="text-white font-semibold">{currentDate.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaUser className="text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Today's Bookings</p>
                  <p className="text-white font-semibold text-xl">{todaysBookingsCount}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaMapMarkerAlt className="text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-sm">Active Venues</p>
                  <p className="text-white font-semibold text-xl">{venues.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Control Panel */}
        <div className="bg-card-bg rounded-2xl border border-border-color p-6 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Venue Filter */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-dark-text font-semibold">
                <FaFilter className="text-primary-green" />
                <span>Filter by Venue:</span>
              </div>
              <select 
                value={selectedVenueId} 
                onChange={(e) => setSelectedVenueId(e.target.value)} 
                className="px-4 py-3 border border-border-color rounded-xl text-dark-text bg-card-bg focus:outline-none focus:border-primary-green focus:ring-4 focus:ring-primary-green/10 transition-all duration-200 min-w-[200px]"
              >
                <option value="all">All Venues ({venues.length})</option>
                {venues.map(venue => (
                  <option key={venue.venue_id} value={venue.venue_id}>
                    {venue.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date Navigation */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => changeDate(-1)} 
                className="p-3 border border-border-color rounded-xl hover:bg-hover-bg hover:border-primary-green transition-all duration-200 group"
              >
                <FaChevronLeft className="text-medium-text group-hover:text-primary-green" />
              </button>
              
              <div className="px-6 py-3 bg-primary-green/10 rounded-xl border-2 border-primary-green/20">
                <input 
                  type="date" 
                  className="bg-transparent font-semibold text-center text-dark-text border-none outline-none cursor-pointer" 
                  value={getDateStringForInput(currentDate)} 
                  onChange={e => setCurrentDate(new Date(e.target.value))} 
                />
              </div>
              
              <button 
                onClick={() => changeDate(1)} 
                className="p-3 border border-border-color rounded-xl hover:bg-hover-bg hover:border-primary-green transition-all duration-200 group"
              >
                <FaChevronRight className="text-medium-text group-hover:text-primary-green" />
              </button>
            </div>
          </div>
          
          {/* Selected Date Display */}
          <div className="mt-6 pt-6 border-t border-border-color text-center">
            <h3 className="text-lg font-semibold text-dark-text">
              Schedule for {formatDate(currentDate)}
            </h3>
          </div>
        </div>

        {/* Calendar Content */}
        {facilitiesToDisplay.length === 0 ? (
          <div className="bg-card-bg rounded-2xl border border-border-color p-16 text-center shadow-sm">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-light-green-bg rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <FaMapMarkerAlt className="text-primary-green text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-dark-text mb-2">No Facilities Found</h3>
              <p className="text-medium-text">Please add facilities to your venues to view the booking calendar.</p>
            </div>
          </div>
        ) : (
          <div className="bg-card-bg rounded-2xl border border-border-color shadow-lg overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-primary-green/5 to-primary-green-light/5 border-b border-border-color">
              <div className="grid" style={{ gridTemplateColumns: `120px repeat(${facilitiesToDisplay.length}, minmax(200px, 1fr))` }}>
                <div className="p-6 flex items-center justify-center border-r border-border-color">
                  <div className="text-center">
                    <FaClock className="text-primary-green text-xl mx-auto mb-2" />
                    <span className="font-bold text-dark-text">Time</span>
                  </div>
                </div>
                {facilitiesToDisplay.map((facility, index) => (
                  <div key={facility.facility_id} className={`p-6 text-center ${index < facilitiesToDisplay.length - 1 ? 'border-r border-border-color' : ''}`}>
                    <div className="space-y-2">
                      <h4 className="font-bold text-dark-text text-lg">{facility.name}</h4>
                      <div className="inline-block px-3 py-1 bg-primary-green/10 text-primary-green rounded-full text-xs font-medium">
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
                    {/* Time Column */}
                    <div className={`p-6 flex items-center justify-center border-r border-border-color bg-hover-bg/50 ${hourIndex < hours.length - 1 ? 'border-b border-border-color' : ''}`}>
                      <div className="text-center">
                        <div className="font-semibold text-dark-text text-lg">{formatTime(hour)}</div>
                        <div className="text-xs text-medium-text">{hour}:00 - {hour + 1}:00</div>
                      </div>
                    </div>
                    
                    {/* Facility Columns */}
                    {facilitiesToDisplay.map((facility, facilityIndex) => {
                      const booking = getBookingForSlot(facility.facility_id, hour);
                      return (
                        <div 
                          key={`${facility.facility_id}-${hour}`} 
                          className={`p-4 min-h-[100px] transition-all duration-200 ${
                            facilityIndex < facilitiesToDisplay.length - 1 ? 'border-r border-border-color' : ''
                          } ${
                            hourIndex < hours.length - 1 ? 'border-b border-border-color' : ''
                          } ${
                            booking ? 'bg-light-green-bg' : 'hover:bg-hover-bg'
                          }`}
                        >
                          {booking ? (
                            <div className="bg-gradient-to-r from-primary-green to-primary-green-dark text-white p-4 rounded-xl shadow-md h-full flex flex-col justify-center transform hover:scale-105 transition-transform duration-200">
                              <div className="text-center space-y-2">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <FaUser className="text-white/80" />
                                </div>
                                <div className="font-bold text-lg">
                                  {booking.users?.first_name} {booking.users?.last_name || booking.users?.username}
                                </div>
                                {booking.users?.email && (
                                  <div className="text-white/80 text-xs truncate">
                                    {booking.users.email}
                                  </div>
                                )}
                                <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium capitalize">
                                  {booking.status}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full flex items-center justify-center text-light-text">
                              <div className="text-center space-y-1">
                                <div className="w-8 h-8 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
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
  );
}

export default BookingCalendarPage;