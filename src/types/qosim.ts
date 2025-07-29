
// Core quantum gate types
export interface QuantumGate {
  id: string;
  type: 'H' | 'X' | 'Y' | 'Z' | 'CNOT' | 'CZ' | 'SWAP' | 'TOFFOLI' | 'RX' | 'RY' | 'RZ' | 'PHASE' | 'T' | 'S' | 'MEASURE';
  qubits: number[];
  position: { x: number; y: number };
  parameters?: { [key: string]: number };
  label?: string;
  metadata?: {
    timestamp: number;
    userId?: string;
    comment?: string;
  };
}

// Quantum circuit definition
export interface QuantumCircuit {
  id: string;
  name: string;
  description?: string;
  gates: QuantumGate[];
  qubits: number;
  depth: number;
  created: Date;
  modified: Date;
  version: string;
  metadata?: {
    tags: string[];
    algorithm?: string;
    author?: string;
  };
}

// Quantum state representation
export interface QubitState {
  id: number;
  amplitude0: Complex;
  amplitude1: Complex;
  probability0: number;
  probability1: number;
  phase: number;
  entangled: boolean;
  entangledWith?: number[];
}

export interface Complex {
  real: number;
  imaginary: number;
}

// Simulation results
export interface QuantumSimulationResult {
  id: string;
  circuitId: string;
  timestamp: Date;
  qubits: number;
  gates: number;
  depth: number;
  stateVector: Complex[];
  qubitStates: QubitState[];
  measurementProbabilities: { [state: string]: number };
  entanglementMatrix: number[][];
  fidelity: number;
  executionTime: number;
  memoryUsed: number;
  noiseModel?: NoiseModel;
  metadata?: {
    backend: string;
    shots?: number;
    error?: string;
  };
}

// Noise modeling
export interface NoiseModel {
  enabled: boolean;
  gateErrors: { [gateType: string]: number };
  measurementError: number;
  decoherenceTime?: number;
  temperature?: number;
}

// Algorithm definitions
export interface QuantumAlgorithm {
  id: string;
  name: string;
  description: string;
  category: 'search' | 'factoring' | 'optimization' | 'simulation' | 'cryptography' | 'basic';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  parameters: AlgorithmParameter[];
  implementation: {
    python: string;
    javascript: string;
    qasm: string;
  };
  visualization: {
    steps: AlgorithmStep[];
    blochSphere?: boolean;
    entanglementMap?: boolean;
    probabilityChart?: boolean;
  };
  references?: string[];
  examples?: AlgorithmExample[];
}

export interface AlgorithmParameter {
  name: string;
  type: 'number' | 'boolean' | 'string' | 'array';
  default?: any;
  min?: number;
  max?: number;
  description: string;
  required: boolean;
}

export interface AlgorithmStep {
  id: string;
  description: string;
  gateOperations: QuantumGate[];
  stateChange: string;
  explanation: string;
}

export interface AlgorithmExample {
  name: string;
  description: string;
  parameters: { [key: string]: any };
  expectedOutput: string;
}

// Export/Import formats
export interface CircuitExport {
  format: 'qasm' | 'json' | 'python' | 'javascript';
  data: string;
  metadata: {
    version: string;
    timestamp: Date;
    tool: string;
  };
}

// Collaboration features
export interface CollaborationSession {
  id: string;
  circuitId: string;
  participants: Participant[];
  comments: Comment[];
  versions: CircuitVersion[];
  isActive: boolean;
  created: Date;
  modified: Date;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  cursor?: { x: number; y: number };
  selection?: string[];
  isOnline: boolean;
}

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  position: { x: number; y: number };
  gateId?: string;
  timestamp: Date;
  replies?: Comment[];
  resolved: boolean;
}

export interface CircuitVersion {
  id: string;
  version: string;
  circuit: QuantumCircuit;
  changes: string;
  authorId: string;
  timestamp: Date;
  parentVersion?: string;
}

// AI Assistant types
export interface AIAssistantRequest {
  type: 'optimize' | 'generate' | 'explain' | 'debug' | 'suggest';
  context: {
    circuit?: QuantumCircuit;
    algorithm?: string;
    userGoal?: string;
    constraints?: string[];
  };
  naturalLanguageInput?: string;
}

export interface AIAssistantResponse {
  id: string;
  type: AIAssistantRequest['type'];
  success: boolean;
  result?: {
    optimizedCircuit?: QuantumCircuit;
    generatedCode?: string;
    explanation?: string;
    suggestions?: string[];
    errorAnalysis?: string;
  };
  confidence: number;
  executionTime: number;
  error?: string;
}

// Integration layer types
export interface IntegrationSync {
  type: 'visual-to-code' | 'code-to-visual';
  source: 'circuit-builder' | 'algorithms-sdk';
  target: 'circuit-builder' | 'algorithms-sdk';
  data: QuantumCircuit | string;
  timestamp: Date;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

// Education mode types
export interface EducationMode {
  enabled: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  currentLesson?: string;
  progress: { [lessonId: string]: number };
  hints: boolean;
  stepByStep: boolean;
}
