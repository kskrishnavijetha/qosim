import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Copy, Download, FileText } from 'lucide-react';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface CircuitExporterProps {
  circuit: Gate[];
  onClose: () => void;
  onExport: (format: string) => void;
}

export function CircuitExporter({ circuit, onClose, onExport }: CircuitExporterProps) {
  const [format, setFormat] = useState('qasm');
  const [exportedCode, setExportedCode] = useState('');

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(e.target.value);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exportedCode);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([exportedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `circuit.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleGenerateCode = () => {
    let code = '';

    if (format === 'qasm') {
      code = generateQASMCode(circuit);
    } else if (format === 'quil') {
      code = generateQuilCode(circuit);
    } else if (format === 'pyquil') {
      code = generatePyQuilCode(circuit);
    }

    setExportedCode(code);
  };

  const generateQASMCode = (circuit: Gate[]) => {
    let qasmCode = `OPENQASM 2.0;\ninclude "stdgates.inc";\n\n`;
    qasmCode += `qreg q[5];\ncreg c[5];\n\n`;

    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          qasmCode += `h q[${gate.qubit}];\n`;
          break;
        case 'X':
          qasmCode += `x q[${gate.qubit}];\n`;
          break;
        case 'Z':
          qasmCode += `z q[${gate.qubit}];\n`;
          break;
        case 'CNOT':
          if (gate.qubits && gate.qubits.length === 2) {
            qasmCode += `cx q[${gate.qubits[0]}], q[${gate.qubits[1]}];\n`;
          }
          break;
        case 'M':
          qasmCode += `measure q[${gate.qubit}] -> c[${gate.qubit}];\n`;
          break;
        default:
          break;
      }
    });

    return qasmCode;
  };

  const generateQuilCode = (circuit: Gate[]) => {
    let quilCode = `PRAGMA PRESERVE_BLOCK_STRUCTURE\n\n`;
    quilCode += `DECLARE ro BIT[5]\n\n`;

    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          quilCode += `H ${gate.qubit}\n`;
          break;
        case 'X':
          quilCode += `X ${gate.qubit}\n`;
          break;
        case 'Z':
          quilCode += `Z ${gate.qubit}\n`;
          break;
        case 'CNOT':
          if (gate.qubits && gate.qubits.length === 2) {
            quilCode += `CNOT ${gate.qubits[0]} ${gate.qubits[1]}\n`;
          }
          break;
        case 'M':
          quilCode += `MEASURE ${gate.qubit} ro[${gate.qubit}]\n`;
          break;
        default:
          break;
      }
    });

    return quilCode;
  };

  const generatePyQuilCode = (circuit: Gate[]) => {
    let pyQuilCode = `from pyquil import Program, get_qc\nfrom pyquil.gates import *\n\n`;
    pyQuilCode += `p = Program()\n`;
    pyQuilCode += `ro = p.declare('ro', 'BIT', 5)\n\n`;

    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          pyQuilCode += `p += H(${gate.qubit})\n`;
          break;
        case 'X':
          pyQuilCode += `p += X(${gate.qubit})\n`;
          break;
        case 'Z':
          pyQuilCode += `p += Z(${gate.qubit})\n`;
          break;
        case 'CNOT':
          if (gate.qubits && gate.qubits.length === 2) {
            pyQuilCode += `p += CNOT(${gate.qubits[0]}, ${gate.qubits[1]})\n`;
          }
          break;
        case 'M':
          pyQuilCode += `p += MEASURE(${gate.qubit}, ro[${gate.qubit}])\n`;
          break;
        default:
          break;
      }
    });

    pyQuilCode += `\n# You can now run this program on a QPU or a simulator\n`;
    pyQuilCode += `# e.g., qc = get_qc('Aspen-9')\n`;
    pyQuilCode += `# results = qc.run(p).readout_data.get('ro')\n`;

    return pyQuilCode;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="max-w-2xl w-full quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow">Export Circuit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="format" className="block text-sm font-medium text-quantum-glow">
              Select Format
            </label>
            <select
              id="format"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-quantum-void text-quantum-neon"
              defaultValue={format}
              onChange={handleFormatChange}
            >
              <option value="qasm">QASM</option>
              <option value="quil">Quil</option>
              <option value="pyquil">pyQuil</option>
            </select>
          </div>
          <div>
            <Button onClick={handleGenerateCode} className="w-full neon-border" variant="outline">
              Generate Code
            </Button>
          </div>
          <div>
            <Textarea
              className="w-full bg-quantum-void text-quantum-neon font-mono text-sm"
              value={exportedCode}
              readOnly
              placeholder="Generated code will appear here"
            />
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyCode} className="neon-border">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadCode} className="neon-border">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
            <div>
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

