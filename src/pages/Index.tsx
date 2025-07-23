
import { useState } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { QuantumSidebar } from "@/components/QuantumSidebar";
import { CircuitsPanel } from "@/components/panels/CircuitsPanel";
import { FilesPanel } from "@/components/panels/FilesPanel";
import { JobsPanel } from "@/components/panels/JobsPanel";
import { LogsPanel } from "@/components/panels/LogsPanel";
import { MemoryPanel } from "@/components/panels/MemoryPanel";
import { SDKDemoPanel } from "@/components/panels/SDKDemoPanel";
import { QuantumOSWorkspace } from "@/components/quantum-os/QuantumOSWorkspace";

const Index = () => {
  const [activePanel, setActivePanel] = useState("circuits");

  const renderActivePanel = () => {
    switch (activePanel) {
      case "circuits":
        return <CircuitsPanel />;
      case "files":
        return <FilesPanel />;
      case "jobs":
        return <JobsPanel />;
      case "logs":
        return <LogsPanel />;
      case "memory":
        return <MemoryPanel />;
      case "sdk":
        return <SDKDemoPanel />;
      case "workspace":
        return <QuantumOSWorkspace />;
      default:
        return <CircuitsPanel />;
    }
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-quantum-matrix">
        <QuantumSidebar activePanel={activePanel} onPanelChange={setActivePanel} />
        <main className="flex-1 overflow-hidden">
          {renderActivePanel()}
        </main>
      </div>
    </AuthGuard>
  );
};

export default Index;
