// src/utils/formatters.js

/**
 * Checks if a date object is valid.
 * @param {Date} dateObj
 * @returns {boolean}
 */
const isValidDate = (dateObj) => dateObj instanceof Date && !isNaN(dateObj.getTime());

/**
 * Formats a full timestamp (ISO string) into a detailed, localized date and time string.
 * This is defensive against null/invalid input.
 * @param {string | null} timestamp
 * @param {boolean} includeSeconds
 * @returns {string}
 */
export const formatTimestamp = (timestamp, includeSeconds = true) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    if (!isValidDate(date)) {
        return 'Invalid Date';
    }
    
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        ...(includeSeconds && { second: '2-digit' })
    };

    return date.toLocaleDateString('en-IN', options);
};

/**
 * Formats a date string (e.g., booking_date) into a short, locale-specific date format.
 * @param {string} dateString
 * @returns {string}
 */
export const formatDateShort = (dateString) => {
    const date = new Date(dateString);
    if (!isValidDate(date)) return 'N/A';
    return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        weekday: 'short'
    });
};

/**
 * Formats a time string (e.g., start_time/end_time) into a 12-hour clock time.
 * @param {string} timeString
 * @returns {string}
 */
export const formatTimeShort = (timeString) => {
    const date = new Date(timeString);
    if (!isValidDate(date)) return 'N/A';
    return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
    });
};

/**
 * Calculates the duration between two ISO timestamp strings in hours.
 * @param {string} startTime
 * @param {string} endTime
 * @returns {string}
 */
export const calculateDurationHours = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (!isValidDate(start) || !isValidDate(end)) return 'N/A';
    const diffInHours = (end - start) / (1000 * 60 * 60);
    return `${diffInHours.toFixed(1)}h`;
};

/**
 * Formats a number into a currency string (Indian Rupees).
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') {
    return 'N/A';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};