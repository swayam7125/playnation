// src/components/home/CategoryCard/CategoryCard.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryCard from './CategoryCard';

describe('CategoryCard Component', () => {
  it('should render the category name and image correctly', () => {
    const mockCategory = {
      name: 'Cricket',
      image: 'path/to/cricket.png',
    };

    render(
      <BrowserRouter>
        <CategoryCard category={mockCategory} />
      </BrowserRouter>
    );

    expect(screen.getByText('Cricket')).toBeInTheDocument();

    const image = screen.getByRole('img');
    // Correct the expected alt text to match the component's output
    expect(image).toHaveAttribute('alt', 'Cricket icon'); // 👈 Corrected value
    expect(image).toHaveAttribute('src', 'path/to/cricket.png');
  });
});