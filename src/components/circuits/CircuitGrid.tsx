
import { Gate } from '@/hooks/useCircuitState';

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

export interface CircuitGridProps {
  circuit: Gate[];
  dragState: DragState;
  simulationResult: any;
  onDeleteGate: (gateId: string) => void;
  circuitRef: React.RefObject<HTMLDivElement>;
  NUM_QUBITS: number;
  GRID_SIZE: number;
}

export function CircuitGrid({ circuit, dragState, simulationResult, onDeleteGate, circuitRef, NUM_QUBITS, GRID_SIZE }: CircuitGridProps) {
  return (
    <div ref={circuitRef} className="quantum-panel">
      {/* Placeholder circuit grid */}
      <p>Circuit Grid with {circuit.length} gates</p>
      <p>Qubits: {NUM_QUBITS}, Grid Size: {GRID_SIZE}</p>
    </div>
  );
}
