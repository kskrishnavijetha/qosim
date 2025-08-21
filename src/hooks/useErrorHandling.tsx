
import { useCallback, useEffect } from 'react';
import { Gate } from './useCircuitState';
import { errorHandlingService } from '@/services/ErrorHandlingService';

export function useErrorHandling() {
  // Circuit validation
  const validateCircuit = useCallback((circuit: Gate[]) => {
    console.log('🔍 Validating circuit for errors:', circuit);
    
    // Clear previous circuit errors
    errorHandlingService.clearErrors({ type: 'circuit' });
    
    // Run validation
    const errors = errorHandlingService.validateCircuit(circuit);
    
    if (errors.length > 0) {
      console.log('❌ Circuit validation errors found:', errors);
    } else {
      console.log('✅ Circuit validation passed');
    }
    
    return errors;
  }, []);

  // Code validation
  const validateCode = useCallback((code: string, language: 'qiskit' | 'cirq' | 'qasm') => {
    console.log('🔍 Validating code for errors:', { code: code.substring(0, 100), language });
    
    // Clear previous syntax errors
    errorHandlingService.clearErrors({ type: 'syntax' });
    
    // Run validation
    const errors = errorHandlingService.validateCode(code, language);
    
    if (errors.length > 0) {
      console.log('❌ Code validation errors found:', errors);
    } else {
      console.log('✅ Code validation passed');
    }
    
    return errors;
  }, []);

  // Backend error handling
  const handleBackendError = useCallback((error: any, backend: string) => {
    console.log('❌ Backend error occurred:', { error, backend });
    
    return errorHandlingService.handleBackendError(error, backend);
  }, []);

  // Runtime error handling
  const handleRuntimeError = useCallback((error: Error, context?: any) => {
    console.log('❌ Runtime error occurred:', { error, context });
    
    return errorHandlingService.addError({
      type: 'runtime',
      severity: 'critical',
      message: error.message || 'Runtime error occurred',
      cause: error.stack || 'Unknown runtime error',
      possibleFix: 'Check console logs and fix any undefined variables or function calls',
      context
    });
  }, []);

  // Connection error handling
  const handleConnectionError = useCallback((error: any, service: string) => {
    console.log('❌ Connection error occurred:', { error, service });
    
    return errorHandlingService.addError({
      type: 'connection',
      severity: 'warning',
      message: `Connection to ${service} failed`,
      cause: error.message || 'Network or service unavailable',
      possibleFix: 'Check your internet connection and service availability'
    });
  }, []);

  return {
    validateCircuit,
    validateCode,
    handleBackendError,
    handleRuntimeError,
    handleConnectionError
  };
}
