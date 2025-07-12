import { useState, useCallback, useEffect } from 'react';
import { Gate } from './useCircuitState';

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  instruction: string;
  expectedGates: string[];
  conceptHighlight?: string;
  isCompleted: boolean;
}

export interface CircuitTemplate {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'expert';
  category: string;
  gates: Omit<Gate, 'id'>[];
  learningObjectives: string[];
  keyconcepts: string[];
}

export interface LearningProgress {
  level: 'beginner' | 'intermediate' | 'expert';
  completedTemplates: string[];
  completedSteps: string[];
  totalScore: number;
}

const CIRCUIT_TEMPLATES: CircuitTemplate[] = [
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
    id: 'grovers-3qubit-oracle',
    name: "Grover's 3-Qubit Oracle",
    description: 'Grover search for 3-qubit target state |101⟩ with optimized oracle and diffusion',
    difficulty: 'intermediate', 
    category: 'Algorithms',
    gates: [
      // Initialize superposition
      { type: 'H', qubit: 0, position: 0 },
      { type: 'H', qubit: 1, position: 0 },
      { type: 'H', qubit: 2, position: 0 },
      
      // Oracle: mark |101⟩ state (flip phase)
      { type: 'X', qubit: 1, position: 1 }, // Flip qubit 1 
      { type: 'TOFFOLI', qubits: [0, 1, 2], position: 2 }, // Multi-controlled Z
      { type: 'X', qubit: 1, position: 3 }, // Restore qubit 1
      
      // Diffusion operator (inversion about average)
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
      'Mark target item with oracle',
      'Amplify correct amplitude',
      'Measure with high probability'
    ],
    keyconcepts: ['Amplitude Amplification', 'Oracle Functions', 'Quadratic Speedup', 'Diffusion Operator']
  },
  {
    id: 'qft-3qubit',
    name: '3-Qubit QFT',
    description: 'Quantum Fourier Transform on 3 qubits with controlled phase rotations',
    difficulty: 'expert',
    category: 'Transform', 
    gates: [
      // QFT on qubit 0
      { type: 'H', qubit: 0, position: 0 },
      { type: 'RZ', qubit: 1, angle: Math.PI/2, position: 1 },
      { type: 'CNOT', qubits: [0, 1], position: 1 },
      { type: 'RZ', qubit: 1, angle: -Math.PI/2, position: 2 },
      { type: 'CNOT', qubits: [0, 1], position: 2 },
      { type: 'RZ', qubit: 2, angle: Math.PI/4, position: 3 },
      { type: 'CNOT', qubits: [0, 2], position: 3 },
      { type: 'RZ', qubit: 2, angle: -Math.PI/4, position: 4 },
      { type: 'CNOT', qubits: [0, 2], position: 4 },
      
      // QFT on qubit 1
      { type: 'H', qubit: 1, position: 5 },
      { type: 'RZ', qubit: 2, angle: Math.PI/2, position: 6 },
      { type: 'CNOT', qubits: [1, 2], position: 6 },
      { type: 'RZ', qubit: 2, angle: -Math.PI/2, position: 7 },
      { type: 'CNOT', qubits: [1, 2], position: 7 },
      
      // QFT on qubit 2
      { type: 'H', qubit: 2, position: 8 },
      
      // SWAP network (reverse order)
      { type: 'SWAP', qubits: [0, 2], position: 9 }
    ],
    learningObjectives: [
      'Understand quantum Fourier transform',
      'Implement controlled rotations',
      'Handle phase precision', 
      'Apply QFT to algorithms'
    ],
    keyconcepts: ['Fourier Transform', 'Controlled Phase', 'Frequency Domain', 'Phase Estimation']
  },
  {
    id: 'bit-flip-error-correction',
    name: 'Bit-flip Error Correction',
    description: '3-qubit repetition code protecting against single bit-flip errors',
    difficulty: 'expert',
    category: 'Error Correction',
    gates: [
      // Encode logical |0⟩ 
      { type: 'H', qubit: 0, position: 0 }, // Create superposition first
      { type: 'CNOT', qubits: [0, 1], position: 1 },
      { type: 'CNOT', qubits: [0, 2], position: 2 },
      
      // Simulate bit-flip error on qubit 1
      { type: 'X', qubit: 1, position: 3 },
      
      // Syndrome measurement (detect error location)
      { type: 'CNOT', qubits: [0, 3], position: 4 }, // Syndrome qubit 1
      { type: 'CNOT', qubits: [1, 3], position: 5 },
      { type: 'CNOT', qubits: [1, 4], position: 6 }, // Syndrome qubit 2  
      { type: 'CNOT', qubits: [2, 4], position: 7 },
      
      // Measure syndrome
      { type: 'M', qubit: 3, position: 8 },
      { type: 'M', qubit: 4, position: 9 },
      
      // Recovery (conditional X gates based on syndrome)
      // In real implementation, these would be conditional on measurement results
      { type: 'X', qubit: 1, position: 10 } // Correct the error we introduced
    ],
    learningObjectives: [
      'Encode logical qubits',
      'Detect error syndromes',
      'Apply recovery operations',
      'Understand fault tolerance'
    ],
    keyconcepts: ['Error Correction', 'Syndrome Detection', 'Logical Qubits', 'Fault Tolerance']
  }
];

const TUTORIAL_STEPS: LearningStep[] = [
  {
    id: 'step-1',
    title: 'Create Superposition',
    description: 'Start with a Hadamard gate to create superposition',
    instruction: 'Drag an H gate onto qubit 0 at position 0',
    expectedGates: ['H'],
    conceptHighlight: 'Superposition allows qubits to exist in multiple states simultaneously',
    isCompleted: false
  },
  {
    id: 'step-2',
    title: 'Add Entanglement',
    description: 'Use CNOT to entangle qubits',
    instruction: 'Drag a CNOT gate with control on qubit 0 and target on qubit 1',
    expectedGates: ['H', 'CNOT'],
    conceptHighlight: 'Entanglement creates correlation between qubits that persists even when separated',
    isCompleted: false
  },
  {
    id: 'step-3',
    title: 'Add Measurement',
    description: 'Measure the final quantum state',
    instruction: 'Add measurement gates to observe the quantum state',
    expectedGates: ['H', 'CNOT', 'M'],
    conceptHighlight: 'Measurement collapses the quantum state to a classical outcome',
    isCompleted: false
  }
];

export function useLearningMode() {
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<CircuitTemplate | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [tutorialSteps, setTutorialSteps] = useState<LearningStep[]>(TUTORIAL_STEPS);
  const [progress, setProgress] = useState<LearningProgress>(() => {
    const saved = localStorage.getItem('quantum-learning-progress');
    return saved ? JSON.parse(saved) : {
      level: 'beginner',
      completedTemplates: [],
      completedSteps: [],
      totalScore: 0
    };
  });

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('quantum-learning-progress', JSON.stringify(progress));
  }, [progress]);

  const toggleLearningMode = useCallback(() => {
    setIsLearningMode(!isLearningMode);
    if (!isLearningMode) {
      setCurrentStep(0);
    }
  }, [isLearningMode]);

  const selectTemplate = useCallback((templateId: string) => {
    const template = CIRCUIT_TEMPLATES.find(t => t.id === templateId);
    setCurrentTemplate(template || null);
    setCurrentStep(0);
    console.log('Selected template:', template);
  }, []);

  const checkStepCompletion = useCallback((circuit: Gate[]) => {
    if (!isLearningMode || currentStep >= tutorialSteps.length) return;

    const step = tutorialSteps[currentStep];
    const circuitGateTypes = circuit.map(gate => gate.type);
    const hasExpectedGates = step.expectedGates.every(expectedGate => 
      circuitGateTypes.includes(expectedGate)
    );

    if (hasExpectedGates && !step.isCompleted) {
      setTutorialSteps(prev => prev.map((s, index) => 
        index === currentStep ? { ...s, isCompleted: true } : s
      ));

      setProgress(prev => ({
        ...prev,
        completedSteps: [...prev.completedSteps, step.id],
        totalScore: prev.totalScore + 10
      }));

      setTimeout(() => {
        if (currentStep < tutorialSteps.length - 1) {
          setCurrentStep(currentStep + 1);
        }
      }, 1500);
    }
  }, [isLearningMode, currentStep, tutorialSteps]);

  const completeTemplate = useCallback((templateId: string) => {
    setProgress(prev => ({
      ...prev,
      completedTemplates: [...prev.completedTemplates, templateId],
      totalScore: prev.totalScore + 50,
      level: prev.completedTemplates.length >= 2 ? 'intermediate' : 
             prev.completedTemplates.length >= 5 ? 'expert' : prev.level
    }));
  }, []);

  const resetTutorial = useCallback(() => {
    setTutorialSteps(TUTORIAL_STEPS.map(step => ({ ...step, isCompleted: false })));
    setCurrentStep(0);
  }, []);

  const getTemplatesByDifficulty = useCallback((difficulty: LearningProgress['level']) => {
    return CIRCUIT_TEMPLATES.filter(template => template.difficulty === difficulty);
  }, []);

  const getCurrentStep = useCallback(() => {
    if (!isLearningMode || currentStep >= tutorialSteps.length) return null;
    return tutorialSteps[currentStep];
  }, [isLearningMode, currentStep, tutorialSteps]);

  return {
    isLearningMode,
    currentTemplate,
    currentStep: getCurrentStep(),
    progress,
    templates: CIRCUIT_TEMPLATES,
    toggleLearningMode,
    selectTemplate,
    checkStepCompletion,
    completeTemplate,
    resetTutorial,
    getTemplatesByDifficulty
  };
}