
import { useState, useEffect } from "react";
import { QuantumSidebar } from "./QuantumSidebar";
import { CircuitsPanel } from "./panels/CircuitsPanel";
import { JobsPanel } from "./panels/JobsPanel";
import { MemoryPanel } from "./panels/MemoryPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { LogsPanel } from "./panels/LogsPanel";
import { SDKDemoPanel } from "./panels/SDKDemoPanel";
import { IntegrationsRoadmap } from "./IntegrationsRoadmap";
import { QuantumAlgorithmsPanel } from "./algorithms/QuantumAlgorithmsPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("circuits");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleSDKSelect = (sdkType: string) => {
    // This is handled by the sidebar's handleSDKSelect function
    // which calls onTabChange with the appropriate tab name
  };

  const renderActivePanel = () => {
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
      case "javascript-sdk":
        return <SDKDemoPanel defaultSDK="javascript" />;
      case "python-sdk":
        return <SDKDemoPanel defaultSDK="python" />;
      case "quantum-algorithms":
        return <QuantumAlgorithmsPanel 
          onCircuitGenerated={(gates) => console.log('Circuit generated:', gates)}
          onAlgorithmExecuted={(result) => console.log('Algorithm executed:', result)}
        />;
      case "integrations":
        return <IntegrationsRoadmap />;
      default:
        return <CircuitsPanel />;
    }
  };

  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-quantum-void">
        <div className="flex items-center justify-between p-4 border-b border-quantum-matrix">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-quantum-glow">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <QuantumSidebar 
                activeTab={activeTab} 
                onTabChange={handleTabChange}
                onSDKSelect={handleSDKSelect}
              />
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/9ba01b22-3dfc-4014-9b17-0ba4cbbca31e.png" 
              alt="QOSim Logo" 
              className="w-6 h-6"
            />
            <span className="text-lg font-bold text-quantum-glow">Quantum OS</span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {renderActivePanel()}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-quantum-void">
      <QuantumSidebar 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        onSDKSelect={handleSDKSelect}
      />
      <div className="flex-1 overflow-hidden">
        {renderActivePanel()}
      </div>
    </div>
  );
}
