import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';

/**
 * Main App Component
 * Little Lemon Restaurant Website
 * 
 * Features:
 * - Responsive design
 * - Accessible components with ARIA labels
 * - Form validation
 * - Unit tested
 */
function App() {
  return (
    <div className="App">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      <Header />
      
      <main id="main-content" role="main">
        <Hero />
        <BookingForm />
      </main>

      <Footer />
    </div>
  );
}

export default App;
