/**
 * API Functions for Little Lemon Restaurant
 * These functions simulate API calls for booking management
 */

/**
 * Seed random number generator
 */
const seededRandom = function (seed) {
  var m = 2**35 - 31;
  var a = 185852;
  var s = seed % m;
  return function () {
    return (s = s * a % m) / m;
  };
}

/**
 * Fetch available booking times for a given date
 * @param {Date} date - The date to fetch available times for
 * @returns {Array<string>} Array of available time slots
 */
export const fetchAPI = function(date) {
  let result = [];
  let random = seededRandom(date.getDate());

  for(let i = 17; i <= 23; i++) {
    if(random() < 0.5) {
      result.push(i + ':00');
    }
    if(random() < 0.5) {
      result.push(i + ':30');
    }
  }
  return result;
};

/**
 * Submit a booking form
 * @param {Object} formData - The booking form data
 * @returns {Promise<boolean>} Promise that resolves to true if submission successful
 */
export const submitAPI = function(formData) {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // Simulate 95% success rate
      const success = Math.random() > 0.05;
      resolve(success);
    }, 1000);
  });
};
