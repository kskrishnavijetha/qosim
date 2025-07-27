
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Gate } from '@/hooks/useCircuitState';
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { 
  Download, 
  Copy, 
  FileText, 
  Code, 
  Cloud, 
  Cpu,
  ExternalLink 
} from 'lucide-react';
import { toast } from 'sonner';

interface CircuitExporterProps {
  circuit: Gate[];
  simulationResult: OptimizedSimulationResult | null;
}

export function CircuitExporter({ circuit, simulationResult }: CircuitExporterProps) {
  const [activeFormat, setActiveFormat] = useState('qasm');

  const generateQASM = () => {
    let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\n\n`;
    qasm += `qreg q[5];\ncreg c[5];\n\n`;
    
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
          if (gate.qubits && gate.qubits.length >= 2) {
            qasm += `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];\n`;
          }
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
      }
    });
    
    qasm += `\nmeasure q -> c;\n`;
    return qasm;
  };

  const generateQiskit = () => {
    let code = `from qiskit import QuantumCircuit, execute, Aer\nfrom qiskit.visualization import plot_histogram\n\n`;
    code += `# Create quantum circuit\nqc = QuantumCircuit(5, 5)\n\n`;
    
    circuit.forEach(gate => {
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
          if (gate.qubits && gate.qubits.length >= 2) {
            code += `qc.cx(${gate.qubits[0]}, ${gate.qubits[1]})\n`;
          }
          break;
        case 'RX':
          code += `qc.rx(${gate.angle || 0}, ${gate.qubit})\n`;
          break;
        case 'RY':
          code += `qc.ry(${gate.angle || 0}, ${gate.qubit})\n`;
          break;
        case 'RZ':
          code += `qc.rz(${gate.angle || 0}, ${gate.qubit})\n`;
          break;
      }
    });
    
    code += `\n# Measure all qubits\nqc.measure_all()\n\n`;
    code += `# Execute circuit\nsimulator = Aer.get_backend('qasm_simulator')\njob = execute(qc, simulator, shots=1024)\nresult = job.result()\ncounts = result.get_counts(qc)\n\n`;
    code += `# Display results\nprint(counts)\nplot_histogram(counts)\n`;
    
    return code;
  };

  const generateCirc = () => {
    let code = `import cirq\n\n`;
    code += `# Create qubits\nqubits = [cirq.GridQubit(i, 0) for i in range(5)]\n\n`;
    code += `# Create circuit\ncircuit = cirq.Circuit()\n\n`;
    
    circuit.forEach(gate => {
      switch (gate.type) {
        case 'H':
          code += `circuit.append(cirq.H(qubits[${gate.qubit}]))\n`;
          break;
        case 'X':
          code += `circuit.append(cirq.X(qubits[${gate.qubit}]))\n`;
          break;
        case 'Y':
          code += `circuit.append(cirq.Y(qubits[${gate.qubit}]))\n`;
          break;
        case 'Z':
          code += `circuit.append(cirq.Z(qubits[${gate.qubit}]))\n`;
          break;
        case 'CNOT':
          if (gate.qubits && gate.qubits.length >= 2) {
            code += `circuit.append(cirq.CNOT(qubits[${gate.qubits[0]}], qubits[${gate.qubits[1]}]))\n`;
          }
          break;
        case 'RX':
          code += `circuit.append(cirq.rx(${gate.angle || 0})(qubits[${gate.qubit}]))\n`;
          break;
        case 'RY':
          code += `circuit.append(cirq.ry(${gate.angle || 0})(qubits[${gate.qubit}]))\n`;
          break;
        case 'RZ':
          code += `circuit.append(cirq.rz(${gate.angle || 0})(qubits[${gate.qubit}]))\n`;
          break;
      }
    });
    
    code += `\n# Add measurements\ncircuit.append(cirq.measure(*qubits, key='result'))\n\n`;
    code += `# Simulate\nsimulator = cirq.Simulator()\nresult = simulator.run(circuit, repetitions=1024)\n`;
    code += `print(result.histogram(key='result'))\n`;
    
    return code;
  };

  const generateJSON = () => {
    return JSON.stringify({
      circuit: {
        name: "QOSim Circuit",
        qubits: 5,
        gates: circuit.map(gate => ({
          type: gate.type,
          qubit: gate.qubit,
          qubits: gate.qubits,
          position: gate.position,
          angle: gate.angle,
          params: gate.params
        }))
      },
      simulationResult: simulationResult ? {
        stateVector: simulationResult.stateVector,
        measurementProbabilities: simulationResult.measurementProbabilities,
        executionTime: simulationResult.executionTime,
        fidelity: simulationResult.fidelity
      } : null
    }, null, 2);
  };

  const formats = {
    qasm: { name: 'QASM', generator: generateQASM, icon: <FileText className="w-4 h-4" /> },
    qiskit: { name: 'Qiskit', generator: generateQiskit, icon: <Code className="w-4 h-4" /> },
    cirq: { name: 'Cirq', generator: generateCirc, icon: <Code className="w-4 h-4" /> },
    json: { name: 'JSON', generator: generateJSON, icon: <FileText className="w-4 h-4" /> }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Code copied to clipboard');
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded');
  };

  const hardwareProviders = [
    { name: 'IBM Quantum', icon: <Cpu className="w-4 h-4" />, url: 'https://quantum-computing.ibm.com/' },
    { name: 'AWS Braket', icon: <Cloud className="w-4 h-4" />, url: 'https://aws.amazon.com/braket/' },
    { name: 'Google Quantum AI', icon: <Cloud className="w-4 h-4" />, url: 'https://quantumai.google/' },
    { name: 'Rigetti Computing', icon: <Cpu className="w-4 h-4" />, url: 'https://www.rigetti.com/' }
  ];

  return (
    <div className="space-y-6">
      {/* Export Options */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow">Export Circuit</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeFormat} onValueChange={setActiveFormat}>
            <TabsList className="grid w-full grid-cols-4">
              {Object.entries(formats).map(([key, format]) => (
                <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                  {format.icon}
                  <span>{format.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(formats).map(([key, format]) => (
              <TabsContent key={key} value={key} className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{format.name} Format</Badge>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopy(format.generator())}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(format.generator(), `circuit.${key === 'qiskit' || key === 'cirq' ? 'py' : key}`)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <Textarea
                  value={format.generator()}
                  readOnly
                  className="font-mono text-sm min-h-[300px] bg-quantum-void"
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Hardware Providers */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow">Deploy to Quantum Hardware</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hardwareProviders.map(provider => (
              <div
                key={provider.name}
                className="p-4 border border-quantum-matrix rounded-lg bg-quantum-void/50 hover:bg-quantum-matrix/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {provider.icon}
                    <div>
                      <h3 className="font-semibold text-quantum-neon">{provider.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Export and run on real quantum hardware
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(provider.url, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Circuit Statistics */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow">Circuit Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-quantum-void rounded">
              <div className="text-2xl font-mono text-quantum-glow">{circuit.length}</div>
              <div className="text-sm text-muted-foreground">Total Gates</div>
            </div>
            <div className="text-center p-3 bg-quantum-void rounded">
              <div className="text-2xl font-mono text-quantum-neon">5</div>
              <div className="text-sm text-muted-foreground">Qubits</div>
            </div>
            <div className="text-center p-3 bg-quantum-void rounded">
              <div className="text-2xl font-mono text-quantum-energy">
                {circuit.reduce((max, gate) => Math.max(max, gate.position), 0) + 1}
              </div>
              <div className="text-sm text-muted-foreground">Circuit Depth</div>
            </div>
            <div className="text-center p-3 bg-quantum-void rounded">
              <div className="text-2xl font-mono text-quantum-particle">
                {simulationResult?.executionTime.toFixed(1) || '0.0'}ms
              </div>
              <div className="text-sm text-muted-foreground">Sim Time</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
