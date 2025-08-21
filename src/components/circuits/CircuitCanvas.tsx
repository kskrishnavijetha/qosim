
import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { QuantumGate } from './QuantumCircuitBuilder';

interface CircuitCanvasProps {
  circuit: QuantumGate[];
  numQubits: number;
  selectedGate?: QuantumGate | null;
  onGateAdd: (gateType: string, position: { x: number; y: number }) => void;
  onGateMove: (gateId: string, position: { x: number; y: number }) => void;
  onGateSelect: (gate: QuantumGate) => void;
  onGateRemove: (gateId: string) => void;
  onCanvasClick: () => void;
}

export const CircuitCanvas = forwardRef<HTMLDivElement, CircuitCanvasProps>(
  ({ circuit, numQubits, selectedGate, onGateAdd, onGateMove, onGateSelect, onGateRemove, onCanvasClick }, ref) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const QUBIT_SPACING = 60;
    const TIME_SPACING = 80;
    const GATE_SIZE = 40;

    const handleZoomIn = useCallback(() => {
      setZoom(prev => Math.min(prev * 1.2, 3));
    }, []);

    const handleZoomOut = useCallback(() => {
      setZoom(prev => Math.max(prev / 1.2, 0.5));
    }, []);

    const handleResetView = useCallback(() => {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }, []);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }, [pan]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (isDragging) {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        onCanvasClick();
      }
    }, [onCanvasClick]);

    const getGatePosition = (gate: QuantumGate) => {
      const qubit = gate.qubit ?? (gate.qubits?.[0] ?? 0);
      return {
        x: 100 + gate.position * TIME_SPACING,
        y: 50 + qubit * QUBIT_SPACING
      };
    };

    const renderQubitLine = (qubitIndex: number) => {
      const y = 50 + qubitIndex * QUBIT_SPACING;
      const maxPosition = Math.max(...circuit.map(g => g.position), 5);
      const lineWidth = 200 + maxPosition * TIME_SPACING;

      return (
        <g key={`qubit-${qubitIndex}`}>
          <line
            x1={50}
            y1={y}
            x2={lineWidth}
            y2={y}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          />
          <text
            x={20}
            y={y + 5}
            className="text-sm font-mono fill-foreground"
            textAnchor="middle"
          >
            q{qubitIndex}
          </text>
        </g>
      );
    };

    const renderGate = (gate: QuantumGate) => {
      const pos = getGatePosition(gate);
      const isSelected = selectedGate?.id === gate.id;
      
      // Handle multi-qubit gates
      if (gate.qubits && gate.qubits.length > 1) {
        return renderMultiQubitGate(gate, pos, isSelected);
      }
      
      return (
        <g key={gate.id}>
          <rect
            x={pos.x - GATE_SIZE / 2}
            y={pos.y - GATE_SIZE / 2}
            width={GATE_SIZE}
            height={GATE_SIZE}
            rx={4}
            className={`cursor-pointer transition-all ${
              isSelected 
                ? 'fill-primary stroke-primary-foreground stroke-2' 
                : 'fill-card stroke-border stroke-1 hover:fill-accent'
            }`}
            onClick={() => onGateSelect(gate)}
            onDoubleClick={() => onGateRemove(gate.id)}
          />
          <text
            x={pos.x}
            y={pos.y + 4}
            className="text-xs font-bold fill-foreground pointer-events-none"
            textAnchor="middle"
          >
            {gate.type}
          </text>
          {gate.angle && (
            <text
              x={pos.x}
              y={pos.y + 25}
              className="text-xs fill-muted-foreground pointer-events-none"
              textAnchor="middle"
            >
              {gate.angle.toFixed(2)}
            </text>
          )}
        </g>
      );
    };

    const renderMultiQubitGate = (gate: QuantumGate, pos: { x: number; y: number }, isSelected: boolean) => {
      if (!gate.qubits || gate.qubits.length < 2) return null;

      const positions = gate.qubits.map(q => ({
        x: pos.x,
        y: 50 + q * QUBIT_SPACING
      }));

      const minY = Math.min(...positions.map(p => p.y));
      const maxY = Math.max(...positions.map(p => p.y));

      return (
        <g key={gate.id}>
          {/* Connection line */}
          <line
            x1={pos.x}
            y1={minY}
            x2={pos.x}
            y2={maxY}
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
          />
          
          {/* Gate symbols */}
          {positions.map((gatePos, index) => (
            <g key={`${gate.id}-${index}`}>
              <circle
                cx={gatePos.x}
                cy={gatePos.y}
                r={GATE_SIZE / 3}
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? 'fill-primary stroke-primary-foreground stroke-2' 
                    : 'fill-card stroke-border stroke-1 hover:fill-accent'
                }`}
                onClick={() => onGateSelect(gate)}
                onDoubleClick={() => onGateRemove(gate.id)}
              />
              <text
                x={gatePos.x}
                y={gatePos.y + 3}
                className="text-xs font-bold fill-foreground pointer-events-none"
                textAnchor="middle"
              >
                {gate.type === 'CNOT' || gate.type === 'CX' ? (index === 0 ? '●' : '⊕') : gate.type}
              </text>
            </g>
          ))}
        </g>
      );
    };

    return (
      <div className="flex-1 flex flex-col">
        {/* Canvas Controls */}
        <div className="flex items-center gap-2 p-2 border-b bg-card">
          <Button variant="outline" size="sm" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetView}>
            <RotateCcw className="w-4 h-4" />
          </Button>
          <div className="text-sm text-muted-foreground ml-2">
            Zoom: {(zoom * 100).toFixed(0)}%
          </div>
        </div>

        {/* Circuit Canvas */}
        <Card className="flex-1 m-4 overflow-hidden">
          <CardContent className="p-0 h-full">
            <div
              ref={canvasRef}
              className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onClick={handleCanvasClick}
            >
              <svg
                width="100%"
                height="100%"
                viewBox={`${-pan.x / zoom} ${-pan.y / zoom} ${800 / zoom} ${600 / zoom}`}
                className="w-full h-full"
              >
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground opacity-20"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Qubit Lines */}
                {Array.from({ length: numQubits }, (_, i) => renderQubitLine(i))}

                {/* Gates */}
                {circuit.map(gate => renderGate(gate))}

                {/* Time markers */}
                {Array.from({ length: 10 }, (_, i) => (
                  <g key={`time-${i}`}>
                    <line
                      x1={100 + i * TIME_SPACING}
                      y1={20}
                      x2={100 + i * TIME_SPACING}
                      y2={30}
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-muted-foreground opacity-50"
                    />
                    <text
                      x={100 + i * TIME_SPACING}
                      y={15}
                      className="text-xs fill-muted-foreground"
                      textAnchor="middle"
                    >
                      {i}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

CircuitCanvas.displayName = 'CircuitCanvas';
