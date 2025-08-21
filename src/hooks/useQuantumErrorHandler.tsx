
import { useState, useCallback, useRef, useEffect } from 'react';
import { ErrorDetails } from '@/components/error-handling/ErrorModal';

export function useQuantumErrorHandler() {
  const [errors, setErrors] = useState<ErrorDetails[]>([]);
  const [currentError, setCurrentError] = useState<ErrorDetails | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [consoleVisible, setConsoleVisible] = useState(false);
  const toastTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (showToast) {
      toastTimeoutRef.current = setTimeout(() => {
        setShowToast(false);
      }, 5000);
    }
    
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [showToast]);

  const categorizeError = (error: any): ErrorDetails['category'] => {
    const errorMessage = error?.message || error?.toString() || '';
    
    if (errorMessage.includes('undefined') || errorMessage.includes('null')) {
      return 'Syntax Error';
    }
    if (errorMessage.includes('qubit') || errorMessage.includes('gate')) {
      return 'Backend Error';
    }
    if (errorMessage.includes('timeout') || errorMessage.includes('time')) {
      return 'Timeout';
    }
    if (errorMessage.includes('memory') || errorMessage.includes('limit')) {
      return 'Resource Limit';
    }
    
    return 'Simulation Error';
  };

  const generateSuggestions = (error: any, category: ErrorDetails['category']): string[] => {
    const suggestions: string[] = [];
    const errorMessage = error?.message || error?.toString() || '';

    if (category === 'Syntax Error') {
      if (errorMessage.includes('undefined')) {
        suggestions.push('Check that all qubits are properly defined before use');
        suggestions.push('Verify circuit gates have valid qubit assignments');
        suggestions.push('Ensure all variables are initialized before simulation');
      }
    } else if (category === 'Backend Error') {
      suggestions.push('Verify all qubits are within the valid range (0-4)');
      suggestions.push('Check that multi-qubit gates have the correct number of qubits');
      suggestions.push('Ensure gate parameters are properly configured');
    } else if (category === 'Timeout') {
      suggestions.push('Try reducing the circuit complexity');
      suggestions.push('Check your internet connection for cloud backends');
      suggestions.push('Consider using a local simulator for large circuits');
    } else if (category === 'Resource Limit') {
      suggestions.push('Reduce the number of qubits in your circuit');
      suggestions.push('Simplify complex gate operations');
      suggestions.push('Try running smaller test circuits first');
    } else {
      suggestions.push('Check the browser console for more details');
      suggestions.push('Try refreshing the page and running the circuit again');
      suggestions.push('Report this issue if it continues to occur');
    }

    return suggestions;
  };

  const handleError = useCallback((error: any, context?: string) => {
    console.error('Quantum error detected:', error);

    const category = categorizeError(error);
    const suggestions = generateSuggestions(error, category);
    
    const errorDetails: ErrorDetails = {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: context || 'Simulation Error',
      description: error?.message || 'An unexpected error occurred during quantum circuit execution',
      category,
      trace: error?.stack || error?.toString() || 'No stack trace available',
      suggestions,
      timestamp: Date.now()
    };

    setErrors(prev => [errorDetails, ...prev.slice(0, 49)]); // Keep last 50 errors
    setCurrentError(errorDetails);
    setShowToast(true);
    
    // Also show console if we have multiple errors
    if (errors.length >= 2) {
      setConsoleVisible(true);
    }

    return errorDetails;
  }, [errors.length]);

  const dismissToast = useCallback(() => {
    setShowToast(false);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
  }, []);

  const viewErrorDetails = useCallback((error?: ErrorDetails) => {
    if (error) {
      setCurrentError(error);
    }
    setShowModal(true);
    setShowToast(false);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors([]);
    setCurrentError(null);
    setShowModal(false);
    setShowToast(false);
  }, []);

  const toggleConsole = useCallback(() => {
    setConsoleVisible(!consoleVisible);
  }, [consoleVisible]);

  return {
    errors,
    currentError,
    showModal,
    showToast,
    consoleVisible,
    handleError,
    dismissToast,
    viewErrorDetails,
    closeModal,
    clearAllErrors,
    toggleConsole
  };
}
