
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, Code, FileText, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface ExportImportPanelProps {
  onExport: (format: 'qasm' | 'python' | 'javascript' | 'json') => void;
  onImport: (circuitData: any, format: 'qasm' | 'python' | 'javascript' | 'json') => void;
}

export function ExportImportPanel({ onExport, onImport }: ExportImportPanelProps) {
  const [exportFormat, setExportFormat] = useState<'qasm' | 'python' | 'javascript' | 'json'>('qasm');
  const [importFormat, setImportFormat] = useState<'qasm' | 'python' | 'javascript' | 'json'>('qasm');
  const [importData, setImportData] = useState('');
  const [exportPreview, setExportPreview] = useState('');

  const exportFormats = [
    { value: 'qasm', label: 'OpenQASM 2.0', icon: '🔬', description: 'Standard quantum assembly language' },
    { value: 'python', label: 'Python (Qiskit)', icon: '🐍', description: 'Qiskit quantum circuits' },
    { value: 'javascript', label: 'JavaScript (QOSim)', icon: '⚡', description: 'QOSim SDK format' },
    { value: 'json', label: 'JSON', icon: '📄', description: 'Structured circuit data' }
  ];

  const handleExport = async () => {
    try {
      onExport(exportFormat);
      
      // Generate preview based on format
      let preview = '';
      switch (exportFormat) {
        case 'qasm':
          preview = `OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];

h q[0];
cx q[0],q[1];
measure q -> c;`;
          break;
        case 'python':
          preview = `from qiskit import QuantumCircuit, execute, Aer

# Create quantum circuit
qc = QuantumCircuit(3, 3)
qc.h(0)
qc.cx(0, 1)
qc.measure_all()

# Execute circuit
backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1024)
result = job.result()`;
          break;
        case 'javascript':
          preview = `import { QOSimSDK } from 'qosim-sdk';

const sdk = new QOSimSDK();
const circuit = sdk.createCircuit('bell_state');

circuit.h(0);
circuit.cnot(0, 1);

const result = await sdk.simulate(circuit);
console.log(result);`;
          break;
        case 'json':
          preview = `{
  "name": "Bell State Circuit",
  "qubits": 3,
  "gates": [
    {"type": "H", "qubits": [0], "layer": 0},
    {"type": "CNOT", "qubits": [0, 1], "layer": 1}
  ],
  "metadata": {
    "created": "2024-01-01T00:00:00Z",
    "version": "1.0"
  }
}`;
          break;
      }
      setExportPreview(preview);
      toast.success(`Circuit exported in ${exportFormat.toUpperCase()} format`);
    } catch (error) {
      toast.error('Export failed');
    }
  };

  const handleImport = () => {
    if (!importData.trim()) {
      toast.error('Please enter circuit data to import');
      return;
    }

    try {
      let parsedData;
      
      if (importFormat === 'json') {
        parsedData = JSON.parse(importData);
      } else {
        parsedData = importData;
      }

      onImport(parsedData, importFormat);
      toast.success(`Circuit imported from ${importFormat.toUpperCase()} format`);
      setImportData('');
    } catch (error) {
      toast.error('Import failed - invalid format');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportData(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="export" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Circuit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Export Format</label>
                <Select value={exportFormat} onValueChange={(value: any) => setExportFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {exportFormats.map(format => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex items-center gap-2">
                          <span>{format.icon}</span>
                          <div>
                            <div className="font-medium">{format.label}</div>
                            <div className="text-xs text-muted-foreground">{format.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleExport} className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" onClick={() => setExportPreview('')}>
                  Clear
                </Button>
              </div>

              {exportPreview && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Preview</label>
                  <Textarea
                    value={exportPreview}
                    readOnly
                    className="h-32 font-mono text-sm"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Export Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => onExport('qasm')}>
                  <FileText className="w-4 h-4 mr-1" />
                  QASM
                </Button>
                <Button variant="outline" size="sm" onClick={() => onExport('python')}>
                  <Code className="w-4 h-4 mr-1" />
                  Python
                </Button>
                <Button variant="outline" size="sm" onClick={() => onExport('javascript')}>
                  <Zap className="w-4 h-4 mr-1" />
                  JavaScript
                </Button>
                <Button variant="outline" size="sm" onClick={() => onExport('json')}>
                  <FileText className="w-4 h-4 mr-1" />
                  JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Import Circuit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Import Format</label>
                <Select value={importFormat} onValueChange={(value: any) => setImportFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {exportFormats.map(format => (
                      <SelectItem key={format.value} value={format.value}>
                        <div className="flex items-center gap-2">
                          <span>{format.icon}</span>
                          <div>
                            <div className="font-medium">{format.label}</div>
                            <div className="text-xs text-muted-foreground">{format.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Circuit Data</label>
                <Textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder={`Paste your ${importFormat.toUpperCase()} circuit data here...`}
                  className="h-32 font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleImport} className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" onClick={() => setImportData('')}>
                  Clear
                </Button>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Or Upload File</label>
                <input
                  type="file"
                  accept=".qasm,.py,.js,.json"
                  onChange={handleFileUpload}
                  className="w-full p-2 border rounded text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Import Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setImportData(`OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q -> c;`)}
                >
                  <Badge variant="outline" className="mr-2">QASM</Badge>
                  Bell State Example
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => setImportData(`{
  "name": "Grover Search",
  "qubits": 3,
  "gates": [
    {"type": "H", "qubits": [0], "layer": 0},
    {"type": "H", "qubits": [1], "layer": 0},
    {"type": "H", "qubits": [2], "layer": 0}
  ]
}`)}
                >
                  <Badge variant="outline" className="mr-2">JSON</Badge>
                  Grover Algorithm
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
