

import { useState } from "react";
import { QuantumSidebar } from "@/components/QuantumSidebar";
import { QuantumOSWorkspace } from "@/components/quantum-os/QuantumOSWorkspace";
import { MemoryPanel } from "@/components/panels/MemoryPanel";
import { FilesPanel } from "@/components/panels/FilesPanel";
import { LogsPanel } from "@/components/panels/LogsPanel";
import { IntegrationsRoadmap } from "@/components/IntegrationsRoadmap";
import { SDKDemoPanel } from "@/components/panels/SDKDemoPanel";
import { PythonAPIPlayground } from "@/components/sdk/PythonAPIPlayground";
import { QuantumAlgorithmsSDK } from "@/components/sdk/QuantumAlgorithmsSDK";

export default function Index() {
  const [activeTab, setActiveTab] = useState("quantum-os");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "quantum-os":
        return <QuantumOSWorkspace />;
      case "memory":
        return <MemoryPanel />;
      case "files":
        return <FilesPanel />;
      case "logs":
        return <LogsPanel />;
      case "integrations":
        return <IntegrationsRoadmap />;
      case "quantum-algorithms-sdk":
        return <QuantumAlgorithmsSDK />;
      case "javascript-sdk":
        return <SDKDemoPanel defaultSDK="javascript" />;
      case "python-sdk":
        return <PythonAPIPlayground circuit={[]} />;
      default:
        return <QuantumOSWorkspace />;
    }
  };

  return (
    <div className="min-h-screen bg-quantum-void text-quantum-neon flex">
      <QuantumSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <main className="flex-1 p-6 overflow-x-auto">
        {renderContent()}
      </main>
    </div>
  );
}

