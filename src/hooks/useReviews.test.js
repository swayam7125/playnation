import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import useReviews from './useReviews';
import { supabase } from '../supabaseClient';

const mockQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  then: vi.fn(),
};

vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => mockQueryBuilder),
  },
}));

describe('useReviews Hook', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not fetch reviews if no venueId is provided', () => {
    const { result } = renderHook(() => useReviews());
    expect(supabase.from).not.toHaveBeenCalled();
    expect(result.current.reviews).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should fetch reviews successfully for a given venueId', async () => {
    const mockReviewsData = [{ id: 1, comment: 'Great place!' }];
    mockQueryBuilder.then.mockImplementation((callback) => callback({ data: mockReviewsData, error: null }));

    const { result } = renderHook(() => useReviews(123));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.reviews.length).toBe(1);
    });

    expect(result.current.reviews[0].comment).toBe('Great place!');
    expect(supabase.from).toHaveBeenCalledWith('reviews');
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith('venue_id', 123);
  });

  it('should handle errors when fetching reviews', async () => {
    const mockError = { message: 'Error fetching reviews' };
    mockQueryBuilder.then.mockImplementation((callback) => callback({ data: null, error: mockError }));

    const { result } = renderHook(() => useReviews(123));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.reviews).toEqual([]);
    expect(result.current.error).toBe(mockError.message);
  });
});