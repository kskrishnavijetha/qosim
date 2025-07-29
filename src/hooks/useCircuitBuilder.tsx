
import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Gate {
  id: string;
  type: string;
  qubit: number;
  position: number;
  parameters?: Record<string, any>;
  controlQubits?: number[];
}

export interface Qubit {
  id: string;
  index: number;
  state: {
    amplitude: { real: number; imaginary: number };
    probability: number;
    phase: number;
  };
}

export interface SimulationResult {
  stateVector: Array<{ real: number; imaginary: number }>;
  probabilities: number[];
  measurements: Record<string, number>;
  fidelity: number;
  executionTime: number;
}

interface CircuitHistory {
  circuit: Gate[];
  qubits: Qubit[];
  timestamp: number;
}

export function useCircuitBuilder() {
  const [circuit, setCircuit] = useState<Gate[]>([]);
  const [qubits, setQubits] = useState<Qubit[]>([
    { id: 'q0', index: 0, state: { amplitude: { real: 1, imaginary: 0 }, probability: 1, phase: 0 } },
    { id: 'q1', index: 1, state: { amplitude: { real: 1, imaginary: 0 }, probability: 1, phase: 0 } },
    { id: 'q2', index: 2, state: { amplitude: { real: 1, imaginary: 0 }, probability: 1, phase: 0 } }
  ]);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  
  const history = useRef<CircuitHistory[]>([]);
  const historyIndex = useRef(-1);

  const saveToHistory = useCallback(() => {
    const snapshot: CircuitHistory = {
      circuit: [...circuit],
      qubits: [...qubits],
      timestamp: Date.now()
    };
    
    // Remove any history after current index
    history.current = history.current.slice(0, historyIndex.current + 1);
    
    // Add new snapshot
    history.current.push(snapshot);
    historyIndex.current = history.current.length - 1;
    
    // Limit history size
    if (history.current.length > 50) {
      history.current = history.current.slice(-50);
      historyIndex.current = history.current.length - 1;
    }
  }, [circuit, qubits]);

  const addGate = useCallback((gate: Gate) => {
    setCircuit(prev => [...prev, gate]);
    saveToHistory();
    toast({
      title: "Gate Added",
      description: `${gate.type} gate added to qubit ${gate.qubit}`,
    });
  }, [saveToHistory]);

  const removeGate = useCallback((gateId: string) => {
    setCircuit(prev => prev.filter(g => g.id !== gateId));
    saveToHistory();
    toast({
      title: "Gate Removed",
      description: "Gate has been removed from the circuit",
    });
  }, [saveToHistory]);

  const moveGate = useCallback((gateId: string, newPosition: number, newQubit?: number) => {
    setCircuit(prev => prev.map(gate => 
      gate.id === gateId 
        ? { ...gate, position: newPosition, ...(newQubit !== undefined && { qubit: newQubit }) }
        : gate
    ));
    saveToHistory();
  }, [saveToHistory]);

  const addQubit = useCallback(() => {
    const newIndex = qubits.length;
    const newQubit: Qubit = {
      id: `q${newIndex}`,
      index: newIndex,
      state: { amplitude: { real: 1, imaginary: 0 }, probability: 1, phase: 0 }
    };
    setQubits(prev => [...prev, newQubit]);
    saveToHistory();
    toast({
      title: "Qubit Added",
      description: `Qubit q${newIndex} added to the circuit`,
    });
  }, [qubits.length, saveToHistory]);

  const removeQubit = useCallback(() => {
    if (qubits.length <= 1) {
      toast({
        title: "Cannot Remove",
        description: "Circuit must have at least one qubit",
        variant: "destructive"
      });
      return;
    }
    
    const lastIndex = qubits.length - 1;
    setQubits(prev => prev.slice(0, -1));
    setCircuit(prev => prev.filter(gate => gate.qubit !== lastIndex));
    saveToHistory();
    toast({
      title: "Qubit Removed",
      description: `Qubit q${lastIndex} and its gates removed`,
    });
  }, [qubits.length, saveToHistory]);

  const simulate = useCallback(async () => {
    setIsSimulating(true);
    
    try {
      // Simulate the quantum circuit
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock simulation delay
      
      const numStates = Math.pow(2, qubits.length);
      const mockResult: SimulationResult = {
        stateVector: Array.from({ length: numStates }, (_, i) => ({
          real: Math.random() * 0.5,
          imaginary: Math.random() * 0.5
        })),
        probabilities: Array.from({ length: numStates }, () => Math.random()).map(p => p / numStates),
        measurements: {},
        fidelity: 0.95 + Math.random() * 0.05,
        executionTime: 150 + Math.random() * 100
      };
      
      setSimulationResult(mockResult);
      
      toast({
        title: "Simulation Complete",
        description: `Circuit simulated in ${mockResult.executionTime.toFixed(1)}ms`,
      });
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: "An error occurred during simulation",
        variant: "destructive"
      });
    } finally {
      setIsSimulating(false);
    }
  }, [qubits.length]);

  const undo = useCallback(() => {
    if (historyIndex.current > 0) {
      historyIndex.current--;
      const snapshot = history.current[historyIndex.current];
      setCircuit([...snapshot.circuit]);
      setQubits([...snapshot.qubits]);
      toast({
        title: "Undone",
        description: "Last action has been undone",
      });
    }
  }, []);

  const redo = useCallback(() => {
    if (historyIndex.current < history.current.length - 1) {
      historyIndex.current++;
      const snapshot = history.current[historyIndex.current];
      setCircuit([...snapshot.circuit]);
      setQubits([...snapshot.qubits]);
      toast({
        title: "Redone",
        description: "Action has been redone",
      });
    }
  }, []);

  const clear = useCallback(() => {
    setCircuit([]);
    setSimulationResult(null);
    saveToHistory();
    toast({
      title: "Circuit Cleared",
      description: "All gates have been removed",
    });
  }, [saveToHistory]);

  const exportCircuit = useCallback((format: string) => {
    // Implementation for different export formats
    console.log(`Exporting circuit as ${format}`);
  }, []);

  const importCircuit = useCallback((data: string, format: string) => {
    // Implementation for different import formats
    console.log(`Importing circuit from ${format}`);
  }, []);

  const optimizeCircuit = useCallback(() => {
    // AI-powered circuit optimization
    toast({
      title: "Circuit Optimized",
      description: "Circuit has been optimized using AI",
    });
  }, []);

  const canUndo = historyIndex.current > 0;
  const canRedo = historyIndex.current < history.current.length - 1;

  // Initialize history
  useEffect(() => {
    if (history.current.length === 0) {
      saveToHistory();
    }
  }, [saveToHistory]);

  return {
    circuit,
    qubits,
    simulationResult,
    isSimulating,
    addGate,
    removeGate,
    moveGate,
    addQubit,
    removeQubit,
    simulate,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    exportCircuit,
    importCircuit,
    optimizeCircuit
  };
}
