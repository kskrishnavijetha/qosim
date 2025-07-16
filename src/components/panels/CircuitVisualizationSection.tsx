import React, { useState } from "react";
import { OptimizedSimulationResult } from "@/lib/quantumSimulatorOptimized";
import { QuantumStateVisualization } from "@/components/circuits/QuantumStateVisualization";
import { EntanglementVisualization } from "@/components/simulation/EntanglementVisualization";
import { DebugConsole } from "@/components/simulation/DebugConsole";
import { OutputConsole } from "@/components/simulation/OutputConsole";
import { Gate } from "@/hooks/useCircuitState";
import { QuantumResultsDisplay } from "@/components/quantum/QuantumResultsDisplay";
import { useQuantumBackend } from "@/hooks/useQuantumBackend";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Cpu, Cloud, Smartphone } from "lucide-react";

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

  const {
    isExecuting,
    lastResult,
    executeCircuit,
    executeOnQiskit,
    executeOnBraket,
    executeOnQuTiP
  } = useQuantumBackend();

  const handleBackendExecution = async () => {
    if (circuit.length === 0) return;

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

  const getBackendIcon = (backend: string) => {
    switch (backend) {
      case 'qiskit': return <Cpu className="w-4 h-4" />;
      case 'braket': return <Cloud className="w-4 h-4" />;
      case 'qutip': return <Zap className="w-4 h-4" />;
      default: return <Smartphone className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Backend Execution Controls */}
      <div className="quantum-panel neon-border rounded-lg p-4">
        <h3 className="text-lg font-mono text-quantum-glow mb-4">Quantum Backend Execution</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-sm text-quantum-neon mb-2 block">Backend</label>
            <Select value={selectedBackend} onValueChange={(value: any) => setSelectedBackend(value)}>
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
                    IBM Qiskit
                  </div>
                </SelectItem>
                <SelectItem value="braket">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4" />
                    AWS Braket
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
          
          <div className="md:col-span-2">
            <Button 
              onClick={handleBackendExecution}
              disabled={isExecuting || circuit.length === 0}
              className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
            >
              <div className="flex items-center gap-2">
                {getBackendIcon(selectedBackend)}
                {isExecuting ? 'Executing...' : `Execute on ${selectedBackend.toUpperCase()}`}
              </div>
            </Button>
          </div>
        </div>
      </div>

      {/* Quantum Results Display */}
      {lastResult && (
        <QuantumResultsDisplay result={lastResult} />
      )}

      {/* Output Console - New collapsible console */}
      <OutputConsole
        simulationResult={simulationResult}
        isCollapsed={isOutputCollapsed}
        onToggleCollapse={setIsOutputCollapsed}
      />

      {/* Existing visualization components */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <QuantumStateVisualization 
          simulationResult={simulationResult} 
          NUM_QUBITS={numQubits} 
        />
        
        <EntanglementVisualization 
          simulationResult={simulationResult}
          numQubits={numQubits}
        />
      </div>

      {/* Debug Console - Optional advanced debugging */}
      <DebugConsole
        simulationResult={simulationResult}
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
