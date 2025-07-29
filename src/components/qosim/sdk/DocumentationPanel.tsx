
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type QuantumAlgorithm } from '@/types/qosim';
import { FileText, Code2, BookOpen } from 'lucide-react';

interface DocumentationPanelProps {
  language: 'python' | 'javascript';
  selectedAlgorithm: QuantumAlgorithm | null;
}

export function DocumentationPanel({ language, selectedAlgorithm }: DocumentationPanelProps) {
  const apiDocs = {
    python: [
      { name: 'QuantumCircuit', description: 'Main circuit class for building quantum circuits' },
      { name: 'qc.h(qubit)', description: 'Apply Hadamard gate to specified qubit' },
      { name: 'qc.cnot(control, target)', description: 'Apply CNOT gate between control and target' },
      { name: 'qc.simulate()', description: 'Run simulation and return results' },
    ],
    javascript: [
      { name: 'QuantumCircuit', description: 'Main circuit class for building quantum circuits' },
      { name: 'qc.h(qubit)', description: 'Apply Hadamard gate to specified qubit' },
      { name: 'qc.cnot(control, target)', description: 'Apply CNOT gate between control and target' },
      { name: 'qc.simulate()', description: 'Run simulation and return results' },
    ]
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            QOSim SDK Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-yellow-400">
                {language} API
              </Badge>
              <Badge variant="outline" className="text-slate-400">
                v2.0.0
              </Badge>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-yellow-400 flex items-center">
                <Code2 className="w-4 h-4 mr-2" />
                API Reference
              </h4>
              
              {apiDocs[language].map((doc, index) => (
                <div key={index} className="bg-black/50 rounded-lg p-3 border border-yellow-400/20">
                  <code className="text-yellow-400 text-sm font-mono">{doc.name}</code>
                  <p className="text-slate-300 text-sm mt-1">{doc.description}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedAlgorithm && (
        <Card className="bg-black/30 border-white/10">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              {selectedAlgorithm.name} Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-slate-300 text-sm">{selectedAlgorithm.description}</p>
              <div className="bg-black/50 rounded-lg p-3 border border-yellow-400/20">
                <h5 className="text-sm font-semibold text-yellow-400 mb-2">Usage Example</h5>
                <pre className="text-xs text-slate-300 font-mono overflow-x-auto">
                  {selectedAlgorithm.implementation[language]}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
