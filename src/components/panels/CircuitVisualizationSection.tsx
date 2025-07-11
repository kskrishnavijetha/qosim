import React from 'react';
import { QuantumStateVisualization } from '@/components/circuits/QuantumStateVisualization';
import { EntanglementVisualization } from '@/components/simulation/EntanglementVisualization';
import { GateSuggestionsPanel } from '@/components/circuits/GateSuggestionsPanel';
import { ExistingCircuitsList } from '@/components/circuits/ExistingCircuitsList';
import { Gate } from '@/hooks/useCircuitState';
import { EnhancedSimulationResult } from '@/lib/quantumSimulationService';

interface CircuitVisualizationSectionProps {
  simulationResult: EnhancedSimulationResult | null;
  numQubits: number;
  circuit: Gate[];
  onSuggestionClick: (suggestion: any) => void;
}

export function CircuitVisualizationSection({
  simulationResult,
  numQubits,
  circuit,
  onSuggestionClick
}: CircuitVisualizationSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Live Quantum State Visualization */}
        <QuantumStateVisualization 
          simulationResult={simulationResult} 
          NUM_QUBITS={numQubits} 
        />

        {/* Entanglement Analysis */}
        <EntanglementVisualization
          simulationResult={simulationResult}
          numQubits={numQubits}
        />
      </div>

      {/* AI Suggestions Panel */}
      <GateSuggestionsPanel 
        circuit={circuit}
        onSuggestionClick={onSuggestionClick}
      />

      {/* Existing Circuits */}
      <ExistingCircuitsList />
    </>
  );
}
