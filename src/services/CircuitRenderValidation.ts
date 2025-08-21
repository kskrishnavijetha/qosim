
import { gateRegistry } from './GateRegistry';
import { Gate } from '@/hooks/useCircuitState';

export interface CircuitStep {
  qubit: number;
  gate: any;
  gateType: string;
  position: number;
}

export interface CircuitRenderState {
  steps: CircuitStep[];
  qubits: number;
  isValid: boolean;
  errors: string[];
}

export class CircuitRenderValidation {
  private static instance: CircuitRenderValidation;

  static getInstance(): CircuitRenderValidation {
    if (!CircuitRenderValidation.instance) {
      CircuitRenderValidation.instance = new CircuitRenderValidation();
    }
    return CircuitRenderValidation.instance;
  }

  validateCircuitForRendering(circuit: Gate[], numQubits: number = 5): CircuitRenderState {
    console.log('🔍 Validating circuit for rendering:', { circuitLength: circuit?.length, numQubits });

    const errors: string[] = [];
    const validatedSteps: CircuitStep[] = [];

    // Check if circuit exists and is array
    if (!circuit || !Array.isArray(circuit)) {
      const error = "Circuit is undefined or invalid - expected array";
      console.error('❌', error);
      return {
        steps: [],
        qubits: numQubits,
        isValid: false,
        errors: [error]
      };
    }

    // Validate each circuit step
    circuit.forEach((gate, index) => {
      const stepValidation = this.validateCircuitStep(gate, index, numQubits);
      
      if (!stepValidation.isValid) {
        errors.push(...stepValidation.errors);
        console.error(`❌ Step ${index} validation failed:`, stepValidation.errors);
      } else if (stepValidation.step) {
        validatedSteps.push(stepValidation.step);
      }
    });

    const isValid = errors.length === 0;
    console.log(`${isValid ? '✅' : '❌'} Circuit validation complete:`, {
      isValid,
      validSteps: validatedSteps.length,
      errors: errors.length
    });

    return {
      steps: validatedSteps,
      qubits: numQubits,
      isValid,
      errors
    };
  }

  private validateCircuitStep(gate: Gate, stepIndex: number, numQubits: number): {
    isValid: boolean;
    step?: CircuitStep;
    errors: string[];
  } {
    const errors: string[] = [];

    // Validate gate object exists
    if (!gate || typeof gate !== 'object') {
      errors.push(`Step ${stepIndex}: Gate object is undefined or invalid`);
      return { isValid: false, errors };
    }

    // Validate gate type
    if (!gate.type) {
      errors.push(`Step ${stepIndex}: Gate type is undefined`);
      return { isValid: false, errors };
    }

    // Check if gate exists in registry
    const gateDefinition = gateRegistry.getGate(gate.type);
    if (!gateDefinition) {
      errors.push(`Step ${stepIndex}: Undefined gate type "${gate.type}"`);
      return { isValid: false, errors };
    }

    // Validate qubit indices
    const qubitIndices = this.extractQubitIndices(gate);
    for (const qubitIndex of qubitIndices) {
      if (qubitIndex < 0 || qubitIndex >= numQubits) {
        errors.push(`Step ${stepIndex}: Invalid qubit index ${qubitIndex} (must be 0-${numQubits - 1})`);
      }
    }

    // Validate position
    if (gate.position === undefined || gate.position < 0) {
      errors.push(`Step ${stepIndex}: Invalid position ${gate.position}`);
    }

    if (errors.length > 0) {
      return { isValid: false, errors };
    }

    // Create validated step
    const step: CircuitStep = {
      qubit: qubitIndices[0] || 0,
      gate: gateDefinition,
      gateType: gate.type,
      position: gate.position
    };

    return { isValid: true, step, errors: [] };
  }

  private extractQubitIndices(gate: Gate): number[] {
    const indices: number[] = [];

    if (gate.qubit !== undefined && gate.qubit >= 0) {
      indices.push(gate.qubit);
    }

    if (gate.qubits && Array.isArray(gate.qubits)) {
      indices.push(...gate.qubits.filter(q => q !== undefined && q >= 0));
    }

    if (indices.length === 0) {
      console.warn('⚠️ Gate has no valid qubit indices:', gate);
      return [0]; // Default to qubit 0
    }

    return indices;
  }

  addGateToCircuit(qubitIndex: number, gateType: string, circuitState: any, setCircuitState: any): void {
    console.log('🔄 Adding gate to circuit:', { qubitIndex, gateType });

    // Validate gate type exists
    const gateValidation = gateRegistry.validateGateExists(gateType);
    if (!gateValidation.isValid) {
      console.error('❌', gateValidation.error);
      return;
    }

    // Validate qubit index
    if (qubitIndex < 0) {
      console.error('❌ Invalid qubit index:', qubitIndex);
      return;
    }

    const gate = gateRegistry.getGate(gateType);
    if (!gate) {
      console.error('❌ Failed to get gate from registry:', gateType);
      return;
    }

    // Update circuit state safely
    try {
      setCircuitState((prev: any) => {
        if (!prev || !Array.isArray(prev.steps)) {
          console.warn('⚠️ Circuit state is invalid, initializing...');
          return {
            steps: [{ qubit: qubitIndex, gate, gateType, position: 0 }],
            qubits: 5
          };
        }

        return {
          ...prev,
          steps: [...prev.steps, { 
            qubit: qubitIndex, 
            gate, 
            gateType, 
            position: prev.steps.length 
          }]
        };
      });
      
      console.log('✅ Gate added successfully');
    } catch (error) {
      console.error('❌ Failed to update circuit state:', error);
    }
  }

  renderCircuit(circuit: any): any[] | null {
    console.log('🖼️ Rendering circuit:', circuit);

    const validation = this.validateCircuitForRendering(circuit?.steps || [], circuit?.qubits || 5);
    
    if (!validation.isValid) {
      console.error('❌ Cannot render invalid circuit:', validation.errors);
      return null;
    }

    return validation.steps.map((step, index) => {
      if (!step.gate) {
        console.error(`❌ Undefined gate at step ${index}`);
        return null;
      }
      
      return {
        key: index,
        gate: step.gate,
        qubit: step.qubit,
        gateType: step.gateType,
        position: step.position
      };
    }).filter(Boolean);
  }
}

export const circuitRenderValidation = CircuitRenderValidation.getInstance();
