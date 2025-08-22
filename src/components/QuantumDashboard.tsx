
import React, { useState } from 'react';
import { QuantumSidebar } from './QuantumSidebar';
import { InteractiveCircuitBuilder } from './circuits/InteractiveCircuitBuilder';
import { CircuitSimulationPanel } from './circuits/CircuitSimulationPanel';
import { UnifiedAIPanel } from './ai/UnifiedAIPanel';
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
import { Github } from 'lucide-react';
import GitHubIntegration from './github/GitHubIntegration';
import { QuantumErrorHandler } from './error-handling/QuantumErrorHandler';

export default function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("circuits");
  const [selectedSDK, setSelectedSDK] = useState("javascript");
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);

  const handleSDKSelect = (sdkType: string) => {
    setSelectedSDK(sdkType);
  };

  const handleSimulationComplete = (result: any) => {
    setSimulationResult(result);
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
    try {
      switch (activeTab) {
        case "circuits":
        case "builder":
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
        case "ai":
          return (
            <UnifiedAIPanel 
              circuit={[]}
              onCircuitGenerated={() => {}}
              onAlgorithmGenerated={() => {}}
              onCircuitOptimized={() => {}}
              onCircuitFixed={() => {}}
              onShowStateVisualization={() => {}}
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
    } catch (error) {
      console.error('Error rendering content:', error);
      return (
        <div className="p-6 text-center">
          <p className="text-red-500">Error loading component</p>
          <p className="text-sm text-gray-500 mt-2">Please try refreshing the page</p>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-quantum-void text-quantum-text">
      {/* Error Handler */}
      <QuantumErrorHandler />
      
      <div className="w-64 bg-quantum-dark border-r border-quantum-neon/30">
        <QuantumSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onSDKSelect={handleSDKSelect}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="flex justify-between items-center p-4 border-b border-quantum-matrix bg-quantum-dark">
          <h2 className="text-xl font-bold text-quantum-glow">Quantum OS</h2>
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
    </div>
  );
}
