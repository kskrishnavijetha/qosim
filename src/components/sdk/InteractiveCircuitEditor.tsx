
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GatePalette } from '@/components/circuits/GatePalette';
import { Gate } from '@/hooks/useCircuitState';
import { useCircuitDragDrop } from '@/hooks/useCircuitDragDrop';
import { Trash2, Undo, RotateCcw, Settings, Zap } from 'lucide-react';

interface InteractiveCircuitEditorProps {
  circuit: Gate[];
  onCircuitChange: (gates: Gate[]) => void;
  selectedAlgorithm?: string | null;
}

export function InteractiveCircuitEditor({ 
  circuit, 
  onCircuitChange, 
  selectedAlgorithm 
}: InteractiveCircuitEditorProps) {
  const [numQubits, setNumQubits] = useState(5);
  const [gridSize, setGridSize] = useState(50);
  const [history, setHistory] = useState<Gate[][]>([[]]);
  const circuitRef = useRef<HTMLDivElement>(null);

  const {
    dragState,
    handleMouseDown,
    handleTouchStart
  } = useCircuitDragDrop({
    onGateAdd: (gate: Gate) => {
      const newCircuit = [...circuit, gate];
      onCircuitChange(newCircuit);
      setHistory(prev => [...prev, newCircuit]);
    },
    numQubits,
    gridSize
  });

  const handleDeleteGate = (gateId: string) => {
    const newCircuit = circuit.filter(gate => gate.id !== gateId);
    onCircuitChange(newCircuit);
    setHistory(prev => [...prev, newCircuit]);
  };

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousCircuit = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      onCircuitChange(previousCircuit);
    }
  };

  const handleClear = () => {
    onCircuitChange([]);
    setHistory([[]]);
  };

  const gateTypes = [
    { type: 'H', name: 'Hadamard', color: 'bg-quantum-glow' },
    { type: 'X', name: 'Pauli-X', color: 'bg-quantum-neon' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-quantum-particle' },
    { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma' },
    { type: 'RX', name: 'Rotation-X', color: 'bg-quantum-energy' },
    { type: 'RY', name: 'Rotation-Y', color: 'bg-secondary' },
    { type: 'M', name: 'Measure', color: 'bg-destructive' },
  ];

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-mono text-quantum-glow">Interactive Circuit Editor</h3>
          {selectedAlgorithm && (
            <Badge variant="secondary" className="bg-quantum-matrix text-quantum-neon">
              {selectedAlgorithm} Template
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleUndo}
            disabled={history.length <= 1}
            variant="outline"
            size="sm"
            className="neon-border"
          >
            <Undo className="w-4 h-4 mr-1" />
            Undo
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            size="sm"
            className="neon-border text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Circuit Configuration */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Circuit Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-quantum-particle">Number of Qubits: {numQubits}</Label>
              <Slider
                value={[numQubits]}
                onValueChange={(value) => setNumQubits(value[0])}
                min={2}
                max={10}
                step={1}
                className="quantum-slider"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-quantum-particle">Grid Size: {gridSize}px</Label>
              <Slider
                value={[gridSize]}
                onValueChange={(value) => setGridSize(value[0])}
                min={30}
                max={80}
                step={5}
                className="quantum-slider"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Gate Palette */}
        <Card className="quantum-panel neon-border lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm text-quantum-neon">Gate Palette</CardTitle>
          </CardHeader>
          <CardContent>
            <GatePalette
              onGateMouseDown={handleMouseDown}
              onGateTouchStart={handleTouchStart}
            />
          </CardContent>
        </Card>

        {/* Circuit Canvas */}
        <Card className="quantum-panel neon-border lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Circuit Canvas ({circuit.length} gates)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              ref={circuitRef}
              className="relative bg-quantum-matrix rounded-lg p-4 min-h-[400px] overflow-auto"
              style={{ 
                backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--quantum-neon) / 0.1) 0px, hsl(var(--quantum-neon) / 0.1) 1px, transparent 1px, transparent ${gridSize}px)` 
              }}
            >
              {/* Qubit Lines */}
              {Array.from({ length: numQubits }).map((_, i) => (
                <div key={i} className="flex items-center mb-8 relative" style={{ top: i * 60 + 20 }}>
                  <div className="w-8 text-xs font-mono text-quantum-neon absolute -left-10">q{i}</div>
                  <div className="w-full h-0.5 bg-quantum-neon/50 relative"></div>
                  <div className="w-16 text-xs font-mono text-quantum-particle absolute -right-20">|0⟩</div>
                </div>
              ))}

              {/* Placed Gates */}
              {circuit.map((gate, index) => (
                <div
                  key={gate.id}
                  className={`absolute w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-bold text-black cursor-pointer hover:scale-110 transition-all duration-300 quantum-glow animate-in zoom-in ${
                    gateTypes.find(g => g.type === gate.type)?.color || 'bg-secondary'
                  }`}
                  style={{
                    left: gate.position * gridSize + 20,
                    top: gate.type === 'CNOT' ? (gate.qubits ? gate.qubits[0] * 60 + 15 : 0) : (gate.qubit ? gate.qubit * 60 + 15 : 0),
                    animationDelay: `${index * 100}ms`
                  }}
                  onClick={() => handleDeleteGate(gate.id)}
                  title="Click to delete gate"
                >
                  {gate.type}
                  {gate.type === 'CNOT' && gate.qubits && (
                    <div 
                      className="absolute w-0.5 bg-quantum-neon animate-in slide-in-from-top"
                      style={{
                        height: Math.abs(gate.qubits[1] - gate.qubits[0]) * 60,
                        top: gate.qubits[0] < gate.qubits[1] ? '100%' : `-${Math.abs(gate.qubits[1] - gate.qubits[0]) * 60}px`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        animationDelay: `${index * 100 + 200}ms`
                      }}
                    />
                  )}
                </div>
              ))}

              {/* Drop Zone Indicator */}
              {dragState.isDragging && dragState.hoverQubit !== null && dragState.hoverPosition !== null && (
                <div
                  className="absolute w-10 h-10 border-2 border-dashed border-quantum-glow rounded-lg bg-quantum-glow/20 flex items-center justify-center text-xs font-bold quantum-glow animate-pulse"
                  style={{
                    left: dragState.hoverPosition * gridSize + 20,
                    top: dragState.hoverQubit * 60 + 15
                  }}
                >
                  {dragState.gateType}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
