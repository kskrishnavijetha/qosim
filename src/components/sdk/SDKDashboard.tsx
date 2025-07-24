
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlgorithmLibrary } from './AlgorithmLibrary';
import { AlgorithmMarketplace } from './AlgorithmMarketplace';
import { InteractiveCodeEditor } from './InteractiveCodeEditor';
import { PerformanceBenchmarks } from './PerformanceBenchmarks';
import { LearningCenter } from './LearningCenter';
import { CollaborationHub } from './CollaborationHub';
import { useCircuitWorkspace } from '@/hooks/useCircuitWorkspace';
import { 
  Code2, 
  Library, 
  Store, 
  Gauge, 
  GraduationCap, 
  Users, 
  Search,
  Sparkles,
  Cpu
} from 'lucide-react';

export function SDKDashboard() {
  const [activeTab, setActiveTab] = useState('library');
  const [searchQuery, setSearchQuery] = useState('');
  const { circuit, addGate, clearCircuit } = useCircuitWorkspace();

  const sdkStats = {
    algorithmsCount: 25,
    communityAlgorithms: 147,
    activeUsers: 1250,
    totalRuns: 15680
  };

  return (
    <div className="min-h-screen bg-quantum-void text-quantum-neon p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cpu className="w-10 h-10 text-quantum-glow" />
            <h1 className="text-4xl font-bold font-mono text-quantum-glow quantum-float">
              QOSim Algorithms SDK
            </h1>
            <Sparkles className="w-8 h-8 text-quantum-energy animate-pulse" />
          </div>
          <p className="text-lg text-quantum-particle max-w-3xl mx-auto">
            Comprehensive quantum algorithm library with interactive tools, 
            performance benchmarking, and collaborative development environment
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="quantum-panel neon-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-quantum-glow">{sdkStats.algorithmsCount}</div>
                <div className="text-sm text-quantum-particle">Built-in Algorithms</div>
              </CardContent>
            </Card>
            <Card className="quantum-panel neon-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-quantum-energy">{sdkStats.communityAlgorithms}</div>
                <div className="text-sm text-quantum-particle">Community Algorithms</div>
              </CardContent>
            </Card>
            <Card className="quantum-panel neon-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-quantum-neon">{sdkStats.activeUsers}</div>
                <div className="text-sm text-quantum-particle">Active Developers</div>
              </CardContent>
            </Card>
            <Card className="quantum-panel neon-border">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-quantum-matrix">{sdkStats.totalRuns}</div>
                <div className="text-sm text-quantum-particle">Total Executions</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Global Search */}
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-quantum-particle" />
              <Input
                placeholder="Search algorithms, tutorials, or community projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-quantum-matrix border-quantum-neon/30 text-quantum-neon placeholder:text-quantum-particle"
              />
            </div>
          </CardContent>
        </Card>

        {/* Main SDK Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 quantum-tabs">
            <TabsTrigger value="library" className="quantum-tab">
              <Library className="w-4 h-4 mr-2" />
              Algorithm Library
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="quantum-tab">
              <Store className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="editor" className="quantum-tab">
              <Code2 className="w-4 h-4 mr-2" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="benchmarks" className="quantum-tab">
              <Gauge className="w-4 h-4 mr-2" />
              Benchmarks
            </TabsTrigger>
            <TabsTrigger value="learning" className="quantum-tab">
              <GraduationCap className="w-4 h-4 mr-2" />
              Learning Center
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="quantum-tab">
              <Users className="w-4 h-4 mr-2" />
              Collaboration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-6">
            <AlgorithmLibrary 
              searchQuery={searchQuery}
              onAlgorithmSelect={(algorithm) => {
                // Load algorithm into workspace
                clearCircuit();
                algorithm.gates?.forEach(gate => addGate(gate));
              }}
            />
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <AlgorithmMarketplace searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <InteractiveCodeEditor 
              currentCircuit={circuit}
              onCircuitUpdate={(newCircuit) => {
                clearCircuit();
                newCircuit.forEach(gate => addGate(gate));
              }}
            />
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-6">
            <PerformanceBenchmarks />
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <LearningCenter />
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-6">
            <CollaborationHub />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
