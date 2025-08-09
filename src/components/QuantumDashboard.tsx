import React, { useState, useCallback } from 'react';
import { QuantumCircuit } from '@/hooks/useCircuitState';
import { useQuantumBackend } from '@/hooks/useQuantumBackend';
import { useCircuitBuilder } from '@/hooks/useCircuitBuilder';
import { CircuitBuilder } from '@/components/circuits/CircuitBuilder';
import { CircuitSimulationPanel } from '@/components/circuits/CircuitSimulationPanel';
import { QuantumExecutionPanel } from '@/components/circuits/QuantumExecutionPanel';
import { QiskitPanel } from '@/components/backends/QiskitPanel';
import { BraketPanel } from '@/components/backends/BraketPanel';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast"
import { QNNBuilderPanel } from '@/components/qnn/QNNBuilderPanel';
import { SDKPlayground } from '@/components/algorithms/SDKPlayground';
import { ErrorCorrectionPlayground } from '@/components/algorithms/ErrorCorrectionPlayground';
import { HybridSimulatorPanelWrapper } from './panels/HybridSimulatorPanelWrapper';

interface QuantumDashboardProps {
  
}

export function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState('circuits');
  const { toast } = useToast()
  
  // Circuit Builder
  const {
    circuit,
    gates,
    addGate,
    removeGate,
    updateGate,
    addQubit,
    removeQubit,
    resetCircuit,
    loadExampleCircuit
  } = useCircuitBuilder();

  // Quantum Backend
  const {
    isExecuting,
    lastResult,
    executionHistory,
    executeCircuit,
    executeOnQiskit,
    executeOnBraket,
    executeOnQuTiP,
    clearHistory
  } = useQuantumBackend();

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  const handleCircuitSave = () => {
    // Implement circuit saving logic here
    toast({
      title: "Circuit Saved",
      description: "Your circuit has been saved successfully",
    })
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'circuits':
        return (
          <CircuitBuilder
            circuit={circuit}
            gates={gates}
            addGate={addGate}
            removeGate={removeGate}
            updateGate={updateGate}
            addQubit={addQubit}
            removeQubit={removeQubit}
            resetCircuit={resetCircuit}
            loadExampleCircuit={loadExampleCircuit}
          />
        );
      case 'simulation':
        return (
          <CircuitSimulationPanel
            circuit={circuit}
            simulationResult={lastResult}
            onSimulate={async () => {
              await executeCircuit(circuit.gates);
            }}
            isSimulating={isExecuting}
          />
        );
      case 'execution':
        return (
          <QuantumExecutionPanel
            circuit={circuit}
            onExecute={executeCircuit}
            isExecuting={isExecuting}
            lastResult={lastResult}
            executionHistory={executionHistory}
            clearHistory={clearHistory}
          />
        );
      case 'qiskit':
        return <QiskitPanel circuit={circuit} onExecute={executeOnQiskit} isExecuting={isExecuting} lastResult={lastResult} />;
      case 'braket':
        return <BraketPanel circuit={circuit} onExecute={executeOnBraket} isExecuting={isExecuting} lastResult={lastResult} />;
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
        return <QNNBuilderPanel />;
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
        return (
          <Card className="quantum-panel neon-border">
            <CardContent>
              <h3 className="text-lg font-semibold">System Memory</h3>
              <p>Manage system memory. Coming soon...</p>
            </CardContent>
          </Card>
        );
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
            <Button variant="outline" size="sm" onClick={handleCircuitSave} className="neon-border">
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
