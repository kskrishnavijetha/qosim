import { useState } from "react";
import { QuantumSidebar } from "./QuantumSidebar";
import { QuantumConsole } from "./QuantumConsole";
import { CircuitsPanel } from "./panels/CircuitsPanel";
import { JobsPanel } from "./panels/JobsPanel";
import { MemoryPanel } from "./panels/MemoryPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { LogsPanel } from "./panels/LogsPanel";
import { FeedbackWidget } from "./FeedbackWidget";
import { IntegrationsRoadmap } from "./IntegrationsRoadmap";
import { SDKDemoPanel } from "./panels/SDKDemoPanel";

export function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("circuits");

  const renderPanel = () => {
    switch (activeTab) {
      case "circuits":
        return <CircuitsPanel />;
      case "jobs":
        return <JobsPanel />;
      case "memory":
        return <MemoryPanel />;
      case "files":
        return <FilesPanel />;
      case "logs":
        return <LogsPanel />;
      case "sdk":
        return <SDKDemoPanel />;
      case "integrations":
        return <IntegrationsRoadmap />;
      default:
        return <CircuitsPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-quantum-void text-foreground flex relative">
      {/* Sidebar Navigation */}
      <div className="shrink-0 z-10">
        <QuantumSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0 overflow-hidden">
        {/* Dynamic Panel */}
        <div className="flex-1 min-w-0 overflow-auto">
          {renderPanel()}
        </div>
        
        {/* Console Panel */}
        <div className="shrink-0 hidden lg:block">
          <QuantumConsole />
        </div>
      </div>
      
      {/* Feedback Widget */}
      <FeedbackWidget />
    </div>
  );
}