
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Save, 
  Download, 
  Copy, 
  Code2, 
  Terminal,
  FileText,
  Zap
} from 'lucide-react';

interface InteractiveCodeEditorProps {
  currentCircuit: any[];
  onCircuitUpdate: (circuit: any[]) => void;
}

export function InteractiveCodeEditor({ currentCircuit, onCircuitUpdate }: InteractiveCodeEditorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState(`// QOSim JavaScript SDK Example
const circuit = new QOSimCircuit(2);
circuit.h(0);           // Hadamard gate on qubit 0
circuit.cnot(0, 1);     // CNOT gate
circuit.run();          // Execute circuit
console.log(circuit.getResults());`);
  
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const codeTemplates = {
    javascript: {
      'bell-state': `// Bell State Creation
const circuit = new QOSimCircuit(2);
circuit.h(0);
circuit.cnot(0, 1);
circuit.run();`,
      'grover': `// Grover's Algorithm
const circuit = new QOSimCircuit(2);
circuit.h(0); circuit.h(1);
circuit.cz(0, 1);  // Oracle
// Diffusion operator
circuit.h(0); circuit.h(1);
circuit.x(0); circuit.x(1);
circuit.cz(0, 1);
circuit.x(0); circuit.x(1);
circuit.h(0); circuit.h(1);
circuit.run();`,
      'qft': `// Quantum Fourier Transform
const circuit = new QOSimCircuit(3);
circuit.h(0);
circuit.cp(Math.PI/2, 0, 1);
circuit.h(1);
circuit.cp(Math.PI/4, 0, 2);
circuit.cp(Math.PI/2, 1, 2);
circuit.h(2);
circuit.run();`
    },
    python: {
      'bell-state': `# Bell State Creation
circuit = QOSimCircuit(2)
circuit.h(0)
circuit.cnot(0, 1)
circuit.run()`,
      'grover': `# Grover's Algorithm
circuit = QOSimCircuit(2)
circuit.h(0); circuit.h(1)
circuit.cz(0, 1)  # Oracle
# Diffusion operator
circuit.h(0); circuit.h(1)
circuit.x(0); circuit.x(1)
circuit.cz(0, 1)
circuit.x(0); circuit.x(1)
circuit.h(0); circuit.h(1)
circuit.run()`,
      'qft': `# Quantum Fourier Transform
circuit = QOSimCircuit(3)
circuit.h(0)
circuit.cp(np.pi/2, 0, 1)
circuit.h(1)
circuit.cp(np.pi/4, 0, 2)
circuit.cp(np.pi/2, 1, 2)
circuit.h(2)
circuit.run()`
    }
  };

  const handleTemplateSelect = (template: string) => {
    setCode(codeTemplates[selectedLanguage][template] || '');
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running quantum simulation...\n');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput(`Execution completed successfully!
      
State Vector: [0.7071+0i, 0+0i, 0+0i, 0.7071+0i]
Probabilities: [50.0%, 0.0%, 0.0%, 50.0%]
Entanglement: True
Execution Time: 2.3ms

Bell state created successfully with maximum entanglement.`);
      setIsRunning(false);
    }, 2000);
  };

  const handleExportCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_circuit.${selectedLanguage === 'javascript' ? 'js' : 'py'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl text-quantum-glow flex items-center gap-2">
              <Code2 className="w-6 h-6" />
              Interactive Code Editor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
              <Badge variant="outline" className="text-quantum-neon">
                {currentCircuit.length} gates loaded
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Code Editor Panel */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-quantum-glow">Code Editor</CardTitle>
              <div className="flex gap-2">
                <Select onValueChange={handleTemplateSelect}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Load template..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bell-state">Bell State</SelectItem>
                    <SelectItem value="grover">Grover's Algorithm</SelectItem>
                    <SelectItem value="qft">QFT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="min-h-[400px] font-mono text-sm bg-quantum-matrix border-quantum-neon/30"
              placeholder="Write your quantum circuit code here..."
            />
            
            <div className="flex gap-2">
              <Button onClick={handleRunCode} disabled={isRunning} className="flex-1">
                {isRunning ? (
                  <Zap className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
              <Button variant="outline" onClick={handleCopyCode}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" onClick={handleExportCode}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              Execution Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-quantum-matrix rounded-lg p-4 min-h-[400px] font-mono text-sm">
              <pre className="text-quantum-neon whitespace-pre-wrap">
                {output || 'No output yet. Run your code to see results here.'}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Panel */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
            <FileText className="w-5 h-5" />
            API Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="basic-gates">
            <TabsList>
              <TabsTrigger value="basic-gates">Basic Gates</TabsTrigger>
              <TabsTrigger value="advanced-gates">Advanced Gates</TabsTrigger>
              <TabsTrigger value="measurement">Measurement</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic-gates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-mono text-quantum-neon mb-2">circuit.h(qubit)</h4>
                  <p className="text-sm text-quantum-particle">Apply Hadamard gate to create superposition</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-mono text-quantum-neon mb-2">circuit.x(qubit)</h4>
                  <p className="text-sm text-quantum-particle">Apply Pauli-X (bit flip) gate</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-mono text-quantum-neon mb-2">circuit.cnot(control, target)</h4>
                  <p className="text-sm text-quantum-particle">Apply controlled-NOT gate for entanglement</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-mono text-quantum-neon mb-2">circuit.z(qubit)</h4>
                  <p className="text-sm text-quantum-particle">Apply Pauli-Z (phase flip) gate</p>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="advanced-gates" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-mono text-quantum-neon mb-2">circuit.ry(angle, qubit)</h4>
                  <p className="text-sm text-quantum-particle">Rotation around Y-axis by specified angle</p>
                </Card>
                <Card className="p-4">
                  <h4 className="font-mono text-quantum-neon mb-2">circuit.cz(control, target)</h4>
                  <p className="text-sm text-quantum-particle">Controlled-Z gate for phase operations</p>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="measurement">
              <Card className="p-4">
                <h4 className="font-mono text-quantum-neon mb-2">circuit.measure(qubit)</h4>
                <p className="text-sm text-quantum-particle">Measure qubit and collapse to classical state</p>
              </Card>
            </TabsContent>
            
            <TabsContent value="examples">
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="text-quantum-neon mb-2">Creating Bell State</h4>
                  <pre className="text-xs text-quantum-particle bg-quantum-void p-2 rounded">
{`circuit.h(0);     // Superposition
circuit.cnot(0, 1); // Entanglement`}
                  </pre>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
