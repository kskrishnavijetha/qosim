
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Circuit, 
  Zap, 
  Bot,
  Settings,
  HelpCircle,
  Code,
  Database,
  TestTube,
  Layers,
  Monitor
} from 'lucide-react';

interface QuantumSidebarProps {
  currentPanel: string;
  onPanelChange: (panel: string) => void;
  isSDKActive: boolean;
  onSDKToggle: () => void;
}

export function QuantumSidebar({ 
  currentPanel, 
  onPanelChange, 
  isSDKActive, 
  onSDKToggle 
}: QuantumSidebarProps) {
  const menuItems = [
    { id: 'circuits', label: 'Circuit Builder', icon: Circuit },
    { id: 'sdk', label: 'SDK Demo', icon: Code },
    { id: 'algorithms', label: 'Algorithms', icon: Zap },
    { id: 'memory', label: 'Memory', icon: Database },
    { id: 'logs', label: 'Logs', icon: Monitor },
    { id: 'jobs', label: 'Jobs', icon: Layers },
    { id: 'files', label: 'Files', icon: Database },
    { id: 'testing', label: 'Testing', icon: TestTube },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <div className="w-64 bg-quantum-matrix border-r border-quantum-neon/20 flex flex-col">
      <div className="p-4 border-b border-quantum-neon/20">
        <h1 className="text-xl font-bold text-quantum-glow quantum-float">QOSim</h1>
        <p className="text-xs text-quantum-particle mt-1">Quantum Operating System</p>
      </div>
      
      {/* SDK Toggle */}
      <div className="p-4 border-b border-quantum-neon/20">
        <Button
          onClick={onSDKToggle}
          className={`w-full flex items-center gap-2 ${
            isSDKActive 
              ? 'bg-quantum-glow text-quantum-void' 
              : 'bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void'
          }`}
        >
          <Bot className="w-4 h-4" />
          Quantum Algorithms SDK
          {isSDKActive && (
            <Badge variant="secondary" className="ml-auto">
              Active
            </Badge>
          )}
        </Button>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPanel === item.id ? 'default' : 'ghost'}
              className={`w-full justify-start text-left ${
                currentPanel === item.id
                  ? 'bg-quantum-glow text-quantum-void'
                  : 'text-quantum-particle hover:text-quantum-glow hover:bg-quantum-neon/10'
              }`}
              onClick={() => onPanelChange(item.id)}
              disabled={isSDKActive}
            >
              <item.icon className="w-4 h-4 mr-2" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>
      
      <div className="p-4 border-t border-quantum-neon/20">
        <div className="text-xs text-quantum-particle">
          <div className="mb-2">QOSim v2.0.0</div>
          <div className="text-quantum-energy">
            {isSDKActive ? 'SDK Mode Active' : 'Standard Mode'}
          </div>
        </div>
      </div>
    </div>
  );
}
