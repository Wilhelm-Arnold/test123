import React, { useState, useReducer, useEffect } from 'react';
import './BookingForm.css';
import { fetchAPI, submitAPI } from '../utils/api';

/**
 * Reducer function for managing available times
 * @param {Array} state - Current available times
 * @param {Object} action - Action with type and payload
 * @returns {Array} Updated available times
 */
export const timesReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_TIMES':
      return action.payload;
    default:
      return state;
  }
};

/**
 * Initialize available times for today
 * @returns {Array} Array of available times
 */
export const initializeTimes = () => {
  const today = new Date();
  return fetchAPI(today);
};

/**
 * BookingForm Component
 * Comprehensive form for restaurant table reservations with validation
 * Implements accessibility features and error handling
 */
const BookingForm = () => {
  // Form state management
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    guests: 1,
    occasion: 'birthday',
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Available times management using useReducer
  const [availableTimes, dispatch] = useReducer(timesReducer, [], initializeTimes);

  /**
   * Update available times when date changes
   */
  useEffect(() => {
    if (formData.date) {
      try {
        const selectedDate = new Date(formData.date);
        const times = fetchAPI(selectedDate);
        dispatch({ type: 'UPDATE_TIMES', payload: times });
      } catch (error) {
        console.error('Error fetching available times:', error);
        setSubmitError('Failed to load available times. Please try again.');
      }
    }
  }, [formData.date]);

  /**
   * Validate individual form field
   * @param {string} name - Field name
   * @param {string} value - Field value
   * @returns {string} Error message or empty string
   */
  const validateField = (name, value) => {
    switch (name) {
      case 'date':
        if (!value) return 'Date is required';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) return 'Date cannot be in the past';
        return '';
      
      case 'time':
        if (!value) return 'Time is required';
        return '';
      
      case 'guests':
        if (!value) return 'Number of guests is required';
        if (value < 1) return 'At least 1 guest is required';
        if (value > 10) return 'Maximum 10 guests allowed';
        return '';
      
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Invalid email format';
        return '';
      
      case 'phone':
        if (!value) return 'Phone number is required';
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) return 'Invalid phone number format';
        if (value.replace(/\D/g, '').length < 10) return 'Phone number must be at least 10 digits';
        return '';
      
      default:
        return '';
    }
  };

  /**
   * Handle input field changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate field if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  /**
   * Handle field blur events for validation
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  /**
   * Validate entire form
   * @returns {boolean} True if form is valid
   */
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (['date', 'time', 'guests', 'name', 'email', 'phone'].includes(key)) {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validate form
    if (!validateForm()) {
      setSubmitError('Please fix all errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      const success = await submitAPI(formData);
      
      if (success) {
        setSubmitSuccess(true);
        setSubmitError('');
        // Reset form
        setFormData({
          date: '',
          time: '',
          guests: 1,
          occasion: 'birthday',
          name: '',
          email: '',
          phone: '',
          specialRequests: ''
        });
        setTouched({});
        setErrors({});
      } else {
        setSubmitError('Booking failed. Please try again or contact us directly.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Check if form is valid for submission
   */
  const isFormValid = () => {
    return formData.date && 
           formData.time && 
           formData.guests && 
           formData.name && 
           formData.email && 
           formData.phone &&
           Object.keys(errors).every(key => !errors[key]);
  };

  return (
    <section className="booking-section" id="reservations" aria-labelledby="booking-title">
      <div className="container">
        <h2 id="booking-title" className="section-title">Reserve a Table</h2>
        
        {submitSuccess && (
          <div className="success-message" role="alert" aria-live="polite">
            <strong>Success!</strong> Your reservation has been confirmed. 
            We've sent a confirmation email to {formData.email}.
          </div>
        )}

        {submitError && (
          <div className="error-message" role="alert" aria-live="assertive">
            <strong>Error:</strong> {submitError}
          </div>
        )}

        <form 
          className="booking-form" 
          onSubmit={handleSubmit}
          noValidate
          aria-label="Table reservation form"
        >
          <div className="form-grid">
            {/* Date Field */}
            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date <span className="required" aria-label="required">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.date && touched.date ? 'error' : ''}`}
                required
                aria-required="true"
                aria-invalid={errors.date && touched.date ? 'true' : 'false'}
                aria-describedby={errors.date && touched.date ? 'date-error' : undefined}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.date && touched.date && (
                <span id="date-error" className="error-text" role="alert">
                  {errors.date}
                </span>
              )}
            </div>

            {/* Time Field */}
            <div className="form-group">
              <label htmlFor="time" className="form-label">
                Time <span className="required" aria-label="required">*</span>
              </label>
              <select
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.time && touched.time ? 'error' : ''}`}
                required
                aria-required="true"
                aria-invalid={errors.time && touched.time ? 'true' : 'false'}
                aria-describedby={errors.time && touched.time ? 'time-error' : undefined}
                disabled={!formData.date}
              >
                <option value="">Select a time</option>
                {availableTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.time && touched.time && (
                <span id="time-error" className="error-text" role="alert">
                  {errors.time}
                </span>
              )}
            </div>

            {/* Number of Guests */}
            <div className="form-group">
              <label htmlFor="guests" className="form-label">
                Number of Guests <span className="required" aria-label="required">*</span>
              </label>
              <input
                type="number"
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                onBlur={handleBlur}
                min="1"
                max="10"
                className={`form-input ${errors.guests && touched.guests ? 'error' : ''}`}
                required
                aria-required="true"
                aria-invalid={errors.guests && touched.guests ? 'true' : 'false'}
                aria-describedby={errors.guests && touched.guests ? 'guests-error' : undefined}
              />
              {errors.guests && touched.guests && (
                <span id="guests-error" className="error-text" role="alert">
                  {errors.guests}
                </span>
              )}
            </div>

            {/* Occasion */}
            <div className="form-group">
              <label htmlFor="occasion" className="form-label">
                Occasion
              </label>
              <select
                id="occasion"
                name="occasion"
                value={formData.occasion}
                onChange={handleChange}
                className="form-input"
                aria-label="Select occasion for reservation"
              >
                <option value="birthday">Birthday</option>
                <option value="anniversary">Anniversary</option>
                <option value="engagement">Engagement</option>
                <option value="business">Business</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name <span className="required" aria-label="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                required
                aria-required="true"
                aria-invalid={errors.name && touched.name ? 'true' : 'false'}
                aria-describedby={errors.name && touched.name ? 'name-error' : undefined}
                placeholder="John Doe"
              />
              {errors.name && touched.name && (
                <span id="name-error" className="error-text" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email <span className="required" aria-label="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
                required
                aria-required="true"
                aria-invalid={errors.email && touched.email ? 'true' : 'false'}
                aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                placeholder="john@example.com"
              />
              {errors.email && touched.email && (
                <span id="email-error" className="error-text" role="alert">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Phone <span className="required" aria-label="required">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${errors.phone && touched.phone ? 'error' : ''}`}
                required
                aria-required="true"
                aria-invalid={errors.phone && touched.phone ? 'true' : 'false'}
                aria-describedby={errors.phone && touched.phone ? 'phone-error' : undefined}
                placeholder="(555) 123-4567"
              />
              {errors.phone && touched.phone && (
                <span id="phone-error" className="error-text" role="alert">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Special Requests */}
            <div className="form-group full-width">
              <label htmlFor="specialRequests" className="form-label">
                Special Requests
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                className="form-input form-textarea"
                rows="4"
                placeholder="Any dietary restrictions or special requests..."
                aria-label="Special requests or dietary restrictions"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-submit"
              disabled={isSubmitting || !isFormValid()}
              aria-label="Submit reservation"
            >
              {isSubmitting ? 'Submitting...' : 'Make Your Reservation'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default BookingForm;
