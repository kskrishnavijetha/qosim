
import { useState } from 'react';

export function useQuantumBackend() {
  const [backend] = useState(null);
  
  return {
    backend,
    setBackend: () => {},
    simulate: () => Promise.resolve(null)
  };
}
