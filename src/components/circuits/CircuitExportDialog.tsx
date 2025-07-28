
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { QuantumCircuit } from '@/hooks/useCircuitBuilder';
import { qosmExporter } from '@/lib/qosmExporter';
import { Copy, Download, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CircuitExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circuit: QuantumCircuit;
  onExport: (format: string) => Promise<void>;
}

export function CircuitExportDialog({ 
  open, 
  onOpenChange, 
  circuit, 
  onExport 
}: CircuitExportDialogProps) {
  const [exportFormat, setExportFormat] = useState('qasm');
  const [exportedCode, setExportedCode] = useState('');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const formats = [
    { id: 'qasm', name: 'OpenQASM', description: 'Standard quantum assembly language' },
    { id: 'json', name: 'JSON', description: 'JavaScript Object Notation' },
    { id: 'python', name: 'Python (Qiskit)', description: 'Python code using Qiskit' },
    { id: 'javascript', name: 'JavaScript', description: 'JavaScript code using QOSim SDK' }
  ];

  const handleFormatChange = (format: string) => {
    setExportFormat(format);
    try {
      const code = qosmExporter.export(circuit, format);
      setExportedCode(code);
    } catch (error) {
      toast.error('Failed to generate export code');
      setExportedCode('');
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(exportedCode);
      setCopiedFormat(exportFormat);
      toast.success('Code copied to clipboard');
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const handleDownload = async () => {
    try {
      await onExport(exportFormat);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to download file');
    }
  };

  React.useEffect(() => {
    if (open) {
      handleFormatChange(exportFormat);
    }
  }, [open, exportFormat]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Export Quantum Circuit</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full space-y-4">
          {/* Circuit Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Circuit Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-mono">{circuit.name}</span>
                </div>
                <Badge variant="outline">
                  {circuit.qubits.length} qubits
                </Badge>
                <Badge variant="outline">
                  {circuit.gates.length} gates
                </Badge>
                <Badge variant="outline">
                  Depth: {circuit.depth}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Export Formats */}
          <Tabs value={exportFormat} onValueChange={handleFormatChange}>
            <TabsList className="grid w-full grid-cols-4">
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
                    <CardTitle className="text-sm flex items-center justify-between">
                      {format.name}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyCode}
                          disabled={!exportedCode}
                        >
                          {copiedFormat === format.id ? (
                            <Check className="w-4 h-4 mr-1" />
                          ) : (
                            <Copy className="w-4 h-4 mr-1" />
                          )}
                          Copy
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleDownload}
                          disabled={!exportedCode}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {format.description}
                    </p>
                    
                    <Textarea
                      value={exportedCode}
                      readOnly
                      className="min-h-[300px] font-mono text-sm"
                      placeholder="Export code will appear here..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
