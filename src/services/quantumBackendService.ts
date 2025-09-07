
import { StateVector, QuantumGate, SimulationResult, quantumSimulator } from '@/lib/quantumSimulator';
import { QuantumEntanglementService } from './quantumEntanglementService';

export interface QuantumAmplitude {
  real: number;
  imaginary: number;
  magnitude: number;
  phase: number;
}

export interface QubitState {
  qubit: number;
  state: string;
  amplitude: { real: number; imaginary: number };
  phase: number;
  probability: number;
}

export interface QuantumCircuit {
  gates: QuantumGate[];
  qubits: number;
  shots: number;
}

export interface QuantumBackendResult {
  stateVector: QuantumAmplitude[];
  measurementProbabilities: Record<string, number>;
  counts: Record<string, number>;
  qubitStates: QubitState[];
  executionTime: number;
  backend: string;
  jobId: string;
  error?: string;
  entanglement: {
    pairs: Array<{ qubit1: number; qubit2: number; strength: number }>;
    totalEntanglement: number;
    entanglementThreads: Array<{ qubits: number[]; strength: number }>;
  };
  blochSphereData: Array<{ x: number; y: number; z: number; qubit: number; theta: number; phi: number }>;
}

export class QuantumBackendService {
  private static backends = ['local'];

  static getBackends() {
    return this.backends;
  }

  static async executeCircuit(circuit: QuantumGate[], shots: number = 1024, backend: string = 'local'): Promise<QuantumBackendResult | null> {
    console.log(`Executing circuit on ${backend} with ${shots} shots`);

    switch (backend) {
      case 'local':
        return this.simulateLocally(circuit, shots);
      default:
        console.error(`Backend ${backend} not supported`);
        return null;
    }
  }

  private static async simulateLocally(circuit: QuantumGate[], shots: number = 1024): Promise<QuantumBackendResult> {
    try {
      console.log('🔬 Running local quantum simulation', { gates: circuit.length, shots });
      
      const startTime = performance.now();
      const result = quantumSimulator.simulate(circuit);
      const executionTime = performance.now() - startTime;

      // Generate measurement counts from probabilities
      const counts: Record<string, number> = {};
      const stateLabels = Object.keys(result.measurementProbabilities);
      
      for (let shot = 0; shot < shots; shot++) {
        const rand = Math.random();
        let cumulative = 0;
        
        for (const state of stateLabels) {
          cumulative += result.measurementProbabilities[state];
          if (rand <= cumulative) {
            counts[state] = (counts[state] || 0) + 1;
            break;
          }
        }
      }

      // Convert state vector to proper format
      const stateVector: QuantumAmplitude[] = result.stateVector.map(complex => ({
        real: complex.real,
        imaginary: complex.imaginary || 0,
        magnitude: complex.magnitude(),
        phase: complex.phase()
      }));

      // Calculate proper entanglement analysis
      const numQubits = Math.log2(result.stateVector.length);
      const entanglementInput = result.stateVector.map(complex => ({
        real: complex.real,
        imaginary: complex.imaginary || 0
      }));
      
      const entanglement = QuantumEntanglementService.calculateEntanglement(
        entanglementInput,
        numQubits
      );

      // Generate Bloch sphere data for each qubit with theta and phi
      const blochSphereData = result.qubitStates.map(qubit => {
        const theta = 2 * Math.acos(Math.abs(qubit.amplitude.real));
        const phi = qubit.phase;
        
        return {
          x: Math.sin(theta) * Math.cos(phi),
          y: Math.sin(theta) * Math.sin(phi),
          z: Math.cos(theta),
          qubit: qubit.qubit,
          theta,
          phi
        };
      });

      return {
        stateVector,
        measurementProbabilities: result.measurementProbabilities,
        counts,
        qubitStates: result.qubitStates,
        executionTime,
        backend: 'local',
        jobId: `local-${Date.now()}`,
        entanglement,
        blochSphereData
      };
    } catch (error) {
      console.error('Local simulation failed:', error);
      return {
        stateVector: [],
        measurementProbabilities: {},
        counts: {},
        qubitStates: [],
        executionTime: 0,
        backend: 'local',
        jobId: `failed-${Date.now()}`,
        error: error instanceof Error ? error.message : 'Unknown simulation error',
        entanglement: { pairs: [], totalEntanglement: 0, entanglementThreads: [] },
        blochSphereData: []
      };
    }
  }

  // Placeholder for cloud execution
  private static async executeCloud(circuit: QuantumGate[], shots: number = 1024): Promise<QuantumBackendResult | null> {
    console.log('☁️ Executing on cloud backend', { gates: circuit.length, shots });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network latency

    return {
      stateVector: [],
      measurementProbabilities: {},
      counts: {},
      qubitStates: [],
      executionTime: 2000,
      backend: 'cloud',
      jobId: `cloud-${Date.now()}`,
      entanglement: { pairs: [], totalEntanglement: 0, entanglementThreads: [] },
      blochSphereData: []
    };
  }
}

// Export the service instance for backward compatibility
export const quantumBackendService = QuantumBackendService;
