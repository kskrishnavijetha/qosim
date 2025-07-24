
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Code, Zap, Download } from 'lucide-react';

interface SDKDocumentationProps {
  selectedLanguage: 'javascript' | 'python';
}

export function SDKDocumentation({ selectedLanguage }: SDKDocumentationProps) {
  const jsDocumentation = {
    quickStart: `// Quick Start Guide - JavaScript SDK
import { QOSim } from '@qosim/sdk';

// Initialize QOSim
const qosim = new QOSim();

// Create a quantum circuit
const circuit = qosim.createCircuit(2);

// Add quantum gates
circuit.h(0);          // Hadamard gate
circuit.cnot(0, 1);    // CNOT gate
circuit.measure();     // Measure all qubits

// Run simulation
const result = await circuit.simulate();
console.log(result);`,
    
    api: `// API Reference - Core Methods

// Circuit Creation
const circuit = qosim.createCircuit(numQubits);

// Single-Qubit Gates
circuit.h(qubit);      // Hadamard
circuit.x(qubit);      // Pauli-X
circuit.y(qubit);      // Pauli-Y
circuit.z(qubit);      // Pauli-Z
circuit.rx(qubit, angle);  // Rotation-X
circuit.ry(qubit, angle);  // Rotation-Y
circuit.rz(qubit, angle);  // Rotation-Z

// Two-Qubit Gates
circuit.cnot(control, target);  // CNOT
circuit.cz(control, target);    // Controlled-Z
circuit.swap(qubit1, qubit2);   // SWAP

// Advanced Operations
circuit.measure(qubit);         // Measure specific qubit
circuit.reset(qubit);          // Reset qubit to |0⟩
circuit.barrier();             // Barrier for visualization`,
    
    algorithms: `// Pre-built Algorithm Examples

// Bell State
const bellState = qosim.algorithms.bellState();
const bellResult = await bellState.simulate();

// Grover's Search
const grover = qosim.algorithms.grover(2, [3]); // 2 qubits, search for |11⟩
const groverResult = await grover.simulate();

// Quantum Fourier Transform
const qft = qosim.algorithms.qft(3);
const qftResult = await qft.simulate();

// Shor's Algorithm
const shor = qosim.algorithms.shor(15); // Factor 15
const shorResult = await shor.simulate();`
  };

  const pythonDocumentation = {
    quickStart: `# Quick Start Guide - Python SDK
from qosim import Circuit, QOSim

# Initialize QOSim
qosim = QOSim()

# Create a quantum circuit
circuit = Circuit(2)

# Add quantum gates
circuit.h(0)          # Hadamard gate
circuit.cnot(0, 1)    # CNOT gate
circuit.measure()     # Measure all qubits

# Run simulation
result = circuit.simulate()
print(result)`,
    
    api: `# API Reference - Core Methods

# Circuit Creation
circuit = Circuit(num_qubits)

# Single-Qubit Gates
circuit.h(qubit)      # Hadamard
circuit.x(qubit)      # Pauli-X
circuit.y(qubit)      # Pauli-Y
circuit.z(qubit)      # Pauli-Z
circuit.rx(qubit, angle)  # Rotation-X
circuit.ry(qubit, angle)  # Rotation-Y
circuit.rz(qubit, angle)  # Rotation-Z

# Two-Qubit Gates
circuit.cnot(control, target)  # CNOT
circuit.cz(control, target)    # Controlled-Z
circuit.swap(qubit1, qubit2)   # SWAP

# Advanced Operations
circuit.measure(qubit)         # Measure specific qubit
circuit.reset(qubit)          # Reset qubit to |0⟩
circuit.barrier()             # Barrier for visualization`,
    
    algorithms: `# Pre-built Algorithm Examples
from qosim.algorithms import BellState, Grover, QFT, Shor

# Bell State
bell_state = BellState()
bell_result = bell_state.simulate()

# Grover's Search
grover = Grover(2, [3])  # 2 qubits, search for |11⟩
grover_result = grover.simulate()

# Quantum Fourier Transform
qft = QFT(3)
qft_result = qft.simulate()

# Shor's Algorithm
shor = Shor(15)  # Factor 15
shor_result = shor.simulate()`
  };

  const currentDocs = selectedLanguage === 'javascript' ? jsDocumentation : pythonDocumentation;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2">
        <Card className="quantum-panel neon-border h-full">
          <CardHeader>
            <CardTitle className="text-quantum-glow flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {selectedLanguage === 'javascript' ? 'JavaScript' : 'Python'} SDK Documentation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="quickstart" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
                <TabsTrigger value="api">API Reference</TabsTrigger>
                <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
              </TabsList>
              
              <TabsContent value="quickstart" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-quantum-glow mb-2">
                      Getting Started
                    </h3>
                    <p className="text-quantum-particle mb-4">
                      The QOSim SDK provides a comprehensive interface for quantum circuit simulation 
                      and algorithm development. Follow this guide to get started quickly.
                    </p>
                  </div>
                  
                  <div className="bg-quantum-matrix p-4 rounded-lg">
                    <h4 className="text-quantum-neon font-medium mb-2">Installation</h4>
                    <pre className="text-quantum-glow text-sm">
                      {selectedLanguage === 'javascript' 
                        ? 'npm install @qosim/sdk'
                        : 'pip install qosim-sdk'
                      }
                    </pre>
                  </div>
                  
                  <div className="bg-quantum-matrix p-4 rounded-lg">
                    <h4 className="text-quantum-neon font-medium mb-2">Basic Example</h4>
                    <pre className="text-quantum-glow text-sm whitespace-pre-wrap">
                      {currentDocs.quickStart}
                    </pre>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="api" className="space-y-4">
                <ScrollArea className="h-96">
                  <div className="bg-quantum-matrix p-4 rounded-lg">
                    <pre className="text-quantum-glow text-sm whitespace-pre-wrap">
                      {currentDocs.api}
                    </pre>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="algorithms" className="space-y-4">
                <ScrollArea className="h-96">
                  <div className="bg-quantum-matrix p-4 rounded-lg">
                    <pre className="text-quantum-glow text-sm whitespace-pre-wrap">
                      {currentDocs.algorithms}
                    </pre>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-glow text-lg">Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-quantum-neon" />
              <span className="text-sm text-quantum-particle">Real-time simulation</span>
            </div>
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-quantum-neon" />
              <span className="text-sm text-quantum-particle">Syntax highlighting</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-quantum-neon" />
              <span className="text-sm text-quantum-particle">OpenQASM export</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-quantum-neon" />
              <span className="text-sm text-quantum-particle">Comprehensive docs</span>
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-quantum-glow text-lg">Supported Algorithms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="outline" className="w-full justify-start">
              Bell State Generator
            </Badge>
            <Badge variant="outline" className="w-full justify-start">
              Grover's Search
            </Badge>
            <Badge variant="outline" className="w-full justify-start">
              Quantum Fourier Transform
            </Badge>
            <Badge variant="outline" className="w-full justify-start">
              Shor's Algorithm
            </Badge>
            <Badge variant="outline" className="w-full justify-start">
              Quantum Phase Estimation
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
