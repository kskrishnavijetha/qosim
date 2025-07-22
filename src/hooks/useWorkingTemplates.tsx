import { useState, useCallback } from 'react';
import { Gate } from '@/hooks/useCircuitWorkspace';

export interface WorkingTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  category: string;
  gates: Omit<Gate, 'id'>[];
  expectedResults: {
    entanglement: number;
    stateDescription: string;
    measurementProbabilities: number[];
  };
  learningObjectives: string[];
  keyPoints: string[];
}

// Working quantum circuit templates with proper gate sequences
const WORKING_TEMPLATES: WorkingTemplate[] = [
  {
    id: 'bell-state',
    name: 'Bell State Generator',
    description: 'Create |Φ+⟩ = (|00⟩ + |11⟩)/√2 - maximum entanglement between 2 qubits',
    difficulty: 'beginner',
    category: 'Entanglement',
    gates: [
      { type: 'H', qubit: 0, position: 0 },
      { type: 'CNOT', qubits: [0, 1], position: 1 }
    ],
    expectedResults: {
      entanglement: 1.0,
      stateDescription: 'Equal superposition of |00⟩ and |11⟩',
      measurementProbabilities: [0.5, 0, 0, 0.5]
    },
    learningObjectives: [
      'Create superposition with Hadamard gate',
      'Generate entanglement with CNOT gate',
      'Understand Bell state properties',
      'Observe perfect quantum correlations'
    ],
    keyPoints: ['Superposition', 'Entanglement', 'Bell States', 'Quantum Correlations']
  },

  {
    id: 'grovers-3qubit',
    name: "Grover's 3-Qubit Oracle",
    description: 'Search for |101⟩ state using Grover algorithm with oracle and diffusion',
    difficulty: 'expert',
    category: 'Algorithms',
    gates: [
      // Initialize superposition
      { type: 'H', qubit: 0, position: 0 },
      { type: 'H', qubit: 1, position: 0 },
      { type: 'H', qubit: 2, position: 0 },
      
      // Oracle: mark |101⟩ (flip phase)
      { type: 'X', qubit: 1, position: 1 }, // Flip qubit 1 to 0
      { type: 'Z', qubit: 0, position: 2 }, // Apply controlled-Z
      { type: 'CNOT', qubits: [0, 2], position: 2 }, // Controlled by qubit 0
      { type: 'Z', qubit: 2, position: 3 }, // Apply Z to target
      { type: 'CNOT', qubits: [0, 2], position: 3 }, // Uncompute
      { type: 'X', qubit: 1, position: 4 }, // Flip back
      
      // Diffusion operator
      { type: 'H', qubit: 0, position: 5 },
      { type: 'H', qubit: 1, position: 5 },
      { type: 'H', qubit: 2, position: 5 },
      
      { type: 'X', qubit: 0, position: 6 },
      { type: 'X', qubit: 1, position: 6 },
      { type: 'X', qubit: 2, position: 6 },
      
      // Multi-controlled Z (Toffoli with Z on target)
      { type: 'TOFFOLI', qubits: [0, 1, 2], position: 7 },
      
      { type: 'X', qubit: 0, position: 8 },
      { type: 'X', qubit: 1, position: 8 },
      { type: 'X', qubit: 2, position: 8 },
      
      { type: 'H', qubit: 0, position: 9 },
      { type: 'H', qubit: 1, position: 9 },
      { type: 'H', qubit: 2, position: 9 }
    ],
    expectedResults: {
      entanglement: 0.8,
      stateDescription: 'High amplitude on |101⟩ state',
      measurementProbabilities: [0.125, 0.125, 0.125, 0.125, 0.125, 0.75, 0.125, 0.125]
    },
    learningObjectives: [
      'Implement quantum search oracle',
      'Apply amplitude amplification',
      'Understand Grover iteration',
      'Observe quadratic speedup'
    ],
    keyPoints: ['Oracle Function', 'Amplitude Amplification', 'Search Algorithm', 'Quadratic Speedup']
  },

  {
    id: 'qft-3qubit',
    name: '3-Qubit QFT',
    description: 'Quantum Fourier Transform on 3 qubits with controlled rotations',
    difficulty: 'expert',
    category: 'Transform',
    gates: [
      // QFT on qubits 0, 1, 2
      { type: 'H', qubit: 0, position: 0 },
      
      // Controlled rotations from qubit 1
      { type: 'RZ', qubit: 0, angle: Math.PI/2, position: 1 }, // CR2 gate (controlled RZ)
      { type: 'CNOT', qubits: [1, 0], position: 1 },
      { type: 'RZ', qubit: 0, angle: -Math.PI/2, position: 2 },
      { type: 'CNOT', qubits: [1, 0], position: 2 },
      
      // Controlled rotations from qubit 2
      { type: 'RZ', qubit: 0, angle: Math.PI/4, position: 3 }, // CR3 gate
      { type: 'CNOT', qubits: [2, 0], position: 3 },
      { type: 'RZ', qubit: 0, angle: -Math.PI/4, position: 4 },
      { type: 'CNOT', qubits: [2, 0], position: 4 },
      
      { type: 'H', qubit: 1, position: 5 },
      
      // Controlled rotation from qubit 2 to qubit 1
      { type: 'RZ', qubit: 1, angle: Math.PI/2, position: 6 },
      { type: 'CNOT', qubits: [2, 1], position: 6 },
      { type: 'RZ', qubit: 1, angle: -Math.PI/2, position: 7 },
      { type: 'CNOT', qubits: [2, 1], position: 7 },
      
      { type: 'H', qubit: 2, position: 8 },
      
      // Swap qubits to correct order
      { type: 'SWAP', qubits: [0, 2], position: 9 }
    ],
    expectedResults: {
      entanglement: 0.6,
      stateDescription: 'Fourier transformed state with frequency components',
      measurementProbabilities: [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125]
    },
    learningObjectives: [
      'Implement controlled rotation gates',
      'Understand quantum Fourier transform',
      'Handle phase precision optimization',
      'Apply frequency domain transformations'
    ],
    keyPoints: ['Fourier Transform', 'Controlled Rotations', 'Phase Gates', 'Frequency Domain']
  },

  {
    id: 'bit-flip-code',
    name: 'Bit-flip Error Correction',
    description: '3-qubit bit-flip code with syndrome detection and recovery',
    difficulty: 'expert',
    category: 'Error Correction',
    gates: [
      // Prepare state to encode (|0⟩ + |1⟩)/√2
      { type: 'H', qubit: 0, position: 0 },
      
      // Encoding: |ψ⟩ → |ψ⟩⊗|00⟩ + error correction
      { type: 'CNOT', qubits: [0, 1], position: 1 },
      { type: 'CNOT', qubits: [0, 2], position: 2 },
      
      // Simulate bit-flip error on qubit 1
      { type: 'X', qubit: 1, position: 3 },
      
      // Syndrome measurement using ancilla qubits 3 and 4
      { type: 'CNOT', qubits: [0, 3], position: 4 },
      { type: 'CNOT', qubits: [1, 3], position: 5 },
      { type: 'CNOT', qubits: [1, 4], position: 6 },
      { type: 'CNOT', qubits: [2, 4], position: 7 },
      
      // Error correction based on syndrome
      // If syndrome = |11⟩, error on qubit 1
      { type: 'X', qubit: 1, position: 8 }, // Correct the error
      
      // Verify correction by decoding
      { type: 'CNOT', qubits: [0, 2], position: 9 },
      { type: 'CNOT', qubits: [0, 1], position: 10 }
    ],
    expectedResults: {
      entanglement: 0.2,
      stateDescription: 'Error-corrected logical qubit state',
      measurementProbabilities: [0.5, 0.5, 0, 0, 0, 0, 0, 0]
    },
    learningObjectives: [
      'Implement quantum error correction',
      'Understand syndrome detection',
      'Apply recovery operations',
      'Preserve logical qubit information'
    ],
    keyPoints: ['Error Correction', 'Syndrome Detection', 'Logical Qubits', 'Fault Tolerance']
  },

  {
    id: 'quantum-teleportation',
    name: 'Quantum Teleportation',
    description: 'Complete teleportation protocol with Bell measurement',
    difficulty: 'intermediate', 
    category: 'Communication',
    gates: [
      // Prepare state to teleport
      { type: 'H', qubit: 0, position: 0 },
      
      // Create Bell pair between qubits 1 and 2
      { type: 'H', qubit: 1, position: 1 },
      { type: 'CNOT', qubits: [1, 2], position: 2 },
      
      // Bell measurement on qubits 0 and 1
      { type: 'CNOT', qubits: [0, 1], position: 3 },
      { type: 'H', qubit: 0, position: 4 },
      
      // Classical corrections on qubit 2
      // (In real implementation, these would be conditional)
      { type: 'Z', qubit: 2, position: 5 },
      { type: 'X', qubit: 2, position: 6 }
    ],
    expectedResults: {
      entanglement: 0.5,
      stateDescription: 'Teleported state on qubit 2',
      measurementProbabilities: [0.5, 0, 0, 0, 0.5, 0, 0, 0]
    },
    learningObjectives: [
      'Understand teleportation protocol',
      'Create and use Bell pairs',
      'Perform Bell measurements',
      'Apply classical corrections'
    ],
    keyPoints: ['Teleportation', 'Bell Measurement', 'No-cloning', 'Classical Communication']
  }
];

export function useWorkingTemplates() {
  const [templates] = useState<WorkingTemplate[]>(WORKING_TEMPLATES);
  
  const getTemplatesByCategory = useCallback((category: string) => {
    return templates.filter(template => template.category === category);
  }, [templates]);
  
  const getTemplatesByDifficulty = useCallback((difficulty: 'beginner' | 'intermediate' | 'expert') => {
    return templates.filter(template => template.difficulty === difficulty);
  }, [templates]);
  
  const getTemplateById = useCallback((id: string) => {
    return templates.find(template => template.id === id);
  }, [templates]);
  
  const validateTemplate = useCallback((template: WorkingTemplate): boolean => {
    if (!template.gates || template.gates.length === 0) return false;
    
    for (const gate of template.gates) {
      // Multi-qubit gates validation
      if (['CNOT', 'TOFFOLI', 'SWAP'].includes(gate.type)) {
        if (!gate.qubits || gate.qubits.length === 0) return false;
        if (gate.type === 'CNOT' && gate.qubits.length !== 2) return false;
        if (gate.type === 'TOFFOLI' && gate.qubits.length !== 3) return false;
        if (gate.type === 'SWAP' && gate.qubits.length !== 2) return false;
      }
      
      // Single-qubit gates validation
      if (['H', 'X', 'Y', 'Z', 'S', 'T', 'RX', 'RY', 'RZ'].includes(gate.type)) {
        if (gate.qubit === undefined) return false;
      }
      
      // Rotation gates validation
      if (['RX', 'RY', 'RZ'].includes(gate.type) && gate.angle === undefined) {
        return false;
      }
    }
    
    return true;
  }, []);
  
  const loadTemplate = useCallback((templateId: string): Omit<Gate, 'id'>[] | null => {
    const template = getTemplateById(templateId);
    if (!template || !validateTemplate(template)) {
      return null;
    }
    
    return template.gates.map(gate => ({
      ...gate,
      position: gate.position
    }));
  }, [getTemplateById, validateTemplate]);
  
  return {
    templates,
    getTemplatesByCategory,
    getTemplatesByDifficulty,
    getTemplateById,
    validateTemplate,
    loadTemplate
  };
}
