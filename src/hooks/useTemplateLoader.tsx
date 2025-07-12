import { useCallback } from 'react';
import { Gate } from './useCircuitState';

interface UseTemplateLoaderProps {
  addGate: (gate: Gate) => void;
  clearCircuit: () => void;
  completeTemplate: (templateId: string) => void;
}

export function useTemplateLoader({ addGate, clearCircuit, completeTemplate }: UseTemplateLoaderProps) {
  const handleTemplateLoad = useCallback((template: any) => {
    console.log('🎯 Loading template:', template);
    console.log('🎯 Template gates:', template.gates);
    console.log('🎯 addGate function:', addGate);
    console.log('🎯 clearCircuit function:', clearCircuit);
    
    if (!addGate) {
      console.error('❌ addGate function is not available!');
      return;
    }
    
    if (!clearCircuit) {
      console.error('❌ clearCircuit function is not available!');
      return;
    }
    
    clearCircuit();
    console.log('🧹 Circuit cleared');
    
    if (!template.gates || template.gates.length === 0) {
      console.error('❌ Template has no gates!', template);
      return;
    }
    
    // Load template gates one by one with proper positioning
    template.gates.forEach((gateData: any, index: number) => {
      setTimeout(() => {
        const gate = {
          ...gateData,
          id: `template-gate-${index}-${Date.now()}`
        };
        console.log('🚀 Adding template gate:', gate);
        addGate(gate);
        
        // Complete template after all gates are loaded
        if (index === template.gates.length - 1) {
          setTimeout(() => {
            console.log('✅ Completing template:', template.id);
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