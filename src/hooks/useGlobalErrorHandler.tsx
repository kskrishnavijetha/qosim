
import { useCallback } from 'react';
import { globalErrorHandler, ErrorCategory } from '@/services/GlobalErrorHandler';

export function useGlobalErrorHandler() {
  const handleError = useCallback((
    error: Error, 
    category: ErrorCategory, 
    context?: any
  ) => {
    switch (category) {
      case 'circuit':
        return globalErrorHandler.handleCircuitError(error, context);
      case 'sdk':
        return globalErrorHandler.handleSDKError(error, context);
      case 'simulation':
        return globalErrorHandler.handleSimulationError(error, context);
      case 'system':
        return globalErrorHandler.handleSystemError(error, context);
      default:
        return globalErrorHandler.handleSystemError(error, context);
    }
  }, []);

  const handleCircuitError = useCallback((error: Error, context?: any) => {
    return globalErrorHandler.handleCircuitError(error, context);
  }, []);

  const handleSDKError = useCallback((error: Error, context?: any) => {
    return globalErrorHandler.handleSDKError(error, context);
  }, []);

  const handleSimulationError = useCallback((error: Error, context?: any) => {
    return globalErrorHandler.handleSimulationError(error, context);
  }, []);

  const handleSystemError = useCallback((error: Error, context?: any) => {
    return globalErrorHandler.handleSystemError(error, context);
  }, []);

  return {
    handleError,
    handleCircuitError,
    handleSDKError,
    handleSimulationError,
    handleSystemError
  };
}
