import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Zap } from 'lucide-react';
import { Gate } from '@/hooks/useCircuitState';

interface CircuitValidatorProps {
  circuit: Gate[];
  numQubits: number;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  metrics: {
    depth: number;
    gateCount: number;
    entanglementEstimate: number;
    complexityScore: number;
  };
}

export function CircuitValidator({ circuit, numQubits }: CircuitValidatorProps) {
  const [validation, setValidation] = useState<ValidationResult>(() => validateInitialCircuit());
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  function validateInitialCircuit(): ValidationResult {
    return {
      isValid: true,
      errors: [],
      warnings: [],
      suggestions: [],
      metrics: { depth: 0, gateCount: 0, entanglementEstimate: 0, complexityScore: 0 }
    };
  }

  const validateCircuit = (): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // Check for empty circuit
    if (circuit.length === 0) {
      warnings.push('Circuit is empty - add some gates to begin simulation');
      return {
        isValid: true,
        errors,
        warnings,
        suggestions,
        metrics: { depth: 0, gateCount: 0, entanglementEstimate: 0, complexityScore: 0 }
      };
    }

    // Validate gate parameters
    circuit.forEach((gate, index) => {
      // Check single-qubit gates
      if (['H', 'X', 'Y', 'Z', 'S', 'T', 'RX', 'RY', 'RZ'].includes(gate.type)) {
        if (gate.qubit === undefined || gate.qubit < 0 || gate.qubit >= numQubits) {
          errors.push(`Gate ${index + 1} (${gate.type}): Invalid qubit ${gate.qubit}`);
        }
        
        if (['RX', 'RY', 'RZ'].includes(gate.type) && gate.angle === undefined) {
          errors.push(`Gate ${index + 1} (${gate.type}): Missing rotation angle`);
        }
      }
      
      // Check multi-qubit gates
      if (['CNOT', 'SWAP'].includes(gate.type)) {
        if (!gate.qubits || gate.qubits.length !== 2) {
          errors.push(`Gate ${index + 1} (${gate.type}): Requires exactly 2 qubits`);
        } else {
          gate.qubits.forEach(qubit => {
            if (qubit < 0 || qubit >= numQubits) {
              errors.push(`Gate ${index + 1} (${gate.type}): Invalid qubit ${qubit}`);
            }
          });
          
          if (gate.qubits[0] === gate.qubits[1]) {
            errors.push(`Gate ${index + 1} (${gate.type}): Cannot target same qubit twice`);
          }
        }
      }
      
      if (gate.type === 'TOFFOLI') {
        if (!gate.qubits || gate.qubits.length !== 3) {
          errors.push(`Gate ${index + 1} (TOFFOLI): Requires exactly 3 qubits`);
        } else {
          const uniqueQubits = new Set(gate.qubits);
          if (uniqueQubits.size !== 3) {
            errors.push(`Gate ${index + 1} (TOFFOLI): All qubits must be different`);
          }
        }
      }
    });

    // Calculate circuit metrics
    const depth = Math.max(...circuit.map(gate => gate.position)) + 1;
    const gateCount = circuit.length;
    
    // Estimate entanglement potential
    const entanglingGates = circuit.filter(gate => 
      ['CNOT', 'TOFFOLI', 'SWAP'].includes(gate.type)
    ).length;
    const entanglementEstimate = Math.min(1, entanglingGates / (numQubits - 1));
    
    // Calculate complexity score
    const complexityScore = (gateCount * 0.4) + (depth * 0.3) + (entanglementEstimate * 100 * 0.3);

    // Generate warnings and suggestions
    if (depth > 20) {
      warnings.push('Circuit depth is high - may impact simulation performance');
    }
    
    if (gateCount > 50) {
      warnings.push('Large circuit detected - consider using step-by-step mode');
    }
    
    if (entanglementEstimate === 0) {
      suggestions.push('Add entangling gates (CNOT, TOFFOLI) for interesting quantum effects');
    }
    
    if (entanglementEstimate > 0.8) {
      suggestions.push('High entanglement detected - great for quantum algorithms!');
    }
    
    // Check for common patterns
    const hasHadamard = circuit.some(gate => gate.type === 'H');
    const hasCNOT = circuit.some(gate => gate.type === 'CNOT');
    
    if (hasHadamard && hasCNOT) {
      suggestions.push('Bell state pattern detected - good for entanglement visualization');
    }
    
    if (!hasHadamard && circuit.length > 3) {
      suggestions.push('Consider adding Hadamard gates for superposition effects');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      metrics: {
        depth,
        gateCount,
        entanglementEstimate,
        complexityScore
      }
    };
  };

  // Real-time updates when circuit changes
  useEffect(() => {
    console.log('🎯 CircuitValidator: circuit updated, validating in real-time');
    const newValidation = validateCircuit();
    setValidation(newValidation);
    setLastUpdate(Date.now());
  }, [circuit, numQubits]);

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-quantum-glow">
          <Zap className="w-5 h-5" />
          Circuit Validator
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Updated: {new Date(lastUpdate).toLocaleTimeString()}
            </Badge>
            <Badge 
              variant={validation.isValid ? "default" : "destructive"}
            >
              {validation.isValid ? 'Valid' : 'Invalid'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Errors */}
        {validation.errors.length > 0 && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Errors found:</strong>
              <ul className="mt-2 ml-4 list-disc">
                {validation.errors.map((error, i) => (
                  <li key={i} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Warnings */}
        {validation.warnings.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Warnings:</strong>
              <ul className="mt-2 ml-4 list-disc">
                {validation.warnings.map((warning, i) => (
                  <li key={i} className="text-sm">{warning}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Suggestions */}
        {validation.suggestions.length > 0 && (
          <Alert className="border-quantum-blue/30 bg-quantum-blue/5">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Suggestions:</strong>
              <ul className="mt-2 ml-4 list-disc">
                {validation.suggestions.map((suggestion, i) => (
                  <li key={i} className="text-sm">{suggestion}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Circuit Depth:</span>
              <Badge variant="outline">{validation.metrics.depth}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Gate Count:</span>
              <Badge variant="outline">{validation.metrics.gateCount}</Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Entanglement:</span>
              <Badge variant="outline">
                {(validation.metrics.entanglementEstimate * 100).toFixed(1)}%
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Complexity:</span>
              <Badge variant="outline">
                {validation.metrics.complexityScore.toFixed(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}