
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Code, Users, BookOpen, Zap, GitBranch } from 'lucide-react';
import { AlgorithmLibrary } from '@/components/sdk/AlgorithmLibrary';
import { AlgorithmMarketplace } from '@/components/sdk/AlgorithmMarketplace';
import { SDKCodeEditor } from '@/components/sdk/SDKCodeEditor';
import { LearningMode } from '@/components/sdk/LearningMode';
import { PerformanceBenchmark } from '@/components/sdk/PerformanceBenchmark';
import { CollaborationWorkspace } from '@/components/sdk/CollaborationWorkspace';

export function QuantumSDK() {
  const [activeTab, setActiveTab] = useState('library');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-quantum-void text-quantum-neon">
      {/* Header */}
      <div className="border-b border-quantum-matrix/30 bg-gradient-to-r from-quantum-void to-quantum-matrix/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Zap className="w-8 h-8 text-quantum-glow" />
                <div>
                  <h1 className="text-2xl font-bold text-quantum-glow">
                    QOSim Quantum Algorithms SDK
                  </h1>
                  <p className="text-sm text-quantum-particle">
                    Developer-focused quantum algorithm library and tools
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="text-quantum-neon">
                v1.0.0
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-quantum-particle" />
                <Input
                  placeholder="Search algorithms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-quantum-matrix/30 border-quantum-neon/20"
                />
              </div>
              <Button variant="outline" className="neon-border">
                <GitBranch className="w-4 h-4 mr-2" />
                Version Control
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 quantum-tabs">
            <TabsTrigger value="library" className="quantum-tab">
              <Code className="w-4 h-4 mr-2" />
              Algorithm Library
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="quantum-tab">
              <Users className="w-4 h-4 mr-2" />
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="editor" className="quantum-tab">
              <Zap className="w-4 h-4 mr-2" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="learning" className="quantum-tab">
              <BookOpen className="w-4 h-4 mr-2" />
              Learning Mode
            </TabsTrigger>
            <TabsTrigger value="benchmark" className="quantum-tab">
              Performance
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="quantum-tab">
              <GitBranch className="w-4 h-4 mr-2" />
              Collaboration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="space-y-6">
            <AlgorithmLibrary searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-6">
            <AlgorithmMarketplace searchQuery={searchQuery} />
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <SDKCodeEditor />
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <LearningMode />
          </TabsContent>

          <TabsContent value="benchmark" className="space-y-6">
            <PerformanceBenchmark />
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-6">
            <CollaborationWorkspace />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
