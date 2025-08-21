
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gate } from '@/hooks/useCircuitState';
import { HardwareIntegration } from '../hardware/HardwareIntegration';
import { UnifiedExporter, convertToUnifiedCircuit } from '@/lib/unified-export';
import { Download, Copy, FileText, Code, Braces, FileCode, Cpu, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CircuitExporterProps {
  circuit: Gate[];
  simulationResult: any;
}

export function CircuitExporter({ circuit, simulationResult }: CircuitExporterProps) {
  const [projectName, setProjectName] = useState('quantum_circuit');
  const [exportFormat, setExportFormat] = useState('qasm');

  const numQubits = Math.max(5, ...circuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))) + 1;

  // Convert to unified circuit format and validate
  const unifiedCircuit = convertToUnifiedCircuit(circuit, numQubits, projectName);
  const validation = UnifiedExporter.validateCircuit(unifiedCircuit);

  const getExportContent = () => {
    try {
      if (!validation.isValid) {
        return `// Circuit validation errors:\n${validation.errors.map(err => `// ${err}`).join('\n')}`;
      }
      return UnifiedExporter.export(unifiedCircuit, exportFormat);
    } catch (error) {
      console.error(`Export error for ${exportFormat}:`, error);
      return `// Error generating ${exportFormat} export: ${error}`;
    }
  };

  const getFileExtension = () => {
    switch (exportFormat) {
      case 'qasm': return 'qasm';
      case 'qiskit': 
      case 'python': return 'py';
      case 'javascript':
      case 'js': return 'js';
      case 'json': return 'json';
      default: return 'txt';
    }
  };

  const handleExport = () => {
    try {
      if (!validation.isValid) {
        toast.error('Cannot export invalid circuit', { 
          description: validation.errors.join(', ') 
        });
        return;
      }

      const content = getExportContent();
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName}.${getFileExtension()}`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Export Complete', { 
        description: `Circuit exported as ${exportFormat.toUpperCase()}` 
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', { 
        description: `Failed to export circuit as ${exportFormat.toUpperCase()}` 
      });
    }
  };

  const handleCopy = () => {
    try {
      const content = getExportContent();
      navigator.clipboard.writeText(content);
      toast.success('Copied', { description: 'Code copied to clipboard' });
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Copy failed', { description: 'Failed to copy code to clipboard' });
    }
  };

  const exportFormats = [
    { 
      id: 'qasm', 
      name: 'OpenQASM 2.0', 
      icon: <FileText className="w-4 h-4" />,
      description: 'Standard quantum assembly language'
    },
    { 
      id: 'qiskit', 
      name: 'Qiskit Python', 
      icon: <Code className="w-4 h-4" />,
      description: 'IBM Qiskit quantum computing framework'
    },
    { 
      id: 'javascript', 
      name: 'JavaScript SDK', 
      icon: <FileCode className="w-4 h-4" />,
      description: 'QOSim JavaScript SDK format'
    },
    { 
      id: 'json', 
      name: 'JSON', 
      icon: <Braces className="w-4 h-4" />,
      description: 'QOSim native format with metadata'
    }
  ];

  return (
    <Tabs defaultValue="export" className="w-full">
      <TabsList className="grid w-full grid-cols-2 quantum-tabs">
        <TabsTrigger value="export">Export Formats</TabsTrigger>
        <TabsTrigger value="hardware" className="flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          Hardware Integration
        </TabsTrigger>
      </TabsList>

      <TabsContent value="export" className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-mono text-quantum-glow">Circuit Export</h3>
            <p className="text-sm text-quantum-particle">
              Export circuits to various quantum computing frameworks
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-quantum-matrix text-quantum-neon">
              {circuit.length} Gates
            </Badge>
            {validation.isValid ? (
              <Badge variant="default" className="bg-green-500/20 text-green-400">
                <CheckCircle className="w-3 h-3 mr-1" />
                Valid
              </Badge>
            ) : (
              <Badge variant="destructive" className="bg-red-500/20 text-red-400">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Invalid
              </Badge>
            )}
          </div>
        </div>

        {/* Validation Errors */}
        {!validation.isValid && (
          <Alert variant="destructive" className="neon-border border-red-500/30">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Circuit validation failed:</strong>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Export Configuration */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-sm text-quantum-neon">Export Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-quantum-particle">Project Name</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="quantum-panel neon-border mt-1"
                />
              </div>
              <div>
                <Label className="text-quantum-particle">Export Format</Label>
                <Tabs value={exportFormat} onValueChange={setExportFormat} className="mt-1">
                  <TabsList className="grid w-full grid-cols-4 quantum-tabs">
                    {exportFormats.map(format => (
                      <TabsTrigger key={format.id} value={format.id} className="text-xs">
                        {format.icon}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleExport}
                disabled={circuit.length === 0 || !validation.isValid}
                className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
              >
                <Download className="w-4 h-4 mr-2" />
                Export {exportFormat.toUpperCase()}
              </Button>
              <Button
                onClick={handleCopy}
                disabled={circuit.length === 0}
                variant="outline"
                className="neon-border"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-quantum-neon">
                Preview - {exportFormats.find(f => f.id === exportFormat)?.name}
              </CardTitle>
              <Badge variant="outline" className="neon-border">
                {exportFormats.find(f => f.id === exportFormat)?.description}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={getExportContent()}
              readOnly
              className="font-mono text-xs min-h-[400px] quantum-panel neon-border"
              placeholder={circuit.length === 0 ? "Add gates to the circuit to see export preview..." : ""}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="hardware">
        <HardwareIntegration 
          circuit={circuit}
          simulationResult={simulationResult}
        />
      </TabsContent>
    </Tabs>
  );
}
