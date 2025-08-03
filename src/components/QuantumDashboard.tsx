import React, { useState } from 'react';
import { QuantumSidebar } from './QuantumSidebar';
import { CircuitBuilder } from './CircuitBuilder';
import { QuantumSimulationPanel } from './simulation/QuantumSimulationPanel';
import { UnifiedAIPanel } from './ai/UnifiedAIPanel';
import { SDKDemoPanel } from './sdk/SDKDemoPanel';
import { QuantumAlgorithmsSDK } from './algorithms/QuantumAlgorithmsSDK';
import { OptimizationPanel } from './optimization/OptimizationPanel';
import { QuantumMemoryPanel } from './memory/QuantumMemoryPanel';
import { QuantumFileSystemPanel } from './filesystem/QuantumFileSystemPanel';
import { QuantumJobsPanel } from './jobs/QuantumJobsPanel';
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
          <CircuitBuilder 
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
            simulationResult={simulationResult}
            onSimulationComplete={handleSimulationComplete}
          />
        );
      case "sdk":
        return <SDKDemoPanel />;
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
        return <OptimizationPanel />;
      case "memory":
        return <QuantumMemoryPanel />;
      case "files":
        return <QuantumFileSystemPanel />;
      case "jobs":
        return <QuantumJobsPanel />;
      default:
        return (
          <CircuitBuilder 
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
