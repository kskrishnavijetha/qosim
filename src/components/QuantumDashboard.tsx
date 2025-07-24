import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Zap, 
  Cpu, 
  Activity, 
  Code2,
  Terminal,
  BookOpen, 
  Settings, 
  Users,
  Clock,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { CircuitBuilderPanel } from './panels/CircuitBuilderPanel';
import { AlgorithmsPanel } from './panels/AlgorithmsPanel';
import { VisualizationPanel } from './panels/VisualizationPanel';
import { SDKDemoPanel } from './panels/SDKDemoPanel';
import { LearningPanel } from './panels/LearningPanel';
import { SettingsPanel } from './panels/SettingsPanel';
import { SDKDashboard } from './sdk/SDKDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface DashboardPanelProps {
  activePanel:
    | 'dashboard'
    | 'circuit-builder'
    | 'algorithms'
    | 'visualization'
    | 'sdk-tools'
    | 'sdk-demo'
    | 'learning'
    | 'settings';
  setActivePanel: (panel: DashboardPanelProps['activePanel']) => void;
}

export function QuantumDashboard() {
  const [activePanel, setActivePanel] =
    useState<DashboardPanelProps['activePanel']>('dashboard');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to access the Quantum Dashboard.',
      });
    }
  }, [user, toast]);

  return (
    <div className="min-h-screen bg-quantum-void text-quantum-neon">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-quantum-matrix border-r border-quantum-energy/20 p-4">
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-quantum-glow quantum-float">
                QuantumOS
              </h1>
              <p className="text-sm text-quantum-particle">Quantum Simulator</p>
            </div>

            <nav className="space-y-2">
              <Button
                variant={activePanel === 'dashboard' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActivePanel('dashboard')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activePanel === 'circuit-builder' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActivePanel('circuit-builder')}
              >
                <Zap className="mr-2 h-4 w-4" />
                Circuit Builder
              </Button>
              <Button
                variant={activePanel === 'algorithms' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActivePanel('algorithms')}
              >
                <Cpu className="mr-2 h-4 w-4" />
                Algorithms
              </Button>
              <Button
                variant={activePanel === 'visualization' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActivePanel('visualization')}
              >
                <Activity className="mr-2 h-4 w-4" />
                Visualization
              </Button>
              <Button
                variant={activePanel === 'sdk-tools' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActivePanel('sdk-tools')}
              >
                <Code2 className="mr-2 h-4 w-4" />
                SDK Tools
              </Button>
              <Button
                variant={activePanel === 'sdk-demo' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActivePanel('sdk-demo')}
              >
                <Terminal className="mr-2 h-4 w-4" />
                SDK Demo
              </Button>
              <Button
                variant={activePanel === 'learning' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActivePanel('learning')}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Learning Center
              </Button>
              <Button
                variant={activePanel === 'settings' ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActivePanel('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-quantum-void border-b border-quantum-energy/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-quantum-glow">
                  {activePanel.replace('-', ' ').replace(/\b\w/g, (l) =>
                    l.toUpperCase()
                  )}
                </h2>
                <p className="text-sm text-quantum-particle">
                  Explore the quantum realm
                </p>
              </div>
              {/* User Info */}
              {user && (
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="text-lg font-semibold text-quantum-neon">
                      {user.email}
                    </h3>
                    <p className="text-sm text-quantum-particle">
                      User ID: {user.id}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Rendering */}
          {activePanel === 'dashboard' && (
            <Card className="h-full quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-xl text-quantum-glow">
                  Welcome to QuantumOS!
                </CardTitle>
                <CardDescription className="text-quantum-particle">
                  Explore the quantum world with our simulator.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-quantum-neon">
                  Get started by exploring the Circuit Builder, Algorithms, and
                  Visualization tools.
                </p>
                <Button onClick={() => setActivePanel('circuit-builder')}>
                  Go to Circuit Builder <ChevronRight className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {activePanel === 'circuit-builder' && (
            <CircuitBuilderPanel />
          )}

          {activePanel === 'algorithms' && <AlgorithmsPanel />}

          {activePanel === 'visualization' && <VisualizationPanel />}

          {activePanel === 'sdk-tools' && (
            <SDKDashboard />
          )}

          {activePanel === 'sdk-demo' && <SDKDemoPanel />}

          {activePanel === 'learning' && <LearningPanel />}

          {activePanel === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}
