import React, { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { type OptimizedSimulationResult } from "@/lib/quantumSimulatorOptimized";
import { MemoizedGate } from "./MemoizedGate";
import { useIsMobile } from "@/hooks/use-mobile";

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
  isMobile?: boolean;
}

const MOBILE_VIEWPORT_WIDTH = 300;
const DESKTOP_VIEWPORT_WIDTH = 800;
const BUFFER_SIZE = 200;

export function VirtualizedCircuitGrid({ 
  circuit, 
  dragState, 
  simulationResult, 
  onDeleteGate, 
  circuitRef, 
  NUM_QUBITS, 
  GRID_SIZE,
  isMobile = false
}: VirtualizedCircuitGridProps) {
  const [scrollLeft, setScrollLeft] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const VIEWPORT_WIDTH = isMobile ? MOBILE_VIEWPORT_WIDTH : DESKTOP_VIEWPORT_WIDTH;

  // Calculate the total width needed based on circuit positions
  const totalWidth = useMemo(() => {
    const maxPosition = circuit.reduce((max, gate) => Math.max(max, gate.position), 0);
    return Math.max((maxPosition + 10) * GRID_SIZE, VIEWPORT_WIDTH);
  }, [circuit, GRID_SIZE, VIEWPORT_WIDTH]);

  // Calculate visible range for virtual scrolling
  const visibleRange = useMemo(() => {
    const startPosition = Math.max(0, Math.floor((scrollLeft - BUFFER_SIZE) / GRID_SIZE));
    const endPosition = Math.ceil((scrollLeft + VIEWPORT_WIDTH + BUFFER_SIZE) / GRID_SIZE);
    return { start: startPosition, end: endPosition };
  }, [scrollLeft, GRID_SIZE, VIEWPORT_WIDTH]);

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

  // Responsive qubit line spacing
  const qubitSpacing = isMobile ? 50 : 60;

  // Memoized qubit lines
  const qubitLines = useMemo(() => (
    Array.from({ length: NUM_QUBITS }).map((_, i) => (
      <div key={`qubit-${i}`} className="flex items-center mb-3 lg:mb-4 relative" style={{ top: i * qubitSpacing + 20 }}>
        <div className={`text-xs font-mono text-quantum-neon absolute ${isMobile ? '-left-8 w-6' : '-left-10 w-8'}`}>
          q{i}
        </div>
        <div 
          className="h-0.5 bg-quantum-neon relative entanglement-line"
          style={{ width: totalWidth }}
        />
        <div className={`text-xs font-mono text-muted-foreground absolute ${isMobile ? '-right-16 w-14' : '-right-20 w-16'} truncate`}>
          {simulationResult?.qubitStates[i]?.state || '|0⟩'}
        </div>
      </div>
    ))
  ), [NUM_QUBITS, totalWidth, simulationResult, qubitSpacing, isMobile]);

  return (
    <div className="flex-1">
      <div 
        ref={scrollContainerRef}
        className={`relative bg-quantum-matrix rounded-lg p-2 lg:p-4 quantum-panel overflow-x-auto ${
          isMobile ? 'min-h-[280px]' : 'min-h-[320px]'
        }`}
        onScroll={handleScroll}
        style={{ 
          backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--quantum-neon) / 0.1) 0px, hsl(var(--quantum-neon) / 0.1) 1px, transparent 1px, transparent ${GRID_SIZE}px)`,
          backgroundPosition: `${-scrollLeft}px 0`
        }}
      >
        <div 
          ref={circuitRef}
          className="relative"
          style={{ width: totalWidth, minHeight: isMobile ? '250px' : '280px' }}
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
              qubitSpacing={qubitSpacing}
            />
          ))}

          {/* Drop Zone Indicator */}
          {dragState.isDragging && dragState.hoverQubit !== null && dragState.hoverPosition !== null && (
            <div
              className={`absolute border-2 border-dashed border-quantum-glow rounded-lg bg-quantum-glow/20 flex items-center justify-center text-xs font-bold quantum-glow animate-pulse ${
                isMobile ? 'w-8 h-8' : 'w-10 h-10'
              }`}
              style={{
                left: dragState.hoverPosition * GRID_SIZE + (isMobile ? 16 : 20),
                top: dragState.hoverQubit * qubitSpacing + 15
              }}
            >
              {isMobile ? dragState.gateType.charAt(0) : dragState.gateType}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
