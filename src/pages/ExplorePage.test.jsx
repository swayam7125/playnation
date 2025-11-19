import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

  it('should display a loading skeleton while fetching venues', async () => {
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
    await waitFor(() => {
      expect(screen.getByTestId('explore-skeleton')).toBeInTheDocument();
    });
  });

  it('should display an error message if fetching fails', async () => {
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
    expect(await screen.findByText(/Oops! Something went wrong/i)).toBeInTheDocument();
  });

  it('should display a list of venues when fetching is successful', async () => {
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
    await waitFor(async () => {
      expect(await screen.findByText('Main Cricket Ground')).toBeInTheDocument();
      expect(await screen.findByText('City Football Arena')).toBeInTheDocument();
    });
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

    const searchInput = await screen.findByPlaceholderText("Search by venue name, sport, or location...");
    await user.type(searchInput, 'cricket');

    await waitFor(() => {
      expect(useVenues).toHaveBeenCalledWith(
        expect.objectContaining({
          searchTerm: 'cricket',
        })
      );
    });
  });
});