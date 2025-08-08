import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Cpu,
  Brain,
  Code,
  Zap,
  Cloud,
  Users,
  BookOpen,
  Settings,
  MemoryStick,
  FolderOpen,
  Play,
  ShoppingCart,
  Target,
  Database,
  Lightbulb
} from "lucide-react";

interface QuantumSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSDKSelect: (sdk: string) => void;
}

const sidebarSections = [
  {
    title: "Core Tools",
    items: [
      { id: "circuits", label: "Circuit Builder", icon: Cpu },
      { id: "my-circuits", label: "My Circuits", icon: Database },
      { id: "simulation", label: "Simulation", icon: Play },
      { id: "ai", label: "AI Assistant", icon: Brain },
    ]
  },
  {
    title: "Development",
    items: [
      { id: "sdk", label: "SDK Playground", icon: Code },
      { id: "algorithms", label: "Algorithms", icon: Lightbulb },
      { id: "error-correction", label: "Error Correction", icon: Target, badge: "New" },
      { id: "optimization", label: "Optimization", icon: Zap },
    ]
  },
  {
    title: "Hardware & Cloud",
    items: [
      { id: "hardware", label: "Hardware", icon: Cpu },
      { id: "jobs", label: "Jobs", icon: Cloud },
    ]
  },
  {
    title: "Community & Learning",
    items: [
      { id: "marketplace", label: "Marketplace", icon: ShoppingCart },
      { id: "community", label: "Community", icon: Users },
    ]
  },
  {
    title: "System",
    items: [
      { id: "memory", label: "Memory", icon: MemoryStick },
      { id: "files", label: "Files", icon: FolderOpen },
    ]
  }
];

export function QuantumSidebar({ activeTab, onTabChange, onSDKSelect }: QuantumSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-quantum-dark text-quantum-text">
      <div className="p-4 border-b border-quantum-matrix">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-quantum-neon to-quantum-glow flex items-center justify-center">
            <Zap className="w-5 h-5 text-quantum-void" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-quantum-glow">QOSim</h1>
            <p className="text-xs text-quantum-text opacity-60">Quantum OS</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4 space-y-6">
          {sidebarSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-medium text-quantum-text opacity-60 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start text-left h-9",
                      activeTab === item.id
                        ? "bg-quantum-neon/20 text-quantum-glow border-quantum-neon/50"
                        : "text-quantum-text hover:bg-quantum-matrix hover:text-quantum-glow"
                    )}
                    onClick={() => {
                      onTabChange(item.id);
                      if (item.id === "sdk") {
                        onSDKSelect("javascript");
                      }
                    }}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        variant="outline" 
                        className="ml-2 text-xs bg-quantum-neon/20 text-quantum-neon border-quantum-neon/50"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                ))}
              </div>
              <Separator className="mt-4 bg-quantum-matrix" />
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-quantum-matrix">
        <div className="text-xs text-quantum-text opacity-60 space-y-1">
          <div>Version 2.0.0</div>
          <div>© 2024 Quantum OS</div>
        </div>
      </div>
    </div>
  );
}
