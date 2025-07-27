
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QuantumGate } from '@/hooks/useCircuitBuilder';
import { Trash2, Edit3, Copy } from 'lucide-react';

interface CircuitCanvasProps {
  circuit: QuantumGate[];
  selectedGates: string[];
  zoom: number;
  pan: { x: number; y: number };
  showGrid: boolean;
  snapToGrid: boolean;
  numQubits: number;
  circuitDepth: number;
  onGateSelect: (gateId: string, addToSelection?: boolean) => void;
  onGateMove: (gateId: string, newPosition: { x: number; y: number }, newLayer?: number) => void;
  onGateDelete: (gateId: string) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
}

export function CircuitCanvas({
  circuit,
  selectedGates,
  zoom,
  pan,
  showGrid,
  snapToGrid,
  numQubits,
  circuitDepth,
  onGateSelect,
  onGateMove,
  onGateDelete,
  onPanChange
}: CircuitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredGate, setHoveredGate] = useState<string | null>(null);
  const [draggedGate, setDraggedGate] = useState<string | null>(null);

  const QUBIT_SPACING = 80;
  const LAYER_SPACING = 100;
  const GATE_SIZE = 40;

  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!showGrid) return;

    ctx.strokeStyle = 'rgba(128, 128, 128, 0.2)';
    ctx.lineWidth = 1;

    // Draw vertical lines (time steps)
    for (let i = 0; i <= circuitDepth; i++) {
      const x = 60 + i * LAYER_SPACING;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines (qubits)
    for (let i = 0; i < numQubits; i++) {
      const y = 60 + i * QUBIT_SPACING;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [showGrid, circuitDepth, numQubits]);

  const drawQubitLines = useCallback((ctx: CanvasRenderingContext2D, width: number) => {
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.6)';
    ctx.lineWidth = 2;

    for (let i = 0; i < numQubits; i++) {
      const y = 60 + i * QUBIT_SPACING;
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(width - 40, y);
      ctx.stroke();

      // Qubit labels
      ctx.fillStyle = 'rgba(100, 100, 100, 0.8)';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`|q${i}⟩`, 20, y + 5);
    }
  }, [numQubits]);

  const drawGate = useCallback((ctx: CanvasRenderingContext2D, gate: QuantumGate) => {
    const x = 60 + gate.layer * LAYER_SPACING;
    const y = 60 + gate.qubits[0] * QUBIT_SPACING;
    
    const isSelected = selectedGates.includes(gate.id);
    const isHovered = hoveredGate === gate.id;
    
    // Gate background
    ctx.fillStyle = isSelected ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.9)';
    ctx.strokeStyle = isSelected ? 'rgb(59, 130, 246)' : 'rgba(100, 100, 100, 0.8)';
    ctx.lineWidth = isSelected ? 2 : 1;
    
    if (isHovered) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.strokeStyle = 'rgb(59, 130, 246)';
    }

    // Multi-qubit gates
    if (gate.qubits.length > 1) {
      const minQubit = Math.min(...gate.qubits);
      const maxQubit = Math.max(...gate.qubits);
      const minY = 60 + minQubit * QUBIT_SPACING;
      const maxY = 60 + maxQubit * QUBIT_SPACING;
      
      // Connection line
      ctx.beginPath();
      ctx.moveTo(x, minY);
      ctx.lineTo(x, maxY);
      ctx.stroke();
      
      // Draw gate boxes for each qubit
      gate.qubits.forEach(qubit => {
        const gateY = 60 + qubit * QUBIT_SPACING;
        ctx.fillRect(x - GATE_SIZE/2, gateY - GATE_SIZE/2, GATE_SIZE, GATE_SIZE);
        ctx.strokeRect(x - GATE_SIZE/2, gateY - GATE_SIZE/2, GATE_SIZE, GATE_SIZE);
      });
    } else {
      // Single qubit gate
      ctx.fillRect(x - GATE_SIZE/2, y - GATE_SIZE/2, GATE_SIZE, GATE_SIZE);
      ctx.strokeRect(x - GATE_SIZE/2, y - GATE_SIZE/2, GATE_SIZE, GATE_SIZE);
    }

    // Gate label
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(gate.type, x, y + 4);
    
    // Angle annotation for rotation gates
    if (gate.angle !== undefined) {
      ctx.font = '10px monospace';
      ctx.fillText(`θ=${gate.angle.toFixed(2)}`, x, y + 25);
    }
  }, [selectedGates, hoveredGate]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply zoom and pan
    ctx.save();
    ctx.scale(zoom, zoom);
    ctx.translate(pan.x, pan.y);

    // Draw grid
    drawGrid(ctx, canvas.width / zoom, canvas.height / zoom);

    // Draw qubit lines
    drawQubitLines(ctx, canvas.width / zoom);

    // Draw gates
    circuit.forEach(gate => drawGate(ctx, gate));

    ctx.restore();
  }, [circuit, zoom, pan, drawGrid, drawQubitLines, drawGate]);

  const getGateAtPosition = useCallback((x: number, y: number): QuantumGate | null => {
    const canvasX = (x - pan.x) / zoom;
    const canvasY = (y - pan.y) / zoom;

    for (const gate of circuit) {
      const gateX = 60 + gate.layer * LAYER_SPACING;
      const gateY = 60 + gate.qubits[0] * QUBIT_SPACING;
      
      if (Math.abs(canvasX - gateX) < GATE_SIZE/2 && 
          Math.abs(canvasY - gateY) < GATE_SIZE/2) {
        return gate;
      }
    }
    return null;
  }, [circuit, pan, zoom]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const gate = getGateAtPosition(x, y);
    
    if (gate) {
      setDraggedGate(gate.id);
      onGateSelect(gate.id, e.ctrlKey || e.metaKey);
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [getGateAtPosition, onGateSelect, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggedGate) {
      const canvasX = (x - pan.x) / zoom;
      const canvasY = (y - pan.y) / zoom;
      
      // Calculate new layer and qubit
      const newLayer = Math.round((canvasX - 60) / LAYER_SPACING);
      const newQubit = Math.round((canvasY - 60) / QUBIT_SPACING);
      
      if (newLayer >= 0 && newLayer < circuitDepth && newQubit >= 0 && newQubit < numQubits) {
        onGateMove(draggedGate, { x: canvasX, y: canvasY }, newLayer);
      }
    } else if (isDragging) {
      onPanChange({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    } else {
      const gate = getGateAtPosition(x, y);
      setHoveredGate(gate?.id || null);
    }
  }, [draggedGate, isDragging, dragStart, pan, zoom, onGateMove, onPanChange, getGateAtPosition, circuitDepth, numQubits]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggedGate(null);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    // Zoom functionality would be implemented here
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div ref={containerRef} className="w-full h-full relative bg-gradient-to-br from-background via-background/95 to-accent/5">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
      />
      
      {/* Gate Context Menu */}
      {hoveredGate && (
        <div className="absolute top-4 right-4 bg-card border rounded-lg shadow-lg p-2 flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => onGateDelete(hoveredGate)}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Edit3 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      {/* Circuit Info */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm border rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{circuit.length} gates</Badge>
          <Badge variant="outline">{numQubits} qubits</Badge>
          <Badge variant="outline">Depth: {circuitDepth}</Badge>
        </div>
        {selectedGates.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {selectedGates.length} gate(s) selected
          </div>
        )}
      </div>
    </div>
  );
}
