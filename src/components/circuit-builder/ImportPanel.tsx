
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImportPanelProps {
  onImport: (circuitData: any, format: 'qasm' | 'python' | 'javascript' | 'json') => void;
}

export function ImportPanel({ onImport }: ImportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<'qasm' | 'python' | 'javascript' | 'json'>('qasm');
  const [importCode, setImportCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportCode(content);
      
      // Auto-detect format based on file extension
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension === 'qasm') setSelectedFormat('qasm');
      else if (extension === 'py') setSelectedFormat('python');
      else if (extension === 'js') setSelectedFormat('javascript');
      else if (extension === 'json') setSelectedFormat('json');
    };
    reader.readAsText(file);
  };

  const validateCode = () => {
    setIsValidating(true);
    setValidationError(null);

    try {
      switch (selectedFormat) {
        case 'qasm':
          validateQASM(importCode);
          break;
        case 'python':
          validatePython(importCode);
          break;
        case 'javascript':
          validateJavaScript(importCode);
          break;
        case 'json':
          validateJSON(importCode);
          break;
      }
      
      toast({
        title: "Validation Successful",
        description: "Code is valid and ready to import"
      });
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Validation failed');
      toast({
        title: "Validation Failed",
        description: "Please check the code for errors",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const validateQASM = (code: string) => {
    // Basic QASM validation
    if (!code.includes('OPENQASM')) {
      throw new Error('Missing OPENQASM declaration');
    }
    if (!code.includes('qreg')) {
      throw new Error('Missing quantum register declaration');
    }
  };

  const validatePython = (code: string) => {
    // Basic Python validation
    if (!code.includes('QuantumCircuit')) {
      throw new Error('Missing QuantumCircuit import or usage');
    }
  };

  const validateJavaScript = (code: string) => {
    // Basic JavaScript validation
    if (!code.includes('QuantumCircuit')) {
      throw new Error('Missing QuantumCircuit usage');
    }
  };

  const validateJSON = (code: string) => {
    try {
      const parsed = JSON.parse(code);
      if (!parsed.gates || !Array.isArray(parsed.gates)) {
        throw new Error('Invalid JSON structure: missing gates array');
      }
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
  };

  const handleImport = () => {
    if (!importCode.trim()) {
      toast({
        title: "No Code to Import",
        description: "Please paste or upload code to import",
        variant: "destructive"
      });
      return;
    }

    try {
      let circuitData;
      
      switch (selectedFormat) {
        case 'qasm':
          circuitData = parseQASM(importCode);
          break;
        case 'python':
          circuitData = parsePython(importCode);
          break;
        case 'javascript':
          circuitData = parseJavaScript(importCode);
          break;
        case 'json':
          circuitData = parseJSON(importCode);
          break;
      }
      
      onImport(circuitData, selectedFormat);
      
      toast({
        title: "Import Successful",
        description: "Circuit has been imported successfully"
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to import circuit",
        variant: "destructive"
      });
    }
  };

  const parseQASM = (code: string) => {
    // Simple QASM parser - in a real implementation, this would be more sophisticated
    const lines = code.split('\n').filter(line => line.trim() && !line.startsWith('//'));
    const gates = [];
    let layer = 0;
    
    for (const line of lines) {
      if (line.includes('h ')) {
        const match = line.match(/h q\[(\d+)\]/);
        if (match) {
          gates.push({
            type: 'H',
            qubits: [parseInt(match[1])],
            layer: layer++
          });
        }
      } else if (line.includes('x ')) {
        const match = line.match(/x q\[(\d+)\]/);
        if (match) {
          gates.push({
            type: 'X',
            qubits: [parseInt(match[1])],
            layer: layer++
          });
        }
      } else if (line.includes('cx ')) {
        const match = line.match(/cx q\[(\d+)\],q\[(\d+)\]/);
        if (match) {
          gates.push({
            type: 'CNOT',
            qubits: [parseInt(match[1]), parseInt(match[2])],
            layer: layer++
          });
        }
      }
    }
    
    return { gates };
  };

  const parsePython = (code: string) => {
    // Simple Python parser - in a real implementation, this would be more sophisticated
    const lines = code.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    const gates = [];
    let layer = 0;
    
    for (const line of lines) {
      if (line.includes('.h(')) {
        const match = line.match(/\.h\((\d+)\)/);
        if (match) {
          gates.push({
            type: 'H',
            qubits: [parseInt(match[1])],
            layer: layer++
          });
        }
      } else if (line.includes('.x(')) {
        const match = line.match(/\.x\((\d+)\)/);
        if (match) {
          gates.push({
            type: 'X',
            qubits: [parseInt(match[1])],
            layer: layer++
          });
        }
      } else if (line.includes('.cx(')) {
        const match = line.match(/\.cx\((\d+),\s*(\d+)\)/);
        if (match) {
          gates.push({
            type: 'CNOT',
            qubits: [parseInt(match[1]), parseInt(match[2])],
            layer: layer++
          });
        }
      }
    }
    
    return { gates };
  };

  const parseJavaScript = (code: string) => {
    // Simple JavaScript parser - similar to Python
    const lines = code.split('\n').filter(line => line.trim() && !line.startsWith('//'));
    const gates = [];
    let layer = 0;
    
    for (const line of lines) {
      if (line.includes('.h(')) {
        const match = line.match(/\.h\((\d+)\)/);
        if (match) {
          gates.push({
            type: 'H',
            qubits: [parseInt(match[1])],
            layer: layer++
          });
        }
      } else if (line.includes('.x(')) {
        const match = line.match(/\.x\((\d+)\)/);
        if (match) {
          gates.push({
            type: 'X',
            qubits: [parseInt(match[1])],
            layer: layer++
          });
        }
      } else if (line.includes('.cnot(')) {
        const match = line.match(/\.cnot\((\d+),\s*(\d+)\)/);
        if (match) {
          gates.push({
            type: 'CNOT',
            qubits: [parseInt(match[1]), parseInt(match[2])],
            layer: layer++
          });
        }
      }
    }
    
    return { gates };
  };

  const parseJSON = (code: string) => {
    return JSON.parse(code);
  };

  const formats = [
    { value: 'qasm', label: 'OpenQASM', description: 'Standard quantum assembly language' },
    { value: 'python', label: 'Python (Qiskit)', description: 'Python code using Qiskit framework' },
    { value: 'javascript', label: 'JavaScript (QOSim)', description: 'JavaScript code using QOSim SDK' },
    { value: 'json', label: 'JSON', description: 'Circuit data in JSON format' }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Import Circuit
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="format">Import Format</Label>
          <Select value={selectedFormat} onValueChange={(value: any) => setSelectedFormat(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              {formats.map(format => (
                <SelectItem key={format.value} value={format.value}>
                  <div>
                    <div className="font-medium">{format.label}</div>
                    <div className="text-sm text-muted-foreground">{format.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="file-upload">Upload File</Label>
          <input
            id="file-upload"
            type="file"
            accept=".qasm,.py,.js,.json"
            onChange={handleFileUpload}
            className="block w-full text-sm text-muted-foreground
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-primary-foreground
              hover:file:bg-primary/90"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="code-input">Or Paste Code</Label>
          <Textarea
            id="code-input"
            value={importCode}
            onChange={(e) => setImportCode(e.target.value)}
            placeholder="Paste your quantum circuit code here..."
            className="h-48 font-mono text-sm"
          />
        </div>
        
        {validationError && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">{validationError}</span>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={validateCode}
            disabled={!importCode.trim() || isValidating}
            className="flex-1"
          >
            {isValidating ? 'Validating...' : 'Validate'}
          </Button>
          <Button
            onClick={handleImport}
            disabled={!importCode.trim() || validationError !== null}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
        </div>
        
        {!importCode.trim() && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Upload a file or paste code to import a circuit</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
