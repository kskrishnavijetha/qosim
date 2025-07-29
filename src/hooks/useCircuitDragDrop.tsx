
import { useState } from 'react';

export function useCircuitDragDrop() {
  const [isDragging] = useState(false);
  
  return {
    isDragging,
    handleDragStart: () => {},
    handleDragEnd: () => {},
    handleDrop: () => {}
  };
}
