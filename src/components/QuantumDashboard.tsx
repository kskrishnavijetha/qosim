
import { useState } from "react";
import { QuantumSidebar } from "./QuantumSidebar";
import { QuantumConsole } from "./QuantumConsole";
import { CircuitsPanel } from "./panels/CircuitsPanel";
import { JobsPanel } from "./panels/JobsPanel";
import { MemoryPanel } from "./panels/MemoryPanel";
import { EnhancedFilesPanel } from "./qfs/EnhancedFilesPanel";
import { LogsPanel } from "./panels/LogsPanel";
import { FeedbackWidget } from "./FeedbackWidget";
import { IntegrationsRoadmap } from "./IntegrationsRoadmap";
import { SDKDemoPanel } from "./panels/SDKDemoPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("circuits");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const isMobile = useIsMobile();

  const renderPanel = () => {
    switch (activeTab) {
      case "circuits":
        return <CircuitsPanel />;
      case "jobs":
        return <JobsPanel />;
      case "memory":
        return <MemoryPanel />;
      case "files":
        return <EnhancedFilesPanel />;
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
    <div className="min-h-screen bg-quantum-void text-foreground flex flex-col lg:flex-row relative">
      {/* Mobile Header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-quantum-matrix bg-quantum-void z-50">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden"
            >
              {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="text-lg font-bold text-quantum-glow">Quantum OS</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConsole(!showConsole)}
            className="text-quantum-neon"
          >
            Console
          </Button>
        </div>
      )}

      {/* Sidebar - Mobile Overlay */}
      {isMobile && showSidebar && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      {/* Sidebar Navigation */}
      <div className={cn(
        "z-50 transition-transform duration-300",
        isMobile 
          ? cn(
              "fixed top-0 left-0 h-full transform",
              showSidebar ? "translate-x-0" : "-translate-x-full"
            )
          : "shrink-0"
      )}>
        <QuantumSidebar 
          activeTab={activeTab} 
          onTabChange={(tab) => {
            setActiveTab(tab);
            if (isMobile) setShowSidebar(false);
          }} 
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dynamic Panel */}
        <div className="flex-1 min-w-0 overflow-auto">
          {renderPanel()}
        </div>
        
        {/* Console Panel - Mobile Bottom Sheet */}
        {isMobile ? (
          showConsole && (
            <div className="fixed bottom-0 left-0 right-0 h-1/3 bg-quantum-void border-t border-quantum-matrix z-40 transform transition-transform duration-300">
              <div className="flex items-center justify-between p-2 border-b border-quantum-matrix">
                <h3 className="text-sm font-semibold text-quantum-glow">Console</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConsole(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="h-full overflow-auto">
                <QuantumConsole />
              </div>
            </div>
          )
        ) : (
          /* Desktop Console */
          <div className="shrink-0 hidden xl:block">
            <QuantumConsole />
          </div>
        )}
      </div>
      
      {/* Feedback Widget */}
      <FeedbackWidget />
    </div>
  );
}
