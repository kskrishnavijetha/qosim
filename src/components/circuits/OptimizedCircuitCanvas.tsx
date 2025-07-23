
import React, { memo, useMemo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDragDrop } from '@/contexts/DragDropContext';
import { Gate, Circuit } from '@/hooks/useCircuitWorkspace';

interface OptimizedCircuitCanvasProps {
  circuit: Circuit | null;
  onGateRemove: (gateId: string) => void;
  numQubits?: number;
  gridSize?: number;
}

const QubitLine = memo(({ index, gridSize, totalWidth }: { index: number; gridSize: number; totalWidth: number }) => (
  <div 
    key={index}
    className="absolute left-0 right-0 h-px bg-quantum-glow/30"
    style={{ 
      top: `${index * 60 + 50}px`,
      width: `${totalWidth}px`
    }}
  >
    <div
      className="absolute left-4 text-sm font-mono text-quantum-glow/70"
      style={{ top: `-10px` }}
    >
      q[{index}]
    </div>
  </div>
));

QubitLine.displayName = 'QubitLine';

const GateComponent = memo(({ 
  gate, 
  onRemove, 
  gridSize 
}: { 
  gate: Gate; 
  onRemove: (id: string) => void; 
  gridSize: number; 
}) => {
  const handleRemove = useCallback(() => onRemove(gate.id), [gate.id, onRemove]);
  
  const style = useMemo(() => ({
    left: `${(gate.position || 0) * gridSize + 100}px`,
    top: `${(gate.qubit || 0) * 60 + 50}px`,
    transform: 'translate(-50%, -50%)'
  }), [gate.position, gate.qubit, gridSize]);

  return (
    <div
      className="absolute group"
      style={style}
    >
      <div className="relative">
        <div className={cn(
          "w-12 h-8 rounded border-2 border-quantum-glow bg-quantum-matrix/20",
          "flex items-center justify-center text-xs font-mono text-quantum-glow",
          "hover:bg-quantum-glow/10 transition-colors cursor-pointer"
        )}>
          {gate.type.toUpperCase()}
        </div>
        
        <Button
          size="sm"
          variant="destructive"
          className="absolute -top-2 -right-2 w-5 h-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleRemove}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
});

GateComponent.displayName = 'GateComponent';

const DropZone = memo(({ 
  dragState, 
  gridSize 
}: { 
  dragState: any; 
  gridSize: number; 
}) => {
  if (!dragState.isDragging || dragState.hoverQubit === null || dragState.hoverPosition === null) {
    return null;
  }

  const style = useMemo(() => ({
    left: `${dragState.hoverPosition * gridSize + 100 - 24}px`,
    top: `${dragState.hoverQubit * 60 + 50 - 16}px`
  }), [dragState.hoverPosition, dragState.hoverQubit, gridSize]);

  return (
    <div
      className="absolute w-12 h-8 border-2 border-dashed border-quantum-glow rounded-lg bg-quantum-glow/20 flex items-center justify-center text-xs font-bold quantum-glow animate-pulse"
      style={style}
    >
      {dragState.gateType}
    </div>
  );
});

DropZone.displayName = 'DropZone';

export const OptimizedCircuitCanvas = memo(function OptimizedCircuitCanvas({ 
  circuit, 
  onGateRemove, 
  numQubits = 8, 
  gridSize = 80 
}: OptimizedCircuitCanvasProps) {
  const { dragState, canvasRef } = useDragDrop();

  const totalWidth = useMemo(() => {
    if (!circuit?.gates.length) return 800;
    const maxPosition = Math.max(...circuit.gates.map(g => g.position || 0));
    return Math.max((maxPosition + 10) * gridSize, 800);
  }, [circuit?.gates, gridSize]);

  const qubitLines = useMemo(() => 
    Array.from({ length: numQubits }, (_, i) => (
      <QubitLine key={i} index={i} gridSize={gridSize} totalWidth={totalWidth} />
    )), 
    [numQubits, gridSize, totalWidth]
  );

  const gates = useMemo(() => 
    circuit?.gates.map(gate => (
      <GateComponent
        key={gate.id}
        gate={gate}
        onRemove={onGateRemove}
        gridSize={gridSize}
      />
    )) || [], 
    [circuit?.gates, onGateRemove, gridSize]
  );

  if (!circuit) {
    return (
      <Card className="h-full quantum-panel neon-border">
        <CardContent className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No circuit selected</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full quantum-panel neon-border">
      <CardContent className="h-full p-0 relative overflow-auto">
        <div className="h-full min-h-[500px] relative">
          <div ref={canvasRef} className="w-full h-full">
            {/* Grid background */}
            <div className="absolute inset-0 opacity-20">
              <div 
                className="h-full w-full"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(123, 255, 178, 0.1) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(123, 255, 178, 0.1) 1px, transparent 1px)
                  `,
                  backgroundSize: `${gridSize}px 60px`
                }}
              />
            </div>

            {/* Qubit lines */}
            {qubitLines}

            {/* Gates */}
            {gates}

            {/* Drop zone indicator */}
            <DropZone dragState={dragState} gridSize={gridSize} />

            {/* Circuit info */}
            <div className="absolute top-4 right-4 text-sm font-mono text-quantum-glow/70">
              {circuit.name} - {circuit.gates.length} gates
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
