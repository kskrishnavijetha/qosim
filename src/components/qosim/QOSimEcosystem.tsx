
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Cpu, 
  Code, 
  GraduationCap, 
  Store, 
  Cloud, 
  Users, 
  Zap,
  BookOpen,
  Settings,
  PlayCircle
} from 'lucide-react';
import { QuantumCircuitBuilder } from './circuit-builder/QuantumCircuitBuilder';
import { QuantumSDKWorkspace } from './sdk/QuantumSDKWorkspace';
import { QuantumEducationMode } from './education/QuantumEducationMode';
import { QuantumMarketplace } from './marketplace/QuantumMarketplace';
import { QuantumHardwareIntegration } from './hardware/QuantumHardwareIntegration';
import { QFSCollaborationHub } from './collaboration/QFSCollaborationHub';
import { useAuth } from '@/contexts/AuthContext';

export function QOSimEcosystem() {
  const [activeTab, setActiveTab] = useState('circuit-builder');
  const { user } = useAuth();

  const tabs = [
    {
      id: 'circuit-builder',
      label: 'Circuit Builder',
      icon: Cpu,
      description: 'Visual quantum circuit designer',
      component: QuantumCircuitBuilder
    },
    {
      id: 'sdk',
      label: 'Algorithms SDK',
      icon: Code,
      description: 'Python & JavaScript development',
      component: QuantumSDKWorkspace
    },
    {
      id: 'education',
      label: 'Education Mode',
      icon: GraduationCap,
      description: 'Interactive tutorials & learning',
      component: QuantumEducationMode
    },
    {
      id: 'marketplace',
      label: 'Marketplace',
      icon: Store,
      description: 'Community circuits & algorithms',
      component: QuantumMarketplace
    },
    {
      id: 'hardware',
      label: 'Hardware Integration',
      icon: Cloud,
      description: 'Connect to quantum computers',
      component: QuantumHardwareIntegration
    },
    {
      id: 'collaboration',
      label: 'QFS Collaboration',
      icon: Users,
      description: 'Version control & teamwork',
      component: QFSCollaborationHub
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-quantum-void text-quantum-neon">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-quantum-glow mb-2">
                QOSim Ecosystem
              </h1>
              <p className="text-quantum-particle">
                The world's first interactive Quantum OS Simulator with QFS collaboration
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="neon-border">
                v2.0.0
              </Badge>
              {user && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-quantum-neon">
                    {user.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              className="neon-border"
              onClick={() => setActiveTab('circuit-builder')}
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Quick Start
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="neon-border"
              onClick={() => setActiveTab('education')}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Learn
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="neon-border"
              onClick={() => setActiveTab('marketplace')}
            >
              <Store className="w-4 h-4 mr-2" />
              Explore
            </Button>
          </div>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 quantum-tabs">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id}
                value={tab.id} 
                className="quantum-tab flex items-center gap-2"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                {currentTab && (
                  <>
                    <currentTab.icon className="w-5 h-5" />
                    {currentTab.label}
                  </>
                )}
              </CardTitle>
              <p className="text-quantum-particle">
                {currentTab?.description}
              </p>
            </CardHeader>
            <CardContent>
              {tabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <tab.component />
                </TabsContent>
              ))}
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}
