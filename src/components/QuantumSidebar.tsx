
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  CircuitBoard,
  Zap,
  Bot,
  Code,
  Cpu,
  Store,
  Users,
  Calculator,
  ShieldCheck,
  Gauge,
  Database,
  FolderOpen,
  BrainCircuit,
  Brain,
  Briefcase,
  FileCode
} from 'lucide-react';

interface QuantumSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSDKSelect: (sdkType: string) => void;
}

export function QuantumSidebar({ activeTab, onTabChange, onSDKSelect }: QuantumSidebarProps) {
  const menuItems = [
    { id: "circuits", label: "Circuit Builder", icon: CircuitBoard, description: "Design quantum circuits" },
    { id: "my-circuits", label: "My Circuits", icon: FileCode, description: "Saved circuits" },
    { id: "qnn-builder", label: "QNN Builder", icon: BrainCircuit, description: "Quantum Neural Networks", badge: "NEW" },
    { id: "simulation", label: "Simulation", icon: Zap, description: "Run simulations" },
    { id: "ai", label: "AI Assistant", icon: Bot, description: "Quantum AI tools" },
    { id: "sdk", label: "SDK Playground", icon: Code, description: "Test SDK features" },
    { id: "hardware", label: "Hardware", icon: Cpu, description: "Real quantum devices" },
    { id: "marketplace", label: "Marketplace", icon: Store, description: "Quantum apps & tools" },
    { id: "community", label: "Community", icon: Users, description: "Connect with others" },
    { id: "algorithms", label: "Algorithms", icon: Calculator, description: "Pre-built algorithms" },
    { id: "error-correction", label: "Error Correction", icon: ShieldCheck, description: "Quantum error correction" },
    { id: "optimization", label: "Optimization", icon: Gauge, description: "Circuit optimization" },
    { id: "memory", label: "Memory", icon: Database, description: "System memory" },
    { id: "files", label: "Files", icon: FolderOpen, description: "File management" },
    { id: "jobs", label: "Jobs", icon: Briefcase, description: "Background tasks" }
  ];

  return (
    <div className="flex flex-col h-full bg-quantum-dark border-r border-quantum-neon/30">
      {/* Header */}
      <div className="p-4 border-b border-quantum-matrix">
        <h1 className="text-lg font-bold text-quantum-glow">QOSim</h1>
        <p className="text-sm text-quantum-text/70">Quantum Operating System</p>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "secondary" : "ghost"}
              className={`w-full justify-start h-12 ${
                activeTab === item.id 
                  ? "bg-quantum-glow/20 text-quantum-glow border-quantum-glow/30" 
                  : "text-quantum-text hover:bg-quantum-neon/10 hover:text-quantum-glow"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              <div className="flex flex-col items-start flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs bg-quantum-energy/20 text-quantum-energy">
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-quantum-text/60">{item.description}</span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-quantum-matrix">
        <div className="text-xs text-quantum-text/50">
          <div>QOSim v2.0.0</div>
          <div>Quantum Computing Platform</div>
        </div>
      </div>
    </div>
  );
}
