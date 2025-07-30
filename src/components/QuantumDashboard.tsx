import { useState } from "react";
import { CircuitsPanel } from "./panels/CircuitsPanel";
import { QuantumAlgorithmsPanel } from "./panels/QuantumAlgorithmsPanel";
import { UnifiedAIPanel } from "./panels/UnifiedAIPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { JobsPanel } from "./panels/JobsPanel";
import { MemoryPanel } from "./panels/MemoryPanel";
import { LogsPanel } from "./panels/LogsPanel";
import { LearnWithTutorials } from "./panels/LearnWithTutorials";
import { SDKDemoPanel } from "./panels/SDKDemoPanel";
import { QuantumSidebar } from "./QuantumSidebar";
import { FeedbackWidget } from "./FeedbackWidget";
import { MyCircuitsPanel } from "./panels/MyCircuitsPanel";

export function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("circuit");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "circuit":
        return <CircuitsPanel />;
      case "my-circuits":
        return <MyCircuitsPanel />;
      case "algorithms":
        return <QuantumAlgorithmsPanel />;
      case "ai":
        return <UnifiedAIPanel />;
      case "files":
        return <FilesPanel />;
      case "jobs":
        return <JobsPanel />;
      case "memory":
        return <MemoryPanel />;
      case "logs":
        return <LogsPanel />;
      case "learning":
        return <LearnWithTutorials />;
      case "sdk":
        return <SDKDemoPanel />;
      default:
        return <CircuitsPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-quantum-matrix text-quantum-glow">
      <div className="flex h-screen">
        <QuantumSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full">
            {renderActiveTab()}
          </div>
        </div>
      </div>
      
      <FeedbackWidget />
    </div>
  );
}
