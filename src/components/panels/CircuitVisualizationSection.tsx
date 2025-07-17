
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EntanglementVisualization } from '@/components/simulation/EntanglementVisualization';
import { OutputGraphicalFormat } from '@/components/simulation/output/OutputGraphicalFormat';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { Gate } from '@/hooks/useCircuitState';
import { Play, Pause, RotateCcw, StepForward } from 'lucide-react';

interface CircuitVisualizationSectionProps {
  simulationResult: OptimizedSimulationResult | null;
  numQubits: number;
  circuit: Gate[];
  onSuggestionClick: (suggestion: any) => void;
  onStepModeToggle: (enabled: boolean) => void;
  onSimulationStep: () => any;
  onSimulationReset: () => void;
  onSimulationPause: () => void;
  onSimulationResume: () => void;
  onGateAdd?: (gate: Gate) => void;
  onGateMouseDown?: (e: React.MouseEvent, gateType: string) => void;
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
  onSimulationResume,
  onGateAdd,
  onGateMouseDown
}: CircuitVisualizationSectionProps) {
  // Default handlers if not provided
  const handleGateAdd = onGateAdd || (() => {});
  const handleGateMouseDown = onGateMouseDown || (() => {});

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Step Controls */}
      <Card className="quantum-panel neon-border animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '600ms' }}>
        <CardHeader className="pb-3">
          <CardTitle className="text-base lg:text-lg font-mono text-quantum-glow">Step-by-Step Execution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => onStepModeToggle(true)}
              size="sm"
              variant="outline"
              className="quantum-glow"
            >
              <Play className="w-4 h-4 mr-2" />
              Enable Step Mode
            </Button>
            <Button
              onClick={onSimulationStep}
              size="sm"
              variant="outline"
              className="quantum-glow"
            >
              <StepForward className="w-4 h-4 mr-2" />
              Next Step
            </Button>
            <Button
              onClick={onSimulationReset}
              size="sm"
              variant="outline"
              className="quantum-glow"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={onSimulationPause}
              size="sm"
              variant="outline"
              className="quantum-glow"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Entanglement Analysis */}
      <div className="animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '700ms' }}>
        <EntanglementVisualization
          simulationResult={simulationResult}
          numQubits={numQubits}
          circuit={circuit}
          onGateAdd={handleGateAdd}
          onGateMouseDown={handleGateMouseDown}
        />
      </div>

      {/* Simulation Results */}
      {simulationResult && (
        <Card className="quantum-panel neon-border animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '800ms' }}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base lg:text-lg font-mono text-quantum-glow">Quantum State Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <OutputGraphicalFormat simulationResult={simulationResult} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
