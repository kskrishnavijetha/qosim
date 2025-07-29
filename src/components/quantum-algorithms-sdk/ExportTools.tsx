
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Download, Share, Copy, FileCode } from 'lucide-react';
import { Algorithm, SDKExecutionResult } from './QuantumAlgorithmsSDK';
import { toast } from 'sonner';

interface ExportToolsProps {
  algorithm: Algorithm | null;
  code: string;
  language: 'python' | 'javascript';
  result: SDKExecutionResult | null;
}

export function ExportTools({ algorithm, code, language, result }: ExportToolsProps) {
  const [exportFormat, setExportFormat] = useState<'qasm' | 'qiskit' | 'cirq' | 'json'>('qasm');
  const [exportedCode, setExportedCode] = useState('');

  const generateQASM = () => {
    if (!algorithm) return '';
    
    let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\n\nqreg q[${algorithm.qubits}];\ncreg c[${algorithm.qubits}];\n\n`;
    
    // Simple conversion based on algorithm type
    if (algorithm.id === 'bell-states') {
      qasm += `h q[0];\ncx q[0], q[1];\n`;
    } else if (algorithm.id === 'grovers-search') {
      qasm += `h q[0];\nh q[1];\ncz q[0], q[1];\nh q[0];\nh q[1];\nx q[0];\nx q[1];\ncz q[0], q[1];\nx q[0];\nx q[1];\nh q[0];\nh q[1];\n`;
    } else if (algorithm.id === 'qft') {
      qasm += `h q[0];\ncp(pi/2) q[0], q[1];\ncp(pi/4) q[0], q[2];\nh q[1];\ncp(pi/2) q[1], q[2];\nh q[2];\nswap q[0], q[2];\n`;
    }
    
    qasm += `\nmeasure q -> c;\n`;
    return qasm;
  };

  const generateQiskit = () => {
    if (!algorithm) return '';
    
    let qiskit = `# ${algorithm.name} - Qiskit Implementation\nfrom qiskit import QuantumCircuit, execute, Aer\nfrom qiskit.visualization import plot_histogram\n\n`;
    qiskit += `# Create quantum circuit\nqc = QuantumCircuit(${algorithm.qubits}, ${algorithm.qubits})\n\n`;
    
    if (algorithm.id === 'bell-states') {
      qiskit += `# Create Bell state\nqc.h(0)\nqc.cx(0, 1)\n`;
    } else if (algorithm.id === 'grovers-search') {
      qiskit += `# Grover's algorithm\nqc.h(0)\nqc.h(1)\nqc.cz(0, 1)\nqc.h([0, 1])\nqc.x([0, 1])\nqc.cz(0, 1)\nqc.x([0, 1])\nqc.h([0, 1])\n`;
    } else if (algorithm.id === 'qft') {
      qiskit += `# Quantum Fourier Transform\nimport numpy as np\nqc.h(0)\nqc.cp(np.pi/2, 0, 1)\nqc.cp(np.pi/4, 0, 2)\nqc.h(1)\nqc.cp(np.pi/2, 1, 2)\nqc.h(2)\nqc.swap(0, 2)\n`;
    }
    
    qiskit += `\n# Add measurements\nqc.measure_all()\n\n# Execute\nbackend = Aer.get_backend('qasm_simulator')\njob = execute(qc, backend, shots=1024)\nresult = job.result()\ncounts = result.get_counts(qc)\nprint(counts)\n`;
    
    return qiskit;
  };

  const generateCirq = () => {
    if (!algorithm) return '';
    
    let cirq = `# ${algorithm.name} - Cirq Implementation\nimport cirq\nimport numpy as np\n\n`;
    cirq += `# Create qubits\nqubits = [cirq.GridQubit(i, 0) for i in range(${algorithm.qubits})]\n\n# Create circuit\ncircuit = cirq.Circuit()\n\n`;
    
    if (algorithm.id === 'bell-states') {
      cirq += `# Create Bell state\ncircuit.append(cirq.H(qubits[0]))\ncircuit.append(cirq.CNOT(qubits[0], qubits[1]))\n`;
    } else if (algorithm.id === 'grovers-search') {
      cirq += `# Grover's algorithm\ncircuit.append([cirq.H(q) for q in qubits])\ncircuit.append(cirq.CZ(qubits[0], qubits[1]))\ncircuit.append([cirq.H(q) for q in qubits])\n`;
    }
    
    cirq += `\n# Add measurements\ncircuit.append(cirq.measure(*qubits, key='result'))\n\n# Execute\nsimulator = cirq.Simulator()\nresult = simulator.run(circuit, repetitions=1024)\nprint(result.histogram(key='result'))\n`;
    
    return cirq;
  };

  const generateJSON = () => {
    if (!algorithm || !result) return '';
    
    const exportData = {
      algorithm: {
        id: algorithm.id,
        name: algorithm.name,
        category: algorithm.category,
        description: algorithm.description,
        complexity: algorithm.complexity,
        qubits: algorithm.qubits,
        depth: algorithm.depth,
        gates: algorithm.gates
      },
      execution: {
        language: language,
        executionTime: result.executionTime,
        fidelity: result.fidelity,
        circuitDepth: result.circuitDepth,
        gateCount: result.gateCount
      },
      results: {
        stateVector: result.stateVector,
        measurementProbabilities: result.measurementProbabilities,
        entanglement: result.entanglement
      },
      code: code,
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(exportData, null, 2);
  };

  const handleExport = () => {
    let content = '';
    let filename = '';
    let mimeType = 'text/plain';
    
    switch (exportFormat) {
      case 'qasm':
        content = generateQASM();
        filename = `${algorithm?.id || 'algorithm'}.qasm`;
        break;
      case 'qiskit':
        content = generateQiskit();
        filename = `${algorithm?.id || 'algorithm'}_qiskit.py`;
        break;
      case 'cirq':
        content = generateCirq();
        filename = `${algorithm?.id || 'algorithm'}_cirq.py`;
        break;
      case 'json':
        content = generateJSON();
        filename = `${algorithm?.id || 'algorithm'}_results.json`;
        mimeType = 'application/json';
        break;
    }
    
    setExportedCode(content);
    
    // Download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Exported to ${filename}`);
  };

  const handleCopy = () => {
    if (exportedCode) {
      navigator.clipboard.writeText(exportedCode);
      toast.success('Exported code copied to clipboard');
    }
  };

  const handleShare = () => {
    if (algorithm && code) {
      const shareData = {
        title: `${algorithm.name} - QOSim Algorithm`,
        text: algorithm.description,
        url: window.location.href
      };
      
      if (navigator.share) {
        navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Share link copied to clipboard');
      }
    }
  };

  if (!algorithm) {
    return (
      <Card className="h-full quantum-panel neon-border">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <FileCode className="w-16 h-16 mx-auto text-quantum-particle/50 mb-4" />
            <p className="text-quantum-particle">Select an algorithm to access export tools</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Export Options */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
            <Share className="w-5 h-5" />
            Export & Share
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-quantum-neon mb-2 block">Export Format</label>
              <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                <SelectTrigger className="quantum-panel neon-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="quantum-panel neon-border">
                  <SelectItem value="qasm">OpenQASM 2.0</SelectItem>
                  <SelectItem value="qiskit">Qiskit (Python)</SelectItem>
                  <SelectItem value="cirq">Cirq (Python)</SelectItem>
                  <SelectItem value="json">JSON Results</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={handleExport}
                className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
              >
                <Download className="w-4 h-4 mr-2" />
                Export File
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="neon-border"
                disabled={!exportedCode}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                className="neon-border"
              >
                <Share className="w-4 h-4 mr-2" />
                Share Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Info */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon">Algorithm Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-quantum-particle">Name</div>
              <div className="text-quantum-glow font-medium">{algorithm.name}</div>
            </div>
            <div>
              <div className="text-quantum-particle">Category</div>
              <Badge variant="outline" className="text-quantum-neon">
                {algorithm.category}
              </Badge>
            </div>
            <div>
              <div className="text-quantum-particle">Qubits</div>
              <div className="text-quantum-glow">{algorithm.qubits}</div>
            </div>
            <div>
              <div className="text-quantum-particle">Depth</div>
              <div className="text-quantum-glow">{algorithm.depth}</div>
            </div>
          </div>
          
          {result && (
            <div className="mt-4 pt-4 border-t border-quantum-matrix">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-quantum-particle">Execution Time</div>
                  <div className="text-quantum-energy">{result.executionTime.toFixed(1)}ms</div>
                </div>
                <div>
                  <div className="text-quantum-particle">Fidelity</div>
                  <div className="text-quantum-energy">{(result.fidelity * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {exportedCode && (
        <Card className="flex-1 quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-sm text-quantum-neon">Export Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <Textarea
              value={exportedCode}
              readOnly
              className="h-full font-mono text-xs quantum-panel neon-border resize-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
