
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CircuitImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: string, format: string) => Promise<void>;
}

export function CircuitImportDialog({ 
  open, 
  onOpenChange, 
  onImport 
}: CircuitImportDialogProps) {
  const [importFormat, setImportFormat] = useState('qasm');
  const [importData, setImportData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formats = [
    { id: 'qasm', name: 'OpenQASM', description: 'Standard quantum assembly language' },
    { id: 'json', name: 'JSON', description: 'JavaScript Object Notation' },
    { id: 'python', name: 'Python', description: 'Python code (Qiskit format)' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setImportData(content);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!importData.trim()) {
      toast.error('Please provide circuit data to import');
      return;
    }

    setIsLoading(true);
    try {
      await onImport(importData, importFormat);
      onOpenChange(false);
      setImportData('');
      toast.success('Circuit imported successfully');
    } catch (error) {
      toast.error('Failed to import circuit: ' + error);
    } finally {
      setIsLoading(false);
    }
  };

  const getExampleData = (format: string) => {
    switch (format) {
      case 'qasm':
        return `OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q[0] -> c[0];
measure q[1] -> c[1];`;
      case 'json':
        return `{
  "name": "Bell State",
  "qubits": 2,
  "gates": [
    { "type": "H", "qubits": [0], "layer": 0 },
    { "type": "CNOT", "qubits": [0, 1], "layer": 1 }
  ]
}`;
      case 'python':
        return `from qiskit import QuantumCircuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure(0, 0)
qc.measure(1, 1)`;
      default:
        return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Import Quantum Circuit</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full space-y-4">
          {/* Import Formats */}
          <Tabs value={importFormat} onValueChange={setImportFormat}>
            <TabsList className="grid w-full grid-cols-3">
              {formats.map(format => (
                <TabsTrigger key={format.id} value={format.id}>
                  {format.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {formats.map(format => (
              <TabsContent key={format.id} value={format.id} className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{format.name} Import</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {format.description}
                    </p>
                    
                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="file-upload">Upload File</Label>
                      <Input
                        id="file-upload"
                        type="file"
                        accept={`.${format.id},.txt`}
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                    </div>
                    
                    {/* Text Input */}
                    <div className="space-y-2">
                      <Label htmlFor="import-data">Or paste code directly</Label>
                      <Textarea
                        id="import-data"
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder={`Paste your ${format.name} code here...`}
                        className="min-h-[200px] font-mono text-sm"
                      />
                    </div>
                    
                    {/* Example */}
                    <div className="space-y-2">
                      <Label>Example {format.name} code:</Label>
                      <div className="bg-muted p-3 rounded-md">
                        <pre className="text-xs font-mono whitespace-pre-wrap">
                          {getExampleData(format.id)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
          
          {/* Import Button */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              Importing will replace the current circuit
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!importData.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <FileText className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Circuit
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
