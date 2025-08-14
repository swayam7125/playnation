import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/images/hero/hero-img-1.svg';

// Helper component for feature cards
const FeatureCard = ({ icon, title, description }) => (
  // UPDATED: Changed className to apply new styles
  <div className="feature-card-new">
    <div className="icon">{icon}</div>
    <div className="title">{title}</div>
    <div className="description">{description}</div>
  </div>
);

// UPDATED: CategoryCard now uses an <img> tag for the icon
const CategoryCard = ({ imgSrc, name }) => (
  <div className="sport-card">
    <div className="icon">
      <img src={imgSrc} alt={`${name} icon`} style={{ width: '24px', height: '24px' }} />
    </div>
    <span>{name}</span>
  </div>
);

export default function HomePage() {
  return (
    <div className="dashboard-page">
      <div className="container">
        {/* --- Hero Section --- */}
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

        {/* --- Offer Banner Section --- */}
        <section className="section">
            <div className="offer-banner">
                <p>Flat 20% Off on Weekday Morning Slots</p>
            </div>
        </section>

        {/* --- Popular Categories Section --- */}
        <section className="section">
          <h2 className="section-heading">Popular categories</h2>
          {/* UPDATED: Using image paths instead of emojis */}
          <div className="sports-grid">
            <CategoryCard imgSrc="/src/assets/images/categories/cricket.png" name="Cricket" />
            <CategoryCard imgSrc="/src/assets/images/categories/pickle-ball.png" name="Pickleball" />
            <CategoryCard imgSrc="/src/assets/images/categories/golf.png" name="Golf" />
            <CategoryCard imgSrc="/src/assets/images/categories/pool.png" name="Pool" />
            <CategoryCard imgSrc="/src/assets/images/categories/snooker.png" name="Snooker" />
          </div>
        </section>

        {/* --- Footer Section --- */}
        <footer className="section">
            <p className="text-center text-light">Copyright @PlayNation 2025</p>
        </footer>
      </div>
    </div>
  );
}
