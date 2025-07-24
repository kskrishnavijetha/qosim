
import React from 'react';
import { IntegratedCircuitBuilder } from '@/components/circuits/IntegratedCircuitBuilder';
import { useCircuitStore } from '@/store/circuitStore';

export function IntegratedQuantumCircuitBuilder() {
  const { gates, addGate, removeGate, clearCircuit } = useCircuitStore();

  const handleCircuitChange = (newGates: any[]) => {
    clearCircuit();
    newGates.forEach(gate => {
      addGate(gate);
    });
  };

  return (
    <div className="h-screen">
      <IntegratedCircuitBuilder
        initialCircuit={gates}
        onCircuitChange={handleCircuitChange}
        enableCollaboration={true}
        enableAI={true}
      />
    </div>
  );
}
