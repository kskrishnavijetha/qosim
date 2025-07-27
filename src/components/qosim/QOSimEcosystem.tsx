
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Code, 
  GraduationCap, 
  Store, 
  Cloud, 
  Users,
  BookOpen,
  Award,
  TrendingUp,
  Settings
} from 'lucide-react';
import { EnhancedCircuitBuilder } from './circuit-builder/EnhancedCircuitBuilder';
import { QuantumSDKWorkspace } from './sdk/QuantumSDKWorkspace';
import { QuantumEducationMode } from './education/QuantumEducationMode';
import { QuantumMarketplace } from './marketplace/QuantumMarketplace';
import { QuantumHardwareIntegration } from './hardware/QuantumHardwareIntegration';
import { QFSCollaborationHub } from './collaboration/QFSCollaborationHub';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface QOSimStats {
  activeUsers: number;
  circuitsCreated: number;
  algorithmsRun: number;
  hardwareJobs: number;
  communityContributions: number;
}

export function QOSimEcosystem() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('builder');
  const [stats, setStats] = useState<QOSimStats>({
    activeUsers: 1247,
    circuitsCreated: 8934,
    algorithmsRun: 15672,
    hardwareJobs: 284,
    communityContributions: 432
  });
  const [isCollaborationEnabled, setIsCollaborationEnabled] = useState(false);

  useEffect(() => {
    // Initialize QOSim ecosystem
    console.log('🚀 Initializing QOSim Ecosystem...');
    
    if (user) {
      setIsCollaborationEnabled(true);
      toast.success('Welcome to QOSim - Quantum OS Simulator!');
    }

    // Update stats periodically
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
        circuitsCreated: prev.circuitsCreated + Math.floor(Math.random() * 3),
        algorithmsRun: prev.algorithmsRun + Math.floor(Math.random() * 8)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  const ecosystemTabs = [
    { id: 'builder', label: 'Circuit Builder', icon: Zap, description: 'Visual quantum circuit design' },
    { id: 'sdk', label: 'SDK Workspace', icon: Code, description: 'Python & JavaScript development' },
    { id: 'education', label: 'Learning Mode', icon: GraduationCap, description: 'Interactive tutorials & courses' },
    { id: 'marketplace', label: 'Marketplace', icon: Store, description: 'Community circuits & algorithms' },
    { id: 'hardware', label: 'Hardware', icon: Cloud, description: 'Quantum computer integration' },
    { id: 'collaboration', label: 'Collaboration', icon: Users, description: 'QFS-powered teamwork' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      {/* Header with Stats */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  QOSim Ecosystem
                </h1>
                <p className="text-sm text-muted-foreground">
                  World's First Interactive Quantum OS Simulator
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-muted-foreground">{stats.activeUsers} active</span>
                </div>
                <Badge variant="outline">{stats.circuitsCreated} circuits</Badge>
                <Badge variant="outline">{stats.algorithmsRun} algorithms run</Badge>
                <Badge variant="outline">{stats.hardwareJobs} hardware jobs</Badge>
              </div>
              
              {isCollaborationEnabled && (
                <Button size="sm" variant="outline" className="gap-2">
                  <Users className="w-4 h-4" />
                  Collaborate
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-6 mb-6">
            {ecosystemTabs.map(tab => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="flex flex-col items-center gap-1 h-auto py-3"
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="builder" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Quantum Circuit Builder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EnhancedCircuitBuilder />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sdk" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  SDK Workspace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuantumSDKWorkspace />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Quantum Education Mode
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuantumEducationMode />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Quantum Marketplace
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuantumMarketplace />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hardware" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="w-5 h-5" />
                  Quantum Hardware Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuantumHardwareIntegration />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  QFS Collaboration Hub
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QFSCollaborationHub />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
