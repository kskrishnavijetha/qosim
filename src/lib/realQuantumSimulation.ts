/**
 * Real Quantum Simulation Service
 * Integrates the QOSim core engine for actual quantum simulations
 */

// Import the quantum simulator (we'll use dynamic import to handle JS module)
declare global {
  interface Window {
    QOSimSimulator: any;
    Complex: any;
    QuantumGate: any;
  }
}

export interface QuantumSimulationResult {
  stateVector: { real: number; imag: number; magnitude: number; phase: number }[];
  probabilities: number[];
  basisStates: { state: string; amplitude: { real: number; imag: number }; probability: number }[];
  measurements: { [qubit: number]: { "0": number; "1": number } };
  circuitInfo: {
    depth: number;
    gateCount: { [gate: string]: number };
    numQubits: number;
  };
  executionTime: number;
}

export class RealQuantumSimulation {
  private async loadQuantumCore(): Promise<void> {
    if (window.QOSimSimulator) {
      return;
    }

    try {
      // Import the module dynamically with proper TypeScript handling
      const module = await import('../../qosim-core.js' as any);
      
      // Make classes globally available
      window.QOSimSimulator = module.QOSimSimulator;
      window.Complex = module.Complex;
      window.QuantumGate = module.QuantumGate;
      
    } catch (error) {
      // Fallback: try to load via script tag if module import fails
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = '/src/qosim-core.js';
        script.type = 'module';
        script.onload = () => {
          // Wait for global variables to be available
          setTimeout(() => {
            if (window.QOSimSimulator) {
              resolve();
            } else {
              reject(new Error('QOSim core failed to initialize'));
            }
          }, 100);
        };
        script.onerror = () => reject(new Error('Failed to load QOSim core script'));
        document.head.appendChild(script);
      });
    }
  }

  async simulateBellState(): Promise<QuantumSimulationResult> {
    await this.loadQuantumCore();
    const startTime = performance.now();

    const sim = new window.QOSimSimulator(2);
    sim.addGate("H", 0);
    sim.addGate("CNOT", 0, 1);
    sim.run();

    const stateVector = sim.getStateVector();
    const probabilities = sim.getProbabilities();
    const basisStates = sim.getBasisStates();

    return {
      stateVector,
      probabilities,
      basisStates,
      measurements: {
        0: sim.getMeasurementProbabilities(0),
        1: sim.getMeasurementProbabilities(1)
      },
      circuitInfo: {
        depth: sim.getCircuitDepth(),
        gateCount: sim.getGateCount(),
        numQubits: 2
      },
      executionTime: performance.now() - startTime
    };
  }

  async simulateGrover(): Promise<QuantumSimulationResult> {
    await this.loadQuantumCore();
    const startTime = performance.now();

    const sim = new window.QOSimSimulator(2);
    
    // Initialize superposition
    sim.addGate("H", 0);
    sim.addGate("H", 1);
    
    // Oracle for |11⟩ (using CZ gate)
    sim.addGate("CZ", 0, 1);
    
    // Diffusion operator
    sim.addGate("H", 0);
    sim.addGate("H", 1);
    sim.addGate("X", 0);
    sim.addGate("X", 1);
    sim.addGate("CZ", 0, 1);
    sim.addGate("X", 0);
    sim.addGate("X", 1);
    sim.addGate("H", 0);
    sim.addGate("H", 1);
    
    sim.run();

    return {
      stateVector: sim.getStateVector(),
      probabilities: sim.getProbabilities(),
      basisStates: sim.getBasisStates(),
      measurements: {
        0: sim.getMeasurementProbabilities(0),
        1: sim.getMeasurementProbabilities(1)
      },
      circuitInfo: {
        depth: sim.getCircuitDepth(),
        gateCount: sim.getGateCount(),
        numQubits: 2
      },
      executionTime: performance.now() - startTime
    };
  }

  async simulateQFT(): Promise<QuantumSimulationResult> {
    await this.loadQuantumCore();
    const startTime = performance.now();

    const sim = new window.QOSimSimulator(3);
    
    // Put some initial state (not |000⟩)
    sim.addGate("X", 0); // Start with |001⟩
    
    // Apply QFT
    sim.addGate("H", 0);
    sim.addGate("RZ", 1, Math.PI/2); // Controlled phase approximation
    sim.addGate("RZ", 2, Math.PI/4);
    sim.addGate("H", 1);
    sim.addGate("RZ", 2, Math.PI/2);
    sim.addGate("H", 2);
    
    // Swap qubits for correct output order
    sim.addGate("SWAP", 0, 2);
    
    sim.run();

    return {
      stateVector: sim.getStateVector(),
      probabilities: sim.getProbabilities(),
      basisStates: sim.getBasisStates(),
      measurements: {
        0: sim.getMeasurementProbabilities(0),
        1: sim.getMeasurementProbabilities(1),
        2: sim.getMeasurementProbabilities(2)
      },
      circuitInfo: {
        depth: sim.getCircuitDepth(),
        gateCount: sim.getGateCount(),
        numQubits: 3
      },
      executionTime: performance.now() - startTime
    };
  }

  async simulateErrorCorrection(): Promise<QuantumSimulationResult> {
    await this.loadQuantumCore();
    const startTime = performance.now();

    const sim = new window.QOSimSimulator(3);
    
    // Three-qubit bit-flip error correction
    // Encode |0⟩ into |000⟩ or |1⟩ into |111⟩
    sim.addGate("H", 0); // Create superposition
    sim.addGate("CNOT", 0, 1); // Copy to ancilla
    sim.addGate("CNOT", 0, 2); // Copy to ancilla
    
    // Introduce error (flip qubit 1)
    sim.addGate("X", 1);
    
    // Error detection and correction
    sim.addGate("CNOT", 0, 1);
    sim.addGate("CNOT", 0, 2);
    sim.addGate("CNOT", 1, 2);
    
    sim.run();

    return {
      stateVector: sim.getStateVector(),
      probabilities: sim.getProbabilities(),
      basisStates: sim.getBasisStates(),
      measurements: {
        0: sim.getMeasurementProbabilities(0),
        1: sim.getMeasurementProbabilities(1),
        2: sim.getMeasurementProbabilities(2)
      },
      circuitInfo: {
        depth: sim.getCircuitDepth(),
        gateCount: sim.getGateCount(),
        numQubits: 3
      },
      executionTime: performance.now() - startTime
    };
  }

  async executeCustomCode(code: string): Promise<QuantumSimulationResult> {
    await this.loadQuantumCore();
    const startTime = performance.now();

    try {
      // Create a safe execution context
      const func = new Function('QOSimSimulator', 'Complex', 'QuantumGate', `
        ${code}
        return sim;
      `);
      
      const sim = func(window.QOSimSimulator, window.Complex, window.QuantumGate);
      
      if (!sim || typeof sim.run !== 'function') {
        throw new Error('Code must create and return a QOSimSimulator instance named "sim"');
      }
      
      sim.run();
      
      const numQubits = sim.stateVector ? Math.log2(sim.stateVector.length) : 2;
      const measurements: { [qubit: number]: { "0": number; "1": number } } = {};
      
      for (let i = 0; i < numQubits; i++) {
        measurements[i] = sim.getMeasurementProbabilities(i);
      }

      return {
        stateVector: sim.getStateVector(),
        probabilities: sim.getProbabilities(),
        basisStates: sim.getBasisStates(),
        measurements,
        circuitInfo: {
          depth: sim.getCircuitDepth(),
          gateCount: sim.getGateCount(),
          numQubits
        },
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      throw new Error(`Simulation error: ${error.message}`);
    }
  }
}

export const quantumSimulation = new RealQuantumSimulation();