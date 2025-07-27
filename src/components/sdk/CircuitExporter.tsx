import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gate } from '@/hooks/useCircuitState';
import { HardwareIntegration } from '../hardware/HardwareIntegration';
import { Download, Copy, FileText, Code, Braces, FileCode, Cpu } from 'lucide-react';
import { toast } from 'sonner';

interface CircuitExporterProps {
  circuit: Gate[];
  simulationResult: any;
}

export function CircuitExporter({ circuit, simulationResult }: CircuitExporterProps) {
  const [projectName, setProjectName] = useState('quantum_circuit');
  const [exportFormat, setExportFormat] = useState('qasm');

  const generateQASM = () => {
    const numQubits = Math.max(5, ...circuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))) + 1;
    
    let qasm = `OPENQASM 2.0;\n`;
    qasm += `include "qelib1.inc";\n\n`;
    qasm += `qreg q[${numQubits}];\n`;
    qasm += `creg c[${numQubits}];\n\n`;

    circuit.forEach(gate => {
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
        case 'CNOT':
          if (gate.qubits) qasm += `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];\n`;
          break;
        case 'RX':
          qasm += `rx(${gate.angle || 0}) q[${gate.qubit}];\n`;
          break;
        case 'RY':
          qasm += `ry(${gate.angle || 0}) q[${gate.qubit}];\n`;
          break;
        case 'RZ':
          qasm += `rz(${gate.angle || 0}) q[${gate.qubit}];\n`;
          break;
        case 'M':
          qasm += `measure q[${gate.qubit}] -> c[${gate.qubit}];\n`;
          break;
      }
    });

    return qasm;
  };

  const generateQiskit = () => {
    const numQubits = Math.max(5, ...circuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))) + 1;
    
    let qiskit = `from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister\n`;
    qiskit += `from qiskit import transpile, assemble\n`;
    qiskit += `from qiskit.providers.aer import QasmSimulator\n\n`;
    qiskit += `# Create quantum circuit\n`;
    qiskit += `qr = QuantumRegister(${numQubits}, 'q')\n`;
    qiskit += `cr = ClassicalRegister(${numQubits}, 'c')\n`;
    qiskit += `circuit = QuantumCircuit(qr, cr)\n\n`;

    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          qiskit += `circuit.h(${gate.qubit})\n`;
          break;
        case 'X':
          qiskit += `circuit.x(${gate.qubit})\n`;
          break;
        case 'Y':
          qiskit += `circuit.y(${gate.qubit})\n`;
          break;
        case 'Z':
          qiskit += `circuit.z(${gate.qubit})\n`;
          break;
        case 'CNOT':
          if (gate.qubits) qiskit += `circuit.cx(${gate.qubits[0]}, ${gate.qubits[1]})\n`;
          break;
        case 'RX':
          qiskit += `circuit.rx(${gate.angle || 0}, ${gate.qubit})\n`;
          break;
        case 'RY':
          qiskit += `circuit.ry(${gate.angle || 0}, ${gate.qubit})\n`;
          break;
        case 'RZ':
          qiskit += `circuit.rz(${gate.angle || 0}, ${gate.qubit})\n`;
          break;
        case 'M':
          qiskit += `circuit.measure(${gate.qubit}, ${gate.qubit})\n`;
          break;
      }
    });

    qiskit += `\n# Execute the circuit\n`;
    qiskit += `simulator = QasmSimulator()\n`;
    qiskit += `compiled_circuit = transpile(circuit, simulator)\n`;
    qiskit += `qobj = assemble(compiled_circuit, shots=1024)\n`;
    qiskit += `result = simulator.run(qobj).result()\n`;
    qiskit += `counts = result.get_counts(circuit)\n`;
    qiskit += `print(counts)\n`;

    return qiskit;
  };

  const generateCirq = () => {
    let cirq = `import cirq\nimport numpy as np\n\n`;
    cirq += `# Create qubits\n`;
    
    const numQubits = Math.max(5, ...circuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))) + 1;
    cirq += `qubits = [cirq.GridQubit(0, i) for i in range(${numQubits})]\n\n`;
    cirq += `# Create circuit\ncircuit = cirq.Circuit()\n\n`;

    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          cirq += `circuit.append(cirq.H(qubits[${gate.qubit}]))\n`;
          break;
        case 'X':
          cirq += `circuit.append(cirq.X(qubits[${gate.qubit}]))\n`;
          break;
        case 'Y':
          cirq += `circuit.append(cirq.Y(qubits[${gate.qubit}]))\n`;
          break;
        case 'Z':
          cirq += `circuit.append(cirq.Z(qubits[${gate.qubit}]))\n`;
          break;
        case 'CNOT':
          if (gate.qubits) cirq += `circuit.append(cirq.CNOT(qubits[${gate.qubits[0]}], qubits[${gate.qubits[1]}]))\n`;
          break;
        case 'RX':
          cirq += `circuit.append(cirq.rx(${gate.angle || 0})(qubits[${gate.qubit}]))\n`;
          break;
        case 'RY':
          cirq += `circuit.append(cirq.ry(${gate.angle || 0})(qubits[${gate.qubit}]))\n`;
          break;
        case 'RZ':
          cirq += `circuit.append(cirq.rz(${gate.angle || 0})(qubits[${gate.qubit}]))\n`;
          break;
        case 'M':
          cirq += `circuit.append(cirq.measure(qubits[${gate.qubit}], key='m${gate.qubit}'))\n`;
          break;
      }
    });

    cirq += `\n# Simulate the circuit\n`;
    cirq += `simulator = cirq.Simulator()\n`;
    cirq += `result = simulator.run(circuit, repetitions=1024)\n`;
    cirq += `print(result.histogram(key='measurements'))\n`;

    return cirq;
  };

  const generateJSON = () => {
    const exportData = {
      metadata: {
        name: projectName,
        version: "1.0.0",
        created: new Date().toISOString(),
        qubits: Math.max(5, ...circuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))) + 1,
        gates: circuit.length,
        depth: Math.max(...circuit.map(g => g.position), 0) + 1
      },
      circuit: circuit.map(gate => ({
        id: gate.id,
        type: gate.type,
        qubit: gate.qubit,
        qubits: gate.qubits,
        position: gate.position,
        angle: gate.angle,
        params: gate.params
      })),
      simulation: simulationResult ? {
        executionTime: simulationResult.executionTime,
        fidelity: simulationResult.fidelity,
        shots: simulationResult.shots,
        mode: simulationResult.mode
      } : null
    };

    return JSON.stringify(exportData, null, 2);
  };

  const getExportContent = () => {
    switch (exportFormat) {
      case 'qasm': return generateQASM();
      case 'qiskit': return generateQiskit();
      case 'cirq': return generateCirq();
      case 'json': return generateJSON();
      default: return '';
    }
  };

  const getFileExtension = () => {
    switch (exportFormat) {
      case 'qasm': return 'qasm';
      case 'qiskit': return 'py';
      case 'cirq': return 'py';
      case 'json': return 'json';
      default: return 'txt';
    }
  };

  const handleExport = () => {
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
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getExportContent());
    toast.success('Copied', { description: 'Code copied to clipboard' });
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
      id: 'cirq', 
      name: 'Google Cirq', 
      icon: <FileCode className="w-4 h-4" />,
      description: 'Google Cirq quantum computing platform'
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
          <Badge variant="secondary" className="bg-quantum-matrix text-quantum-neon">
            {circuit.length} Gates
          </Badge>
        </div>

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
                disabled={circuit.length === 0}
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
