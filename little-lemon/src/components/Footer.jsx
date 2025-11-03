import React from 'react';
import './Footer.css';

/**
 * Footer Component
 * Site footer with navigation links and contact information
 */
const Footer = () => {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Little Lemon</h3>
            <p className="footer-text">
              A family owned Mediterranean restaurant, focused on traditional 
              recipes served with a modern twist.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-list">
              <li><a href="#home" aria-label="Go to home">Home</a></li>
              <li><a href="#about" aria-label="Go to about">About</a></li>
              <li><a href="#menu" aria-label="Go to menu">Menu</a></li>
              <li><a href="#reservations" aria-label="Go to reservations">Reservations</a></li>
              <li><a href="#order" aria-label="Go to order online">Order Online</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Contact</h4>
            <ul className="footer-list">
              <li>
                <a href="tel:+13125551234" aria-label="Call us at 312-555-1234">
                  Phone: (312) 555-1234
                </a>
              </li>
              <li>
                <a href="mailto:info@littlelemon.com" aria-label="Email us at info@littlelemon.com">
                  Email: info@littlelemon.com
                </a>
              </li>
              <li>123 Lemon Street, Chicago, IL 60601</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Hours</h4>
            <ul className="footer-list">
              <li>Monday - Thursday: 11am - 10pm</li>
              <li>Friday - Saturday: 11am - 11pm</li>
              <li>Sunday: 11am - 9pm</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Little Lemon. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
