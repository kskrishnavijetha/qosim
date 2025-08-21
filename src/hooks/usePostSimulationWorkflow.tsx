
import { useState, useCallback } from 'react';
import { QuantumBackendResult } from '@/services/quantumBackendService';
import { Gate } from './useCircuitState';

export interface SimulationStep {
  step: number;
  gate: Gate | null;
  stateVector: { real: number; imaginary: number; magnitude: number; phase: number }[];
  measurementProbabilities: Record<string, number>;
  description: string;
}

export interface WorkflowState {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  playbackSpeed: number;
  showAdvanced: boolean;
}

export function usePostSimulationWorkflow() {
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [workflowState, setWorkflowState] = useState<WorkflowState>({
    currentStep: 0,
    totalSteps: 0,
    isPlaying: false,
    playbackSpeed: 1000,
    showAdvanced: false
  });

  const generateStepByStepSimulation = useCallback(async (
    gates: Gate[],
    numQubits: number,
    executeStepFn: (gates: Gate[], shots?: number) => Promise<QuantumBackendResult | null>
  ) => {
    console.log('🔄 Generating step-by-step simulation for', gates.length, 'gates');
    
    const steps: SimulationStep[] = [];
    
    // Initial state
    const initialResult = await executeStepFn([], 1024);
    if (initialResult) {
      steps.push({
        step: 0,
        gate: null,
        stateVector: initialResult.stateVector,
        measurementProbabilities: initialResult.measurementProbabilities,
        description: 'Initial state |0...0⟩'
      });
    }
    
    // Apply gates one by one
    for (let i = 0; i < gates.length; i++) {
      const partialCircuit = gates.slice(0, i + 1);
      const result = await executeStepFn(partialCircuit, 1024);
      
      if (result) {
        steps.push({
          step: i + 1,
          gate: gates[i],
          stateVector: result.stateVector,
          measurementProbabilities: result.measurementProbabilities,
          description: `Applied ${gates[i].type} gate to qubit ${gates[i].qubit || gates[i].qubits?.join(',') || 'unknown'}`
        });
      }
    }
    
    setSimulationSteps(steps);
    setWorkflowState(prev => ({
      ...prev,
      totalSteps: steps.length,
      currentStep: steps.length - 1
    }));
    
    console.log('✅ Generated', steps.length, 'simulation steps');
    return steps;
  }, []);

  const playSimulation = useCallback(() => {
    setWorkflowState(prev => ({ ...prev, isPlaying: true, currentStep: 0 }));
    
    const interval = setInterval(() => {
      setWorkflowState(prev => {
        if (prev.currentStep >= prev.totalSteps - 1) {
          clearInterval(interval);
          return { ...prev, isPlaying: false };
        }
        return { ...prev, currentStep: prev.currentStep + 1 };
      });
    }, workflowState.playbackSpeed);
  }, [workflowState.playbackSpeed]);

  const pauseSimulation = useCallback(() => {
    setWorkflowState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const setStep = useCallback((step: number) => {
    setWorkflowState(prev => ({
      ...prev,
      currentStep: Math.max(0, Math.min(step, prev.totalSteps - 1)),
      isPlaying: false
    }));
  }, []);

  const setPlaybackSpeed = useCallback((speed: number) => {
    setWorkflowState(prev => ({ ...prev, playbackSpeed: speed }));
  }, []);

  const toggleAdvancedView = useCallback(() => {
    setWorkflowState(prev => ({ ...prev, showAdvanced: !prev.showAdvanced }));
  }, []);

  return {
    simulationSteps,
    workflowState,
    generateStepByStepSimulation,
    playSimulation,
    pauseSimulation,
    setStep,
    setPlaybackSpeed,
    toggleAdvancedView
  };
}
