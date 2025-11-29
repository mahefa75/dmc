import { useState, useEffect } from 'react'

/**
 * Hook pour debouncer une valeur
 * @param {any} value - La valeur à debouncer
 * @param {number} delay - Le délai en millisecondes (par défaut 300ms)
 * @returns {any} La valeur debouncée
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    // Set un timer pour mettre à jour la valeur après le délai
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Nettoyer le timer si la valeur change avant la fin du délai
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
