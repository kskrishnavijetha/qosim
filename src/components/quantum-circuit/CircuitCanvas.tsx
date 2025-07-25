
import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useCircuitStore } from '@/store/circuitStore';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';

interface DragState {
  isDragging: boolean;
  dragData: any;
  dragPosition: { x: number; y: number };
  hoverPosition: { qubit: number; timeStep: number } | null;
}

interface CircuitCanvasProps {
  dragState: DragState;
  setDragState: (state: DragState) => void;
}

export function CircuitCanvas({ dragState, setDragState }: CircuitCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { 
    gates, 
    selectedGate, 
    gridSize, 
    numQubits, 
    numTimeSteps,
    addGate,
    removeGate,
    moveGate,
    selectGate,
    pasteGate,
    clipboard
  } = useCircuitStore();

  const [touchState, setTouchState] = useState<{
    startPos: { x: number; y: number } | null;
    startTime: number;
  }>({ startPos: null, startTime: 0 });

  const getGridPosition = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return null;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    const timeStep = Math.floor(x / gridSize);
    const qubit = Math.floor(y / gridSize);
    
    if (timeStep >= 0 && timeStep < numTimeSteps && qubit >= 0 && qubit < numQubits) {
      return { qubit, timeStep };
    }
    
    return null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const position = getGridPosition(e.clientX, e.clientY);
    setDragState({
      ...dragState,
      hoverPosition: position
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const position = getGridPosition(e.clientX, e.clientY);
    
    if (position && dragState.dragData) {
      const existingGate = gates.find(g => g.qubit === position.qubit && g.position === position.timeStep);
      if (!existingGate) {
        addGate({
          id: `${dragState.dragData.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: dragState.dragData.type,
          qubit: position.qubit,
          position: position.timeStep,
        });
      }
    }
    
    setDragState({
      isDragging: false,
      dragData: null,
      dragPosition: { x: 0, y: 0 },
      hoverPosition: null
    });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const position = getGridPosition(e.clientX, e.clientY);
    if (position) {
      const clickedGate = gates.find(g => g.qubit === position.qubit && g.position === position.timeStep);
      if (clickedGate) {
        selectGate(clickedGate);
      } else {
        selectGate(null);
        // Paste if we have clipboard content
        if (clipboard) {
          pasteGate(position.qubit, position.timeStep);
        }
      }
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchState({
      startPos: { x: touch.clientX, y: touch.clientY },
      startTime: Date.now()
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchState.startPos) return;
    
    const touch = e.changedTouches[0];
    const duration = Date.now() - touchState.startTime;
    const distance = Math.sqrt(
      Math.pow(touch.clientX - touchState.startPos.x, 2) + 
      Math.pow(touch.clientY - touchState.startPos.y, 2)
    );
    
    // Tap (short duration, small distance)
    if (duration < 500 && distance < 20) {
      const position = getGridPosition(touch.clientX, touch.clientY);
      if (position) {
        const clickedGate = gates.find(g => g.qubit === position.qubit && g.position === position.timeStep);
        if (clickedGate) {
          selectGate(clickedGate);
        } else {
          selectGate(null);
        }
      }
    }
    
    setTouchState({ startPos: null, startTime: 0 });
  };

  const renderQubitLines = () => {
    const lines = [];
    for (let i = 0; i < numQubits; i++) {
      lines.push(
        <div
          key={i}
          className="absolute left-0 right-0 h-0.5 bg-border"
          style={{ top: i * gridSize + gridSize / 2 }}
        />
      );
      lines.push(
        <div
          key={`label-${i}`}
          className="absolute left-2 text-sm font-mono text-muted-foreground"
          style={{ top: i * gridSize + gridSize / 2 - 10 }}
        >
          q{i}
        </div>
      );
    }
    return lines;
  };

  const renderGates = () => {
    return gates.map(gate => (
      <div
        key={gate.id}
        className={cn(
          "absolute w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-bold cursor-pointer transition-all hover:scale-110 group",
          selectedGate?.id === gate.id ? "ring-2 ring-blue-500" : "",
          getGateColor(gate.type)
        )}
        style={{
          left: gate.position * gridSize + gridSize / 2 - 24,
          top: (gate.qubit || 0) * gridSize + gridSize / 2 - 24,
        }}
        onClick={(e) => {
          e.stopPropagation();
          selectGate(gate);
        }}
      >
        {getGateSymbol(gate.type)}
        <button
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          onClick={(e) => {
            e.stopPropagation();
            removeGate(gate.id);
          }}
        >
          <Trash2 className="w-2 h-2" />
        </button>
      </div>
    ));
  };

  const getGateColor = (type: string) => {
    const colors = {
      'H': 'bg-blue-500 text-white',
      'X': 'bg-red-500 text-white',
      'Y': 'bg-green-500 text-white',
      'Z': 'bg-purple-500 text-white',
      'S': 'bg-indigo-500 text-white',
      'T': 'bg-pink-500 text-white',
      'RX': 'bg-orange-500 text-white',
      'RY': 'bg-yellow-500 text-white',
      'RZ': 'bg-teal-500 text-white',
      'CNOT': 'bg-cyan-500 text-white',
      'CZ': 'bg-amber-500 text-white',
      'SWAP': 'bg-emerald-500 text-white',
      'M': 'bg-gray-500 text-white',
    };
    return colors[type] || 'bg-gray-400 text-white';
  };

  const getGateSymbol = (type: string) => {
    const symbols = {
      'H': 'H',
      'X': 'X',
      'Y': 'Y',
      'Z': 'Z',
      'S': 'S',
      'T': 'T',
      'RX': 'RX',
      'RY': 'RY',
      'RZ': 'RZ',
      'CNOT': '⊕',
      'CZ': 'CZ',
      'SWAP': '⇄',
      'M': 'M',
    };
    return symbols[type] || type;
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4 h-full">
        <div
          ref={canvasRef}
          className="relative w-full h-full border-2 border-dashed border-border rounded-lg overflow-auto cursor-crosshair"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent ${gridSize - 1}px,
              hsl(var(--border)) ${gridSize - 1}px,
              hsl(var(--border)) ${gridSize}px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent ${gridSize - 1}px,
              hsl(var(--border)) ${gridSize - 1}px,
              hsl(var(--border)) ${gridSize}px
            )`,
            minWidth: numTimeSteps * gridSize,
            minHeight: numQubits * gridSize,
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleCanvasClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {renderQubitLines()}
          {renderGates()}
          
          {/* Drop zone indicator */}
          {dragState.isDragging && dragState.hoverPosition && (
            <div
              className="absolute w-12 h-12 border-2 border-dashed border-blue-500 rounded-lg bg-blue-500/20 flex items-center justify-center animate-pulse"
              style={{
                left: dragState.hoverPosition.timeStep * gridSize + gridSize / 2 - 24,
                top: dragState.hoverPosition.qubit * gridSize + gridSize / 2 - 24,
              }}
            >
              {dragState.dragData?.symbol || dragState.dragData?.type}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
