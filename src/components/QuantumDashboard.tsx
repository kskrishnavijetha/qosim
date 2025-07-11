import { useState } from "react";
import { QuantumSidebar } from "./QuantumSidebar";
import { QuantumConsole } from "./QuantumConsole";
import { CircuitsPanel } from "./panels/CircuitsPanel";
import { JobsPanel } from "./panels/JobsPanel";
import { MemoryPanel } from "./panels/MemoryPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { LogsPanel } from "./panels/LogsPanel";
import { FeedbackWidget } from "./FeedbackWidget";

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
      default:
        return <CircuitsPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-quantum-void text-foreground flex">
      {/* Sidebar Navigation */}
      <div className="shrink-0">
        <QuantumSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        {/* Dynamic Panel */}
        <div className="flex-1 min-w-0">
          {renderPanel()}
        </div>
        
        {/* Console Panel */}
        <div className="shrink-0">
          <QuantumConsole />
        </div>
      </div>
      
      {/* Feedback Widget */}
      <FeedbackWidget />
    </div>
  );
}