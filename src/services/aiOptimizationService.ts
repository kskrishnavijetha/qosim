
import { Gate } from '@/store/circuitStore';

export interface OptimizationResult {
  optimizedGates: Gate[];
  optimizations: OptimizationStep[];
  metrics: {
    originalDepth: number;
    optimizedDepth: number;
    gatesRemoved: number;
    gatesAdded: number;
    improvement: number;
  };
}

export interface OptimizationStep {
  type: 'gate_removal' | 'gate_merge' | 'gate_reorder' | 'gate_decomposition';
  description: string;
  before: Gate[];
  after: Gate[];
  benefit: string;
}

export interface CircuitSuggestion {
  type: 'error' | 'warning' | 'optimization' | 'enhancement';
  title: string;
  description: string;
  gateIds: string[];
  action?: () => void;
}

export class AIOptimizationService {
  // Main optimization method
  async optimizeCircuit(gates: Gate[]): Promise<OptimizationResult> {
    const optimizations: OptimizationStep[] = [];
    let currentGates = [...gates];
    
    // Step 1: Remove redundant gates
    const redundantResult = this.removeRedundantGates(currentGates);
    if (redundantResult.optimizations.length > 0) {
      optimizations.push(...redundantResult.optimizations);
      currentGates = redundantResult.gates;
    }
    
    // Step 2: Merge consecutive rotation gates
    const mergeResult = this.mergeRotationGates(currentGates);
    if (mergeResult.optimizations.length > 0) {
      optimizations.push(...mergeResult.optimizations);
      currentGates = mergeResult.gates;
    }
    
    // Step 3: Reorder gates for better parallelization
    const reorderResult = this.reorderGatesForParallelization(currentGates);
    if (reorderResult.optimizations.length > 0) {
      optimizations.push(...reorderResult.optimizations);
      currentGates = reorderResult.gates;
    }
    
    // Step 4: Decompose complex gates if beneficial
    const decomposeResult = this.decomposeComplexGates(currentGates);
    if (decomposeResult.optimizations.length > 0) {
      optimizations.push(...decomposeResult.optimizations);
      currentGates = decomposeResult.gates;
    }
    
    const metrics = this.calculateMetrics(gates, currentGates);
    
    return {
      optimizedGates: currentGates,
      optimizations,
      metrics
    };
  }

  // Circuit analysis and suggestions
  async analyzeCircuit(gates: Gate[]): Promise<CircuitSuggestion[]> {
    const suggestions: CircuitSuggestion[] = [];
    
    // Check for common errors
    suggestions.push(...this.detectErrors(gates));
    
    // Check for optimization opportunities
    suggestions.push(...this.detectOptimizations(gates));
    
    // Check for enhancement opportunities
    suggestions.push(...this.detectEnhancements(gates));
    
    return suggestions;
  }

  private removeRedundantGates(gates: Gate[]): { gates: Gate[]; optimizations: OptimizationStep[] } {
    const optimizations: OptimizationStep[] = [];
    const result: Gate[] = [];
    
    for (let i = 0; i < gates.length; i++) {
      const currentGate = gates[i];
      
      // Check if the next gate cancels out the current one
      if (i + 1 < gates.length) {
        const nextGate = gates[i + 1];
        
        if (this.gatesCancel(currentGate, nextGate)) {
          optimizations.push({
            type: 'gate_removal',
            description: `Removed redundant ${currentGate.type} gates`,
            before: [currentGate, nextGate],
            after: [],
            benefit: 'Reduces circuit depth and gate count'
          });
          i++; // Skip the next gate too
          continue;
        }
      }
      
      result.push(currentGate);
    }
    
    return { gates: result, optimizations };
  }

  private mergeRotationGates(gates: Gate[]): { gates: Gate[]; optimizations: OptimizationStep[] } {
    const optimizations: OptimizationStep[] = [];
    const result: Gate[] = [];
    
    for (let i = 0; i < gates.length; i++) {
      const currentGate = gates[i];
      
      if (this.isRotationGate(currentGate)) {
        // Look for consecutive rotation gates on the same qubit
        const consecutiveRotations = [currentGate];
        let j = i + 1;
        
        while (j < gates.length && 
               this.isRotationGate(gates[j]) && 
               gates[j].qubit === currentGate.qubit &&
               gates[j].type === currentGate.type) {
          consecutiveRotations.push(gates[j]);
          j++;
        }
        
        if (consecutiveRotations.length > 1) {
          // Merge the rotations
          const totalAngle = consecutiveRotations.reduce((sum, gate) => 
            sum + (gate.params?.angle || 0), 0);
          
          const mergedGate: Gate = {
            ...currentGate,
            params: { ...currentGate.params, angle: totalAngle }
          };
          
          optimizations.push({
            type: 'gate_merge',
            description: `Merged ${consecutiveRotations.length} ${currentGate.type} gates`,
            before: consecutiveRotations,
            after: [mergedGate],
            benefit: 'Reduces gate count and potential error accumulation'
          });
          
          result.push(mergedGate);
          i = j - 1; // Skip the merged gates
        } else {
          result.push(currentGate);
        }
      } else {
        result.push(currentGate);
      }
    }
    
    return { gates: result, optimizations };
  }

  private reorderGatesForParallelization(gates: Gate[]): { gates: Gate[]; optimizations: OptimizationStep[] } {
    const optimizations: OptimizationStep[] = [];
    const result = [...gates];
    
    // Simple reordering: move independent gates earlier
    for (let i = 0; i < result.length - 1; i++) {
      for (let j = i + 1; j < result.length; j++) {
        if (this.canSwapGates(result[i], result[j])) {
          // Check if swapping would improve parallelization
          if (this.shouldSwapForParallelization(result, i, j)) {
            [result[i], result[j]] = [result[j], result[i]];
            
            optimizations.push({
              type: 'gate_reorder',
              description: `Reordered gates for better parallelization`,
              before: [gates[i], gates[j]],
              after: [result[i], result[j]],
              benefit: 'Improves circuit execution time on parallel hardware'
            });
          }
        }
      }
    }
    
    return { gates: result, optimizations };
  }

  private decomposeComplexGates(gates: Gate[]): { gates: Gate[]; optimizations: OptimizationStep[] } {
    const optimizations: OptimizationStep[] = [];
    const result: Gate[] = [];
    
    for (const gate of gates) {
      if (this.shouldDecomposeGate(gate)) {
        const decomposed = this.decomposeGate(gate);
        if (decomposed.length > 0) {
          optimizations.push({
            type: 'gate_decomposition',
            description: `Decomposed ${gate.type} gate into basic gates`,
            before: [gate],
            after: decomposed,
            benefit: 'Uses only basic gates supported by hardware'
          });
          result.push(...decomposed);
        } else {
          result.push(gate);
        }
      } else {
        result.push(gate);
      }
    }
    
    return { gates: result, optimizations };
  }

  private detectErrors(gates: Gate[]): CircuitSuggestion[] {
    const suggestions: CircuitSuggestion[] = [];
    
    // Check for gates on non-existent qubits
    const maxQubit = 7; // Assuming 8-qubit system
    gates.forEach(gate => {
      if (gate.qubit > maxQubit) {
        suggestions.push({
          type: 'error',
          title: 'Gate on invalid qubit',
          description: `Gate ${gate.type} is placed on qubit ${gate.qubit} which doesn't exist`,
          gateIds: [gate.id]
        });
      }
    });
    
    // Check for overlapping gates
    const timeStepMap = new Map<string, Gate[]>();
    gates.forEach(gate => {
      const key = `${gate.qubit}-${gate.timeStep}`;
      if (!timeStepMap.has(key)) {
        timeStepMap.set(key, []);
      }
      timeStepMap.get(key)!.push(gate);
    });
    
    timeStepMap.forEach((gatesAtPosition, key) => {
      if (gatesAtPosition.length > 1) {
        suggestions.push({
          type: 'error',
          title: 'Overlapping gates',
          description: `Multiple gates at the same position: ${key}`,
          gateIds: gatesAtPosition.map(g => g.id)
        });
      }
    });
    
    return suggestions;
  }

  private detectOptimizations(gates: Gate[]): CircuitSuggestion[] {
    const suggestions: CircuitSuggestion[] = [];
    
    // Detect redundant gate sequences
    for (let i = 0; i < gates.length - 1; i++) {
      const current = gates[i];
      const next = gates[i + 1];
      
      if (this.gatesCancel(current, next)) {
        suggestions.push({
          type: 'optimization',
          title: 'Redundant gate pair',
          description: `${current.type} and ${next.type} gates cancel each other out`,
          gateIds: [current.id, next.id]
        });
      }
    }
    
    // Detect merge opportunities
    const rotationGroups = this.groupConsecutiveRotations(gates);
    rotationGroups.forEach(group => {
      if (group.length > 1) {
        suggestions.push({
          type: 'optimization',
          title: 'Merge rotation gates',
          description: `${group.length} consecutive ${group[0].type} gates can be merged`,
          gateIds: group.map(g => g.id)
        });
      }
    });
    
    return suggestions;
  }

  private detectEnhancements(gates: Gate[]): CircuitSuggestion[] {
    const suggestions: CircuitSuggestion[] = [];
    
    // Suggest adding measurement gates
    const hasH = gates.some(g => g.type === 'H');
    const hasM = gates.some(g => g.type === 'M');
    
    if (hasH && !hasM) {
      suggestions.push({
        type: 'enhancement',
        title: 'Add measurement gates',
        description: 'Your circuit has superposition but no measurements to observe the results',
        gateIds: []
      });
    }
    
    // Suggest Bell state completion
    const hasCNOT = gates.some(g => g.type === 'CNOT');
    if (hasH && !hasCNOT) {
      suggestions.push({
        type: 'enhancement',
        title: 'Create entanglement',
        description: 'Add CNOT gates to create entangled states',
        gateIds: []
      });
    }
    
    return suggestions;
  }

  // Helper methods
  private gatesCancel(gate1: Gate, gate2: Gate): boolean {
    // Check if two gates cancel each other out
    if (gate1.qubit !== gate2.qubit) return false;
    
    // Same gate type that are self-inverse
    if (gate1.type === gate2.type && ['X', 'Y', 'Z', 'H'].includes(gate1.type)) {
      return true;
    }
    
    // Rotation gates with opposite angles
    if (gate1.type === gate2.type && this.isRotationGate(gate1)) {
      const angle1 = gate1.params?.angle || 0;
      const angle2 = gate2.params?.angle || 0;
      return Math.abs(angle1 + angle2) < 0.001; // Nearly zero
    }
    
    return false;
  }

  private isRotationGate(gate: Gate): boolean {
    return ['RX', 'RY', 'RZ'].includes(gate.type);
  }

  private canSwapGates(gate1: Gate, gate2: Gate): boolean {
    // Check if two gates can be swapped without changing circuit behavior
    if (gate1.qubit === gate2.qubit) return false;
    
    // Single qubit gates on different qubits can always be swapped
    if (!this.isMultiQubitGate(gate1) && !this.isMultiQubitGate(gate2)) {
      return true;
    }
    
    // More complex logic for multi-qubit gates would go here
    return false;
  }

  private isMultiQubitGate(gate: Gate): boolean {
    return ['CNOT', 'CZ', 'SWAP'].includes(gate.type);
  }

  private shouldSwapForParallelization(gates: Gate[], i: number, j: number): boolean {
    // Simple heuristic: prefer grouping gates by qubit
    const gate1 = gates[i];
    const gate2 = gates[j];
    
    // If gate2 is on a qubit that has gates before position i, it might be better to move it earlier
    for (let k = 0; k < i; k++) {
      if (gates[k].qubit === gate2.qubit) {
        return true;
      }
    }
    
    return false;
  }

  private shouldDecomposeGate(gate: Gate): boolean {
    // List of gates that should be decomposed into basic gates
    const complexGates = ['TOFFOLI', 'FREDKIN', 'CONTROLLED_RY'];
    return complexGates.includes(gate.type);
  }

  private decomposeGate(gate: Gate): Gate[] {
    // Decompose complex gates into basic gates
    switch (gate.type) {
      case 'TOFFOLI':
        // Decompose Toffoli gate (simplified)
        return [
          { ...gate, type: 'H', id: `${gate.id}_h1` },
          { ...gate, type: 'CNOT', id: `${gate.id}_cnot1` },
          { ...gate, type: 'H', id: `${gate.id}_h2` }
        ];
      default:
        return [];
    }
  }

  private groupConsecutiveRotations(gates: Gate[]): Gate[][] {
    const groups: Gate[][] = [];
    let currentGroup: Gate[] = [];
    
    for (const gate of gates) {
      if (this.isRotationGate(gate)) {
        if (currentGroup.length === 0 || 
            (currentGroup[currentGroup.length - 1].qubit === gate.qubit &&
             currentGroup[currentGroup.length - 1].type === gate.type)) {
          currentGroup.push(gate);
        } else {
          if (currentGroup.length > 0) {
            groups.push(currentGroup);
          }
          currentGroup = [gate];
        }
      } else {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      }
    }
    
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    return groups;
  }

  private calculateMetrics(originalGates: Gate[], optimizedGates: Gate[]): OptimizationResult['metrics'] {
    const originalDepth = this.calculateCircuitDepth(originalGates);
    const optimizedDepth = this.calculateCircuitDepth(optimizedGates);
    
    return {
      originalDepth,
      optimizedDepth,
      gatesRemoved: originalGates.length - optimizedGates.length,
      gatesAdded: Math.max(0, optimizedGates.length - originalGates.length),
      improvement: ((originalDepth - optimizedDepth) / originalDepth) * 100
    };
  }

  private calculateCircuitDepth(gates: Gate[]): number {
    if (gates.length === 0) return 0;
    return Math.max(...gates.map(gate => gate.timeStep)) + 1;
  }
}

export const aiOptimizationService = new AIOptimizationService();
