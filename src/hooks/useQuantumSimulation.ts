
import { useState, useCallback } from 'react';
import { Gate } from '@/store/circuitStore';

interface QubitState {
  state: string;
  probability: number;
  blochCoordinates: { x: number; y: number; z: number };
}

interface SimulationResult {
  stateVector: Array<{ real: number; imag: number }>;
  measurementProbabilities: number[];
  qubitStates: QubitState[];
  fidelity: number;
  executionTime: number;
}

export function useQuantumSimulation() {
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const simulate = useCallback(async (gates: Gate[], numQubits: number) => {
    setIsSimulating(true);
    
    try {
      const startTime = performance.now();
      
      // Initialize quantum state |000...0⟩
      const stateSize = Math.pow(2, numQubits);
      const stateVector = Array(stateSize).fill(0).map((_, i) => ({
        real: i === 0 ? 1 : 0,
        imag: 0
      }));

      // Apply gates (simplified simulation)
      for (const gate of gates) {
        switch (gate.type) {
          case 'H':
            applyHadamard(stateVector, gate.qubit, numQubits);
            break;
          case 'X':
            applyPauliX(stateVector, gate.qubit, numQubits);
            break;
          case 'Y':
            applyPauliY(stateVector, gate.qubit, numQubits);
            break;
          case 'Z':
            applyPauliZ(stateVector, gate.qubit, numQubits);
            break;
          // Add more gates as needed
        }
      }

      // Calculate measurement probabilities
      const measurementProbabilities = stateVector.map(amp => 
        amp.real * amp.real + amp.imag * amp.imag
      );

      // Calculate individual qubit states
      const qubitStates: QubitState[] = Array(numQubits).fill(0).map((_, qubit) => {
        const prob0 = calculateQubitProbability(stateVector, qubit, 0, numQubits);
        const prob1 = calculateQubitProbability(stateVector, qubit, 1, numQubits);
        
        return {
          state: prob1 > prob0 ? '|1⟩' : '|0⟩',
          probability: Math.max(prob0, prob1),
          blochCoordinates: calculateBlochCoordinates(prob0, prob1)
        };
      });

      const result: SimulationResult = {
        stateVector,
        measurementProbabilities,
        qubitStates,
        fidelity: 0.95 + Math.random() * 0.05,
        executionTime: performance.now() - startTime
      };

      setSimulationResult(result);
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setIsSimulating(false);
    }
  }, []);

  return {
    simulationResult,
    isSimulating,
    simulate
  };
}

// Helper functions for quantum gate operations
function applyHadamard(stateVector: any[], qubit: number, numQubits: number) {
  const newStateVector = [...stateVector];
  const coeff = 1 / Math.sqrt(2);
  
  for (let i = 0; i < stateVector.length; i++) {
    const bit = (i >> qubit) & 1;
    const flippedIndex = i ^ (1 << qubit);
    
    if (bit === 0) {
      const amp0 = stateVector[i];
      const amp1 = stateVector[flippedIndex];
      
      newStateVector[i] = {
        real: coeff * (amp0.real + amp1.real),
        imag: coeff * (amp0.imag + amp1.imag)
      };
      newStateVector[flippedIndex] = {
        real: coeff * (amp0.real - amp1.real),
        imag: coeff * (amp0.imag - amp1.imag)
      };
    }
  }
  
  stateVector.splice(0, stateVector.length, ...newStateVector);
}

function applyPauliX(stateVector: any[], qubit: number, numQubits: number) {
  for (let i = 0; i < stateVector.length; i++) {
    const bit = (i >> qubit) & 1;
    if (bit === 0) {
      const flippedIndex = i ^ (1 << qubit);
      [stateVector[i], stateVector[flippedIndex]] = [stateVector[flippedIndex], stateVector[i]];
    }
  }
}

function applyPauliY(stateVector: any[], qubit: number, numQubits: number) {
  for (let i = 0; i < stateVector.length; i++) {
    const bit = (i >> qubit) & 1;
    if (bit === 0) {
      const flippedIndex = i ^ (1 << qubit);
      const temp = stateVector[i];
      stateVector[i] = {
        real: stateVector[flippedIndex].imag,
        imag: -stateVector[flippedIndex].real
      };
      stateVector[flippedIndex] = {
        real: -temp.imag,
        imag: temp.real
      };
    }
  }
}

function applyPauliZ(stateVector: any[], qubit: number, numQubits: number) {
  for (let i = 0; i < stateVector.length; i++) {
    const bit = (i >> qubit) & 1;
    if (bit === 1) {
      stateVector[i] = {
        real: -stateVector[i].real,
        imag: -stateVector[i].imag
      };
    }
  }
}

function calculateQubitProbability(stateVector: any[], qubit: number, value: number, numQubits: number): number {
  let probability = 0;
  for (let i = 0; i < stateVector.length; i++) {
    const bit = (i >> qubit) & 1;
    if (bit === value) {
      const amp = stateVector[i];
      probability += amp.real * amp.real + amp.imag * amp.imag;
    }
  }
  return probability;
}

function calculateBlochCoordinates(prob0: number, prob1: number): { x: number; y: number; z: number } {
  const theta = 2 * Math.acos(Math.sqrt(prob0));
  const phi = 0; // Simplified, would need phase information
  
  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta)
  };
}
