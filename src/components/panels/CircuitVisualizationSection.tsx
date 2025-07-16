import React, { useState } from "react";
import { OptimizedSimulationResult } from "@/lib/quantumSimulatorOptimized";
import { QuantumStateVisualization } from "@/components/circuits/QuantumStateVisualization";
import { EntanglementVisualization } from "@/components/simulation/EntanglementVisualization";
import { DebugConsole } from "@/components/simulation/DebugConsole";
import { OutputConsole } from "@/components/simulation/OutputConsole";
import { Gate } from "@/hooks/useCircuitState";

interface CircuitVisualizationSectionProps {
  simulationResult: OptimizedSimulationResult | null;
  numQubits: number;
  circuit: Gate[];
  onSuggestionClick: (suggestion: any) => void;
  onStepModeToggle: (enabled: boolean) => void;
  onSimulationStep: () => void;
  onSimulationReset: () => void;
  onSimulationPause: () => void;
  onSimulationResume: () => void;
}

export function CircuitVisualizationSection({
  simulationResult,
  numQubits,
  circuit,
  onSuggestionClick,
  onStepModeToggle,
  onSimulationStep,
  onSimulationReset,
  onSimulationPause,
  onSimulationResume
}: CircuitVisualizationSectionProps) {
  const [isOutputCollapsed, setIsOutputCollapsed] = useState(false);
  const [isDebugCollapsed, setIsDebugCollapsed] = useState(true);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Output Console - New collapsible console */}
      <OutputConsole
        simulationResult={simulationResult}
        isCollapsed={isOutputCollapsed}
        onToggleCollapse={setIsOutputCollapsed}
      />

      {/* Existing visualization components */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <QuantumStateVisualization 
          simulationResult={simulationResult} 
          NUM_QUBITS={numQubits} 
        />
        
        <EntanglementVisualization 
          simulationResult={simulationResult}
          numQubits={numQubits}
        />
      </div>

      {/* Debug Console - Optional advanced debugging */}
      <DebugConsole
        simulationResult={simulationResult}
        onStepMode={onStepModeToggle}
        onStep={onSimulationStep}
        onPause={onSimulationPause}
        onResume={onSimulationResume}
        onReset={onSimulationReset}
        isStepMode={false}
        isPaused={false}
        currentStep={0}
      />
    </div>
  );
}
