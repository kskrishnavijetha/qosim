
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Copy, Download, Zap, FileCode } from 'lucide-react';
import { Algorithm } from './QuantumAlgorithmsSDK';
import { toast } from 'sonner';

interface CodeEditorProps {
  algorithm: Algorithm | null;
  language: 'python' | 'javascript';
  code: string;
  onCodeChange: (code: string) => void;
  onExecute: (code: string) => void;
  isExecuting: boolean;
}

export function CodeEditor({
  algorithm,
  language,
  code,
  onCodeChange,
  onExecute,
  isExecuting
}: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState('editor');

  const handleCopyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  }, [code]);

  const handleDownloadCode = useCallback(() => {
    const extension = language === 'python' ? 'py' : 'js';
    const filename = algorithm ? `${algorithm.id}.${extension}` : `quantum_algorithm.${extension}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Code downloaded as ${filename}`);
  }, [code, language, algorithm]);

  const getLanguageHighlight = (lang: string) => {
    return lang === 'python' ? 'language-python' : 'language-javascript';
  };

  if (!algorithm) {
    return (
      <Card className="h-full quantum-panel neon-border">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <FileCode className="w-16 h-16 mx-auto text-quantum-particle/50 mb-4" />
            <p className="text-quantum-particle">Select an algorithm from the library to start coding</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Algorithm Info */}
      <Card className="quantum-panel neon-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-quantum-glow">{algorithm.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-quantum-neon">
                {language.toUpperCase()}
              </Badge>
              <Badge variant="secondary">
                {algorithm.qubits} qubits
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-quantum-particle mb-3">{algorithm.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Circuit Depth: {algorithm.depth}</span>
            <span>Complexity: {algorithm.complexity}</span>
            <span>Gates: {algorithm.gates.join(', ')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Code Editor */}
      <Card className="flex-1 quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Code Editor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
                className="neon-border"
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadCode}
                className="neon-border"
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-fit">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="docs">Documentation</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="flex-1 flex flex-col mt-4">
              <Textarea
                value={code}
                onChange={(e) => onCodeChange(e.target.value)}
                className={`flex-1 font-mono text-sm quantum-panel neon-border resize-none min-h-[400px] ${getLanguageHighlight(language)}`}
                placeholder={`Write your ${language} quantum algorithm here...`}
              />
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {code.split('\n').length} lines • {code.length} characters
                </div>
                <Button
                  onClick={() => onExecute(code)}
                  disabled={isExecuting || !code.trim()}
                  className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isExecuting ? 'Executing...' : 'Execute Algorithm'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="docs" className="flex-1 mt-4">
              <div className="bg-quantum-void rounded-lg border border-quantum-matrix p-4 h-full overflow-y-auto">
                <h3 className="text-sm font-semibold text-quantum-glow mb-3">Algorithm Documentation</h3>
                
                <div className="space-y-4 text-xs text-quantum-particle">
                  <div>
                    <h4 className="font-medium text-quantum-neon mb-2">Overview</h4>
                    <p>{algorithm.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-quantum-neon mb-2">Quantum Resources</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Number of qubits: {algorithm.qubits}</li>
                      <li>Circuit depth: {algorithm.depth}</li>
                      <li>Gate types: {algorithm.gates.join(', ')}</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-quantum-neon mb-2">Complexity</h4>
                    <p>This algorithm is classified as <strong>{algorithm.complexity}</strong> level.</p>
                  </div>
                  
                  {algorithm.visualization && (
                    <div>
                      <h4 className="font-medium text-quantum-neon mb-2">Visualization Features</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {algorithm.visualization.blochSpheres && <li>Bloch sphere representation</li>}
                        {algorithm.visualization.entanglementMap && <li>Entanglement mapping</li>}
                        {algorithm.visualization.measurementStats && <li>Measurement statistics</li>}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <h4 className="font-medium text-quantum-neon mb-2">Usage Tips</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Modify parameters to explore different behaviors</li>
                      <li>Use the visualizer to understand quantum states</li>
                      <li>Export results for further analysis</li>
                      <li>Integrate with Circuit Builder for visual representation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
