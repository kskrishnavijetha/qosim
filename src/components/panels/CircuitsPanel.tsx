import React, { useState, useRef, useCallback } from "react";
import { Undo, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quantumSimulator, type QuantumGate, type SimulationResult } from "@/lib/quantumSimulator";
import { GatePalette } from "@/components/circuits/GatePalette";
import { CircuitGrid } from "@/components/circuits/CircuitGrid";
import { QuantumStateVisualization } from "@/components/circuits/QuantumStateVisualization";
import { ExistingCircuitsList } from "@/components/circuits/ExistingCircuitsList";
import { GateSuggestionsPanel } from "@/components/circuits/GateSuggestionsPanel";

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

  const handleSuggestionClick = (suggestion: any) => {
    // For now, just log the suggestion. Could be extended to auto-add gates
    console.log('Suggestion clicked:', suggestion);
  };

  return (
    <div className="h-full overflow-auto quantum-grid">
      <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="animate-in fade-in slide-in-from-left">
            <h2 className="text-xl lg:text-2xl font-bold text-quantum-glow">Quantum Circuit Builder</h2>
            <p className="text-muted-foreground font-mono text-sm">Drag and drop gates to build quantum circuits</p>
          </div>
          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-right" style={{ animationDelay: '200ms' }}>
            <Button onClick={handleUndo} variant="outline" className="neon-border hover:scale-105 transition-all duration-300">
              <Undo className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Undo</span>
            </Button>
            <Button onClick={handleClear} variant="outline" className="neon-border hover:scale-105 transition-all duration-300">
              <Trash2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            <Button onClick={exportToJSON} variant="outline" className="neon-border hover:scale-105 transition-all duration-300">
              <Download className="w-4 h-4 mr-2" />
              JSON
            </Button>
            <Button onClick={exportToQASM} variant="outline" className="neon-border hover:scale-105 transition-all duration-300">
              <Download className="w-4 h-4 mr-2" />
              QASM
            </Button>
          </div>
        </div>

        {/* Circuit Builder */}
        <Card className="quantum-panel neon-border animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="text-lg font-mono text-quantum-glow">Circuit Designer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
              <div className="lg:shrink-0">
                <GatePalette onGateMouseDown={handleMouseDown} />
              </div>
              <CircuitGrid 
                circuit={circuit}
                dragState={dragState}
                simulationResult={simulationResult}
                onDeleteGate={handleDeleteGate}
                circuitRef={circuitRef}
                NUM_QUBITS={NUM_QUBITS}
                GRID_SIZE={GRID_SIZE}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Live Quantum State Visualization */}
          <div className="lg:col-span-2">
            <QuantumStateVisualization 
              simulationResult={simulationResult} 
              NUM_QUBITS={NUM_QUBITS} 
            />
          </div>

          {/* AI Suggestions Panel */}
          <div className="lg:col-span-1">
            <GateSuggestionsPanel 
              circuit={circuit}
              onSuggestionClick={handleSuggestionClick}
            />
          </div>
        </div>

        {/* Existing Circuits */}
        <ExistingCircuitsList />

        {/* Dragging Gate */}
        {dragState.isDragging && (
          <div
            className={`fixed w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xs font-bold text-black pointer-events-none z-50 quantum-glow animate-pulse shadow-2xl ${
              gateTypes.find(g => g.type === dragState.gateType)?.color || 'bg-secondary'
            }`}
            style={{
              left: dragState.dragPosition.x - 20,
              top: dragState.dragPosition.y - 20,
              transform: 'rotate(5deg) scale(1.1)'
            }}
          >
            {dragState.gateType}
          </div>
        )}
      </div>
    </div>
  );
}