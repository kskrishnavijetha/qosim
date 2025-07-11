import React, { useState } from 'react';
import { Download, FileText, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  label?: string;
  comment?: string;
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circuit: Gate[];
  circuitRef: React.RefObject<HTMLElement>;
  numQubits: number;
}

export function ExportDialog({ 
  open, 
  onOpenChange, 
  circuit, 
  circuitRef,
  numQubits 
}: ExportDialogProps) {
  const { toast } = useToast();

  const [options, setOptions] = useState({
    projectName: 'quantum_circuit'
  });

  const generateCircuitData = (gates: Gate[]) => {
    return gates
      .sort((a, b) => a.position - b.position)
      .map(gate => ({
        gate: gate.type,
        qubit: gate.qubit,
        qubits: gate.qubits,
        time: gate.position,
        angle: gate.angle
      }));
  };

  const handleExportJSON = () => {
    try {
      const data = generateCircuitData(circuit);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${options.projectName}.json`;
      a.click();
      toast({ title: "JSON exported successfully!" });
    } catch (error) {
      toast({ title: "Export failed", description: String(error), variant: "destructive" });
    }
  };

  const handleExportQASM = () => {
    try {
      let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[${numQubits}];\ncreg c[${numQubits}];\n\n`;
      
      circuit.forEach(gate => {
        switch (gate.type) {
          case 'H':
            qasm += `h q[${gate.qubit}];\n`;
            break;
          case 'X':
            qasm += `x q[${gate.qubit}];\n`;
            break;
          case 'Z':
            qasm += `z q[${gate.qubit}];\n`;
            break;
          case 'CNOT':
            if (gate.qubits) qasm += `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];\n`;
            break;
          case 'RX':
            qasm += `rx(${gate.angle}) q[${gate.qubit}];\n`;
            break;
          case 'RY':
            qasm += `ry(${gate.angle}) q[${gate.qubit}];\n`;
            break;
          case 'M':
            qasm += `measure q[${gate.qubit}] -> c[${gate.qubit}];\n`;
            break;
        }
      });
      
      const blob = new Blob([qasm], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${options.projectName}.qasm`;
      a.click();
      toast({ title: "QASM exported successfully!" });
    } catch (error) {
      toast({ title: "Export failed", description: String(error), variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="quantum-panel border-quantum-glow/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-quantum-glow flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Quantum Circuit
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Export Options */}
          <Card className="quantum-panel border-quantum-glow/20">
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={options.projectName}
                  onChange={(e) => setOptions(prev => ({ ...prev, projectName: e.target.value }))}
                  placeholder="Enter project name"
                  className="neon-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Export Formats */}
          <Card className="quantum-panel border-quantum-glow/20">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-quantum-glow">Export Formats</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleExportJSON} 
                  variant="outline" 
                  className="neon-border flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  JSON
                </Button>

                <Button 
                  onClick={handleExportQASM} 
                  variant="outline" 
                  className="neon-border flex items-center gap-2"
                >
                  <Code className="w-4 h-4" />
                  QASM
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}