
import { useState } from 'react';

export function useCustomGates() {
  const [customGates] = useState([]);
  
  return {
    customGates,
    addCustomGate: () => {},
    removeCustomGate: () => {},
    getCustomGate: () => null
  };
}
