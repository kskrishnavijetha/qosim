
import React, { memo, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Copy, Move, RotateCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDragDrop } from '@/contexts/DragDropContext';
import { Gate, Circuit } from '@/hooks/useCircuitWorkspace';
import { useIsMobile } from '@/hooks/use-mobile';

interface OptimizedCircuitCanvasProps {
  circuit: Circuit | null;
  onCircuitChange: (circuit: Circuit) => void;
  gridSize: number;
  numQubits: number;
}

interface VirtualizedGateProps {
  gate: Gate;
  gridSize: number;
  numQubits: number;
  isSelected: boolean;
  onSelect: (gateId: string) => void;
  onDelete: (gateId: string) => void;
  onMove: (gateId: string, newQubit: number, newPosition: number) => void;
}

const VirtualizedGate = memo(function VirtualizedGate({
  gate,
  gridSize,
  numQubits,
  isSelected,
  onSelect,
  onDelete,
  onMove
}: VirtualizedGateProps) {
  const isMobile = useIsMobile();
  const [isMoving, setIsMoving] = useState(false);
  
  const gateColors = {
    'H': 'bg-quantum-glow',
    'X': 'bg-quantum-neon',
    'Y': 'bg-purple-500',
    'Z': 'bg-quantum-particle',
    'CNOT': 'bg-quantum-plasma',
    'CX': 'bg-quantum-plasma',
    'RX': 'bg-quantum-energy',
    'RY': 'bg-secondary',
    'RZ': 'bg-orange-500',
    'MEASURE': 'bg-destructive'
  };

  const gateColor = gateColors[gate.type] || 'bg-slate-500';
  const gateSize = isMobile ? 32 : 40;
  const x = gate.position * gridSize + 100;
  const y = (gate.qubit || 0) * 60 + 40;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMoving) return;
    onSelect(gate.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(gate.id);
  };

  const handleMove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMoving(true);
    // Implement move logic here
  };

  return (
    <div
      className={cn(
        "absolute group cursor-pointer transition-all duration-200",
        isSelected && "ring-2 ring-quantum-glow ring-offset-2"
      )}
      style={{
        left: x - gateSize/2,
        top: y - gateSize/2,
        width: gateSize,
        height: gateSize
      }}
      onClick={handleClick}
    >
      <div className={cn(
        "w-full h-full rounded-lg border-2 border-current flex items-center justify-center text-xs font-bold text-black quantum-glow",
        gateColor,
        isSelected && "scale-110"
      )}>
        {gate.type.length > 4 ? gate.type.slice(0, 3) : gate.type}
      </div>

      {/* Gate controls */}
      <div className={cn(
        "absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
        isSelected && "opacity-100"
      )}>
        <Button
          size="sm"
          variant="secondary"
          className="w-6 h-6 p-0"
          onClick={handleMove}
          title="Move gate"
        >
          <Move className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="w-6 h-6 p-0"
          onClick={handleDelete}
          title="Delete gate"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Multi-qubit gate connections */}
      {gate.type === 'CNOT' && gate.qubits && gate.qubits.length >= 2 && (
        <div
          className="absolute w-0.5 bg-quantum-plasma animate-pulse"
          style={{
            height: Math.abs(gate.qubits[1] - gate.qubits[0]) * 60,
            left: '50%',
            transform: 'translateX(-50%)',
            top: gate.qubits[0] < gate.qubits[1] ? '100%' : `-${Math.abs(gate.qubits[1] - gate.qubits[0]) * 60}px`
          }}
        />
      )}
    </div>
  );
});

export const OptimizedCircuitCanvas = memo(function OptimizedCircuitCanvas({
  circuit,
  onCircuitChange,
  gridSize,
  numQubits
}: OptimizedCircuitCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(800);
  const { state, selectGate, deselectGate, clearSelection } = useDragDrop();
  const isMobile = useIsMobile();

  // Calculate virtualization parameters
  const bufferSize = 5;
  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollLeft / gridSize) - bufferSize);
    const end = Math.ceil((scrollLeft + viewportWidth) / gridSize) + bufferSize;
    return { start, end };
  }, [scrollLeft, viewportWidth, gridSize]);

  // Filter visible gates
  const visibleGates = useMemo(() => {
    if (!circuit) return [];
    return circuit.gates.filter(gate => 
      gate.position >= visibleRange.start && gate.position <= visibleRange.end
    );
  }, [circuit, visibleRange]);

  // Calculate circuit dimensions
  const circuitWidth = useMemo(() => {
    if (!circuit || circuit.gates.length === 0) return 1000;
    const maxPosition = Math.max(...circuit.gates.map(g => g.position));
    return Math.max((maxPosition + 10) * gridSize, 1000);
  }, [circuit, gridSize]);

  // Handle scroll for virtualization
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  }, []);

  // Update viewport width on resize
  useEffect(() => {
    const updateViewport = () => {
      if (canvasRef.current) {
        setViewportWidth(canvasRef.current.clientWidth);
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Gate operations
  const handleGateSelect = useCallback((gateId: string) => {
    if (state.selectedGates.has(gateId)) {
      deselectGate(gateId);
    } else {
      selectGate(gateId);
    }
  }, [state.selectedGates, selectGate, deselectGate]);

  const handleGateDelete = useCallback((gateId: string) => {
    if (!circuit) return;
    
    const updatedCircuit = {
      ...circuit,
      gates: circuit.gates.filter(g => g.id !== gateId)
    };
    
    onCircuitChange(updatedCircuit);
    deselectGate(gateId);
  }, [circuit, onCircuitChange, deselectGate]);

  const handleGateMove = useCallback((gateId: string, newQubit: number, newPosition: number) => {
    if (!circuit) return;
    
    const updatedCircuit = {
      ...circuit,
      gates: circuit.gates.map(g => 
        g.id === gateId ? { ...g, qubit: newQubit, position: newPosition } : g
      )
    };
    
    onCircuitChange(updatedCircuit);
  }, [circuit, onCircuitChange]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      clearSelection();
    }
  }, [clearSelection]);

  // Render qubit lines
  const renderQubitLines = useMemo(() => {
    const lines = [];
    for (let i = 0; i < numQubits; i++) {
      const y = i * 60 + 40;
      lines.push(
        <React.Fragment key={i}>
          {/* Qubit line */}
          <div
            className="absolute left-0 h-0.5 bg-quantum-neon/50"
            style={{
              top: y,
              width: circuitWidth
            }}
          />
          {/* Qubit label */}
          <div
            className="absolute left-2 text-sm font-mono text-quantum-glow bg-background px-1 rounded"
            style={{ top: y - 12 }}
          >
            q[{i}]
          </div>
        </React.Fragment>
      );
    }
    return lines;
  }, [numQubits, circuitWidth]);

  if (!circuit) {
    return (
      <Card className="h-full quantum-panel neon-border">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-4xl">⚡</div>
            <p className="text-muted-foreground">No circuit selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full quantum-panel neon-border">
      <CardContent className="h-full p-0">
        {/* Circuit header */}
        <div className="p-4 border-b border-quantum-glow/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-quantum-glow">{circuit.name}</h3>
            <Badge variant="outline">
              {circuit.gates.length} gates
            </Badge>
            <Badge variant="outline">
              {numQubits} qubits
            </Badge>
          </div>
          
          {state.selectedGates.size > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {state.selectedGates.size} selected
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={clearSelection}
                className="neon-border"
              >
                Clear
              </Button>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-auto bg-quantum-matrix/10"
          onScroll={handleScroll}
          onClick={handleCanvasClick}
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(123, 255, 178, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(123, 255, 178, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px 60px`,
            backgroundPosition: `${-scrollLeft}px 0`
          }}
        >
          <div
            className="relative"
            style={{
              width: circuitWidth,
              height: numQubits * 60 + 80
            }}
          >
            {/* Qubit lines */}
            {renderQubitLines}

            {/* Gates */}
            {visibleGates.map(gate => (
              <VirtualizedGate
                key={gate.id}
                gate={gate}
                gridSize={gridSize}
                numQubits={numQubits}
                isSelected={state.selectedGates.has(gate.id)}
                onSelect={handleGateSelect}
                onDelete={handleGateDelete}
                onMove={handleGateMove}
              />
            ))}

            {/* Preview gate */}
            {state.dragState.previewGate && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: state.dragState.previewGate.position * gridSize + 100 - 20,
                  top: (state.dragState.previewGate.qubit || 0) * 60 + 40 - 20,
                  width: 40,
                  height: 40
                }}
              >
                <div className="w-full h-full rounded-lg border-2 border-dashed border-quantum-glow bg-quantum-glow/20 flex items-center justify-center text-xs font-bold text-quantum-glow animate-pulse">
                  {state.dragState.previewGate.type}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance info */}
        <div className="p-2 border-t border-quantum-glow/20 text-xs text-muted-foreground flex justify-between">
          <span>
            Showing {visibleGates.length} of {circuit.gates.length} gates
          </span>
          <span>
            Grid: {gridSize}px | Viewport: {Math.round(viewportWidth)}px
          </span>
        </div>
      </CardContent>
    </Card>
  );
});
