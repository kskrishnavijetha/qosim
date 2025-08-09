
import { useState, useCallback, useRef, useEffect } from 'react';
import { Complex } from '@/services/complexNumbers';

export interface ClassicalNode {
  id: string;
  type: 'AND' | 'OR' | 'NOT' | 'CLOCK' | 'COMPARATOR' | 'REGISTER';
  position: { x: number; y: number };
  inputs: string[];
  outputs: string[];
  value: boolean | number;
  config: Record<string, any>;
}

export interface QuantumGate {
  id: string;
  type: string;
  qubit: number;
  controlledBy?: string;
  parameters?: Record<string, number>;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  type: 'classical-to-quantum' | 'quantum-to-classical';
  signal?: {
    active: boolean;
    strength: number;
    latency: number;
  };
}

export interface HybridSimulationState {
  isRunning: boolean;
  isPaused: boolean;
  currentStep: number;
  totalSteps: number;
  classicalState: {
    nodes: ClassicalNode[];
    signals: Record<string, boolean | number>;
  };
  quantumState: {
    gates: QuantumGate[];
    qubits: number[];
    stateVector: Complex[];
    measurements: Record<string, number>;
  };
  signalFlow: {
    activeSignals: Array<{
      id: string;
      from: string;
      to: string;
      progress: number;
      value: boolean | number;
    }>;
  };
  connections: Connection[];
  metrics: {
    quantumGateDepth: number;
    classicalExecutionTime: number;
    totalLatency: number;
    errorRate: number;
    coherenceTime: number;
  };
  educationalContent: {
    currentExplanation: string;
    stepDescription: string;
    whatIsHappening: string[];
  };
}

export function useHybridSimulation() {
  const [state, setState] = useState<HybridSimulationState>({
    isRunning: false,
    isPaused: false,
    currentStep: 0,
    totalSteps: 100,
    classicalState: {
      nodes: [
        {
          id: 'clock-1',
          type: 'CLOCK',
          position: { x: 50, y: 100 },
          inputs: [],
          outputs: ['clock-out'],
          value: false,
          config: { frequency: 1 }
        },
        {
          id: 'and-1',
          type: 'AND',
          position: { x: 200, y: 150 },
          inputs: ['in1', 'in2'],
          outputs: ['and-out'],
          value: false,
          config: {}
        }
      ],
      signals: {
        'clock-out': false,
        'and-out': false
      }
    },
    quantumState: {
      gates: [
        {
          id: 'h-gate-1',
          type: 'H',
          qubit: 0,
          controlledBy: 'clock-out'
        },
        {
          id: 'cnot-gate-1',
          type: 'CNOT',
          qubit: 1,
          controlledBy: 'and-out'
        }
      ],
      qubits: [0, 1, 2, 3, 4],
      stateVector: [],
      measurements: {}
    },
    signalFlow: {
      activeSignals: []
    },
    connections: [
      {
        id: 'conn-1',
        from: 'clock-1',
        to: 'h-gate-1',
        type: 'classical-to-quantum',
        signal: { active: false, strength: 1, latency: 0.1 }
      }
    ],
    metrics: {
      quantumGateDepth: 2,
      classicalExecutionTime: 0,
      totalLatency: 0,
      errorRate: 0,
      coherenceTime: 100
    },
    educationalContent: {
      currentExplanation: 'Hybrid simulation ready to start.',
      stepDescription: 'Classical and quantum systems are initialized.',
      whatIsHappening: [
        'Classical logic nodes are in their initial states',
        'Quantum qubits are in |0⟩ ground state',
        'No signals are currently flowing'
      ]
    }
  });

  const intervalRef = useRef<NodeJS.Timeout>();

  const startSimulation = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: true, isPaused: false }));
    
    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.currentStep >= prev.totalSteps) {
          return { ...prev, isRunning: false };
        }

        // Simulate step execution
        const newStep = prev.currentStep + 1;
        const clockActive = Math.floor(newStep / 10) % 2 === 0;
        
        // Update classical signals
        const newClassicalState = {
          ...prev.classicalState,
          signals: {
            ...prev.classicalState.signals,
            'clock-out': clockActive,
            'and-out': clockActive && prev.classicalState.signals['clock-out']
          }
        };

        // Generate active signals for visualization
        const activeSignals = prev.connections
          .filter(conn => {
            const signal = conn.signal;
            return signal?.active || Math.random() > 0.7;
          })
          .map(conn => ({
            id: `signal-${conn.id}-${newStep}`,
            from: conn.from,
            to: conn.to,
            progress: Math.random(),
            value: newClassicalState.signals[conn.from] || false
          }));

        // Update educational content
        const educationalContent = {
          currentExplanation: `Step ${newStep}: ${clockActive ? 'Clock signal is HIGH' : 'Clock signal is LOW'}`,
          stepDescription: clockActive ? 'Classical clock triggers quantum operations' : 'System in idle state',
          whatIsHappening: [
            `Classical clock output: ${clockActive ? 'HIGH' : 'LOW'}`,
            `Quantum H gate: ${clockActive ? 'ACTIVE' : 'IDLE'}`,
            `Signal propagation delay: ${prev.connections[0]?.signal?.latency || 0}ms`
          ]
        };

        return {
          ...prev,
          currentStep: newStep,
          classicalState: newClassicalState,
          signalFlow: { activeSignals },
          educationalContent,
          metrics: {
            ...prev.metrics,
            classicalExecutionTime: newStep * 0.1,
            totalLatency: newStep * 0.05
          }
        };
      });
    }, 100);
  }, []);

  const pauseSimulation = useCallback(() => {
    setState(prev => ({ ...prev, isPaused: true }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const stopSimulation = useCallback(() => {
    setState(prev => ({ ...prev, isRunning: false, isPaused: false }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const stepForward = useCallback(() => {
    setState(prev => {
      if (prev.currentStep >= prev.totalSteps) return prev;
      
      const newStep = prev.currentStep + 1;
      return {
        ...prev,
        currentStep: newStep,
        educationalContent: {
          ...prev.educationalContent,
          currentExplanation: `Manual step ${newStep} executed`
        }
      };
    });
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState(prev => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      currentStep: 0,
      signalFlow: { activeSignals: [] },
      classicalState: {
        ...prev.classicalState,
        signals: Object.keys(prev.classicalState.signals).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {} as Record<string, boolean | number>)
      },
      educationalContent: {
        currentExplanation: 'Simulation reset to initial state.',
        stepDescription: 'All systems returned to ground state.',
        whatIsHappening: [
          'Classical signals reset to LOW',
          'Quantum qubits reset to |0⟩',
          'Ready for new simulation run'
        ]
      }
    }));
  }, []);

  const addConnection = useCallback((from: string, to: string, type: Connection['type']) => {
    setState(prev => ({
      ...prev,
      connections: [
        ...prev.connections,
        {
          id: `conn-${Date.now()}`,
          from,
          to,
          type,
          signal: { active: false, strength: 1, latency: 0.1 }
        }
      ]
    }));
  }, []);

  const removeConnection = useCallback((connectionId: string) => {
    setState(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId)
    }));
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    currentStep: state.currentStep,
    totalSteps: state.totalSteps,
    classicalState: state.classicalState,
    quantumState: state.quantumState,
    signalFlow: state.signalFlow,
    connections: state.connections,
    metrics: state.metrics,
    educationalContent: state.educationalContent,
    startSimulation,
    pauseSimulation,
    stopSimulation,
    stepForward,
    reset,
    addConnection,
    removeConnection
  };
}
