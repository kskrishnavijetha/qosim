
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlgorithmLibrary } from './AlgorithmLibrary';
import { CodeEditorSDK } from './CodeEditorSDK';
import { DocumentationCenter } from './DocumentationCenter';
import { ExportCenter } from './ExportCenter';
import { PerformanceBenchmark } from './PerformanceBenchmark';
import { useCircuitWorkspace } from '@/hooks/useCircuitWorkspace';
import { Code2, BookOpen, Download, Zap, Settings, Play } from 'lucide-react';

export function QuantumAlgorithmsSDK() {
  const [activeTab, setActiveTab] = useState("algorithms");
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python'>('javascript');
  const workspace = useCircuitWorkspace();

  return (
    <div className="h-full bg-quantum-void text-quantum-neon">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-quantum-glow quantum-float">
              Quantum Algorithms SDK
            </h1>
            <p className="text-quantum-particle mt-2">
              Build, test, and deploy quantum algorithms with JavaScript and Python
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="neon-border text-quantum-glow">
              SDK v2.0.0
            </Badge>
            <div className="flex gap-2">
              <Button
                variant={selectedLanguage === 'javascript' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLanguage('javascript')}
                className="neon-border"
              >
                JavaScript
              </Button>
              <Button
                variant={selectedLanguage === 'python' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLanguage('python')}
                className="neon-border"
              >
                Python
              </Button>
            </div>
          </div>
        </div>

        {/* SDK Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 quantum-tabs">
            <TabsTrigger value="algorithms" className="quantum-tab">
              <Zap className="w-4 h-4 mr-2" />
              Algorithm Library
            </TabsTrigger>
            <TabsTrigger value="editor" className="quantum-tab">
              <Code2 className="w-4 h-4 mr-2" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="docs" className="quantum-tab">
              <BookOpen className="w-4 h-4 mr-2" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="export" className="quantum-tab">
              <Download className="w-4 h-4 mr-2" />
              Export & API
            </TabsTrigger>
            <TabsTrigger value="performance" className="quantum-tab">
              <Settings className="w-4 h-4 mr-2" />
              Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="algorithms" className="space-y-6">
            <AlgorithmLibrary 
              selectedLanguage={selectedLanguage}
              workspace={workspace}
            />
          </TabsContent>

          <TabsContent value="editor" className="space-y-6">
            <CodeEditorSDK 
              selectedLanguage={selectedLanguage}
              workspace={workspace}
            />
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <DocumentationCenter selectedLanguage={selectedLanguage} />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <ExportCenter 
              selectedLanguage={selectedLanguage}
              workspace={workspace}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceBenchmark workspace={workspace} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
