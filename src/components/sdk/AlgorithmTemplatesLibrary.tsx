import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Gate } from '@/hooks/useCircuitWorkspace';

interface AlgorithmTemplate {
  id: string;
  name: string;
  description: string;
  gates: Gate[];
}

const algorithmTemplates: AlgorithmTemplate[] = [
  {
    id: 'teleportation',
    name: 'Quantum Teleportation',
    description: 'Teleport a qubit state from one location to another.',
    gates: [
      { id: 'h1', type: 'H', qubit: 0, position: 0 },
      { id: 'cnot1', type: 'CNOT', qubits: [0, 1], position: 1 },
      { id: 'x1', type: 'X', qubit: 0, position: 2 },
      { id: 'z1', type: 'Z', qubit: 1, position: 3 },
    ],
  },
  {
    id: 'superdense-coding',
    name: 'Superdense Coding',
    description: 'Send two classical bits of information using one qubit.',
    gates: [
      { id: 'h2', type: 'H', qubit: 0, position: 0 },
      { id: 'cnot2', type: 'CNOT', qubits: [0, 1], position: 1 },
      { id: 'x2', type: 'X', qubit: 0, position: 2 },
      { id: 'z2', type: 'Z', qubit: 1, position: 3 },
    ],
  },
  {
    id: 'deutsch-jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    description: 'Determine if a function is constant or balanced.',
    gates: [
      { id: 'h3', type: 'H', qubit: 0, position: 0 },
      { id: 'h4', type: 'H', qubit: 1, position: 1 },
      { id: 'x3', type: 'X', qubit: 1, position: 2 },
      { id: 'cnot3', type: 'CNOT', qubits: [0, 1], position: 3 },
      { id: 'h5', type: 'H', qubit: 0, position: 4 },
      { id: 'h6', type: 'H', qubit: 1, position: 5 },
    ],
  },
];

interface AlgorithmTemplatesLibraryProps {
  onTemplateSelect: (template: AlgorithmTemplate) => void;
}

export function AlgorithmTemplatesLibrary({ onTemplateSelect }: AlgorithmTemplatesLibraryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | undefined>(undefined);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleLoadTemplate = () => {
    const template = algorithmTemplates.find((t) => t.id === selectedTemplate);
    if (template) {
      onTemplateSelect(template);
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm text-quantum-neon">Algorithm Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <Select onValueChange={handleTemplateChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an algorithm..." />
          </SelectTrigger>
          <SelectContent>
            {algorithmTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedTemplate && (
          <div className="mt-4">
            <Button variant="outline" className="w-full neon-border" onClick={handleLoadTemplate}>
              Load Template
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
