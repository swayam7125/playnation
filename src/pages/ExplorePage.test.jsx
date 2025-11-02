import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import ExplorePage from './ExplorePage';
import useVenues from '../hooks/useVenues';

// Mock the entire useVenues hook module
vi.mock('../hooks/useVenues');

describe('ExplorePage Component', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display a loading message while fetching venues', () => {
    useVenues.mockReturnValue({
      venues: [],
      loading: true,
      error: null,
    });
    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display an error message if fetching fails', () => {
    useVenues.mockReturnValue({
      venues: [],
      loading: false,
      error: 'Failed to fetch venues',
    });
    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );
    expect(screen.getByText(/failed to fetch venues/i)).toBeInTheDocument();
  });

  it('should display a list of venues when fetching is successful', () => {
    const mockVenuesData = [
      { venue_id: 1, name: 'Main Cricket Ground', address: '123 Sport Rd' },
      { venue_id: 2, name: 'City Football Arena', address: '456 Goal Ave' },
    ];
    useVenues.mockReturnValue({
      venues: mockVenuesData,
      loading: false,
      error: null,
    });
    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );
    expect(screen.getByText('Main Cricket Ground')).toBeInTheDocument();
    expect(screen.getByText('City Football Arena')).toBeInTheDocument();
  });

  it('should call useVenues with the correct search term when user types in search bar', async () => {
    const user = userEvent.setup();
    useVenues.mockReturnValue({
      venues: [],
      loading: false,
      error: null,
    });
    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    // 👇 **THE FIX IS HERE** 👇
    // We use the exact placeholder text from the component
    const searchInput = screen.getByPlaceholderText("Search venues...");
    await user.type(searchInput, 'cricket');

    expect(useVenues).toHaveBeenLastCalledWith(
      expect.objectContaining({
        searchTerm: 'cricket',
      })
    );
  });
});