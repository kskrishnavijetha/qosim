
import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';
import { QuantumGate } from '@/components/circuits/QuantumCircuitBuilder';

interface SimulationResult {
  stateVector: Array<{ real: number; imag: number }>;
  measurementProbabilities: number[];
  qubitStates: Array<{
    state: string;
    amplitude: { real: number; imag: number };
    phase: number;
    probability: number;
  }>;
  executionTime: number;
  fidelity: number;
}

export function useQuantumCircuitBuilder() {
  const [circuit, setCircuit] = useState<QuantumGate[]>([]);
  const [numQubits, setNumQubits] = useState(3);
  const [selectedGate, setSelectedGate] = useState<QuantumGate | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [history, setHistory] = useState<QuantumGate[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const updateHistory = useCallback((newCircuit: QuantumGate[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newCircuit]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const addGate = useCallback((gateType: string, position: { x: number; y: number }) => {
    // Determine which qubit based on position
    const qubit = Math.floor((position.y - 50) / 60);
    const timeStep = Math.floor((position.x - 100) / 80);
    
    if (qubit < 0 || qubit >= numQubits) {
      toast.error('Invalid qubit position');
      return;
    }

    const newGate: QuantumGate = {
      id: nanoid(),
      type: gateType,
      qubit: qubit,
      position: Math.max(0, timeStep),
      ...(needsAngle(gateType) && { angle: Math.PI / 4 }),
      ...(isMultiQubitGate(gateType) && { 
        qubits: [qubit, Math.min(qubit + 1, numQubits - 1)] 
      })
    };

    // Remove single qubit assignment for multi-qubit gates
    if (isMultiQubitGate(gateType)) {
      delete newGate.qubit;
    }

    const newCircuit = [...circuit, newGate];
    setCircuit(newCircuit);
    updateHistory(newCircuit);
    toast.success(`Added ${gateType} gate`);
  }, [circuit, numQubits, updateHistory]);

  const removeGate = useCallback((gateId: string) => {
    const newCircuit = circuit.filter(gate => gate.id !== gateId);
    setCircuit(newCircuit);
    updateHistory(newCircuit);
    
    if (selectedGate?.id === gateId) {
      setSelectedGate(null);
    }
    toast.success('Gate removed');
  }, [circuit, selectedGate, updateHistory]);

  const moveGate = useCallback((gateId: string, position: { x: number; y: number }) => {
    const qubit = Math.floor((position.y - 50) / 60);
    const timeStep = Math.floor((position.x - 100) / 80);
    
    if (qubit < 0 || qubit >= numQubits) return;

    const newCircuit = circuit.map(gate => 
      gate.id === gateId 
        ? { ...gate, qubit: qubit, position: Math.max(0, timeStep) }
        : gate
    );
    
    setCircuit(newCircuit);
    updateHistory(newCircuit);
  }, [circuit, numQubits, updateHistory]);

  const selectGate = useCallback((gate: QuantumGate) => {
    setSelectedGate(gate);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedGate(null);
  }, []);

  const addQubit = useCallback(() => {
    if (numQubits >= 10) {
      toast.error('Maximum 10 qubits supported');
      return;
    }
    setNumQubits(prev => prev + 1);
    toast.success('Qubit added');
  }, [numQubits]);

  const removeQubit = useCallback((qubitIndex: number) => {
    if (numQubits <= 1) {
      toast.error('Circuit must have at least 1 qubit');
      return;
    }
    
    // Remove gates on this qubit
    const newCircuit = circuit.filter(gate => {
      if (gate.qubit === qubitIndex) return false;
      if (gate.qubits?.includes(qubitIndex)) return false;
      return true;
    });
    
    // Adjust qubit indices for remaining gates
    const adjustedCircuit = newCircuit.map(gate => ({
      ...gate,
      qubit: gate.qubit !== undefined && gate.qubit > qubitIndex ? gate.qubit - 1 : gate.qubit,
      qubits: gate.qubits?.map(q => q > qubitIndex ? q - 1 : q)
    }));
    
    setCircuit(adjustedCircuit);
    setNumQubits(prev => prev - 1);
    updateHistory(adjustedCircuit);
    toast.success('Qubit removed');
  }, [numQubits, circuit, updateHistory]);

  const clearCircuit = useCallback(() => {
    setCircuit([]);
    setSelectedGate(null);
    setSimulationResult(null);
    updateHistory([]);
    toast.success('Circuit cleared');
  }, [updateHistory]);

  const simulateCircuit = useCallback(async () => {
    if (circuit.length === 0) {
      toast.error('Add gates to simulate');
      return;
    }

    try {
      // Simulate quantum circuit (mock implementation)
      const startTime = performance.now();
      
      // Mock simulation results
      const numStates = Math.pow(2, numQubits);
      const measurementProbabilities = Array.from({ length: numStates }, () => Math.random())
        .map(p => p / numStates); // Normalize
      
      const qubitStates = Array.from({ length: numQubits }, (_, i) => ({
        state: Math.random() > 0.5 ? '|0⟩' : '|1⟩',
        amplitude: { real: Math.random(), imag: Math.random() },
        phase: Math.random() * 2 * Math.PI,
        probability: Math.random()
      }));

      const stateVector = Array.from({ length: numStates }, () => ({
        real: Math.random() * 2 - 1,
        imag: Math.random() * 2 - 1
      }));

      const result: SimulationResult = {
        stateVector,
        measurementProbabilities,
        qubitStates,
        executionTime: performance.now() - startTime,
        fidelity: 0.95 + Math.random() * 0.05
      };

      setSimulationResult(result);
    } catch (error) {
      throw new Error('Simulation failed: ' + (error as Error).message);
    }
  }, [circuit, numQubits]);

  const exportCircuit = useCallback(async (format: string): Promise<string> => {
    switch (format.toLowerCase()) {
      case 'qasm':
        return exportToQASM();
      case 'json':
        return exportToJSON();
      case 'python':
        return exportToPython();
      case 'javascript':
        return exportToJavaScript();
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }, [circuit, numQubits]);

  const exportToQASM = useCallback((): string => {
    let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[${numQubits}];\ncreg c[${numQubits}];\n\n`;
    
    const sortedGates = [...circuit].sort((a, b) => a.position - b.position);
    
    sortedGates.forEach(gate => {
      switch (gate.type) {
        case 'H':
          qasm += `h q[${gate.qubit}];\n`;
          break;
        case 'X':
          qasm += `x q[${gate.qubit}];\n`;
          break;
        case 'Y':
          qasm += `y q[${gate.qubit}];\n`;
          break;
        case 'Z':
          qasm += `z q[${gate.qubit}];\n`;
          break;
        case 'CNOT':
        case 'CX':
          if (gate.qubits && gate.qubits.length >= 2) {
            qasm += `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];\n`;
          }
          break;
        case 'RX':
          qasm += `rx(${gate.angle || Math.PI/2}) q[${gate.qubit}];\n`;
          break;
        case 'RY':
          qasm += `ry(${gate.angle || Math.PI/2}) q[${gate.qubit}];\n`;
          break;
        case 'RZ':
          qasm += `rz(${gate.angle || Math.PI/2}) q[${gate.qubit}];\n`;
          break;
        case 'M':
          qasm += `measure q[${gate.qubit}] -> c[${gate.qubit}];\n`;
          break;
        default:
          qasm += `// Unsupported gate: ${gate.type}\n`;
      }
    });
    
    return qasm;
  }, [circuit, numQubits]);

  const exportToJSON = useCallback((): string => {
    return JSON.stringify({
      metadata: {
        name: 'quantum_circuit',
        version: '1.0.0',
        created: new Date().toISOString(),
        qubits: numQubits,
        gates: circuit.length
      },
      circuit: circuit
    }, null, 2);
  }, [circuit, numQubits]);

  const exportToPython = useCallback((): string => {
    let python = `# Quantum Circuit\nfrom qiskit import QuantumCircuit, execute, Aer\n\n`;
    python += `qc = QuantumCircuit(${numQubits}, ${numQubits})\n\n`;
    
    const sortedGates = [...circuit].sort((a, b) => a.position - b.position);
    
    sortedGates.forEach(gate => {
      switch (gate.type) {
        case 'H':
          python += `qc.h(${gate.qubit})\n`;
          break;
        case 'X':
          python += `qc.x(${gate.qubit})\n`;
          break;
        case 'CNOT':
        case 'CX':
          if (gate.qubits && gate.qubits.length >= 2) {
            python += `qc.cx(${gate.qubits[0]}, ${gate.qubits[1]})\n`;
          }
          break;
        case 'RX':
          python += `qc.rx(${gate.angle || Math.PI/2}, ${gate.qubit})\n`;
          break;
        default:
          python += `# Unsupported gate: ${gate.type}\n`;
      }
    });
    
    python += `\nbackend = Aer.get_backend('qasm_simulator')\njob = execute(qc, backend, shots=1024)\nresult = job.result()\ncounts = result.get_counts(qc)\nprint(counts)\n`;
    
    return python;
  }, [circuit, numQubits]);

  const exportToJavaScript = useCallback((): string => {
    let js = `// Quantum Circuit (JavaScript)\n// Note: Requires quantum computing library\n\n`;
    js += `const numQubits = ${numQubits};\nconst circuit = [];\n\n`;
    
    const sortedGates = [...circuit].sort((a, b) => a.position - b.position);
    
    sortedGates.forEach(gate => {
      js += `circuit.push({\n`;
      js += `  type: '${gate.type}',\n`;
      js += `  qubit: ${gate.qubit},\n`;
      if (gate.qubits) js += `  qubits: [${gate.qubits.join(', ')}],\n`;
      if (gate.angle) js += `  angle: ${gate.angle},\n`;
      js += `});\n\n`;
    });
    
    js += `// Execute circuit with your preferred quantum computing library\nconsole.log('Circuit:', circuit);\n`;
    
    return js;
  }, [circuit, numQubits]);

  const importCircuit = useCallback((data: string, format: string) => {
    // Implementation for importing circuits
    toast.success('Circuit import feature coming soon');
  }, []);

  const saveCircuit = useCallback(() => {
    const data = exportToJSON();
    localStorage.setItem('quantum_circuit', data);
    toast.success('Circuit saved locally');
  }, [exportToJSON]);

  const loadCircuit = useCallback(() => {
    const data = localStorage.getItem('quantum_circuit');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setCircuit(parsed.circuit || []);
        setNumQubits(parsed.metadata?.qubits || 3);
        toast.success('Circuit loaded');
      } catch (error) {
        toast.error('Failed to load circuit');
      }
    } else {
      toast.error('No saved circuit found');
    }
  }, []);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCircuit(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCircuit(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    circuit,
    numQubits,
    selectedGate,
    simulationResult,
    addGate,
    removeGate,
    moveGate,
    selectGate,
    clearSelection,
    addQubit,
    removeQubit,
    clearCircuit,
    simulateCircuit,
    exportCircuit,
    importCircuit,
    saveCircuit,
    loadCircuit,
    undo,
    redo,
    canUndo,
    canRedo
  };
}

// Helper functions
function needsAngle(gateType: string): boolean {
  return ['RX', 'RY', 'RZ', 'Phase', 'U1', 'U2', 'U3', 'CRX', 'CRY', 'CRZ'].includes(gateType);
}

function isMultiQubitGate(gateType: string): boolean {
  return ['CNOT', 'CX', 'CY', 'CZ', 'CH', 'SWAP', 'iSWAP', 'CRX', 'CRY', 'CRZ', 'CU1', 'CU3', 'RXX', 'RYY', 'RZZ', 'CCX', 'CSWAP'].includes(gateType);
}
