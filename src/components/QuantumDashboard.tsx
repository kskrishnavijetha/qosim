
import React, { useState, useCallback } from 'react';
import { useCircuitBuilder } from '@/hooks/useCircuitBuilder';
import { useQuantumBackend } from '@/hooks/useQuantumBackend';
import { CircuitSimulationPanel } from '@/components/circuits/CircuitSimulationPanel';
import { QNNVisualBuilder } from '@/components/qnn/QNNVisualBuilder';
import { SDKPlayground } from '@/components/sdk/SDKPlayground';
import { QuantumErrorCorrectionPanel } from '@/components/error-correction/QuantumErrorCorrectionPanel';
import { HybridSimulatorPanelWrapper } from './panels/HybridSimulatorPanelWrapper';
import { QuantumSidebar } from './QuantumSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast"
import { QuantumMemoryMap } from '@/components/qmm/QuantumMemoryMap';
import type { Gate } from '@/hooks/useCircuitState';
import type { CircuitSimulationResult } from '@/hooks/useCircuitBuilder';

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

  // Helper function to convert CircuitGate[] to Gate[]
  const convertCircuitGatesToGates = (circuitGates: any[]): Gate[] => {
    return circuitGates.map((gate, index) => ({
      id: gate.id,
      type: gate.type,
      qubit: gate.qubits?.[0] ? circuit.qubits.findIndex(q => q.id === gate.qubits[0]) : 0,
      qubits: gate.qubits?.map((qId: string) => circuit.qubits.findIndex(q => q.id === qId)) || [],
      position: gate.layer || index,
      angle: gate.params?.angle || gate.metadata?.angle,
      params: gate.params ? Object.values(gate.params) : undefined
    }));
  };

  // Helper function to ensure result has fidelity property
  const ensureSimulationResult = (result: any): CircuitSimulationResult => {
    if (!result) return null;
    
    return {
      ...result,
      fidelity: result.fidelity ?? 1.0, // Default fidelity if missing
      entanglement: result.entanglement || { pairs: [], strength: 0 }
    };
  };

  const handleSDKSelect = (sdkType: string) => {
    console.log('SDK selected:', sdkType);
    // SDK selection logic can be handled here
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
      case 'my-circuits':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow mb-4">My Circuits</h3>
              <div className="text-center py-8">
                <p className="text-quantum-text">Your saved circuits will appear here.</p>
                <p className="text-sm text-quantum-text/60 mt-2">Create and save circuits to see them listed here.</p>
              </div>
            </CardContent>
          </Card>
        );
      case 'simulation':
        return (
          <CircuitSimulationPanel
            circuit={circuit}
            simulationResult={ensureSimulationResult(simulationResult || lastResult)}
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
                  <Button 
                    onClick={() => executeCircuit(convertCircuitGatesToGates(circuit.gates))} 
                    disabled={isExecuting}
                  >
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
              <Button 
                className="mt-4" 
                onClick={() => executeOnQiskit?.(convertCircuitGatesToGates(circuit.gates))} 
                disabled={isExecuting}
              >
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
              <Button 
                className="mt-4" 
                onClick={() => executeOnBraket?.(convertCircuitGatesToGates(circuit.gates))} 
                disabled={isExecuting}
              >
                Run on Braket
              </Button>
            </CardContent>
          </Card>
        );
      case 'ai':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow">AI Quantum Assistant</h3>
              <p className="mt-2 text-quantum-text">Get intelligent help with quantum circuit design and optimization.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-quantum-particle">• Circuit optimization suggestions</p>
                <p className="text-sm text-quantum-particle">• Algorithm recommendations</p>
                <p className="text-sm text-quantum-particle">• Error analysis and corrections</p>
              </div>
              <Button className="mt-4" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        );
      case 'sdk':
        return <SDKPlayground />;
      case 'algorithms':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow">Quantum Algorithms</h3>
              <p className="mt-2 text-quantum-text">Explore and implement pre-built quantum algorithms.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-quantum-particle">• Grover's Search Algorithm</p>
                <p className="text-sm text-quantum-particle">• Shor's Factoring Algorithm</p>
                <p className="text-sm text-quantum-particle">• Quantum Fourier Transform</p>
                <p className="text-sm text-quantum-particle">• Variational Quantum Eigensolver</p>
              </div>
              <Button className="mt-4" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        );
      case 'error-correction':
        return <QuantumErrorCorrectionPanel />;
      case 'qnn-builder':
        return <QNNVisualBuilder />;
      case 'qmm':
        return <QuantumMemoryMap />;
      case 'optimization':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow">Circuit Optimization</h3>
              <p className="mt-2 text-quantum-text">Optimize your quantum circuits for better performance.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-quantum-particle">• Gate count reduction</p>
                <p className="text-sm text-quantum-particle">• Depth minimization</p>
                <p className="text-sm text-quantum-particle">• Noise-aware optimization</p>
              </div>
              <Button className="mt-4" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        );
      case 'hybrid-simulator':
        return <HybridSimulatorPanelWrapper />;
      case 'hardware':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow">Quantum Hardware</h3>
              <p className="mt-2 text-quantum-text">Connect to real quantum hardware devices.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-quantum-particle">• IBM Quantum devices</p>
                <p className="text-sm text-quantum-particle">• AWS Braket</p>
                <p className="text-sm text-quantum-particle">• IonQ systems</p>
              </div>
              <Button className="mt-4" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        );
      case 'jobs':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow">Quantum Jobs</h3>
              <p className="mt-2 text-quantum-text">Manage your quantum computing jobs and view execution history.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-quantum-particle">• Job queue management</p>
                <p className="text-sm text-quantum-particle">• Execution status tracking</p>
                <p className="text-sm text-quantum-particle">• Results history</p>
              </div>
              <Button className="mt-4" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        );
      case 'marketplace':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow">Quantum Marketplace</h3>
              <p className="mt-2 text-quantum-text">Discover quantum apps, algorithms, and tools from the community.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-quantum-particle">• Community algorithms</p>
                <p className="text-sm text-quantum-particle">• Custom gate libraries</p>
                <p className="text-sm text-quantum-particle">• Educational resources</p>
              </div>
              <Button className="mt-4" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        );
      case 'community':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow">Quantum Community</h3>
              <p className="mt-2 text-quantum-text">Connect with other quantum computing enthusiasts and researchers.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-quantum-particle">• Discussion forums</p>
                <p className="text-sm text-quantum-particle">• Collaborative projects</p>
                <p className="text-sm text-quantum-particle">• Knowledge sharing</p>
              </div>
              <Button className="mt-4" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        );
      case 'memory':
        return <QuantumMemoryMap />;
      case 'files':
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow">File Management</h3>
              <p className="mt-2 text-quantum-text">Manage your quantum circuits, algorithms, and project files.</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-quantum-particle">• Circuit file storage</p>
                <p className="text-sm text-quantum-particle">• Import/Export functionality</p>
                <p className="text-sm text-quantum-particle">• Version control</p>
              </div>
              <Button className="mt-4" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Card className="quantum-panel neon-border">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-quantum-glow">Welcome to QOSim</h3>
              <p className="mt-2 text-quantum-text">Your Quantum Operating System Interface</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-quantum-particle">Select a tool from the sidebar to get started:</p>
                <p className="text-sm text-quantum-particle">• Build quantum circuits</p>
                <p className="text-sm text-quantum-particle">• Run simulations</p>
                <p className="text-sm text-quantum-particle">• Explore algorithms</p>
                <p className="text-sm text-quantum-particle">• Connect to quantum hardware</p>
              </div>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex h-screen bg-quantum-void">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0">
        <QuantumSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onSDKSelect={handleSDKSelect}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <div className="flex items-center justify-between h-16 p-4 border-b border-quantum-matrix">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-quantum-glow">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
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
