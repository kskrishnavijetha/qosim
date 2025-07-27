
import React, { useRef } from 'react';
import { CircuitBuilder } from '@/components/circuits/CircuitBuilder';
import { useCircuitState } from '@/hooks/useCircuitState';
import { useCircuitDragDrop } from '@/hooks/useCircuitDragDrop';

export default function Builder() {
  const circuitRef = useRef<HTMLDivElement>(null);
  const numQubits = 5;
  const gridSize = 50;
  
  const {
    circuit,
    simulationResult,
    addGate,
    deleteGate
  } = useCircuitState();

  const {
    dragState,
    handleMouseDown,
    handleTouchStart
  } = useCircuitDragDrop({
    onGateAdd: addGate,
    numQubits,
    gridSize
  });

  return (
    <CircuitBuilder
      circuit={circuit}
      dragState={dragState}
      simulationResult={simulationResult}
      onDeleteGate={deleteGate}
      onGateMouseDown={handleMouseDown}
      onGateTouchStart={handleTouchStart}
      circuitRef={circuitRef}
      numQubits={numQubits}
      gridSize={gridSize}
    />
  );
}
