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
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <Activity className="w-8 h-8 text-quantum-glow particle-animation" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-quantum-neon rounded-full quantum-orbit"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-quantum-glow quantum-float">Quantum OS</h1>
            <p className="text-xs text-quantum-neon font-mono">Simulator v2.1.0</p>
          </div>
        </div>
        
        <nav className="space-y-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-500 relative group",
                  "hover:bg-quantum-matrix hover:quantum-glow hover:scale-105",
                  isActive 
                    ? "bg-quantum-matrix text-quantum-glow quantum-glow neon-border scale-105" 
                    : "text-muted-foreground hover:text-quantum-neon"
                )}
              >
                <div className="relative">
                  <Icon className={cn("w-5 h-5 transition-all duration-300", 
                    isActive ? "quantum-float" : "group-hover:scale-110"
                  )} />
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-quantum-glow rounded-full particle-animation"></div>
                  )}
                </div>
                <span className="font-mono font-medium">{item.label}</span>
                
                {/* Hover effect line */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-quantum-glow to-quantum-neon rounded-r transition-all duration-300",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                )} />
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