
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeftRight, Download, Upload, Zap, Code, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  params?: number[];
}

interface CircuitBuilderIntegrationProps {
  onExportToBuilder: (code: string) => void;
  onImportFromBuilder: (gates: Gate[]) => void;
  currentCircuit: Gate[];
  onOptimizeCircuit: (gates: Gate[]) => Promise<Gate[]>;
}

export function CircuitBuilderIntegration({
  onExportToBuilder,
  onImportFromBuilder,
  currentCircuit,
  onOptimizeCircuit
}: CircuitBuilderIntegrationProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedGates, setOptimizedGates] = useState<Gate[]>([]);

  const generateCircuitCode = (gates: Gate[], language: 'python' | 'javascript') => {
    if (language === 'python') {
      let code = `# Generated from Circuit Builder
from qiskit import QuantumCircuit, execute, Aer
from qiskit.visualization import plot_histogram

# Create quantum circuit
qubits = ${Math.max(5, Math.max(...gates.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))))}
qc = QuantumCircuit(qubits, qubits)

`;

      gates.forEach(gate => {
        switch (gate.type) {
          case 'H':
            code += `qc.h(${gate.qubit})  # Hadamard gate\n`;
            break;
          case 'X':
            code += `qc.x(${gate.qubit})  # Pauli-X gate\n`;
            break;
          case 'Y':
            code += `qc.y(${gate.qubit})  # Pauli-Y gate\n`;
            break;
          case 'Z':
            code += `qc.z(${gate.qubit})  # Pauli-Z gate\n`;
            break;
          case 'CNOT':
            if (gate.qubits && gate.qubits.length >= 2) {
              code += `qc.cx(${gate.qubits[0]}, ${gate.qubits[1]})  # CNOT gate\n`;
            }
            break;
          case 'RX':
            code += `qc.rx(${gate.angle || 'pi/2'}, ${gate.qubit})  # RX rotation\n`;
            break;
          case 'RY':
            code += `qc.ry(${gate.angle || 'pi/2'}, ${gate.qubit})  # RY rotation\n`;
            break;
          case 'M':
            code += `qc.measure(${gate.qubit}, ${gate.qubit})  # Measurement\n`;
            break;
        }
      });

      code += `
# Execute the circuit
backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1024)
result = job.result()
counts = result.get_counts()

print("Results:", counts)
print("Circuit:", qc.draw())`;

      return code;
    } else {
      let code = `// Generated from Circuit Builder
import { QuantumCircuit } from 'qosim-sdk';

// Create quantum circuit
const qubits = ${Math.max(5, Math.max(...gates.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))))}
const qc = new QuantumCircuit(qubits, qubits);

`;

      gates.forEach(gate => {
        switch (gate.type) {
          case 'H':
            code += `qc.h(${gate.qubit});  // Hadamard gate\n`;
            break;
          case 'X':
            code += `qc.x(${gate.qubit});  // Pauli-X gate\n`;
            break;
          case 'Y':
            code += `qc.y(${gate.qubit});  // Pauli-Y gate\n`;
            break;
          case 'Z':
            code += `qc.z(${gate.qubit});  // Pauli-Z gate\n`;
            break;
          case 'CNOT':
            if (gate.qubits && gate.qubits.length >= 2) {
              code += `qc.cnot(${gate.qubits[0]}, ${gate.qubits[1]});  // CNOT gate\n`;
            }
            break;
          case 'RX':
            code += `qc.rx(${gate.angle || 'Math.PI/2'}, ${gate.qubit});  // RX rotation\n`;
            break;
          case 'RY':
            code += `qc.ry(${gate.angle || 'Math.PI/2'}, ${gate.qubit});  // RY rotation\n`;
            break;
          case 'M':
            code += `qc.measure(${gate.qubit}, ${gate.qubit});  // Measurement\n`;
            break;
        }
      });

      code += `
// Execute the circuit
const result = await qc.execute({ shots: 1024 });
console.log('Results:', result.counts);
console.log('Circuit:', qc.draw());`;

      return code;
    }
  };

  const handleExportCircuit = (language: 'python' | 'javascript') => {
    if (currentCircuit.length === 0) {
      toast({
        title: "No Circuit to Export",
        description: "Please create a circuit in the builder first.",
        variant: "destructive"
      });
      return;
    }

    const code = generateCircuitCode(currentCircuit, language);
    onExportToBuilder(code);
    
    toast({
      title: "Circuit Exported",
      description: `Generated ${language} code from current circuit with ${currentCircuit.length} gates.`,
    });
  };

  const handleOptimizeCircuit = async () => {
    if (currentCircuit.length === 0) {
      toast({
        title: "No Circuit to Optimize",
        description: "Please create a circuit first.",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const optimized = await onOptimizeCircuit(currentCircuit);
      setOptimizedGates(optimized);
      
      toast({
        title: "Circuit Optimized",
        description: `Reduced from ${currentCircuit.length} to ${optimized.length} gates.`,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Unable to optimize the circuit.",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const applyOptimization = () => {
    onImportFromBuilder(optimizedGates);
    setOptimizedGates([]);
    toast({
      title: "Optimization Applied",
      description: "Circuit has been updated with optimized gates.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5" />
            Circuit Builder Integration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-quantum-matrix">
              <TabsTrigger value="export" className="data-[state=active]:bg-quantum-glow data-[state=active]:text-black">
                Export
              </TabsTrigger>
              <TabsTrigger value="import" className="data-[state=active]:bg-quantum-glow data-[state=active]:text-black">
                Import
              </TabsTrigger>
              <TabsTrigger value="optimize" className="data-[state=active]:bg-quantum-glow data-[state=active]:text-black">
                Optimize
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="export" className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-quantum-neon mb-2">
                  Export Circuit to Code
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Convert your visual circuit to executable code
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleExportCircuit('python')}
                    className="flex items-center justify-center gap-2 bg-quantum-matrix hover:bg-quantum-neon hover:text-black"
                  >
                    <Download className="w-4 h-4" />
                    Export Python
                  </Button>
                  <Button
                    onClick={() => handleExportCircuit('javascript')}
                    className="flex items-center justify-center gap-2 bg-quantum-matrix hover:bg-quantum-neon hover:text-black"
                  >
                    <Download className="w-4 h-4" />
                    Export JavaScript
                  </Button>
                </div>

                {currentCircuit.length > 0 && (
                  <div className="mt-4 p-3 bg-quantum-void rounded-lg border border-quantum-matrix">
                    <div className="text-sm text-quantum-glow mb-2">Current Circuit:</div>
                    <div className="flex flex-wrap gap-1">
                      {currentCircuit.map((gate, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {gate.type}{gate.qubit !== undefined ? `(${gate.qubit})` : ''}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="import" className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-quantum-neon mb-2">
                  Import Code to Circuit
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Parse your code and convert it to a visual circuit
                </p>
                
                <Button
                  onClick={() => {
                    // This would trigger a dialog to paste code
                    toast({
                      title: "Code Import",
                      description: "Code import dialog would open here.",
                    });
                  }}
                  className="w-full bg-quantum-matrix hover:bg-quantum-neon hover:text-black"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Import Code
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="optimize" className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-quantum-neon mb-2">
                  AI Circuit Optimization
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Reduce gate count and circuit depth using AI
                </p>
                
                <Button
                  onClick={handleOptimizeCircuit}
                  disabled={isOptimizing || currentCircuit.length === 0}
                  className="w-full bg-quantum-glow hover:bg-quantum-glow/80 text-black"
                >
                  {isOptimizing ? (
                    <>Optimizing...</>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Optimize Circuit
                    </>
                  )}
                </Button>

                {optimizedGates.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 p-3 bg-quantum-matrix rounded-lg">
                      <div className="text-center">
                        <div className="text-lg font-mono text-quantum-neon">
                          {currentCircuit.length}
                        </div>
                        <div className="text-xs text-muted-foreground">Original Gates</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-mono text-quantum-glow">
                          {optimizedGates.length}
                        </div>
                        <div className="text-xs text-muted-foreground">Optimized Gates</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={applyOptimization}
                        className="flex-1 bg-quantum-glow hover:bg-quantum-glow/80 text-black"
                      >
                        Apply Optimization
                      </Button>
                      <Button
                        onClick={() => setOptimizedGates([])}
                        variant="outline"
                        className="flex-1"
                      >
                        Discard
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
