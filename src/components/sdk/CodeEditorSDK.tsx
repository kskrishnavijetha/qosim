
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Play, Save, Download, Bug, Lightbulb, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const EXAMPLE_CODES = {
  javascript: {
    bell: `// Bell State Example
const qosim = new QOSimSDK();
const circuit = qosim.createCircuit(2, "Bell State Generator");

// Apply Hadamard to create superposition
circuit.h(0);

// Apply CNOT for entanglement
circuit.cnot(0, 1);

// Simulate and get results
const result = await circuit.simulate();
console.log("State vector:", result.statevector);
console.log("Probabilities:", result.probabilities);

// Measure the qubits
const measurements = await circuit.measure([0, 1], 1000);
console.log("Measurement results:", measurements);`,
    grover: `// Grover's Algorithm Example
const qosim = new QOSimSDK();
const circuit = qosim.createCircuit(3, "Grover Search");

// Initialize superposition
circuit.h([0, 1, 2]);

// Oracle function - mark |101⟩
function oracle(circuit) {
  circuit.x(1);  // Flip qubit 1
  circuit.ccz(0, 2, 1);  // Multi-controlled Z
  circuit.x(1);  // Flip back
}

// Diffusion operator
function diffusion(circuit) {
  circuit.h([0, 1, 2]);
  circuit.x([0, 1, 2]);
  circuit.ccz(0, 1, 2);
  circuit.x([0, 1, 2]);
  circuit.h([0, 1, 2]);
}

// Apply Grover iteration
oracle(circuit);
diffusion(circuit);

const result = await circuit.simulate();
console.log("Search probabilities:", result.probabilities);`
  },
  python: {
    bell: `# Bell State Example
from qosim import QOSimSDK

qosim = QOSimSDK()
circuit = qosim.create_circuit(2, "Bell State Generator")

# Apply Hadamard to create superposition
circuit.h(0)

# Apply CNOT for entanglement
circuit.cnot(0, 1)

# Simulate and get results
result = circuit.simulate()
print(f"State vector: {result.statevector}")
print(f"Probabilities: {result.probabilities}")

# Measure the qubits
measurements = circuit.measure([0, 1], shots=1000)
print(f"Measurement results: {measurements}")`,
    grover: `# Grover's Algorithm Example
from qosim import QOSimSDK

qosim = QOSimSDK()
circuit = qosim.create_circuit(3, "Grover Search")

# Initialize superposition
circuit.h([0, 1, 2])

# Oracle function - mark |101⟩
def oracle(circuit):
    circuit.x(1)  # Flip qubit 1
    circuit.ccz(0, 2, 1)  # Multi-controlled Z
    circuit.x(1)  # Flip back

# Diffusion operator
def diffusion(circuit):
    circuit.h([0, 1, 2])
    circuit.x([0, 1, 2])
    circuit.ccz(0, 1, 2)
    circuit.x([0, 1, 2])
    circuit.h([0, 1, 2])

# Apply Grover iteration
oracle(circuit)
diffusion(circuit)

result = circuit.simulate()
print(f"Search probabilities: {result.probabilities}")`
  }
};

interface CodeEditorSDKProps {
  selectedLanguage: 'javascript' | 'python';
  workspace: any;
}

export function CodeEditorSDK({ selectedLanguage, workspace }: CodeEditorSDKProps) {
  const [code, setCode] = useState(EXAMPLE_CODES[selectedLanguage].bell);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Running simulation...\n');
    setErrors([]);
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockOutput = `Simulation completed successfully!
      
State Vector: [0.707+0i, 0+0i, 0+0i, 0.707+0i]
Probabilities: [0.5, 0, 0, 0.5]
Entanglement: 1.0 (maximum)
Execution time: 1.23ms

Measurement Results (1000 shots):
|00⟩: 497 counts (49.7%)
|11⟩: 503 counts (50.3%)

Circuit depth: 2
Gate count: H=1, CNOT=1`;
      
      setOutput(mockOutput);
      
      toast({
        title: "Code Executed",
        description: "Quantum simulation completed successfully",
      });
    } catch (error) {
      setErrors(['Simulation failed: Invalid quantum gate configuration']);
      setOutput('Error occurred during execution. Check the errors panel.');
      
      toast({
        title: "Execution Error",
        description: "Failed to run quantum simulation",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSaveCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-algorithm.${selectedLanguage === 'javascript' ? 'js' : 'py'}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code Saved",
      description: "Algorithm saved to file",
    });
  };

  const handleLoadExample = (example: string) => {
    setCode(EXAMPLE_CODES[selectedLanguage][example as keyof typeof EXAMPLE_CODES[typeof selectedLanguage]]);
    setOutput('');
    setErrors([]);
  };

  const handleGetSuggestions = () => {
    const mockSuggestions = [
      'Consider adding error correction for noise resilience',
      'Use parameterized gates for variational algorithms',
      'Add measurement operations for classical output',
      'Optimize circuit depth for NISQ devices'
    ];
    setSuggestions(mockSuggestions);
    
    toast({
      title: "AI Suggestions",
      description: "Code analysis completed",
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied",
      description: "Code copied to clipboard",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Code Editor */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-quantum-glow">
              {selectedLanguage === 'javascript' ? 'JavaScript' : 'Python'} Editor
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleLoadExample('bell')}
                className="neon-border"
              >
                Bell State
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleLoadExample('grover')}
                className="neon-border"
              >
                Grover
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm quantum-panel neon-border min-h-[400px] resize-none"
            placeholder={`Write your ${selectedLanguage} quantum algorithm here...`}
          />
          
          <div className="flex gap-2">
            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              className="flex-1 neon-border"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Run Circuit'}
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveCode}
              className="neon-border"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyCode}
              className="neon-border"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={handleGetSuggestions}
              className="neon-border"
            >
              <Lightbulb className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output and Debug Panel */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Output & Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="output" className="space-y-4">
            <TabsList className="grid grid-cols-3 quantum-tabs">
              <TabsTrigger value="output">Output</TabsTrigger>
              <TabsTrigger value="errors">
                Errors {errors.length > 0 && <Badge variant="destructive" className="ml-2">{errors.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="suggestions">
                AI Suggestions {suggestions.length > 0 && <Badge variant="secondary" className="ml-2">{suggestions.length}</Badge>}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="output">
              <div className="quantum-panel neon-border p-4 h-[400px] overflow-auto">
                <pre className="text-sm text-quantum-neon whitespace-pre-wrap">
                  {output || 'No output yet. Run your code to see results.'}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="errors">
              <div className="quantum-panel neon-border p-4 h-[400px] overflow-auto">
                {errors.length > 0 ? (
                  <div className="space-y-2">
                    {errors.map((error, index) => (
                      <div key={index} className="flex items-start gap-2 text-red-400">
                        <Bug className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-quantum-particle text-sm">No errors detected.</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="suggestions">
              <div className="quantum-panel neon-border p-4 h-[400px] overflow-auto">
                {suggestions.length > 0 ? (
                  <div className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start gap-2 text-quantum-energy">
                        <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-quantum-particle text-sm">Click the lightbulb icon to get AI-powered suggestions for your code.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
