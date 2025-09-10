import { useState, useCallback, useEffect } from 'react';
import { EnhancedQuantumSimulator, QuantumGateOp, EnhancedSimulationResult } from '@/lib/enhancedQuantumSimulator';
import { exportToOpenQASM } from '@/lib/unified-export/enhanced-openqasm-exporter';
import { EnhancedJavaScriptExporter } from '@/lib/unified-export/enhanced-javascript-exporter';
import { toast } from 'sonner';

export interface EnhancedCircuit {
  id: string;
  name: string;
  qubits: number;
  gates: QuantumGateOp[];
  createdAt: Date;
  modifiedAt: Date;
  shots: number;
}

export interface CircuitValidationError {
  gateId: string;
  message: string;
  severity: 'error' | 'warning';
}

export function useEnhancedCircuitBuilder(initialQubits: number = 5) {
  const [circuit, setCircuit] = useState<EnhancedCircuit>(() => ({
    id: `circuit_${Date.now()}`,
    name: 'New Circuit',
    qubits: initialQubits,
    gates: [],
    createdAt: new Date(),
    modifiedAt: new Date(),
    shots: 1024
  }));

  const [selectedGate, setSelectedGate] = useState<QuantumGateOp | null>(null);
  const [simulationResult, setSimulationResult] = useState<EnhancedSimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<CircuitValidationError[]>([]);
  const [circuitHistory, setCircuitHistory] = useState<EnhancedCircuit[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Initialize simulator
  const [simulator] = useState(() => new EnhancedQuantumSimulator({
    numQubits: initialQubits,
    shots: 1024,
    sparseMode: true,
    maxMemory: 2000, // 2GB limit
    enableNoise: false,
    noiseLevel: 0
  }));

  // Update simulator when circuit changes
  useEffect(() => {
    if (circuit.qubits !== simulator['config'].numQubits) {
      // Reinitialize simulator with new qubit count
      const newSimulator = new EnhancedQuantumSimulator({
        numQubits: circuit.qubits,
        shots: circuit.shots,
        sparseMode: true,
        maxMemory: 2000,
        enableNoise: false,
        noiseLevel: 0
      });
      Object.assign(simulator, newSimulator);
    }
  }, [circuit.qubits, circuit.shots, simulator]);

  // Save to history
  const saveToHistory = useCallback((newCircuit: EnhancedCircuit) => {
    setCircuitHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ ...newCircuit });
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Add gate to circuit
  const addGate = useCallback((gateType: string, qubits: number[], options: {
    angle?: number;
    control?: number;
    target?: number;
    position?: number;
    params?: number[];
  } = {}) => {
    console.log('🔧 Adding gate:', { gateType, qubits, options });

    const newGate: QuantumGateOp = {
      id: `gate_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: gateType,
      qubits,
      control: options.control,
      target: options.target,
      angle: options.angle,
      params: options.params,
      position: options.position ?? circuit.gates.length
    };

    const newCircuit = {
      ...circuit,
      gates: [...circuit.gates, newGate],
      modifiedAt: new Date()
    };

    setCircuit(newCircuit);
    saveToHistory(newCircuit);
    validateCircuit(newCircuit);
    
    toast.success(`${gateType} gate added to circuit`);
  }, [circuit, saveToHistory]);

  // Remove gate from circuit
  const removeGate = useCallback((gateId: string) => {
    const newCircuit = {
      ...circuit,
      gates: circuit.gates.filter(gate => gate.id !== gateId),
      modifiedAt: new Date()
    };

    setCircuit(newCircuit);
    saveToHistory(newCircuit);
    validateCircuit(newCircuit);
    
    if (selectedGate?.id === gateId) {
      setSelectedGate(null);
    }
    
    toast.success('Gate removed from circuit');
  }, [circuit, saveToHistory, selectedGate]);

  // Update gate parameters
  const updateGate = useCallback((gateId: string, updates: Partial<QuantumGateOp>) => {
    const newCircuit = {
      ...circuit,
      gates: circuit.gates.map(gate => 
        gate.id === gateId ? { ...gate, ...updates } : gate
      ),
      modifiedAt: new Date()
    };

    setCircuit(newCircuit);
    saveToHistory(newCircuit);
    validateCircuit(newCircuit);
    
    if (selectedGate?.id === gateId) {
      setSelectedGate({ ...selectedGate, ...updates });
    }
    
    toast.success('Gate updated');
  }, [circuit, saveToHistory, selectedGate]);

  // Move gate to new position
  const moveGate = useCallback((gateId: string, newPosition: number, newQubits?: number[]) => {
    const updates: Partial<QuantumGateOp> = { position: newPosition };
    if (newQubits) {
      updates.qubits = newQubits;
    }
    updateGate(gateId, updates);
  }, [updateGate]);

  // Add/remove qubits
  const setQubitCount = useCallback((count: number) => {
    if (count < 1 || count > 50) {
      toast.error('Qubit count must be between 1 and 50');
      return;
    }

    const newCircuit = {
      ...circuit,
      qubits: count,
      // Filter out gates that target non-existent qubits
      gates: circuit.gates.filter(gate => 
        gate.qubits.every(q => q < count)
      ),
      modifiedAt: new Date()
    };

    setCircuit(newCircuit);
    saveToHistory(newCircuit);
    validateCircuit(newCircuit);
    
    toast.success(`Circuit resized to ${count} qubits`);
  }, [circuit, saveToHistory]);

  // Validate circuit
  const validateCircuit = useCallback((circuitToValidate: EnhancedCircuit) => {
    const validation = simulator.validateCircuit(circuitToValidate.gates);
    
    const errors: CircuitValidationError[] = [
      ...validation.errors.map(error => ({
        gateId: 'unknown',
        message: error,
        severity: 'error' as const
      })),
      ...validation.warnings.map(warning => ({
        gateId: 'unknown',
        message: warning,
        severity: 'warning' as const
      }))
    ];

    setValidationErrors(errors);
    return validation;
  }, [simulator]);

  // Simulate circuit
  const simulateCircuit = useCallback(async () => {
    if (circuit.gates.length === 0) {
      toast.error('Cannot simulate empty circuit');
      return;
    }

    setIsSimulating(true);
    
    try {
      console.log('🚀 Starting enhanced circuit simulation...');
      const result = await simulator.simulate(circuit.gates);
      setSimulationResult(result);
      
      if (result.validation.isValid) {
        toast.success(`Simulation completed in ${result.executionTime.toFixed(1)}ms`);
      } else {
        toast.warning('Simulation completed with validation warnings');
      }
      
      return result;
    } catch (error) {
      console.error('Simulation failed:', error);
      toast.error(`Simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsSimulating(false);
    }
  }, [circuit, simulator]);

  // Export circuit to various formats
  const exportCircuit = useCallback(async (format: 'openqasm' | 'json' | 'javascript'): Promise<string> => {
    console.log(`📤 Exporting circuit to ${format}...`);
    
    try {
      switch (format) {
        case 'openqasm':
          return exportToOpenQASM(circuit, {
            includeComments: true,
            includeHeaders: true,
            includeMeasurements: true
          });
        
        case 'json':
          return JSON.stringify({
            name: circuit.name,
            qubits: circuit.qubits,
            shots: circuit.shots,
            gates: circuit.gates.map(gate => ({
              id: gate.id,
              type: gate.type,
              qubits: gate.qubits,
              control: gate.control,
              target: gate.target,
              angle: gate.angle,
              params: gate.params,
              position: gate.position
            })),
            metadata: {
              createdAt: circuit.createdAt.toISOString(),
              modifiedAt: circuit.modifiedAt.toISOString(),
              version: '1.0.0',
              generator: 'QOSim Enhanced'
            }
          }, null, 2);
        
        case 'javascript':
          return EnhancedJavaScriptExporter.exportToJS(circuit, {
            framework: 'qosim-sdk',
            includeComments: true,
            useES6: true,
            asyncExecution: true
          });
        
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error(`Export to ${format} failed:`, error);
      throw new Error(`Failed to export to ${format}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [circuit]);

  // Import circuit
  const importCircuit = useCallback(async (data: string, format: 'json' | 'openqasm') => {
    try {
      let importedCircuit: Partial<EnhancedCircuit>;
      
      if (format === 'json') {
        const parsed = JSON.parse(data);
        importedCircuit = {
          name: parsed.name || 'Imported Circuit',
          qubits: parsed.qubits || 5,
          shots: parsed.shots || 1024,
          gates: parsed.gates || []
        };
      } else {
        // OpenQASM import (simplified - would need full parser)
        throw new Error('OpenQASM import not yet implemented');
      }

      const newCircuit: EnhancedCircuit = {
        id: `circuit_${Date.now()}`,
        createdAt: new Date(),
        modifiedAt: new Date(),
        ...importedCircuit
      } as EnhancedCircuit;

      setCircuit(newCircuit);
      saveToHistory(newCircuit);
      validateCircuit(newCircuit);
      
      toast.success('Circuit imported successfully');
    } catch (error) {
      console.error('Import failed:', error);
      toast.error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [saveToHistory]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevCircuit = circuitHistory[historyIndex - 1];
      setCircuit(prevCircuit);
      setHistoryIndex(historyIndex - 1);
      validateCircuit(prevCircuit);
      toast.success('Undo successful');
    }
  }, [circuitHistory, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < circuitHistory.length - 1) {
      const nextCircuit = circuitHistory[historyIndex + 1];
      setCircuit(nextCircuit);
      setHistoryIndex(historyIndex + 1);
      validateCircuit(nextCircuit);
      toast.success('Redo successful');
    }
  }, [circuitHistory, historyIndex]);

  // Clear circuit
  const clearCircuit = useCallback(() => {
    const newCircuit: EnhancedCircuit = {
      id: `circuit_${Date.now()}`,
      name: 'New Circuit',
      qubits: circuit.qubits,
      gates: [],
      createdAt: new Date(),
      modifiedAt: new Date(),
      shots: 1024
    };

    setCircuit(newCircuit);
    saveToHistory(newCircuit);
    setSelectedGate(null);
    setSimulationResult(null);
    setValidationErrors([]);
    
    toast.success('Circuit cleared');
  }, [circuit.qubits, saveToHistory]);

  // Save circuit
  const saveCircuit = useCallback(async (name?: string) => {
    const updatedCircuit = {
      ...circuit,
      name: name || circuit.name,
      modifiedAt: new Date()
    };
    
    setCircuit(updatedCircuit);
    
    // Here you could save to localStorage, Supabase, etc.
    localStorage.setItem(`qosim_circuit_${updatedCircuit.id}`, JSON.stringify(updatedCircuit));
    
    toast.success('Circuit saved');
    return updatedCircuit;
  }, [circuit]);

  // Load circuit
  const loadCircuit = useCallback(async (circuitId: string) => {
    try {
      const saved = localStorage.getItem(`qosim_circuit_${circuitId}`);
      if (saved) {
        const loadedCircuit = JSON.parse(saved);
        setCircuit(loadedCircuit);
        saveToHistory(loadedCircuit);
        validateCircuit(loadedCircuit);
        toast.success('Circuit loaded');
      } else {
        toast.error('Circuit not found');
      }
    } catch (error) {
      toast.error('Failed to load circuit');
    }
  }, [saveToHistory]);

  return {
    // State
    circuit,
    selectedGate,
    simulationResult,
    isSimulating,
    validationErrors,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < circuitHistory.length - 1,

    // Actions
    addGate,
    removeGate,
    updateGate,
    moveGate,
    setQubitCount,
    selectGate: setSelectedGate,
    clearSelection: () => setSelectedGate(null),
    simulateCircuit,
    exportCircuit,
    importCircuit,
    undo,
    redo,
    clearCircuit,
    saveCircuit,
    loadCircuit,
    validateCircuit: () => validateCircuit(circuit)
  };
}