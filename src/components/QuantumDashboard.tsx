import React, { useState, useCallback } from 'react';
import { Github, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { GitHubIntegration } from './GitHubIntegration';
import { QuantumSidebar } from './QuantumSidebar';
import { CircuitBuilderPanel } from './CircuitBuilderPanel';
import { QuantumSimulatorPanel } from './QuantumSimulatorPanel';
import { HardwareIntegrationHub } from './HardwareIntegrationHub';
import { QuantumAlgorithmsSDK } from './algorithms/QuantumAlgorithmsSDK';
import { Gate } from '@/hooks/useCircuitState';
import { BlochSphere } from './BlochSphere';
import { FourDTopologicalQEC } from './error-correction/FourDTopologicalQEC';

interface User {
  name: string;
  email: string;
  imageUrl: string;
}

const mockUser: User = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  imageUrl: '/placeholder-avatar.jpg',
};

export default function QuantumDashboard() {
  const [activePanel, setActivePanel] = useState<'circuit-builder' | 'simulator' | 'hardware' | 'algorithms' | 'error-correction'>('circuit-builder');
  const [circuitGates, setCircuitGates] = useState<Gate[]>([]);
  const [algorithmResult, setAlgorithmResult] = useState<any>(null);
  const [visualCircuit, setVisualCircuit] = useState<any>(null);
  const { toast } = useToast();

  const handleLogout = useCallback(() => {
    alert('Logged out!');
  }, []);

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <QuantumSidebar 
        activePanel={activePanel} 
        onPanelChange={setActivePanel}
        user={mockUser}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-quantum-glow/20">
          <div className="flex items-center gap-4">
            <div className="text-lg font-semibold">
              {activePanel === 'circuit-builder' && 'Quantum Circuit Builder'}
              {activePanel === 'simulator' && 'Quantum Simulator'}
              {activePanel === 'hardware' && 'Hardware Integration'}
              {activePanel === 'algorithms' && 'Quantum Algorithms SDK'}
              {activePanel === 'error-correction' && 'Error Correction'}
            </div>
            <Badge variant="secondary">QOSim v1.0</Badge>
          </div>
          
          {/* Add GitHub Integration Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="neon-border"
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto quantum-panel">
              <DialogHeader>
                <DialogTitle className="text-quantum-glow">GitHub Integration</DialogTitle>
              </DialogHeader>
              <GitHubIntegration />
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {activePanel === 'circuit-builder' && (
            <div className="h-full p-4">
              <CircuitBuilderPanel
                onCircuitChange={(gates) => {
                  setCircuitGates(gates);
                }}
              />
            </div>
          )}
          
          {activePanel === 'simulator' && (
            <div className="h-full p-4">
              <QuantumSimulatorPanel circuit={circuitGates} />
            </div>
          )}
          
          {activePanel === 'hardware' && (
            <div className="h-full p-4">
              <HardwareIntegrationHub
                circuit={circuitGates}
                simulationResult={algorithmResult}
                onExecutionComplete={(result) => {
                  console.log('Hardware execution completed:', result);
                  toast({
                    title: "Hardware Execution Complete",
                    description: `Job finished on ${result.jobInfo.device} with cost $${result.jobInfo.cost}`,
                  });
                }}
              />
            </div>
          )}
          
          {activePanel === 'algorithms' && (
            <div className="h-full p-4">
              <QuantumAlgorithmsSDK
                onCircuitGenerated={(gates) => {
                  setCircuitGates(gates);
                  toast({
                    title: "Circuit Generated",
                    description: "Algorithm generated a quantum circuit",
                  });
                }}
                onAlgorithmExecuted={(result) => {
                  setAlgorithmResult(result);
                  console.log('Algorithm executed:', result);
                  toast({
                    title: "Algorithm Executed",
                    description: "Algorithm simulation completed",
                  });
                }}
                visualCircuit={visualCircuit}
                onVisualCircuitChange={setVisualCircuit}
              />
            </div>
          )}
          
          {activePanel === 'error-correction' && (
            <div className="h-full overflow-y-auto p-4">
              <FourDTopologicalQEC
                onSimulationComplete={(result) => {
                  console.log('4D QEC simulation completed:', result);
                  toast({
                    title: "4D Error Correction Complete",
                    description: `Simulation finished with ${result.correctedErrors} errors corrected`,
                  });
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
