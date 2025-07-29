
import { useState } from 'react';

export function useCircuits() {
  const [circuits] = useState([]);
  
  return {
    circuits,
    createCircuit: () => {},
    loadCircuit: () => {},
    saveCircuit: () => {},
    deleteCircuit: () => {}
  };
}
