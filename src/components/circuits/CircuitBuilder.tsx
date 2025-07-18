
import React from 'react';
import { ResponsiveCircuitBuilder } from '../mobile/ResponsiveCircuitBuilder';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { CustomGate } from '@/lib/customGates';
import { useTouchDragDrop } from '@/hooks/useTouchDragDrop';
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
  onGateAdd: (gate: Gate) => void;
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
  onGateAdd,
  circuitRef,
  numQubits,
  gridSize,
  customGates = []
}: CircuitBuilderProps) {
  const isMobile = useIsMobile();
  
  // Use touch drag drop for mobile devices
  const { handleTouchStart } = useTouchDragDrop({
    onGateAdd,
    numQubits,
    gridSize
  });

  return (
    <ResponsiveCircuitBuilder
      circuit={circuit}
      dragState={dragState}
      simulationResult={simulationResult}
      onDeleteGate={onDeleteGate}
      onGateMouseDown={onGateMouseDown}
      onGateTouchStart={handleTouchStart}
      circuitRef={circuitRef}
      numQubits={numQubits}
      gridSize={gridSize}
      customGates={customGates}
    />
  );
}
