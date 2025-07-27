
import React, { forwardRef, useCallback, useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, RotateCcw, Grid, Eye, EyeOff } from 'lucide-react';
import type { QuantumGate, DragState } from '@/hooks/useCircuitBuilder';

interface CircuitCanvasProps {
  circuit: QuantumGate[];
  dragState: DragState;
  selectedGates: string[];
  zoom: number;
  pan: { x: number; y: number };
  onGateAdd: (gate: Omit<QuantumGate, 'id'>) => void;
  onGateSelect: (gateId: string, addToSelection?: boolean) => void;
  onGateMove: (gateId: string, newPosition: { x: number; y: number }, newLayer?: number) => void;
  onGateDelete: (gateId: string) => void;
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
  onDeselectAll: () => void;
  onDragEnd: () => void;
}

export const CircuitCanvas = forwardRef<HTMLDivElement, CircuitCanvasProps>(
  ({ 
    circuit, 
    dragState, 
    selectedGates, 
    zoom, 
    pan, 
    onGateAdd, 
    onGateSelect, 
    onGateMove, 
    onGateDelete, 
    onZoomChange, 
    onPanChange, 
    onDeselectAll, 
    onDragEnd 
  }, ref) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [showGrid, setShowGrid] = useState(true);
    const [showLabels, setShowLabels] = useState(true);
    const [numQubits] = useState(5);
    const [numLayers] = useState(20);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Grid dimensions
    const qubitHeight = 80;
    const layerWidth = 100;
    const canvasWidth = numLayers * layerWidth + 200;
    const canvasHeight = numQubits * qubitHeight + 200;

    // Handle canvas click
    const handleCanvasClick = useCallback((e: React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;

      // Check if clicking on empty space
      const clickedGate = circuit.find(gate => {
        const gateX = gate.layer * layerWidth + 100;
        const gateY = gate.qubits[0] * qubitHeight + 100;
        return x >= gateX - 25 && x <= gateX + 25 && y >= gateY - 25 && y <= gateY + 25;
      });

      if (!clickedGate) {
        onDeselectAll();
      }
    }, [circuit, pan, zoom, onDeselectAll]);

    // Handle gate click
    const handleGateClick = useCallback((e: React.MouseEvent, gate: QuantumGate) => {
      e.stopPropagation();
      onGateSelect(gate.id, e.ctrlKey || e.metaKey);
    }, [onGateSelect]);

    // Handle gate double-click (delete)
    const handleGateDoubleClick = useCallback((e: React.MouseEvent, gate: QuantumGate) => {
      e.stopPropagation();
      onGateDelete(gate.id);
    }, [onGateDelete]);

    // Handle drag over
    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }, []);

    // Handle drop
    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      const gateType = e.dataTransfer.getData('gate-type');
      if (!gateType) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = (e.clientX - rect.left - pan.x) / zoom;
      const y = (e.clientY - rect.top - pan.y) / zoom;

      // Calculate qubit and layer
      const qubit = Math.floor((y - 50) / qubitHeight);
      const layer = Math.floor((x - 50) / layerWidth);

      if (qubit >= 0 && qubit < numQubits && layer >= 0 && layer < numLayers) {
        // Check for gate type requirements
        let qubits = [qubit];
        if (gateType === 'CNOT' || gateType === 'CZ' || gateType === 'SWAP') {
          qubits = qubit < numQubits - 1 ? [qubit, qubit + 1] : [qubit - 1, qubit];
        } else if (gateType === 'TOFFOLI' || gateType === 'FREDKIN') {
          qubits = qubit < numQubits - 2 ? [qubit, qubit + 1, qubit + 2] : [qubit - 2, qubit - 1, qubit];
        }

        onGateAdd({
          type: gateType,
          qubits,
          layer,
          position: { x: layer * layerWidth + 100, y: qubit * qubitHeight + 100 },
          angle: gateType.startsWith('R') ? Math.PI / 4 : undefined
        });
      }
    }, [pan, zoom, numQubits, numLayers, onGateAdd]);

    // Handle pan
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.altKey)) { // Middle mouse or Alt+left click
        setIsDragging(true);
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      }
    }, [pan]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
      if (isDragging) {
        onPanChange({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        });
      }
    }, [isDragging, dragStart, onPanChange]);

    const handleMouseUp = useCallback(() => {
      setIsDragging(false);
    }, []);

    // Handle zoom
    const handleWheel = useCallback((e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.1, Math.min(3, zoom + delta));
      onZoomChange(newZoom);
    }, [zoom, onZoomChange]);

    // Gate colors
    const getGateColor = (type: string) => {
      const colors: { [key: string]: string } = {
        'H': 'bg-blue-500',
        'X': 'bg-red-500',
        'Y': 'bg-green-500',
        'Z': 'bg-purple-500',
        'S': 'bg-cyan-500',
        'T': 'bg-orange-500',
        'I': 'bg-gray-500',
        'CNOT': 'bg-indigo-500',
        'CZ': 'bg-pink-500',
        'SWAP': 'bg-teal-500',
        'TOFFOLI': 'bg-amber-500',
        'FREDKIN': 'bg-emerald-500',
        'RX': 'bg-red-400',
        'RY': 'bg-green-400',
        'RZ': 'bg-blue-400',
        'U1': 'bg-violet-400',
        'U2': 'bg-indigo-400',
        'U3': 'bg-purple-400',
        'MEASURE': 'bg-red-600',
        'RESET': 'bg-gray-600',
        'BARRIER': 'bg-yellow-500',
        'QFT': 'bg-slate-500'
      };
      return colors[type] || 'bg-gray-500';
    };

    return (
      <div className="relative h-full bg-background">
        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(Math.min(3, zoom * 1.2))}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onZoomChange(Math.max(0.1, zoom / 1.2))}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onZoomChange(1);
              onPanChange({ x: 0, y: 0 });
            }}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGrid(!showGrid)}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
          >
            {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>

        {/* Status */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Badge variant="outline">Zoom: {(zoom * 100).toFixed(0)}%</Badge>
          <Badge variant="outline">Gates: {circuit.length}</Badge>
          <Badge variant="outline">Selected: {selectedGates.length}</Badge>
        </div>

        {/* Canvas */}
        <div
          ref={canvasRef}
          className="w-full h-full overflow-hidden cursor-crosshair"
          onClick={handleCanvasClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
        >
          <div
            className="relative"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0',
              width: canvasWidth,
              height: canvasHeight
            }}
          >
            {/* Grid */}
            {showGrid && (
              <div className="absolute inset-0">
                {/* Vertical lines */}
                {Array.from({ length: numLayers + 1 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute border-l border-muted"
                    style={{
                      left: i * layerWidth + 100,
                      height: canvasHeight
                    }}
                  />
                ))}
                {/* Horizontal lines */}
                {Array.from({ length: numQubits + 1 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute border-t border-muted"
                    style={{
                      top: i * qubitHeight + 100,
                      width: canvasWidth
                    }}
                  />
                ))}
              </div>
            )}

            {/* Qubit labels */}
            {showLabels && (
              <div className="absolute left-4">
                {Array.from({ length: numQubits }).map((_, i) => (
                  <div
                    key={`qubit-${i}`}
                    className="absolute text-sm font-mono text-muted-foreground"
                    style={{ top: i * qubitHeight + 90 }}
                  >
                    q{i}
                  </div>
                ))}
              </div>
            )}

            {/* Layer labels */}
            {showLabels && (
              <div className="absolute top-4">
                {Array.from({ length: numLayers }).map((_, i) => (
                  <div
                    key={`layer-${i}`}
                    className="absolute text-sm font-mono text-muted-foreground"
                    style={{ left: i * layerWidth + 90 }}
                  >
                    {i}
                  </div>
                ))}
              </div>
            )}

            {/* Qubit wires */}
            {Array.from({ length: numQubits }).map((_, i) => (
              <div
                key={`wire-${i}`}
                className="absolute border-t-2 border-primary"
                style={{
                  top: i * qubitHeight + 100,
                  left: 50,
                  width: canvasWidth - 100
                }}
              />
            ))}

            {/* Gates */}
            {circuit.map((gate) => (
              <div
                key={gate.id}
                className={`absolute cursor-pointer transition-all duration-200 ${
                  selectedGates.includes(gate.id) 
                    ? 'ring-2 ring-primary ring-offset-2' 
                    : 'hover:scale-110'
                }`}
                style={{
                  left: gate.position.x - 25,
                  top: gate.position.y - 25,
                  width: 50,
                  height: 50
                }}
                onClick={(e) => handleGateClick(e, gate)}
                onDoubleClick={(e) => handleGateDoubleClick(e, gate)}
              >
                <div className={`w-full h-full rounded-lg ${getGateColor(gate.type)} text-white flex items-center justify-center font-bold text-sm shadow-lg`}>
                  {gate.type}
                </div>
                
                {/* Multi-qubit connections */}
                {gate.qubits.length > 1 && (
                  <div className="absolute">
                    {gate.qubits.slice(1).map((qubit, idx) => (
                      <div
                        key={idx}
                        className="absolute border-l-2 border-primary"
                        style={{
                          left: 25,
                          top: 25,
                          height: (qubit - gate.qubits[0]) * qubitHeight,
                          width: 0
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

CircuitCanvas.displayName = 'CircuitCanvas';
