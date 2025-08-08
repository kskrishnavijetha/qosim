
import React, { useState, useCallback } from 'react';
import { Github, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import GitHubIntegration from './github/GitHubIntegration';
import { QuantumSidebar } from './QuantumSidebar';
import { FourDTopologicalQEC } from './error-correction/FourDTopologicalQEC';
import { Gate } from '@/hooks/useCircuitState';

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

  const handlePanelChange = (panel: string) => {
    setActivePanel(panel as 'circuit-builder' | 'simulator' | 'hardware' | 'algorithms' | 'error-correction');
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      <QuantumSidebar 
        activePanel={activePanel} 
        onPanelChange={handlePanelChange}
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
            <div className="h-full p-4 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl text-quantum-glow mb-4">Circuit Builder</h2>
                <p className="text-muted-foreground">Circuit builder panel would go here</p>
              </div>
            </div>
          )}
          
          {activePanel === 'simulator' && (
            <div className="h-full p-4 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl text-quantum-neon mb-4">Quantum Simulator</h2>
                <p className="text-muted-foreground">Simulation panel would go here</p>
              </div>
            </div>
          )}
          
          {activePanel === 'hardware' && (
            <div className="h-full p-4 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl text-quantum-particle mb-4">Hardware Integration</h2>
                <p className="text-muted-foreground">Hardware integration panel would go here</p>
              </div>
            </div>
          )}
          
          {activePanel === 'algorithms' && (
            <div className="h-full p-4 flex items-center justify-center">
              <div className="text-center">
                <h2 className="text-xl text-quantum-energy mb-4">Algorithms SDK</h2>
                <p className="text-muted-foreground">Algorithms SDK panel would go here</p>
              </div>
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
