
import { useCallback, useEffect } from 'react';
import { useQuantumErrorHandler } from './useQuantumErrorHandler';

export function useCircuitErrorHandling() {
  const { handleError } = useQuantumErrorHandler();

  // Wrap simulation functions with error handling
  const wrapWithErrorHandling = useCallback(<T extends any[], R>(
    fn: (...args: T) => R | Promise<R>,
    context: string
  ) => {
    return async (...args: T): Promise<R | null> => {
      try {
        const result = await fn(...args);
        return result;
      } catch (error) {
        console.error(`Error in ${context}:`, error);
        handleError(error, context);
        return null;
      }
    };
  }, [handleError]);

  // Global error handler for unhandled promise rejections
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      handleError(event.reason, 'Unhandled Promise Rejection');
      event.preventDefault(); // Prevent the default browser behavior
    };

    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      handleError(event.error, 'Global Runtime Error');
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, [handleError]);

  return {
    wrapWithErrorHandling,
    handleError
  };
}
