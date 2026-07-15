// src/shared/hooks/useDebounce.js
import { useState, useEffect } from 'react';

/**
 * Debounces a value by the given delay (ms).
 * @param {*} value
 * @param {number} delay
 * @returns {*} debouncedValue
 */
export const useDebounce = (value, delay = 400) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};
