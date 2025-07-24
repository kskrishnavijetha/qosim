
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { CircuitIntegrationService } from '@/services/circuitIntegration';
import { Gate } from '@/hooks/useCircuitWorkspace';
import { 
  Code, 
  Download, 
  Copy, 
  FileText,
  Cpu,
  Braces
} from 'lucide-react';
import { toast } from 'sonner';

interface CodeExportPanelProps {
  circuit: Gate[];
  onExport: (format: 'python' | 'javascript' | 'qasm' | 'json') => void;
  integrationService: CircuitIntegrationService;
}

export function CodeExportPanel({
  circuit,
  onExport,
  integrationService
}: CodeExportPanelProps) {
  const [generatedCode, setGeneratedCode] = useState({
    python: '',
    javascript: '',
    qasm: '',
    json: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAllCode = async () => {
    setIsGenerating(true);
    try {
      const metadata = {
        name: 'Exported Circuit',
        description: 'Generated from QOSim Circuit Builder',
        version: '1.0.0',
        tags: ['qosim', 'quantum'],
        comments: {},
        created: new Date(),
        lastModified: new Date()
      };

      const exports = await integrationService.exportCircuitToCode(circuit, metadata);
      setGeneratedCode(exports);
    } catch (error) {
      toast.error('Failed to generate code');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (code: string, format: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`${format.toUpperCase()} code copied to clipboard`);
  };

  const downloadCode = (code: string, format: string) => {
    const extensions = {
      python: 'py',
      javascript: 'js',
      qasm: 'qasm',
      json: 'json'
    };
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `circuit.${extensions[format as keyof typeof extensions]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    if (circuit.length > 0) {
      generateAllCode();
    }
  }, [circuit]);

  return (
    <div className="h-full p-6 space-y-6">
      {/* Export Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-quantum-glow flex items-center gap-2">
              <Code className="w-5 h-5" />
              Code Export & SDK Integration
              <Badge variant="outline" className="text-quantum-neon">
                {circuit.length} gates
              </Badge>
            </CardTitle>
            
            <Button 
              onClick={generateAllCode}
              disabled={isGenerating || circuit.length === 0}
              className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
            >
              {isGenerating ? 'Generating...' : 'Generate All'}
            </Button>
          </div>
        </CardHeader>
        
        {circuit.length === 0 && (
          <CardContent>
            <div className="text-center py-8 text-quantum-particle">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Build a circuit to export code</p>
            </div>
          </CardContent>
        )}
      </Card>

      {circuit.length > 0 && (
        <Tabs defaultValue="python" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 quantum-tabs">
            <TabsTrigger value="python" className="quantum-tab">
              <Code className="w-4 h-4 mr-2" />
              Python
            </TabsTrigger>
            <TabsTrigger value="javascript" className="quantum-tab">
              <Braces className="w-4 h-4 mr-2" />
              JavaScript
            </TabsTrigger>
            <TabsTrigger value="qasm" className="quantum-tab">
              <Cpu className="w-4 h-4 mr-2" />
              QASM
            </TabsTrigger>
            <TabsTrigger value="json" className="quantum-tab">
              <FileText className="w-4 h-4 mr-2" />
              JSON
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="python" className="space-y-4">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-quantum-neon">Python / Qiskit Code</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCode.python, 'python')}
                      className="neon-border"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCode(generatedCode.python, 'python')}
                      className="neon-border"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedCode.python}
                  readOnly
                  className="font-mono text-sm h-96 resize-none"
                  placeholder="Python code will appear here..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="javascript" className="space-y-4">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-quantum-neon">JavaScript / QOSim SDK</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCode.javascript, 'javascript')}
                      className="neon-border"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCode(generatedCode.javascript, 'javascript')}
                      className="neon-border"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedCode.javascript}
                  readOnly
                  className="font-mono text-sm h-96 resize-none"
                  placeholder="JavaScript code will appear here..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="qasm" className="space-y-4">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-quantum-neon">OpenQASM 2.0</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCode.qasm, 'qasm')}
                      className="neon-border"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCode(generatedCode.qasm, 'qasm')}
                      className="neon-border"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedCode.qasm}
                  readOnly
                  className="font-mono text-sm h-96 resize-none"
                  placeholder="QASM code will appear here..."
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="json" className="space-y-4">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-quantum-neon">JSON Circuit Data</CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedCode.json, 'json')}
                      className="neon-border"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadCode(generatedCode.json, 'json')}
                      className="neon-border"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generatedCode.json}
                  readOnly
                  className="font-mono text-sm h-96 resize-none"
                  placeholder="JSON data will appear here..."
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {/* SDK Integration Guide */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">SDK Integration Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
            <h4 className="text-sm font-semibold text-quantum-neon mb-2">Bidirectional Workflow</h4>
            <ul className="text-sm text-quantum-particle space-y-1">
              <li>• Export visual circuits to Python/JavaScript code</li>
              <li>• Import SDK code back into the visual builder</li>
              <li>• Maintain comments and metadata during conversions</li>
              <li>• Real-time synchronization between code and visual views</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-quantum-matrix/10 border border-quantum-glow/30">
            <h4 className="text-sm font-semibold text-quantum-glow mb-2">Next Steps</h4>
            <ul className="text-sm text-quantum-particle space-y-1">
              <li>• Use the exported code in your quantum applications</li>
              <li>• Integrate with existing quantum computing frameworks</li>
              <li>• Share circuits with your team for collaborative development</li>
              <li>• Leverage AI optimization suggestions for better performance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
