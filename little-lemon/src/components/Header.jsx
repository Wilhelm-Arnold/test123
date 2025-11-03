import React from 'react';
import './Header.css';
import logo from '../assets/logo.svg';

/**
 * Header Component
 * Displays the site header with logo and navigation
 * Implements accessibility features including ARIA labels and keyboard navigation
 */
const Header = () => {
  return (
    <header className="header" role="banner">
      <div className="container">
        <div className="header-content">
          <div className="logo-container">
            <img 
              src={logo} 
              alt="Little Lemon Restaurant Logo" 
              className="logo"
              width="200"
              height="50"
            />
          </div>
          <nav className="nav" role="navigation" aria-label="Main navigation">
            <ul className="nav-list">
              <li><a href="#home" aria-label="Navigate to home section">Home</a></li>
              <li><a href="#about" aria-label="Navigate to about section">About</a></li>
              <li><a href="#menu" aria-label="Navigate to menu section">Menu</a></li>
              <li><a href="#reservations" aria-label="Navigate to reservations section">Reservations</a></li>
              <li><a href="#order" aria-label="Navigate to order online section">Order Online</a></li>
              <li><a href="#login" aria-label="Navigate to login page">Login</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
