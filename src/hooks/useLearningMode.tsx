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
    id: 'quantum-teleportation',
    name: 'Quantum Teleportation',
    description: 'Teleport quantum state using entanglement and classical communication',
    difficulty: 'intermediate',
    category: 'Communication',
    gates: [
      { type: 'H', qubit: 1, position: 0 },
      { type: 'CNOT', qubits: [1, 2], position: 1 },
      { type: 'CNOT', qubits: [0, 1], position: 2 },
      { type: 'H', qubit: 0, position: 3 },
      { type: 'M', qubit: 0, position: 4 },
      { type: 'M', qubit: 1, position: 5 }
    ],
    learningObjectives: [
      'Prepare entangled Bell pair',
      'Perform Bell measurement',
      'Apply conditional corrections'
    ],
    keyconcepts: ['Teleportation', 'Bell Measurement', 'No-cloning theorem']
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
      
      // Oracle (mark target state)
      { type: 'Z', qubit: 2, position: 1 },
      { type: 'CNOT', qubits: [0, 2], position: 2 },
      { type: 'CNOT', qubits: [1, 2], position: 3 },
      
      // Diffusion operator
      { type: 'H', qubit: 0, position: 4 },
      { type: 'H', qubit: 1, position: 4 },
      { type: 'H', qubit: 2, position: 4 },
      { type: 'X', qubit: 0, position: 5 },
      { type: 'X', qubit: 1, position: 5 },
      { type: 'X', qubit: 2, position: 5 },
      { type: 'CNOT', qubits: [1, 2], position: 6 },
      { type: 'CNOT', qubits: [0, 2], position: 7 },
      { type: 'X', qubit: 0, position: 8 },
      { type: 'X', qubit: 1, position: 8 },
      { type: 'X', qubit: 2, position: 8 },
      { type: 'H', qubit: 0, position: 9 },
      { type: 'H', qubit: 1, position: 9 },
      { type: 'H', qubit: 2, position: 9 }
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
      { type: 'H', qubit: 0, position: 0 },
      { type: 'RZ', qubit: 1, angle: Math.PI/2, position: 1 },
      { type: 'CNOT', qubits: [0, 1], position: 1 },
      { type: 'RZ', qubit: 1, angle: -Math.PI/2, position: 2 },
      { type: 'CNOT', qubits: [0, 1], position: 2 },
      { type: 'RZ', qubit: 2, angle: Math.PI/4, position: 3 },
      { type: 'CNOT', qubits: [0, 2], position: 3 },
      { type: 'RZ', qubit: 2, angle: -Math.PI/4, position: 4 },
      { type: 'CNOT', qubits: [0, 2], position: 4 },
      { type: 'H', qubit: 1, position: 5 },
      { type: 'RZ', qubit: 2, angle: Math.PI/2, position: 6 },
      { type: 'CNOT', qubits: [1, 2], position: 6 },
      { type: 'RZ', qubit: 2, angle: -Math.PI/2, position: 7 },
      { type: 'CNOT', qubits: [1, 2], position: 7 },
      { type: 'H', qubit: 2, position: 8 }
    ],
    learningObjectives: [
      'Understand quantum Fourier transform principles',
      'Implement controlled rotation gates',
      'Handle precision thresholding for small angles',
      'Observe frequency domain representation'
    ],
    keyconcepts: ['Fourier Transform', 'Controlled Rotations', 'Phase Estimation', 'Frequency Domain']
  },
  {
    id: 'error-correction',
    name: 'Error Correction',
    description: '3-qubit bit-flip error correction code with syndrome detection',
    difficulty: 'expert',
    category: 'Error Correction',
    gates: [
      { type: 'H', qubit: 0, position: 0 },
      { type: 'CNOT', qubits: [0, 1], position: 1 },
      { type: 'CNOT', qubits: [0, 2], position: 2 },
      { type: 'X', qubit: 1, position: 3 }, // Simulate error
      { type: 'CNOT', qubits: [0, 3], position: 4 },
      { type: 'CNOT', qubits: [1, 3], position: 5 },
      { type: 'CNOT', qubits: [1, 4], position: 6 },
      { type: 'CNOT', qubits: [2, 4], position: 7 }
    ],
    learningObjectives: [
      'Understand quantum error correction principles',
      'Implement 3-qubit bit-flip code',
      'Perform syndrome measurement',
      'Apply conditional recovery operations'
    ],
    keyconcepts: ['Error Correction', 'Syndrome Detection', 'Logical Qubits', 'Fault Tolerance']
  },
  {
    id: 'deutsch-jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    description: 'Determine if function is constant or balanced in one query',
    difficulty: 'intermediate',
    category: 'Algorithms',
    gates: [
      { type: 'H', qubit: 0, position: 0 },
      { type: 'H', qubit: 1, position: 0 },
      { type: 'X', qubit: 2, position: 0 },
      { type: 'H', qubit: 2, position: 1 },
      { type: 'CNOT', qubits: [1, 2], position: 2 },
      { type: 'H', qubit: 0, position: 3 },
      { type: 'H', qubit: 1, position: 3 },
      { type: 'M', qubit: 0, position: 4 },
      { type: 'M', qubit: 1, position: 5 }
    ],
    learningObjectives: [
      'Understand quantum oracle concept',
      'See quantum parallelism in action',
      'Observe exponential advantage'
    ],
    keyconcepts: ['Quantum Parallelism', 'Oracle', 'Phase Kickback']
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