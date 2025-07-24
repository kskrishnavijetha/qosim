
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BookOpen, Search, ExternalLink, Copy, Code2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface DocumentationItem {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  codeExample: {
    javascript?: string;
    python?: string;
  };
  tags: string[];
}

const DOCUMENTATION: DocumentationItem[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with QOSim SDK',
    category: 'Basics',
    description: 'Quick start guide for building quantum algorithms',
    content: `# Getting Started

The QOSim SDK provides a simple interface for creating and simulating quantum circuits. Whether you're using JavaScript or Python, the API follows similar patterns.

## Installation

### JavaScript
\`\`\`bash
npm install qosim-sdk
\`\`\`

### Python
\`\`\`bash
pip install qosim-sdk
\`\`\`

## Basic Concepts

1. **Circuits**: Container for quantum operations
2. **Gates**: Quantum operations (H, X, CNOT, etc.)
3. **Qubits**: Quantum bits (0-indexed)
4. **Simulation**: Execute circuits and get results

## Your First Circuit

Start with a simple Bell state to understand the basics.`,
    codeExample: {
      javascript: `import { QOSimSDK } from 'qosim-sdk';

const qosim = new QOSimSDK();
const circuit = qosim.createCircuit(2);

circuit.h(0);        // Hadamard gate
circuit.cnot(0, 1);  // CNOT gate

const result = await circuit.simulate();
console.log(result.probabilities);`,
      python: `from qosim import QOSimSDK

qosim = QOSimSDK()
circuit = qosim.create_circuit(2)

circuit.h(0)        # Hadamard gate
circuit.cnot(0, 1)  # CNOT gate

result = circuit.simulate()
print(result.probabilities)`
    },
    tags: ['basics', 'tutorial', 'installation']
  },
  {
    id: 'quantum-gates',
    title: 'Quantum Gates Reference',
    category: 'API Reference',
    description: 'Complete reference for all available quantum gates',
    content: `# Quantum Gates

QOSim SDK supports all standard quantum gates plus advanced operations.

## Single-Qubit Gates

- **H (Hadamard)**: Creates superposition
- **X (Pauli-X)**: Bit flip operation
- **Y (Pauli-Y)**: Bit and phase flip
- **Z (Pauli-Z)**: Phase flip
- **S**: Phase gate (π/2 rotation)
- **T**: T gate (π/4 rotation)
- **RX/RY/RZ**: Parameterized rotation gates

## Two-Qubit Gates

- **CNOT**: Controlled-NOT gate
- **CZ**: Controlled-Z gate
- **SWAP**: Swap two qubits
- **CRX/CRY/CRZ**: Controlled rotation gates

## Multi-Qubit Gates

- **Toffoli**: Controlled-controlled-NOT
- **Fredkin**: Controlled-SWAP`,
    codeExample: {
      javascript: `// Single-qubit gates
circuit.h(0);           // Hadamard
circuit.x(1);           // Pauli-X
circuit.ry(Math.PI/4, 2); // RY rotation

// Two-qubit gates
circuit.cnot(0, 1);     // CNOT
circuit.cz(1, 2);       // Controlled-Z

// Multi-qubit gates
circuit.toffoli(0, 1, 2); // Toffoli`,
      python: `# Single-qubit gates
circuit.h(0)           # Hadamard
circuit.x(1)           # Pauli-X
circuit.ry(math.pi/4, 2) # RY rotation

# Two-qubit gates
circuit.cnot(0, 1)     # CNOT
circuit.cz(1, 2)       # Controlled-Z

# Multi-qubit gates
circuit.toffoli(0, 1, 2) # Toffoli`
    },
    tags: ['gates', 'reference', 'api']
  },
  {
    id: 'advanced-algorithms',
    title: 'Advanced Quantum Algorithms',
    category: 'Algorithms',
    description: 'Implementation guides for complex quantum algorithms',
    content: `# Advanced Algorithms

Learn how to implement sophisticated quantum algorithms with QOSim SDK.

## Variational Quantum Eigensolver (VQE)

VQE is a hybrid classical-quantum algorithm for finding ground state energies.

### Key Components:
1. Parameterized quantum circuit (ansatz)
2. Classical optimizer
3. Expectation value measurement

## Quantum Approximate Optimization Algorithm (QAOA)

QAOA solves combinatorial optimization problems.

### Algorithm Steps:
1. Initialize with uniform superposition
2. Apply cost and mixer Hamiltonians
3. Optimize parameters classically
4. Measure and extract solution`,
    codeExample: {
      javascript: `// VQE Implementation
class VQE {
  constructor(hamiltonian, ansatz) {
    this.hamiltonian = hamiltonian;
    this.ansatz = ansatz;
  }
  
  async optimize(initialParams) {
    let params = initialParams;
    for (let i = 0; i < 100; i++) {
      const energy = await this.computeEnergy(params);
      params = this.updateParams(params, energy);
    }
    return params;
  }
}`,
      python: `# VQE Implementation
class VQE:
    def __init__(self, hamiltonian, ansatz):
        self.hamiltonian = hamiltonian
        self.ansatz = ansatz
    
    def optimize(self, initial_params):
        params = initial_params
        for i in range(100):
            energy = self.compute_energy(params)
            params = self.update_params(params, energy)
        return params`
    },
    tags: ['vqe', 'qaoa', 'advanced', 'optimization']
  }
];

interface DocumentationCenterProps {
  selectedLanguage: 'javascript' | 'python';
}

export function DocumentationCenter({ selectedLanguage }: DocumentationCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState<DocumentationItem | null>(null);
  const { toast } = useToast();

  const categories = ['all', ...Array.from(new Set(DOCUMENTATION.map(doc => doc.category)))];

  const filteredDocs = DOCUMENTATION.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Example code copied to clipboard",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Documentation Index */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Documentation</CardTitle>
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-quantum-particle" />
              <Input
                placeholder="Search docs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 quantum-panel neon-border"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 quantum-panel neon-border text-quantum-neon bg-quantum-void rounded"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {filteredDocs.map(doc => (
            <div
              key={doc.id}
              className={`p-3 rounded cursor-pointer transition-all border ${
                selectedDoc?.id === doc.id 
                  ? 'border-quantum-glow bg-quantum-matrix' 
                  : 'border-quantum-particle hover:border-quantum-neon'
              }`}
              onClick={() => setSelectedDoc(doc)}
            >
              <h3 className="font-semibold text-quantum-glow text-sm">{doc.title}</h3>
              <p className="text-xs text-quantum-particle mt-1">{doc.description}</p>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline" className="text-xs">{doc.category}</Badge>
                <div className="flex gap-1">
                  {doc.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Documentation Content */}
      <div className="lg:col-span-2">
        {selectedDoc ? (
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-quantum-glow">{selectedDoc.title}</CardTitle>
                  <p className="text-quantum-particle mt-1">{selectedDoc.description}</p>
                </div>
                <Button variant="outline" size="sm" className="neon-border">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Badge>{selectedDoc.category}</Badge>
                {selectedDoc.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="space-y-4">
                <TabsList className="quantum-tabs">
                  <TabsTrigger value="content">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="examples">
                    <Code2 className="w-4 h-4 mr-2" />
                    Code Examples
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="content">
                  <div className="quantum-panel neon-border p-6 h-[500px] overflow-auto">
                    <pre className="whitespace-pre-wrap text-quantum-neon text-sm font-mono">
                      {selectedDoc.content}
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="examples">
                  <div className="space-y-4">
                    {selectedDoc.codeExample[selectedLanguage] && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-quantum-glow font-semibold">
                            {selectedLanguage === 'javascript' ? 'JavaScript' : 'Python'} Example
                          </h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyCode(selectedDoc.codeExample[selectedLanguage]!)}
                            className="neon-border"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                        </div>
                        <div className="quantum-panel neon-border p-4 h-[400px] overflow-auto">
                          <pre className="text-quantum-neon text-sm font-mono">
                            {selectedDoc.codeExample[selectedLanguage]}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ) : (
          <Card className="quantum-panel neon-border">
            <CardContent className="text-center py-12">
              <BookOpen className="w-12 h-12 text-quantum-particle mx-auto mb-4" />
              <h3 className="text-xl text-quantum-glow mb-2">Select Documentation</h3>
              <p className="text-quantum-particle">
                Choose a topic from the left panel to view detailed documentation and examples.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
