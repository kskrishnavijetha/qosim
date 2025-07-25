
import React, { useState } from "react";
import {
  Cpu,
  MemoryStick,
  Folder,
  FileText,
  Code2,
  Plug,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuantumSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function QuantumSidebar({ activeTab, onTabChange }: QuantumSidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("core");
  const isMobile = useIsMobile();

  const toggleCategory = (category: string) => {
    setExpandedCategory((prev) => (prev === category ? null : category));
  };

  const menuItems = [
    { id: "quantum-os", label: "Quantum OS", icon: Cpu, category: "core" },
    { id: "memory", label: "Memory", icon: MemoryStick, category: "system" },
    { id: "files", label: "Files", icon: Folder, category: "system" },
    { id: "logs", label: "Logs", icon: FileText, category: "system" },
    { id: "javascript-sdk", label: "JavaScript SDK", icon: Code2, category: "sdk" },
    { id: "python-sdk", label: "Python SDK", icon: Code2, category: "sdk" },
    { id: "sdk-tools", label: "Quantum Algorithms SDK", icon: Wrench, category: "sdk" },
    { id: "integrations", label: "Integrations", icon: Plug, category: "extend" },
  ];

  const renderMenuItems = (category: string) => {
    const items = menuItems.filter((item) => item.category === category);

    return items.map((item) => (
      <Button
        key={item.id}
        variant="ghost"
        className={`w-full justify-start ${
          activeTab === item.id ? "bg-secondary/50" : ""
        }`}
        onClick={() => onTabChange(item.id)}
      >
        <item.icon className="mr-2 h-4 w-4" />
        <span>{item.label}</span>
      </Button>
    ));
  };

  const renderCategory = (category: string, label: string, IconComponent: any) => {
    const isExpanded = expandedCategory === category;

    return (
      <div key={category} className="space-y-1">
        <Button
          variant="secondary"
          className="w-full justify-between"
          onClick={() => toggleCategory(category)}
        >
          <div className="flex items-center">
            <IconComponent className="mr-2 h-4 w-4" />
            <span>{label}</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </Button>
        {isExpanded && <div className="pl-2">{renderMenuItems(category)}</div>}
      </div>
    );
  };

  return (
    <div className="flex h-full min-w-[200px] flex-col border-r bg-background/95 backdrop-blur-sm">
      <div className="px-4 py-2 text-center">
        <h2 className="text-lg font-bold">Quantum OS</h2>
        <p className="text-sm text-muted-foreground">v0.5.0-alpha</p>
      </div>
      <Separator />
      <ScrollArea className="flex-1 space-y-4 p-4">
        {renderCategory("core", "Core Tools", Cpu)}
        {renderCategory("system", "System Tools", MemoryStick)}
        {renderCategory("sdk", "SDK Tools", Code2)}
        {renderCategory("extend", "Integrations", Plug)}
      </ScrollArea>
      {!isMobile && <Separator />}
      {!isMobile && (
        <div className="p-4">
          <a
            href="https://github.com/Quantum-Tinkerers/quantum-lab"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary" className="w-full">
              GitHub
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
