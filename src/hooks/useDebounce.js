import { useState, useEffect } from 'react';

// Hook de debounce: retrasa la actualización del valor `delay` ms.
// Evita disparar una petición por cada tecla mientras el usuario escribe.
export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Si el valor cambia antes de que termine el temporizador, se cancela.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
