import React from 'react';
import './Hero.css';

/**
 * Hero Component
 * Main landing section with restaurant introduction and CTA button
 */
const Hero = () => {
  const handleReserveClick = () => {
    // Scroll to reservations section
    const reservationsSection = document.getElementById('reservations');
    if (reservationsSection) {
      reservationsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 id="hero-title" className="hero-title">Little Lemon</h1>
            <h2 className="hero-subtitle">Chicago</h2>
            <p className="hero-description">
              We are a family owned Mediterranean restaurant, focused on traditional 
              recipes served with a modern twist.
            </p>
            <button 
              className="btn btn-primary"
              onClick={handleReserveClick}
              aria-label="Reserve a table"
            >
              Reserve a Table
            </button>
          </div>
          <div className="hero-image">
            <img 
              src="/images/restaurant-food.jpg" 
              alt="Delicious Mediterranean cuisine served at Little Lemon"
              className="hero-img"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
