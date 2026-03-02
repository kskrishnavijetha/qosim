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
import { Github, Menu, X } from 'lucide-react';
import GitHubIntegration from './github/GitHubIntegration';

export default function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("circuits");
  const [selectedSDK, setSelectedSDK] = useState("javascript");
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [githubDialogOpen, setGithubDialogOpen] = useState(false);
  const [circuit, setCircuit] = useState<any[]>([]);
  const [numQubits, setNumQubits] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    console.log('Running simulation with circuit:', circuit);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

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
      case "ai":
        return (
          <QuantumAICoPilot 
            circuit={circuit}
            result={simulationResult}
            onCircuitUpdate={handleCircuitUpdate}
            onRunSimulation={handleRunSimulation}
            numQubits={numQubits}
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
    <div className="flex h-screen bg-quantum-void text-quantum-text overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile, slides in when open */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        bg-quantum-dark border-r border-quantum-neon/30
      `}>
        {/* Mobile close button */}
        <div className="absolute top-3 right-3 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-quantum-text hover:text-quantum-glow"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <QuantumSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          onSDKSelect={handleSDKSelect}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <div className="flex justify-between items-center px-3 py-2 md:px-4 md:py-3 border-b border-quantum-matrix bg-quantum-dark">
          <div className="flex items-center gap-2">
            {/* Hamburger - mobile only */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-quantum-text hover:text-quantum-glow"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-base md:text-xl font-bold text-quantum-glow truncate">
              <span className="md:hidden">QOSim</span>
              <span className="hidden md:inline">Quantum OS</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* GitHub & profile - hidden on mobile, shown in sidebar footer instead */}
            <Dialog open={githubDialogOpen} onOpenChange={setGithubDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:inline-flex border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10">
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

        {/* Content */}
        <div className="flex-1 overflow-auto p-3 md:p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
