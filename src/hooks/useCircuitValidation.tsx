
import { useState, useCallback, useEffect } from 'react';
import { gateRegistry } from '@/services/GateRegistry';
import { circuitRenderValidation, type CircuitRenderState } from '@/services/CircuitRenderValidation';
import { Gate } from './useCircuitState';

export function useCircuitValidation() {
  const [validationState, setValidationState] = useState<CircuitRenderState>({
    steps: [],
    qubits: 5,
    isValid: true,
    errors: []
  });

  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize gate registry on mount
  useEffect(() => {
    console.log('🔧 Initializing circuit validation...');
    
    // Ensure gate registry is initialized
    const availableGates = gateRegistry.getAvailableGateTypes();
    console.log('✅ Gate registry ready with gates:', availableGates);
    
    setIsInitialized(true);
  }, []);

  const validateCircuit = useCallback((circuit: Gate[], numQubits: number = 5) => {
    if (!isInitialized) {
      console.warn('⚠️ Gate registry not initialized yet');
      return {
        steps: [],
        qubits: numQubits,
        isValid: false,
        errors: ['Gate registry not initialized']
      };
    }

    const validation = circuitRenderValidation.validateCircuitForRendering(circuit, numQubits);
    setValidationState(validation);
    return validation;
  }, [isInitialized]);

  const validateGateType = useCallback((gateType: string) => {
    if (!isInitialized) {
      return { isValid: false, error: 'Gate registry not initialized' };
    }
    
    return gateRegistry.validateGateExists(gateType);
  }, [isInitialized]);

  const validateQubitIndex = useCallback((qubitIndex: number, numQubits: number = 5) => {
    if (typeof qubitIndex !== 'number' || qubitIndex < 0 || qubitIndex >= numQubits) {
      return {
        isValid: false,
        error: `Invalid qubit index: ${qubitIndex}. Must be between 0 and ${numQubits - 1}`
      };
    }
    return { isValid: true };
  }, []);

  const safeAddGate = useCallback((qubitIndex: number, gateType: string, circuitState: any, setCircuitState: any) => {
    if (!isInitialized) {
      console.error('❌ Cannot add gate: Gate registry not initialized');
      return false;
    }

    circuitRenderValidation.addGateToCircuit(qubitIndex, gateType, circuitState, setCircuitState);
    return true;
  }, [isInitialized]);

  const safeRenderCircuit = useCallback((circuit: any) => {
    if (!isInitialized) {
      console.warn('⚠️ Cannot render: Gate registry not initialized');
      return null;
    }

    return circuitRenderValidation.renderCircuit(circuit);
  }, [isInitialized]);

  const getAvailableGates = useCallback(() => {
    if (!isInitialized) {
      return [];
    }
    return gateRegistry.getAvailableGateTypes();
  }, [isInitialized]);

  const getGateDefinition = useCallback((gateType: string) => {
    if (!isInitialized) {
      return null;
    }
    return gateRegistry.getGate(gateType);
  }, [isInitialized]);

  return {
    validationState,
    isInitialized,
    validateCircuit,
    validateGateType,
    validateQubitIndex,
    safeAddGate,
    safeRenderCircuit,
    getAvailableGates,
    getGateDefinition
  };
}
