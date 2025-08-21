
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Copy, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Gate } from '@/hooks/useCircuitState';
import { 
  convertToUnifiedCircuit, 
  convertFromQuantumBackend,
  toOpenQASM, 
  toJSON, 
  toQiskit, 
  toJavaScript,
  validate 
} from '@/lib/unified-export';

interface CircuitExporterProps {
  gates: Gate[];
  simulationResult?: any;
  numQubits?: number;
  circuitName?: string;
}

export function CircuitExporter({ 
  gates, 
  simulationResult, 
  numQubits = 5, 
  circuitName = "QOSim Circuit" 
}: CircuitExporterProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>('json');
  const [copyStates, setCopyStates] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  console.log('🔄 CircuitExporter props:', { 
    gatesCount: gates.length, 
    hasSimulationResult: !!simulationResult, 
    numQubits, 
    circuitName 
  });

  const generateExportCode = (format: string): { code: string; error?: string } => {
    try {
      console.log('🔄 Generating export code for format:', format);
      console.log('🔄 Input gates:', gates);
      
      // Convert the circuit based on whether we have simulation results
      const circuit = simulationResult 
        ? convertFromQuantumBackend(simulationResult, gates, numQubits)
        : convertToUnifiedCircuit(gates, numQubits, circuitName);
      
      console.log('🔄 Converted circuit:', circuit);
      
      // Validate before export
      const errors = validate(circuit);
      if (errors.length > 0) {
        console.error('❌ Validation errors:', errors);
        return { 
          code: `// Validation Errors:\n${errors.map(err => `// ${err}`).join('\n')}\n\n// Original circuit data:\n${JSON.stringify(circuit, null, 2)}`, 
          error: errors.join(', ') 
        };
      }

      let exportedCode: string;
      
      switch (format) {
        case 'openqasm':
          exportedCode = toOpenQASM(circuit);
          break;
        case 'json':
          exportedCode = toJSON(circuit);
          break;
        case 'qiskit':
          exportedCode = toQiskit(circuit);
          break;
        case 'javascript':
          exportedCode = toJavaScript(circuit);
          break;
        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      console.log('✅ Export successful for format:', format);
      return { code: exportedCode };
    } catch (error: any) {
      console.error('❌ Export error:', error);
      const debugInfo = {
        gates: gates.map(g => ({ type: g.type, qubit: g.qubit, qubits: g.qubits, position: g.position })),
        simulationResult: simulationResult ? {
          hasStateVector: !!simulationResult.stateVector,
          hasMeasurementProbs: !!simulationResult.measurementProbabilities,
          backend: simulationResult.backend
        } : null,
        error: error.message
      };
      
      return { 
        code: `// Export Error: ${error.message}\n\n// Debug Information:\n${JSON.stringify(debugInfo, null, 2)}`, 
        error: error.message 
      };
    }
  };

  const handleCopy = async (format: string) => {
    const { code } = generateExportCode(format);
    try {
      await navigator.clipboard.writeText(code);
      setCopyStates(prev => ({ ...prev, [format]: true }));
      toast({
        title: "Copied to clipboard",
        description: `${format.toUpperCase()} code copied successfully`,
      });
      setTimeout(() => {
        setCopyStates(prev => ({ ...prev, [format]: false }));
      }, 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleDownload = (format: string) => {
    const { code } = generateExportCode(format);
    const extensions: Record<string, string> = {
      openqasm: 'qasm',
      json: 'json',
      qiskit: 'py',
      javascript: 'js'
    };
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${circuitName.replace(/[^a-z0-9]/gi, '_')}.${extensions[format]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: `${format.toUpperCase()} file download initiated`,
    });
  };

  const formats = [
    { id: 'json', name: 'JSON', description: 'QOSim circuit format' },
    { id: 'openqasm', name: 'OpenQASM', description: 'Industry standard format' },
    { id: 'qiskit', name: 'Qiskit', description: 'Python quantum computing' },
    { id: 'javascript', name: 'JavaScript', description: 'Browser SDK format' }
  ];

  if (!gates || gates.length === 0) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Circuit Export</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No circuit gates to export. Add some gates to your circuit first.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow">Export Circuit</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-quantum-neon">
            {gates.length} gates
          </Badge>
          <Badge variant="outline" className="text-quantum-particle">
            {numQubits} qubits
          </Badge>
          {simulationResult && (
            <Badge variant="outline" className="text-quantum-plasma">
              With simulation data
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={selectedFormat} onValueChange={setSelectedFormat}>
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 quantum-panel neon-border">
            {formats.map(format => (
              <TabsTrigger 
                key={format.id} 
                value={format.id}
                className="text-quantum-glow data-[state=active]:text-quantum-neon"
              >
                {format.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {formats.map(format => {
            const { code, error } = generateExportCode(format.id);
            
            return (
              <TabsContent key={format.id} value={format.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-quantum-neon">{format.name}</h3>
                    <p className="text-xs text-quantum-particle">{format.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(format.id)}
                      className="quantum-panel neon-border"
                      disabled={!!error}
                    >
                      {copyStates[format.id] ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(format.id)}
                      className="quantum-panel neon-border"
                      disabled={!!error}
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                
                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Export Error: {error}
                    </AlertDescription>
                  </Alert>
                )}
                
                <ScrollArea className="h-64 quantum-panel neon-border rounded p-4">
                  <pre className="text-sm font-mono text-quantum-neon whitespace-pre-wrap">
                    {code}
                  </pre>
                </ScrollArea>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
