
import { useState, useCallback } from 'react';
import { aiOptimizationEngine, OptimizationResult, CircuitAnalysis, ErrorPrediction } from '@/services/aiOptimizationEngine';
import { Gate } from '@/hooks/useCircuitWorkspace';
import { toast } from 'sonner';

export function useAIOptimization() {
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [circuitAnalysis, setCircuitAnalysis] = useState<CircuitAnalysis | null>(null);
  const [errorPredictions, setErrorPredictions] = useState<ErrorPrediction[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const optimizeCircuit = useCallback(async (
    circuit: Gate[],
    options: {
      optimizeDepth?: boolean;
      reduceGates?: boolean;
      errorCorrection?: boolean;
      preserveEntanglement?: boolean;
    } = {}
  ) => {
    setIsOptimizing(true);
    try {
      const result = await aiOptimizationEngine.optimizeCircuit(circuit, options);
      setOptimizationResult(result);
      return result;
    } catch (error) {
      console.error('Optimization failed:', error);
      toast.error('Circuit optimization failed');
      throw error;
    } finally {
      setIsOptimizing(false);
    }
  }, []);

  const analyzeCircuit = useCallback(async (circuit: Gate[]) => {
    setIsAnalyzing(true);
    try {
      const analysis = await aiOptimizationEngine.analyzeCircuit(circuit);
      setCircuitAnalysis(analysis);
      return analysis;
    } catch (error) {
      console.error('Circuit analysis failed:', error);
      toast.error('Circuit analysis failed');
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const predictErrors = useCallback(async (circuit: Gate[]) => {
    try {
      const predictions = await aiOptimizationEngine.predictErrorRates(circuit);
      setErrorPredictions(predictions);
      return predictions;
    } catch (error) {
      console.error('Error prediction failed:', error);
      toast.error('Error prediction failed');
      throw error;
    }
  }, []);

  const clearResults = useCallback(() => {
    setOptimizationResult(null);
    setCircuitAnalysis(null);
    setErrorPredictions([]);
  }, []);

  return {
    optimizationResult,
    circuitAnalysis,
    errorPredictions,
    isOptimizing,
    isAnalyzing,
    optimizeCircuit,
    analyzeCircuit,
    predictErrors,
    clearResults
  };
}
