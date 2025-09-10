
import { useState, useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import { quantumSimulator } from '@/lib/quantumSimulator';
import { qosmExporter } from '@/lib/qosmExporter';
import { qosmImporter } from '@/lib/qosmImporter';
import { useCircuitSharing } from '@/hooks/useCircuitSharing';
import { toast } from 'sonner';

export interface CircuitQubit {
  id: string;
  index: number;
  name: string;
  state: 'computational' | 'superposition' | 'entangled';
}

export interface CircuitGate {
  id: string;
  type: string;
  qubits: string[];
  position: { x: number; y: number };
  layer: number;
  params?: { [key: string]: any };
  metadata?: {
    label?: string;
    color?: string;
    angle?: number;
  };
}

export interface CircuitLayer {
  id: string;
  index: number;
  gates: CircuitGate[];
  barrier?: boolean;
}

export interface QuantumCircuit {
  id: string;
  name: string;
  description?: string;
  qubits: CircuitQubit[];
  gates: CircuitGate[];
  layers: CircuitLayer[];
  depth: number;
  metadata: {
    created: string;
    modified: string;
    version: string;
    author?: string;
  };
}

export interface CircuitSimulationResult {
  stateVector: Complex[];
  measurementProbabilities: number[];
  qubitStates: {
    qubit: string;
    state: string;
    amplitude: Complex;
    phase: number;
    probability: number;
  }[];
  entanglement: {
    pairs: string[][];
    strength: number;
  };
  fidelity: number;
  executionTime: number;
}

interface Complex {
  real: number;
  imag: number;
}

export function useCircuitBuilder() {
  const [circuit, setCircuit] = useState<QuantumCircuit>({
    id: nanoid(),
    name: 'Untitled Circuit',
    qubits: [
      { id: nanoid(), index: 0, name: 'q0', state: 'computational' },
      { id: nanoid(), index: 1, name: 'q1', state: 'computational' },
      { id: nanoid(), index: 2, name: 'q2', state: 'computational' }
    ],
    gates: [],
    layers: [],
    depth: 0,
    metadata: {
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      version: '1.0.0'
    }
  });

  const [selectedGate, setSelectedGate] = useState<CircuitGate | null>(null);
  const [simulationResult, setSimulationResult] = useState<CircuitSimulationResult | null>(null);
  const [circuitHistory, setCircuitHistory] = useState<QuantumCircuit[]>([circuit]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  const { saveCircuit: saveToCloud, loadCircuit: loadFromCloud } = useCircuitSharing();

  const updateCircuit = useCallback((newCircuit: QuantumCircuit) => {
    newCircuit.metadata.modified = new Date().toISOString();
    newCircuit.depth = calculateCircuitDepth(newCircuit);
    setCircuit(newCircuit);
    
    // Update history
    const newHistory = circuitHistory.slice(0, historyIndex + 1);
    newHistory.push(newCircuit);
    setCircuitHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [circuitHistory, historyIndex]);

  const calculateCircuitDepth = useCallback((circuit: QuantumCircuit): number => {
    if (circuit.gates.length === 0) return 0;
    return Math.max(...circuit.gates.map(gate => gate.layer)) + 1;
  }, []);

  const addQubit = useCallback(() => {
    const newQubit: CircuitQubit = {
      id: nanoid(),
      index: circuit.qubits.length,
      name: `q${circuit.qubits.length}`,
      state: 'computational'
    };
    
    updateCircuit({
      ...circuit,
      qubits: [...circuit.qubits, newQubit]
    });
  }, [circuit, updateCircuit]);

  const removeQubit = useCallback((qubitId: string) => {
    if (circuit.qubits.length <= 1) {
      toast.error('Cannot remove the last qubit');
      return;
    }

    const newQubits = circuit.qubits.filter(q => q.id !== qubitId);
    const newGates = circuit.gates.filter(gate => !gate.qubits.includes(qubitId));
    
    updateCircuit({
      ...circuit,
      qubits: newQubits,
      gates: newGates
    });
  }, [circuit, updateCircuit]);

  const addGate = useCallback((gateType: string, qubits: string[], position: { x: number; y: number }, controlTarget?: { control: number; target: number }) => {
    const layer = Math.floor(position.x / 100);
    
    const newGate: CircuitGate = {
      id: nanoid(),
      type: gateType,
      qubits,
      position,
      layer,
      params: getDefaultGateParams(gateType),
      metadata: {
        label: gateType,
        color: getGateColor(gateType)
      }
    };

    // Add control/target information for multi-qubit gates
    if (controlTarget && (gateType === 'CNOT' || gateType === 'CZ')) {
      newGate.params = {
        ...newGate.params,
        control: controlTarget.control,
        target: controlTarget.target
      };
    }
    
    updateCircuit({
      ...circuit,
      gates: [...circuit.gates, newGate]
    });
  }, [circuit, updateCircuit]);

  const removeGate = useCallback((gateId: string) => {
    const newGates = circuit.gates.filter(gate => gate.id !== gateId);
    updateCircuit({
      ...circuit,
      gates: newGates
    });
    
    if (selectedGate?.id === gateId) {
      setSelectedGate(null);
    }
  }, [circuit, selectedGate, updateCircuit]);

  const moveGate = useCallback((gateId: string, newPosition: { x: number; y: number }) => {
    const newLayer = Math.floor(newPosition.x / 100);
    const newGates = circuit.gates.map(gate => 
      gate.id === gateId 
        ? { ...gate, position: newPosition, layer: newLayer }
        : gate
    );
    
    updateCircuit({
      ...circuit,
      gates: newGates
    });
  }, [circuit, updateCircuit]);

  const updateGateParams = useCallback((gateId: string, params: { [key: string]: any }) => {
    const newGates = circuit.gates.map(gate => 
      gate.id === gateId 
        ? { ...gate, params: { ...gate.params, ...params } }
        : gate
    );
    
    updateCircuit({
      ...circuit,
      gates: newGates
    });
  }, [circuit, updateCircuit]);

  const selectGate = useCallback((gate: CircuitGate) => {
    setSelectedGate(gate);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedGate(null);
  }, []);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCircuit(circuitHistory[historyIndex - 1]);
    }
  }, [historyIndex, circuitHistory]);

  const redo = useCallback(() => {
    if (historyIndex < circuitHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCircuit(circuitHistory[historyIndex + 1]);
    }
  }, [historyIndex, circuitHistory]);

  const clearCircuit = useCallback(() => {
    const clearedCircuit: QuantumCircuit = {
      ...circuit,
      gates: [],
      layers: [],
      depth: 0
    };
    updateCircuit(clearedCircuit);
    setSelectedGate(null);
    setSimulationResult(null);
  }, [circuit, updateCircuit]);

  const saveCircuit = useCallback(async () => {
    try {
      await saveToCloud(circuit);
      toast.success('Circuit saved successfully');
    } catch (error) {
      toast.error('Failed to save circuit');
    }
  }, [circuit, saveToCloud]);

  const loadCircuit = useCallback(async (circuitData?: QuantumCircuit) => {
    try {
      if (circuitData) {
        updateCircuit(circuitData);
      } else {
        const loadedCircuit = await loadFromCloud();
        if (loadedCircuit) {
          updateCircuit(loadedCircuit);
        }
      }
      toast.success('Circuit loaded successfully');
    } catch (error) {
      toast.error('Failed to load circuit');
    }
  }, [updateCircuit, loadFromCloud]);

  const simulateCircuit = useCallback(async () => {
    try {
      // Convert circuit to quantum simulator format
      const quantumGates = circuit.gates.map(gate => ({
        id: gate.id,
        type: gate.type,
        qubit: gate.qubits[0] ? circuit.qubits.findIndex(q => q.id === gate.qubits[0]) : 0,
        qubits: gate.qubits.map(qId => circuit.qubits.findIndex(q => q.id === qId)),
        position: gate.layer,
        angle: gate.params?.angle || 0
      }));

      const result = quantumSimulator.simulate(quantumGates);
      
      const simulationResult: CircuitSimulationResult = {
        stateVector: result.stateVector,
        measurementProbabilities: result.measurementProbabilities,
        qubitStates: result.qubitStates.map(qs => ({
          qubit: circuit.qubits[qs.qubit]?.id || '',
          state: qs.state,
          amplitude: qs.amplitude,
          phase: qs.phase,
          probability: qs.probability
        })),
        entanglement: {
          pairs: [],
          strength: 0
        },
        fidelity: 1.0,
        executionTime: Date.now()
      };

      setSimulationResult(simulationResult);
      return simulationResult;
    } catch (error) {
      throw new Error('Simulation failed: ' + error);
    }
  }, [circuit]);

  const exportCircuit = useCallback(async (format: string) => {
    return qosmExporter.export(circuit, format);
  }, [circuit]);

  const importCircuit = useCallback(async (data: string, format: string) => {
    try {
      const importedCircuit = await qosmImporter.import(data, format);
      updateCircuit(importedCircuit);
      toast.success('Circuit imported successfully');
    } catch (error) {
      toast.error('Failed to import circuit');
    }
  }, [updateCircuit]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < circuitHistory.length - 1;

  return {
    circuit,
    selectedGate,
    simulationResult,
    circuitHistory,
    addQubit,
    removeQubit,
    addGate,
    removeGate,
    moveGate,
    updateGateParams,
    selectGate,
    clearSelection,
    undo,
    redo,
    clearCircuit,
    saveCircuit,
    loadCircuit,
    simulateCircuit,
    exportCircuit,
    importCircuit,
    canUndo,
    canRedo
  };
}

function getDefaultGateParams(gateType: string): { [key: string]: any } {
  switch (gateType) {
    case 'RX':
    case 'RY':
    case 'RZ':
      return { angle: Math.PI / 4 };
    case 'U1':
      return { lambda: 0 };
    case 'U2':
      return { phi: 0, lambda: Math.PI / 2 };
    case 'U3':
      return { theta: Math.PI / 2, phi: 0, lambda: Math.PI / 2 };
    default:
      return {};
  }
}

function getGateColor(gateType: string): string {
  const colors: { [key: string]: string } = {
    'H': '#FFD700',
    'X': '#FF6B6B',
    'Y': '#4ECDC4',
    'Z': '#45B7D1',
    'CNOT': '#96CEB4',
    'RX': '#FFEAA7',
    'RY': '#DDA0DD',
    'RZ': '#98D8C8',
    'S': '#F7DC6F',
    'T': '#BB8FCE',
    'SWAP': '#85C1E9',
    'TOFFOLI': '#F8C471'
  };
  return colors[gateType] || '#BDC3C7';
}
