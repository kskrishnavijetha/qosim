
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
import { useCircuitStore } from '@/store/circuitStore';

export function QuantumStateVisualizer() {
  const { gates, numQubits } = useCircuitStore();
  const { simulationResult, isSimulating, simulate } = useQuantumSimulation();
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [isStepMode, setIsStepMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

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
              <Button
                onClick={handleRunSimulation}
                disabled={isSimulating || gates.length === 0}
                size="sm"
                className="neon-border"
              >
                <Play className="w-3 h-3 mr-1" />
                {isSimulating ? 'Running...' : 'Run'}
              </Button>
              <Button
                onClick={handleResetState}
                disabled={isSimulating}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Array.from({ length: numQubits }).map((_, i) => (
                    <BlochSphere3D
                      key={i}
                      qubitIndex={i}
                      isSelected={selectedQubit === i}
                      onSelect={() => setSelectedQubit(i)}
                      qubitState={simulationResult?.qubitStates[i] || {
                        state: '|0⟩',
                        probability: 1,
                        blochCoordinates: { x: 0, y: 0, z: 1 }
                      }}
                    />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="amplitude" className="space-y-4 mt-4">
                <AmplitudeChart
                  stateVector={simulationResult?.stateVector || []}
                  measurementProbabilities={simulationResult?.measurementProbabilities || []}
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
