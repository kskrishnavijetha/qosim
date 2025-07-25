
import React, { forwardRef, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type Circuit } from '@/hooks/useCircuitWorkspace';

interface OptimizedCircuitCanvasProps {
  circuit: Circuit | null;
  onCircuitChange: (circuit: Circuit) => void;
  gridSize: number;
  numQubits: number;
}

const GATE_COLORS = {
  H: 'bg-blue-500',
  X: 'bg-red-500',
  Y: 'bg-green-500',
  Z: 'bg-purple-500',
  CNOT: 'bg-orange-500',
  RX: 'bg-pink-500',
  RY: 'bg-teal-500',
  RZ: 'bg-indigo-500',
  S: 'bg-yellow-500',
  T: 'bg-cyan-500',
  M: 'bg-gray-500'
};

export const OptimizedCircuitCanvas = forwardRef<HTMLDivElement, OptimizedCircuitCanvasProps>(
  ({ circuit, onCircuitChange, gridSize, numQubits }, ref) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const gates = circuit?.gates || [];

    const handleGateClick = useCallback((gateId: string) => {
      console.log('Gate clicked:', gateId);
    }, []);

    const handleDeleteGate = useCallback((gateId: string) => {
      if (!circuit) return;
      
      const updatedGates = gates.filter(gate => gate.id !== gateId);
      onCircuitChange({
        ...circuit,
        gates: updatedGates
      });
    }, [circuit, gates, onCircuitChange]);

    const renderQubitLines = useMemo(() => {
      const lines = [];
      for (let i = 0; i < numQubits; i++) {
        lines.push(
          <div
            key={`qubit-${i}`}
            className="absolute w-full h-0.5 bg-quantum-glow/30"
            style={{
              top: `${(i + 0.5) * gridSize}px`,
              left: 0,
              right: 0
            }}
          />
        );
      }
      return lines;
    }, [numQubits, gridSize]);

    const renderGates = useMemo(() => {
      return gates.map((gate) => {
        const x = (gate.position || 0) * gridSize;
        const y = (gate.qubit || 0) * gridSize;
        const gateColor = GATE_COLORS[gate.type as keyof typeof GATE_COLORS] || 'bg-gray-500';

        return (
          <div
            key={gate.id}
            className={cn(
              'absolute flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-110 transition-transform border-2 border-quantum-glow/50 hover:border-quantum-glow',
              gateColor
            )}
            style={{
              left: x,
              top: y,
              width: gridSize - 4,
              height: gridSize - 4,
              borderRadius: '8px'
            }}
            onClick={() => handleGateClick(gate.id)}
          >
            <span className="select-none">{gate.type}</span>
            
            {/* Gate controls */}
            <div className="absolute -top-8 left-0 opacity-0 hover:opacity-100 transition-opacity bg-black/80 rounded px-2 py-1 flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGate(gate.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  // Copy gate functionality
                }}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        );
      });
    }, [gates, gridSize, handleGateClick, handleDeleteGate]);

    const renderTimeStepLabels = useMemo(() => {
      const maxTimeSteps = Math.max(10, Math.max(...gates.map(g => g.position || 0)) + 2);
      const labels = [];
      
      for (let i = 0; i < maxTimeSteps; i++) {
        labels.push(
          <div
            key={`time-${i}`}
            className="absolute text-xs text-quantum-particle"
            style={{
              left: i * gridSize + gridSize / 2 - 8,
              top: -20
            }}
          >
            t{i}
          </div>
        );
      }
      return labels;
    }, [gates, gridSize]);

    const renderQubitLabels = useMemo(() => {
      const labels = [];
      for (let i = 0; i < numQubits; i++) {
        labels.push(
          <div
            key={`qubit-label-${i}`}
            className="absolute text-sm text-quantum-neon font-mono"
            style={{
              left: -40,
              top: i * gridSize + gridSize / 2 - 8
            }}
          >
            |q{i}⟩
          </div>
        );
      }
      return labels;
    }, [numQubits, gridSize]);

    return (
      <Card className="quantum-panel neon-border h-full overflow-hidden">
        <CardContent className="p-0 h-full">
          <div className="flex items-center justify-between p-4 border-b border-quantum-glow/20">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-quantum-glow">Circuit Canvas</h3>
              {circuit && (
                <Badge variant="outline" className="text-quantum-neon">
                  {gates.length} gates
                </Badge>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            <div
              ref={canvasRef}
              className="relative bg-quantum-matrix/10 rounded-lg border border-quantum-glow/20 min-h-[400px]"
              style={{
                width: `${Math.max(800, gates.length * gridSize + 200)}px`,
                height: `${numQubits * gridSize + 40}px`,
                paddingLeft: '50px',
                paddingTop: '30px'
              }}
            >
              {/* Time step labels */}
              {renderTimeStepLabels}
              
              {/* Qubit labels */}
              {renderQubitLabels}
              
              {/* Qubit lines */}
              {renderQubitLines}
              
              {/* Gates */}
              {renderGates}
              
              {/* Empty state */}
              {gates.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-quantum-particle">
                  <div className="text-center">
                    <div className="text-2xl mb-2">⚛️</div>
                    <p>Drag gates from the palette to build your circuit</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

OptimizedCircuitCanvas.displayName = 'OptimizedCircuitCanvas';
