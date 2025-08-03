
import React, { useState } from 'react';
import { QuantumSidebar } from './QuantumSidebar';
import { InteractiveCircuitBuilder } from './circuits/InteractiveCircuitBuilder';
import { QuantumSimulationPanel } from './circuits/CircuitSimulationPanel';
import { UnifiedAIPanel } from './ai/UnifiedAIPanel';
import { SDKDemoPanel } from './panels/SDKDemoPanel';
import { QuantumAlgorithmsSDK } from './algorithms/QuantumAlgorithmsSDK';
import { MemoryPanel } from './panels/MemoryPanel';
import { EnhancedFilesPanel } from './qfs/EnhancedFilesPanel';
import { JobsPanel } from './panels/JobsPanel';
import { MarketplacePanel } from './marketplace/MarketplacePanel';
import { CommunityHubPanel } from './community/CommunityHubPanel';
import { HardwareIntegrationHub } from './hardware/HardwareIntegrationHub';

export function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("circuits");
  const [selectedSDK, setSelectedSDK] = useState("javascript");
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const handleSDKSelect = (sdkType: string) => {
    setSelectedSDK(sdkType);
  };

  const handleSimulationComplete = (result: any) => {
    setSimulationResult(result);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "circuits":
        return (
          <InteractiveCircuitBuilder 
            onSimulationComplete={handleSimulationComplete}
          />
        );
      case "simulation":
        return (
          <QuantumSimulationPanel 
            onSimulationComplete={handleSimulationComplete}
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
      case "optimization":
        return <div className="p-6 text-center text-quantum-neon">Optimization Panel Coming Soon</div>;
      case "memory":
        return <MemoryPanel />;
      case "files":
        return <EnhancedFilesPanel />;
      case "jobs":
        return <JobsPanel />;
      default:
        return (
          <InteractiveCircuitBuilder 
            onSimulationComplete={handleSimulationComplete}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-quantum-void text-quantum-text">
      <div className="w-64 bg-quantum-dark border-r border-quantum-neon/30">
        <QuantumSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onSDKSelect={handleSDKSelect}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
