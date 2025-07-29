
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Download, FileText, Code, Share2, Archive, Github, Cloud } from 'lucide-react';
import { Algorithm } from './QuantumAlgorithmsSDK';

export interface ExportToolsProps {
  code: string;
  algorithm: Algorithm | null;
  language: 'python' | 'javascript';
  simulationResult: any;
  onExport: (format: string) => void;
}

export function ExportTools({
  code,
  algorithm,
  language,
  simulationResult,
  onExport
}: ExportToolsProps) {
  const [selectedFormat, setSelectedFormat] = useState('qasm');
  const [exportOptions, setExportOptions] = useState({
    includeComments: true,
    includeResults: true,
    includeVisualization: false,
    compressed: false
  });
  const { toast } = useToast();

  const handleExport = async (format: string) => {
    try {
      await onExport(format);
      toast({
        title: "Export Successful",
        description: `Algorithm exported in ${format.toUpperCase()} format`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export algorithm",
        variant: "destructive",
      });
    }
  };

  const generateQASM = () => {
    if (!algorithm) return '';
    
    let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n\n';
    
    switch (algorithm.id) {
      case 'bell-state':
        qasm += 'qreg q[2];\ncreg c[2];\n\n';
        qasm += 'h q[0];\n';
        qasm += 'cx q[0], q[1];\n';
        qasm += 'measure q -> c;\n';
        break;
      case 'grovers-search':
        qasm += 'qreg q[2];\ncreg c[2];\n\n';
        qasm += 'h q[0];\nh q[1];\n';
        qasm += 'cz q[0], q[1];\n';
        qasm += 'h q[0];\nh q[1];\n';
        qasm += 'x q[0];\nx q[1];\n';
        qasm += 'cz q[0], q[1];\n';
        qasm += 'x q[0];\nx q[1];\n';
        qasm += 'h q[0];\nh q[1];\n';
        qasm += 'measure q -> c;\n';
        break;
      case 'qft':
        qasm += 'qreg q[3];\ncreg c[3];\n\n';
        qasm += 'x q[2];\n';
        qasm += 'h q[0];\n';
        qasm += 'cp(pi/2) q[0], q[1];\n';
        qasm += 'cp(pi/4) q[0], q[2];\n';
        qasm += 'h q[1];\n';
        qasm += 'cp(pi/2) q[1], q[2];\n';
        qasm += 'h q[2];\n';
        qasm += 'swap q[0], q[2];\n';
        qasm += 'measure q -> c;\n';
        break;
      default:
        qasm += 'qreg q[2];\ncreg c[2];\n\n';
        qasm += 'h q[0];\n';
        qasm += 'measure q -> c;\n';
    }
    
    return qasm;
  };

  const generateCircuit = () => {
    if (!algorithm) return '';
    
    let circuit = `# ${algorithm.name} Circuit\n`;
    circuit += `# Generated from QOSim SDK\n\n`;
    
    switch (algorithm.id) {
      case 'bell-state':
        circuit += 'H(0) -> CNOT(0,1) -> Measure\n';
        break;
      case 'grovers-search':
        circuit += 'H(0) -> H(1) -> Oracle -> Diffusion -> Measure\n';
        break;
      case 'qft':
        circuit += 'X(2) -> H(0) -> CP(0,1) -> CP(0,2) -> H(1) -> CP(1,2) -> H(2) -> SWAP(0,2) -> Measure\n';
        break;
      default:
        circuit += 'H(0) -> Measure\n';
    }
    
    return circuit;
  };

  const exportFormats = [
    { id: 'qasm', name: 'OpenQASM', description: 'Quantum Assembly Language', icon: FileText },
    { id: 'circuit', name: 'Circuit Diagram', description: 'Visual circuit representation', icon: Code },
    { id: 'json', name: 'JSON', description: 'Structured data format', icon: Archive },
    { id: 'qiskit', name: 'Qiskit', description: 'IBM Qiskit format', icon: Cloud },
    { id: 'cirq', name: 'Cirq', description: 'Google Cirq format', icon: Cloud },
    { id: 'braket', name: 'Braket', description: 'Amazon Braket format', icon: Cloud }
  ];

  return (
    <div className="flex flex-col h-full bg-quantum-void">
      <div className="flex-none p-4 border-b border-quantum-neon/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-quantum-glow" />
            <h2 className="text-lg font-semibold text-quantum-glow">Export Tools</h2>
          </div>
          {algorithm && (
            <Badge variant="outline" className="text-quantum-particle">
              {algorithm.name}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="formats" className="h-full flex flex-col">
          <TabsList className="flex-none grid w-full grid-cols-3 bg-quantum-matrix border-b border-quantum-neon/20">
            <TabsTrigger value="formats" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Formats
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="share" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formats" className="flex-1 m-0 p-0">
            <div className="h-full p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exportFormats.map((format) => (
                  <Card key={format.id} className="quantum-panel neon-border">
                    <CardHeader>
                      <CardTitle className="text-quantum-glow flex items-center gap-2">
                        <format.icon className="w-5 h-5" />
                        {format.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-quantum-particle mb-4">
                        {format.description}
                      </p>
                      <Button
                        onClick={() => handleExport(format.id)}
                        className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
                        disabled={!algorithm}
                      >
                        Export {format.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6">
                <Card className="quantum-panel neon-border">
                  <CardHeader>
                    <CardTitle className="text-quantum-glow">Export Options</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exportOptions.includeComments}
                            onChange={(e) => setExportOptions({
                              ...exportOptions,
                              includeComments: e.target.checked
                            })}
                            className="rounded border-quantum-neon"
                          />
                          <span className="text-sm text-quantum-neon">Include Comments</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exportOptions.includeResults}
                            onChange={(e) => setExportOptions({
                              ...exportOptions,
                              includeResults: e.target.checked
                            })}
                            className="rounded border-quantum-neon"
                          />
                          <span className="text-sm text-quantum-neon">Include Results</span>
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exportOptions.includeVisualization}
                            onChange={(e) => setExportOptions({
                              ...exportOptions,
                              includeVisualization: e.target.checked
                            })}
                            className="rounded border-quantum-neon"
                          />
                          <span className="text-sm text-quantum-neon">Include Visualization</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={exportOptions.compressed}
                            onChange={(e) => setExportOptions({
                              ...exportOptions,
                              compressed: e.target.checked
                            })}
                            className="rounded border-quantum-neon"
                          />
                          <span className="text-sm text-quantum-neon">Compress Output</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 m-0 p-0">
            <div className="h-full p-4">
              <Card className="h-full quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow flex items-center justify-between">
                    Export Preview
                    <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {exportFormats.map((format) => (
                          <SelectItem key={format.id} value={format.id}>
                            {format.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 overflow-y-auto bg-quantum-void rounded-lg p-4">
                    <pre className="text-sm font-mono text-quantum-neon whitespace-pre-wrap">
                      {selectedFormat === 'qasm' && generateQASM()}
                      {selectedFormat === 'circuit' && generateCircuit()}
                      {selectedFormat === 'json' && JSON.stringify({
                        algorithm: algorithm?.name,
                        language,
                        code,
                        result: simulationResult
                      }, null, 2)}
                      {!['qasm', 'circuit', 'json'].includes(selectedFormat) && 
                        `# ${selectedFormat.toUpperCase()} format preview\n# Implementation specific to ${selectedFormat}\n\n${code}`
                      }
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="share" className="flex-1 m-0 p-0">
            <div className="h-full p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="quantum-panel neon-border">
                  <CardHeader>
                    <CardTitle className="text-quantum-glow flex items-center gap-2">
                      <Github className="w-5 h-5" />
                      GitHub Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-quantum-particle mb-4">
                      Export directly to GitHub repository
                    </p>
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
                        disabled={!algorithm}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        Push to GitHub
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-quantum-neon text-quantum-neon hover:bg-quantum-neon hover:text-quantum-void"
                        disabled={!algorithm}
                      >
                        Create Gist
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="quantum-panel neon-border">
                  <CardHeader>
                    <CardTitle className="text-quantum-glow flex items-center gap-2">
                      <Cloud className="w-5 h-5" />
                      QFS Cloud Storage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-quantum-particle mb-4">
                      Save to QOSim File System
                    </p>
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
                        disabled={!algorithm}
                      >
                        <Cloud className="w-4 h-4 mr-2" />
                        Save to QFS
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-quantum-neon text-quantum-neon hover:bg-quantum-neon hover:text-quantum-void"
                        disabled={!algorithm}
                      >
                        Share Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
