
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Code2, Cpu } from 'lucide-react';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface CircuitExporterProps {
  circuit: Gate[];
}

export function CircuitExporter({ circuit }: CircuitExporterProps) {
  const [exportFormat, setExportFormat] = useState<string>('qasm');

  const handleExport = () => {
    switch (exportFormat) {
      case 'qasm':
        exportQASM();
        break;
      case 'qiskit':
        exportQiskit();
        break;
      case 'cirq':
        exportCirq();
        break;
      case 'json':
        exportJSON();
        break;
    }
  };

  const exportQASM = () => {
    let qasm = `OPENQASM 3.0;\ninclude "stdgates.inc";\n\nqubit[5] q;\n`;
    
    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          qasm += `h q[${gate.qubit}];\n`;
          break;
        case 'X':
          qasm += `x q[${gate.qubit}];\n`;
          break;
        case 'Z':
          qasm += `z q[${gate.qubit}];\n`;
          break;
        case 'CNOT':
          if (gate.qubits) qasm += `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];\n`;
          break;
      }
    });
    
    downloadFile(qasm, 'circuit.qasm', 'text/plain');
  };

  const exportQiskit = () => {
    let python = `from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(5)\n`;
    
    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          python += `qc.h(${gate.qubit})\n`;
          break;
        case 'X':
          python += `qc.x(${gate.qubit})\n`;
          break;
        case 'Z':
          python += `qc.z(${gate.qubit})\n`;
          break;
        case 'CNOT':
          if (gate.qubits) python += `qc.cx(${gate.qubits[0]}, ${gate.qubits[1]})\n`;
          break;
      }
    });
    
    downloadFile(python, 'circuit.py', 'text/plain');
  };

  const exportCirq = () => {
    let python = `import cirq\n\nqubits = [cirq.GridQubit(i, 0) for i in range(5)]\ncircuit = cirq.Circuit()\n`;
    
    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          python += `circuit.append(cirq.H(qubits[${gate.qubit}]))\n`;
          break;
        case 'X':
          python += `circuit.append(cirq.X(qubits[${gate.qubit}]))\n`;
          break;
        case 'Z':
          python += `circuit.append(cirq.Z(qubits[${gate.qubit}]))\n`;
          break;
        case 'CNOT':
          if (gate.qubits) python += `circuit.append(cirq.CNOT(qubits[${gate.qubits[0]}], qubits[${gate.qubits[1]}]))\n`;
          break;
      }
    });
    
    downloadFile(python, 'circuit_cirq.py', 'text/plain');
  };

  const exportJSON = () => {
    const data = {
      circuit: {
        gates: circuit,
        qubits: 5,
        created: new Date().toISOString()
      }
    };
    
    downloadFile(JSON.stringify(data, null, 2), 'circuit.json', 'application/json');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
          <Download className="w-4 h-4" />
          Circuit Export
          <Badge variant="secondary">{circuit.length} gates</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={exportFormat} onValueChange={setExportFormat}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="qasm">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                QASM 3.0
              </div>
            </SelectItem>
            <SelectItem value="qiskit">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Qiskit Python
              </div>
            </SelectItem>
            <SelectItem value="cirq">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Cirq Python
              </div>
            </SelectItem>
            <SelectItem value="json">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                JSON
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={handleExport} className="w-full" disabled={circuit.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export Circuit
        </Button>
      </CardContent>
    </Card>
  );
}
