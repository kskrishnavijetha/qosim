import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GatePalette } from './GatePalette';
import { CircuitGrid } from './CircuitGrid';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { CustomGate } from '@/lib/customGates';
import { useIsMobile } from '@/hooks/use-mobile';

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
  customGates?: CustomGate[];
}

export function CircuitBuilder({
  circuit,
  dragState,
  simulationResult,
  onDeleteGate,
  onGateMouseDown,
  circuitRef,
  numQubits,
  gridSize,
  customGates = []
}: CircuitBuilderProps) {
  const isMobile = useIsMobile();

  return (
    <Card className="quantum-panel neon-border animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '400ms' }}>
      <CardHeader className="pb-3 lg:pb-6">
        <CardTitle className="text-base lg:text-lg font-mono text-quantum-glow">Circuit Designer</CardTitle>
      </CardHeader>
      <CardContent className="p-3 lg:p-6">
        <div className={`flex gap-3 lg:gap-6 ${isMobile ? 'flex-col' : 'flex-col lg:flex-row'}`}>
          <div className={`${isMobile ? 'w-full' : 'lg:shrink-0'}`}>
            <GatePalette 
              onGateMouseDown={onGateMouseDown} 
              customGates={customGates}
            />
          </div>
          <div className="flex-1 min-w-0">
            <CircuitGrid 
              circuit={circuit}
              dragState={dragState}
              simulationResult={simulationResult}
              onDeleteGate={onDeleteGate}
              circuitRef={circuitRef}
              NUM_QUBITS={numQubits}
              GRID_SIZE={isMobile ? Math.max(gridSize * 0.8, 35) : gridSize}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
