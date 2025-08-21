import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { QuantumBackendResult } from '@/services/quantumBackendService';
import { Gate } from '@/hooks/useCircuitState';
import { usePostSimulationWorkflow } from '@/hooks/usePostSimulationWorkflow';
import { SimulationResults } from './SimulationResults';
import { StepByStepViewer } from './StepByStepViewer';
import { EnhancedExportOptions } from './EnhancedExportOptions';
import { SimulationControls } from './SimulationControls';
import { CircuitExplanationPanel } from './CircuitExplanationPanel';
import { AlertTriangle, Zap, Eye, Download, Play, Bot } from 'lucide-react';

interface PostSimulationWorkflowProps {
  result: QuantumBackendResult;
  gates: Gate[];
  numQubits: number;
  circuitName: string;
  onRerunSimulation: (shots?: number) => Promise<QuantumBackendResult | null>;
  onExecutePartialCircuit: (gates: Gate[], shots?: number) => Promise<QuantumBackendResult | null>;
}

export function PostSimulationWorkflow({
  result,
  gates,
  numQubits,
  circuitName,
  onRerunSimulation,
  onExecutePartialCircuit
}: PostSimulationWorkflowProps) {
  const [activeTab, setActiveTab] = useState('results');
  const [shots, setShots] = useState(1024);
  const [isRerunning, setIsRerunning] = useState(false);
  
  const {
    simulationSteps,
    workflowState,
    generateStepByStepSimulation,
    playSimulation,
    pauseSimulation,
    setStep,
    setPlaybackSpeed,
    toggleAdvancedView
  } = usePostSimulationWorkflow();

  // Check for scalability warnings
  const circuitDepth = gates.length;
  const isLargeCircuit = numQubits > 20 || circuitDepth > 100;
  const isVeryLargeCircuit = numQubits > 30 || circuitDepth > 200;

  useEffect(() => {
    console.log('🔄 PostSimulationWorkflow: Result updated', {
      backend: result.backend,
      executionTime: result.executionTime,
      numQubits,
      gateCount: gates.length
    });
  }, [result, numQubits, gates.length]);

  const handleRerunSimulation = async () => {
    setIsRerunning(true);
    try {
      await onRerunSimulation(shots);
    } finally {
      setIsRerunning(false);
    }
  };

  const handleGenerateStepByStep = async () => {
    if (simulationSteps.length === 0) {
      await generateStepByStepSimulation(gates, numQubits, onExecutePartialCircuit);
    }
    setActiveTab('evolution');
  };

  if (result.error) {
    return (
      <Card className="quantum-panel neon-border border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Simulation Error</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{result.error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Scalability Warnings */}
      {isLargeCircuit && (
        <Alert variant={isVeryLargeCircuit ? "destructive" : "default"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {isVeryLargeCircuit 
              ? `Warning: Circuit with ${numQubits} qubits and depth ${circuitDepth} may be too large for classical simulation. Consider using a quantum computer or reducing circuit complexity.`
              : `Notice: Large circuit detected (${numQubits} qubits, depth ${circuitDepth}). Simulation may take longer than usual.`
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Simulation Summary */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Post-Simulation Workflow
          </CardTitle>
          <CardDescription>
            Comprehensive analysis and visualization of quantum circuit execution
          </CardDescription>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-quantum-neon">
              {result.backend.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-quantum-particle">
              {numQubits} qubits
            </Badge>
            <Badge variant="outline" className="text-quantum-plasma">
              {gates.length} gates
            </Badge>
            <Badge variant="outline" className="text-quantum-glow">
              {result.executionTime.toFixed(2)}ms
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* AI Circuit Explanation - New Feature */}
      <CircuitExplanationPanel
        gates={gates}
        result={result}
        numQubits={numQubits}
        isVisible={true}
      />

      {/* Simulation Controls */}
      <SimulationControls
        shots={shots}
        onShotsChange={setShots}
        onRerun={handleRerunSimulation}
        isRerunning={isRerunning}
        showAdvanced={workflowState.showAdvanced}
        onToggleAdvanced={toggleAdvancedView}
      />

      {/* Main Workflow Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 quantum-panel neon-border">
          <TabsTrigger value="results" className="text-quantum-glow">
            <Eye className="w-4 h-4 mr-2" />
            Results
          </TabsTrigger>
          <TabsTrigger value="explanation" className="text-quantum-neon">
            <Bot className="w-4 h-4 mr-2" />
            AI Explain
          </TabsTrigger>
          <TabsTrigger value="evolution" className="text-quantum-particle">
            <Play className="w-4 h-4 mr-2" />
            Evolution
          </TabsTrigger>
          <TabsTrigger value="export" className="text-quantum-plasma">
            <Download className="w-4 h-4 mr-2" />
            Export
          </TabsTrigger>
          <TabsTrigger value="code" className="text-quantum-energy">
            Generate Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          <SimulationResults
            result={result}
            showAdvanced={workflowState.showAdvanced}
            numQubits={numQubits}
          />
        </TabsContent>

        <TabsContent value="explanation" className="space-y-4">
          <CircuitExplanationPanel
            gates={gates}
            result={result}
            numQubits={numQubits}
            isVisible={activeTab === 'explanation'}
          />
        </TabsContent>

        <TabsContent value="evolution" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-neon">Step-by-Step State Evolution</CardTitle>
              <CardDescription>
                Interactive visualization of quantum state changes through each gate
              </CardDescription>
            </CardHeader>
            <CardContent>
              {simulationSteps.length === 0 ? (
                <div className="text-center py-8">
                  <Button onClick={handleGenerateStepByStep} className="mb-4">
                    Generate Step-by-Step Analysis
                  </Button>
                  <p className="text-quantum-particle text-sm">
                    This will simulate the circuit gate-by-gate to show state evolution
                  </p>
                </div>
              ) : (
                <StepByStepViewer
                  steps={simulationSteps}
                  workflowState={workflowState}
                  onPlay={playSimulation}
                  onPause={pauseSimulation}
                  onSetStep={setStep}
                  onSetSpeed={setPlaybackSpeed}
                  numQubits={numQubits}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <EnhancedExportOptions
            result={result}
            gates={gates}
            numQubits={numQubits}
            circuitName={circuitName}
            simulationSteps={simulationSteps}
          />
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-plasma">Generate Reproducible Code</CardTitle>
              <CardDescription>
                Download Python, Qiskit, or JavaScript code that reproduces this simulation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-quantum-particle text-sm">
                Code generation feature will be available in the Export tab above.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
