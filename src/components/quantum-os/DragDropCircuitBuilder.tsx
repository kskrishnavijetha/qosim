
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, RotateCcw } from 'lucide-react';
import { QuantumGatePalette } from './QuantumGatePalette';
import { CircuitCanvas } from './CircuitCanvas';
import { useDragDropCircuit } from '@/hooks/useDragDropCircuit';
import { cn } from '@/lib/utils';

interface Gate {
  id: string;
  type: string;
  qubit: number;
  position: number;
  angle?: number;
  controlQubit?: number;
}

interface Circuit {
  id: string;
  name: string;
  gates: Gate[];
  qubits: number;
  modified: boolean;
}

interface DragDropCircuitBuilderProps {
  circuit: Circuit;
  onCircuitChange: (gates: Gate[]) => void;
}

export function DragDropCircuitBuilder({ circuit, onCircuitChange }: DragDropCircuitBuilderProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedGate, setSelectedGate] = useState<string | null>(null);
  const [showGateProperties, setShowGateProperties] = useState(false);

  const {
    dragState,
    handleGateMouseDown,
    handleGateTouchStart,
    addGate,
    removeGate,
    updateGate
  } = useDragDropCircuit({
    circuit: circuit.gates,
    numQubits: circuit.qubits,
    onCircuitChange
  });

  const handleGateSelect = useCallback((gateId: string) => {
    setSelectedGate(gateId);
    setShowGateProperties(true);
  }, []);

  const handleGateDelete = useCallback((gateId: string) => {
    removeGate(gateId);
    if (selectedGate === gateId) {
      setSelectedGate(null);
      setShowGateProperties(false);
    }
  }, [removeGate, selectedGate]);

  const selectedGateData = selectedGate ? circuit.gates.find(g => g.id === selectedGate) : null;

  return (
    <div className="flex h-full gap-6">
      {/* Gate Palette */}
      <div className="w-80">
        <Card className="h-full quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-glow flex items-center gap-2">
              🎛️ Quantum Gates
              <Badge variant="outline" className="text-xs">
                {circuit.gates.length} placed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <QuantumGatePalette
              onGateMouseDown={handleGateMouseDown}
              onGateTouchStart={handleGateTouchStart}
            />
          </CardContent>
        </Card>
      </div>

      {/* Main Circuit Canvas */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-quantum-glow">{circuit.name}</h3>
            <div className="flex items-center gap-2 text-sm text-quantum-particle">
              <span>{circuit.qubits} qubits</span>
              <span>•</span>
              <span>{circuit.gates.length} gates</span>
              <span>•</span>
              <span>Depth: {Math.max(...circuit.gates.map(g => g.position), 0) + 1}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onCircuitChange([])}
              className="neon-border text-quantum-particle hover:text-quantum-neon"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        <Card className="flex-1 quantum-panel neon-border">
          <CardContent className="p-0 h-full">
            <CircuitCanvas
              ref={canvasRef}
              circuit={circuit}
              dragState={dragState}
              onGateSelect={handleGateSelect}
              onGateDelete={handleGateDelete}
              selectedGate={selectedGate}
            />
          </CardContent>
        </Card>
      </div>

      {/* Gate Properties Panel */}
      {showGateProperties && selectedGateData && (
        <div className="w-80">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-quantum-glow">Gate Properties</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGateProperties(false)}
                  className="text-quantum-particle hover:text-quantum-neon"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-quantum-particle">Gate Type</label>
                <div className="text-lg font-mono text-quantum-glow">
                  {selectedGateData.type}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-quantum-particle">Qubit</label>
                  <div className="text-quantum-neon font-mono">
                    q[{selectedGateData.qubit}]
                  </div>
                </div>
                <div>
                  <label className="text-sm text-quantum-particle">Position</label>
                  <div className="text-quantum-neon font-mono">
                    {selectedGateData.position}
                  </div>
                </div>
              </div>

              {selectedGateData.angle !== undefined && (
                <div>
                  <label className="text-sm text-quantum-particle">Rotation Angle</label>
                  <div className="text-quantum-energy font-mono">
                    {selectedGateData.angle.toFixed(3)} rad
                  </div>
                </div>
              )}

              {selectedGateData.controlQubit !== undefined && (
                <div>
                  <label className="text-sm text-quantum-particle">Control Qubit</label>
                  <div className="text-quantum-plasma font-mono">
                    q[{selectedGateData.controlQubit}]
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-quantum-matrix">
                <Button
                  onClick={() => handleGateDelete(selectedGateData.id)}
                  variant="outline"
                  className="w-full neon-border text-destructive hover:bg-destructive hover:text-quantum-void"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Gate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
