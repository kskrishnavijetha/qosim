import React from 'react';
import { QuantumStateVisualization } from '@/components/circuits/QuantumStateVisualization';
import { EntanglementVisualization } from '@/components/simulation/EntanglementVisualization';
import { GateSuggestionsPanel } from '@/components/circuits/GateSuggestionsPanel';
import { ExistingCircuitsList } from '@/components/circuits/ExistingCircuitsList';
import { StepByStepExecutor } from '@/components/simulation/StepByStepExecutor';
import { CircuitValidator } from '@/components/simulation/CircuitValidator';
import { QuantumTestSuite } from '@/components/testing/QuantumTestSuite';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult, SimulationStepData } from '@/lib/quantumSimulatorOptimized';
import { useIsMobile } from '@/hooks/use-mobile';

interface CircuitVisualizationSectionProps {
  simulationResult: OptimizedSimulationResult | null;
  numQubits: number;
  circuit: Gate[];
  onSuggestionClick: (suggestion: any) => void;
  onStepModeToggle?: (enabled: boolean) => void;
  onSimulationStep?: () => SimulationStepData | null;
  onSimulationReset?: () => void;
  onSimulationPause?: () => void;
  onSimulationResume?: () => void;
  onCircuitLoad?: (gates: Omit<import('@/hooks/useCircuitState').Gate, 'id'>[]) => void;
}

export function CircuitVisualizationSection({
  simulationResult,
  numQubits,
  circuit,
  onSuggestionClick,
  onStepModeToggle = () => {},
  onSimulationStep = () => null,
  onSimulationReset = () => {},
  onSimulationPause = () => {},
  onSimulationResume = () => {},
  onCircuitLoad
}: CircuitVisualizationSectionProps) {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Circuit Validation and Step Controls */}
      <div className={`grid gap-4 lg:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        <CircuitValidator circuit={circuit} numQubits={numQubits} />
        <StepByStepExecutor
          circuit={circuit}
          simulationResult={simulationResult}
          onStepModeToggle={onStepModeToggle}
          onSimulationStep={onSimulationStep}
          onSimulationReset={onSimulationReset}
          onSimulationPause={onSimulationPause}
          onSimulationResume={onSimulationResume}
        />
      </div>

      {/* Live Quantum State Visualization */}
      <div className={`grid gap-4 lg:gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
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

      {/* Quantum Test Suite */}
      {onCircuitLoad && (
        <QuantumTestSuite 
          circuit={circuit}
          onCircuitLoad={onCircuitLoad}
        />
      )}

      {/* Existing Circuits - Stack on mobile */}
      <div className={isMobile ? '' : ''}>
        <ExistingCircuitsList />
      </div>
    </>
  );
}
