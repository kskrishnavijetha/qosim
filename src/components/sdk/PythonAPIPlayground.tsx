import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface PythonAPIPlaygroundProps {
  circuit: Gate[];
}

export function PythonAPIPlayground({ circuit }: PythonAPIPlaygroundProps) {
  const [pythonCode, setPythonCode] = useState('');

  const generatePythonCode = () => {
    // Convert circuit to Python code
    const code = `
from qiskit import QuantumCircuit

# Create a Quantum Circuit with ${circuit.length} qubits
qc = QuantumCircuit(${5})

# Add quantum gates to the circuit
${circuit.map(gate => {
      switch (gate.type) {
        case 'H':
          return `qc.h(${gate.qubit})`;
        case 'X':
          return `qc.x(${gate.qubit})`;
        case 'Z':
          return `qc.z(${gate.qubit})`;
        case 'CNOT':
          if (gate.qubits && gate.qubits.length === 2) {
            return `qc.cx(${gate.qubits[0]}, ${gate.qubits[1]})`;
          }
          return '';
        case 'RX':
          return `qc.rx(${gate.angle || 0}, ${gate.qubit})`;
        case 'RY':
          return `qc.ry(${gate.angle || 0}, ${gate.qubit})`;
        case 'RZ':
          return `qc.rz(${gate.angle || 0}, ${gate.qubit})`;
        case 'M':
          return `qc.measure(${gate.qubit}, ${gate.qubit})`;
        default:
          return '';
      }
    }).filter(Boolean).join('\n')}

# Print the circuit
print(qc.draw())
`;
    setPythonCode(code);
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon">Python API Playground</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={generatePythonCode} className="w-full neon-border" variant="outline">
            Generate Python Code
          </Button>
          <Textarea
            value={pythonCode}
            className="bg-quantum-void text-quantum-glow font-mono text-xs rounded-md border-quantum-matrix min-h-[150px]"
            placeholder="Generated Python code will appear here"
          />
          <Badge variant="secondary">
            Qiskit Code
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

