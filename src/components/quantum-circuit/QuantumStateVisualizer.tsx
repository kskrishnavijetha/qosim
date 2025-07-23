
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, AlertCircle } from 'lucide-react';
import { BlochSphere3D } from './BlochSphere3D';
import { AmplitudeChart } from './AmplitudeChart';
import { StepByStepExecutor } from '../simulation/StepByStepExecutor';
import { useQuantumSimulation } from '@/hooks/useQuantumSimulation';
import { useQuantumBackend } from '@/hooks/useQuantumBackend';
import { useCircuitStore } from '@/store/circuitStore';

// Simplified and consistent types
interface QubitStateData {
  state: string;
  probability: number;
  blochCoordinates: { x: number; y: number; z: number };
}

interface StateVectorData {
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
      hasLastResult: !!lastResult,
      hasSimulationResult: !!simulationResult,
      hasDisplayResult: !!displayResult,
      gatesCount: gates.length,
      isExecuting,
      isSimulating,
      displayResultKeys: displayResult ? Object.keys(displayResult) : [],
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

  // Normalize qubit state data from any source
  const getQubitState = (index: number): QubitStateData => {
    console.log('🔍 Getting qubit state for index:', index, 'from result:', displayResult);
    
    if (!displayResult) {
      return {
        state: '|0⟩',
        probability: 1,
        blochCoordinates: { x: 0, y: 0, z: 1 }
      };
    }

    // Try to get qubit state from various possible locations
    let qubitData: any = null;
    
    if (displayResult.qubitStates && displayResult.qubitStates[index]) {
      qubitData = displayResult.qubitStates[index];
    } else if (displayResult.blochSphereData && displayResult.blochSphereData[index]) {
      qubitData = displayResult.blochSphereData[index];
    }

    if (!qubitData) {
      console.log('⚠️ No qubit data found for index:', index);
      return {
        state: '|0⟩',
        probability: 1,
        blochCoordinates: { x: 0, y: 0, z: 1 }
      };
    }

    console.log('📊 Raw qubit data:', qubitData);

    // Normalize the data structure
    const state = qubitData.state || '|0⟩';
    const probability = qubitData.probability || 0;
    
    let blochCoordinates = { x: 0, y: 0, z: 1 };
    
    if (qubitData.blochCoordinates) {
      blochCoordinates = qubitData.blochCoordinates;
    } else if (qubitData.phase !== undefined) {
      // Calculate Bloch coordinates from phase and probability
      blochCoordinates = {
        x: Math.sin(qubitData.phase || 0) * Math.sqrt(probability),
        y: 0,
        z: Math.cos(qubitData.phase || 0) * Math.sqrt(1 - probability)
      };
    }

    return { state, probability, blochCoordinates };
  };

  // Normalize state vector data
  const getStateVector = (): StateVectorData[] => {
    if (!displayResult?.stateVector || !Array.isArray(displayResult.stateVector)) {
      console.log('⚠️ No state vector found in result');
      return [];
    }

    return displayResult.stateVector.map((item: any) => ({
      real: item.real || 0,
      imag: item.imag || item.imaginary || 0
    }));
  };

  // Normalize measurement probabilities
  const getMeasurementProbabilities = (): number[] => {
    if (!displayResult?.measurementProbabilities) {
      console.log('⚠️ No measurement probabilities found');
      return [];
    }

    if (Array.isArray(displayResult.measurementProbabilities)) {
      return displayResult.measurementProbabilities;
    } else if (typeof displayResult.measurementProbabilities === 'object') {
      return Object.values(displayResult.measurementProbabilities);
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
                
                {/* Debug Info */}
                <div className="mt-4 p-4 bg-quantum-matrix rounded-lg">
                  <h4 className="text-xs font-semibold text-quantum-particle mb-2 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    Debug Info (Backend: {lastResult?.backend || 'local'})
                  </h4>
                  <div className="text-xs font-mono text-muted-foreground space-y-1">
                    <div>Gates: {gates.length}</div>
                    <div>Display Result: {displayResult ? 'Yes' : 'No'}</div>
                    {displayResult && (
                      <>
                        <div>Qubit States: {displayResult.qubitStates?.length || 0}</div>
                        <div>State Vector: {displayResult.stateVector?.length || 0}</div>
                        <div>Execution Time: {displayResult.executionTime?.toFixed(2) || 0}ms</div>
                      </>
                    )}
                  </div>
                </div>
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
