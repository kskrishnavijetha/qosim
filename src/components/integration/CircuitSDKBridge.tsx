
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowRightLeft, 
  Code, 
  Eye, 
  Download, 
  Upload, 
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { QuantumCircuit } from '@/sdk/qosim-sdk';
import { Gate } from '@/hooks/useCircuitState';
import { SDKCodeEditor } from '../sdk/SDKCodeEditor';
import { AlgorithmVisualizer } from '../algorithms/AlgorithmVisualizer';
import { toast } from 'sonner';

interface CircuitSDKBridgeProps {
  visualCircuit: Gate[];
  onVisualCircuitChange: (circuit: Gate[]) => void;
  onSDKCircuitGenerated: (circuit: QuantumCircuit) => void;
}

interface ConversionResult {
  success: boolean;
  code?: string;
  circuit?: Gate[] | QuantumCircuit;
  warnings?: string[];
  errors?: string[];
}

export function CircuitSDKBridge({
  visualCircuit,
  onVisualCircuitChange,
  onSDKCircuitGenerated
}: CircuitSDKBridgeProps) {
  const [activeTab, setActiveTab] = useState('visual-to-code');
  const [generatedCode, setGeneratedCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python'>('javascript');
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  // Convert visual circuit to SDK code
  const convertVisualToCode = async (language: 'javascript' | 'python' = 'javascript') => {
    setIsConverting(true);
    try {
      let code = '';
      const warnings: string[] = [];
      
      if (language === 'javascript') {
        code = `// Generated from QOSim Circuit Builder
import { QOSimSDK } from '@qosim/sdk';

const sdk = new QOSimSDK();

async function runCircuit() {
  // Create quantum circuit
  let circuit = sdk.createCircuit("Generated Circuit", ${Math.max(3, getMaxQubit(visualCircuit) + 1)});
  
`;
        
        // Convert each gate
        visualCircuit.forEach((gate, index) => {
          switch (gate.type) {
            case 'H':
              code += `  circuit = sdk.h(circuit, ${gate.qubit});\n`;
              break;
            case 'X':
              code += `  circuit = sdk.x(circuit, ${gate.qubit});\n`;
              break;
            case 'Y':
              code += `  circuit = sdk.y(circuit, ${gate.qubit});\n`;
              break;
            case 'Z':
              code += `  circuit = sdk.z(circuit, ${gate.qubit});\n`;
              break;
            case 'CNOT':
              if (gate.qubits && gate.qubits.length >= 2) {
                code += `  circuit = sdk.cnot(circuit, ${gate.qubits[0]}, ${gate.qubits[1]});\n`;
              } else {
                warnings.push(`CNOT gate at position ${index} missing control/target qubits`);
              }
              break;
            case 'RX':
              code += `  circuit = sdk.rx(circuit, ${gate.qubit}, ${gate.angle || Math.PI / 2});\n`;
              break;
            case 'RY':
              code += `  circuit = sdk.ry(circuit, ${gate.qubit}, ${gate.angle || Math.PI / 2});\n`;
              break;
            case 'RZ':
              code += `  circuit = sdk.rz(circuit, ${gate.qubit}, ${gate.angle || Math.PI / 2});\n`;
              break;
            case 'M':
              code += `  circuit = sdk.measure(circuit, ${gate.qubit});\n`;
              break;
            default:
              warnings.push(`Unknown gate type: ${gate.type}`);
          }
        });

        code += `
  // Execute circuit
  const result = await sdk.simulate(circuit, 1024);
  console.log('Measurement results:', result.measurementProbabilities);
  
  return circuit;
}

runCircuit();`;

      } else {
        // Python code generation
        code = `# Generated from QOSim Circuit Builder
from qosim_sdk import QOSimSDK

def run_circuit():
    sdk = QOSimSDK()
    
    # Create quantum circuit
    circuit = sdk.create_circuit("Generated Circuit", ${Math.max(3, getMaxQubit(visualCircuit) + 1)})
    
`;
        
        visualCircuit.forEach((gate, index) => {
          switch (gate.type) {
            case 'H':
              code += `    circuit = sdk.h(circuit, ${gate.qubit})\n`;
              break;
            case 'X':
              code += `    circuit = sdk.x(circuit, ${gate.qubit})\n`;
              break;
            case 'Y':
              code += `    circuit = sdk.y(circuit, ${gate.qubit})\n`;
              break;
            case 'Z':
              code += `    circuit = sdk.z(circuit, ${gate.qubit})\n`;
              break;
            case 'CNOT':
              if (gate.qubits && gate.qubits.length >= 2) {
                code += `    circuit = sdk.cnot(circuit, ${gate.qubits[0]}, ${gate.qubits[1]})\n`;
              }
              break;
            case 'RX':
              code += `    circuit = sdk.rx(circuit, ${gate.qubit}, ${gate.angle || Math.PI / 2})\n`;
              break;
            case 'RY':
              code += `    circuit = sdk.ry(circuit, ${gate.qubit}, ${gate.angle || Math.PI / 2})\n`;
              break;
            case 'RZ':
              code += `    circuit = sdk.rz(circuit, ${gate.qubit}, ${gate.angle || Math.PI / 2})\n`;
              break;
            case 'M':
              code += `    circuit = sdk.measure(circuit, ${gate.qubit})\n`;
              break;
          }
        });

        code += `
    # Execute circuit
    result = sdk.simulate(circuit, shots=1024)
    print("Measurement results:", result.measurement_probabilities)
    
    return circuit

if __name__ == "__main__":
    run_circuit()`;
      }

      setGeneratedCode(code);
      setConversionResult({
        success: true,
        code,
        warnings
      });

      toast.success('Circuit converted to code successfully!');

    } catch (error) {
      setConversionResult({
        success: false,
        errors: [error.message]
      });
      toast.error('Failed to convert circuit to code');
    } finally {
      setIsConverting(false);
    }
  };

  // Convert SDK code to visual circuit
  const convertCodeToVisual = (sdkCircuit: QuantumCircuit) => {
    try {
      const visualGates: Gate[] = sdkCircuit.gates.map((gate, index) => ({
        id: `gate_${Date.now()}_${index}`,
        type: gate.type.toUpperCase(),
        qubit: gate.qubit || 0,
        qubits: gate.controlQubit !== undefined ? [gate.controlQubit, gate.qubit || 0] : undefined,
        position: index,
        angle: gate.angle,
        params: gate.angle ? [gate.angle] : undefined
      }));

      onVisualCircuitChange(visualGates);
      
      setConversionResult({
        success: true,
        circuit: visualGates
      });

      toast.success('SDK code converted to visual circuit!');

    } catch (error) {
      setConversionResult({
        success: false,
        errors: [error.message]
      });
      toast.error('Failed to convert code to visual circuit');
    }
  };

  const getMaxQubit = (circuit: Gate[]): number => {
    let maxQubit = 0;
    circuit.forEach(gate => {
      if (gate.qubit !== undefined && gate.qubit > maxQubit) {
        maxQubit = gate.qubit;
      }
      if (gate.qubits) {
        gate.qubits.forEach(q => {
          if (q > maxQubit) maxQubit = q;
        });
      }
    });
    return maxQubit;
  };

  const downloadCode = () => {
    if (generatedCode) {
      const extension = selectedLanguage === 'javascript' ? 'js' : 'py';
      const blob = new Blob([generatedCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `circuit_export.${extension}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Code downloaded successfully!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-quantum-glow flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5" />
              Circuit Builder ↔ SDK Integration
            </span>
            <Badge variant="outline" className="neon-border">
              Real-time Sync
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-quantum-particle text-sm">
            Seamlessly convert between visual circuits and SDK code. Create in one format, export to another.
          </p>
        </CardContent>
      </Card>

      {/* Conversion Results */}
      {conversionResult && (
        <Alert className={`neon-border ${conversionResult.success ? 'border-green-500' : 'border-red-500'}`}>
          <div className="flex items-center gap-2">
            {conversionResult.success ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
            <AlertDescription>
              {conversionResult.success 
                ? 'Conversion completed successfully!' 
                : 'Conversion failed with errors.'}
              
              {conversionResult.warnings && conversionResult.warnings.length > 0 && (
                <div className="mt-2">
                  <strong>Warnings:</strong>
                  <ul className="list-disc list-inside">
                    {conversionResult.warnings.map((warning, index) => (
                      <li key={index} className="text-yellow-500">{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {conversionResult.errors && conversionResult.errors.length > 0 && (
                <div className="mt-2">
                  <strong>Errors:</strong>
                  <ul className="list-disc list-inside">
                    {conversionResult.errors.map((error, index) => (
                      <li key={index} className="text-red-500">{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Main Integration Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="quantum-panel neon-border">
          <TabsTrigger value="visual-to-code" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Visual → Code
          </TabsTrigger>
          <TabsTrigger value="code-to-visual" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Code → Visual
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            AI Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual-to-code" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Export Visual Circuit to Code</span>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value as 'javascript' | 'python')}
                    className="px-3 py-1 bg-quantum-void border border-quantum-matrix rounded text-quantum-glow"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                  </select>
                  <Button
                    onClick={() => convertVisualToCode(selectedLanguage)}
                    disabled={isConverting || visualCircuit.length === 0}
                    className="neon-border"
                  >
                    {isConverting ? 'Converting...' : 'Convert'}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-quantum-particle mb-2">
                    Current Visual Circuit ({visualCircuit.length} gates)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {visualCircuit.map((gate, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {gate.type}({gate.qubit})
                      </Badge>
                    ))}
                  </div>
                  {visualCircuit.length === 0 && (
                    <p className="text-quantum-particle text-sm">
                      No gates in visual circuit. Add gates using the Circuit Builder.
                    </p>
                  )}
                </div>

                {generatedCode && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-quantum-particle">
                        Generated {selectedLanguage} Code
                      </h4>
                      <Button variant="outline" size="sm" onClick={downloadCode} className="neon-border">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                    <pre className="text-xs font-mono text-quantum-neon bg-quantum-void p-4 rounded border border-quantum-matrix max-h-96 overflow-auto">
                      {generatedCode}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code-to-visual" className="space-y-4">
          <SDKCodeEditor
            language={selectedLanguage}
            onCircuitGenerated={convertCodeToVisual}
          />
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                AI-Powered Circuit Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert className="neon-border">
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Coming Soon:</strong> AI-powered optimization will automatically:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Reduce circuit depth by reordering gates</li>
                      <li>Eliminate redundant operations</li>
                      <li>Optimize for specific quantum backends</li>
                      <li>Suggest algorithmic improvements</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <Button disabled className="w-full neon-border">
                  <Zap className="w-4 h-4 mr-2" />
                  Optimize Circuit (Coming Soon)
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
