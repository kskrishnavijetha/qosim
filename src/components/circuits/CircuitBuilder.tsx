import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GatePalette } from './GatePalette';
import { CircuitGrid } from './CircuitGrid';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface CircuitBuilderProps {
  circuit: Gate[];
  dragState: DragState;
  simulationResult: OptimizedSimulationResult | null;
  onDeleteGate: (gateId: string) => void;
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
  circuitRef: React.RefObject<HTMLDivElement>;
  numQubits: number;
  gridSize: number;
}

export function CircuitBuilder({
  circuit,
  dragState,
  simulationResult,
  onDeleteGate,
  onGateMouseDown,
  circuitRef,
  numQubits,
  gridSize
}: CircuitBuilderProps) {
  return (
    <Card className="quantum-panel neon-border animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '400ms' }}>
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow">Circuit Designer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          <div className="lg:shrink-0">
            <GatePalette onGateMouseDown={onGateMouseDown} />
          </div>
          <CircuitGrid 
            circuit={circuit}
            dragState={dragState}
            simulationResult={simulationResult}
            onDeleteGate={onDeleteGate}
            circuitRef={circuitRef}
            NUM_QUBITS={numQubits}
            GRID_SIZE={gridSize}
          />
        </div>
      </CardContent>
    </Card>
  );
}