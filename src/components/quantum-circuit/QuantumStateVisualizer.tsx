
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BlochSphere3D } from './BlochSphere3D';
import { AmplitudeChart } from './AmplitudeChart';
import { StepByStepExecutor } from './StepByStepExecutor';
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
    await simulate(gates, numQubits);
  };

  const handleStepExecution = () => {
    if (currentStep < gates.length) {
      const gatesUpToStep = gates.slice(0, currentStep + 1);
      simulate(gatesUpToStep, numQubits);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleResetSteps = () => {
    setCurrentStep(0);
    simulate([], numQubits);
  };

  return (
    <div className="space-y-4">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center justify-between">
            Real-time Quantum State Visualization
            <Badge variant="secondary">
              {gates.length} gates | {numQubits} qubits
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bloch" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bloch">Bloch Spheres</TabsTrigger>
              <TabsTrigger value="amplitude">Amplitude Chart</TabsTrigger>
              <TabsTrigger value="steps">Step-by-Step</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bloch" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            
            <TabsContent value="amplitude" className="space-y-4">
              <AmplitudeChart
                stateVector={simulationResult?.stateVector || []}
                measurementProbabilities={simulationResult?.measurementProbabilities || []}
                numQubits={numQubits}
              />
            </TabsContent>
            
            <TabsContent value="steps" className="space-y-4">
              <StepByStepExecutor
                circuit={gates}
                onStep={handleStepExecution}
                onReset={handleResetSteps}
                onPause={() => setIsStepMode(false)}
                onResume={() => setIsStepMode(true)}
                isRunning={isStepMode}
                progress={(currentStep / gates.length) * 100}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
