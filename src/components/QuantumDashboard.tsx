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
import { Menu, X, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./ui/resizable";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("circuits");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [consoleCollapsed, setConsoleCollapsed] = useState(true);
  const [showSDK, setShowSDK] = useState(false);
  const [sdkType, setSDKType] = useState<string>("");
  const isMobile = useIsMobile();

  const handleSDKSelect = (type: string) => {
    setSDKType(type);
    setShowSDK(true);
    setActiveTab("");
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowSDK(false);
    setSDKType("");
  };

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
      case "javascript-sdk":
        return <SDKDemoPanel key="javascript" defaultSDK="javascript" />;
      case "python-sdk":
        return <SDKDemoPanel key="python" defaultSDK="python" />;
      case "integrations":
        return <IntegrationsRoadmap />;
      default:
        return <CircuitsPanel />;
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
                  currentPanel={activeTab} 
                  onPanelChange={(tab) => {
                    handleTabChange(tab);
                    setShowSidebar(false);
                  }}
                  isSDKActive={showSDK}
                  onSDKToggle={() => {
                    setShowSDK(!showSDK);
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
            currentPanel={activeTab} 
            onPanelChange={handleTabChange}
            isSDKActive={showSDK}
            onSDKToggle={() => setShowSDK(!showSDK)}
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
