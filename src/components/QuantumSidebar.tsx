import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Zap, Code, Code2, ChevronDown, LayoutDashboard, NotebookPen, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircuitsPanel } from "./CircuitsPanel";
import { TemplatesPanel } from "./TemplatesPanel";
import { QuantumAlgorithmsPanel } from "./algorithms/QuantumAlgorithmsPanel";
import { JavaScriptSDKDemoPanel } from "./panels/JavaScriptSDKDemoPanel";
import { PythonSDKDemoPanel } from "./panels/PythonSDKDemoPanel";

interface QuantumSidebarProps {
  onTabChange: (tab: string) => void;
  activeTab: string;
  onTemplateSelect?: (templateId: string) => void;
  onCircuitGenerated?: (gates: any[]) => void;
  onAlgorithmExecuted?: (result: any) => void;
  onSDKSelect?: (sdkType: string) => void;
}

export function QuantumSidebar({ 
  onTabChange, 
  activeTab, 
  onTemplateSelect, 
  onCircuitGenerated,
  onAlgorithmExecuted,
  onSDKSelect
}: QuantumSidebarProps) {
  const handleTemplateSelect = useCallback((templateId: string) => {
    onTemplateSelect?.(templateId);
  }, [onTemplateSelect]);

  return (
    <div className="w-80 bg-quantum-void border-r border-quantum-matrix flex flex-col h-full quantum-grid">
      <div className="p-4 border-b border-quantum-matrix">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-quantum-glow quantum-float">QOSim</h2>
          <Badge variant="outline" className="text-quantum-particle neon-border">
            v2.0
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center justify-between px-3 py-2 bg-quantum-matrix rounded-lg border border-quantum-neon/20 hover:border-quantum-glow/50 transition-colors text-quantum-neon">
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    SDK Tools
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-quantum-matrix border-quantum-neon/20">
                <DropdownMenuItem 
                  onClick={() => onSDKSelect?.('quantum-algorithms')}
                  className="text-quantum-neon hover:bg-quantum-void/50"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Quantum Algorithms SDK
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-quantum-matrix" />
                <DropdownMenuItem 
                  onClick={() => onTabChange("javascript-sdk")}
                  className="text-quantum-neon hover:bg-quantum-void/50"
                >
                  <Code className="w-4 h-4 mr-2" />
                  JavaScript SDK
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onTabChange("python-sdk")}
                  className="text-quantum-neon hover:bg-quantum-void/50"
                >
                  <Code2 className="w-4 h-4 mr-2" />
                  Python SDK
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            variant="secondary"
            className="w-full justify-start neon-border"
            onClick={() => onTabChange("circuit-builder")}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Circuit Builder
          </Button>
          <Button
            variant="secondary"
            className="w-full justify-start neon-border"
            onClick={() => onTabChange("templates")}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button
            variant="secondary"
            className="w-full justify-start neon-border"
            onClick={() => onTabChange("algorithms")}
          >
            <NotebookPen className="w-4 h-4 mr-2" />
            Algorithms
          </Button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-sm text-quantum-neon mb-2">
          {activeTab === "templates" ? "Explore Templates" : "Search Circuits"}
        </h3>
        <Input placeholder="Search..." className="quantum-panel neon-border" />
      </div>
    </div>
  );
}
