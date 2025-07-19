
import React, { useState } from "react";
import { OptimizedSimulationResult } from "@/lib/quantumSimulatorOptimized";
import { QuantumStateVisualization } from "@/components/circuits/QuantumStateVisualization";
import { EntanglementVisualization } from "@/components/simulation/EntanglementVisualization";
import { DebugConsole } from "@/components/simulation/DebugConsole";
import { OutputConsole } from "@/components/simulation/OutputConsole";
import { QuantumBackendConfig } from "@/components/simulation/QuantumBackendConfig";
import { Gate } from "@/hooks/useCircuitState";
import { QuantumResultsDisplay } from "@/components/quantum/QuantumResultsDisplay";
import { useQuantumBackend } from "@/hooks/useQuantumBackend";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, Cpu, Cloud, Smartphone, Settings, Key, ExternalLink, AlertTriangle } from "lucide-react";

interface CircuitVisualizationSectionProps {
  simulationResult: OptimizedSimulationResult | null;
  numQubits: number;
  circuit: Gate[];
  onSuggestionClick: (suggestion: any) => void;
  onStepModeToggle: (enabled: boolean) => void;
  onSimulationStep: () => void;
  onSimulationReset: () => void;
  onSimulationPause: () => void;
  onSimulationResume: () => void;
}

export function CircuitVisualizationSection({
  simulationResult,
  numQubits,
  circuit,
  onSuggestionClick,
  onStepModeToggle,
  onSimulationStep,
  onSimulationReset,
  onSimulationPause,
  onSimulationResume
}: CircuitVisualizationSectionProps) {
  const [isOutputCollapsed, setIsOutputCollapsed] = useState(false);
  const [isDebugCollapsed, setIsDebugCollapsed] = useState(true);
  const [selectedBackend, setSelectedBackend] = useState<'qiskit' | 'qutip' | 'braket' | 'local'>('local');
  const [shots, setShots] = useState(1024);
  const [showBackendConfig, setShowBackendConfig] = useState(false);
  const [backendConfig, setBackendConfig] = useState<any>(null);

  const {
    isExecuting,
    lastResult,
    executeCircuit,
    executeOnQiskit,
    executeOnBraket,
    executeOnQuTiP
  } = useQuantumBackend();

  const handleBackendChange = (value: any) => {
    setSelectedBackend(value);
    
    // Automatically show config dialog for cloud backends that need API keys
    if ((value === 'qiskit' || value === 'braket') && !isBackendConfigured(value)) {
      setShowBackendConfig(true);
    }
  };

  const handleBackendExecution = async () => {
    if (circuit.length === 0) return;

    // Check if backend requires configuration
    if ((selectedBackend === 'qiskit' || selectedBackend === 'braket') && !backendConfig) {
      setShowBackendConfig(true);
      return;
    }

    switch (selectedBackend) {
      case 'qiskit':
        await executeOnQiskit(circuit, shots);
        break;
      case 'braket':
        await executeOnBraket(circuit, shots);
        break;
      case 'qutip':
        await executeOnQuTiP(circuit);
        break;
      default:
        await executeCircuit(circuit, 'local', shots);
    }
  };

  const handleBackendConfigSave = (config: any) => {
    setBackendConfig(config);
    setShowBackendConfig(false);
    console.log('Backend configuration saved:', config);
  };

  const getBackendIcon = (backend: string) => {
    switch (backend) {
      case 'qiskit': return <Cpu className="w-4 h-4" />;
      case 'braket': return <Cloud className="w-4 h-4" />;
      case 'qutip': return <Zap className="w-4 h-4" />;
      default: return <Smartphone className="w-4 h-4" />;
    }
  };

  const isBackendConfigured = (backend: string) => {
    if (backend === 'local' || backend === 'qutip') return true;
    return backendConfig && (
      (backend === 'qiskit' && backendConfig.ibmQuantum) ||
      (backend === 'braket' && backendConfig.awsBraket)
    );
  };

  const getBackendStatusMessage = () => {
    if (selectedBackend === 'local' || selectedBackend === 'qutip') {
      return null;
    }
    
    if (!isBackendConfigured(selectedBackend)) {
      return (
        <Alert className="border-amber-500/20 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-700">
            API keys required for {selectedBackend === 'qiskit' ? 'IBM Quantum' : 'AWS Braket'}. 
            Click "Configure APIs" to enter your credentials.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <Alert className="border-green-500/20 bg-green-500/10">
        <Key className="h-4 w-4 text-green-500" />
        <AlertDescription className="text-green-700">
          {selectedBackend === 'qiskit' ? 'IBM Quantum' : 'AWS Braket'} API configured and ready.
        </AlertDescription>
      </Alert>
    );
  };

  // Convert backend result to OptimizedSimulationResult format if available
  const displayResult = lastResult ? {
    qubitStates: lastResult.qubitStates,
    measurementProbabilities: Array.isArray(lastResult.measurementProbabilities) 
      ? lastResult.measurementProbabilities 
      : Object.values(lastResult.measurementProbabilities || {}),
    stateVector: lastResult.stateVector.map(amp => ({
      real: amp.real,
      imag: amp.imaginary || 0
    })),
    executionTime: lastResult.executionTime,
    fidelity: 1.0,
    mode: lastResult.backend as any,
    entanglement: lastResult.entanglement || {
      pairs: [],
      totalEntanglement: 0,
      entanglementThreads: []
    }
  } as OptimizedSimulationResult : simulationResult;

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Backend Execution Controls */}
      <div className="quantum-panel neon-border rounded-lg p-4">
        <h3 className="text-lg font-mono text-quantum-glow mb-4">Quantum Backend Execution</h3>
        
        {/* Backend Status Alert */}
        {getBackendStatusMessage()}
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end mt-4">
          <div>
            <label className="text-sm text-quantum-neon mb-2 block">Backend</label>
            <Select value={selectedBackend} onValueChange={handleBackendChange}>
              <SelectTrigger className="quantum-panel neon-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="quantum-panel neon-border">
                <SelectItem value="local">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Local Simulator
                  </div>
                </SelectItem>
                <SelectItem value="qiskit">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4" />
                    IBM Quantum
                    {!isBackendConfigured('qiskit') && <Key className="w-3 h-3 text-amber-500" />}
                  </div>
                </SelectItem>
                <SelectItem value="braket">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4" />
                    AWS Braket
                    {!isBackendConfigured('braket') && <Key className="w-3 h-3 text-amber-500" />}
                  </div>
                </SelectItem>
                <SelectItem value="qutip">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    QuTiP Simulator
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {selectedBackend !== 'qutip' && (
            <div>
              <label className="text-sm text-quantum-neon mb-2 block">Shots</label>
              <Select value={shots.toString()} onValueChange={(value) => setShots(parseInt(value))}>
                <SelectTrigger className="quantum-panel neon-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="quantum-panel neon-border">
                  <SelectItem value="100">100 shots</SelectItem>
                  <SelectItem value="1024">1,024 shots</SelectItem>
                  <SelectItem value="4096">4,096 shots</SelectItem>
                  <SelectItem value="8192">8,192 shots</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* API Configuration Button */}
          <div>
            <Dialog open={showBackendConfig} onOpenChange={setShowBackendConfig}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full neon-border"
                  disabled={selectedBackend === 'local' || selectedBackend === 'qutip'}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configure APIs
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl quantum-panel neon-border">
                <DialogHeader>
                  <DialogTitle className="text-quantum-glow font-mono">
                    Quantum Backend Configuration
                  </DialogTitle>
                </DialogHeader>
                <QuantumBackendConfig onConfigSave={handleBackendConfigSave} />
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Execute Button */}
          <div className="md:col-span-2">
            <Button 
              onClick={handleBackendExecution}
              disabled={isExecuting || circuit.length === 0 || !isBackendConfigured(selectedBackend)}
              className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
            >
              <div className="flex items-center gap-2">
                {getBackendIcon(selectedBackend)}
                {isExecuting ? 'Executing...' : 
                 !isBackendConfigured(selectedBackend) ? `Configure ${selectedBackend.toUpperCase()} API Keys` :
                 `Execute on ${selectedBackend.toUpperCase()}`}
              </div>
            </Button>
          </div>
        </div>

        {/* Quick API Key Links */}
        {(selectedBackend === 'qiskit' || selectedBackend === 'braket') && !isBackendConfigured(selectedBackend) && (
          <div className="mt-4 p-3 bg-quantum-matrix/50 rounded-lg border border-quantum-neon/20">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-quantum-neon" />
              <span className="text-sm font-mono text-quantum-neon">Need API Keys?</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedBackend === 'qiskit' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.open('https://quantum-computing.ibm.com/account', '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Get IBM Quantum API Key
                </Button>
              )}
              {selectedBackend === 'braket' && (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => window.open('https://console.aws.amazon.com/iam/home#/security_credentials', '_blank')}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Get AWS Credentials
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quantum Results Display */}
      {lastResult && (
        <QuantumResultsDisplay result={lastResult} />
      )}

      {/* Output Console */}
      <OutputConsole
        simulationResult={displayResult}
        isCollapsed={isOutputCollapsed}
        onToggleCollapse={setIsOutputCollapsed}
      />

      {/* Existing visualization components */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <QuantumStateVisualization 
          simulationResult={displayResult} 
          NUM_QUBITS={numQubits}
          backendResult={lastResult}
        />
        
        <EntanglementVisualization 
          simulationResult={displayResult}
          numQubits={numQubits}
          circuit={circuit}
        />
      </div>

      {/* Debug Console */}
      <DebugConsole
        simulationResult={displayResult}
        onStepMode={onStepModeToggle}
        onStep={onSimulationStep}
        onPause={onSimulationPause}
        onResume={onSimulationResume}
        onReset={onSimulationReset}
        isStepMode={false}
        isPaused={false}
        currentStep={0}
      />
    </div>
  );
}
