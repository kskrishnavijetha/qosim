
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, FileText, Code } from 'lucide-react';
import { toast } from 'sonner';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface QASMExporterProps {
  circuit: Gate[];
}

export function QASMExporter({ circuit }: QASMExporterProps) {
  const [qasmCode, setQasmCode] = useState('');

  const generateQASMCode = () => {
    let code = `OPENQASM 3.0;\ninclude "stdgates.inc";\n\nqubit[${5}] q;\n`;

    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          code += `h q[${gate.qubit}];\n`;
          break;
        case 'X':
          code += `x q[${gate.qubit}];\n`;
          break;
        case 'Y':
          code += `y q[${gate.qubit}];\n`;
          break;
        case 'Z':
          code += `z q[${gate.qubit}];\n`;
          break;
        case 'CNOT':
          if (gate.qubits && gate.qubits.length === 2) {
            code += `cx q[${gate.qubits[0]}], q[${gate.qubits[1]}];\n`;
          }
          break;
        case 'RX':
          if (gate.angle !== undefined) {
            code += `rx(${gate.angle}) q[${gate.qubit}];\n`;
          }
          break;
          case 'RY':
            if (gate.angle !== undefined) {
              code += `ry(${gate.angle}) q[${gate.qubit}];\n`;
            }
            break;
        case 'RZ':
          if (gate.angle !== undefined) {
            code += `rz(${gate.angle}) q[${gate.qubit}];\n`;
          }
          break;
        case 'M':
          code += `bit c${gate.qubit};\n`;
          code += `c${gate.qubit} = measure q[${gate.qubit}];\n`;
          break;
        default:
          console.warn(`Unsupported gate type: ${gate.type}`);
      }
    });

    setQasmCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(qasmCode);
    toast("QASM code copied to clipboard");
  };

  const downloadQASMFile = () => {
    const blob = new Blob([qasmCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuit.qasm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast("QASM file downloaded as circuit.qasm");
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
          <Code className="w-4 h-4" />
          QASM Exporter
          <Badge variant="secondary" className="ml-2">
            QASM 3.0
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={generateQASMCode} className="w-full neon-border" variant="outline">
          Generate QASM Code
        </Button>
        {qasmCode ? (
          <>
            <Textarea
              value={qasmCode}
              readOnly
              className="bg-quantum-void border-quantum-matrix text-xs font-mono"
            />
            <div className="flex justify-between">
              <Button onClick={copyToClipboard} variant="secondary" size="sm">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button onClick={downloadQASMFile} variant="secondary" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download .qasm
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            Generate QASM code to export your quantum circuit
          </div>
        )}
      </CardContent>
    </Card>
  );
}
