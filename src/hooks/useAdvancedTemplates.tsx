import { useState, useCallback } from 'react';
import { Gate } from '@/hooks/useCircuitWorkspace';

export interface AdvancedTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  category: string;
  gates: Omit<Gate, 'id'>[];
  learningObjectives: string[];
  keyconcepts: string[];
  qftDepth?: number;
  errorCorrectionType?: string;
}

// Advanced templates with proper gate sequences
const ADVANCED_TEMPLATES: AdvancedTemplate[] = [
  {
    id: 'bell-state-generator',
    name: 'Bell State Generator',
    description: 'Create maximally entangled Bell states |Φ+⟩ = (|00⟩ + |11⟩)/√2',
    difficulty: 'beginner',
    category: 'Entanglement',
    gates: [
      { type: 'H', qubit: 0, position: 0 },
      { type: 'CNOT', qubits: [0, 1], position: 1 }
    ],
    learningObjectives: [
      'Understand superposition with Hadamard gates',
      'Create entanglement with CNOT gates',
      'Observe Bell state measurement statistics',
      'Analyze quantum correlations'
    ],
    keyconcepts: ['Superposition', 'Entanglement', 'Bell States', 'Quantum Correlations']
  },
  
  {
    id: 'grovers-algorithm',
    name: "Grover's Algorithm",
    description: 'Quantum search algorithm providing quadratic speedup over classical search',
    difficulty: 'expert',
    category: 'Algorithms',
    gates: [
      // Initialize superposition
      { type: 'H', qubit: 0, position: 0 },
      { type: 'H', qubit: 1, position: 0 },
      { type: 'H', qubit: 2, position: 0 },
      
      // Oracle (mark target state |110⟩)
      { type: 'X', qubit: 2, position: 1 }, // Flip qubit 2
      { type: 'TOFFOLI', qubits: [0, 1, 2], position: 2 }, // Controlled-controlled-Z
      { type: 'X', qubit: 2, position: 3 }, // Flip back
      
      // Diffusion operator (amplitude amplification)
      { type: 'H', qubit: 0, position: 4 },
      { type: 'H', qubit: 1, position: 4 },
      { type: 'H', qubit: 2, position: 4 },
      
      { type: 'X', qubit: 0, position: 5 },
      { type: 'X', qubit: 1, position: 5 },
      { type: 'X', qubit: 2, position: 5 },
      
      { type: 'TOFFOLI', qubits: [0, 1, 2], position: 6 },
      
      { type: 'X', qubit: 0, position: 7 },
      { type: 'X', qubit: 1, position: 7 },
      { type: 'X', qubit: 2, position: 7 },
      
      { type: 'H', qubit: 0, position: 8 },
      { type: 'H', qubit: 1, position: 8 },
      { type: 'H', qubit: 2, position: 8 }
    ],
    learningObjectives: [
      'Initialize uniform superposition state',
      'Implement quantum oracle function',
      'Apply diffusion operator for amplitude amplification',
      'Observe quadratic speedup in search'
    ],
    keyconcepts: ['Amplitude Amplification', 'Oracle Functions', 'Quadratic Speedup', 'Inversion About Average']
  },
  
  {
    id: 'quantum-fourier-transform',
    name: 'Quantum Fourier Transform',
    description: 'QFT implementation with precision optimization for quantum algorithms',
    difficulty: 'expert',
    category: 'Transform',
    gates: [
      // QFT on 3 qubits with controlled rotations
      { type: 'H', qubit: 0, position: 0 },
      { type: 'RZ', qubit: 1, angle: Math.PI/2, position: 1 }, // Controlled by qubit 0
      { type: 'CNOT', qubits: [0, 1], position: 1 },
      { type: 'RZ', qubit: 1, angle: -Math.PI/2, position: 2 },
      { type: 'CNOT', qubits: [0, 1], position: 2 },
      
      { type: 'RZ', qubit: 2, angle: Math.PI/4, position: 3 }, // Controlled by qubit 0
      { type: 'CNOT', qubits: [0, 2], position: 3 },
      { type: 'RZ', qubit: 2, angle: -Math.PI/4, position: 4 },
      { type: 'CNOT', qubits: [0, 2], position: 4 },
      
      { type: 'H', qubit: 1, position: 5 },
      { type: 'RZ', qubit: 2, angle: Math.PI/2, position: 6 }, // Controlled by qubit 1
      { type: 'CNOT', qubits: [1, 2], position: 6 },
      { type: 'RZ', qubit: 2, angle: -Math.PI/2, position: 7 },
      { type: 'CNOT', qubits: [1, 2], position: 7 },
      
      { type: 'H', qubit: 2, position: 8 },
      
      // SWAP gates to reverse qubit order
      { type: 'SWAP', qubits: [0, 2], position: 9 }
    ],
    learningObjectives: [
      'Understand quantum Fourier transform principles',
      'Implement controlled rotation gates',
      'Handle precision thresholding for small angles',
      'Observe frequency domain representation'
    ],
    keyconcepts: ['Fourier Transform', 'Controlled Rotations', 'Phase Estimation', 'Frequency Domain'],
    qftDepth: 3
  },
  
  {
    id: 'error-correction',
    name: 'Quantum Error Correction',
    description: '3-qubit bit-flip error correction code with syndrome detection',
    difficulty: 'expert',
    category: 'Error Correction',
    gates: [
      // Encode logical qubit |ψ⟩ → |ψ000⟩ + |ψ111⟩
      { type: 'H', qubit: 0, position: 0 }, // Prepare state to encode
      
      // Encoding circuit
      { type: 'CNOT', qubits: [0, 1], position: 1 },
      { type: 'CNOT', qubits: [0, 2], position: 2 },
      
      // Simulate bit-flip error on qubit 1 (in real use, this would be random)
      { type: 'X', qubit: 1, position: 3 },
      
      // Syndrome detection circuit
      { type: 'CNOT', qubits: [0, 3], position: 4 }, // Ancilla qubits 3,4 for syndrome
      { type: 'CNOT', qubits: [1, 3], position: 5 },
      { type: 'CNOT', qubits: [1, 4], position: 6 },
      { type: 'CNOT', qubits: [2, 4], position: 7 },
      
      // Recovery operation (conditional X gates based on syndrome)
      // In a real implementation, this would be classically controlled
      { type: 'TOFFOLI', qubits: [3, 4, 1], position: 8 }, // Correct qubit 1 if syndrome is 11
    ],
    learningObjectives: [
      'Understand quantum error correction principles',
      'Implement 3-qubit bit-flip code',
      'Perform syndrome measurement',
      'Apply conditional recovery operations'
    ],
    keyconcepts: ['Error Correction', 'Syndrome Detection', 'Logical Qubits', 'Fault Tolerance'],
    errorCorrectionType: '3-qubit bit-flip'
  },
  
  {
    id: 'quantum-teleportation',
    name: 'Quantum Teleportation',
    description: 'Complete quantum teleportation protocol with Bell measurement',
    difficulty: 'intermediate',
    category: 'Communication',
    gates: [
      // Prepare state to teleport (example: |+⟩ state)
      { type: 'H', qubit: 0, position: 0 },
      
      // Create Bell pair between qubits 1 and 2
      { type: 'H', qubit: 1, position: 1 },
      { type: 'CNOT', qubits: [1, 2], position: 2 },
      
      // Bell measurement on qubits 0 and 1
      { type: 'CNOT', qubits: [0, 1], position: 3 },
      { type: 'H', qubit: 0, position: 4 },
      
      // Classical corrections on qubit 2 (would be conditional in real implementation)
      // For demonstration, we show the correction operations
      { type: 'Z', qubit: 2, position: 5 }, // Conditional on qubit 0 measurement
      { type: 'X', qubit: 2, position: 6 }, // Conditional on qubit 1 measurement
    ],
    learningObjectives: [
      'Understand quantum teleportation protocol',
      'Create and use entangled Bell pairs',
      'Perform Bell state measurement',
      'Apply classical corrections'
    ],
    keyconcepts: ['Teleportation', 'Bell Measurement', 'No-cloning Theorem', 'Classical Communication']
  },
  
  {
    id: 'shor-period-finding',
    name: "Shor's Period Finding",
    description: 'Core period-finding subroutine of Shor\'s factoring algorithm',
    difficulty: 'expert',
    category: 'Algorithms',
    gates: [
      // Initialize superposition in first register
      { type: 'H', qubit: 0, position: 0 },
      { type: 'H', qubit: 1, position: 0 },
      { type: 'H', qubit: 2, position: 0 },
      
      // Modular exponentiation (simplified version)
      // In practice, this would be a complex sequence
      { type: 'CNOT', qubits: [0, 3], position: 1 },
      { type: 'CNOT', qubits: [1, 4], position: 2 },
      { type: 'TOFFOLI', qubits: [0, 1, 4], position: 3 },
      
      // Inverse QFT on first register
      { type: 'SWAP', qubits: [0, 2], position: 4 },
      { type: 'H', qubit: 2, position: 5 },
      
      { type: 'RZ', qubit: 1, angle: -Math.PI/2, position: 6 },
      { type: 'CNOT', qubits: [2, 1], position: 6 },
      { type: 'RZ', qubit: 1, angle: Math.PI/2, position: 7 },
      { type: 'CNOT', qubits: [2, 1], position: 7 },
      { type: 'H', qubit: 1, position: 8 },
      
      { type: 'RZ', qubit: 0, angle: -Math.PI/4, position: 9 },
      { type: 'CNOT', qubits: [2, 0], position: 9 },
      { type: 'RZ', qubit: 0, angle: Math.PI/4, position: 10 },
      { type: 'CNOT', qubits: [2, 0], position: 10 },
      
      { type: 'RZ', qubit: 0, angle: -Math.PI/2, position: 11 },
      { type: 'CNOT', qubits: [1, 0], position: 11 },
      { type: 'RZ', qubit: 0, angle: Math.PI/2, position: 12 },
      { type: 'CNOT', qubits: [1, 0], position: 12 },
      { type: 'H', qubit: 0, position: 13 }
    ],
    learningObjectives: [
      'Understand period finding in factoring',
      'Implement quantum phase estimation',
      'Use modular exponentiation',
      'Apply inverse quantum Fourier transform'
    ],
    keyconcepts: ['Period Finding', 'Phase Estimation', 'Modular Arithmetic', 'Cryptography']
  }
];

export function useAdvancedTemplates() {
  const [loadedTemplates] = useState<AdvancedTemplate[]>(ADVANCED_TEMPLATES);
  
  const getTemplatesByCategory = useCallback((category: string) => {
    return loadedTemplates.filter(template => template.category === category);
  }, [loadedTemplates]);
  
  const getTemplatesByDifficulty = useCallback((difficulty: 'beginner' | 'intermediate' | 'expert') => {
    return loadedTemplates.filter(template => template.difficulty === difficulty);
  }, [loadedTemplates]);
  
  const getTemplateById = useCallback((id: string) => {
    return loadedTemplates.find(template => template.id === id);
  }, [loadedTemplates]);
  
  const validateTemplate = useCallback((template: AdvancedTemplate): boolean => {
    // Basic validation
    if (!template.gates || template.gates.length === 0) return false;
    
    // Check for invalid gate configurations
    for (const gate of template.gates) {
      // Multi-qubit gates should have qubits array
      if (['CNOT', 'TOFFOLI', 'SWAP'].includes(gate.type) && !gate.qubits) {
        return false;
      }
      
      // Single-qubit gates should have qubit number
      if (['H', 'X', 'Y', 'Z', 'S', 'T', 'RX', 'RY', 'RZ'].includes(gate.type) && gate.qubit === undefined) {
        return false;
      }
      
      // Rotation gates should have angle
      if (['RX', 'RY', 'RZ'].includes(gate.type) && gate.angle === undefined) {
        return false;
      }
    }
    
    return true;
  }, []);
  
  const optimizeTemplate = useCallback((template: AdvancedTemplate): AdvancedTemplate => {
    // Optimize gate sequence for better performance
    const optimizedGates = [...template.gates];
    
    // Remove identity operations (very small rotation angles)
    const filtered = optimizedGates.filter(gate => {
      if (['RX', 'RY', 'RZ'].includes(gate.type) && gate.angle !== undefined) {
        return Math.abs(gate.angle) > 1e-10;
      }
      return true;
    });
    
    // Sort by position to ensure correct temporal order
    filtered.sort((a, b) => a.position - b.position);
    
    return {
      ...template,
      gates: filtered
    };
  }, []);
  
  return {
    templates: loadedTemplates,
    getTemplatesByCategory,
    getTemplatesByDifficulty,
    getTemplateById,
    validateTemplate,
    optimizeTemplate
  };
}
