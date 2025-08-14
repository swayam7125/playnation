import React from 'react';
import { Link } from 'react-router-dom';
// The '..' is changed to '.' because the file is now one level up
import heroImage from '../assets/images/hero/hero-img-1.svg';
import { FeatureCard } from '../components/home/FeatureCard/FeatureCard';
import { CategoryCard } from '../components/home/CategoryCard/CategoryCard';
import { categories } from '../constants/categories';

export default function HomePage() {
  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Hero Section */}
        <section className="section hero-section">
          <div className="hero-content">
            <h1 className="hero-title">PlayNation: Book sports slots in seconds</h1>
            <p className="hero-subtitle">
              Real-time availability across turfs and tables near you. No calls. No waiting. Just play.
            </p>
            <div className="hero-buttons">
              <Link to="/explore" className="btn btn-primary">Let's goo!!</Link>
            </div>
            <div className="hero-features">
              <FeatureCard icon="⚡️" title="Fast" description="Instant slot visibility" />
              <FeatureCard icon="🛡️" title="Secure" description="Reliable & safe" />
              <FeatureCard icon="🏆" title="Top venues" description="Verified facilities" />
            </div>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="Collage of sports venues" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-xl)' }} />
          </div>
        </section>

        {/* Offer Banner Section */}
        <section className="section">
          <div className="offer-banner">
            <p>Flat 20% Off on Weekday Morning Slots</p>
          </div>
        </section>

        {/* Popular Categories Section */}
        <section className="section">
          <h2 className="section-heading">Popular categories</h2>
          <div className="sports-grid">
            {categories.map(category => (
              <CategoryCard 
                key={category.id}
                imgSrc={category.image} 
                name={category.name}
              />
            ))}
          </div>
        </section>

        {/* Footer Section */}
        <footer className="section">
          <p className="text-center text-light">Footer</p>
        </footer>
      </div>
    </div>
  );
}