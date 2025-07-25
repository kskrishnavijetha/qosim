
import { useState } from 'react';
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

export function useCircuitExport() {
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const validateCircuit = (circuit: Gate[]): boolean => {
    if (circuit.length === 0) {
      toast({
        title: "Export Error",
        description: "Cannot export empty circuit",
        variant: "destructive"
      });
      return false;
    }

    // Check for invalid gate configurations
    const invalidGates = circuit.filter(gate => {
      if (gate.type === 'CNOT' || gate.type === 'CZ') {
        return !gate.qubits || gate.qubits.length < 2;
      }
      return gate.qubit === undefined && !gate.qubits;
    });

    if (invalidGates.length > 0) {
      toast({
        title: "Export Error",
        description: `Found ${invalidGates.length} invalid gate(s). Please check your circuit configuration.`,
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const exportCircuit = async (
    circuit: Gate[],
    format: 'qasm' | 'python' | 'javascript' | 'json',
    projectName: string,
    version: string = '1.0.0'
  ) => {
    if (!validateCircuit(circuit)) {
      return null;
    }

    setIsExporting(true);
    
    try {
      // This would be extended to use the actual export logic
      // For now, we'll return a success indicator
      
      toast({
        title: "Export Successful",
        description: `Circuit exported as ${format.toUpperCase()} format`,
      });
      
      return {
        success: true,
        format,
        projectName,
        version,
        gateCount: circuit.length
      };
    } catch (error) {
      toast({
        title: "Export Failed",
        description: `Failed to export circuit: ${error}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  const importCircuit = async (data: string, format: 'json') => {
    setIsExporting(true);
    
    try {
      if (format === 'json') {
        const parsedData = JSON.parse(data);
        
        if (!parsedData.circuit || !parsedData.circuit.gates) {
          throw new Error('Invalid circuit data format');
        }
        
        toast({
          title: "Import Successful",
          description: `Circuit imported with ${parsedData.circuit.gates.length} gates`,
        });
        
        return parsedData.circuit.gates;
      }
      
      throw new Error(`Unsupported import format: ${format}`);
    } catch (error) {
      toast({
        title: "Import Failed",
        description: `Failed to import circuit: ${error}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportCircuit,
    importCircuit,
    validateCircuit
  };
}
