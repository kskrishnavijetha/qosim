import React, { useState } from 'react';
import { QuantumSidebar } from './QuantumSidebar';
import { InteractiveCircuitBuilder } from './circuits/InteractiveCircuitBuilder';
import { CircuitSimulationPanel } from './circuits/CircuitSimulationPanel';
import { QuantumAICoPilot } from './ai/QuantumAICoPilot';
import { SDKDemoPanel } from './panels/SDKDemoPanel';
import { QuantumAlgorithmsSDK } from './algorithms/QuantumAlgorithmsSDK';
import { MemoryPanel } from './panels/MemoryPanel';
import { EnhancedFilesPanel } from './qfs/EnhancedFilesPanel';
import { JobsPanel } from './panels/JobsPanel';
import { MarketplacePanel } from './marketplace/MarketplacePanel';
import { CommunityHubPanel } from './community/CommunityHubPanel';
import { HardwareIntegrationHub } from './hardware/HardwareIntegrationHub';
import { MyCircuitsPanel } from './panels/MyCircuitsPanel';
import { UserProfileDropdown } from './UserProfileDropdown';
import { QuantumErrorCorrectionPanel } from './error-correction/QuantumErrorCorrectionPanel';
import { QNNVisualBuilder } from './qnn/QNNVisualBuilder';
import { QuantumMemoryMap } from './qmm/QuantumMemoryMap';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Github, Bot, ChevronRight, ChevronLeft } from 'lucide-react';
import GitHubIntegration from './github/GitHubIntegration';

export default function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("circuits");
  const [selectedSDK, setSelectedSDK] = useState("javascript");
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);
  const [circuit, setCircuit] = useState<any[]>([]);
  const [numQubits, setNumQubits] = useState(3);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(true);

  const handleSDKSelect = (sdkType: string) => {
    setSelectedSDK(sdkType);
  };

  const handleSimulationComplete = (result: any) => {
    setSimulationResult(result);
  };

  const handleCircuitUpdate = (gates: any[]) => {
    setCircuit(gates);
  };

  const handleRunSimulation = () => {
    // This will be handled by the circuit builder or simulation panel
    console.log('Running simulation with circuit:', circuit);
  };

  // Create a default circuit object that matches the QuantumCircuit interface
  const defaultCircuit = {
    id: 'default-circuit',
    name: 'Default Circuit',
    qubits: [],
    gates: [],
    layers: [],
    depth: 0,
    metadata: {
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      version: '1.0.0'
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "circuits":
        return <InteractiveCircuitBuilder />;
      case "my-circuits":
        return <MyCircuitsPanel />;
      case "simulation":
        return (
          <CircuitSimulationPanel 
            circuit={defaultCircuit}
            simulationResult={simulationResult}
            onSimulate={async () => {}}
            isSimulating={false}
          />
        );
      case "sdk":
        return <SDKDemoPanel defaultSDK={selectedSDK as 'javascript' | 'python'} />;
      case "hardware":
        return (
          <HardwareIntegrationHub 
            circuit={[]}
            simulationResult={simulationResult}
            onExecutionComplete={handleSimulationComplete}
          />
        );
      case "marketplace":
        return <MarketplacePanel />;
      case "community":
        return <CommunityHubPanel />;
      case "algorithms":
        return (
          <QuantumAlgorithmsSDK
            onCircuitGenerated={() => {}}
            onAlgorithmExecuted={() => {}}
          />
        );
      case "error-correction":
        return <QuantumErrorCorrectionPanel />;
      case "qnn-builder":
        return <QNNVisualBuilder />;
      case "qmm":
        return <QuantumMemoryMap />;
      case "optimization":
        return <div className="p-6 text-center text-quantum-neon">Optimization Panel Coming Soon</div>;
      case "memory":
        return <MemoryPanel />;
      case "files":
        return <EnhancedFilesPanel />;
      case "jobs":
        return <JobsPanel />;
      default:
        return <InteractiveCircuitBuilder />;
    }
  };

  return (
    <div className="flex h-screen bg-quantum-void text-quantum-text">
      {/* Main Sidebar */}
      <div className="w-64 bg-quantum-dark border-r border-quantum-neon/30">
        <QuantumSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onSDKSelect={handleSDKSelect}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="flex justify-between items-center p-4 border-b border-quantum-matrix bg-quantum-dark">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-quantum-glow">Quantum OS</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
                className="text-quantum-glow hover:bg-quantum-neon/10"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Copilot
                {aiSidebarOpen ? <ChevronRight className="w-4 h-4 ml-1" /> : <ChevronLeft className="w-4 h-4 ml-1" />}
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={githubDialogOpen} onOpenChange={setGithubDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-quantum-dark border-quantum-neon/30">
                  <DialogHeader>
                    <DialogTitle className="text-quantum-glow">GitHub Integration</DialogTitle>
                  </DialogHeader>
                  <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
                    <GitHubIntegration />
                  </div>
                </DialogContent>
              </Dialog>
              <UserProfileDropdown />
            </div>
          </div>
          <div className="p-6">
            {renderContent()}
          </div>
        </div>

        {/* AI Copilot Sidebar */}
        {aiSidebarOpen && (
          <div className="w-96 border-l border-quantum-neon/30 bg-quantum-dark">
            <Card className="h-full rounded-none border-0 bg-transparent">
              <CardContent className="p-0 h-full">
                <QuantumAICoPilot 
                  circuit={circuit}
                  result={simulationResult}
                  onCircuitUpdate={handleCircuitUpdate}
                  onRunSimulation={handleRunSimulation}
                  numQubits={numQubits}
                  className="h-full"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
