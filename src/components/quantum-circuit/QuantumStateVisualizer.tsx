
import React, { useState } from 'react';
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

export function QuantumStateVisualizer() {
  const { gates, numQubits } = useCircuitStore();
  const { simulationResult, isSimulating, simulate } = useQuantumSimulation();
  const { lastResult, isExecuting } = useQuantumBackend();
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [isStepMode, setIsStepMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Use backend result if available, otherwise use local simulation result
  const displayResult = lastResult || simulationResult;
  const isRunning = isExecuting || isSimulating;

  const handleRunSimulation = async () => {
    if (gates.length === 0) return;
    // Convert store gates to simulation format
    const simulationGates = gates.map(gate => ({
      id: gate.id,
      type: gate.type,
      qubit: gate.qubit,
      position: gate.timeStep, // Map timeStep to position
      angle: gate.params?.angle,
      controlQubit: gate.params?.controlQubit
    }));
    await simulate(simulationGates, numQubits);
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
  const getQubitState = (index: number) => {
    if (displayResult?.qubitStates?.[index]) {
      const qubitState = displayResult.qubitStates[index];
      
      // Check if it's from backend (has different structure)
      if ('amplitude' in qubitState) {
        const backendState = qubitState as any;
        return {
          state: backendState.state,
          probability: backendState.probability,
          blochCoordinates: {
            x: Math.sin(backendState.phase || 0) * Math.sqrt(backendState.probability),
            y: 0,
            z: Math.cos(backendState.phase || 0) * Math.sqrt(1 - backendState.probability)
          }
        };
      }
      
      // Local simulation result
      return qubitState;
    }
    
    // Default state
    return {
      state: '|0⟩',
      probability: 1,
      blochCoordinates: { x: 0, y: 0, z: 1 }
    };
  };

  // Helper function to normalize state vector
  const getStateVector = () => {
    if (displayResult?.stateVector) {
      if (Array.isArray(displayResult.stateVector) && displayResult.stateVector.length > 0) {
        const firstElement = displayResult.stateVector[0];
        if ('imag' in firstElement) {
          return displayResult.stateVector as Array<{ real: number; imag: number }>;
        } else if ('imaginary' in firstElement) {
          // Convert backend format to expected format
          return (displayResult.stateVector as any[]).map(item => ({
            real: item.real,
            imag: item.imaginary
          }));
        }
      }
    }
    return [];
  };

  // Helper function to normalize measurement probabilities
  const getMeasurementProbabilities = () => {
    if (displayResult?.measurementProbabilities) {
      if (Array.isArray(displayResult.measurementProbabilities)) {
        return displayResult.measurementProbabilities;
      } else if (typeof displayResult.measurementProbabilities === 'object') {
        // Convert Record<string, number> to number[]
        return Object.values(displayResult.measurementProbabilities);
      }
    }
    return [];
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
          ) : (
            <Tabs defaultValue="bloch" className="w-full h-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bloch">Bloch Spheres</TabsTrigger>
                <TabsTrigger value="amplitude">Amplitude Chart</TabsTrigger>
                <TabsTrigger value="steps">Step-by-Step</TabsTrigger>
              </TabsList>
              
              <TabsContent value="bloch" className="space-y-4 mt-4">
                {displayResult ? (
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
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    Click "Run" to see Bloch sphere visualization
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
