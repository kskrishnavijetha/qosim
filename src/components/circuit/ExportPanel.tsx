
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Gate, Qubit } from '@/hooks/useCircuitBuilder';
import { Download, Upload, Copy, FileCode, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExportPanelProps {
  circuit: Gate[];
  qubits: Qubit[];
  onExport: (format: string) => void;
  onImport: (data: string, format: string) => void;
}

const EXPORT_FORMATS = [
  { id: 'openqasm', name: 'OpenQASM 2.0', extension: '.qasm' },
  { id: 'json', name: 'JSON', extension: '.json' },
  { id: 'qiskit', name: 'Python (Qiskit)', extension: '.py' },
  { id: 'qosim', name: 'JavaScript (QOSim)', extension: '.js' },
];

export function ExportPanel({ circuit, qubits, onExport, onImport }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState('openqasm');
  const [exportedCode, setExportedCode] = useState('');
  const [importData, setImportData] = useState('');

  const generateOpenQASM = () => {
    let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n\n';
    qasm += `qreg q[${qubits.length}];\n`;
    qasm += `creg c[${qubits.length}];\n\n`;

    // Sort gates by position
    const sortedGates = [...circuit].sort((a, b) => a.position - b.position);

    for (const gate of sortedGates) {
      switch (gate.type) {
        case 'H':
          qasm += `h q[${gate.qubit}];\n`;
          break;
        case 'X':
          qasm += `x q[${gate.qubit}];\n`;
          break;
        case 'Y':
          qasm += `y q[${gate.qubit}];\n`;
          break;
        case 'Z':
          qasm += `z q[${gate.qubit}];\n`;
          break;
        case 'S':
          qasm += `s q[${gate.qubit}];\n`;
          break;
        case 'T':
          qasm += `t q[${gate.qubit}];\n`;
          break;
        case 'CNOT':
          if (gate.controlQubits && gate.controlQubits[0] !== undefined) {
            qasm += `cx q[${gate.controlQubits[0]}],q[${gate.qubit}];\n`;
          }
          break;
        case 'RX':
          const rxAngle = gate.parameters?.angle || Math.PI / 4;
          qasm += `rx(${rxAngle}) q[${gate.qubit}];\n`;
          break;
        case 'RY':
          const ryAngle = gate.parameters?.angle || Math.PI / 4;
          qasm += `ry(${ryAngle}) q[${gate.qubit}];\n`;
          break;
        case 'RZ':
          const rzAngle = gate.parameters?.angle || Math.PI / 4;
          qasm += `rz(${rzAngle}) q[${gate.qubit}];\n`;
          break;
        case 'MEASURE':
          qasm += `measure q[${gate.qubit}] -> c[${gate.qubit}];\n`;
          break;
      }
    }

    return qasm;
  };

  const generateJSON = () => {
    return JSON.stringify({
      qubits: qubits.length,
      gates: circuit.map(gate => ({
        type: gate.type,
        qubit: gate.qubit,
        position: gate.position,
        parameters: gate.parameters,
        controlQubits: gate.controlQubits
      }))
    }, null, 2);
  };

  const generateQiskit = () => {
    let code = 'from qiskit import QuantumCircuit, execute, Aer\n';
    code += 'from qiskit.visualization import plot_histogram\n';
    code += 'import numpy as np\n\n';
    code += `# Create quantum circuit with ${qubits.length} qubits\n`;
    code += `qc = QuantumCircuit(${qubits.length}, ${qubits.length})\n\n`;

    const sortedGates = [...circuit].sort((a, b) => a.position - b.position);

    for (const gate of sortedGates) {
      switch (gate.type) {
        case 'H':
          code += `qc.h(${gate.qubit})\n`;
          break;
        case 'X':
          code += `qc.x(${gate.qubit})\n`;
          break;
        case 'Y':
          code += `qc.y(${gate.qubit})\n`;
          break;
        case 'Z':
          code += `qc.z(${gate.qubit})\n`;
          break;
        case 'CNOT':
          if (gate.controlQubits && gate.controlQubits[0] !== undefined) {
            code += `qc.cx(${gate.controlQubits[0]}, ${gate.qubit})\n`;
          }
          break;
        case 'RX':
          const rxAngle = gate.parameters?.angle || 'np.pi/4';
          code += `qc.rx(${rxAngle}, ${gate.qubit})\n`;
          break;
        case 'MEASURE':
          code += `qc.measure(${gate.qubit}, ${gate.qubit})\n`;
          break;
      }
    }

    code += '\n# Execute the circuit\n';
    code += 'backend = Aer.get_backend("qasm_simulator")\n';
    code += 'job = execute(qc, backend, shots=1024)\n';
    code += 'result = job.result()\n';
    code += 'counts = result.get_counts(qc)\n';
    code += 'print(counts)\n';

    return code;
  };

  const generateQOSim = () => {
    let code = 'import { QOSimSDK } from "@/sdk/qosim-sdk";\n\n';
    code += '// Initialize QOSim SDK\n';
    code += 'const sdk = new QOSimSDK();\n';
    code += 'await sdk.initialize();\n\n';
    code += `// Create circuit with ${qubits.length} qubits\n`;
    code += `const circuit = sdk.createCircuit("Generated Circuit", ${qubits.length});\n\n`;

    const sortedGates = [...circuit].sort((a, b) => a.position - b.position);

    for (const gate of sortedGates) {
      switch (gate.type) {
        case 'H':
          code += `circuit = sdk.addGate(circuit, { type: 'h', qubit: ${gate.qubit} });\n`;
          break;
        case 'X':
          code += `circuit = sdk.addGate(circuit, { type: 'x', qubit: ${gate.qubit} });\n`;
          break;
        case 'CNOT':
          if (gate.controlQubits && gate.controlQubits[0] !== undefined) {
            code += `circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: ${gate.controlQubits[0]}, qubit: ${gate.qubit} });\n`;
          }
          break;
      }
    }

    code += '\n// Simulate the circuit\n';
    code += 'const result = await sdk.simulate(circuit);\n';
    code += 'console.log(result);\n';

    return code;
  };

  const handleExport = () => {
    let code = '';

    switch (selectedFormat) {
      case 'openqasm':
        code = generateOpenQASM();
        break;
      case 'json':
        code = generateJSON();
        break;
      case 'qiskit':
        code = generateQiskit();
        break;
      case 'qosim':
        code = generateQOSim();
        break;
    }

    setExportedCode(code);
    onExport(selectedFormat);

    toast({
      title: "Export Generated",
      description: `Circuit exported as ${selectedFormat.toUpperCase()}`,
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportedCode);
      toast({
        title: "Copied to Clipboard",
        description: "Code has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy code to clipboard",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const format = EXPORT_FORMATS.find(f => f.id === selectedFormat);
    const blob = new Blob([exportedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_circuit${format?.extension || '.txt'}`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: "Circuit file download has started",
    });
  };

  const handleImport = () => {
    if (!importData.trim()) {
      toast({
        title: "Import Failed",
        description: "Please enter data to import",
        variant: "destructive"
      });
      return;
    }

    onImport(importData, selectedFormat);
    toast({
      title: "Import Successful",
      description: "Circuit has been imported",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Export Circuit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium">Export Format</label>
            <Select value={selectedFormat} onValueChange={setSelectedFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPORT_FORMATS.map((format) => (
                  <SelectItem key={format.id} value={format.id}>
                    <div className="flex items-center gap-2">
                      <FileCode className="w-3 h-3" />
                      {format.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Export Actions */}
          <div className="flex gap-2">
            <Button onClick={handleExport} className="flex-1" size="sm">
              <FileCode className="w-4 h-4 mr-1" />
              Generate
            </Button>
          </div>

          {/* Generated Code */}
          {exportedCode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">Generated Code</label>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={handleCopy}>
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleDownload}>
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={exportedCode}
                readOnly
                className="font-mono text-xs resize-none"
                rows={8}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import Circuit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium">Import Data</label>
            <Textarea
              placeholder={`Paste your ${selectedFormat.toUpperCase()} code here...`}
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="font-mono text-xs"
              rows={6}
            />
          </div>

          <Button onClick={handleImport} className="w-full" size="sm">
            <Upload className="w-4 h-4 mr-1" />
            Import Circuit
          </Button>
        </CardContent>
      </Card>

      {/* Circuit Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Circuit Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Qubits:</span>
              <Badge variant="secondary">{qubits.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gates:</span>
              <Badge variant="secondary">{circuit.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Depth:</span>
              <Badge variant="secondary">
                {Math.max(...circuit.map(g => g.position)) + 1 || 0}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Types:</span>
              <Badge variant="secondary">
                {new Set(circuit.map(g => g.type)).size}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
