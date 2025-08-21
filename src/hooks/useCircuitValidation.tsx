
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
    console.log('🔧 Initializing circuit validation hook...');
    
    try {
      // Ensure gate registry is initialized
      const availableGates = gateRegistry.getAvailableGateTypes();
      
      if (availableGates.length === 0) {
        console.error('❌ Gate registry is empty!');
        setIsInitialized(false);
        return;
      }
      
      console.log('✅ Gate registry ready with gates:', availableGates.length);
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ Failed to initialize gate registry:', error);
      setIsInitialized(false);
    }
  }, []);

  const validateCircuit = useCallback((circuit: Gate[], numQubits: number = 5) => {
    console.log('🔍 Validating circuit:', { circuitLength: circuit?.length, numQubits, isInitialized });

    if (!isInitialized) {
      console.warn('⚠️ Gate registry not initialized yet');
      return {
        steps: [],
        qubits: numQubits,
        isValid: false,
        errors: ['Gate registry not initialized']
      };
    }

    if (!circuit || !Array.isArray(circuit)) {
      const validation = {
        steps: [],
        qubits: numQubits,
        isValid: false,
        errors: ['Circuit is undefined or not an array']
      };
      setValidationState(validation);
      return validation;
    }

    const validation = circuitRenderValidation.validateCircuitForRendering(circuit, numQubits);
    setValidationState(validation);
    return validation;
  }, [isInitialized]);

  const validateGateType = useCallback((gateType: string) => {
    if (!isInitialized) {
      return { isValid: false, error: 'Gate registry not initialized' };
    }
    
    if (!gateType || typeof gateType !== 'string') {
      return { isValid: false, error: 'Gate type must be a non-empty string' };
    }

    return gateRegistry.validateGateExists(gateType);
  }, [isInitialized]);

  const validateQubitIndex = useCallback((qubitIndex: number, numQubits: number = 5) => {
    if (typeof qubitIndex !== 'number' || qubitIndex < 0 || qubitIndex >= numQubits || isNaN(qubitIndex)) {
      return {
        isValid: false,
        error: `Invalid qubit index: ${qubitIndex}. Must be between 0 and ${numQubits - 1}`
      };
    }
    return { isValid: true };
  }, []);

  const safeAddGate = useCallback((qubitIndex: number, gateType: string, circuitState: any, setCircuitState: any) => {
    console.log('🔄 Safe add gate called:', { qubitIndex, gateType, isInitialized });

    if (!isInitialized) {
      console.error('❌ Cannot add gate: Gate registry not initialized');
      return false;
    }

    // Validate gate type
    const gateValidation = validateGateType(gateType);
    if (!gateValidation.isValid) {
      console.error('❌ Invalid gate type:', gateValidation.error);
      return false;
    }

    // Validate qubit index
    const qubitValidation = validateQubitIndex(qubitIndex);
    if (!qubitValidation.isValid) {
      console.error('❌ Invalid qubit index:', qubitValidation.error);
      return false;
    }

    try {
      circuitRenderValidation.addGateToCircuit(qubitIndex, gateType, circuitState, setCircuitState);
      return true;
    } catch (error) {
      console.error('❌ Failed to add gate:', error);
      return false;
    }
  }, [isInitialized, validateGateType, validateQubitIndex]);

  const safeRenderCircuit = useCallback((circuit: any) => {
    if (!isInitialized) {
      console.warn('⚠️ Cannot render: Gate registry not initialized');
      return null;
    }

    if (!circuit) {
      console.warn('⚠️ Cannot render: Circuit is null or undefined');
      return null;
    }

    try {
      return circuitRenderValidation.renderCircuit(circuit);
    } catch (error) {
      console.error('❌ Failed to render circuit:', error);
      return null;
    }
  }, [isInitialized]);

  const getAvailableGates = useCallback(() => {
    if (!isInitialized) {
      return [];
    }
    try {
      return gateRegistry.getAvailableGateTypes();
    } catch (error) {
      console.error('❌ Failed to get available gates:', error);
      return [];
    }
  }, [isInitialized]);

  const getGateDefinition = useCallback((gateType: string) => {
    if (!isInitialized) {
      return null;
    }
    
    if (!gateType || typeof gateType !== 'string') {
      return null;
    }

    try {
      return gateRegistry.getGate(gateType);
    } catch (error) {
      console.error('❌ Failed to get gate definition:', error);
      return null;
    }
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
