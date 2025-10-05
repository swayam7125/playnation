import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import useVenues from './useVenues';
import { supabase } from '../supabaseClient';

// This is the advanced mock that handles chained Supabase queries.
// Each method returns `this` to allow for chaining.
const mockQueryBuilder = {
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  or: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  // The final method in the chain resolves the promise
  then: vi.fn(), 
};

vi.mock('../supabaseClient', () => ({
  supabase: {
    from: vi.fn(() => mockQueryBuilder),
  },
}));

describe('useVenues Hook', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
  });

  it('should fetch and return a list of venues successfully', async () => {
    const mockVenues = [{ id: 1, name: 'Grand Arena' }];
    // Mock the final resolution of the query chain
    mockQueryBuilder.then.mockImplementation((callback) => callback({ data: mockVenues, error: null }));

    const { result } = renderHook(() => useVenues());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.venues.length).toBe(1);
    });

    expect(result.current.venues[0].name).toBe('Grand Arena');
    expect(result.current.error).toBe(null);
  });

  it('should handle errors when fetching venues', async () => {
    const mockError = { message: 'Failed to fetch venues' };
    // Mock the final resolution of the query chain to return an error
    mockQueryBuilder.then.mockImplementation((callback) => callback({ data: null, error: mockError }));

    const { result } = renderHook(() => useVenues());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.venues).toEqual([]);
    expect(result.current.error).toBe(mockError.message);
  });
});

describe('useVenues Hook with Filtering and Sorting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should apply a search term filter to the query', async () => {
    const mockVenues = [{ id: 1, name: 'Search Result Venue' }];
    mockQueryBuilder.then.mockImplementation((callback) => callback({ data: mockVenues, error: null }));

    // Render the hook with a searchTerm option
    renderHook(() => useVenues({ searchTerm: 'Result' }));

    // Wait for the hook to finish loading
    await waitFor(() => {
      expect(mockQueryBuilder.or).toHaveBeenCalledWith('name.ilike.%result%,address.ilike.%result%,description.ilike.%result%');
    });
  });

  it('should apply a sorting option to the query', async () => {
    const mockVenues = [{ id: 1, name: 'A Venue' }];
    mockQueryBuilder.then.mockImplementation((callback) => callback({ data: mockVenues, error: null }));

    // Render the hook with a sortBy option
    renderHook(() => useVenues({ sortBy: 'name' }));

    await waitFor(() => {
      // Check that the 'order' method was called with the correct parameters
      expect(mockQueryBuilder.order).toHaveBeenCalledWith('name', { ascending: true });
    });
  });

  it('should apply a limit option to the query', async () => {
    const mockVenues = [{ id: 1, name: 'Limited Venue' }];
    mockQueryBuilder.then.mockImplementation((callback) => callback({ data: mockVenues, error: null }));

    // Render the hook with a limit option
    renderHook(() => useVenues({ limit: 5 }));

    await waitFor(() => {
      // Check that the 'limit' method was called
      expect(mockQueryBuilder.limit).toHaveBeenCalledWith(5);
    });
  });
});