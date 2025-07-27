
import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Download, Upload, Save, Share2, Trash2, Undo } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Gate {
  id: string;
  type: string;
  qubit: number;
  position: number;
  angle?: number;
  controlQubit?: number;
  targetQubit?: number;
}

interface Circuit {
  id: string;
  name: string;
  gates: Gate[];
  qubits: number;
  measurements: boolean[];
}

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
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

export function CircuitBuilder() {
  const [circuit, setCircuit] = useState<Circuit>({
    id: 'circuit-1',
    name: 'My Quantum Circuit',
    gates: [],
    qubits: 5,
    measurements: [false, false, false, false, false]
  });
  
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    gateType: '',
    dragPosition: { x: 0, y: 0 },
    hoverQubit: null,
    hoverPosition: null
  });
  
  const circuitRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleGateMouseDown = useCallback((e: React.MouseEvent, gateType: string) => {
    e.preventDefault();
    setDragState({
      isDragging: true,
      gateType,
      dragPosition: { x: e.clientX, y: e.clientY },
      hoverQubit: null,
      hoverPosition: null
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !circuitRef.current) return;
    
    const rect = circuitRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const qubit = Math.floor((y - 40) / 80);
    const position = Math.floor((x - 100) / 60);
    
    setDragState(prev => ({
      ...prev,
      dragPosition: { x: e.clientX, y: e.clientY },
      hoverQubit: qubit >= 0 && qubit < circuit.qubits ? qubit : null,
      hoverPosition: position >= 0 ? position : null
    }));
  }, [dragState.isDragging, circuit.qubits]);

  const handleMouseUp = useCallback(() => {
    if (!dragState.isDragging) return;
    
    if (dragState.hoverQubit !== null && dragState.hoverPosition !== null) {
      const newGate: Gate = {
        id: `gate-${Date.now()}`,
        type: dragState.gateType,
        qubit: dragState.hoverQubit,
        position: dragState.hoverPosition,
        angle: dragState.gateType.startsWith('R') ? Math.PI / 4 : undefined
      };
      
      setCircuit(prev => ({
        ...prev,
        gates: [...prev.gates, newGate]
      }));
      
      toast({
        title: "Gate Added",
        description: `${dragState.gateType} gate added to qubit ${dragState.hoverQubit}`
      });
    }
    
    setDragState({
      isDragging: false,
      gateType: '',
      dragPosition: { x: 0, y: 0 },
      hoverQubit: null,
      hoverPosition: null
    });
  }, [dragState, toast]);

  React.useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, handleMouseMove, handleMouseUp]);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      // Simulate quantum circuit execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockResult = {
        stateVector: [0.7071, 0, 0, 0.7071, 0, 0, 0, 0],
        probabilities: [0.5, 0, 0, 0.5, 0, 0, 0, 0],
        measurementCounts: { '000': 512, '111': 512 },
        executionTime: 1.2,
        fidelity: 0.99
      };
      
      setSimulationResult(mockResult);
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
    let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[${circuit.qubits}];\ncreg c[${circuit.qubits}];\n\n`;
    
    circuit.gates.forEach(gate => {
      switch (gate.type) {
        case 'H':
          qasm += `h q[${gate.qubit}];\n`;
          break;
        case 'X':
          qasm += `x q[${gate.qubit}];\n`;
          break;
        case 'CNOT':
          qasm += `cx q[${gate.qubit}],q[${gate.qubit + 1}];\n`;
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
    a.download = `${circuit.name}.qasm`;
    a.click();
    
    toast({
      title: "QASM Exported",
      description: "Circuit exported successfully"
    });
  };

  const clearCircuit = () => {
    setCircuit(prev => ({ ...prev, gates: [] }));
    setSimulationResult(null);
    toast({
      title: "Circuit Cleared",
      description: "All gates removed"
    });
  };

  return (
    <div className="min-h-screen bg-quantum-void p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-quantum-glow">Quantum Circuit Builder</h1>
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
                      onMouseDown={(e) => handleGateMouseDown(e, gate.name)}
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
                <CardTitle>Circuit: {circuit.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  ref={circuitRef}
                  className="relative bg-quantum-matrix p-4 rounded-lg min-h-[400px] overflow-auto"
                  style={{ userSelect: 'none' }}
                >
                  {/* Qubit Lines */}
                  {Array.from({ length: circuit.qubits }, (_, i) => (
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
                                left: `${j * 60}px`,
                                top: '-24px'
                              }}
                            />
                          ))}
                          
                          {/* Render gates */}
                          {circuit.gates
                            .filter(gate => gate.qubit === i)
                            .map(gate => (
                              <div
                                key={gate.id}
                                className="absolute bg-quantum-glow text-quantum-void px-2 py-1 rounded text-xs font-mono"
                                style={{
                                  left: `${gate.position * 60 + 6}px`,
                                  top: '-16px'
                                }}
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
                    {simulationResult.stateVector.map((amp: number, i: number) => (
                      <div key={i}>
                        |{i.toString(2).padStart(3, '0')}⟩: {amp.toFixed(4)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-quantum-glow mb-2">Probabilities</h3>
                  <div className="bg-quantum-matrix p-3 rounded font-mono text-sm">
                    {simulationResult.probabilities.map((prob: number, i: number) => (
                      prob > 0 && (
                        <div key={i}>
                          |{i.toString(2).padStart(3, '0')}⟩: {(prob * 100).toFixed(1)}%
                        </div>
                      )
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-quantum-glow mb-2">Measurements</h3>
                  <div className="bg-quantum-matrix p-3 rounded font-mono text-sm">
                    {Object.entries(simulationResult.measurementCounts).map(([state, count]) => (
                      <div key={state}>
                        {state}: {count} shots
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-4">
                <Badge variant="secondary">
                  Execution Time: {simulationResult.executionTime}ms
                </Badge>
                <Badge variant="secondary">
                  Fidelity: {(simulationResult.fidelity * 100).toFixed(1)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
