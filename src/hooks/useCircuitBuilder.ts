
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { optimizedQuantumSimulator } from '@/lib/quantumSimulatorOptimized';
import type { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';

export interface QuantumGate {
  id: string;
  type: string;
  qubits: number[];
  layer: number;
  position: { x: number; y: number };
  angle?: number;
  params?: number[];
  label?: string;
  comment?: string;
}

export interface DragState {
  isDragging: boolean;
  gateType: string;
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  targetQubit?: number;
  targetLayer?: number;
}

export interface CircuitHistory {
  circuit: QuantumGate[];
  timestamp: number;
  action: string;
}

export function useCircuitBuilder() {
  const [circuit, setCircuit] = useState<QuantumGate[]>([]);
  const [history, setHistory] = useState<CircuitHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    gateType: '',
    startPosition: { x: 0, y: 0 },
    currentPosition: { x: 0, y: 0 }
  });
  const [simulationResult, setSimulationResult] = useState<OptimizedSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedGates, setSelectedGates] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [clipboard, setClipboard] = useState<QuantumGate[]>([]);
  
  const { toast } = useToast();
  const simulationRef = useRef<AbortController | null>(null);

  // Add to history
  const addToHistory = useCallback((action: string, newCircuit: QuantumGate[]) => {
    const newHistory: CircuitHistory = {
      circuit: JSON.parse(JSON.stringify(newCircuit)),
      timestamp: Date.now(),
      action
    };
    
    setHistory(prev => [...prev.slice(0, historyIndex + 1), newHistory]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Add gate
  const addGate = useCallback((gate: Omit<QuantumGate, 'id'>) => {
    const newGate: QuantumGate = {
      ...gate,
      id: `gate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    const newCircuit = [...circuit, newGate];
    setCircuit(newCircuit);
    addToHistory('Add Gate', newCircuit);
    
    toast({
      title: "Gate Added",
      description: `${gate.type} gate added to circuit`
    });
  }, [circuit, addToHistory, toast]);

  // Delete gate
  const deleteGate = useCallback((gateId: string) => {
    const newCircuit = circuit.filter(gate => gate.id !== gateId);
    setCircuit(newCircuit);
    addToHistory('Delete Gate', newCircuit);
    
    toast({
      title: "Gate Deleted",
      description: "Gate removed from circuit"
    });
  }, [circuit, addToHistory, toast]);

  // Move gate
  const moveGate = useCallback((gateId: string, newPosition: { x: number; y: number }, newLayer?: number) => {
    const newCircuit = circuit.map(gate => 
      gate.id === gateId 
        ? { ...gate, position: newPosition, layer: newLayer ?? gate.layer }
        : gate
    );
    setCircuit(newCircuit);
    addToHistory('Move Gate', newCircuit);
  }, [circuit, addToHistory]);

  // Copy gates
  const copyGates = useCallback(() => {
    const gatesToCopy = circuit.filter(gate => selectedGates.includes(gate.id));
    setClipboard(gatesToCopy);
    
    toast({
      title: "Gates Copied",
      description: `${gatesToCopy.length} gates copied to clipboard`
    });
  }, [circuit, selectedGates, toast]);

  // Paste gates
  const pasteGates = useCallback(() => {
    if (clipboard.length === 0) return;
    
    const pastedGates = clipboard.map(gate => ({
      ...gate,
      id: `gate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: { x: gate.position.x + 50, y: gate.position.y + 50 }
    }));
    
    const newCircuit = [...circuit, ...pastedGates];
    setCircuit(newCircuit);
    addToHistory('Paste Gates', newCircuit);
    
    toast({
      title: "Gates Pasted",
      description: `${pastedGates.length} gates pasted`
    });
  }, [circuit, clipboard, addToHistory, toast]);

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCircuit(history[historyIndex - 1].circuit);
      
      toast({
        title: "Undo",
        description: `Undid: ${history[historyIndex].action}`
      });
    }
  }, [history, historyIndex, toast]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCircuit(history[historyIndex + 1].circuit);
      
      toast({
        title: "Redo",
        description: `Redid: ${history[historyIndex + 1].action}`
      });
    }
  }, [history, historyIndex, toast]);

  // Clear circuit
  const clearCircuit = useCallback(() => {
    setCircuit([]);
    addToHistory('Clear Circuit', []);
    setSelectedGates([]);
    
    toast({
      title: "Circuit Cleared",
      description: "All gates removed from circuit"
    });
  }, [addToHistory, toast]);

  // Select gate
  const selectGate = useCallback((gateId: string, addToSelection = false) => {
    if (addToSelection) {
      setSelectedGates(prev => 
        prev.includes(gateId) 
          ? prev.filter(id => id !== gateId)
          : [...prev, gateId]
      );
    } else {
      setSelectedGates([gateId]);
    }
  }, []);

  // Deselect all
  const deselectAll = useCallback(() => {
    setSelectedGates([]);
  }, []);

  // Simulation functions
  const startSimulation = useCallback(async () => {
    if (circuit.length === 0) {
      toast({
        title: "No Circuit",
        description: "Add gates to simulate the circuit",
        variant: "destructive"
      });
      return;
    }

    setIsSimulating(true);
    simulationRef.current = new AbortController();
    
    try {
      // Convert circuit to simulator format
      const gates = circuit.map(gate => ({
        id: gate.id,
        type: gate.type,
        qubit: gate.qubits[0],
        qubits: gate.qubits,
        position: gate.layer,
        angle: gate.angle,
        params: gate.params
      }));
      
      const result = await optimizedQuantumSimulator.simulateAsync(gates);
      setSimulationResult(result);
      
      toast({
        title: "Simulation Complete",
        description: `Simulated ${circuit.length} gates successfully`
      });
    } catch (error) {
      toast({
        title: "Simulation Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setIsSimulating(false);
      simulationRef.current = null;
    }
  }, [circuit, toast]);

  const pauseSimulation = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.abort();
      setIsSimulating(false);
    }
  }, []);

  const resetSimulation = useCallback(() => {
    setSimulationResult(null);
    setIsSimulating(false);
    if (simulationRef.current) {
      simulationRef.current.abort();
    }
  }, []);

  // Drag and drop handlers
  const handleDragStart = useCallback((gateType: string, startPosition: { x: number; y: number }) => {
    setDragState({
      isDragging: true,
      gateType,
      startPosition,
      currentPosition: startPosition
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      isDragging: false
    }));
  }, []);

  // Export circuit
  const exportCircuit = useCallback((format: 'qasm' | 'python' | 'javascript' | 'json') => {
    // Implementation will be added in ExportPanel
    toast({
      title: "Export Started",
      description: `Exporting circuit in ${format} format`
    });
  }, [toast]);

  // Import circuit
  const importCircuit = useCallback((circuitData: any, format: 'qasm' | 'python' | 'javascript' | 'json') => {
    // Implementation will be added in ImportPanel
    toast({
      title: "Import Started",
      description: `Importing circuit from ${format} format`
    });
  }, [toast]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    circuit,
    history,
    dragState,
    simulationResult,
    isSimulating,
    selectedGates,
    zoom,
    pan,
    clipboard,
    canUndo,
    canRedo,
    addGate,
    deleteGate,
    moveGate,
    copyGates,
    pasteGates,
    undo,
    redo,
    clearCircuit,
    selectGate,
    deselectAll,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    setZoom,
    setPan,
    handleDragStart,
    handleDragEnd,
    exportCircuit,
    importCircuit
  };
}
