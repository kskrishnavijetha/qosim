
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface InteractivePlaygroundProps {
  language: 'python' | 'javascript';
  onCodeGenerated: (code: string) => void;
}

export function InteractivePlayground({ language, onCodeGenerated }: InteractivePlaygroundProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  const templates = {
    python: {
      'bell-state': `# Create Bell State
from qosim import QuantumCircuit

qc = QuantumCircuit(2)
qc.h(0)  # Hadamard on qubit 0
qc.cnot(0, 1)  # CNOT gate
result = qc.simulate()
print(result.get_counts())`,
      'superposition': `# Create Superposition
from qosim import QuantumCircuit

qc = QuantumCircuit(1)
qc.h(0)  # Put qubit in superposition
result = qc.simulate()
print(result.get_counts())`,
      'grover-2bit': `# Grover's Algorithm (2 qubits)
from qosim import QuantumCircuit
import numpy as np

qc = QuantumCircuit(2)
# Initialize superposition
qc.h(0)
qc.h(1)
# Oracle for |11⟩
qc.cz(0, 1)
# Diffusion operator
qc.h(0)
qc.h(1)
qc.z(0)
qc.z(1)
qc.cz(0, 1)
qc.z(0)
qc.z(1)
qc.h(0)
qc.h(1)

result = qc.simulate()
print(result.get_counts())`
    },
    javascript: {
      'bell-state': `// Create Bell State
const qc = new QuantumCircuit(2);
qc.h(0);  // Hadamard on qubit 0
qc.cnot(0, 1);  // CNOT gate
const result = qc.simulate();
console.log(result.getCounts());`,
      'superposition': `// Create Superposition  
const qc = new QuantumCircuit(1);
qc.h(0);  // Put qubit in superposition
const result = qc.simulate();
console.log(result.getCounts());`,
      'grover-2bit': `// Grover's Algorithm (2 qubits)
const qc = new QuantumCircuit(2);
// Initialize superposition
qc.h(0);
qc.h(1);
// Oracle for |11⟩
qc.cz(0, 1);
// Diffusion operator
qc.h(0);
qc.h(1);
qc.z(0);
qc.z(1);
qc.cz(0, 1);
qc.z(0);
qc.z(1);
qc.h(0);
qc.h(1);

const result = qc.simulate();
console.log(result.getCounts());`
    }
  };

  const handleLoadTemplate = () => {
    if (!selectedTemplate) return;
    
    const code = templates[language][selectedTemplate as keyof typeof templates[typeof language]];
    onCodeGenerated(code);
    toast.success(`Loaded ${selectedTemplate} template`);
  };

  const handleGenerateRandom = () => {
    const randomCircuit = language === 'python' ? 
      `# Random Quantum Circuit
from qosim import QuantumCircuit
import random

qc = QuantumCircuit(3)
gates = ['h', 'x', 'y', 'z']
for _ in range(5):
    gate = random.choice(gates)
    qubit = random.randint(0, 2)
    getattr(qc, gate)(qubit)
    
result = qc.simulate()
print(result.get_counts())` :
      `// Random Quantum Circuit
const qc = new QuantumCircuit(3);
const gates = ['h', 'x', 'y', 'z'];
for (let i = 0; i < 5; i++) {
    const gate = gates[Math.floor(Math.random() * gates.length)];
    const qubit = Math.floor(Math.random() * 3);
    qc[gate](qubit);
}

const result = qc.simulate();
console.log(result.getCounts());`;

    onCodeGenerated(randomCircuit);
    toast.success('Generated random circuit');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center">
            <Play className="w-5 h-5 mr-2" />
            Interactive Playground
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Code Templates</label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="bg-black/50 border-white/10">
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                <SelectItem value="bell-state">Bell State</SelectItem>
                <SelectItem value="superposition">Single Qubit Superposition</SelectItem>
                <SelectItem value="grover-2bit">Grover's Algorithm (2-bit)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleLoadTemplate}
              disabled={!selectedTemplate}
              className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
            >
              Load Template
            </Button>
            <Button
              onClick={handleGenerateRandom}
              variant="outline"
              className="text-purple-400 border-purple-400/30"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Random
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
