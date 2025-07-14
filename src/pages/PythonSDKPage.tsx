import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  Copy, 
  Check, 
  ArrowLeft, 
  Code, 
  BookOpen, 
  Play, 
  FileCode,
  Terminal,
  Atom,
  Zap,
  CircuitBoard
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PythonSDKPage = () => {
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard"
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the text manually",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', '/qosim-sdk.py');
    element.setAttribute('download', 'qosim-sdk.py');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download started",
      description: "QOSim Python SDK is being downloaded"
    });
  };

  const installationCode = `pip install numpy

# Download the SDK
wget https://your-app-url.com/qosim-sdk.py

# Or download manually and save as qosim-sdk.py`;

  const basicUsageCode = `from qosim_sdk import QOSimulator, bell_state, grover_2qubit

# Create a 3-qubit simulator
sim = QOSimulator(3)

# Add gates
sim.h(0)         # Hadamard on qubit 0
sim.cnot(0, 1)   # CNOT with control=0, target=1
sim.x(2)         # Pauli-X on qubit 2

# Run simulation
result = sim.run()
print(f"Probabilities: {result['probabilities']}")`;

  const bellStateCode = `# Create and run a Bell state
bell_sim = bell_state()
result = bell_sim.run()

print("Bell State Results:")
print(f"State vector: {result['state_vector']}")
print(f"Probabilities: {result['probabilities']}")

# Export to different formats
qasm_code = bell_sim.export_qasm()
qiskit_code = bell_sim.export_qiskit()`;

  const advancedCode = `# Advanced quantum circuit
sim = QOSimulator(4)

# Quantum Fourier Transform-like circuit
for i in range(4):
    sim.h(i)
    for j in range(i + 1, 4):
        angle = 3.14159 / (2 ** (j - i))
        sim.rz(j, angle)

# Measure specific qubits
measurement = sim.measure(0)  # Measure qubit 0
all_measurements = sim.measure()  # Measure all qubits

# Get circuit information
info = sim.get_circuit_info()
print(f"Circuit has {info['num_gates']} gates")`;

  const exportCode = `# Export to OpenQASM 2.0
qasm_string = sim.export_qasm()
print("QASM Code:")
print(qasm_string)

# Export to Qiskit Python code
qiskit_string = sim.export_qiskit()
print("Qiskit Code:")
print(qiskit_string)

# Save to files
with open('my_circuit.qasm', 'w') as f:
    f.write(qasm_string)
    
with open('my_circuit_qiskit.py', 'w') as f:
    f.write(qiskit_string)`;

  const examples = [
    {
      title: "Bell State",
      description: "Create quantum entanglement between two qubits",
      code: `sim = bell_state()
result = sim.run()
print(result['probabilities'])  # [0.5, 0, 0, 0.5]`
    },
    {
      title: "Grover's Algorithm",
      description: "Search algorithm for 2 qubits",
      code: `sim = grover_2qubit()
result = sim.run()
# Enhanced probability for target state`
    },
    {
      title: "Quantum Fourier Transform",
      description: "Quantum algorithm for frequency analysis",
      code: `sim = quantum_fourier_transform(3)
result = sim.run()
print(f"QFT result: {result['probabilities']}")`
    }
  ];

  const features = [
    {
      icon: <Atom className="h-6 w-6" />,
      title: "Native Python",
      description: "Pure Python implementation with NumPy for quantum simulation"
    },
    {
      icon: <CircuitBoard className="h-6 w-6" />,
      title: "Quantum Gates",
      description: "All standard quantum gates: H, X, Y, Z, CNOT, rotations, and more"
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Export Formats",
      description: "Export circuits to OpenQASM 2.0 and Qiskit Python code"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Built-in Examples",
      description: "Pre-built quantum algorithms like Bell states and Grover's search"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-quantum-glow hover:text-quantum-neon transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to QOSim</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2">
              <FileCode className="h-6 w-6 text-quantum-glow" />
              <h1 className="text-xl font-bold">Python SDK</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={handleDownload}
              className="bg-quantum-glow hover:bg-quantum-neon text-black font-medium"
            >
              <Download className="h-4 w-4 mr-2" />
              Download SDK
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card className="quantum-panel">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Terminal className="h-6 w-6 text-quantum-glow" />
                  <CardTitle className="text-2xl">QOSim Python SDK</CardTitle>
                </div>
                <p className="text-muted-foreground">
                  A powerful Python library for quantum circuit simulation, compatible with NumPy and easily exportable to OpenQASM and Qiskit formats.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {features.map((feature, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className="mx-auto w-12 h-12 rounded-lg bg-quantum-glow/10 flex items-center justify-center text-quantum-glow">
                        {feature.icon}
                      </div>
                      <h3 className="font-medium text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Code Examples */}
            <Card className="quantum-panel">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Documentation & Examples</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="installation" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="installation">Setup</TabsTrigger>
                    <TabsTrigger value="basic">Basic</TabsTrigger>
                    <TabsTrigger value="bell">Bell State</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    <TabsTrigger value="export">Export</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="installation" className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Installation</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(installationCode, 'install')}
                        >
                          {copied === 'install' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <ScrollArea className="h-[200px]">
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{installationCode}</code>
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Basic Usage</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(basicUsageCode, 'basic')}
                        >
                          {copied === 'basic' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <ScrollArea className="h-[300px]">
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{basicUsageCode}</code>
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="bell" className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Bell State Example</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(bellStateCode, 'bell')}
                        >
                          {copied === 'bell' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <ScrollArea className="h-[300px]">
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{bellStateCode}</code>
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="advanced" className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Advanced Features</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(advancedCode, 'advanced')}
                        >
                          {copied === 'advanced' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <ScrollArea className="h-[300px]">
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{advancedCode}</code>
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="export" className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">Export Formats</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(exportCode, 'export')}
                        >
                          {copied === 'export' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <ScrollArea className="h-[300px]">
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          <code>{exportCode}</code>
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Download */}
            <Card className="quantum-panel">
              <CardHeader>
                <CardTitle className="text-lg">Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleDownload}
                  className="w-full bg-quantum-glow hover:bg-quantum-neon text-black font-medium"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download SDK
                </Button>
                <div className="text-sm text-muted-foreground">
                  <p>Requirements:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>Python 3.7+</li>
                    <li>NumPy</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Example Algorithms */}
            <Card className="quantum-panel">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Built-in Examples</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {examples.map((example, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-quantum-glow border-quantum-glow/30">
                        {example.title}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{example.description}</p>
                    <ScrollArea className="h-[100px]">
                      <pre className="bg-muted/50 p-2 rounded text-xs overflow-x-auto">
                        <code>{example.code}</code>
                      </pre>
                    </ScrollArea>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* API Methods */}
            <Card className="quantum-panel">
              <CardHeader>
                <CardTitle className="text-lg">Available Gates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Badge variant="outline" className="justify-center">H</Badge>
                  <Badge variant="outline" className="justify-center">X</Badge>
                  <Badge variant="outline" className="justify-center">Y</Badge>
                  <Badge variant="outline" className="justify-center">Z</Badge>
                  <Badge variant="outline" className="justify-center">CNOT</Badge>
                  <Badge variant="outline" className="justify-center">RX</Badge>
                  <Badge variant="outline" className="justify-center">RY</Badge>
                  <Badge variant="outline" className="justify-center">RZ</Badge>
                  <Badge variant="outline" className="justify-center">T</Badge>
                  <Badge variant="outline" className="justify-center">S</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  All standard quantum gates supported with easy-to-use Python methods.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythonSDKPage;