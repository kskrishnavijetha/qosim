import React from 'react';
import { BarChart3, Zap, Settings, Users, FileCode, Code } from 'lucide-react';
import { NavItem } from "@/components/ui/nav-item"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionTrigger } from "@/components/ui/accordion"
import { useAuth } from '@/contexts/AuthContext';

interface QuantumSidebarProps {
  currentPanel: string;
  onPanelChange: (panel: string) => void;
  onSDKSelect?: (sdkType: string) => void;
}

export function QuantumSidebar({ 
  currentPanel, 
  onPanelChange, 
  onSDKSelect 
}: QuantumSidebarProps) {
  const { user } = useAuth();

  const panels = [
    { 
      id: 'dashboard', 
      name: 'Dashboard', 
      icon: BarChart3, 
      description: 'System overview and metrics',
      category: 'core'
    },
    { 
      id: 'circuits', 
      name: 'Circuit Builder', 
      icon: Zap, 
      description: 'Visual quantum circuit design',
      category: 'development'
    },
    { 
      id: 'algorithms-sdk', 
      name: 'Algorithms SDK', 
      icon: Code, 
      description: 'Quantum algorithm development',
      category: 'development',
      isNew: true
    },
    { 
      id: 'settings', 
      name: 'Settings', 
      icon: Settings, 
      description: 'Configure system preferences',
      category: 'core'
    },
    { 
      id: 'team', 
      name: 'Team', 
      icon: Users, 
      description: 'Collaborate with team members',
      category: 'collaboration'
    },
    { 
      id: 'files', 
      name: 'Files', 
      icon: FileCode, 
      description: 'Manage quantum files',
      category: 'storage'
    }
  ];

  return (
    <div className="w-64 flex-shrink-0 border-r bg-quantum-void border-quantum-matrix h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="mb-2 text-lg font-semibold text-quantum-glow">
          Quantum OS
        </h2>
        <p className="text-sm text-quantum-particle">
          Welcome, {user?.email || 'Guest'}
        </p>
      </div>

      <Separator />

      <div className="py-2">
        <Accordion type="single" collapsible className="w-full">
          <NavItem
            id="dashboard"
            name="Dashboard"
            icon={BarChart3}
            description="System overview and metrics"
            onClick={() => onPanelChange('dashboard')}
            active={currentPanel === 'dashboard'}
          />
          <AccordionTrigger className="text-quantum-glow hover:text-quantum-neon data-[state=open]:text-quantum-neon">
            Development
          </AccordionTrigger>
          <AccordionContent>
            <NavItem
              id="circuits"
              name="Circuit Builder"
              icon={Zap}
              description="Visual quantum circuit design"
              onClick={() => onPanelChange('circuits')}
              active={currentPanel === 'circuits'}
            />
            <NavItem
              id="algorithms-sdk"
              name="Algorithms SDK"
              icon={Code}
              description="Quantum algorithm development"
              onClick={() => onPanelChange('algorithms-sdk')}
              active={currentPanel === 'algorithms-sdk'}
            />
          </AccordionContent>
          <AccordionTrigger className="text-quantum-glow hover:text-quantum-neon data-[state=open]:text-quantum-neon">
            Collaboration
          </AccordionTrigger>
          <AccordionContent>
            <NavItem
              id="team"
              name="Team"
              icon={Users}
              description="Collaborate with team members"
              onClick={() => onPanelChange('team')}
              active={currentPanel === 'team'}
            />
            <NavItem
              id="files"
              name="Files"
              icon={FileCode}
              description="Manage quantum files"
              onClick={() => onPanelChange('files')}
              active={currentPanel === 'files'}
            />
          </AccordionContent>
          <AccordionTrigger className="text-quantum-glow hover:text-quantum-neon data-[state=open]:text-quantum-neon">
            Settings
          </AccordionTrigger>
          <AccordionContent>
            <NavItem
              id="settings"
              name="Settings"
              icon={Settings}
              description="Configure system preferences"
              onClick={() => onPanelChange('settings')}
              active={currentPanel === 'settings'}
            />
          </AccordionContent>
        </Accordion>
      </div>

      <Separator />

      <div className="mt-auto p-4">
        <p className="text-xs text-quantum-particle">
          QOSim v2.0
        </p>
      </div>
    </div>
  );
}
