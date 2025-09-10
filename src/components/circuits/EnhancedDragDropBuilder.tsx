import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Trash2, Edit3, Copy, Move, RotateCcw, Settings } from 'lucide-react';
import { QuantumGateOp } from '@/lib/enhancedQuantumSimulator';
import { toast } from 'sonner';

interface DragDropGate extends QuantumGateOp {
  x: number;
  y: number;
  isSelected: boolean;
  isDragging: boolean;
}

interface EnhancedDragDropBuilderProps {
  numQubits: number;
  gates: DragDropGate[];
  onGatesChange: (gates: DragDropGate[]) => void;
  onGateSelect: (gate: DragDropGate | null) => void;
  selectedGate: DragDropGate | null;
  gridSize: number;
  showGrid: boolean;
}

export function EnhancedDragDropBuilder({
  numQubits,
  gates,
  onGatesChange,
  onGateSelect,
  selectedGate,
  gridSize = 50,
  showGrid = true
}: EnhancedDragDropBuilderProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    draggedGate: DragDropGate | null;
    startPos: { x: number; y: number };
    offset: { x: number; y: number };
  }>({
    isDragging: false,
    draggedGate: null,
    startPos: { x: 0, y: 0 },
    offset: { x: 0, y: 0 }
  });

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    gate: DragDropGate | null;
  }>({ visible: false, x: 0, y: 0, gate: null });

  // Grid snapping function
  const snapToGrid = useCallback((x: number, y: number) => {
    if (!showGrid) return { x, y };
    
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  }, [gridSize, showGrid]);

  // Convert screen coordinates to canvas coordinates
  const screenToCanvas = useCallback((screenX: number, screenY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: screenX - rect.left,
      y: screenY - rect.top
    };
  }, []);

  // Determine which qubit line a Y coordinate corresponds to
  const getQubitFromY = useCallback((y: number) => {
    const qubitSpacing = 80;
    const startY = 60;
    const qubit = Math.round((y - startY) / qubitSpacing);
    return Math.max(0, Math.min(numQubits - 1, qubit));
  }, [numQubits]);

  // Calculate gate position on qubit lines
  const getGatePosition = useCallback((x: number, y: number) => {
    const qubit = getQubitFromY(y);
    const position = Math.max(0, Math.round((x - 100) / gridSize));
    
    return { qubit, position, x: 100 + position * gridSize, y: 60 + qubit * 80 };
  }, [getQubitFromY, gridSize]);

  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent, gate: DragDropGate) => {
    e.preventDefault();
    e.stopPropagation();

    const canvasCoords = screenToCanvas(e.clientX, e.clientY);
    
    setDragState({
      isDragging: true,
      draggedGate: gate,
      startPos: canvasCoords,
      offset: {
        x: canvasCoords.x - gate.x,
        y: canvasCoords.y - gate.y
      }
    });

    onGateSelect(gate);

    // Mark gate as dragging
    const updatedGates = gates.map(g => 
      g.id === gate.id ? { ...g, isDragging: true } : g
    );
    onGatesChange(updatedGates);
  }, [gates, onGatesChange, onGateSelect, screenToCanvas]);

  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.draggedGate) return;

    const canvasCoords = screenToCanvas(e.clientX, e.clientY);
    const newX = canvasCoords.x - dragState.offset.x;
    const newY = canvasCoords.y - dragState.offset.y;

    // Update dragged gate position (with optional grid snapping)
    const snappedPos = snapToGrid(newX, newY);
    
    const updatedGates = gates.map(gate =>
      gate.id === dragState.draggedGate!.id
        ? { ...gate, x: snappedPos.x, y: snappedPos.y }
        : gate
    );
    
    onGatesChange(updatedGates);
  }, [dragState, gates, onGatesChange, screenToCanvas, snapToGrid]);

  // Handle mouse up to finish dragging
  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.draggedGate) return;

    const canvasCoords = screenToCanvas(e.clientX, e.clientY);
    const finalPos = getGatePosition(canvasCoords.x, canvasCoords.y);
    
    // Check for conflicts with existing gates
    const hasConflict = gates.some(gate => 
      gate.id !== dragState.draggedGate!.id &&
      gate.qubits.includes(finalPos.qubit) &&
      gate.position === finalPos.position
    );

    if (hasConflict) {
      toast.error('Cannot place gate: position conflicts with existing gate');
      // Revert to original position
      const updatedGates = gates.map(gate =>
        gate.id === dragState.draggedGate!.id
          ? { ...gate, isDragging: false }
          : gate
      );
      onGatesChange(updatedGates);
    } else {
      // Update gate with final position
      const updatedGates = gates.map(gate =>
        gate.id === dragState.draggedGate!.id
          ? {
              ...gate,
              x: finalPos.x,
              y: finalPos.y,
              qubits: gate.type === 'CNOT' 
                ? [gate.control || gate.qubits[0], finalPos.qubit] 
                : [finalPos.qubit],
              position: finalPos.position,
              isDragging: false
            }
          : gate
      );
      onGatesChange(updatedGates);
      
      toast.success(`Gate moved to qubit ${finalPos.qubit}, position ${finalPos.position}`);
    }

    setDragState({
      isDragging: false,
      draggedGate: null,
      startPos: { x: 0, y: 0 },
      offset: { x: 0, y: 0 }
    });
  }, [dragState, gates, onGatesChange, screenToCanvas, getGatePosition]);

  // Set up global mouse event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  // Handle right-click context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, gate: DragDropGate) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      gate
    });
  }, []);

  // Context menu actions
  const handleDeleteGate = useCallback(() => {
    if (!contextMenu.gate) return;
    
    const updatedGates = gates.filter(gate => gate.id !== contextMenu.gate!.id);
    onGatesChange(updatedGates);
    onGateSelect(null);
    setContextMenu({ visible: false, x: 0, y: 0, gate: null });
    toast.success('Gate deleted');
  }, [contextMenu.gate, gates, onGatesChange, onGateSelect]);

  const handleCopyGate = useCallback(() => {
    if (!contextMenu.gate) return;
    
    const newGate: DragDropGate = {
      ...contextMenu.gate,
      id: `copy_${contextMenu.gate.id}_${Date.now()}`,
      x: contextMenu.gate.x + gridSize,
      y: contextMenu.gate.y,
      position: contextMenu.gate.position + 1,
      isSelected: false,
      isDragging: false
    };
    
    onGatesChange([...gates, newGate]);
    setContextMenu({ visible: false, x: 0, y: 0, gate: null });
    toast.success('Gate copied');
  }, [contextMenu.gate, gates, onGatesChange, gridSize]);

  // Render grid background
  const renderGrid = () => {
    if (!showGrid) return null;
    
    const lines = [];
    const canvasWidth = 1200;
    const canvasHeight = numQubits * 80 + 120;
    
    // Vertical lines
    for (let x = 0; x <= canvasWidth; x += gridSize) {
      lines.push(
        <line
          key={`v-${x}`}
          x1={x}
          y1={0}
          x2={x}
          y2={canvasHeight}
          stroke="hsl(var(--border))"
          strokeWidth={0.5}
          opacity={0.3}
        />
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvasHeight; y += gridSize) {
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={y}
          x2={canvasWidth}
          y2={y}
          stroke="hsl(var(--border))"
          strokeWidth={0.5}
          opacity={0.3}
        />
      );
    }
    
    return (
      <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
        {lines}
      </svg>
    );
  };

  // Render qubit lines
  const renderQubitLines = () => {
    const lines = [];
    const lineWidth = 1000;
    
    for (let i = 0; i < numQubits; i++) {
      const y = 60 + i * 80;
      lines.push(
        <div key={i} className="absolute flex items-center">
          <div
            className="h-px bg-foreground opacity-30"
            style={{
              width: `${lineWidth}px`,
              top: `${y}px`,
              left: '100px'
            }}
          />
          <Badge 
            variant="outline" 
            className="absolute bg-background text-xs"
            style={{
              top: `${y - 12}px`,
              left: '10px'
            }}
          >
            q{i}
          </Badge>
        </div>
      );
    }
    
    return lines;
  };

  // Render gate component
  const renderGate = (gate: DragDropGate) => {
    const isHighlighted = gate.isSelected || gate.isDragging;
    const gateColor = getGateColor(gate.type);
    
    return (
      <ContextMenu key={gate.id}>
        <ContextMenuTrigger>
          <div
            className={`absolute cursor-move select-none transition-all duration-200 ${
              isHighlighted ? 'scale-110 shadow-lg' : 'hover:scale-105'
            }`}
            style={{
              left: `${gate.x - 20}px`,
              top: `${gate.y - 20}px`,
              zIndex: gate.isDragging ? 1000 : 10
            }}
            onMouseDown={(e) => handleMouseDown(e, gate)}
            onContextMenu={(e) => handleContextMenu(e, gate)}
          >
            <div
              className={`w-10 h-10 rounded border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                isHighlighted 
                  ? 'border-quantum-blue bg-quantum-blue/20 text-quantum-blue' 
                  : `border-${gateColor} bg-${gateColor}/10 text-${gateColor}`
              }`}
            >
              {getGateSymbol(gate.type)}
            </div>
            
            {/* Parameter display for rotation gates */}
            {gate.angle !== undefined && (
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <Badge variant="outline" className="text-xs px-1 py-0">
                  {(gate.angle / Math.PI).toFixed(2)}π
                </Badge>
              </div>
            )}
            
            {/* Control-target connection for CNOT */}
            {gate.type === 'CNOT' && gate.control !== undefined && gate.target !== undefined && (
              <svg
                className="absolute pointer-events-none"
                style={{
                  left: '20px',
                  top: '20px',
                  width: '2px',
                  height: `${Math.abs(gate.target - gate.control) * 80}px`,
                  transform: gate.target < gate.control ? 'translateY(-100%)' : 'none'
                }}
              >
                <line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="100%"
                  stroke="hsl(var(--foreground))"
                  strokeWidth="2"
                />
              </svg>
            )}
          </div>
        </ContextMenuTrigger>
        
        <ContextMenuContent>
          <ContextMenuItem onClick={handleDeleteGate}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Gate
          </ContextMenuItem>
          <ContextMenuItem onClick={handleCopyGate}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Gate
          </ContextMenuItem>
          <Separator />
          <ContextMenuItem onClick={() => onGateSelect(gate)}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Parameters
          </ContextMenuItem>
          <ContextMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            Gate Properties
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const getGateColor = (gateType: string): string => {
    const colorMap: Record<string, string> = {
      'H': 'blue-500',
      'X': 'red-500',
      'Y': 'green-500',
      'Z': 'purple-500',
      'CNOT': 'orange-500',
      'RX': 'pink-500',
      'RY': 'teal-500',
      'RZ': 'indigo-500',
      'S': 'yellow-500',
      'T': 'cyan-500'
    };
    return colorMap[gateType] || 'gray-500';
  };

  const getGateSymbol = (gateType: string): string => {
    const symbolMap: Record<string, string> = {
      'H': 'H',
      'X': 'X',
      'Y': 'Y',
      'Z': 'Z',
      'CNOT': '⊕',
      'RX': 'RX',
      'RY': 'RY',
      'RZ': 'RZ',
      'S': 'S',
      'T': 'T',
      'I': 'I'
    };
    return symbolMap[gateType] || gateType.slice(0, 2);
  };

  return (
    <Card className="w-full h-full quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-quantum-glow">Enhanced Circuit Builder</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Qubits: {numQubits}</Badge>
            <Badge variant="outline">Gates: {gates.length}</Badge>
            {selectedGate && (
              <Badge variant="default">Selected: {selectedGate.type}</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          ref={canvasRef}
          className="relative w-full h-96 overflow-auto bg-background border-t"
          style={{ minHeight: `${numQubits * 80 + 120}px` }}
          onClick={() => onGateSelect(null)}
        >
          {renderGrid()}
          {renderQubitLines()}
          {gates.map(renderGate)}
          
          {/* Instructions overlay when no gates */}
          {gates.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Move className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Drag gates from the palette to build your circuit</p>
                <p className="text-sm mt-2">Right-click gates for options</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}