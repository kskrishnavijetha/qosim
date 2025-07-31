
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Zap, 
  Play, 
  FileCode, 
  Database, 
  Folder, 
  ScrollText, 
  Cpu, 
  Code, 
  BookOpen,
  ChevronDown,
  ChevronRight,
  Brain,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantumSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSDKSelect: (type: string) => void;
}

export function QuantumSidebar({ activeTab, onTabChange, onSDKSelect }: QuantumSidebarProps) {
  const [sdkExpanded, setSdkExpanded] = useState(false);
  const [circuitsExpanded, setCircuitsExpanded] = useState(true);

  const menuItems = [
    // Circuits Section
    {
      id: "circuits-section",
      label: "Quantum Circuits",
      icon: Layers,
      isSection: true,
      expanded: circuitsExpanded,
      onToggle: () => setCircuitsExpanded(!circuitsExpanded),
      children: [
        { id: "circuits", label: "Circuit Builder", icon: Zap },
        { id: "my-circuits", label: "My Circuits", icon: Database },
      ]
    },
    
    // Core Features
    { id: "jobs", label: "Jobs", icon: Play },
    { id: "memory", label: "Memory", icon: Database },
    { id: "files", label: "QFS", icon: Folder },
    { id: "logs", label: "Logs", icon: ScrollText },
    
    // AI & Learning
    { id: "ai-panel", label: "AI Assistant", icon: Brain },
    { id: "learn-tutorials", label: "Learn", icon: BookOpen },
    
    // Development Section
    {
      id: "sdk-section",
      label: "Development SDKs",
      icon: Code,
      isSection: true,
      expanded: sdkExpanded,
      onToggle: () => setSdkExpanded(!sdkExpanded),
      children: [
        { id: "algorithms-sdk", label: "Algorithms SDK", icon: Cpu },
        { id: "javascript-sdk", label: "JavaScript SDK", icon: FileCode },
        { id: "python-sdk", label: "Python SDK", icon: FileCode },
      ]
    },
    
    // Integrations
    { id: "integrations", label: "Integrations", icon: Layers },
  ];

  const handleItemClick = (item: any) => {
    if (item.isSection) {
      item.onToggle();
      return;
    }

    if (item.id.includes('-sdk')) {
      onSDKSelect(item.id.replace('-sdk', ''));
    } else {
      onTabChange(item.id);
    }
  };

  const isItemActive = (itemId: string) => {
    if (itemId.includes('-sdk')) {
      return activeTab === itemId;
    }
    return activeTab === itemId;
  };

  const renderMenuItem = (item: any, level = 0) => {
    const isActive = isItemActive(item.id);
    const Icon = item.icon;

    if (item.isSection) {
      return (
        <div key={item.id} className="mb-2">
          <Collapsible open={item.expanded} onOpenChange={item.onToggle}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 px-3 py-2 h-auto font-medium text-muted-foreground hover:text-quantum-glow hover:bg-quantum-matrix/50 transition-colors",
                  level > 0 && "ml-4"
                )}
                onClick={() => handleItemClick(item)}
              >
                {item.expanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-1 mt-1">
              {item.children?.map((child: any) => renderMenuItem(child, level + 1))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
    }

    return (
      <Button
        key={item.id}
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 px-3 py-2 h-auto transition-colors",
          level > 0 && "ml-6",
          isActive
            ? "bg-quantum-matrix text-quantum-glow neon-border"
            : "text-muted-foreground hover:text-quantum-glow hover:bg-quantum-matrix/50"
        )}
        onClick={() => handleItemClick(item)}
      >
        <Icon className="w-4 h-4" />
        <span>{item.label}</span>
        {item.badge && (
          <Badge variant="secondary" className="ml-auto text-xs">
            {item.badge}
          </Badge>
        )}
      </Button>
    );
  };

  return (
    <div className="h-full bg-quantum-void border-r border-quantum-matrix flex flex-col quantum-panel">
      {/* Header */}
      <div className="p-4 border-b border-quantum-matrix">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-quantum-glow to-quantum-neon rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="font-bold text-quantum-glow">Quantum OS</h1>
            <p className="text-xs text-muted-foreground">v2.0.1</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-quantum-matrix">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Quantum State:</span>
            <span className="text-quantum-glow">Coherent</span>
          </div>
          <div className="flex justify-between">
            <span>Entanglement:</span>
            <span className="text-quantum-neon">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
