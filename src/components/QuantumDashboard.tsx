import { useState } from "react";
import { QuantumSidebar } from "./QuantumSidebar";
import { QuantumConsole } from "./QuantumConsole";
import { QuantumCircuitBuilder } from "./quantum-circuit/QuantumCircuitBuilder";
import { JobsPanel } from "./panels/JobsPanel";
import { MemoryPanel } from "./panels/MemoryPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { LogsPanel } from "./panels/LogsPanel";
import { FeedbackWidget } from "./FeedbackWidget";
import { IntegrationsRoadmap } from "./IntegrationsRoadmap";
import { SDKDemoPanel } from "./panels/SDKDemoPanel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { Menu, X, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from "./ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("quantum-os");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleCollapsed, setConsoleCollapsed] = useState(true);
  const isMobile = useIsMobile();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const renderPanel = () => {
    switch (activeTab) {
      case "quantum-os":
        return <QuantumCircuitBuilder />;
      case "memory":
        return <MemoryPanel />;
      case "files":
        return <FilesPanel />;
      case "logs":
        return <LogsPanel />;
      case "javascript-sdk":
        return <SDKDemoPanel key="javascript" defaultSDK="javascript" />;
      case "python-sdk":
        return <SDKDemoPanel key="python" defaultSDK="python" />;
      case "integrations":
        return <IntegrationsRoadmap />;
      default:
        return <QuantumCircuitBuilder />;
    }
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-quantum-void text-foreground flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-quantum-matrix bg-quantum-void z-50 sticky top-0">
          <div className="flex items-center gap-3">
            <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 quantum-panel">
                <QuantumSidebar 
                  activeTab={activeTab} 
                  onTabChange={(tab) => {
                    handleTabChange(tab);
                    setShowSidebar(false);
                  }}
                />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-bold text-quantum-glow">Quantum OS</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConsole(!showConsole)}
              className="text-quantum-neon"
            >
              Console
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-auto">
            {renderPanel()}
          </div>
          
          {/* Mobile Console Bottom Sheet */}
          {showConsole && (
            <div className="border-t border-quantum-matrix bg-quantum-void">
              <div className="flex items-center justify-between p-3 border-b border-quantum-matrix">
                <h3 className="text-sm font-semibold text-quantum-glow">Console</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConsoleCollapsed(!consoleCollapsed)}
                  >
                    {consoleCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConsole(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className={cn(
                "transition-all duration-300 overflow-hidden",
                consoleCollapsed ? "h-0" : "h-64"
              )}>
                <div className="h-full overflow-auto">
                  <QuantumConsole />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <FeedbackWidget />
      </div>
    );
  }

  // Desktop/Tablet Layout
  return (
    <div className="min-h-screen bg-quantum-void text-foreground">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        {/* Sidebar */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <QuantumSidebar 
            activeTab={activeTab} 
            onTabChange={handleTabChange}
          />
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        {/* Main Content Area */}
        <ResizablePanel defaultSize={60}>
          <ResizablePanelGroup direction="vertical">
            {/* Main Panel */}
            <ResizablePanel defaultSize={70} minSize={50}>
              <div className="h-full overflow-auto">
                {renderPanel()}
              </div>
            </ResizablePanel>
            
            {/* Console Panel */}
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
              <div className="h-full border-t border-quantum-matrix">
                <div className="flex items-center justify-between p-3 border-b border-quantum-matrix bg-quantum-matrix">
                  <h3 className="text-sm font-semibold text-quantum-glow">Console</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConsoleCollapsed(!consoleCollapsed)}
                  >
                    {consoleCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
                <div className={cn(
                  "transition-all duration-300 overflow-hidden",
                  consoleCollapsed ? "h-0" : "h-full"
                )}>
                  <div className="h-full overflow-auto">
                    <QuantumConsole />
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      
      <FeedbackWidget />
    </div>
  );
}
