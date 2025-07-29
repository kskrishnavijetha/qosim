
import React, { forwardRef, useCallback, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Gate, Qubit, SimulationResult } from '@/hooks/useCircuitBuilder';
import { X, Settings, Zap } from 'lucide-react';

interface CircuitCanvasProps {
  circuit: Gate[];
  qubits: Qubit[];
  onGateDrop: (gateType: string, qubit: number, position: number) => void;
  onGateMove: (gateId: string, newPosition: number, newQubit?: number) => void;
  onGateRemove: (gateId: string) => void;
  simulationResult?: SimulationResult | null;
}

const GRID_SIZE = 60;
const QUBIT_HEIGHT = 80;
const CANVAS_PADDING = 40;

export const CircuitCanvas = forwardRef<HTMLDivElement, CircuitCanvasProps>(
  ({ circuit, qubits, onGateDrop, onGateMove, onGateRemove, simulationResult }, ref) => {
    const [draggedGate, setDraggedGate] = useState<Gate | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);

    const maxPosition = Math.max(...circuit.map(g => g.position), 10);
    const canvasWidth = Math.max(800, (maxPosition + 5) * GRID_SIZE);
    const canvasHeight = qubits.length * QUBIT_HEIGHT + CANVAS_PADDING * 2;

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate grid position
      const position = Math.floor(x / GRID_SIZE);
      const qubit = Math.floor(y / QUBIT_HEIGHT);

      if (qubit >= 0 && qubit < qubits.length && position >= 0) {
        try {
          const data = JSON.parse(e.dataTransfer.getData('application/json'));
          onGateDrop(data.gateType, qubit, position);
        } catch (error) {
          console.error('Failed to parse drop data:', error);
        }
      }
    }, [qubits.length, onGateDrop]);

    const handleGateDragStart = useCallback((e: React.DragEvent, gate: Gate) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setDraggedGate(gate);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('application/json', JSON.stringify({ moveGate: gate.id }));
    }, []);

    const handleGateDrop = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      
      if (!draggedGate) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;

      const newPosition = Math.max(0, Math.floor(x / GRID_SIZE));
      const newQubit = Math.max(0, Math.min(qubits.length - 1, Math.floor(y / QUBIT_HEIGHT)));

      onGateMove(draggedGate.id, newPosition, newQubit);
      setDraggedGate(null);
    }, [draggedGate, dragOffset, qubits.length, onGateMove]);

    const getGateColor = (gateType: string) => {
      const colors: Record<string, string> = {
        'I': 'bg-gray-500',
        'X': 'bg-red-500',
        'Y': 'bg-yellow-500', 
        'Z': 'bg-blue-500',
        'H': 'bg-green-500',
        'S': 'bg-purple-500',
        'T': 'bg-indigo-500',
        'CNOT': 'bg-orange-500',
        'CZ': 'bg-teal-500',
        'SWAP': 'bg-pink-500',
        'TOFFOLI': 'bg-cyan-500',
        'RX': 'bg-red-600',
        'RY': 'bg-green-600',
        'RZ': 'bg-blue-600',
        'U3': 'bg-purple-600',
        'MEASURE': 'bg-black'
      };
      return colors[gateType] || 'bg-gray-500';
    };

    const getQubitState = (qubitIndex: number) => {
      if (simulationResult) {
        return qubits[qubitIndex]?.state || { probability: 0.5, phase: 0 };
      }
      return { probability: qubitIndex === 0 ? 1 : 0, phase: 0 };
    };

    return (
      <TooltipProvider>
        <Card className="flex-1 p-4">
          <div
            ref={(el) => {
              canvasRef.current = el;
              if (ref) {
                if (typeof ref === 'function') {
                  ref(el);
                } else {
                  ref.current = el;
                }
              }
            }}
            className="relative border-2 border-dashed border-muted-foreground/20 rounded-lg overflow-auto"
            style={{ width: '100%', height: '400px' }}
            onDragOver={handleDragOver}
            onDrop={draggedGate ? handleGateDrop : handleDrop}
          >
            <div 
              className="relative"
              style={{ width: canvasWidth, height: canvasHeight, minHeight: '400px' }}
            >
              {/* Grid lines */}
              <svg
                className="absolute inset-0 pointer-events-none"
                width={canvasWidth}
                height={canvasHeight}
              >
                {/* Vertical grid lines */}
                {Array.from({ length: Math.ceil(canvasWidth / GRID_SIZE) }).map((_, i) => (
                  <line
                    key={`v-${i}`}
                    x1={i * GRID_SIZE}
                    y1={0}
                    x2={i * GRID_SIZE}
                    y2={canvasHeight}
                    stroke="currentColor"
                    strokeWidth="1"
                    opacity="0.1"
                  />
                ))}
                
                {/* Horizontal grid lines (qubit lines) */}
                {qubits.map((qubit) => (
                  <line
                    key={`h-${qubit.index}`}
                    x1={0}
                    y1={qubit.index * QUBIT_HEIGHT + QUBIT_HEIGHT / 2}
                    x2={canvasWidth}
                    y2={qubit.index * QUBIT_HEIGHT + QUBIT_HEIGHT / 2}
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                ))}
              </svg>

              {/* Qubit labels */}
              {qubits.map((qubit) => (
                <div
                  key={qubit.id}
                  className="absolute flex items-center"
                  style={{
                    left: 10,
                    top: qubit.index * QUBIT_HEIGHT + QUBIT_HEIGHT / 2 - 12,
                    width: 60
                  }}
                >
                  <Badge variant="secondary" className="mr-2">
                    |q{qubit.index}⟩
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    P: {getQubitState(qubit.index).probability.toFixed(3)}
                  </div>
                </div>
              ))}

              {/* Gates */}
              {circuit.map((gate) => (
                <Tooltip key={gate.id}>
                  <TooltipTrigger asChild>
                    <div
                      className={`absolute cursor-move rounded-md border-2 border-white flex items-center justify-center text-white font-bold text-xs shadow-lg hover:scale-105 transition-transform ${getGateColor(gate.type)}`}
                      style={{
                        left: gate.position * GRID_SIZE + 10,
                        top: gate.qubit * QUBIT_HEIGHT + QUBIT_HEIGHT / 2 - 20,
                        width: GRID_SIZE - 20,
                        height: 40
                      }}
                      draggable
                      onDragStart={(e) => handleGateDragStart(e, gate)}
                    >
                      <span>{gate.type}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -top-1 -right-1 h-4 w-4 p-0 hover:bg-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onGateRemove(gate.id);
                        }}
                      >
                        <X className="h-2 w-2" />
                      </Button>
                      
                      {gate.parameters && Object.keys(gate.parameters).length > 0 && (
                        <Settings className="absolute -bottom-1 -right-1 h-3 w-3" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div>
                      <p className="font-semibold">{gate.type} Gate</p>
                      <p className="text-xs">Qubit: {gate.qubit}, Position: {gate.position}</p>
                      {gate.parameters && (
                        <div className="text-xs mt-1">
                          {Object.entries(gate.parameters).map(([key, value]) => (
                            <div key={key}>{key}: {value}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}

              {/* Connection lines for multi-qubit gates */}
              {circuit
                .filter(gate => gate.controlQubits && gate.controlQubits.length > 0)
                .map((gate) => (
                  <svg key={`conn-${gate.id}`} className="absolute inset-0 pointer-events-none">
                    {gate.controlQubits?.map((controlQubit, index) => (
                      <line
                        key={index}
                        x1={gate.position * GRID_SIZE + GRID_SIZE / 2}
                        y1={controlQubit * QUBIT_HEIGHT + QUBIT_HEIGHT / 2}
                        x2={gate.position * GRID_SIZE + GRID_SIZE / 2}
                        y2={gate.qubit * QUBIT_HEIGHT + QUBIT_HEIGHT / 2}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        opacity="0.7"
                      />
                    ))}
                  </svg>
                ))}
            </div>
          </div>
        </Card>
      </TooltipProvider>
    );
  }
);

CircuitCanvas.displayName = 'CircuitCanvas';
