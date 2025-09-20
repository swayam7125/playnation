import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../AuthContext';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Helper to get a date in YYYY-MM-DD format for the input picker, respecting local timezone
const getDateStringForInput = (date) => {
  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
  return adjustedDate.toISOString().split('T')[0];
};

function BookingCalendarPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [venues, setVenues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  // Use a full Date object to manage the current day for reliable comparison
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedVenueId, setSelectedVenueId] = useState('all');

  useEffect(() => {
    const fetchCalendarData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log('Fetching venues for user:', user.id);
        // Fetch venues owned by the user with operating hours
        const { data: venuesData, error: venuesError } = await supabase
          .from('venues')
          .select('venue_id, name, opening_time, closing_time, facilities (*, sports(name))')
          .eq('owner_id', user.id);

        if (venuesError) {
          console.error('Venues error:', venuesError);
          throw venuesError;
        }

        setVenues(venuesData || []);

        // Fetch bookings for all facilities owned by this user
        const facilityIds = (venuesData || []).flatMap(v =>
          (v.facilities || []).map(f => f.facility_id)
        );

        if (facilityIds.length > 0) {
          // First, get bookings
          const { data: bookingsData, error: bookingsError } = await supabase
            .from('bookings')
            .select('*')
            .in('facility_id', facilityIds);

          if (bookingsError) {
            console.error('Bookings error:', bookingsError);
            throw bookingsError;
          }

          // Then get user details securely using RPC
          let enrichedBookings = bookingsData || [];
          if (enrichedBookings.length > 0) {
            const userIds = [...new Set(enrichedBookings.map(b => b.user_id))].filter(Boolean);

            if (userIds.length > 0) {
              try {
                // Fetch user details securely using the RPC function, bypassing RLS issues
                const { data: usersData, error: usersError } = await supabase
                  .rpc('get_public_profiles_for_owner', {
                    user_ids: userIds // Passing the array of user IDs to the function
                  });

                if (usersError) throw usersError;

                if (usersData) {
                  enrichedBookings = enrichedBookings.map(booking => ({
                    ...booking,
                    users: usersData.find(u => u.user_id === booking.user_id)
                  }));
                } else {
                  // Fallback if RPC succeeds but returns no data 
                  enrichedBookings = enrichedBookings.map(booking => ({
                    ...booking,
                    users: { username: 'Unknown User' }
                  }));
                }
              } catch (userFetchError) {
                console.warn('Could not fetch user details securely:', userFetchError);
                // Continue without user details
                enrichedBookings = enrichedBookings.map(booking => ({
                  ...booking,
                  users: { username: 'Unknown User' }
                }));
              }
            }
          }

          setBookings(enrichedBookings);
        } else {
          setBookings([]);
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
    try {
      if (selectedVenueId === 'all') {
        return venues.flatMap(v => v.facilities || []);
      }
      const selectedVenue = venues.find(v => v.venue_id === selectedVenueId);
      return selectedVenue?.facilities || [];
    } catch (error) {
      console.error('Error in facilitiesToDisplay:', error);
      return [];
    }
  }, [venues, selectedVenueId]);

  // Generate hours based on venue operating times
  const hours = useMemo(() => {
    if (facilitiesToDisplay.length === 0) return [];

    // Get unique venue IDs from facilities to display
    const venueIds = [...new Set(facilitiesToDisplay.map(f => f.venue_id))];

    // Find the earliest opening time and latest closing time among selected venues
    let earliestOpen = 24; // Start with latest possible
    let latestClose = 0;   // Start with earliest possible

    venueIds.forEach(venueId => {
      const venue = venues.find(v => v.venue_id === venueId);
      if (venue && venue.opening_time && venue.closing_time) {
        // Parse time strings (assuming format like "06:00" or "18:00")
        const openHour = parseInt(venue.opening_time.split(':')[0]);
        const closeHour = parseInt(venue.closing_time.split(':')[0]);

        earliestOpen = Math.min(earliestOpen, openHour);
        latestClose = Math.max(latestClose, closeHour);
      }
    });

    // Fallback to default hours if no operating times found
    if (earliestOpen === 24 || latestClose === 0) {
      earliestOpen = 6;  // 6 AM default
      latestClose = 23;  // 11 PM default
    }

    // Generate array of hours from opening to closing
    const hourRange = [];
    for (let i = earliestOpen; i < latestClose; i++) {
      hourRange.push(i);
    }

    return hourRange;
  }, [venues, facilitiesToDisplay]);

  const handleDateChange = (e) => {
    try {
      // Create date object correctly, accounting for timezone offset from the input string
      const date = new Date(e.target.value);
      const timezoneOffset = date.getTimezoneOffset() * 60000;
      setCurrentDate(new Date(date.getTime() + timezoneOffset));
    } catch (error) {
      console.error('Error changing date:', error);
    }
  };

  const goToPreviousDay = () => {
    try {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() - 1);
        return newDate;
      });
    } catch (error) {
      console.error('Error going to previous day:', error);
    }
  };

  const goToNextDay = () => {
    try {
      setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setDate(newDate.getDate() + 1);
        return newDate;
      });
    } catch (error) {
      console.error('Error going to next day:', error);
    }
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    try {
      return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
    } catch (error) {
      console.error('Error comparing dates:', error);
      return false;
    }
  };

  // Helper function to get booking for a specific facility and time slot
  const getBookingForSlot = (facilityId, hour) => {
    try {
      return bookings.find(booking => {
        if (!booking || !booking.start_time || !booking.end_time) {
          return false;
        }

        const bookingStartTime = new Date(booking.start_time);
        const bookingEndTime = new Date(booking.end_time);

        // Check if booking is on the current date
        const isCurrentDay = isSameDay(bookingStartTime, currentDate);

        // Check if the hour falls within the booking time range
        const bookingStartHour = bookingStartTime.getHours();
        const bookingEndHour = bookingEndTime.getHours();

        // Handle bookings that span multiple hours
        const isInTimeRange = hour >= bookingStartHour && hour < bookingEndHour;

        return booking.facility_id === facilityId &&
          isCurrentDay &&
          isInTimeRange &&
          booking.status === 'confirmed';
      });
    } catch (error) {
      console.error('Error getting booking for slot:', error);
      return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container dashboard-page">
        <p className="loading-message">Loading Calendar...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container dashboard-page">
        <h1 className="section-heading">Booking Calendar</h1>
        <p className="error-message">
          Error: {error}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary reload-button"
        >
          Reload Page
        </button>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <div className="container dashboard-page">
        <h1 className="section-heading">Booking Calendar</h1>
        <p className="info-message">
          Please log in to see your calendar.
        </p>
      </div>
    );
  }

  // No venues
  if (venues.length === 0) {
    return (
      <div className="container dashboard-page">
        <h1 className="section-heading calendar-main-heading">
          Booking Calendar
        </h1>
        <p className="info-message">
          No venues found. Please add venues and facilities first.
        </p>
      </div>
    );
  }

  return (
    <div className="container dashboard-page">
      <h1 className="section-heading">Booking Calendar</h1>

      <div className="calendar-controls">
        <div className="form-group">
          <select
            value={selectedVenueId}
            onChange={(e) => setSelectedVenueId(e.target.value)}
            className="calendar-venue-select"
          >
            <option value="all">All Venues</option>
            {venues.map(venue => (
              <option key={venue.venue_id} value={venue.venue_id}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>
        <div className="date-controls">
          <button onClick={goToPreviousDay} className="btn btn-secondary">
            <FaChevronLeft />
          </button>
          <input
            type="date"
            className="calendar-date-picker"
            value={getDateStringForInput(currentDate)}
            onChange={handleDateChange}
          />
          <button onClick={goToNextDay} className="btn btn-secondary">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {facilitiesToDisplay.length === 0 ? (
        <p className="info-message">
          No facilities available for the selected venue.
        </p>
      ) : hours.length === 0 ? (
        <p className="info-message">
          No operating hours found for the selected venues. Please check venue settings.
        </p>
      ) : (
        <div className="calendar-grid-container">
          <div 
            className="calendar-grid"
            style={{
              '--facility-count': facilitiesToDisplay.length
            }}
          >
            <div className="calendar-header time-header">Time</div>
            {facilitiesToDisplay.map(facility => (
              <div key={facility.facility_id} className="calendar-header facility-header">
                {facility.name}
                <span className="facility-sport-tag">
                  {facility.sports?.name || 'Unknown Sport'}
                </span>
              </div>
            ))}

            {hours.map(hour => (
              <React.Fragment key={hour}>
                <div className="time-slot-label">
                  {hour === 0 ? '12:00 AM' :
                    hour < 12 ? `${hour}:00 AM` :
                      hour === 12 ? '12:00 PM' :
                        `${hour - 12}:00 PM`}
                </div>
                {facilitiesToDisplay.map(facility => {
                  const booking = getBookingForSlot(facility.facility_id, hour);
                  return (
                    <div
                      key={`${facility.facility_id}-${hour}`}
                      className={`calendar-slot ${booking ? 'booked' : 'free'}`}
                    >
                      {booking && (
                        <div className="booking-info">
                          <span className="booking-user">
                            {booking.users?.first_name && booking.users?.last_name 
                              ? `${booking.users.first_name} ${booking.users.last_name}`
                              : booking.users?.username || 
                                'Unknown User'}
                          </span>
                          <br />
                          <span className="booking-time">
                            {new Date(booking.start_time).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })} - {new Date(booking.end_time).toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                          <br />
                          <span className="booking-status-tag">
                            {booking.status}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}


    </div>
  );
}

export default BookingCalendarPage;