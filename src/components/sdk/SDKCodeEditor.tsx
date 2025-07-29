
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Download, 
  Copy, 
  Settings, 
  Code, 
  FileCode, 
  Lightbulb,
  Zap 
} from 'lucide-react';
import QOSimSDK, { QuantumCircuit } from '@/sdk/qosim-sdk';
import { BellStateGenerator } from '@/sdk/algorithms/bellState';
import { GroverAlgorithm } from '@/sdk/algorithms/grovers';
import { QuantumFourierTransform } from '@/sdk/algorithms/qft';
import { ErrorCorrectionCodes } from '@/sdk/algorithms/errorCorrection';
import { toast } from 'sonner';

interface SDKCodeEditorProps {
  initialCode?: string;
  language: 'javascript' | 'python';
  onCodeChange?: (code: string) => void;
  onCircuitGenerated?: (circuit: QuantumCircuit) => void;
}

interface CodeSuggestion {
  type: 'completion' | 'optimization' | 'correction';
  text: string;
  description: string;
  insertText: string;
}

const JAVASCRIPT_TEMPLATES = {
  'bell-state': `// Bell State Generation
import { QOSimSDK, BellStateGenerator } from '@qosim/sdk';

const sdk = new QOSimSDK();
const bellGen = new BellStateGenerator(sdk);

async function createBellState() {
  const result = await bellGen.quickBellState();
  console.log('Bell state created:', result.description);
  
  const simulation = await sdk.simulate(result.circuit);
  console.log('Measurement probabilities:', simulation.measurementProbabilities);
  
  return result.circuit;
}

createBellState();`,

  'grover': `// Grover's Search Algorithm
import { QOSimSDK, GroverAlgorithm } from '@qosim/sdk';

const sdk = new QOSimSDK();
const grover = new GroverAlgorithm(sdk);

async function groverSearch() {
  const result = await grover.quickGrover2Q();
  console.log('Search probability:', result.successProbability);
  
  const simulation = await sdk.simulate(result.circuit, 1024);
  console.log('Results:', simulation.measurementProbabilities);
  
  return result.circuit;
}

groverSearch();`,

  'qft': `// Quantum Fourier Transform
import { QOSimSDK, QuantumFourierTransform } from '@qosim/sdk';

const sdk = new QOSimSDK();
const qft = new QuantumFourierTransform(sdk);

async function quantumFourierTransform() {
  const result = await qft.quickQFT3Q();
  console.log('QFT circuit created:', result.description);
  
  const simulation = await sdk.simulate(result.circuit);
  console.log('Frequency domain:', simulation.measurementProbabilities);
  
  return result.circuit;
}

quantumFourierTransform();`
};

const PYTHON_TEMPLATES = {
  'bell-state': `# Bell State Generation using QOSim SDK
from qosim_sdk import QOSimSDK, BellStateGenerator

def create_bell_state():
    sdk = QOSimSDK()
    bell_gen = BellStateGenerator(sdk)
    
    result = bell_gen.quick_bell_state()
    print(f"Bell state created: {result.description}")
    
    simulation = sdk.simulate(result.circuit)
    print(f"Measurement probabilities: {simulation.measurement_probabilities}")
    
    return result.circuit

if __name__ == "__main__":
    circuit = create_bell_state()`,

  'grover': `# Grover's Search Algorithm using QOSim SDK
from qosim_sdk import QOSimSDK, GroverAlgorithm

def grover_search():
    sdk = QOSimSDK()
    grover = GroverAlgorithm(sdk)
    
    result = grover.quick_grover_2q()
    print(f"Search probability: {result.success_probability:.3f}")
    
    simulation = sdk.simulate(result.circuit, shots=1024)
    print(f"Results: {simulation.measurement_probabilities}")
    
    return result.circuit

if __name__ == "__main__":
    circuit = grover_search()`,

  'qft': `# Quantum Fourier Transform using QOSim SDK
from qosim_sdk import QOSimSDK, QuantumFourierTransform

def quantum_fourier_transform():
    sdk = QOSimSDK()
    qft = QuantumFourierTransform(sdk)
    
    result = qft.quick_qft_3q()
    print(f"QFT circuit created: {result.description}")
    
    simulation = sdk.simulate(result.circuit)
    print(f"Frequency domain: {simulation.measurement_probabilities}")
    
    return result.circuit

if __name__ == "__main__":
    circuit = quantum_fourier_transform()`
};

export function SDKCodeEditor({
  initialCode = '',
  language,
  onCodeChange,
  onCircuitGenerated
}: SDKCodeEditorProps) {
  const [code, setCode] = useState(initialCode);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState('');
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ line: 0, column: 0 });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sdk = new QOSimSDK();

  useEffect(() => {
    onCodeChange?.(code);
    generateSuggestions();
  }, [code, onCodeChange]);

  const generateSuggestions = () => {
    const newSuggestions: CodeSuggestion[] = [];

    // Auto-completion suggestions
    if (code.includes('sdk.create')) {
      newSuggestions.push({
        type: 'completion',
        text: 'createCircuit',
        description: 'Create a new quantum circuit',
        insertText: 'createCircuit("My Circuit", 3)'
      });
    }

    if (code.includes('.h(') || code.includes('.x(') || code.includes('.cnot(')) {
      newSuggestions.push({
        type: 'optimization',
        text: 'Add measurement',
        description: 'Consider adding measurements to observe results',
        insertText: 'circuit = sdk.measure(circuit, 0);'
      });
    }

    // Error detection
    if (code.includes('qubit: 5') && !code.includes('qubits: 6')) {
      newSuggestions.push({
        type: 'correction',
        text: 'Qubit index out of range',
        description: 'Qubit index 5 requires at least 6 qubits',
        insertText: 'Increase circuit size or use valid qubit index'
      });
    }

    setSuggestions(newSuggestions);
  };

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    const templates = language === 'javascript' ? JAVASCRIPT_TEMPLATES : PYTHON_TEMPLATES;
    if (template && templates[template as keyof typeof templates]) {
      setCode(templates[template as keyof typeof templates]);
    }
  };

  const executeCode = async () => {
    setIsExecuting(true);
    setExecutionOutput('');

    try {
      // Simulate code execution
      let circuit: QuantumCircuit;
      
      if (selectedTemplate === 'bell-state') {
        const bellGen = new BellStateGenerator(sdk);
        const result = await bellGen.quickBellState();
        circuit = result.circuit;
        onCircuitGenerated?.(circuit);
      } else if (selectedTemplate === 'grover') {
        const grover = new GroverAlgorithm(sdk);
        const result = await grover.quickGrover2Q();
        circuit = result.circuit;
        onCircuitGenerated?.(circuit);
      } else if (selectedTemplate === 'qft') {
        const qft = new QuantumFourierTransform(sdk);
        const result = await qft.quickQFT3Q();
        circuit = result.circuit;
        onCircuitGenerated?.(circuit);
      } else {
        // Create a simple test circuit
        circuit = sdk.createCircuit("Test Circuit", 2);
        circuit = sdk.h(circuit, 0);
        circuit = sdk.cnot(circuit, 0, 1);
        onCircuitGenerated?.(circuit);
      }

      const simulation = await sdk.simulate(circuit);
      
      let output = `✅ Execution completed successfully!\n\n`;
      output += `Circuit: ${circuit.name}\n`;
      output += `Qubits: ${circuit.qubits}\n`;
      output += `Gates: ${circuit.gates.length}\n`;
      output += `Execution time: ${simulation.executionTime.toFixed(2)}ms\n\n`;
      output += `Measurement Probabilities:\n`;
      
      Object.entries(simulation.measurementProbabilities).forEach(([state, prob]) => {
        output += `|${state}⟩: ${(prob * 100).toFixed(2)}%\n`;
      });

      setExecutionOutput(output);
      toast.success('Code executed successfully!');

    } catch (error) {
      const errorOutput = `❌ Execution failed:\n\n${error.message}`;
      setExecutionOutput(errorOutput);
      toast.error('Code execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const downloadCode = () => {
    const extension = language === 'javascript' ? 'js' : 'py';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_algorithm.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Code downloaded successfully');
  };

  const insertSuggestion = (suggestion: CodeSuggestion) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newCode = code.substring(0, start) + suggestion.insertText + code.substring(end);
      setCode(newCode);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-quantum-glow flex items-center gap-2">
              <Code className="w-5 h-5" />
              {language === 'javascript' ? 'JavaScript' : 'Python'} SDK Editor
            </span>
            <Badge variant="outline" className="neon-border">
              v1.0.0
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-quantum-neon">Template:</label>
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger className="w-48 quantum-panel neon-border">
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent className="quantum-panel neon-border">
                  <SelectItem value="bell-state">Bell State</SelectItem>
                  <SelectItem value="grover">Grover's Search</SelectItem>
                  <SelectItem value="qft">Quantum Fourier Transform</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={executeCode}
                disabled={isExecuting}
                className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
              >
                {isExecuting ? (
                  <Settings className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                Execute
              </Button>
              
              <Button variant="outline" onClick={copyCode} className="neon-border">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              
              <Button variant="outline" onClick={downloadCode} className="neon-border">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <FileCode className="w-5 h-5" />
                Code Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                ref={textareaRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="font-mono text-sm quantum-panel neon-border min-h-[400px] resize-none"
                placeholder={`Write your ${language} quantum algorithm here...`}
                spellCheck={false}
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* AI Suggestions */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                AI Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 bg-quantum-void rounded border border-quantum-matrix cursor-pointer hover:bg-quantum-matrix transition-colors"
                    onClick={() => insertSuggestion(suggestion)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant={suggestion.type === 'correction' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {suggestion.type}
                      </Badge>
                      <span className="text-sm font-medium text-quantum-glow">
                        {suggestion.text}
                      </span>
                    </div>
                    <p className="text-xs text-quantum-particle">
                      {suggestion.description}
                    </p>
                  </div>
                ))}
                
                {suggestions.length === 0 && (
                  <div className="text-center text-quantum-particle py-4">
                    <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Start typing for AI suggestions</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Execution Output */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Output</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs font-mono text-quantum-neon bg-quantum-void p-3 rounded border border-quantum-matrix min-h-32 max-h-48 overflow-y-auto">
                {executionOutput || 'Click "Execute" to run your code...'}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
