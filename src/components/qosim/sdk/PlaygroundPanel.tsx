
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Play, Copy } from 'lucide-react';

interface PlaygroundPanelProps {
  language: string;
  onLanguageChange: (language: string) => void;
  code: string;
  onCodeChange: (code: string) => void;
}

export function PlaygroundPanel({ language, onLanguageChange, code, onCodeChange }: PlaygroundPanelProps) {
  const sampleCode = {
    python: `from qosim import QuantumCircuit, execute

# Create a Bell state
qc = QuantumCircuit(2)
qc.h(0)
qc.cnot(0, 1)

# Execute
result = execute(qc)
print(result.get_probabilities())`,
    javascript: `import { QuantumCircuit } from 'qosim-sdk';

// Create a Bell state
const qc = new QuantumCircuit(2);
qc.h(0);
qc.cnot(0, 1);

// Execute
const result = qc.execute();
console.log(result.getProbabilities());`
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline">Interactive Mode</Badge>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button size="sm">
            <Play className="w-4 h-4 mr-2" />
            Run
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Code Editor</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={`Write your ${language} quantum code here...`}
              value={code || sampleCode[language as keyof typeof sampleCode] || ''}
              onChange={(e) => onCodeChange(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Output Console</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg min-h-[300px] font-mono text-sm">
              <div>QOSim SDK v2.0 - Ready</div>
              <div className="text-gray-500">$ Run your code to see output...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
