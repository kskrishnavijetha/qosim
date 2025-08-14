
import React, { useEffect } from 'react';

interface FunctionDebuggerProps {
  component: string;
  functions: { [key: string]: () => void };
}

export function FunctionDebugger({ component, functions }: FunctionDebuggerProps) {
  useEffect(() => {
    console.log(`[${component}] Component mounted with functions:`, Object.keys(functions));
    
    // Test each function to see if it's properly defined
    Object.entries(functions).forEach(([name, func]) => {
      if (typeof func !== 'function') {
        console.error(`[${component}] Function ${name} is not a function:`, func);
      } else {
        console.log(`[${component}] Function ${name} is properly defined`);
      }
    });
  }, [component, functions]);

  return null;
}
