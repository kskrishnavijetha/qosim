import { useState } from "react";
import { Cpu, Database, FileText, GitBranch, Activity, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantumSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: "circuits", label: "Circuits", icon: GitBranch },
  { id: "jobs", label: "Jobs", icon: Cpu },
  { id: "memory", label: "Memory", icon: Database },
  { id: "files", label: "Files", icon: FileText },
  { id: "logs", label: "Runtime Logs", icon: Terminal },
];

export function QuantumSidebar({ activeTab, onTabChange }: QuantumSidebarProps) {
  return (
    <div className="w-64 bg-quantum-void border-r neon-border quantum-panel h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Activity className="w-8 h-8 text-quantum-glow particle-animation" />
          <div>
            <h1 className="text-xl font-bold text-quantum-glow">Quantum OS</h1>
            <p className="text-xs text-quantum-neon">Simulator v2.1.0</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                  "hover:bg-quantum-matrix hover:quantum-glow",
                  isActive 
                    ? "bg-quantum-matrix text-quantum-glow quantum-glow neon-border" 
                    : "text-muted-foreground hover:text-quantum-neon"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-mono">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="mt-8 p-4 quantum-panel rounded-lg">
          <h3 className="text-sm font-semibold text-quantum-neon mb-2">System Status</h3>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between">
              <span>Qubits:</span>
              <span className="text-quantum-glow">128/256</span>
            </div>
            <div className="flex justify-between">
              <span>Entangled:</span>
              <span className="text-quantum-neon">64</span>
            </div>
            <div className="flex justify-between">
              <span>Coherence:</span>
              <span className="text-green-400">98.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}