import React, { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { type OptimizedSimulationResult } from "@/lib/quantumSimulatorOptimized";
import { MemoizedGate } from "./MemoizedGate";

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
}

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface VirtualizedCircuitGridProps {
  circuit: Gate[];
  dragState: DragState;
  simulationResult: OptimizedSimulationResult | null;
  onDeleteGate: (gateId: string) => void;
  circuitRef: React.RefObject<HTMLDivElement>;
  NUM_QUBITS: number;
  GRID_SIZE: number;
}

const VIEWPORT_WIDTH = 800; // Visible viewport width
const BUFFER_SIZE = 200; // Extra rendering buffer

export function VirtualizedCircuitGrid({ 
  circuit, 
  dragState, 
  simulationResult, 
  onDeleteGate, 
  circuitRef, 
  NUM_QUBITS, 
  GRID_SIZE 
}: VirtualizedCircuitGridProps) {
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate the total width needed based on circuit positions
  const totalWidth = useMemo(() => {
    const maxPosition = circuit.reduce((max, gate) => Math.max(max, gate.position), 0);
    return Math.max((maxPosition + 10) * GRID_SIZE, VIEWPORT_WIDTH);
  }, [circuit, GRID_SIZE]);

  // Calculate visible range for virtual scrolling
  const visibleRange = useMemo(() => {
    const startPosition = Math.max(0, Math.floor((scrollLeft - BUFFER_SIZE) / GRID_SIZE));
    const endPosition = Math.ceil((scrollLeft + VIEWPORT_WIDTH + BUFFER_SIZE) / GRID_SIZE);
    return { start: startPosition, end: endPosition };
  }, [scrollLeft, GRID_SIZE]);

  // Filter gates that are in the visible range
  const visibleGates = useMemo(() => {
    return circuit.filter(gate => 
      gate.position >= visibleRange.start && gate.position <= visibleRange.end
    );
  }, [circuit, visibleRange]);

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  }, []);

  // Memoized qubit lines
  const qubitLines = useMemo(() => (
    Array.from({ length: NUM_QUBITS }).map((_, i) => (
      <div key={`qubit-${i}`} className="flex items-center mb-4 relative" style={{ top: i * 60 + 20 }}>
        <div className="w-8 text-xs font-mono text-quantum-neon absolute -left-10">q{i}</div>
        <div 
          className="h-0.5 bg-quantum-neon relative entanglement-line"
          style={{ width: totalWidth }}
        />
        <div className="w-16 text-xs font-mono text-muted-foreground absolute -right-20">
          {simulationResult?.qubitStates[i]?.state || '|0⟩'}
        </div>
      </div>
    ))
  ), [NUM_QUBITS, totalWidth, simulationResult]);

  return (
    <div className="flex-1">
      <div 
        ref={scrollContainerRef}
        className="relative bg-quantum-matrix rounded-lg p-4 min-h-[320px] quantum-panel overflow-x-auto"
        onScroll={handleScroll}
        style={{ 
          backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--quantum-neon) / 0.1) 0px, hsl(var(--quantum-neon) / 0.1) 1px, transparent 1px, transparent ${GRID_SIZE}px)`,
          backgroundPosition: `${-scrollLeft}px 0`
        }}
      >
        <div 
          ref={circuitRef}
          className="relative"
          style={{ width: totalWidth, minHeight: '280px' }}
        >
          {/* Qubit Lines */}
          {qubitLines}

          {/* Virtualized Gates */}
          {visibleGates.map((gate, index) => (
            <MemoizedGate
              key={gate.id}
              gate={gate}
              index={index}
              gridSize={GRID_SIZE}
              onDeleteGate={onDeleteGate}
            />
          ))}

          {/* Drop Zone Indicator */}
          {dragState.isDragging && dragState.hoverQubit !== null && dragState.hoverPosition !== null && (
            <div
              className="absolute w-10 h-10 border-2 border-dashed border-quantum-glow rounded-lg bg-quantum-glow/20 flex items-center justify-center text-xs font-bold quantum-glow animate-pulse"
              style={{
                left: dragState.hoverPosition * GRID_SIZE + 20,
                top: dragState.hoverQubit * 60 + 15
              }}
            >
              {dragState.gateType}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}