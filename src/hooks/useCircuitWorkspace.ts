
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  controlQubit?: number;
  params?: number[];
}

interface Circuit {
  id: string;
  name: string;
  gates: Gate[];
  qubits: number;
  modified: boolean;
  created: Date;
  lastModified: Date;
}

interface HistoryEntry {
  circuitId: string;
  gates: Gate[];
  timestamp: Date;
}

export function useCircuitWorkspace() {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [activeCircuitId, setActiveCircuitId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toast } = useToast();

  const createNewCircuit = useCallback(() => {
    const newCircuit: Circuit = {
      id: `circuit_${Date.now()}`,
      name: `Circuit ${circuits.length + 1}`,
      gates: [],
      qubits: 5,
      modified: false,
      created: new Date(),
      lastModified: new Date()
    };

    setCircuits(prev => [...prev, newCircuit]);
    setActiveCircuitId(newCircuit.id);
    
    // Add to history
    setHistory(prev => [...prev, {
      circuitId: newCircuit.id,
      gates: [],
      timestamp: new Date()
    }]);
    setHistoryIndex(prev => prev + 1);

    toast({
      title: "New circuit created",
      description: `Created ${newCircuit.name}`
    });
  }, [circuits.length, toast]);

  const selectCircuit = useCallback((circuitId: string) => {
    setActiveCircuitId(circuitId);
  }, []);

  const deleteCircuit = useCallback((circuitId: string) => {
    setCircuits(prev => prev.filter(c => c.id !== circuitId));
    if (activeCircuitId === circuitId) {
      setActiveCircuitId(null);
    }
    
    // Remove from history
    setHistory(prev => prev.filter(entry => entry.circuitId !== circuitId));
    
    toast({
      title: "Circuit deleted",
      description: "Circuit has been removed from workspace"
    });
  }, [activeCircuitId, toast]);

  const saveCircuit = useCallback((circuitId: string) => {
    setCircuits(prev => prev.map(circuit => 
      circuit.id === circuitId 
        ? { ...circuit, modified: false, lastModified: new Date() }
        : circuit
    ));
    
    toast({
      title: "Circuit saved",
      description: "Changes have been saved"
    });
  }, [toast]);

  const updateCircuitGates = useCallback((circuitId: string, gates: Gate[]) => {
    setCircuits(prev => prev.map(circuit => 
      circuit.id === circuitId 
        ? { ...circuit, gates, modified: true, lastModified: new Date() }
        : circuit
    ));

    // Add to history
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, {
        circuitId,
        gates: [...gates],
        timestamp: new Date()
      }];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0 && activeCircuitId) {
      const prevEntry = history[historyIndex - 1];
      if (prevEntry.circuitId === activeCircuitId) {
        setCircuits(prev => prev.map(circuit => 
          circuit.id === activeCircuitId 
            ? { ...circuit, gates: [...prevEntry.gates], modified: true }
            : circuit
        ));
        setHistoryIndex(prev => prev - 1);
      }
    }
  }, [historyIndex, history, activeCircuitId]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1 && activeCircuitId) {
      const nextEntry = history[historyIndex + 1];
      if (nextEntry.circuitId === activeCircuitId) {
        setCircuits(prev => prev.map(circuit => 
          circuit.id === activeCircuitId 
            ? { ...circuit, gates: [...nextEntry.gates], modified: true }
            : circuit
        ));
        setHistoryIndex(prev => prev + 1);
      }
    }
  }, [historyIndex, history, activeCircuitId]);

  const exportCircuit = useCallback((format: string) => {
    console.log(`Exporting circuit in ${format} format`);
    // Export logic would be implemented here
  }, []);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    circuits,
    activeCircuitId,
    createNewCircuit,
    selectCircuit,
    deleteCircuit,
    saveCircuit,
    updateCircuitGates,
    undo,
    redo,
    canUndo,
    canRedo,
    exportCircuit
  };
}
