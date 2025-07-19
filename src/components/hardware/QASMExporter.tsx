
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Gate } from '@/hooks/useCircuitState';
import { FileText, Download, Play, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface QASMExporterProps {
  circuit: Gate[];
  onJobSubmit: (job: QuantumJob) => void;
  backends: Array<{
    id: string;
    name: string;
    provider: string;
    isActive: boolean;
  }>;
}

export interface QuantumJob {
  id: string;
  name: string;
  qasm: string;
  backend: string;
  shots: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  submittedAt: Date;
  completedAt?: Date;
  result?: any;
}

export function QASMExporter({ circuit, onJobSubmit, backends }: QASMExporterProps) {
  const [jobName, setJobName] = useState('quantum_job');
  const [selectedBackend, setSelectedBackend] = useState<string>('');
  const [shots, setShots] = useState(1024);
  const [qasm, setQasm] = useState('');

  const generateQASM = () => {
    if (circuit.length === 0) {
      toast.error('Circuit is empty. Add some gates first.');
      return;
    }

    const numQubits = Math.max(5, ...circuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))) + 1;
    
    let qasmCode = `OPENQASM 2.0;\n`;
    qasmCode += `include "qelib1.inc";\n\n`;
    qasmCode += `qreg q[${numQubits}];\n`;
    qasmCode += `creg c[${numQubits}];\n\n`;

    // Sort gates by position to ensure correct order
    const sortedGates = [...circuit].sort((a, b) => a.position - b.position);

    for (const gate of sortedGates) {
      switch (gate.type) {
        case 'H':
          qasmCode += `h q[${gate.qubit}];\n`;
          break;
        case 'X':
          qasmCode += `x q[${gate.qubit}];\n`;
          break;
        case 'Y':
          qasmCode += `y q[${gate.qubit}];\n`;
          break;
        case 'Z':
          qasmCode += `z q[${gate.qubit}];\n`;
          break;
        case 'S':
          qasmCode += `s q[${gate.qubit}];\n`;
          break;
        case 'T':
          qasmCode += `t q[${gate.qubit}];\n`;
          break;
        case 'CNOT':
          if (gate.qubits && gate.qubits.length >= 2) {
            qasmCode += `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];\n`;
          }
          break;
        case 'RX':
          qasmCode += `rx(${gate.angle || 0}) q[${gate.qubit}];\n`;
          break;
        case 'RY':
          qasmCode += `ry(${gate.angle || 0}) q[${gate.qubit}];\n`;
          break;
        case 'RZ':
          qasmCode += `rz(${gate.angle || 0}) q[${gate.qubit}];\n`;
          break;
        case 'CZ':
          if (gate.qubits && gate.qubits.length >= 2) {
            qasmCode += `cz q[${gate.qubits[0]}],q[${gate.qubits[1]}];\n`;
          }
          break;
        case 'M':
          qasmCode += `measure q[${gate.qubit}] -> c[${gate.qubit}];\n`;
          break;
        default:
          console.warn(`Unsupported gate type for QASM export: ${gate.type}`);
      }
    }

    // Add measurements for all qubits if no measurement gates are present
    const hasMeasurements = circuit.some(gate => gate.type === 'M');
    if (!hasMeasurements) {
      qasmCode += `\n// Measure all qubits\n`;
      for (let i = 0; i < numQubits; i++) {
        qasmCode += `measure q[${i}] -> c[${i}];\n`;
      }
    }

    setQasm(qasmCode);
    toast.success('QASM code generated successfully');
  };

  const downloadQASM = () => {
    if (!qasm) {
      toast.error('Generate QASM code first');
      return;
    }

    const blob = new Blob([qasm], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${jobName}.qasm`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('QASM file downloaded');
  };

  const submitJob = () => {
    if (!qasm) {
      toast.error('Generate QASM code first');
      return;
    }

    if (!selectedBackend) {
      toast.error('Select a backend first');
      return;
    }

    const job: QuantumJob = {
      id: `job_${Date.now()}`,
      name: jobName,
      qasm,
      backend: selectedBackend,
      shots,
      status: 'pending',
      submittedAt: new Date()
    };

    onJobSubmit(job);
    toast.success(`Job "${jobName}" submitted successfully`);
  };

  const activeBackends = backends.filter(b => b.isActive);

  return (
    <div className="space-y-6">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <FileText className="w-5 h-5" />
            QASM Export & Job Submission
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Export your circuit to QASM and submit to real quantum hardware
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Configuration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job-name">Job Name</Label>
              <Input
                id="job-name"
                value={jobName}
                onChange={(e) => setJobName(e.target.value)}
                placeholder="Enter job name..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shots">Shots</Label>
              <Input
                id="shots"
                type="number"
                min="1"
                max="100000"
                value={shots}
                onChange={(e) => setShots(parseInt(e.target.value) || 1024)}
              />
            </div>
          </div>

          {/* Backend Selection */}
          <div className="space-y-2">
            <Label htmlFor="backend">Hardware Backend</Label>
            <Select value={selectedBackend} onValueChange={setSelectedBackend}>
              <SelectTrigger>
                <SelectValue placeholder="Select a hardware backend..." />
              </SelectTrigger>
              <SelectContent>
                {activeBackends.map(backend => (
                  <SelectItem key={backend.id} value={backend.id}>
                    {backend.name} ({backend.provider.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activeBackends.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No active backends configured. Configure hardware backends first.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={generateQASM}
              variant="outline"
              disabled={circuit.length === 0}
              className="flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Generate QASM
            </Button>
            <Button
              onClick={downloadQASM}
              variant="outline"
              disabled={!qasm}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              onClick={submitJob}
              disabled={!qasm || !selectedBackend}
              className="bg-quantum-glow text-quantum-void flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Submit Job
            </Button>
          </div>

          {/* Circuit Info */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{circuit.length} Gates</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {Math.max(5, ...circuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))) + 1} Qubits
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Depth: {Math.max(...circuit.map(g => g.position), 0) + 1}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QASM Preview */}
      {qasm && (
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-sm text-quantum-neon">QASM Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={qasm}
              readOnly
              className="font-mono text-xs min-h-[300px] quantum-panel"
              placeholder="Generated QASM code will appear here..."
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
