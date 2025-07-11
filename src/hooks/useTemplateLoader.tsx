import { useCallback } from 'react';
import { Gate } from './useCircuitState';

interface UseTemplateLoaderProps {
  addGate: (gate: Gate) => void;
  clearCircuit: () => void;
  completeTemplate: (templateId: string) => void;
}

export function useTemplateLoader({ addGate, clearCircuit, completeTemplate }: UseTemplateLoaderProps) {
  const handleTemplateLoad = useCallback((template: any) => {
    clearCircuit();
    // Load template gates one by one with proper positioning
    template.gates.forEach((gateData: any, index: number) => {
      setTimeout(() => {
        const gate = {
          ...gateData,
          id: `template-gate-${index}-${Date.now()}`
        };
        addGate(gate);
        
        // Complete template after all gates are loaded
        if (index === template.gates.length - 1) {
          setTimeout(() => completeTemplate(template.id), 100);
        }
      }, index * 200); // Stagger gate placement for visual effect
    });
  }, [addGate, clearCircuit, completeTemplate]);

  return {
    handleTemplateLoad
  };
}