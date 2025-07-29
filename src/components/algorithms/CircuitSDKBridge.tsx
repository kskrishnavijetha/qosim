
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { GitBranch, ArrowLeftRight, Download, Upload, Zap, Eye } from 'lucide-react';

interface CircuitSDKBridgeProps {
  visualCircuit?: any;
  onVisualCircuitChange?: (circuit: any) => void;
  onSDKCircuitGenerated?: (gates: any[]) => void;
  language: 'python' | 'javascript';
  generatedCode: string;
  onCodeGenerated: (code: string) => void;
}

export function CircuitSDKBridge({
  visualCircuit,
  onVisualCircuitChange,
  onSDKCircuitGenerated,
  language,
  generatedCode,
  onCodeGenerated
}: CircuitSDKBridgeProps) {
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [syncDirection, setSyncDirection] = useState<'visual-to-code' | 'code-to-visual' | null>(null);
  const { toast } = useToast();

  const exportVisualToCode = useCallback(() => {
    if (!visualCircuit || !visualCircuit.gates) {
      toast({
        title: "No Visual Circuit",
        description: "Create a circuit in the visual builder first",
        variant: "destructive"
      });
      return;
    }

    try {
      let code = '';
      
      if (language === 'javascript') {
        code = generateJavaScriptFromCircuit(visualCircuit);
      } else {
        code = generatePythonFromCircuit(visualCircuit);
      }
      
      onCodeGenerated(code);
      setLastSync(new Date());
      setSyncDirection('visual-to-code');
      
      toast({
        title: "Circuit Exported",
        description: `Visual circuit exported to ${language} code`,
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: `Failed to export circuit: ${error.message}`,
        variant: "destructive"
      });
    }
  }, [visualCircuit, language, onCodeGenerated, toast]);

  const importCodeToVisual = useCallback(() => {
    if (!generatedCode.trim()) {
      toast({
        title: "No Code",
        description: "Write some SDK code first",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsedCircuit = parseCodeToCircuit(generatedCode, language);
      
      if (onVisualCircuitChange) {
        onVisualCircuitChange(parsedCircuit);
      }
      
      if (onSDKCircuitGenerated) {
        const gates = convertCircuitToGates(parsedCircuit);
        onSDKCircuitGenerated(gates);
      }
      
      setLastSync(new Date());
      setSyncDirection('code-to-visual');
      
      toast({
        title: "Code Imported",
        description: `${language} code imported to visual builder`,
      });
    } catch (error) {
      toast({
        title: "Import Error",
        description: `Failed to import code: ${error.message}`,
        variant: "destructive"
      });
    }
  }, [generatedCode, language, onVisualCircuitChange, onSDKCircuitGenerated, toast]);

  const generateJavaScriptFromCircuit = (circuit: any): string => {
    let code = `// Generated from Visual Circuit Builder
await sdk.initialize();
let circuit = sdk.createCircuit('${circuit.name || 'Visual Circuit'}', ${circuit.qubits?.length || 3});

`;

    circuit.gates?.forEach((gate: any) => {
      switch (gate.type?.toLowerCase()) {
        case 'h':
          code += `circuit = sdk.addGate(circuit, { type: 'h', qubit: ${gate.qubit} });\n`;
          break;
        case 'x':
          code += `circuit = sdk.addGate(circuit, { type: 'x', qubit: ${gate.qubit} });\n`;
          break;
        case 'y':
          code += `circuit = sdk.addGate(circuit, { type: 'y', qubit: ${gate.qubit} });\n`;
          break;
        case 'z':
          code += `circuit = sdk.addGate(circuit, { type: 'z', qubit: ${gate.qubit} });\n`;
          break;
        case 'cnot':
          code += `circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: ${gate.qubits?.[0]}, qubit: ${gate.qubits?.[1]} });\n`;
          break;
        case 'rx':
          code += `circuit = sdk.addGate(circuit, { type: 'rx', qubit: ${gate.qubit}, angle: ${gate.angle || Math.PI/2} });\n`;
          break;
        case 'ry':
          code += `circuit = sdk.addGate(circuit, { type: 'ry', qubit: ${gate.qubit}, angle: ${gate.angle || Math.PI/2} });\n`;
          break;
        case 'rz':
          code += `circuit = sdk.addGate(circuit, { type: 'rz', qubit: ${gate.qubit}, angle: ${gate.angle || Math.PI/2} });\n`;
          break;
        default:
          code += `circuit = sdk.addGate(circuit, { type: '${gate.type?.toLowerCase()}', qubit: ${gate.qubit} });\n`;
      }
    });

    code += '\nconst result = await sdk.simulate(circuit);\nconsole.log("Simulation Result:", result);';
    
    return code;
  };

  const generatePythonFromCircuit = (circuit: any): string => {
    let code = `# Generated from Visual Circuit Builder
from qosim_sdk import QuantumSimulator

sim = QuantumSimulator(${circuit.qubits?.length || 3})

`;

    circuit.gates?.forEach((gate: any) => {
      switch (gate.type?.toLowerCase()) {
        case 'h':
          code += `sim.h(${gate.qubit})\n`;
          break;
        case 'x':
          code += `sim.x(${gate.qubit})\n`;
          break;
        case 'y':
          code += `sim.y(${gate.qubit})\n`;
          break;
        case 'z':
          code += `sim.z(${gate.qubit})\n`;
          break;
        case 'cnot':
          code += `sim.cnot(${gate.qubits?.[0]}, ${gate.qubits?.[1]})\n`;
          break;
        case 'rx':
          code += `sim.rx(${gate.qubit}, ${gate.angle || Math.PI/2})\n`;
          break;
        case 'ry':
          code += `sim.ry(${gate.qubit}, ${gate.angle || Math.PI/2})\n`;
          break;
        case 'rz':
          code += `sim.rz(${gate.qubit}, ${gate.angle || Math.PI/2})\n`;
          break;
        default:
          code += `# Unsupported gate: ${gate.type}\n`;
      }
    });

    code += '\nresult = sim.run()\nprint("Simulation Result:", result)';
    
    return code;
  };

  const parseCodeToCircuit = (code: string, lang: 'python' | 'javascript') => {
    const circuit = {
      id: 'imported-circuit',
      name: 'Imported Circuit',
      gates: [] as any[],
      qubits: [] as any[],
      metadata: {
        importedFrom: lang,
        importedAt: new Date().toISOString()
      }
    };

    const lines = code.split('\n');
    let qubitCount = 3; // Default
    
    lines.forEach((line, index) => {
      line = line.trim();
      
      if (lang === 'javascript') {
        // Parse JavaScript SDK calls
        if (line.includes('createCircuit') && line.includes(',')) {
          const match = line.match(/,\s*(\d+)/);
          if (match) qubitCount = parseInt(match[1]);
        }
        
        if (line.includes('addGate')) {
          const gate = parseJavaScriptGate(line, index);
          if (gate) circuit.gates.push(gate);
        }
      } else {
        // Parse Python SDK calls
        if (line.includes('QuantumSimulator(')) {
          const match = line.match(/QuantumSimulator\((\d+)\)/);
          if (match) qubitCount = parseInt(match[1]);
        }
        
        const gate = parsePythonGate(line, index);
        if (gate) circuit.gates.push(gate);
      }
    });
    
    // Generate qubits array
    for (let i = 0; i < qubitCount; i++) {
      circuit.qubits.push({
        id: `qubit-${i}`,
        index: i,
        name: `q${i}`,
        state: 'computational'
      });
    }
    
    return circuit;
  };

  const parseJavaScriptGate = (line: string, index: number) => {
    if (!line.includes('addGate')) return null;
    
    try {
      // Extract gate object from addGate call
      const gateMatch = line.match(/\{\s*([^}]+)\s*\}/);
      if (!gateMatch) return null;
      
      const gateStr = gateMatch[1];
      const gate: any = {
        id: `imported-${index}`,
        position: index
      };
      
      // Parse gate properties
      const typeMatch = gateStr.match(/type:\s*['"`]([^'"`]+)['"`]/);
      if (typeMatch) gate.type = typeMatch[1].toUpperCase();
      
      const qubitMatch = gateStr.match(/qubit:\s*(\d+)/);
      if (qubitMatch) gate.qubit = parseInt(qubitMatch[1]);
      
      const controlMatch = gateStr.match(/controlQubit:\s*(\d+)/);
      if (controlMatch) {
        gate.qubits = [parseInt(controlMatch[1]), gate.qubit];
      } else {
        gate.qubits = [gate.qubit];
      }
      
      const angleMatch = gateStr.match(/angle:\s*([\d.π/\-+*\s]+)/);
      if (angleMatch) gate.angle = parseFloat(angleMatch[1].replace(/π/g, String(Math.PI)));
      
      return gate;
    } catch (error) {
      console.warn('Failed to parse JavaScript gate:', line, error);
      return null;
    }
  };

  const parsePythonGate = (line: string, index: number) => {
    const gatePatterns = [
      { pattern: /sim\.h\((\d+)\)/, type: 'H' },
      { pattern: /sim\.x\((\d+)\)/, type: 'X' },
      { pattern: /sim\.y\((\d+)\)/, type: 'Y' },
      { pattern: /sim\.z\((\d+)\)/, type: 'Z' },
      { pattern: /sim\.cnot\((\d+),\s*(\d+)\)/, type: 'CNOT' },
      { pattern: /sim\.rx\((\d+),\s*([\d.π/\-+*\s]+)\)/, type: 'RX' },
      { pattern: /sim\.ry\((\d+),\s*([\d.π/\-+*\s]+)\)/, type: 'RY' },
      { pattern: /sim\.rz\((\d+),\s*([\d.π/\-+*\s]+)\)/, type: 'RZ' }
    ];
    
    for (const { pattern, type } of gatePatterns) {
      const match = line.match(pattern);
      if (match) {
        const gate: any = {
          id: `imported-${index}`,
          type,
          position: index
        };
        
        if (type === 'CNOT') {
          gate.qubits = [parseInt(match[1]), parseInt(match[2])];
          gate.qubit = parseInt(match[2]);
        } else {
          gate.qubit = parseInt(match[1]);
          gate.qubits = [gate.qubit];
        }
        
        if (match[2] && ['RX', 'RY', 'RZ'].includes(type)) {
          gate.angle = parseFloat(match[2].replace(/π/g, String(Math.PI)));
        }
        
        return gate;
      }
    }
    
    return null;
  };

  const convertCircuitToGates = (circuit: any) => {
    return circuit.gates?.map((gate: any) => ({
      id: gate.id,
      type: gate.type,
      qubit: gate.qubit,
      qubits: gate.qubits,
      position: gate.position,
      angle: gate.angle
    })) || [];
  };

  const optimizeCircuit = () => {
    toast({
      title: "Circuit Optimization",
      description: "AI-powered optimization coming soon!",
    });
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <GitBranch className="w-5 h-5" />
          Circuit ↔ SDK Bridge
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Sync Status */}
        {lastSync && (
          <div className="flex items-center gap-2 p-2 bg-quantum-matrix/30 rounded-lg border border-quantum-neon/20">
            <Badge variant="outline" className="text-quantum-neon">
              Last Sync: {lastSync.toLocaleTimeString()}
            </Badge>
            <ArrowLeftRight className="w-4 h-4 text-quantum-particle" />
            <Badge variant="outline" className="text-quantum-glow">
              {syncDirection === 'visual-to-code' ? 'Visual → Code' : 'Code → Visual'}
            </Badge>
          </div>
        )}

        {/* Bridge Controls */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={exportVisualToCode}
            className="flex items-center gap-2 bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
          >
            <Download className="w-4 h-4" />
            Export Visual → {language}
          </Button>
          
          <Button
            onClick={importCodeToVisual}
            className="flex items-center gap-2 bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
          >
            <Upload className="w-4 h-4" />
            Import {language} → Visual
          </Button>
        </div>

        <Separator className="border-quantum-neon/20" />

        {/* AI Optimization */}
        <div className="space-y-2">
          <h4 className="text-sm font-mono text-quantum-neon">AI-Powered Features</h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="outline"
              onClick={optimizeCircuit}
              className="flex items-center gap-2 neon-border text-sm"
            >
              <Zap className="w-4 h-4" />
              Optimize Circuit (AI)
            </Button>
            <div className="text-xs text-muted-foreground px-2">
              • Gate arrangement optimization
              • Circuit depth reduction  
              • Error detection and correction
              • Natural language suggestions
            </div>
          </div>
        </div>

        <Separator className="border-quantum-neon/20" />

        {/* Integration Stats */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="text-muted-foreground">Visual Circuit</div>
            <div className="text-quantum-glow">
              {visualCircuit?.gates?.length || 0} gates
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">SDK Code</div>
            <div className="text-quantum-particle">
              {generatedCode.split('\n').length} lines
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
