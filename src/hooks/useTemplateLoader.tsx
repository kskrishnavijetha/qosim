
import { useCallback } from 'react';
// Import Gate from the workspace hook to ensure consistency
import type { Gate } from '@/hooks/useCircuitWorkspace';

interface UseTemplateLoaderProps {
  addGate: (gate: Gate) => void;
  clearCircuit: () => void;
  completeTemplate: (templateId: string) => void;
}

export function useTemplateLoader({ addGate, clearCircuit, completeTemplate }: UseTemplateLoaderProps) {
  const handleTemplateLoad = useCallback((template: any) => {
    console.log('Loading template:', template);
    clearCircuit();
    // Load template gates one by one with proper positioning
    template.gates.forEach((gateData: any, index: number) => {
      setTimeout(() => {
        const gate = {
          ...gateData,
          id: `template-gate-${index}-${Date.now()}`
        };
        console.log('Adding gate:', gate);
        addGate(gate);
        
        // Complete template after all gates are loaded
        if (index === template.gates.length - 1) {
          setTimeout(() => {
            console.log('Completing template:', template.id);
            completeTemplate(template.id);
          }, 100);
        }
      }, index * 200); // Stagger gate placement for visual effect
    });
  }, [addGate, clearCircuit, completeTemplate]);

  return {
    handleTemplateLoad
  };
}
