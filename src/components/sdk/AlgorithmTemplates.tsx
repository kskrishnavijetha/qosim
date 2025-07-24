
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen, Download, Copy, Play } from 'lucide-react';

interface AlgorithmTemplate {
  id: string;
  name: string;
  description: string;
  category: 'basic' | 'intermediate' | 'advanced';
  gates: Array<{
    type: string;
    qubit: number;
    controlQubit?: number;
    angle?: number;
  }>;
  code: {
    javascript: string;
    python: string;
  };
  qasm: string;
}

const templates: AlgorithmTemplate[] = [
  {
    id: 'bell-state',
    name: 'Bell State Generator',
    description: 'Creates a maximally entangled Bell state',
    category: 'basic',
    gates: [
      { type: 'H', qubit: 0 },
      { type: 'CNOT', qubit: 1, controlQubit: 0 }
    ],
    code: {
      javascript: `const circuit = new QOSim.Circuit(2);
circuit.h(0);
circuit.cnot(0, 1);
const result = await circuit.simulate();`,
      python: `circuit = Circuit(2)
circuit.h(0)
circuit.cnot(0, 1)
result = circuit.simulate()`
    },
    qasm: `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q -> c;`
  },
  {
    id: 'grover-2qubit',
    name: 'Grover 2-Qubit Search',
    description: 'Searches for |11⟩ state in 2-qubit space',
    category: 'intermediate',
    gates: [
      { type: 'H', qubit: 0 },
      { type: 'H', qubit: 1 },
      { type: 'CZ', qubit: 1, controlQubit: 0 },
      { type: 'H', qubit: 0 },
      { type: 'H', qubit: 1 },
      { type: 'X', qubit: 0 },
      { type: 'X', qubit: 1 },
      { type: 'CZ', qubit: 1, controlQubit: 0 },
      { type: 'X', qubit: 0 },
      { type: 'X', qubit: 1 },
      { type: 'H', qubit: 0 },
      { type: 'H', qubit: 1 }
    ],
    code: {
      javascript: `const circuit = new QOSim.Circuit(2);
// Initialize superposition
circuit.h([0, 1]);
// Oracle
circuit.cz(0, 1);
// Diffusion
circuit.h([0, 1]);
circuit.x([0, 1]);
circuit.cz(0, 1);
circuit.x([0, 1]);
circuit.h([0, 1]);`,
      python: `circuit = Circuit(2)
# Initialize superposition
circuit.h([0, 1])
# Oracle
circuit.cz(0, 1)
# Diffusion
circuit.h([0, 1])
circuit.x([0, 1])
circuit.cz(0, 1)
circuit.x([0, 1])
circuit.h([0, 1])`
    },
    qasm: `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
h q[1];
cz q[0],q[1];
h q[0];
h q[1];
x q[0];
x q[1];
cz q[0],q[1];
x q[0];
x q[1];
h q[0];
h q[1];
measure q -> c;`
  },
  {
    id: 'qft-3qubit',
    name: 'Quantum Fourier Transform (3-Qubit)',
    description: 'Applies QFT to 3-qubit system',
    category: 'advanced',
    gates: [
      { type: 'H', qubit: 0 },
      { type: 'RZ', qubit: 1, angle: Math.PI/2 },
      { type: 'RZ', qubit: 2, angle: Math.PI/4 },
      { type: 'H', qubit: 1 },
      { type: 'RZ', qubit: 2, angle: Math.PI/2 },
      { type: 'H', qubit: 2 },
      { type: 'SWAP', qubit: 0, controlQubit: 2 }
    ],
    code: {
      javascript: `const circuit = new QOSim.Circuit(3);
circuit.h(0);
circuit.cp(0, 1, Math.PI/2);
circuit.cp(0, 2, Math.PI/4);
circuit.h(1);
circuit.cp(1, 2, Math.PI/2);
circuit.h(2);
circuit.swap(0, 2);`,
      python: `circuit = Circuit(3)
circuit.h(0)
circuit.cp(0, 1, np.pi/2)
circuit.cp(0, 2, np.pi/4)
circuit.h(1)
circuit.cp(1, 2, np.pi/2)
circuit.h(2)
circuit.swap(0, 2)`
    },
    qasm: `OPENQASM 2.0;
include "qelib1.inc";
qreg q[3];
creg c[3];
h q[0];
cp(pi/2) q[0],q[1];
cp(pi/4) q[0],q[2];
h q[1];
cp(pi/2) q[1],q[2];
h q[2];
swap q[0],q[2];
measure q -> c;`
  }
];

interface AlgorithmTemplatesProps {
  selectedLanguage: 'javascript' | 'python';
  onTemplateSelect: (template: AlgorithmTemplate) => void;
  currentCircuit: any[];
}

export function AlgorithmTemplates({ 
  selectedLanguage, 
  onTemplateSelect, 
  currentCircuit 
}: AlgorithmTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<AlgorithmTemplate | null>(null);
  const [activeCategory, setActiveCategory] = useState<'basic' | 'intermediate' | 'advanced'>('basic');

  const handleTemplateSelect = (template: AlgorithmTemplate) => {
    setSelectedTemplate(template);
    onTemplateSelect(template);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const downloadTemplate = (template: AlgorithmTemplate) => {
    const code = template.code[selectedLanguage];
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.id}.${selectedLanguage === 'javascript' ? 'js' : 'py'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basic': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-quantum-neon';
    }
  };

  const filteredTemplates = templates.filter(t => t.category === activeCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <div className="lg:col-span-2">
        <Card className="quantum-panel neon-border h-full">
          <CardHeader>
            <CardTitle className="text-quantum-glow flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Algorithm Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic</TabsTrigger>
                <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeCategory} className="space-y-4">
                <ScrollArea className="h-96">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTemplates.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-all hover:neon-border ${
                          selectedTemplate?.id === template.id ? 'ring-2 ring-quantum-neon' : ''
                        }`}
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-quantum-glow">{template.name}</CardTitle>
                          <Badge variant="outline" className={getCategoryColor(template.category)}>
                            {template.category}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-quantum-particle mb-3">
                            {template.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTemplateSelect(template);
                              }}
                              size="sm"
                              className="neon-border"
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Load
                            </Button>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyCode(template.code[selectedLanguage]);
                              }}
                              variant="outline"
                              size="sm"
                              className="neon-border"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div>
        {selectedTemplate && (
          <Card className="quantum-panel neon-border h-full">
            <CardHeader>
              <CardTitle className="text-quantum-glow text-lg">Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-quantum-neon">{selectedTemplate.name}</h3>
                <p className="text-sm text-quantum-particle">{selectedTemplate.description}</p>
                <Badge variant="outline" className={getCategoryColor(selectedTemplate.category)}>
                  {selectedTemplate.category}
                </Badge>
              </div>

              <div>
                <h4 className="font-medium text-quantum-glow">Gates ({selectedTemplate.gates.length})</h4>
                <div className="space-y-1 mt-2">
                  {selectedTemplate.gates.map((gate, index) => (
                    <div key={index} className="text-sm text-quantum-particle">
                      {gate.type} {gate.controlQubit !== undefined && `${gate.controlQubit}→`}{gate.qubit}
                      {gate.angle && ` (${gate.angle.toFixed(2)})`}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-quantum-glow">Code</h4>
                <pre className="bg-quantum-matrix text-quantum-glow text-xs p-3 rounded-md mt-2 overflow-x-auto">
                  {selectedTemplate.code[selectedLanguage]}
                </pre>
              </div>

              <div>
                <h4 className="font-medium text-quantum-glow">OpenQASM</h4>
                <pre className="bg-quantum-matrix text-quantum-glow text-xs p-3 rounded-md mt-2 overflow-x-auto">
                  {selectedTemplate.qasm}
                </pre>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => copyCode(selectedTemplate.code[selectedLanguage])}
                  variant="outline"
                  size="sm"
                  className="neon-border"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy Code
                </Button>
                <Button
                  onClick={() => downloadTemplate(selectedTemplate)}
                  variant="outline"
                  size="sm"
                  className="neon-border"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
