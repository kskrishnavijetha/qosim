
import React, { useState, useCallback } from 'react';
import { useCircuitBuilder } from '@/hooks/useCircuitBuilder';
import { useQuantumBackend } from '@/hooks/useQuantumBackend';
import { CircuitSimulationPanel } from '@/components/circuits/CircuitSimulationPanel';
import { QNNVisualBuilder } from '@/components/qnn/QNNVisualBuilder';
import { SDKPlayground } from '@/components/sdk/SDKPlayground';
import { ErrorCorrectionPlayground } from '@/components/algorithms/ErrorCorrectionPlayground';
import { HybridSimulatorPanelWrapper } from './panels/HybridSimulatorPanelWrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast"
import { QuantumMemoryMap } from '@/components/qmm/QuantumMemoryMap';

export function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState('circuits');
  const { toast } = useToast()
  
  // Circuit Builder
  const {
    circuit,
    selectedGate,
    simulationResult,
    addQubit,
    removeQubit,
    addGate,
    removeGate,
    moveGate,
    updateGateParams,
    clearCircuit,
    simulateCircuit,
    saveCircuit: handleCircuitSave
  } = useCircuitBuilder();

  // Quantum Backend
  const {
    isExecuting,
    lastResult,
    executionHistory,
    executeCircuit,
    executeOnQiskit,
    executeOnBraket,
    clearHistory
  } = useQuantumBackend();

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleCircuitSaveWrapper = () => {
    handleCircuitSave();
    toast({
      title: "Circuit Saved",
      description: "Your circuit has been saved successfully",
    })
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'circuits':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-quantum-glow">Circuit Builder</h3>
                  <div className="flex gap-2">
                    <Button onClick={addQubit} size="sm">Add Qubit</Button>
                    <Button onClick={clearCircuit} size="sm" variant="outline">Clear</Button>
                  </div>
                </div>
                
                {/* Circuit Canvas Placeholder */}
                <div className="border border-quantum-matrix rounded-lg h-96 bg-quantum-void/50 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-quantum-text">Interactive Circuit Builder</p>
                    <p className="text-sm text-quantum-text/60">
                      Qubits: {circuit.qubits.length} | Gates: {circuit.gates.length}
                    </p>
                  </div>
                </div>
                
                {/* Basic Controls */}
                <div className="flex gap-2">
                  <Button onClick={() => addGate('H', [circuit.qubits[0]?.id], { x: 100, y: 50 })} size="sm">
                    Add H Gate
                  </Button>
                  <Button onClick={() => addGate('X', [circuit.qubits[0]?.id], { x: 200, y: 50 })} size="sm">
                    Add X Gate
                  </Button>
                  <Button onClick={simulateCircuit} size="sm" variant="secondary">
                    Simulate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      case 'simulation':
        return (
          <CircuitSimulationPanel
            circuit={circuit}
            simulationResult={simulationResult || lastResult}
            onSimulate={async () => {
              await simulateCircuit();
            }}
            isSimulating={isExecuting}
          />
        );
      case 'execution':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow mb-4">Quantum Execution</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button onClick={() => executeCircuit(circuit.gates)} disabled={isExecuting}>
                    Execute Circuit
                  </Button>
                  <Button onClick={clearHistory} variant="outline">
                    Clear History
                  </Button>
                </div>
                {lastResult && (
                  <div className="mt-4">
                    <p className="text-sm text-quantum-text">Last execution completed</p>
                  </div>
                )}
                {executionHistory.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-quantum-text">
                      Execution History: {executionHistory.length} runs
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      case 'qiskit':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow">Qiskit Integration</h3>
              <p className="mt-2 text-quantum-text">Execute circuits on IBM Quantum devices</p>
              <Button className="mt-4" onClick={() => executeOnQiskit?.(circuit.gates)} disabled={isExecuting}>
                Run on Qiskit
              </Button>
            </CardContent>
          </Card>
        );
      case 'braket':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow">Amazon Braket Integration</h3>
              <p className="mt-2 text-quantum-text">Execute circuits on AWS quantum devices</p>
              <Button className="mt-4" onClick={() => executeOnBraket?.(circuit.gates)} disabled={isExecuting}>
                Run on Braket
              </Button>
            </CardContent>
          </Card>
        );
      case 'ai':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent>
              <h3 className="text-lg font-semibold">AI Quantum Assistant</h3>
              <p>Coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'sdk':
        return <SDKPlayground />;
      case 'algorithms':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent>
              <h3 className="text-lg font-semibold">Quantum Algorithms</h3>
              <p>Explore pre-built quantum algorithms. Coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'error-correction':
        return <ErrorCorrectionPlayground />;
      case 'qnn-builder':
        return <QNNVisualBuilder />;
      case 'hardware':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent>
              <h3 className="text-lg font-semibold">Quantum Hardware</h3>
              <p>Connect to real quantum hardware. Coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'jobs':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent>
              <h3 className="text-lg font-semibold">Quantum Jobs</h3>
              <p>Manage your quantum computing jobs. Coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'marketplace':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent>
              <h3 className="text-lg font-semibold">Quantum Marketplace</h3>
              <p>Discover quantum apps and tools. Coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'community':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent>
              <h3 className="text-lg font-semibold">Quantum Community</h3>
              <p>Connect with other quantum enthusiasts. Coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'memory':
        return <QuantumMemoryMap />;
      case 'files':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent>
              <h3 className="text-lg font-semibold">File Management</h3>
              <p>Manage your files. Coming soon...</p>
            </CardContent>
          </Card>
        );
      case 'hybrid-simulator':
        return <HybridSimulatorPanelWrapper />;
      default:
        return (
          <Card className="quantum-panel neon-border">
            <CardContent>
              <h3 className="text-lg font-semibold">Welcome to QOSim</h3>
              <p>Select a tool from the sidebar to get started.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex h-screen bg-quantum-void">
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between h-16 p-4 border-b border-quantum-matrix">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-quantum-glow">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <Badge variant="secondary" className="text-xs">
              {circuit.qubits.length} Qubits
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {circuit.gates.length} Gates
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleCircuitSaveWrapper} className="neon-border">
              Save Circuit
            </Button>
            <Button variant="outline" size="sm" className="neon-border">
              Share
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
