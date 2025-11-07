import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import useVenues from './useVenues';
import { supabase } from '../supabaseClient';

// Mock the supabase client
vi.mock('../supabaseClient', () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

describe('useVenues Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and return a list of venues successfully', async () => {
    const mockVenues = [{ id: 1, name: 'Grand Arena', avg_rating: 4.5, created_at: '2023-01-01' }];
    supabase.rpc.mockResolvedValue({ data: mockVenues, error: null });

    const { result } = renderHook(() => useVenues({}));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.venues).toEqual(mockVenues);
      expect(result.current.error).toBe(null);
    });
  });

  it('should handle errors when fetching venues', async () => {
    const mockError = { message: 'Failed to fetch venues' };
    supabase.rpc.mockResolvedValue({ data: null, error: mockError });

    const { result } = renderHook(() => useVenues({}));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.venues).toEqual([]);
    expect(result.current.error).toBe(mockError.message);
  });

  it('should filter venues by search term (client-side)', async () => {
    const mockVenues = [
      { id: 1, name: 'Victory Court', description: 'A nice place for basketball' },
      { id: 2, name: 'Goal Arena', description: 'Best for football' },
      { id: 3, name: 'Victory Field', description: 'Outdoor football' },
    ];
    supabase.rpc.mockResolvedValue({ data: mockVenues, error: null });

    const { result } = renderHook(() => useVenues({ searchTerm: 'victory' }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.venues.length).toBe(2);
      expect(result.current.venues.map(v => v.name)).toEqual(['Victory Court', 'Victory Field']);
    });
  });

  it('should filter venues by selected sport (client-side)', async () => {
    const mockVenues = [
        { id: 1, name: 'Court 1', facilities: [{ sport_id: 'basketball' }] },
        { id: 2, name: 'Field 2', facilities: [{ sport_id: 'football' }] },
        { id: 3, name: 'Court 3', facilities: [{ sport_id: 'basketball' }] },
    ];
    supabase.rpc.mockResolvedValue({ data: mockVenues, error: null });

    const { result } = renderHook(() => useVenues({ selectedSports: ['basketball'] }));

    await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.venues.length).toBe(2);
        expect(result.current.venues.map(v => v.name)).toEqual(['Court 1', 'Court 3']);
    });
  });

  it('should sort venues by name (client-side)', async () => {
    const mockVenues = [
      { id: 1, name: 'Zenith Place' },
      { id: 2, name: 'Alpha Court' },
      { id: 3, name: 'Beta Field' },
    ];
    supabase.rpc.mockResolvedValue({ data: mockVenues, error: null });

    const { result } = renderHook(() => useVenues({ sortBy: 'name' }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.venues.map(v => v.name)).toEqual(['Alpha Court', 'Beta Field', 'Zenith Place']);
    });
  });

  it('should sort venues by rating (client-side)', async () => {
    const mockVenues = [
      { id: 1, name: 'Okay Place', avg_rating: 3.0 },
      { id: 2, name: 'Great Place', avg_rating: 5.0 },
      { id: 3, name: 'Good Place', avg_rating: 4.0 },
    ];
    supabase.rpc.mockResolvedValue({ data: mockVenues, error: null });

    const { result } = renderHook(() => useVenues({ sortBy: 'rating' }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.venues.map(v => v.name)).toEqual(['Great Place', 'Good Place', 'Okay Place']);
    });
  });

  it('should limit the number of venues (client-side)', async () => {
    const mockVenues = [
      { id: 1, name: 'Venue 1' },
      { id: 2, name: 'Venue 2' },
      { id: 3, name: 'Venue 3' },
    ];
    supabase.rpc.mockResolvedValue({ data: mockVenues, error: null });

    const { result } = renderHook(() => useVenues({ limit: 2 }));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.venues.length).toBe(2);
      expect(result.current.venues.map(v => v.name)).toEqual(['Venue 1', 'Venue 2']);
    });
  });
});
""