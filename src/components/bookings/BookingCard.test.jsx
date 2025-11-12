// src/components/bookings/BookingCard.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';
import { BookingCard } from './BookingCard';

// 👇 **MOCK THE FORMATTERS UTILITY** 👇
// This intercepts the import and replaces it with our fake version.
vi.mock('../../utils/formatters', () => ({
  formatCurrency: (amount) => `₹${amount}`,
}));

describe('BookingCard Component', () => {
  const mockBooking = {
    booking_id: 1,
    start_time: '2023-10-27T10:00:00Z',
    end_time: '2023-10-27T11:00:00Z',
    total_amount: 1500,
    status: 'confirmed',
    facilities: {
      name: 'Main Football Turf',
      sports: { name: 'Football' },
      venues: {
        venue_id: 101,
        name: 'Grand Sports Arena',
        address: '123 Sports Lane, Sportsville',
        cancellation_cutoff_hours: 24,
      },
    },
    reviews: [],
  };

  it('should render all booking details correctly when a valid booking is provided', () => {
    render(
      <BrowserRouter>
        <BookingCard booking={mockBooking} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Grand Sports Arena/i)).toBeInTheDocument();
    expect(screen.getByText(/Main Football Turf/i)).toBeInTheDocument();
    
    // Now check against the mocked currency format
    expect(screen.getByText("₹1500")).toBeInTheDocument(); 
    
    expect(screen.getByText(/confirmed/i)).toBeInTheDocument();
  });

  it('should render unavailable message if booking is null or undefined', () => {
    render(
      <BrowserRouter>
        <BookingCard booking={null} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Booking information is currently unavailable/i)).toBeInTheDocument();
  });
});