import React, { useState } from 'react';
import { QuantumAICoPilot } from '@/components/ai/QuantumAICoPilot';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { UserProfileDropdown } from '@/components/UserProfileDropdown';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuantumGate } from '@/lib/quantumSimulator'; 
import { QuantumBackendResult } from '@/services/quantumBackendService';
import { AuthGuard } from '@/components/AuthGuard';

export default function AICoPilotPage() {
  const [circuit, setCircuit] = useState<QuantumGate[]>([]);
  const [result, setResult] = useState<QuantumBackendResult | null>(null);
  const [numQubits] = useState(3);

  const handleCircuitUpdate = (gates: QuantumGate[]) => {
    setCircuit(gates);
  };

  const handleRunSimulation = () => {
    // Mock simulation for now
    console.log('Running simulation with circuit:', circuit);
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.close()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Close
                </Button>
                <h1 className="text-2xl font-bold text-primary">QOSim AI Co-Pilot</h1>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <UserProfileDropdown />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <QuantumAICoPilot 
              circuit={circuit}
              result={result}
              onCircuitUpdate={handleCircuitUpdate}
              onRunSimulation={handleRunSimulation}
              numQubits={numQubits}
            />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}