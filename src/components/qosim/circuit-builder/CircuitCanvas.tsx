
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Trash2, Settings, Maximize2 } from 'lucide-react';
import { Gate } from '@/hooks/useCircuitState';

interface CircuitCanvasProps {
  circuit: Gate[];
  dragState: any;
  simulationResult: any;
  onDeleteGate: (gateId: string) => void;
  circuitRef: React.RefObject<HTMLDivElement>;
  numQubits: number;
  gridSize: number;
  onNumQubitsChange: (value: number) => void;
  onGridSizeChange: (value: number) => void;
}

export function CircuitCanvas({
  circuit,
  dragState,
  simulationResult,
  onDeleteGate,
  circuitRef,
  numQubits,
  gridSize,
  onNumQubitsChange,
  onGridSizeChange
}: CircuitCanvasProps) {
  const maxPosition = Math.max(10, ...circuit.map(g => g.position + 1));

  const getGateColor = (gateType: string) => {
    const colors = {
      'H': 'bg-blue-500',
      'X': 'bg-red-500',
      'Y': 'bg-green-500',
      'Z': 'bg-purple-500',
      'CNOT': 'bg-orange-500',
      'RX': 'bg-pink-500',
      'RY': 'bg-yellow-500',
      'RZ': 'bg-indigo-500',
      'S': 'bg-teal-500',
      'T': 'bg-cyan-500',
      'CZ': 'bg-amber-500',
      'SWAP': 'bg-emerald-500'
    };
    return colors[gateType as keyof typeof colors] || 'bg-gray-500';
  };

  const renderGate = (gate: Gate) => {
    const isMultiQubit = gate.qubits && gate.qubits.length > 1;
    
    if (isMultiQubit) {
      // Render multi-qubit gates
      const minQubit = Math.min(...gate.qubits!);
      const maxQubit = Math.max(...gate.qubits!);
      
      return (
        <div key={gate.id} className="absolute">
          {/* Connection line */}
          <div
            className="absolute bg-quantum-neon"
            style={{
              left: `${gate.position * gridSize + 20}px`,
              top: `${minQubit * 60 + 35}px`,
              width: '2px',
              height: `${(maxQubit - minQubit) * 60}px`,
              zIndex: 1
            }}
          />
          
          {/* Gate nodes */}
          {gate.qubits!.map((qubit, index) => (
            <div
              key={`${gate.id}-${qubit}`}
              className={`absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer group z-10 ${getGateColor(gate.type)}`}
              style={{
                left: `${gate.position * gridSize + 12}px`,
                top: `${qubit * 60 + 27}px`
              }}
              onClick={() => onDeleteGate(gate.id)}
            >
              <span className="text-xs font-bold text-white">
                {gate.type === 'CNOT' && index === 0 ? '●' : gate.type === 'CNOT' ? '⊕' : gate.type}
              </span>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {gate.type}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      // Render single-qubit gates
      return (
        <div
          key={gate.id}
          className={`absolute w-12 h-8 rounded flex items-center justify-center cursor-pointer group z-10 ${getGateColor(gate.type)}`}
          style={{
            left: `${gate.position * gridSize + 8}px`,
            top: `${gate.qubit! * 60 + 27}px`
          }}
          onClick={() => onDeleteGate(gate.id)}
        >
          <span className="text-xs font-bold text-white">
            {gate.type}
          </span>
          {gate.angle && (
            <span className="text-xs text-white ml-1">
              ({(gate.angle / Math.PI).toFixed(1)}π)
            </span>
          )}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
            {gate.type} {gate.angle && `(${(gate.angle / Math.PI).toFixed(2)}π)`}
          </div>
        </div>
      );
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-quantum-glow">Circuit Canvas</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="neon-border">
              {circuit.length} gates
            </Badge>
            <Button variant="outline" size="sm" className="neon-border">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Canvas Controls */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label className="text-quantum-particle">Qubits: {numQubits}</Label>
            <Slider
              value={[numQubits]}
              onValueChange={(value) => onNumQubitsChange(value[0])}
              min={2}
              max={10}
              step={1}
              className="quantum-slider"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-quantum-particle">Grid: {gridSize}px</Label>
            <Slider
              value={[gridSize]}
              onValueChange={(value) => onGridSizeChange(value[0])}
              min={40}
              max={100}
              step={10}
              className="quantum-slider"
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div 
          ref={circuitRef}
          className="relative bg-quantum-matrix border-2 border-quantum-neon/20 rounded-lg overflow-auto"
          style={{
            width: '100%',
            height: `${numQubits * 60 + 40}px`,
            minWidth: `${maxPosition * gridSize + 100}px`
          }}
        >
          {/* Qubit lines */}
          {Array.from({ length: numQubits }, (_, i) => (
            <div key={i} className="absolute">
              {/* Qubit line */}
              <div
                className="absolute bg-quantum-neon/40 h-0.5"
                style={{
                  left: '20px',
                  top: `${i * 60 + 31}px`,
                  width: `${maxPosition * gridSize + 50}px`
                }}
              />
              
              {/* Qubit label */}
              <div
                className="absolute text-quantum-neon text-sm font-mono"
                style={{
                  left: '0px',
                  top: `${i * 60 + 25}px`
                }}
              >
                |{i}⟩
              </div>
              
              {/* Time step markers */}
              {Array.from({ length: maxPosition }, (_, j) => (
                <div
                  key={j}
                  className="absolute w-0.5 h-1 bg-quantum-neon/30"
                  style={{
                    left: `${j * gridSize + 20}px`,
                    top: `${i * 60 + 30}px`
                  }}
                />
              ))}
            </div>
          ))}

          {/* Time step labels */}
          {Array.from({ length: maxPosition }, (_, i) => (
            <div
              key={i}
              className="absolute text-quantum-particle text-xs"
              style={{
                left: `${i * gridSize + 15}px`,
                top: '5px'
              }}
            >
              t{i}
            </div>
          ))}

          {/* Circuit gates */}
          {circuit.map(renderGate)}

          {/* Hover indicator */}
          {dragState.isDragging && dragState.hoverQubit !== null && dragState.hoverPosition !== null && (
            <div
              className="absolute w-12 h-8 border-2 border-quantum-glow rounded bg-quantum-glow/20 animate-pulse"
              style={{
                left: `${dragState.hoverPosition * gridSize + 8}px`,
                top: `${dragState.hoverQubit * 60 + 27}px`
              }}
            />
          )}

          {/* Simulation visualization */}
          {simulationResult && (
            <div className="absolute top-2 right-2 bg-quantum-matrix/80 backdrop-blur-sm rounded p-2">
              <div className="text-xs text-quantum-neon">
                Execution: {simulationResult.executionTime}ms
              </div>
              <div className="text-xs text-quantum-particle">
                Fidelity: {(simulationResult.fidelity || 0).toFixed(3)}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
