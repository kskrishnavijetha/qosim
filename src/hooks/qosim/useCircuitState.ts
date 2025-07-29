
import { useState, useCallback, useRef } from 'react';
import { type QuantumGate, type QuantumCircuit } from '@/types/qosim';
import { toast } from 'sonner';

export function useCircuitState() {
  const [circuit, setCircuit] = useState<QuantumGate[]>([]);
  const [history, setHistory] = useState<QuantumGate[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [savedCircuits, setSavedCircuits] = useState<QuantumCircuit[]>([]);
  const lastActionRef = useRef<string>('');

  const addToHistory = useCallback((newCircuit: QuantumGate[], action: string) => {
    if (lastActionRef.current === action) return;
    
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newCircuit);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    lastActionRef.current = action;
  }, [history, historyIndex]);

  const addGate = useCallback((gate: QuantumGate) => {
    const newCircuit = [...circuit, gate];
    setCircuit(newCircuit);
    addToHistory(newCircuit, 'addGate');
  }, [circuit, addToHistory]);

  const removeGate = useCallback((gateId: string) => {
    const newCircuit = circuit.filter(g => g.id !== gateId);
    setCircuit(newCircuit);
    addToHistory(newCircuit, 'removeGate');
  }, [circuit, addToHistory]);

  const updateGate = useCallback((gateId: string, updates: Partial<QuantumGate>) => {
    const newCircuit = circuit.map(gate =>
      gate.id === gateId ? { ...gate, ...updates } : gate
    );
    setCircuit(newCircuit);
    addToHistory(newCircuit, 'updateGate');
  }, [circuit, addToHistory]);

  const clearCircuit = useCallback(() => {
    setCircuit([]);
    addToHistory([], 'clearCircuit');
  }, [addToHistory]);

  const undoAction = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCircuit(history[newIndex]);
      lastActionRef.current = 'undo';
    }
  }, [history, historyIndex]);

  const redoAction = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCircuit(history[newIndex]);
      lastActionRef.current = 'redo';
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const saveCircuit = useCallback(async (name: string) => {
    const newCircuit: QuantumCircuit = {
      id: `circuit_${Date.now()}`,
      name,
      gates: [...circuit],
      qubits: Math.max(...circuit.map(g => Math.max(...g.qubits)), 0) + 1,
      depth: Math.max(...circuit.map(g => g.position.x / 60), 0),
      created: new Date(),
      modified: new Date(),
      version: '1.0.0',
      metadata: {
        tags: [],
        author: 'QOSim User'
      }
    };
    
    setSavedCircuits(prev => [...prev, newCircuit]);
  }, [circuit]);

  const loadCircuit = useCallback(async (circuitId: string) => {
    const savedCircuit = savedCircuits.find(c => c.id === circuitId);
    if (savedCircuit) {
      setCircuit(savedCircuit.gates);
      addToHistory(savedCircuit.gates, 'loadCircuit');
    }
  }, [savedCircuits, addToHistory]);

  const exportCircuit = useCallback(async (format: string): Promise<string> => {
    switch (format) {
      case 'json':
        return JSON.stringify({
          gates: circuit,
          qubits: Math.max(...circuit.map(g => Math.max(...g.qubits)), 0) + 1,
          depth: Math.max(...circuit.map(g => g.position.x / 60), 0)
        }, null, 2);
        
      case 'qasm':
        let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n\n';
        const qubits = Math.max(...circuit.map(g => Math.max(...g.qubits)), 0) + 1;
        qasm += `qreg q[${qubits}];\ncreg c[${qubits}];\n\n`;
        
        circuit.forEach(gate => {
          switch (gate.type) {
            case 'H':
              qasm += `h q[${gate.qubits[0]}];\n`;
              break;
            case 'X':
              qasm += `x q[${gate.qubits[0]}];\n`;
              break;
            case 'CNOT':
              qasm += `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];\n`;
              break;
          }
        });
        return qasm;
        
      case 'python':
        let python = 'from qiskit import QuantumCircuit\n\n';
        const pyQubits = Math.max(...circuit.map(g => Math.max(...g.qubits)), 0) + 1;
        python += `qc = QuantumCircuit(${pyQubits})\n\n`;
        
        circuit.forEach(gate => {
          switch (gate.type) {
            case 'H':
              python += `qc.h(${gate.qubits[0]})\n`;
              break;
            case 'X':
              python += `qc.x(${gate.qubits[0]})\n`;
              break;
            case 'CNOT':
              python += `qc.cx(${gate.qubits[0]}, ${gate.qubits[1]})\n`;
              break;
          }
        });
        return python;
        
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }, [circuit]);

  const importCircuit = useCallback(async (data: string, format: string) => {
    let importedGates: QuantumGate[] = [];
    
    try {
      switch (format) {
        case 'json':
          const parsed = JSON.parse(data);
          importedGates = parsed.gates || [];
          break;
          
        case 'qasm':
          // Simple QASM parser
          const lines = data.split('\n');
          let gateId = 0;
          
          lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('h q[')) {
              const qubit = parseInt(trimmed.match(/q\[(\d+)\]/)?.[1] || '0');
              importedGates.push({
                id: `gate_${gateId++}`,
                type: 'H',
                qubits: [qubit],
                position: { x: gateId * 60, y: qubit * 60 },
                metadata: { timestamp: Date.now() }
              });
            }
          });
          break;
      }
      
      setCircuit(importedGates);
      addToHistory(importedGates, 'importCircuit');
    } catch (error) {
      throw new Error(`Failed to import ${format}: ${error}`);
    }
  }, [addToHistory]);

  return {
    circuit,
    history,
    savedCircuits,
    addGate,
    removeGate,
    updateGate,
    clearCircuit,
    undoAction,
    redoAction,
    canUndo,
    canRedo,
    saveCircuit,
    loadCircuit,
    exportCircuit,
    importCircuit
  };
}
