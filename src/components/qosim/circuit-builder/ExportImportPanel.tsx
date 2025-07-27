
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Upload, 
  FileText, 
  Code, 
  Database,
  Copy,
  Check
} from 'lucide-react';
import { Gate } from '@/hooks/useCircuitState';
import { useExportHandlers } from '@/hooks/useExportHandlers';
import { toast } from 'sonner';

interface ExportImportPanelProps {
  circuit: Gate[];
  simulationResult: any;
  onImportCircuit: (circuit: Gate[]) => void;
}

export function ExportImportPanel({ circuit, simulationResult, onImportCircuit }: ExportImportPanelProps) {
  const [activeTab, setActiveTab] = useState('export');
  const [importData, setImportData] = useState('');
  const [importFormat, setImportFormat] = useState('json');
  const [projectName, setProjectName] = useState('quantum_circuit');
  const [copied, setCopied] = useState<string | null>(null);

  const { handleExportJSON, handleExportQASM, handleExportPython } = useExportHandlers(
    circuit,
    5, // numQubits
    { projectName }
  );

  const handleCopyToClipboard = async (text: string, format: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(format);
      setTimeout(() => setCopied(null), 2000);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const generateExportCode = (format: string) => {
    switch (format) {
      case 'json':
        return JSON.stringify({
          name: projectName,
          qubits: 5,
          gates: circuit.map(gate => ({
            type: gate.type,
            qubit: gate.qubit,
            qubits: gate.qubits,
            position: gate.position,
            angle: gate.angle,
            params: gate.params
          })),
          timestamp: new Date().toISOString()
        }, null, 2);
        
      case 'qasm':
        let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\n\nqreg q[5];\ncreg c[5];\n\n`;
        circuit.forEach(gate => {
          switch (gate.type) {
            case 'H':
              qasm += `h q[${gate.qubit}];\n`;
              break;
            case 'X':
              qasm += `x q[${gate.qubit}];\n`;
              break;
            case 'Y':
              qasm += `y q[${gate.qubit}];\n`;
              break;
            case 'Z':
              qasm += `z q[${gate.qubit}];\n`;
              break;
            case 'CNOT':
              if (gate.qubits) qasm += `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];\n`;
              break;
            case 'RX':
              qasm += `rx(${gate.angle || 'pi/2'}) q[${gate.qubit}];\n`;
              break;
            case 'RY':
              qasm += `ry(${gate.angle || 'pi/2'}) q[${gate.qubit}];\n`;
              break;
            case 'RZ':
              qasm += `rz(${gate.angle || 'pi/2'}) q[${gate.qubit}];\n`;
              break;
          }
        });
        qasm += `\nmeasure q -> c;\n`;
        return qasm;
        
      case 'python':
        let python = `# QOSim Circuit - ${projectName}\n`;
        python += `from qosim import QOSimSDK\n\n`;
        python += `# Initialize SDK\nsdk = QOSimSDK()\nawait sdk.initialize()\n\n`;
        python += `# Create circuit\ncircuit = sdk.createCircuit("${projectName}", 5)\n\n`;
        
        circuit.forEach(gate => {
          switch (gate.type) {
            case 'H':
              python += `circuit = sdk.addGate(circuit, {'type': 'h', 'qubit': ${gate.qubit}})\n`;
              break;
            case 'X':
              python += `circuit = sdk.addGate(circuit, {'type': 'x', 'qubit': ${gate.qubit}})\n`;
              break;
            case 'CNOT':
              if (gate.qubits) {
                python += `circuit = sdk.addGate(circuit, {'type': 'cnot', 'controlQubit': ${gate.qubits[0]}, 'qubit': ${gate.qubits[1]}})\n`;
              }
              break;
            default:
              python += `circuit = sdk.addGate(circuit, ${JSON.stringify(gate)})\n`;
          }
        });
        
        python += `\n# Simulate circuit\nresult = await sdk.simulate(circuit)\nconsole.log(result)\n`;
        return python;
        
      case 'javascript':
        let js = `// QOSim Circuit - ${projectName}\n`;
        js += `import { QOSimSDK } from './qosim-sdk.js';\n\n`;
        js += `// Initialize SDK\nconst sdk = new QOSimSDK();\nawait sdk.initialize();\n\n`;
        js += `// Create circuit\nlet circuit = sdk.createCircuit("${projectName}", 5);\n\n`;
        
        circuit.forEach(gate => {
          switch (gate.type) {
            case 'H':
              js += `circuit = sdk.addGate(circuit, {type: 'h', qubit: ${gate.qubit}});\n`;
              break;
            case 'X':
              js += `circuit = sdk.addGate(circuit, {type: 'x', qubit: ${gate.qubit}});\n`;
              break;
            case 'CNOT':
              if (gate.qubits) {
                js += `circuit = sdk.addGate(circuit, {type: 'cnot', controlQubit: ${gate.qubits[0]}, qubit: ${gate.qubits[1]}});\n`;
              }
              break;
            default:
              js += `circuit = sdk.addGate(circuit, ${JSON.stringify(gate)});\n`;
          }
        });
        
        js += `\n// Simulate circuit\nconst result = await sdk.simulate(circuit);\nconsole.log(result);\n`;
        return js;
        
      default:
        return '';
    }
  };

  const handleImport = () => {
    try {
      let importedCircuit: Gate[] = [];
      
      if (importFormat === 'json') {
        const data = JSON.parse(importData);
        importedCircuit = data.gates || data;
      } else if (importFormat === 'qasm') {
        // Simple QASM parser (basic implementation)
        const lines = importData.split('\n');
        let position = 0;
        
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed.startsWith('h q[')) {
            const qubit = parseInt(trimmed.match(/\[(\d+)\]/)?.[1] || '0');
            importedCircuit.push({
              id: `gate_${Date.now()}_${position}`,
              type: 'H',
              qubit,
              position: position++
            });
          } else if (trimmed.startsWith('x q[')) {
            const qubit = parseInt(trimmed.match(/\[(\d+)\]/)?.[1] || '0');
            importedCircuit.push({
              id: `gate_${Date.now()}_${position}`,
              type: 'X',
              qubit,
              position: position++
            });
          } else if (trimmed.startsWith('cx q[')) {
            const matches = trimmed.match(/\[(\d+)\],q\[(\d+)\]/);
            if (matches) {
              importedCircuit.push({
                id: `gate_${Date.now()}_${position}`,
                type: 'CNOT',
                qubits: [parseInt(matches[1]), parseInt(matches[2])],
                position: position++
              });
            }
          }
        });
      }
      
      onImportCircuit(importedCircuit);
      setImportData('');
      toast.success('Circuit imported successfully');
    } catch (error) {
      toast.error('Import failed', { description: String(error) });
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Export & Import
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 quantum-tabs">
            <TabsTrigger value="export" className="quantum-tab">
              <Download className="w-4 h-4 mr-2" />
              Export
            </TabsTrigger>
            <TabsTrigger value="import" className="quantum-tab">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="quantum_circuit"
                className="quantum-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-quantum-neon">Quick Export</h4>
                <div className="space-y-2">
                  <Button
                    onClick={handleExportJSON}
                    variant="outline"
                    size="sm"
                    className="w-full neon-border"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    JSON
                  </Button>
                  <Button
                    onClick={handleExportQASM}
                    variant="outline"
                    size="sm"
                    className="w-full neon-border"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    QASM
                  </Button>
                  <Button
                    onClick={handleExportPython}
                    variant="outline"
                    size="sm"
                    className="w-full neon-border"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Python
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-quantum-neon">Code Preview</h4>
                <div className="space-y-2">
                  {['json', 'qasm', 'python', 'javascript'].map(format => (
                    <Button
                      key={format}
                      onClick={() => handleCopyToClipboard(generateExportCode(format), format)}
                      variant="outline"
                      size="sm"
                      className="w-full neon-border"
                    >
                      {copied === format ? (
                        <Check className="w-4 h-4 mr-2" />
                      ) : (
                        <Copy className="w-4 h-4 mr-2" />
                      )}
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Preview */}
            <div className="space-y-2">
              <Label>Code Preview</Label>
              <Textarea
                value={generateExportCode('json')}
                readOnly
                rows={8}
                className="quantum-input font-mono text-xs"
              />
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-format">Import Format</Label>
              <select
                id="import-format"
                value={importFormat}
                onChange={(e) => setImportFormat(e.target.value)}
                className="quantum-input"
              >
                <option value="json">JSON</option>
                <option value="qasm">OpenQASM</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="import-data">Circuit Data</Label>
              <Textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste your circuit data here..."
                rows={8}
                className="quantum-input font-mono text-xs"
              />
            </div>

            <Button
              onClick={handleImport}
              disabled={!importData.trim()}
              className="w-full neon-border"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Circuit
            </Button>

            {/* Import Examples */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-quantum-neon">Example Formats</h4>
              <div className="text-xs text-quantum-particle space-y-1">
                <p><strong>JSON:</strong> {"{"}"gates": [{"{"}"type": "H", "qubit": 0, "position": 0{"}"}]{"}"}
                </p>
                <p><strong>QASM:</strong> h q[0]; cx q[0],q[1];</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
