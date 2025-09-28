import { render, screen } from '@testing-library/react';
import BookingCard from './BookingCard';

test('renders booking information correctly', () => {
  const booking = {
    facilities: {
      venues: { name: 'Test Venue' },
      name: 'Test Facility',
      sports: { name: 'Test Sport' },
    },
    start_time: '2025-10-01T10:00:00.000Z',
    end_time: '2025-10-01T11:00:00.000Z',
    total_amount: 1000,
    status: 'confirmed',
  };

  render(<BookingCard booking={booking} />);

  expect(screen.getByText('Test Venue')).toBeInTheDocument();
  expect(screen.getByText('Test Facility (Test Sport)')).toBeInTheDocument();
  expect(screen.getByText(/10:00 AM - 11:00 AM/)).toBeInTheDocument();
  expect(screen.getByText('₹1000')).toBeInTheDocument();
});