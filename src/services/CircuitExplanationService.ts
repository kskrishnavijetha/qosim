
import { Gate } from '@/hooks/useCircuitState';
import { QuantumBackendResult } from '@/services/quantumBackendService';

export interface CircuitExplanation {
  gateAnalysis: string;
  stateEvolution: string;
  measurementExplanation: string;
  fullExplanation: string;
  confidence: number;
}

export class CircuitExplanationService {
  private static instance: CircuitExplanationService;

  static getInstance(): CircuitExplanationService {
    if (!CircuitExplanationService.instance) {
      CircuitExplanationService.instance = new CircuitExplanationService();
    }
    return CircuitExplanationService.instance;
  }

  async generateExplanation(
    gates: Gate[],
    result: QuantumBackendResult,
    numQubits: number
  ): Promise<CircuitExplanation> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const gateAnalysis = this.analyzeGates(gates);
    const stateEvolution = this.analyzeStateEvolution(gates, numQubits);
    const measurementExplanation = this.analyzeMeasurementResults(result);
    
    const fullExplanation = this.generateFullExplanation(
      gateAnalysis,
      stateEvolution,
      measurementExplanation,
      gates,
      result
    );

    return {
      gateAnalysis,
      stateEvolution,
      measurementExplanation,
      fullExplanation,
      confidence: this.calculateConfidence(gates, result)
    };
  }

  private analyzeGates(gates: Gate[]): string {
    if (gates.length === 0) {
      return "No gates were applied to this circuit - all qubits remain in their initial |0⟩ state.";
    }

    const gateTypes = new Map<string, number>();
    gates.forEach(gate => {
      const count = gateTypes.get(gate.type) || 0;
      gateTypes.set(gate.type, count + 1);
    });

    const descriptions: string[] = [];
    
    // Analyze specific gate patterns
    if (gateTypes.has('H')) {
      const hCount = gateTypes.get('H')!;
      descriptions.push(`${hCount} Hadamard gate${hCount > 1 ? 's' : ''} create${hCount === 1 ? 's' : ''} superposition`);
    }

    if (gateTypes.has('CNOT') || gateTypes.has('CX')) {
      const cnotCount = (gateTypes.get('CNOT') || 0) + (gateTypes.get('CX') || 0);
      descriptions.push(`${cnotCount} CNOT gate${cnotCount > 1 ? 's' : ''} create${cnotCount === 1 ? 's' : ''} entanglement`);
    }

    if (gateTypes.has('X')) {
      descriptions.push(`X gates flip qubit states`);
    }

    if (gateTypes.has('Y')) {
      descriptions.push(`Y gates apply complex rotations`);
    }

    if (gateTypes.has('Z')) {
      descriptions.push(`Z gates apply phase flips`);
    }

    return descriptions.length > 0 
      ? descriptions.join(', ') + '.'
      : `Applied ${gates.length} quantum gates to modify the circuit state.`;
  }

  private analyzeStateEvolution(gates: Gate[], numQubits: number): string {
    if (gates.length === 0) {
      return `All ${numQubits} qubits start and remain in the |0⟩ state.`;
    }

    const evolution: string[] = [];
    evolution.push(`Circuit starts with all ${numQubits} qubits in |${'0'.repeat(numQubits)}⟩`);

    // Track common patterns
    const hasH = gates.some(g => g.type === 'H');
    const hasCNOT = gates.some(g => g.type === 'CNOT' || g.type === 'CX');

    if (hasH && !hasCNOT) {
      evolution.push("Hadamard gates create independent superposition states");
    } else if (hasH && hasCNOT) {
      evolution.push("Hadamard gates create superposition, then CNOT gates create entanglement");
    } else if (hasCNOT && !hasH) {
      evolution.push("CNOT gates create correlations between qubits");
    }

    // Check for Bell state pattern
    if (this.isBellStatePattern(gates)) {
      evolution.push("This creates a Bell state - maximally entangled qubits");
    }

    // Check for GHZ pattern
    if (this.isGHZPattern(gates)) {
      evolution.push("This creates a GHZ state - multi-qubit entanglement");
    }

    return evolution.join('. ') + '.';
  }

  private analyzeMeasurementResults(result: QuantumBackendResult): string {
    const probs = result.measurementProbabilities;
    const sortedStates = Object.entries(probs)
      .filter(([_, prob]) => prob > 0.001)
      .sort(([_, a], [__, b]) => b - a);

    if (sortedStates.length === 0) {
      return "No significant measurement outcomes detected.";
    }

    const explanations: string[] = [];
    const topState = sortedStates[0];
    const topProb = topState[1];

    if (sortedStates.length === 1) {
      explanations.push(`Measurement always gives |${topState[0]}⟩ (${(topProb * 100).toFixed(1)}%)`);
    } else if (sortedStates.length === 2) {
      const [state1, prob1] = sortedStates[0];
      const [state2, prob2] = sortedStates[1];
      
      if (Math.abs(prob1 - prob2) < 0.1) {
        explanations.push(`Equal probability of measuring |${state1}⟩ and |${state2}⟩ (≈50% each)`);
        
        // Check for Bell state signature
        if ((state1 === '00' && state2 === '11') || (state1 === '01' && state2 === '10')) {
          explanations.push("This is characteristic of a Bell state");
        }
      } else {
        explanations.push(`Most likely to measure |${state1}⟩ (${(prob1 * 100).toFixed(1)}%) or |${state2}⟩ (${(prob2 * 100).toFixed(1)}%)`);
      }
    } else {
      explanations.push(`Multiple possible outcomes: |${topState[0]}⟩ most likely at ${(topProb * 100).toFixed(1)}%`);
      
      if (this.isUniformDistribution(sortedStates)) {
        explanations.push("Results show uniform superposition");
      }
    }

    // Check for entanglement signatures
    if (this.hasEntanglementSignature(sortedStates)) {
      explanations.push("The correlated outcomes confirm quantum entanglement");
    }

    return explanations.join('. ') + '.';
  }

  private generateFullExplanation(
    gateAnalysis: string,
    stateEvolution: string,
    measurementExplanation: string,
    gates: Gate[],
    result: QuantumBackendResult
  ): string {
    const parts: string[] = [];

    // Introduction
    if (gates.length === 0) {
      return "This circuit contains no gates, so all qubits remain in their initial |0⟩ state. Measurement will always yield all zeros.";
    }

    // Gate explanation
    parts.push(`In this circuit, ${gateAnalysis.toLowerCase()}`);

    // Evolution explanation  
    parts.push(stateEvolution);

    // Results explanation
    parts.push(measurementExplanation);

    // Add insight based on pattern recognition
    const insight = this.generateInsight(gates, result);
    if (insight) {
      parts.push(insight);
    }

    return parts.join(' ');
  }

  private generateInsight(gates: Gate[], result: QuantumBackendResult): string | null {
    // Bell state insight
    if (this.isBellStatePattern(gates)) {
      return "This demonstrates quantum entanglement - measuring one qubit instantly determines the other's state, regardless of distance.";
    }

    // Superposition insight
    if (gates.some(g => g.type === 'H') && gates.length === 1) {
      return "This demonstrates quantum superposition - the qubit exists in both |0⟩ and |1⟩ states simultaneously until measured.";
    }

    // GHZ insight
    if (this.isGHZPattern(gates)) {
      return "This creates multi-particle entanglement, useful for quantum error correction and distributed quantum computing.";
    }

    return null;
  }

  private isBellStatePattern(gates: Gate[]): boolean {
    if (gates.length !== 2) return false;
    const hasH = gates.some(g => g.type === 'H' && g.qubit === 0);
    const hasCNOT = gates.some(g => (g.type === 'CNOT' || g.type === 'CX') && 
      Array.isArray(g.qubits) && g.qubits[0] === 0 && g.qubits[1] === 1);
    return hasH && hasCNOT;
  }

  private isGHZPattern(gates: Gate[]): boolean {
    const hasH = gates.some(g => g.type === 'H' && g.qubit === 0);
    const cnotCount = gates.filter(g => g.type === 'CNOT' || g.type === 'CX').length;
    return hasH && cnotCount >= 2;
  }

  private isUniformDistribution(sortedStates: [string, number][]): boolean {
    if (sortedStates.length < 2) return false;
    const avgProb = 1 / sortedStates.length;
    return sortedStates.every(([_, prob]) => Math.abs(prob - avgProb) < 0.1);
  }

  private hasEntanglementSignature(sortedStates: [string, number][]): boolean {
    // Look for correlated measurement patterns
    return sortedStates.some(([state, prob]) => {
      if (prob < 0.3) return false;
      // Check for Bell-like patterns (00, 11 or 01, 10)
      return (state === '00' || state === '11' || state === '01' || state === '10');
    });
  }

  private calculateConfidence(gates: Gate[], result: QuantumBackendResult): number {
    let confidence = 0.8; // Base confidence

    // Higher confidence for well-known patterns
    if (this.isBellStatePattern(gates)) confidence = 0.95;
    if (this.isGHZPattern(gates)) confidence = 0.92;
    
    // Lower confidence for complex circuits
    if (gates.length > 10) confidence *= 0.9;
    if (gates.length > 20) confidence *= 0.8;

    return Math.max(0.6, Math.min(0.98, confidence));
  }
}

export const circuitExplanationService = CircuitExplanationService.getInstance();
