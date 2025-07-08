import { useState } from "react";
import { QuantumSidebar } from "./QuantumSidebar";
import { QuantumConsole } from "./QuantumConsole";
import { CircuitsPanel } from "./panels/CircuitsPanel";
import { JobsPanel } from "./panels/JobsPanel";
import { MemoryPanel } from "./panels/MemoryPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { LogsPanel } from "./panels/LogsPanel";

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
      <QuantumSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Dynamic Panel */}
        <div className="flex-1">
          {renderPanel()}
        </div>
        
        {/* Console Panel */}
        <QuantumConsole />
      </div>
    </div>
  );
}