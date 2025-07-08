import React, { useState, useRef, useCallback } from "react";
import { GitBranch, Play, Pause, RotateCcw, Zap, Undo, Download, Trash2, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quantumSimulator, type QuantumGate, type SimulationResult } from "@/lib/quantumSimulator";

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
}

interface DragState {
  isDragging: boolean;
  gateType: string;
  dragPosition: { x: number; y: number };
  hoverQubit: number | null;
  hoverPosition: number | null;
}

export function CircuitsPanel() {
  const [circuit, setCircuit] = useState<Gate[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    gateType: '',
    dragPosition: { x: 0, y: 0 },
    hoverQubit: null,
    hoverPosition: null
  });
  const [history, setHistory] = useState<Gate[][]>([[]]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  
  const circuitRef = useRef<HTMLDivElement>(null);
  const NUM_QUBITS = 5;
  const GRID_SIZE = 50;

  const gateTypes = [
    { type: 'H', name: 'Hadamard', color: 'bg-quantum-glow' },
    { type: 'X', name: 'Pauli-X', color: 'bg-quantum-neon' },
    { type: 'Z', name: 'Pauli-Z', color: 'bg-quantum-particle' },
    { type: 'CNOT', name: 'CNOT', color: 'bg-quantum-plasma' },
    { type: 'RX', name: 'Rotation-X', color: 'bg-quantum-energy' },
    { type: 'RY', name: 'Rotation-Y', color: 'bg-secondary' },
    { type: 'M', name: 'Measure', color: 'bg-destructive' },
  ];

  const simulateQuantumState = useCallback((gates: Gate[]) => {
    // Convert our Gate interface to QuantumGate interface
    const quantumGates: QuantumGate[] = gates.map(gate => ({
      id: gate.id,
      type: gate.type,
      qubit: gate.qubit,
      qubits: gate.qubits,
      position: gate.position,
      angle: gate.angle
    }));
    
    // Run the quantum simulation
    const result = quantumSimulator.simulate(quantumGates);
    setSimulationResult(result);
  }, []);

  const handleMouseDown = (e: React.MouseEvent, gateType: string) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragState({
      isDragging: true,
      gateType,
      dragPosition: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      hoverQubit: null,
      hoverPosition: null
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !circuitRef.current) return;
    
    const circuitRect = circuitRef.current.getBoundingClientRect();
    const relativeX = e.clientX - circuitRect.left;
    const relativeY = e.clientY - circuitRect.top;
    
    const qubit = Math.floor((relativeY - 40) / 60);
    const position = Math.floor(relativeX / GRID_SIZE);
    
    setDragState(prev => ({
      ...prev,
      dragPosition: { x: e.clientX, y: e.clientY },
      hoverQubit: qubit >= 0 && qubit < NUM_QUBITS ? qubit : null,
      hoverPosition: position >= 0 ? position : null
    }));
  }, [dragState.isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!dragState.isDragging) return;
    
    if (dragState.hoverQubit !== null && dragState.hoverPosition !== null) {
      const newGate: Gate = {
        id: `gate_${Date.now()}`,
        type: dragState.gateType,
        qubit: dragState.gateType === 'CNOT' ? undefined : dragState.hoverQubit,
        qubits: dragState.gateType === 'CNOT' ? [dragState.hoverQubit, Math.min(dragState.hoverQubit + 1, NUM_QUBITS - 1)] : undefined,
        position: dragState.hoverPosition,
        angle: dragState.gateType.startsWith('R') ? Math.PI / 4 : undefined
      };
      
      const newCircuit = [...circuit, newGate];
      setCircuit(newCircuit);
      setHistory(prev => [...prev, newCircuit]);
      
      // Generate standardized circuit data structure and simulate
      const circuitData = generateCircuitData(newCircuit);
      console.log('Generated circuit data:', circuitData);
      simulateQuantumState(newCircuit);
    }
    
    setDragState({
      isDragging: false,
      gateType: '',
      dragPosition: { x: 0, y: 0 },
      hoverQubit: null,
      hoverPosition: null
    });
  }, [dragState, circuit, simulateQuantumState]);

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

  const handleUndo = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const previousCircuit = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCircuit(previousCircuit);
      simulateQuantumState(previousCircuit);
    }
  };

  const handleClear = () => {
    setCircuit([]);
    setHistory([[]]);
    setSimulationResult(null);
  };

  const handleDeleteGate = (gateId: string) => {
    const newCircuit = circuit.filter(gate => gate.id !== gateId);
    setCircuit(newCircuit);
    setHistory(prev => [...prev, newCircuit]);
    simulateQuantumState(newCircuit);
  };

  const generateCircuitData = (gates: Gate[]) => {
    return gates
      .sort((a, b) => a.position - b.position) // Sort by time step
      .map(gate => ({
        gate: gate.type,
        qubit: gate.qubit,
        qubits: gate.qubits,
        time: gate.position,
        angle: gate.angle
      }));
  };

  const exportToJSON = () => {
    const data = generateCircuitData(circuit);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantum_circuit.json';
    a.click();
  };

  const exportToQASM = () => {
    let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[${NUM_QUBITS}];\ncreg c[${NUM_QUBITS}];\n\n`;
    
    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          qasm += `h q[${gate.qubit}];\n`;
          break;
        case 'X':
          qasm += `x q[${gate.qubit}];\n`;
          break;
        case 'Z':
          qasm += `z q[${gate.qubit}];\n`;
          break;
        case 'CNOT':
          if (gate.qubits) qasm += `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];\n`;
          break;
        case 'RX':
          qasm += `rx(${gate.angle}) q[${gate.qubit}];\n`;
          break;
        case 'RY':
          qasm += `ry(${gate.angle}) q[${gate.qubit}];\n`;
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
    a.download = 'quantum_circuit.qasm';
    a.click();
  };

  const getBlochSphereStyle = (qubitState: { 
    amplitude: { real: number; imag: number }; 
    phase: number; 
  }) => {
    const { amplitude, phase } = qubitState;
    const theta = 2 * Math.acos(Math.abs(amplitude.real));
    const phi = phase;
    
    return {
      background: `conic-gradient(from ${phi}rad, hsl(var(--quantum-glow)), hsl(var(--quantum-neon)), hsl(var(--quantum-particle)))`,
      transform: `rotateX(${theta}rad) rotateZ(${phi}rad)`,
      boxShadow: `0 0 20px hsl(var(--quantum-glow) / 0.6)`
    };
  };

  const circuits = [
    { id: "QC-001", name: "Bell State Generator", qubits: 2, gates: 4, status: "ready" },
    { id: "QC-002", name: "Grover's Algorithm", qubits: 8, gates: 24, status: "running" },
    { id: "QC-003", name: "Quantum Fourier Transform", qubits: 4, gates: 16, status: "ready" },
    { id: "QC-004", name: "Error Correction", qubits: 16, gates: 48, status: "compiled" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "text-quantum-glow";
      case "ready": return "text-quantum-neon";
      case "compiled": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">Quantum Circuit Builder</h2>
            <p className="text-muted-foreground font-mono">Drag and drop gates to build quantum circuits</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUndo} variant="outline" className="neon-border">
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button onClick={handleClear} variant="outline" className="neon-border">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button onClick={exportToJSON} variant="outline" className="neon-border">
              <Download className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button onClick={exportToQASM} variant="outline" className="neon-border">
              <Download className="w-4 h-4 mr-2" />
              QASM
            </Button>
          </div>
        </div>

        {/* Circuit Builder */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">Circuit Designer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              {/* Gate Palette */}
              <div className="w-48 space-y-2">
                <h3 className="text-sm font-mono text-quantum-neon mb-4">Gate Palette</h3>
                {gateTypes.map(gate => (
                  <div
                    key={gate.type}
                    className={`w-12 h-12 ${gate.color} rounded border-2 border-current flex items-center justify-center text-xs font-bold text-black cursor-pointer hover:scale-110 transition-transform quantum-glow`}
                    onMouseDown={(e) => handleMouseDown(e, gate.type)}
                    title={gate.name}
                  >
                    {gate.type}
                  </div>
                ))}
              </div>

              {/* Circuit Grid */}
              <div className="flex-1">
                <div 
                  ref={circuitRef} 
                  className="relative bg-quantum-matrix rounded-lg p-4 min-h-[320px] quantum-panel"
                  style={{ backgroundImage: `repeating-linear-gradient(90deg, hsl(var(--quantum-neon) / 0.1) 0px, hsl(var(--quantum-neon) / 0.1) 1px, transparent 1px, transparent ${GRID_SIZE}px)` }}
                >
                  {/* Qubit Lines */}
                  {Array.from({ length: NUM_QUBITS }).map((_, i) => (
                    <div key={i} className="flex items-center mb-4 relative" style={{ top: i * 60 + 20 }}>
                      <div className="w-8 text-xs font-mono text-quantum-neon absolute -left-10">q{i}</div>
                      <div className="w-full h-0.5 bg-quantum-neon relative entanglement-line"></div>
                      <div className="w-16 text-xs font-mono text-muted-foreground absolute -right-20">
                        {simulationResult?.qubitStates[i]?.state || '|0⟩'}
                      </div>
                    </div>
                  ))}

                  {/* Placed Gates */}
                  {circuit.map(gate => (
                    <div
                      key={gate.id}
                      className={`absolute w-10 h-10 rounded border-2 flex items-center justify-center text-xs font-bold text-black cursor-pointer hover:scale-110 transition-transform quantum-glow ${
                        gateTypes.find(g => g.type === gate.type)?.color || 'bg-secondary'
                      }`}
                      style={{
                        left: gate.position * GRID_SIZE + 20,
                        top: gate.type === 'CNOT' ? (gate.qubits ? gate.qubits[0] * 60 + 15 : 0) : (gate.qubit ? gate.qubit * 60 + 15 : 0)
                      }}
                      onClick={() => handleDeleteGate(gate.id)}
                      title="Click to delete"
                    >
                      {gate.type}
                      {gate.type === 'CNOT' && gate.qubits && (
                        <div 
                          className="absolute w-0.5 bg-quantum-neon"
                          style={{
                            height: Math.abs(gate.qubits[1] - gate.qubits[0]) * 60,
                            top: gate.qubits[0] < gate.qubits[1] ? '100%' : `-${Math.abs(gate.qubits[1] - gate.qubits[0]) * 60}px`,
                            left: '50%',
                            transform: 'translateX(-50%)'
                          }}
                        />
                      )}
                    </div>
                  ))}

                  {/* Drop Zone Indicator */}
                  {dragState.isDragging && dragState.hoverQubit !== null && dragState.hoverPosition !== null && (
                    <div
                      className="absolute w-10 h-10 border-2 border-dashed border-quantum-glow rounded bg-quantum-glow/20 flex items-center justify-center text-xs font-bold quantum-glow"
                      style={{
                        left: dragState.hoverPosition * GRID_SIZE + 20,
                        top: dragState.hoverQubit * 60 + 15
                      }}
                    >
                      {dragState.gateType}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Quantum State Visualization */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">Live Quantum State Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {Array.from({ length: NUM_QUBITS }).map((_, i) => {
                const qubitState = simulationResult?.qubitStates[i] || {
                  state: '|0⟩',
                  amplitude: { real: 1, imag: 0 },
                  phase: 0,
                  probability: 1
                };
                
                return (
                  <div key={i} className="flex flex-col items-center space-y-2">
                    <div className="text-xs font-mono text-quantum-neon">Qubit {i}</div>
                    <div 
                      className="w-16 h-16 rounded-full border-2 border-quantum-neon flex items-center justify-center quantum-float particle-animation"
                      style={getBlochSphereStyle(qubitState)}
                    >
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="text-xs font-mono text-center">
                      <div className="text-quantum-neon">{qubitState.state}</div>
                      <div className="text-muted-foreground">φ: {qubitState.phase.toFixed(2)}</div>
                      <div className="text-muted-foreground">P: {qubitState.probability.toFixed(3)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* State Vector Display */}
            {simulationResult && (
              <div className="mt-6 p-4 bg-quantum-matrix rounded-lg">
                <h4 className="text-sm font-mono text-quantum-neon mb-2">State Vector</h4>
                <div className="text-xs font-mono text-muted-foreground max-h-20 overflow-y-auto">
                  {quantumSimulator.getStateString()}
                </div>
                <div className="mt-2">
                  <h5 className="text-xs font-mono text-quantum-particle">Measurement Probabilities</h5>
                  <div className="text-xs font-mono text-muted-foreground">
                    {simulationResult.measurementProbabilities
                      .map((prob, i) => prob > 0.001 ? `|${i.toString(2).padStart(NUM_QUBITS, '0')}⟩: ${(prob * 100).toFixed(1)}%` : null)
                      .filter(Boolean)
                      .join(', ')}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Existing Circuits */}
        <div className="grid gap-4">
          {circuits.map((circuit) => (
            <Card key={circuit.id} className="quantum-panel neon-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-mono">{circuit.name}</CardTitle>
                  <span className={`text-xs font-mono ${getStatusColor(circuit.status)}`}>
                    {circuit.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">{circuit.id}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-6 text-sm font-mono">
                    <div>
                      <span className="text-muted-foreground">Qubits:</span>
                      <span className="ml-2 text-quantum-neon">{circuit.qubits}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gates:</span>
                      <span className="ml-2 text-quantum-neon">{circuit.gates}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="neon-border">
                      {circuit.status === "running" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                    <Button variant="outline" size="sm" className="neon-border">
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                    <Button variant="outline" size="sm" className="neon-border">
                      <Zap className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Enhanced Circuit Visualization */}
                <div className="mt-4 bg-quantum-matrix rounded-lg p-4 quantum-panel">
                  <div className="space-y-4">
                    {Array.from({ length: circuit.qubits }).map((_, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-8 text-xs font-mono text-quantum-neon">q{i}</div>
                        <div className="flex-1 relative h-6 flex items-center">
                          {/* Quantum wire */}
                          <div className="w-full h-0.5 bg-quantum-neon relative entanglement-line"></div>
                          
                          {/* Quantum gates */}
                          <div className="absolute left-1/4 w-8 h-8 bg-quantum-glow rounded border-2 border-quantum-glow flex items-center justify-center text-xs font-bold text-black quantum-float">
                            H
                          </div>
                          <div className="absolute left-1/2 w-8 h-8 bg-quantum-neon rounded border-2 border-quantum-neon flex items-center justify-center text-xs font-bold text-black quantum-float">
                            X
                          </div>
                          <div className="absolute left-3/4 w-2 h-2 bg-quantum-particle rounded-full particle-animation"></div>
                        </div>
                        <div className="w-16 text-xs font-mono text-muted-foreground text-right">
                          |{Math.random() > 0.5 ? '0' : '1'}⟩
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dragging Gate */}
        {dragState.isDragging && (
          <div
            className={`fixed w-10 h-10 rounded border-2 flex items-center justify-center text-xs font-bold text-black pointer-events-none z-50 quantum-glow ${
              gateTypes.find(g => g.type === dragState.gateType)?.color || 'bg-secondary'
            }`}
            style={{
              left: dragState.dragPosition.x - 20,
              top: dragState.dragPosition.y - 20
            }}
          >
            {dragState.gateType}
          </div>
        )}
      </div>
    </div>
  );
}