
import { useCallback } from 'react';
import { useCircuitState } from './useCircuitState';
import { useErrorHandling } from './useErrorHandling';
import { errorHandlingService } from '@/services/ErrorHandlingService';

export function useCircuitStateWithErrorHandling() {
  const circuitState = useCircuitState();
  const { validateCircuit, handleBackendError, handleRuntimeError } = useErrorHandling();

  // Enhanced addGate with error handling
  const addGateWithValidation = useCallback((newGate: any) => {
    try {
      // Add the gate first
      circuitState.addGate(newGate);
      
      // Then validate the entire circuit
      const updatedCircuit = [...circuitState.circuit, newGate];
      validateCircuit(updatedCircuit);
      
    } catch (error) {
      handleRuntimeError(error as Error, { gate: newGate });
    }
  }, [circuitState, validateCircuit, handleRuntimeError]);

  // Enhanced simulation with error handling
  const simulateWithErrorHandling = useCallback(async (gates: any[]) => {
    try {
      // Validate circuit before simulation
      const errors = validateCircuit(gates);
      const criticalErrors = errors.filter(e => e.severity === 'critical');
      
      if (criticalErrors.length > 0) {
        throw new Error(`Cannot simulate: ${criticalErrors.length} critical errors found`);
      }
      
      // Run simulation
      await circuitState.simulateQuantumState(gates);
      
    } catch (error) {
      console.error('Simulation failed:', error);
      
      if (error.message?.includes('backend') || error.message?.includes('API')) {
        handleBackendError(error, 'quantum-simulator');
      } else {
        handleRuntimeError(error as Error, { gates });
      }
    }
  }, [circuitState, validateCircuit, handleBackendError, handleRuntimeError]);

  // Enhanced mode change with error handling
  const handleModeChangeWithValidation = useCallback(async (mode: any) => {
    try {
      await circuitState.handleModeChange(mode);
    } catch (error) {
      handleBackendError(error, `${mode}-backend`);
    }
  }, [circuitState, handleBackendError]);

  return {
    ...circuitState,
    addGate: addGateWithValidation,
    simulateQuantumState: simulateWithErrorHandling,
    handleModeChange: handleModeChangeWithValidation,
    // Add method to manually trigger validation
    validateCurrentCircuit: () => validateCircuit(circuitState.circuit)
  };
}
