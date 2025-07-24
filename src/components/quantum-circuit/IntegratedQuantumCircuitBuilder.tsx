
import React from 'react';
import { IntegratedCircuitBuilder } from '@/components/circuits/IntegratedCircuitBuilder';
import { useCircuitStore } from '@/store/circuitStore';
import { Gate as WorkspaceGate } from '@/hooks/useCircuitWorkspace';

export function IntegratedQuantumCircuitBuilder() {
  const { gates, addGate, removeGate, clearCircuit } = useCircuitStore();

  // Convert store gates to workspace gates format
  const workspaceGates: WorkspaceGate[] = gates.map(gate => ({
    ...gate,
    position: gate.position || 0,
    qubit: gate.qubit || 0,
    params: gate.params || []
  }));

  const handleCircuitChange = (newGates: WorkspaceGate[]) => {
    clearCircuit();
    newGates.forEach(gate => {
      addGate({
        type: gate.type,
        qubit: gate.qubit,
        position: gate.position,
        timeStep: gate.position, // Ensure both position and timeStep are provided
        controlQubit: gate.controlQubit,
        angle: gate.angle,
        params: gate.params
      });
    });
  };

  return (
    <div className="h-screen">
      <IntegratedCircuitBuilder
        initialCircuit={workspaceGates}
        onCircuitChange={handleCircuitChange}
        enableCollaboration={true}
        enableAI={true}
      />
    </div>
  );
}
