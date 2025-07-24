
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Save, Download, Copy, FileText, Zap } from 'lucide-react';

interface SDKCodeEditorProps {
  language: 'javascript' | 'python';
  onRunCode: (code: string) => void;
  isRunning: boolean;
}

const codeTemplates = {
  javascript: {
    basic: `// Basic QOSim Circuit
import { QOSim } from '@qosim/sdk';

const circuit = new QOSim.Circuit(2);
circuit.h(0);
circuit.cnot(0, 1);

const result = await circuit.simulate();
console.log(result);`,
    bell: `// Bell State Generator
import { QOSim } from '@qosim/sdk';

const bellState = new QOSim.Circuit(2);
bellState.h(0);
bellState.cnot(0, 1);

const result = await bellState.simulate();
console.log('Bell State Probabilities:', result.probabilities);`,
    grover: `// Grover's Search Algorithm
import { QOSim } from '@qosim/sdk';

const grover = new QOSim.Circuit(2);
// Initialize superposition
grover.h([0, 1]);
// Oracle (marks |11> state)
grover.cz(0, 1);
// Diffusion operator
grover.h([0, 1]);
grover.x([0, 1]);
grover.cz(0, 1);
grover.x([0, 1]);
grover.h([0, 1]);

const result = await grover.simulate();
console.log('Search Results:', result);`
  },
  python: {
    basic: `# Basic QOSim Circuit
from qosim import Circuit

circuit = Circuit(2)
circuit.h(0)
circuit.cnot(0, 1)

result = circuit.simulate()
print(result)`,
    bell: `# Bell State Generator
from qosim import Circuit

bell_state = Circuit(2)
bell_state.h(0)
bell_state.cnot(0, 1)

result = bell_state.simulate()
print(f"Bell State Probabilities: {result.probabilities}")`,
    grover: `# Grover's Search Algorithm
from qosim import Circuit

grover = Circuit(2)
# Initialize superposition
grover.h([0, 1])
# Oracle (marks |11> state)
grover.cz(0, 1)
# Diffusion operator
grover.h([0, 1])
grover.x([0, 1])
grover.cz(0, 1)
grover.x([0, 1])
grover.h([0, 1])

result = grover.simulate()
print(f"Search Results: {result}")`,
    qft: `# Quantum Fourier Transform
from qosim import Circuit
import numpy as np

qft = Circuit(3)
# Apply QFT
qft.h(0)
qft.cp(0, 1, np.pi/2)
qft.cp(0, 2, np.pi/4)
qft.h(1)
qft.cp(1, 2, np.pi/2)
qft.h(2)

result = qft.simulate()
print(f"QFT Result: {result}")`
  }
};

export function SDKCodeEditor({ language, onRunCode, isRunning }: SDKCodeEditorProps) {
  const [code, setCode] = useState(codeTemplates[language].basic);
  const [selectedTemplate, setSelectedTemplate] = useState('basic');

  useEffect(() => {
    setCode(codeTemplates[language][selectedTemplate as keyof typeof codeTemplates[typeof language]]);
  }, [language, selectedTemplate]);

  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    setCode(codeTemplates[language][template as keyof typeof codeTemplates[typeof language]]);
  };

  const handleRunCode = () => {
    onRunCode(code);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qosim-algorithm.${language === 'javascript' ? 'js' : 'py'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="quantum-panel neon-border h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {language === 'javascript' ? 'JavaScript' : 'Python'} Code Editor
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="neon-border">
              {language.toUpperCase()}
            </Badge>
            <Badge variant="secondary">
              Syntax Highlighting
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
              <SelectTrigger className="quantum-panel neon-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="quantum-panel neon-border">
                <SelectItem value="basic">Basic Circuit</SelectItem>
                <SelectItem value="bell">Bell State</SelectItem>
                <SelectItem value="grover">Grover's Search</SelectItem>
                {language === 'python' && <SelectItem value="qft">Quantum FFT</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              className="neon-border"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
            <Button
              onClick={handleCopyCode}
              variant="outline"
              size="sm"
              className="neon-border"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleDownloadCode}
              variant="outline"
              size="sm"
              className="neon-border"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm bg-quantum-matrix text-quantum-glow border-quantum-neon/20 min-h-[400px] resize-none"
            placeholder={`Write your ${language} quantum algorithm here...`}
          />
          <div className="absolute top-2 right-2">
            <Badge variant="outline" className="text-xs">
              Lines: {code.split('\n').length}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-quantum-particle">
          <div className="flex items-center gap-4">
            <span>• Syntax highlighting enabled</span>
            <span>• Auto-completion available</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span>QOSim SDK v2.0</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
