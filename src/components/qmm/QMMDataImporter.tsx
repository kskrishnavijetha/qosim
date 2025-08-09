
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ImportedData {
  format: 'qiskit' | 'cirq' | 'braket' | 'json';
  qubits: number;
  timesteps: number;
  hasNoiseData: boolean;
  hasFidelityData: boolean;
}

interface QMMDataImporterProps {
  onDataImported: (data: any) => void;
}

export function QMMDataImporter({ onDataImported }: QMMDataImporterProps) {
  const [importedData, setImportedData] = useState<ImportedData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileImport = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      let parsedData;
      let format: ImportedData['format'] = 'json';

      // Determine format and parse
      if (file.name.endsWith('.json')) {
        parsedData = JSON.parse(text);
        format = 'json';
      } else if (file.name.endsWith('.py') || text.includes('from qiskit')) {
        format = 'qiskit';
        parsedData = parseQiskitData(text);
      } else if (text.includes('import cirq')) {
        format = 'cirq';
        parsedData = parseCirqData(text);
      } else if (text.includes('from braket')) {
        format = 'braket';
        parsedData = parseBraketData(text);
      } else {
        throw new Error('Unsupported file format');
      }

      // Extract metadata
      const metadata: ImportedData = {
        format,
        qubits: parsedData.qubits?.length || 5,
        timesteps: parsedData.timesteps?.length || 100,
        hasNoiseData: !!parsedData.noiseData,
        hasFidelityData: !!parsedData.fidelityData
      };

      setImportedData(metadata);
      onDataImported(parsedData);
      
      toast.success(`Successfully imported ${format.toUpperCase()} data`);
      
    } catch (error) {
      console.error('Import error:', error);
      toast.error(`Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Mock parsers - in real implementation, these would handle actual quantum framework data
  const parseQiskitData = (text: string) => {
    return {
      qubits: Array.from({ length: 5 }, (_, i) => ({ id: i, states: [] })),
      timesteps: Array.from({ length: 50 }, (_, i) => i * 0.1),
      noiseData: true,
      fidelityData: true
    };
  };

  const parseCirqData = (text: string) => {
    return {
      qubits: Array.from({ length: 4 }, (_, i) => ({ id: i, states: [] })),
      timesteps: Array.from({ length: 40 }, (_, i) => i * 0.1),
      noiseData: false,
      fidelityData: true
    };
  };

  const parseBraketData = (text: string) => {
    return {
      qubits: Array.from({ length: 6 }, (_, i) => ({ id: i, states: [] })),
      timesteps: Array.from({ length: 60 }, (_, i) => i * 0.1),
      noiseData: true,
      fidelityData: false
    };
  };

  const generateSampleData = (format: 'qiskit' | 'cirq' | 'braket') => {
    const sampleData = {
      qiskit: () => parseQiskitData('from qiskit import *'),
      cirq: () => parseCirqData('import cirq'),
      braket: () => parseBraketData('from braket import *')
    };

    const data = sampleData[format]();
    const metadata: ImportedData = {
      format,
      qubits: data.qubits.length,
      timesteps: data.timesteps.length,
      hasNoiseData: data.noiseData,
      hasFidelityData: data.fidelityData
    };

    setImportedData(metadata);
    onDataImported(data);
    toast.success(`Loaded ${format.toUpperCase()} sample data`);
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow">Data Import & Export</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload */}
        <div className="relative">
          <Button
            variant="outline"
            className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10 w-full"
            disabled={isProcessing}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isProcessing ? 'Processing...' : 'Import Quantum Data'}
          </Button>
          <input
            type="file"
            accept=".json,.py,.qasm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileImport(file);
            }}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isProcessing}
          />
        </div>

        {/* Sample Data */}
        <div>
          <h4 className="text-sm font-medium text-quantum-glow mb-2">Load Sample Data</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateSampleData('qiskit')}
              className="border-quantum-neon/30 text-quantum-neon hover:bg-quantum-neon/10"
            >
              Qiskit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateSampleData('cirq')}
              className="border-quantum-neon/30 text-quantum-plasma hover:bg-quantum-plasma/10"
            >
              Cirq
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateSampleData('braket')}
              className="border-quantum-neon/30 text-quantum-particle hover:bg-quantum-particle/10"
            >
              Braket
            </Button>
          </div>
        </div>

        {/* Import Status */}
        {importedData && (
          <div className="quantum-panel neon-border rounded p-3">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-quantum-glow">Data Imported Successfully</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-quantum-particle">Format:</span>
                <Badge variant="outline" className="text-quantum-glow">
                  {importedData.format.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-quantum-particle">Qubits:</span>
                <Badge variant="outline" className="text-quantum-neon">
                  {importedData.qubits}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-quantum-particle">Timesteps:</span>
                <Badge variant="outline" className="text-quantum-plasma">
                  {importedData.timesteps}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-quantum-particle">Noise Data:</span>
                <Badge variant="outline" className={importedData.hasNoiseData ? "text-green-400" : "text-red-400"}>
                  {importedData.hasNoiseData ? 'Yes' : 'No'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-quantum-particle">Fidelity Data:</span>
                <Badge variant="outline" className={importedData.hasFidelityData ? "text-green-400" : "text-red-400"}>
                  {importedData.hasFidelityData ? 'Yes' : 'No'}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Supported Formats */}
        <div className="quantum-panel neon-border rounded p-3">
          <h5 className="text-sm font-medium text-quantum-glow mb-2">Supported Formats</h5>
          <div className="space-y-1 text-xs text-quantum-particle">
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3" />
              <span>JSON - QMM native format</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3" />
              <span>Python - Qiskit, Cirq, Braket scripts</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3" />
              <span>QASM - OpenQASM circuit files</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
