
import React, { forwardRef, useCallback, useRef, useEffect, useState } from 'react';
import { CircuitGate, CircuitQubit, QuantumCircuit, CircuitSimulationResult } from '@/hooks/useCircuitBuilder';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CircuitCanvasProps {
  circuit: QuantumCircuit;
  selectedGate: CircuitGate | null;
  simulationResult: CircuitSimulationResult | null;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  onGateAdd: (gateType: string, qubits: string[], position: { x: number; y: number }) => void;
  onGateMove: (gateId: string, position: { x: number; y: number }) => void;
  onGateSelect: (gate: CircuitGate) => void;
  onGateRemove: (gateId: string) => void;
  onCanvasClick: () => void;
  onPanStart: (e: React.MouseEvent) => void;
  onPanMove: (e: React.MouseEvent) => void;
  onPanEnd: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

const QUBIT_SPACING = 80;
const LAYER_SPACING = 100;
const GATE_SIZE = 40;
const CANVAS_WIDTH = 2000;
const CANVAS_HEIGHT = 1000;

export const CircuitCanvas = forwardRef<HTMLDivElement, CircuitCanvasProps>(
  ({ 
    circuit, 
    selectedGate, 
    simulationResult,
    zoomLevel, 
    panOffset,
    onGateAdd,
    onGateMove,
    onGateSelect,
    onGateRemove,
    onCanvasClick,
    onPanStart,
    onPanMove,
    onPanEnd,
    onZoomIn,
    onZoomOut,
    onResetView
  }, ref) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [draggedGate, setDraggedGate] = useState<CircuitGate | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [dropTarget, setDropTarget] = useState<{ x: number; y: number } | null>(null);

    // Handle gate dragging
    const handleGateMouseDown = useCallback((e: React.MouseEvent, gate: CircuitGate) => {
      e.stopPropagation();
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setDraggedGate(gate);
        setDragOffset({
          x: e.clientX - rect.left - gate.position.x,
          y: e.clientY - rect.top - gate.position.y
        });
      }
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (draggedGate) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left - dragOffset.x;
          const y = e.clientY - rect.top - dragOffset.y;
          
          // Snap to grid
          const snappedX = Math.round(x / LAYER_SPACING) * LAYER_SPACING;
          const snappedY = Math.round(y / QUBIT_SPACING) * QUBIT_SPACING;
          
          setDropTarget({ x: snappedX, y: snappedY });
        }
      } else {
        onPanMove(e);
      }
    }, [draggedGate, dragOffset, onPanMove]);

    const handleMouseUp = useCallback(() => {
      if (draggedGate && dropTarget) {
        onGateMove(draggedGate.id, dropTarget);
      }
      setDraggedGate(null);
      setDropTarget(null);
      onPanEnd();
    }, [draggedGate, dropTarget, onGateMove, onPanEnd]);

    // Handle canvas click
    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        onCanvasClick();
      }
    }, [onCanvasClick]);

    // Render qubit lines
    const renderQubitLines = () => {
      return circuit.qubits.map((qubit, index) => {
        const y = index * QUBIT_SPACING + QUBIT_SPACING;
        const stateInfo = simulationResult?.qubitStates.find(qs => qs.qubit === qubit.id);
        
        return (
          <g key={qubit.id}>
            {/* Qubit line */}
            <line
              x1={100}
              y1={y}
              x2={CANVAS_WIDTH - 100}
              y2={y}
              stroke="currentColor"
              strokeWidth="2"
              className="text-quantum-neon"
            />
            
            {/* Qubit label */}
            <text
              x={50}
              y={y + 5}
              className="text-sm font-mono fill-current"
              textAnchor="middle"
            >
              {qubit.name}
            </text>
            
            {/* State visualization */}
            {stateInfo && (
              <text
                x={CANVAS_WIDTH - 50}
                y={y + 5}
                className="text-xs font-mono fill-current text-quantum-particle"
                textAnchor="middle"
              >
                {stateInfo.state}
              </text>
            )}
            
            {/* Probability visualization */}
            {stateInfo && (
              <rect
                x={CANVAS_WIDTH - 80}
                y={y - 5}
                width={30 * stateInfo.probability}
                height={10}
                fill="currentColor"
                className="text-quantum-energy opacity-50"
              />
            )}
          </g>
        );
      });
    };

    // Render gates
    const renderGates = () => {
      return circuit.gates.map((gate) => {
        const isSelected = selectedGate?.id === gate.id;
        const isDragging = draggedGate?.id === gate.id;
        const position = isDragging && dropTarget ? dropTarget : gate.position;
        
        return (
          <g key={gate.id}>
            {/* Multi-qubit gate connections */}
            {gate.qubits.length > 1 && (
              <line
                x1={position.x + GATE_SIZE / 2}
                y1={getQubitY(gate.qubits[0])}
                x2={position.x + GATE_SIZE / 2}
                y2={getQubitY(gate.qubits[gate.qubits.length - 1])}
                stroke="currentColor"
                strokeWidth="2"
                className="text-quantum-plasma"
              />
            )}
            
            {/* Gate visualization */}
            <rect
              x={position.x}
              y={position.y}
              width={GATE_SIZE}
              height={GATE_SIZE}
              fill={gate.metadata?.color || '#BDC3C7'}
              stroke={isSelected ? 'currentColor' : 'none'}
              strokeWidth={isSelected ? 3 : 0}
              className={cn(
                'cursor-pointer transition-all',
                isSelected && 'stroke-quantum-glow',
                isDragging && 'opacity-50'
              )}
              onMouseDown={(e) => handleGateMouseDown(e, gate)}
              onClick={() => onGateSelect(gate)}
            />
            
            {/* Gate label */}
            <text
              x={position.x + GATE_SIZE / 2}
              y={position.y + GATE_SIZE / 2 + 5}
              className="text-xs font-bold fill-black pointer-events-none"
              textAnchor="middle"
            >
              {gate.metadata?.label || gate.type}
            </text>
            
            {/* Parameter display */}
            {gate.params?.angle && (
              <text
                x={position.x + GATE_SIZE / 2}
                y={position.y + GATE_SIZE + 15}
                className="text-xs font-mono fill-current"
                textAnchor="middle"
              >
                {(gate.params.angle * 180 / Math.PI).toFixed(1)}°
              </text>
            )}
          </g>
        );
      });
    };

    // Get qubit Y position
    const getQubitY = (qubitId: string) => {
      const qubitIndex = circuit.qubits.findIndex(q => q.id === qubitId);
      return qubitIndex * QUBIT_SPACING + QUBIT_SPACING;
    };

    // Render grid
    const renderGrid = () => {
      const lines = [];
      
      // Vertical lines (layers)
      for (let x = 100; x < CANVAS_WIDTH; x += LAYER_SPACING) {
        lines.push(
          <line
            key={`v-${x}`}
            x1={x}
            y1={50}
            x2={x}
            y2={CANVAS_HEIGHT - 50}
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground opacity-20"
          />
        );
      }
      
      // Horizontal lines (qubits)
      circuit.qubits.forEach((_, index) => {
        const y = index * QUBIT_SPACING + QUBIT_SPACING;
        lines.push(
          <line
            key={`h-${index}`}
            x1={100}
            y1={y}
            x2={CANVAS_WIDTH - 100}
            y2={y}
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted-foreground opacity-10"
          />
        );
      });
      
      return lines;
    };

    return (
      <div className="relative h-full overflow-hidden bg-quantum-matrix">
        {/* Zoom controls */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomIn}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onZoomOut}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onResetView}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="w-full h-full cursor-grab"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: '0 0'
          }}
          onMouseDown={onPanStart}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onClick={handleCanvasClick}
        >
          <svg
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-full"
          >
            {/* Grid */}
            {renderGrid()}
            
            {/* Qubit lines */}
            {renderQubitLines()}
            
            {/* Gates */}
            {renderGates()}
            
            {/* Drop target indicator */}
            {dropTarget && (
              <rect
                x={dropTarget.x}
                y={dropTarget.y}
                width={GATE_SIZE}
                height={GATE_SIZE}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="text-quantum-glow"
              />
            )}
          </svg>
        </div>
      </div>
    );
  }
);

CircuitCanvas.displayName = 'CircuitCanvas';
