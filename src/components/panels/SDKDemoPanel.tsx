import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Code, Play, Download, Upload, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SDKDemoPanel() {
  const [selectedExample, setSelectedExample] = useState("bell-state");
  const [customCode, setCustomCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const examples = {
    "bell-state": {
      name: "Bell State",
      code: `// Create a Bell State using QOSim SDK
import { QOSimSimulator } from './qosim-core.js';

const sim = new QOSimSimulator(2);
sim.addGate("H", 0);     // Apply Hadamard to qubit 0
sim.addGate("CNOT", 0, 1); // Apply CNOT with control=0, target=1

sim.run();
console.log("Final State Vector:", sim.getStateVector());
console.log("Measurement Probabilities:", sim.getMeasurementProbabilities());`,
      description: "Creates an entangled Bell state |00⟩ + |11⟩"
    },
    "grover": {
      name: "Grover's Algorithm",
      code: `// Grover's Search Algorithm
import { QOSimSimulator } from './qosim-core.js';

const sim = new QOSimSimulator(2);
// Initialize superposition
sim.addGate("H", 0);
sim.addGate("H", 1);

// Oracle for |11⟩
sim.addGate("CZ", 0, 1);

// Diffusion operator
sim.addGate("H", 0);
sim.addGate("H", 1);
sim.addGate("X", 0);
sim.addGate("X", 1);
sim.addGate("CZ", 0, 1);
sim.addGate("X", 0);
sim.addGate("X", 1);
sim.addGate("H", 0);
sim.addGate("H", 1);

sim.run();
console.log("State Vector:", sim.getStateVector());`,
      description: "Searches for |11⟩ state with quantum advantage"
    },
    "qft": {
      name: "Quantum Fourier Transform",
      code: `// Quantum Fourier Transform
import { QOSimSimulator } from './qosim-core.js';

const sim = new QOSimSimulator(3);
// Apply QFT to 3 qubits
sim.addGate("H", 0);
sim.addGate("CP", 0, 1, Math.PI/2);
sim.addGate("CP", 0, 2, Math.PI/4);
sim.addGate("H", 1);
sim.addGate("CP", 1, 2, Math.PI/2);
sim.addGate("H", 2);

// Swap qubits for correct output
sim.addGate("SWAP", 0, 2);

sim.run();
console.log("QFT Result:", sim.getStateVector());`,
      description: "Performs quantum Fourier transform on 3 qubits"
    },
    "qasm": {
      name: "QASM Import/Export",
      code: `// QASM Import/Export Demo
import { QOSimSimulator } from './qosim-core.js';
import { QASMParser } from './qosim-qasm.js';

// Create circuit
const sim = new QOSimSimulator(2);
sim.addGate("H", 0);
sim.addGate("CNOT", 0, 1);

// Export to QASM
const qasmCode = sim.exportQASM();
console.log("QASM Code:", qasmCode);

// Import from QASM
const parser = new QASMParser();
const newSim = parser.parseQASM(qasmCode);
newSim.run();
console.log("Imported Circuit Result:", newSim.getStateVector());`,
      description: "Demonstrates QASM import and export functionality"
    }
  };

  const runExample = async () => {
    setIsRunning(true);
    setOutput("");
    
    try {
      // Simulate the code execution
      const example = examples[selectedExample as keyof typeof examples];
      
      // Create a mock simulation result
      const mockResult = {
        "bell-state": {
          stateVector: [0.7071, 0, 0, 0.7071],
          probabilities: [0.5, 0, 0, 0.5],
          entanglement: "Qubits 0 and 1 are maximally entangled"
        },
        "grover": {
          stateVector: [0, 0, 0, 1],
          probabilities: [0, 0, 0, 1],
          amplification: "Target state |11⟩ amplified to ~100%"
        },
        "qft": {
          stateVector: [0.3536, 0.3536, 0.3536, 0.3536, 0.3536, 0.3536, 0.3536, 0.3536],
          frequencies: "Uniform frequency distribution achieved"
        },
        "qasm": {
          qasmCode: `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[2];\nh q[0];\ncx q[0], q[1];`,
          imported: true
        }
      };

      const result = mockResult[selectedExample as keyof typeof mockResult];
      
      setTimeout(() => {
        setOutput(JSON.stringify(result, null, 2));
        setIsRunning(false);
        toast({
          title: "Simulation Complete",
          description: `${example.name} executed successfully`,
        });
      }, 1500);
      
    } catch (error) {
      setIsRunning(false);
      setOutput(`Error: ${error}`);
      toast({
        title: "Simulation Error",
        description: "Failed to execute the quantum circuit",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Code copied successfully",
    });
  };

  const downloadSDK = () => {
    toast({
      title: "SDK Download",
      description: "QOSim SDK files are available in the /src directory",
    });
  };

  return (
    <div className="flex flex-col h-full bg-quantum-void p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-quantum-glow quantum-float">
            QOSim SDK Demo
          </h1>
          <p className="text-quantum-neon font-mono mt-2">
            Interactive quantum circuit programming with JavaScript
          </p>
        </div>
        <Badge variant="outline" className="neon-border text-quantum-glow">
          SDK v1.0.0
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Code Editor Panel */}
        <Card className="quantum-panel neon-border flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Code className="w-5 h-5" />
                Code Examples
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={downloadSDK}
                  className="neon-border"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download SDK
                </Button>
              </div>
            </div>
            <CardDescription className="text-quantum-particle">
              Select an example or write custom quantum circuits
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col space-y-4">
            <Select value={selectedExample} onValueChange={setSelectedExample}>
              <SelectTrigger className="quantum-panel neon-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="quantum-panel neon-border">
                {Object.entries(examples).map(([key, example]) => (
                  <SelectItem key={key} value={key}>
                    {example.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-quantum-neon">
                  {examples[selectedExample as keyof typeof examples].description}
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(examples[selectedExample as keyof typeof examples].code)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Textarea
                value={customCode || examples[selectedExample as keyof typeof examples].code}
                onChange={(e) => setCustomCode(e.target.value)}
                className="flex-1 font-mono text-sm quantum-panel neon-border min-h-[300px] resize-none"
                placeholder="Write your quantum circuit code here..."
              />
            </div>

            <Button 
              onClick={runExample} 
              disabled={isRunning}
              className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "Running Simulation..." : "Run Quantum Circuit"}
            </Button>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="quantum-panel neon-border flex flex-col">
          <CardHeader>
            <CardTitle className="text-quantum-glow">Simulation Results</CardTitle>
            <CardDescription className="text-quantum-particle">
              State vectors, probabilities, and quantum properties
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="quantum-panel neon-border rounded p-4 h-full">
              {output ? (
                <pre className="text-sm font-mono text-quantum-neon whitespace-pre-wrap overflow-auto h-full">
                  {output}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-quantum-particle">
                  {isRunning ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-quantum-glow border-t-transparent rounded-full animate-spin"></div>
                      Simulating quantum circuit...
                    </div>
                  ) : (
                    "Run a simulation to see results"
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SDK Features */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">SDK Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-quantum-matrix rounded-lg flex items-center justify-center mx-auto mb-2">
                <Code className="w-6 h-6 text-quantum-glow" />
              </div>
              <h3 className="font-semibold text-quantum-neon">Circuit Builder</h3>
              <p className="text-sm text-quantum-particle">Programmatic gate placement</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-quantum-matrix rounded-lg flex items-center justify-center mx-auto mb-2">
                <Play className="w-6 h-6 text-quantum-glow" />
              </div>
              <h3 className="font-semibold text-quantum-neon">State Vector Simulation</h3>
              <p className="text-sm text-quantum-particle">Accurate quantum evolution</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-quantum-matrix rounded-lg flex items-center justify-center mx-auto mb-2">
                <Upload className="w-6 h-6 text-quantum-glow" />
              </div>
              <h3 className="font-semibold text-quantum-neon">QASM Support</h3>
              <p className="text-sm text-quantum-particle">Import/export industry standard</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-quantum-matrix rounded-lg flex items-center justify-center mx-auto mb-2">
                <Download className="w-6 h-6 text-quantum-glow" />
              </div>
              <h3 className="font-semibold text-quantum-neon">Embeddable</h3>
              <p className="text-sm text-quantum-particle">Visual circuit rendering</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}