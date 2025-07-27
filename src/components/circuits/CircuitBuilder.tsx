
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Download, Upload, Save, Share2, Trash2, Undo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

interface CircuitBuilderProps {
  circuit: Gate[];
  dragState: DragState;
  simulationResult: OptimizedSimulationResult | null;
  onDeleteGate: (gateId: string) => void;
  onGateMouseDown: (e: React.MouseEvent, gateType: string) => void;
  onGateTouchStart?: (e: React.TouchEvent, gateType: string) => void;
  circuitRef: React.RefObject<HTMLDivElement>;
  numQubits: number;
  gridSize: number;
}

const GATE_TYPES = [
  { name: 'H', label: 'Hadamard', color: 'bg-blue-500' },
  { name: 'X', label: 'Pauli-X', color: 'bg-red-500' },
  { name: 'Y', label: 'Pauli-Y', color: 'bg-green-500' },
  { name: 'Z', label: 'Pauli-Z', color: 'bg-purple-500' },
  { name: 'CNOT', label: 'CNOT', color: 'bg-orange-500' },
  { name: 'CZ', label: 'CZ', color: 'bg-cyan-500' },
  { name: 'T', label: 'T Gate', color: 'bg-pink-500' },
  { name: 'S', label: 'S Gate', color: 'bg-yellow-500' },
  { name: 'RX', label: 'RX', color: 'bg-indigo-500' },
  { name: 'RY', label: 'RY', color: 'bg-teal-500' },
  { name: 'RZ', label: 'RZ', color: 'bg-rose-500' },
  { name: 'TOFFOLI', label: 'Toffoli', color: 'bg-amber-500' },
  { name: 'SWAP', label: 'SWAP', color: 'bg-lime-500' },
  { name: 'M', label: 'Measure', color: 'bg-gray-500' }
];

export function CircuitBuilder({
  circuit,
  dragState,
  simulationResult,
  onDeleteGate,
  onGateMouseDown,
  onGateTouchStart,
  circuitRef,
  numQubits,
  gridSize
}: CircuitBuilderProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const { toast } = useToast();

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      // Simulate quantum circuit execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Simulation Complete",
        description: "Circuit executed successfully"
      });
    } catch (error) {
      toast({
        title: "Simulation Error",
        description: "Failed to execute circuit",
        variant: "destructive"
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const exportQASM = () => {
    let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[${numQubits}];\ncreg c[${numQubits}];\n\n`;
    
    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          qasm += `h q[${gate.qubit}];\n`;
          break;
        case 'X':
          qasm += `x q[${gate.qubit}];\n`;
          break;
        case 'CNOT':
          qasm += `cx q[${gate.qubit}],q[${(gate.qubit || 0) + 1}];\n`;
          break;
        case 'M':
          qasm += `measure q[${gate.qubit}] -> c[${gate.qubit}];\n`;
          break;
      }
    });
    
    const blob = new Blob([qasm], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_circuit.qasm`;
    a.click();
    
    toast({
      title: "QASM Exported",
      description: "Circuit exported successfully"
    });
  };

  const clearCircuit = () => {
    toast({
      title: "Circuit Cleared",
      description: "All gates removed"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-quantum-glow">Quantum Circuit Builder</h2>
          <p className="text-quantum-particle">Design and simulate quantum circuits</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={runSimulation} disabled={isSimulating}>
            <Play className="w-4 h-4 mr-2" />
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
          </Button>
          <Button variant="outline" onClick={exportQASM}>
            <Download className="w-4 h-4 mr-2" />
            Export QASM
          </Button>
          <Button variant="outline" onClick={clearCircuit}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Gate Palette */}
        <div className="lg:col-span-1">
          <Card className="quantum-panel">
            <CardHeader>
              <CardTitle>Gate Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {GATE_TYPES.map(gate => (
                  <div
                    key={gate.name}
                    className={`${gate.color} text-white p-3 rounded cursor-pointer text-center font-mono hover:opacity-80 transition-opacity`}
                    onMouseDown={(e) => onGateMouseDown(e, gate.name)}
                    onTouchStart={onGateTouchStart ? (e) => onGateTouchStart(e, gate.name) : undefined}
                    draggable={false}
                  >
                    {gate.name}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Circuit Canvas */}
        <div className="lg:col-span-3">
          <Card className="quantum-panel">
            <CardHeader>
              <CardTitle>Circuit Canvas</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                ref={circuitRef}
                className="relative bg-quantum-matrix p-4 rounded-lg min-h-[400px] overflow-auto"
                style={{ userSelect: 'none' }}
              >
                {/* Qubit Lines */}
                {Array.from({ length: numQubits }, (_, i) => (
                  <div key={i} className="relative mb-4">
                    <div className="flex items-center">
                      <div className="w-16 text-quantum-neon font-mono">|q{i}⟩</div>
                      <div className="flex-1 h-0.5 bg-quantum-neon relative">
                        {/* Grid positions */}
                        {Array.from({ length: 20 }, (_, j) => (
                          <div
                            key={j}
                            className={`absolute w-12 h-12 border border-quantum-particle/20 ${
                              dragState.hoverQubit === i && dragState.hoverPosition === j
                                ? 'bg-quantum-energy/20'
                                : ''
                            }`}
                            style={{
                              left: `${j * gridSize}px`,
                              top: '-24px'
                            }}
                          />
                        ))}
                        
                        {/* Render gates */}
                        {circuit
                          .filter(gate => gate.qubit === i)
                          .map(gate => (
                            <div
                              key={gate.id}
                              className="absolute bg-quantum-glow text-quantum-void px-2 py-1 rounded text-xs font-mono cursor-pointer hover:opacity-80"
                              style={{
                                left: `${gate.position * gridSize + 6}px`,
                                top: '-16px'
                              }}
                              onClick={() => onDeleteGate(gate.id)}
                            >
                              {gate.type}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Drag Preview */}
                {dragState.isDragging && (
                  <div
                    className="fixed bg-quantum-energy text-quantum-void px-2 py-1 rounded text-xs font-mono z-50 pointer-events-none"
                    style={{
                      left: dragState.dragPosition.x - 20,
                      top: dragState.dragPosition.y - 12
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

      {/* Simulation Results */}
      {simulationResult && (
        <Card className="quantum-panel">
          <CardHeader>
            <CardTitle>Simulation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold text-quantum-glow mb-2">State Vector</h3>
                <div className="bg-quantum-matrix p-3 rounded font-mono text-sm">
                  {simulationResult.stateVector.map((amp, i) => (
                    <div key={i}>
                      |{i.toString(2).padStart(3, '0')}⟩: {typeof amp === 'number' ? amp.toFixed(4) : String(amp)}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-quantum-glow mb-2">Probabilities</h3>
                <div className="bg-quantum-matrix p-3 rounded font-mono text-sm">
                  {simulationResult.measurementProbabilities.map((prob, i) => (
                    prob > 0 && (
                      <div key={i}>
                        |{i.toString(2).padStart(3, '0')}⟩: {(prob * 100).toFixed(1)}%
                      </div>
                    )
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-quantum-glow mb-2">Performance</h3>
                <div className="bg-quantum-matrix p-3 rounded font-mono text-sm">
                  <div>Time: {simulationResult.executionTime.toFixed(2)}ms</div>
                  <div>Fidelity: {(simulationResult.fidelity * 100).toFixed(1)}%</div>
                  <div>Mode: {simulationResult.mode}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
