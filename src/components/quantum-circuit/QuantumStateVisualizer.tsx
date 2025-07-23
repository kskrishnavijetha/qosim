
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw } from 'lucide-react';
import { BlochSphere3D } from './BlochSphere3D';
import { AmplitudeChart } from './AmplitudeChart';
import { StepByStepExecutor } from '../simulation/StepByStepExecutor';
import { useQuantumSimulation } from '@/hooks/useQuantumSimulation';
import { useQuantumBackend } from '@/hooks/useQuantumBackend';
import { useCircuitStore } from '@/store/circuitStore';

// Define normalized types for consistency
interface NormalizedQubitState {
  state: string;
  probability: number;
  blochCoordinates: { x: number; y: number; z: number };
}

interface NormalizedStateVector {
  real: number;
  imag: number;
}

export function QuantumStateVisualizer() {
  const { gates, numQubits } = useCircuitStore();
  const { simulationResult, isSimulating, simulate } = useQuantumSimulation();
  const { lastResult, isExecuting, executeCircuit } = useQuantumBackend();
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [isStepMode, setIsStepMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Use backend result if available, otherwise use local simulation result
  const displayResult = lastResult || simulationResult;
  const isRunning = isExecuting || isSimulating;

  // Debug logging
  useEffect(() => {
    console.log('📊 QuantumStateVisualizer: State updated', {
      lastResult,
      simulationResult,
      displayResult,
      gates: gates.length,
      isExecuting,
      isSimulating
    });
  }, [lastResult, simulationResult, gates, isExecuting, isSimulating]);

  const handleRunSimulation = async () => {
    if (gates.length === 0) return;
    
    console.log('🚀 Running simulation from visualizer with gates:', gates);
    
    try {
      // Convert store gates to backend format
      const circuitGates = gates.map(gate => ({
        id: gate.id,
        type: gate.type,
        qubit: gate.qubit || 0,
        position: gate.timeStep,
        angle: gate.params?.angle,
        controlQubit: gate.params?.controlQubit
      }));

      console.log('🔄 Converted gates for backend:', circuitGates);
      await executeCircuit(circuitGates, 'local', 1024);
    } catch (error) {
      console.error('❌ Simulation failed:', error);
    }
  };

  const handleStepExecution = () => {
    if (currentStep < gates.length) {
      const gatesUpToStep = gates.slice(0, currentStep + 1).map(gate => ({
        id: gate.id,
        type: gate.type,
        qubit: gate.qubit,
        position: gate.timeStep,
        angle: gate.params?.angle,
        controlQubit: gate.params?.controlQubit
      }));
      simulate(gatesUpToStep, numQubits);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleResetSteps = () => {
    setCurrentStep(0);
    simulate([], numQubits);
  };

  const handleResetState = () => {
    setCurrentStep(0);
    simulate([], numQubits);
  };

  // Helper function to normalize qubit state data
  const getQubitState = (index: number): NormalizedQubitState => {
    if (!displayResult?.qubitStates?.[index]) {
      return {
        state: '|0⟩',
        probability: 1,
        blochCoordinates: { x: 0, y: 0, z: 1 }
      };
    }

    const rawQubitState = displayResult.qubitStates[index];
    
    // Check if it's from backend (has different structure)
    if ('amplitude' in rawQubitState && 'phase' in rawQubitState) {
      const backendState = rawQubitState as any;
      return {
        state: backendState.state || '|0⟩',
        probability: backendState.probability || 0,
        blochCoordinates: {
          x: Math.sin(backendState.phase || 0) * Math.sqrt(backendState.probability || 0),
          y: 0,
          z: Math.cos(backendState.phase || 0) * Math.sqrt(1 - (backendState.probability || 0))
        }
      };
    }
    
    // Local simulation result - check if it already has the expected structure
    if ('blochCoordinates' in rawQubitState && 'state' in rawQubitState && 'probability' in rawQubitState) {
      return rawQubitState as NormalizedQubitState;
    }
    
    // Fallback conversion for unexpected formats
    const state = (rawQubitState as any).state || '|0⟩';
    const probability = (rawQubitState as any).probability || 0;
    
    return {
      state,
      probability,
      blochCoordinates: {
        x: 0,
        y: 0,
        z: probability < 0.5 ? -1 : 1
      }
    };
  };

  // Helper function to normalize state vector
  const getStateVector = (): NormalizedStateVector[] => {
    if (!displayResult?.stateVector || !Array.isArray(displayResult.stateVector)) {
      return [];
    }

    return displayResult.stateVector.map(item => {
      if ('imag' in item) {
        return { real: item.real, imag: item.imag };
      } else if ('imaginary' in item) {
        return { real: item.real, imag: (item as any).imaginary };
      }
      return { real: 0, imag: 0 };
    });
  };

  // Helper function to normalize measurement probabilities
  const getMeasurementProbabilities = (): number[] => {
    if (!displayResult?.measurementProbabilities) {
      return [];
    }

    if (Array.isArray(displayResult.measurementProbabilities)) {
      return displayResult.measurementProbabilities;
    } else if (typeof displayResult.measurementProbabilities === 'object') {
      // Convert Record<string, number> to number[]
      return Object.values(displayResult.measurementProbabilities);
    }
    
    return [];
  };

  // Helper function to get fidelity from either result type
  const getFidelity = (): number => {
    if ('fidelity' in displayResult) {
      return displayResult.fidelity;
    }
    // Default fidelity for backend results that don't provide it
    return 0.95;
  };

  // Helper function to get execution time
  const getExecutionTime = (): number => {
    return displayResult?.executionTime || 0;
  };

  return (
    <div className="space-y-4 h-full">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center justify-between">
            Real-time Quantum State Visualization
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {gates.length} gates | {numQubits} qubits
              </Badge>
              {lastResult && (
                <Badge variant="outline" className="text-quantum-glow">
                  Backend: {lastResult.backend}
                </Badge>
              )}
              {displayResult && (
                <Badge variant="outline" className="text-quantum-energy">
                  Results Ready
                </Badge>
              )}
              <Button
                onClick={handleRunSimulation}
                disabled={isRunning || gates.length === 0}
                size="sm"
                className="neon-border"
              >
                <Play className="w-3 h-3 mr-1" />
                {isRunning ? 'Running...' : 'Run'}
              </Button>
              <Button
                onClick={handleResetState}
                disabled={isRunning}
                size="sm"
                variant="outline"
                className="neon-border"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          {gates.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <div className="text-lg mb-2">🎛️ Start Building Your Circuit</div>
              <p>Drag gates from the left panel to see real-time quantum state visualization</p>
              <div className="mt-4 text-sm">
                <p>✨ Features available:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Interactive 3D Bloch Spheres</li>
                  <li>Real-time Amplitude Charts</li>
                  <li>Step-by-step Circuit Execution</li>
                </ul>
              </div>
            </div>
          ) : !displayResult ? (
            <div className="text-center text-muted-foreground py-8">
              <div className="text-lg mb-2">⚡ Ready to Simulate</div>
              <p>Click "Run" to execute your quantum circuit and see the visualization</p>
              <Button
                onClick={handleRunSimulation}
                disabled={isRunning}
                className="mt-4 neon-border"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Simulating...' : 'Run Simulation'}
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="bloch" className="w-full h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bloch">Bloch Spheres</TabsTrigger>
                <TabsTrigger value="amplitude">Amplitude Chart</TabsTrigger>
                <TabsTrigger value="steps">Step-by-Step</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bloch" className="space-y-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: numQubits }).map((_, i) => {
                    const qubitState = getQubitState(i);
                    
                    return (
                      <BlochSphere3D
                        key={i}
                        qubitIndex={i}
                        isSelected={selectedQubit === i}
                        onSelect={() => setSelectedQubit(i)}
                        qubitState={qubitState}
                      />
                    );
                  })}
                </div>
                
                {/* Show raw data for debugging */}
                {displayResult && (
                  <div className="mt-4 p-4 bg-quantum-matrix rounded-lg">
                    <h4 className="text-xs font-semibold text-quantum-particle mb-2">
                      Debug Info (Backend: {lastResult?.backend || 'local'})
                    </h4>
                    <div className="text-xs font-mono text-muted-foreground">
                      <div>Qubits: {displayResult.qubitStates?.length || 0}</div>
                      <div>Execution Time: {getExecutionTime().toFixed(2)}ms</div>
                      <div>Fidelity: {(getFidelity() * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="amplitude" className="space-y-4 mt-4">
                <AmplitudeChart
                  stateVector={getStateVector()}
                  measurementProbabilities={getMeasurementProbabilities()}
                  numQubits={numQubits}
                />
              </TabsContent>
              
              <TabsContent value="steps" className="space-y-4 mt-4">
                <StepByStepExecutor
                  circuit={gates.map(gate => ({
                    id: gate.id,
                    type: gate.type,
                    qubit: gate.qubit,
                    position: gate.timeStep,
                    angle: gate.params?.angle,
                    controlQubit: gate.params?.controlQubit
                  }))}
                  onStep={handleStepExecution}
                  onReset={handleResetSteps}
                  onPause={() => setIsStepMode(false)}
                  onResume={() => setIsStepMode(true)}
                  isRunning={isStepMode}
                  progress={(currentStep / gates.length) * 100}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
