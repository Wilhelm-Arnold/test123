import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm, { timesReducer, initializeTimes } from '../components/BookingForm';
import * as api from '../utils/api';

// Mock the API module
vi.mock('../utils/api');

describe('BookingForm Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Mock fetchAPI to return some times
    api.fetchAPI.mockReturnValue(['17:00', '18:00', '19:00', '20:00', '21:00']);
    
    // Mock submitAPI to resolve successfully
    api.submitAPI.mockResolvedValue(true);
  });

  describe('Rendering', () => {
    it('renders the booking form', () => {
      render(<BookingForm />);
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/number of guests/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      render(<BookingForm />);
      const submitButton = screen.getByRole('button');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveTextContent(/make your reservation/i);
    });

    it('renders all required field indicators', () => {
      render(<BookingForm />);
      const requiredIndicators = screen.getAllByText('*');
      expect(requiredIndicators.length).toBeGreaterThan(0);
    });
  });

  describe('Form Validation', () => {
    it('shows error when date field is empty and touched', async () => {
      render(<BookingForm />);
      const dateInput = screen.getByLabelText(/date/i);
      
      fireEvent.blur(dateInput);
      
      await waitFor(() => {
        expect(screen.getByText(/date is required/i)).toBeInTheDocument();
      });
    });

    it('shows error when email format is invalid', async () => {
      render(<BookingForm />);
      const emailInput = screen.getByLabelText(/email/i);
      
      await userEvent.type(emailInput, 'invalid-email');
      fireEvent.blur(emailInput);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('shows error when name is too short', async () => {
      render(<BookingForm />);
      const nameInput = screen.getByLabelText(/full name/i);
      
      await userEvent.type(nameInput, 'A');
      fireEvent.blur(nameInput);
      
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('validates guests number is within range', async () => {
      render(<BookingForm />);
      const guestsInput = screen.getByLabelText(/number of guests/i);
      
      await userEvent.clear(guestsInput);
      await userEvent.type(guestsInput, '15');
      fireEvent.blur(guestsInput);
      
      await waitFor(() => {
        expect(screen.getByText(/maximum 10 guests allowed/i)).toBeInTheDocument();
      });
    });

    it('validates phone number format', async () => {
      render(<BookingForm />);
      const phoneInput = screen.getByLabelText(/phone/i);
      
      await userEvent.type(phoneInput, 'abc');
      fireEvent.blur(phoneInput);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      render(<BookingForm />);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0];
      
      // Fill out the form
      await userEvent.type(screen.getByLabelText(/date/i), dateString);
      
      await waitFor(() => {
        const timeSelect = screen.getByLabelText(/time/i);
        expect(timeSelect).not.toBeDisabled();
      });
      
      await userEvent.selectOptions(screen.getByLabelText(/time/i), '18:00');
      await userEvent.clear(screen.getByLabelText(/number of guests/i));
      await userEvent.type(screen.getByLabelText(/number of guests/i), '4');
      await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/phone/i), '1234567890');
      
      const submitButton = screen.getByRole('button');
      
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
      
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(api.submitAPI).toHaveBeenCalled();
      });
    });

    it('disables submit button when form is invalid', () => {
      render(<BookingForm />);
      const submitButton = screen.getByRole('button');
      expect(submitButton).toBeDisabled();
    });

    it('displays success message after successful submission', async () => {
      render(<BookingForm />);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0];
      
      await userEvent.type(screen.getByLabelText(/date/i), dateString);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/time/i)).not.toBeDisabled();
      });
      
      await userEvent.selectOptions(screen.getByLabelText(/time/i), '18:00');
      await userEvent.clear(screen.getByLabelText(/number of guests/i));
      await userEvent.type(screen.getByLabelText(/number of guests/i), '2');
      await userEvent.type(screen.getByLabelText(/full name/i), 'Jane Smith');
      await userEvent.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await userEvent.type(screen.getByLabelText(/phone/i), '9876543210');
      
      await waitFor(() => {
        const submitButton = screen.getByRole('button');
        expect(submitButton).not.toBeDisabled();
      });
      
      const submitButton = screen.getByRole('button');
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/success/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Available Times', () => {
    it('updates available times when date changes', async () => {
      render(<BookingForm />);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateString = tomorrow.toISOString().split('T')[0];
      
      const dateInput = screen.getByLabelText(/date/i);
      await userEvent.type(dateInput, dateString);
      
      await waitFor(() => {
        expect(api.fetchAPI).toHaveBeenCalled();
      });
    });

    it('disables time select when no date is selected', () => {
      render(<BookingForm />);
      const timeSelect = screen.getByLabelText(/time/i);
      expect(timeSelect).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<BookingForm />);
      expect(screen.getByLabelText(/date/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/time/i)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(/number of guests/i)).toHaveAttribute('aria-required', 'true');
    });

    it('sets aria-invalid when field has error', async () => {
      render(<BookingForm />);
      const emailInput = screen.getByLabelText(/email/i);
      
      await userEvent.type(emailInput, 'invalid');
      fireEvent.blur(emailInput);
      
      await waitFor(() => {
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('Reducer Functions', () => {
    it('initializeTimes returns an array of times', () => {
      const times = initializeTimes();
      expect(Array.isArray(times)).toBe(true);
      expect(times.length).toBeGreaterThan(0);
    });

    it('timesReducer updates times on UPDATE_TIMES action', () => {
      const initialState = [];
      const newTimes = ['17:00', '18:00', '19:00'];
      const action = { type: 'UPDATE_TIMES', payload: newTimes };
      
      const result = timesReducer(initialState, action);
      expect(result).toEqual(newTimes);
    });

    it('timesReducer returns current state for unknown action', () => {
      const initialState = ['17:00', '18:00'];
      const action = { type: 'UNKNOWN_ACTION' };
      
      const result = timesReducer(initialState, action);
      expect(result).toEqual(initialState);
    });
  });
});
