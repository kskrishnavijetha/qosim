
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CodeEditor } from './sdk/CodeEditor';
import { AlgorithmLibrary } from './sdk/AlgorithmLibrary';
import { AlgorithmVisualizer } from './sdk/AlgorithmVisualizer';
import { PlaygroundPanel } from './sdk/PlaygroundPanel';
import { Code, BookOpen, Eye, Terminal } from 'lucide-react';

interface QuantumAlgorithmsSDKProps {
  sharedData: any;
  onDataUpdate: (data: any) => void;
}

export function QuantumAlgorithmsSDK({ sharedData, onDataUpdate }: QuantumAlgorithmsSDKProps) {
  const [activeLanguage, setActiveLanguage] = useState('python');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [code, setCode] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quantum Algorithms SDK</h2>
          <p className="text-muted-foreground">
            Interactive development environment for quantum algorithms
          </p>
        </div>
      </div>

      <Tabs defaultValue="playground" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="playground">
            <Terminal className="w-4 h-4 mr-2" />
            Playground
          </TabsTrigger>
          <TabsTrigger value="library">
            <BookOpen className="w-4 h-4 mr-2" />
            Library
          </TabsTrigger>
          <TabsTrigger value="visualizer">
            <Eye className="w-4 h-4 mr-2" />
            Visualizer
          </TabsTrigger>
          <TabsTrigger value="editor">
            <Code className="w-4 h-4 mr-2" />
            Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="playground">
          <PlaygroundPanel 
            language={activeLanguage}
            onLanguageChange={setActiveLanguage}
            code={code}
            onCodeChange={setCode}
          />
        </TabsContent>

        <TabsContent value="library">
          <AlgorithmLibrary 
            onAlgorithmSelect={setSelectedAlgorithm}
            selectedAlgorithm={selectedAlgorithm}
          />
        </TabsContent>

        <TabsContent value="visualizer">
          <AlgorithmVisualizer 
            algorithm={selectedAlgorithm}
          />
        </TabsContent>

        <TabsContent value="editor">
          <CodeEditor 
            language={activeLanguage}
            code={code}
            onChange={setCode}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
