
import React from 'react';
import { QuantumBackendResult } from '@/services/quantumBackendService';
import { Gate } from '@/hooks/useCircuitState';
import { PostSimulationWorkflow } from '@/components/workflow/PostSimulationWorkflow';

interface QuantumVisualizationPanelProps {
  result: QuantumBackendResult | null;
  gates: Gate[];
  numQubits: number;
  circuitName: string;
  onRerunSimulation: (shots?: number) => Promise<QuantumBackendResult | null>;
  onExecutePartialCircuit: (gates: Gate[], shots?: number) => Promise<QuantumBackendResult | null>;
}

export function QuantumVisualizationPanel({
  result,
  gates,
  numQubits,
  circuitName,
  onRerunSimulation,
  onExecutePartialCircuit
}: QuantumVisualizationPanelProps) {
  if (!result) {
    return (
      <div className="flex items-center justify-center h-64 text-quantum-particle">
        <div className="text-center">
          <p className="text-lg mb-2">Ready for Simulation</p>
          <p className="text-sm">Run your quantum circuit to see visualizations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <PostSimulationWorkflow
        result={result}
        gates={gates}
        numQubits={numQubits}
        circuitName={circuitName}
        onRerunSimulation={onRerunSimulation}
        onExecutePartialCircuit={onExecutePartialCircuit}
      />
    </div>
  );
}
