import { GitBranch, Play, Pause, RotateCcw, Zap, Trash2, Undo, Download, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useRef, useCallback } from "react";

export function CircuitsPanel() {
  const circuits = [
    { id: "QC-001", name: "Bell State Generator", qubits: 2, gates: 4, status: "ready" },
    { id: "QC-002", name: "Grover's Algorithm", qubits: 8, gates: 24, status: "running" },
    { id: "QC-003", name: "Quantum Fourier Transform", qubits: 4, gates: 16, status: "ready" },
    { id: "QC-004", name: "Error Correction", qubits: 16, gates: 48, status: "compiled" },
  ];

  // Drag and Drop Circuit Editor State
  const [draggedGate, setDraggedGate] = useState<string | null>(null);
  const [circuitGates, setCircuitGates] = useState<Array<{
    id: string;
    gate: string;
    qubits: number[];
    time: number;
    x: number;
    y: number;
  }>>([]);
  const [history, setHistory] = useState<Array<typeof circuitGates>>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [qubitStates, setQubitStates] = useState<Array<{
    amplitude: [number, number]; // [real, imaginary]
    phase: number;
    state: string;
  }>>([
    { amplitude: [1, 0], phase: 0, state: "|0⟩" },
    { amplitude: [1, 0], phase: 0, state: "|0⟩" },
    { amplitude: [1, 0], phase: 0, state: "|0⟩" },
    { amplitude: [1, 0], phase: 0, state: "|0⟩" },
    { amplitude: [1, 0], phase: 0, state: "|0⟩" },
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPreview, setDragPreview] = useState<{x: number, y: number, visible: boolean}>({
    x: 0, y: 0, visible: false
  });

  const circuitRef = useRef<HTMLDivElement>(null);

  const quantumGates = [
    { name: "H", color: "bg-quantum-glow", description: "Hadamard" },
    { name: "X", color: "bg-quantum-neon", description: "Pauli-X" },
    { name: "Z", color: "bg-quantum-plasma", description: "Pauli-Z" },
    { name: "CNOT", color: "bg-quantum-energy", description: "Controlled-NOT" },
    { name: "RX", color: "bg-quantum-particle", description: "Rotation-X" },
    { name: "RY", color: "bg-quantum-void", description: "Rotation-Y" },
    { name: "M", color: "bg-quantum-matrix", description: "Measure" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "text-quantum-glow";
      case "ready": return "text-quantum-neon";
      case "compiled": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  // Drag and Drop Logic
  const handleDragStart = useCallback((gateName: string) => {
    setDraggedGate(gateName);
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!circuitRef.current) return;
    
    const rect = circuitRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDragPreview({ x, y, visible: true });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setDragPreview({ x: 0, y: 0, visible: false });
    
    if (!draggedGate || !circuitRef.current) return;

    const rect = circuitRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Snap to grid and determine qubit
    const wireHeight = 60;
    const qubitIndex = Math.floor((y - 40) / wireHeight);
    
    if (qubitIndex < 0 || qubitIndex >= 5) return;

    const snapX = Math.max(60, Math.round(x / 40) * 40);
    const snapY = 40 + qubitIndex * wireHeight;
    const timeStep = Math.floor((snapX - 60) / 40);

    const newGate = {
      id: `gate-${Date.now()}`,
      gate: draggedGate,
      qubits: draggedGate === "CNOT" ? [qubitIndex, Math.min(qubitIndex + 1, 4)] : [qubitIndex],
      time: timeStep,
      x: snapX,
      y: snapY,
    };

    const newCircuitGates = [...circuitGates, newGate];
    setCircuitGates(newCircuitGates);
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCircuitGates);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // Simulate quantum state
    simulateQuantumState(newCircuitGates);
    
    setDraggedGate(null);
  }, [draggedGate, circuitGates, history, historyIndex]);

  // Quantum State Simulation
  const simulateQuantumState = useCallback((gates: typeof circuitGates) => {
    const newStates = [...qubitStates];
    
    gates.forEach(gate => {
      gate.qubits.forEach(qubit => {
        if (gate.gate === "H") {
          // Hadamard gate - creates superposition
          newStates[qubit] = {
            amplitude: [0.707, 0],
            phase: 0,
            state: "|+⟩"
          };
        } else if (gate.gate === "X") {
          // Pauli-X gate - bit flip
          newStates[qubit] = {
            amplitude: [0, 1],
            phase: Math.PI,
            state: "|1⟩"
          };
        } else if (gate.gate === "Z") {
          // Pauli-Z gate - phase flip
          newStates[qubit] = {
            ...newStates[qubit],
            phase: newStates[qubit].phase + Math.PI,
            state: `|${newStates[qubit].state.includes("1") ? "1" : "0"}⟩`
          };
        } else if (gate.gate === "M") {
          // Measurement - collapse to classical state
          const prob = Math.random();
          newStates[qubit] = {
            amplitude: prob > 0.5 ? [0, 1] : [1, 0],
            phase: 0,
            state: prob > 0.5 ? "|1⟩" : "|0⟩"
          };
        }
      });
    });
    
    setQubitStates(newStates);
  }, [qubitStates]);

  // Undo functionality
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCircuitGates(history[newIndex]);
      simulateQuantumState(history[newIndex]);
    }
  }, [historyIndex, history, simulateQuantumState]);

  // Clear circuit
  const handleClear = useCallback(() => {
    setCircuitGates([]);
    const newHistory = [...history, []];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setQubitStates([
      { amplitude: [1, 0], phase: 0, state: "|0⟩" },
      { amplitude: [1, 0], phase: 0, state: "|0⟩" },
      { amplitude: [1, 0], phase: 0, state: "|0⟩" },
      { amplitude: [1, 0], phase: 0, state: "|0⟩" },
      { amplitude: [1, 0], phase: 0, state: "|0⟩" },
    ]);
  }, [history]);

  // Export circuit
  const handleExport = useCallback(() => {
    const json = JSON.stringify(circuitGates, null, 2);
    const qasm = circuitGates.map(gate => {
      if (gate.gate === "CNOT") {
        return `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];`;
      }
      return `${gate.gate.toLowerCase()} q[${gate.qubits[0]}];`;
    }).join('\n');

    console.log("Circuit JSON:", json);
    console.log("Circuit QASM:\n", qasm);
    
    // Download as file
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantum-circuit.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [circuitGates]);

  // Delete gate
  const handleDeleteGate = useCallback((gateId: string) => {
    const newCircuitGates = circuitGates.filter(gate => gate.id !== gateId);
    setCircuitGates(newCircuitGates);
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCircuitGates);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    simulateQuantumState(newCircuitGates);
  }, [circuitGates, history, historyIndex, simulateQuantumState]);

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-quantum-glow">Quantum Circuits</h2>
            <p className="text-muted-foreground font-mono">Design and execute quantum algorithms</p>
          </div>
          <Button className="bg-quantum-glow hover:bg-quantum-glow/80 text-black quantum-glow">
            <GitBranch className="w-4 h-4 mr-2" />
            New Circuit
          </Button>
        </div>

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

        {/* Quantum State Visualization */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">Current Quantum State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-mono text-sm space-y-2">
              <div className="text-quantum-neon">|ψ⟩ = 0.707|00⟩ + 0.707|11⟩</div>
              <div className="text-muted-foreground">Entanglement: Bell State (Φ+)</div>
              <div className="text-muted-foreground">Coherence Time: 45.3μs remaining</div>
            </div>
          </CardContent>
        </Card>

        {/* Drag and Drop Quantum Circuit Editor */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-mono text-quantum-glow">Circuit Designer</CardTitle>
                <p className="text-sm text-muted-foreground font-mono">Drag gates onto qubit wires</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleUndo}
                  disabled={historyIndex === 0}
                  className="neon-border"
                >
                  <Undo className="w-3 h-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleClear}
                  className="neon-border"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleExport}
                  className="neon-border"
                >
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              {/* Gate Palette */}
              <div className="flex flex-col gap-3 min-w-[120px]">
                <h3 className="text-sm font-mono text-quantum-neon">Quantum Gates</h3>
                <div className="space-y-2">
                  {quantumGates.map((gate) => (
                    <div
                      key={gate.name}
                      draggable
                      onDragStart={() => handleDragStart(gate.name)}
                      className={`
                        w-12 h-12 ${gate.color} rounded border-2 border-current
                        flex items-center justify-center text-xs font-bold text-black
                        cursor-grab active:cursor-grabbing hover:scale-105 transition-transform
                        quantum-glow
                      `}
                      title={gate.description}
                    >
                      {gate.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Circuit Canvas */}
              <div className="flex-1">
                <div 
                  ref={circuitRef}
                  className="relative bg-quantum-matrix rounded-lg p-4 min-h-[320px] quantum-panel"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragLeave={() => setDragPreview({ x: 0, y: 0, visible: false })}
                >
                  {/* Grid Background */}
                  <div className="absolute inset-0 opacity-20">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute w-full h-px bg-quantum-neon" 
                        style={{ top: `${40 + i * 40}px` }} 
                      />
                    ))}
                    {Array.from({ length: 15 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="absolute h-full w-px bg-quantum-neon" 
                        style={{ left: `${60 + i * 40}px` }} 
                      />
                    ))}
                  </div>

                  {/* Qubit Wires */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center mb-8">
                      <div className="w-8 text-sm font-mono text-quantum-neon">q{i}</div>
                      <div className="flex-1 relative h-8 flex items-center ml-4">
                        <div className="w-full h-0.5 bg-quantum-neon entanglement-line"></div>
                      </div>
                      <div className="w-20 text-sm font-mono text-right">
                        <span className="text-quantum-particle">{qubitStates[i].state}</span>
                      </div>
                    </div>
                  ))}

                  {/* Placed Gates */}
                  {circuitGates.map((gate) => (
                    <div
                      key={gate.id}
                      className="absolute cursor-pointer group"
                      style={{ left: gate.x, top: gate.y }}
                      onClick={() => handleDeleteGate(gate.id)}
                    >
                      <div className={`
                        w-8 h-8 rounded border-2 flex items-center justify-center 
                        text-xs font-bold text-black quantum-float transition-all
                        ${quantumGates.find(g => g.name === gate.gate)?.color}
                        border-current group-hover:scale-110
                      `}>
                        {gate.gate}
                      </div>
                      {gate.gate === "CNOT" && gate.qubits.length > 1 && (
                        <div 
                          className="absolute w-0.5 bg-quantum-energy opacity-80"
                          style={{
                            left: '50%',
                            top: '100%',
                            height: `${(gate.qubits[1] - gate.qubits[0]) * 60 - 32}px`,
                          }}
                        />
                      )}
                      <div className="absolute -top-6 left-0 text-xs text-quantum-glow opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to delete
                      </div>
                    </div>
                  ))}

                  {/* Drag Preview */}
                  {dragPreview.visible && draggedGate && (
                    <div
                      className="absolute pointer-events-none"
                      style={{ left: dragPreview.x - 16, top: dragPreview.y - 16 }}
                    >
                      <div className={`
                        w-8 h-8 rounded border-2 flex items-center justify-center 
                        text-xs font-bold text-black opacity-70
                        ${quantumGates.find(g => g.name === draggedGate)?.color}
                        border-current
                      `}>
                        {draggedGate}
                      </div>
                    </div>
                  )}
                </div>

                {/* Circuit Statistics */}
                <div className="mt-4 flex gap-6 text-sm font-mono">
                  <div>
                    <span className="text-muted-foreground">Gates:</span>
                    <span className="ml-2 text-quantum-neon">{circuitGates.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Depth:</span>
                    <span className="ml-2 text-quantum-neon">
                      {circuitGates.length > 0 ? Math.max(...circuitGates.map(g => g.time)) + 1 : 0}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Active Qubits:</span>
                    <span className="ml-2 text-quantum-neon">
                      {new Set(circuitGates.flatMap(g => g.qubits)).size}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Qubit State Visualization */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">Qubit State Visualization</CardTitle>
            <p className="text-sm text-muted-foreground font-mono">Live Bloch sphere representation</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {qubitStates.map((qubit, i) => (
                <div key={i} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    {/* Bloch Sphere Visualization */}
                    <div className="w-full h-full rounded-full border-2 border-quantum-neon relative overflow-hidden">
                      <div 
                        className="absolute w-3 h-3 rounded-full quantum-glow transition-all duration-500"
                        style={{
                          left: '50%',
                          top: '50%',
                          transform: `translate(-50%, -50%) translate(${Math.cos(qubit.phase) * 20}px, ${Math.sin(qubit.phase) * 20}px)`,
                          backgroundColor: qubit.state.includes("+") ? "hsl(var(--quantum-glow))" : 
                                         qubit.state.includes("1") ? "hsl(var(--quantum-neon))" : "hsl(var(--quantum-particle))"
                        }}
                      />
                      {/* State vector */}
                      <div 
                        className="absolute w-0.5 bg-quantum-energy origin-bottom"
                        style={{
                          left: '50%',
                          bottom: '50%',
                          height: `${Math.sqrt(qubit.amplitude[0]**2 + qubit.amplitude[1]**2) * 25}px`,
                          transform: `translateX(-50%) rotate(${qubit.phase * 180 / Math.PI}deg)`,
                        }}
                      />
                    </div>
                    <div className="text-xs font-mono text-quantum-neon mt-1">q{i}</div>
                    <div className="text-xs font-mono text-quantum-particle">{qubit.state}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Entanglement Information */}
            <div className="mt-4 p-3 bg-quantum-void/20 rounded border border-quantum-void">
              <div className="text-sm font-mono space-y-1">
                <div className="text-quantum-glow">System State:</div>
                <div className="text-quantum-neon">
                  |ψ⟩ = {qubitStates.map((q, i) => `${q.amplitude[0].toFixed(3)}${q.state}`).join(' ⊗ ')}
                </div>
                <div className="text-muted-foreground text-xs">
                  Gates applied: {circuitGates.length} | Last operation: {circuitGates[circuitGates.length - 1]?.gate || 'None'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}