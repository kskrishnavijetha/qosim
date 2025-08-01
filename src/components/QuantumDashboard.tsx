
import React, { useState } from "react";
import { QuantumSidebar } from "./QuantumSidebar";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { CircuitsPanel } from "./panels/CircuitsPanel";
import { MyCircuitsPanel } from "./panels/MyCircuitsPanel";
import { JobsPanel } from "./panels/JobsPanel";
import { MemoryPanel } from "./panels/MemoryPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { LogsPanel } from "./panels/LogsPanel";
import { UnifiedAIPanel } from "./ai/UnifiedAIPanel";
import { LearnWithTutorials } from "./tutorials/LearnWithTutorials";
import { SDKDemoPanel } from "./panels/SDKDemoPanel";
import { QuantumAlgorithmsSDKPanel } from "./panels/QuantumAlgorithmsSDKPanel";
import { IntegrationsRoadmap } from "./IntegrationsRoadmap";
import { MarketplacePanel } from "./marketplace/MarketplacePanel";
import { CommunityHubPanel } from "./community/CommunityHubPanel";

export function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("circuits");
  const [selectedSDK, setSelectedSDK] = useState<string>("javascript");

  const handleSDKSelect = (type: string) => {
    setSelectedSDK(type);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "circuits":
        return <CircuitsPanel />;
      case "my-circuits":
        return <MyCircuitsPanel />;
      case "jobs":
        return <JobsPanel />;
      case "memory":
        return <MemoryPanel />;
      case "files":
        return <FilesPanel />;
      case "logs":
        return <LogsPanel />;
      case "ai-panel":
        return <UnifiedAIPanel />;
      case "learn-tutorials":
        return <LearnWithTutorials />;
      case "sdk-demo":
        return <SDKDemoPanel selectedSDK={selectedSDK} />;
      case "algorithms-sdk":
        return <QuantumAlgorithmsSDKPanel />;
      case "integrations":
        return <IntegrationsRoadmap />;
      case "marketplace":
        return <MarketplacePanel />;
      case "community-hub":
        return <CommunityHubPanel />;
      default:
        return <CircuitsPanel />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-quantum-void text-quantum-glow">
      {/* Header */}
      <div className="h-14 border-b border-quantum-matrix bg-quantum-void/95 backdrop-blur-sm flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-quantum-glow">Quantum OS Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <UserProfileDropdown />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 border-r border-quantum-matrix">
          <QuantumSidebar 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
            onSDKSelect={handleSDKSelect}
          />
        </div>
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
