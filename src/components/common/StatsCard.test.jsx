// src/components/common/StatsCard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import StatsCard from './StatsCard'; // Make sure the path is correct
import { describe, it, expect } from 'vitest';

describe('StatsCard Component', () => {
  it('should render the title, count, and icon correctly', () => {
    // 1. Arrange - Set up the component with props
    const title = "Total Venues";
    const count = 125;
    // A simple mock for the icon prop
    const icon = () => <svg data-testid="icon" />;

    render(<StatsCard title={title} count={count} icon={icon} color="bg-blue-500" />);

    // 2. Act & Assert - Check if the elements are on the screen
    // screen.getByText() will throw an error if the text isn't found, failing the test.
    expect(screen.getByText('Total Venues')).toBeInTheDocument();
    expect(screen.getByText('125')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});