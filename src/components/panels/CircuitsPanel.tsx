import { useState, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Zap, Trash2, Undo, Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Gate {
  id: string;
  type: 'X' | 'H' | 'CNOT' | 'Z' | 'RX' | 'RY' | 'Measure';
  qubit: number;
  targetQubit?: number; // For CNOT gates
  time: number;
  angle?: number; // For RX, RY gates
}

interface BlochState {
  x: number;
  y: number;
  z: number;
  phase: number;
}

export function CircuitsPanel() {
  const [circuit, setCircuit] = useState<Gate[]>([]);
  const [history, setHistory] = useState<Gate[][]>([]);
  const [draggedGate, setDraggedGate] = useState<string | null>(null);
  const [blochStates, setBlochStates] = useState<BlochState[]>(
    Array.from({ length: 5 }, () => ({ x: 0, y: 0, z: 1, phase: 0 }))
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const circuitRef = useRef<HTMLDivElement>(null);

  const gateTypes = [
    { type: 'H', name: 'Hadamard', color: 'bg-quantum-glow', description: 'Creates superposition' },
    { type: 'X', name: 'Pauli-X', color: 'bg-quantum-neon', description: 'Bit flip' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-quantum-particle', description: 'Phase flip' },
    { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma', description: 'Controlled NOT' },
    { type: 'RX', name: 'RX(π/2)', color: 'bg-quantum-energy', description: 'X rotation' },
    { type: 'RY', name: 'RY(π/2)', color: 'bg-red-500', description: 'Y rotation' },
    { type: 'Measure', name: 'Measure', color: 'bg-white', description: 'Measurement' },
  ];

  const handleDragStart = (e: React.DragEvent, gateType: string) => {
    setDraggedGate(gateType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = useCallback((e: React.DragEvent, qubit: number, time: number) => {
    e.preventDefault();
    if (!draggedGate) return;

    // Save current state to history
    setHistory(prev => [...prev, circuit]);

    const newGate: Gate = {
      id: `${draggedGate}-${Date.now()}`,
      type: draggedGate as Gate['type'],
      qubit,
      time,
      ...(draggedGate === 'RX' || draggedGate === 'RY' ? { angle: Math.PI / 2 } : {}),
    };

    setCircuit(prev => [...prev, newGate]);
    setDraggedGate(null);
    simulateCircuit([...circuit, newGate]);
  }, [draggedGate, circuit]);

  const simulateCircuit = (gates: Gate[]) => {
    const newStates = Array.from({ length: 5 }, () => ({ x: 0, y: 0, z: 1, phase: 0 }));
    
    gates.forEach(gate => {
      const state = newStates[gate.qubit];
      
      switch (gate.type) {
        case 'H':
          // Hadamard gate
          newStates[gate.qubit] = {
            x: 1 / Math.sqrt(2),
            y: 0,
            z: 1 / Math.sqrt(2),
            phase: 0
          };
          break;
        case 'X':
          // Pauli-X gate
          newStates[gate.qubit] = {
            x: state.x,
            y: state.y,
            z: -state.z,
            phase: state.phase
          };
          break;
        case 'Z':
          // Pauli-Z gate
          newStates[gate.qubit] = {
            x: -state.x,
            y: state.y,
            z: state.z,
            phase: state.phase + Math.PI
          };
          break;
        case 'RX':
          // RX rotation
          const cosRX = Math.cos((gate.angle || 0) / 2);
          const sinRX = Math.sin((gate.angle || 0) / 2);
          newStates[gate.qubit] = {
            x: state.x,
            y: state.y * cosRX + state.z * sinRX,
            z: state.z * cosRX - state.y * sinRX,
            phase: state.phase
          };
          break;
        case 'RY':
          // RY rotation
          const cosRY = Math.cos((gate.angle || 0) / 2);
          const sinRY = Math.sin((gate.angle || 0) / 2);
          newStates[gate.qubit] = {
            x: state.x * cosRY - state.z * sinRY,
            y: state.y,
            z: state.z * cosRY + state.x * sinRY,
            phase: state.phase
          };
          break;
        case 'Measure':
          // Measurement collapses to |0⟩ or |1⟩
          const prob = (1 - state.z) / 2;
          if (Math.random() < prob) {
            newStates[gate.qubit] = { x: 0, y: 0, z: -1, phase: 0 }; // |1⟩
          } else {
            newStates[gate.qubit] = { x: 0, y: 0, z: 1, phase: 0 }; // |0⟩
          }
          break;
      }
    });
    
    setBlochStates(newStates);
  };

  const clearCircuit = () => {
    setHistory(prev => [...prev, circuit]);
    setCircuit([]);
    setBlochStates(Array.from({ length: 5 }, () => ({ x: 0, y: 0, z: 1, phase: 0 })));
  };

  const undo = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setCircuit(previousState);
      setHistory(prev => prev.slice(0, -1));
      simulateCircuit(previousState);
    }
  };

  const deleteGate = (gateId: string) => {
    setHistory(prev => [...prev, circuit]);
    const newCircuit = circuit.filter(gate => gate.id !== gateId);
    setCircuit(newCircuit);
    simulateCircuit(newCircuit);
  };

  const exportCircuit = () => {
    const qasm = circuit.map(gate => {
      switch (gate.type) {
        case 'H': return `h q[${gate.qubit}];`;
        case 'X': return `x q[${gate.qubit}];`;
        case 'Z': return `z q[${gate.qubit}];`;
        case 'CNOT': return `cx q[${gate.qubit}], q[${gate.targetQubit || 0}];`;
        case 'RX': return `rx(${gate.angle}) q[${gate.qubit}];`;
        case 'RY': return `ry(${gate.angle}) q[${gate.qubit}];`;
        case 'Measure': return `measure q[${gate.qubit}] -> c[${gate.qubit}];`;
        default: return '';
      }
    }).join('\n');
    
    console.log('Circuit JSON:', JSON.stringify(circuit, null, 2));
    console.log('QASM:', qasm);
  };

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      simulateCircuit(circuit);
      setIsSimulating(false);
    }, 1000);
  };

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">Quantum Circuit Editor</h2>
            <p className="text-muted-foreground font-mono">Drag gates onto qubit wires to build circuits</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={undo} disabled={history.length === 0} variant="outline" className="neon-border">
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button onClick={clearCircuit} variant="outline" className="neon-border">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button onClick={exportCircuit} variant="outline" className="neon-border">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={runSimulation} 
              disabled={isSimulating}
              className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow"
            >
              {isSimulating ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isSimulating ? 'Simulating...' : 'Simulate'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Gate Palette */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-quantum-glow">Gate Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gateTypes.map((gate) => (
                  <div
                    key={gate.type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, gate.type)}
                    className={`
                      w-full h-12 ${gate.color} ${gate.type === 'Measure' ? 'text-black' : 'text-white'}
                      rounded-lg flex items-center justify-center font-bold text-sm
                      cursor-grab active:cursor-grabbing hover:scale-105 transition-transform
                      border-2 border-transparent hover:border-white/20
                    `}
                  >
                    <div className="text-center">
                      <div>{gate.type}</div>
                      <div className="text-xs opacity-80">{gate.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Circuit Editor */}
          <Card className="lg:col-span-2 quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-quantum-glow">Circuit Design</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={circuitRef} className="bg-quantum-matrix rounded-lg p-6 min-h-96">
                <div className="space-y-8">
                  {Array.from({ length: 5 }).map((_, qubit) => (
                    <div key={qubit} className="flex items-center">
                      <div className="w-8 text-sm font-mono text-quantum-neon">q{qubit}</div>
                      <div className="flex-1 relative h-8 flex items-center">
                        {/* Quantum wire */}
                        <div className="w-full h-0.5 bg-quantum-neon relative entanglement-line"></div>
                        
                        {/* Drop zones */}
                        {Array.from({ length: 8 }).map((_, timeStep) => (
                          <div
                            key={timeStep}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, qubit, timeStep)}
                            className="absolute w-12 h-12 border-2 border-dashed border-transparent hover:border-quantum-glow/50 rounded flex items-center justify-center"
                            style={{ left: `${(timeStep + 1) * 12.5}%`, transform: 'translateX(-50%)' }}
                          >
                            {/* Render placed gates */}
                            {circuit
                              .filter(gate => gate.qubit === qubit && gate.time === timeStep)
                              .map(gate => (
                                <div
                                  key={gate.id}
                                  onClick={() => deleteGate(gate.id)}
                                  className={`
                                    w-10 h-10 rounded border-2 flex items-center justify-center text-xs font-bold
                                    cursor-pointer hover:scale-110 transition-transform quantum-float
                                    ${gateTypes.find(g => g.type === gate.type)?.color || 'bg-gray-500'}
                                    ${gate.type === 'Measure' ? 'text-black' : 'text-white'}
                                  `}
                                >
                                  {gate.type}
                                </div>
                              ))}
                          </div>
                        ))}
                      </div>
                      <div className="w-20 text-xs font-mono text-quantum-neon text-right">
                        |ψ{qubit}⟩
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bloch Sphere Visualization */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-quantum-glow">Qubit States</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {blochStates.map((state, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-xs font-mono text-quantum-neon w-8">q{i}</div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-quantum-void to-quantum-matrix rounded-full border border-quantum-neon">
                      {/* Bloch sphere representation */}
                      <div className="absolute inset-2 rounded-full border border-quantum-neon/30">
                        <div 
                          className="absolute w-2 h-2 bg-quantum-glow rounded-full particle-animation"
                          style={{
                            left: `${50 + state.x * 40}%`,
                            top: `${50 - state.z * 40}%`,
                            transform: 'translate(-50%, -50%)'
                          }}
                        />
                        {/* Equator */}
                        <div className="absolute top-1/2 left-0 right-0 h-px bg-quantum-neon/20 transform -translate-y-1/2" />
                        {/* Meridian */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-quantum-neon/20 transform -translate-x-1/2" />
                      </div>
                    </div>
                    <div className="text-xs font-mono text-muted-foreground">
                      {state.z > 0.9 ? "|0⟩" : state.z < -0.9 ? "|1⟩" : "superposition"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Circuit Data Structure Display */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">Circuit Data Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono text-quantum-neon bg-quantum-matrix p-4 rounded overflow-x-auto">
              {JSON.stringify(circuit, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}