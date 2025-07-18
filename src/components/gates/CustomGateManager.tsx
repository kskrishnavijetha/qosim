
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trash2, Eye, Plus, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface ComplexNumber {
  real: number;
  imaginary: number;
}

interface CustomGate {
  id: string;
  name: string;
  matrix: ComplexNumber[][];
  qubits: number;
  description?: string;
  isValid: boolean;
}

interface CustomGateManagerProps {
  onGateCreated: (gate: CustomGate) => void;
  existingGates?: CustomGate[];
}

export function CustomGateManager({ onGateCreated, existingGates = [] }: CustomGateManagerProps) {
  const [gates, setGates] = useState<CustomGate[]>(existingGates);
  const [selectedGate, setSelectedGate] = useState<CustomGate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newGateName, setNewGateName] = useState('');
  const [newGateDescription, setNewGateDescription] = useState('');
  const [matrixSize, setMatrixSize] = useState(2); // 2x2 for single qubit
  const [matrixValues, setMatrixValues] = useState<string[][]>([['1', '0'], ['0', '1']]);

  // Initialize matrix based on size
  const initializeMatrix = (size: number) => {
    const newMatrix = Array(size).fill(null).map(() => Array(size).fill('0'));
    // Set identity matrix as default
    for (let i = 0; i < size; i++) {
      newMatrix[i][i] = '1';
    }
    setMatrixValues(newMatrix);
  };

  // Parse complex number from string (supports formats like "1", "0.5", "i", "1+i", "0.5-0.3i")
  const parseComplexNumber = (str: string): ComplexNumber => {
    const cleanStr = str.replace(/\s/g, '');
    
    if (cleanStr === 'i') return { real: 0, imaginary: 1 };
    if (cleanStr === '-i') return { real: 0, imaginary: -1 };
    
    const realOnlyMatch = cleanStr.match(/^(-?\d*\.?\d+)$/);
    if (realOnlyMatch) {
      return { real: parseFloat(realOnlyMatch[1]), imaginary: 0 };
    }
    
    const complexMatch = cleanStr.match(/^(-?\d*\.?\d+)?([+-])?(\d*\.?\d+)?i$/);
    if (complexMatch) {
      const real = complexMatch[1] ? parseFloat(complexMatch[1]) : 0;
      const sign = complexMatch[2] === '-' ? -1 : 1;
      const imagPart = complexMatch[3] ? parseFloat(complexMatch[3]) : 1;
      return { real, imaginary: sign * imagPart };
    }
    
    return { real: 0, imaginary: 0 };
  };

  // Format complex number for display
  const formatComplexNumber = (num: ComplexNumber): string => {
    if (num.imaginary === 0) return num.real.toFixed(3);
    if (num.real === 0) {
      if (num.imaginary === 1) return 'i';
      if (num.imaginary === -1) return '-i';
      return `${num.imaginary.toFixed(3)}i`;
    }
    const sign = num.imaginary >= 0 ? '+' : '';
    return `${num.real.toFixed(3)}${sign}${num.imaginary.toFixed(3)}i`;
  };

  // Validate if matrix is unitary
  const isUnitary = (matrix: ComplexNumber[][]): boolean => {
    const n = matrix.length;
    
    // Calculate conjugate transpose
    const conjugateTranspose = Array(n).fill(null).map(() => Array(n).fill(null));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        conjugateTranspose[i][j] = {
          real: matrix[j][i].real,
          imaginary: -matrix[j][i].imaginary
        };
      }
    }
    
    // Multiply matrix by its conjugate transpose
    const product = Array(n).fill(null).map(() => Array(n).fill(null));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let sum = { real: 0, imaginary: 0 };
        for (let k = 0; k < n; k++) {
          // Complex multiplication: (a+bi)(c+di) = (ac-bd) + (ad+bc)i
          const a = matrix[i][k];
          const b = conjugateTranspose[k][j];
          sum.real += a.real * b.real - a.imaginary * b.imaginary;
          sum.imaginary += a.real * b.imaginary + a.imaginary * b.real;
        }
        product[i][j] = sum;
      }
    }
    
    // Check if product is identity matrix (within tolerance)
    const tolerance = 1e-10;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const expected = i === j ? 1 : 0;
        if (Math.abs(product[i][j].real - expected) > tolerance || 
            Math.abs(product[i][j].imaginary) > tolerance) {
          return false;
        }
      }
    }
    
    return true;
  };

  const handleMatrixSizeChange = (size: number) => {
    setMatrixSize(size);
    initializeMatrix(size);
  };

  const handleMatrixValueChange = (row: number, col: number, value: string) => {
    const newMatrix = [...matrixValues];
    newMatrix[row][col] = value;
    setMatrixValues(newMatrix);
  };

  const handleCreateGate = () => {
    if (!newGateName.trim()) {
      toast.error('Please enter a gate name');
      return;
    }

    try {
      // Parse matrix values
      const matrix = matrixValues.map(row =>
        row.map(val => parseComplexNumber(val))
      );

      // Validate unitarity
      const isValidUnitary = isUnitary(matrix);
      
      const newGate: CustomGate = {
        id: `custom_${Date.now()}`,
        name: newGateName.trim(),
        matrix,
        qubits: Math.log2(matrixSize),
        description: newGateDescription.trim() || undefined,
        isValid: isValidUnitary
      };

      if (!isValidUnitary) {
        toast.error('Matrix is not unitary! Please check your values.');
        return;
      }

      setGates([...gates, newGate]);
      onGateCreated(newGate);
      setIsCreating(false);
      setNewGateName('');
      setNewGateDescription('');
      initializeMatrix(2);
      setMatrixSize(2);
      
      toast.success(`Custom gate "${newGate.name}" created successfully!`);
    } catch (error) {
      toast.error('Error parsing matrix values. Please check your input.');
    }
  };

  const handleDeleteGate = (gateId: string) => {
    setGates(gates.filter(g => g.id !== gateId));
    if (selectedGate?.id === gateId) {
      setSelectedGate(null);
    }
    toast.success('Custom gate deleted');
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow font-mono flex items-center gap-2">
          🔧 Custom Gate Manager
          <Button
            size="sm"
            onClick={() => setIsCreating(true)}
            className="ml-auto bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Gate
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gates">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gates">My Gates</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="gates" className="space-y-4">
            {isCreating && (
              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-sm text-quantum-neon">Create New Gate</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Gate Name</Label>
                      <Input
                        value={newGateName}
                        onChange={(e) => setNewGateName(e.target.value)}
                        placeholder="e.g., My Gate"
                        className="quantum-panel neon-border"
                      />
                    </div>
                    <div>
                      <Label>Matrix Size</Label>
                      <select
                        value={matrixSize}
                        onChange={(e) => handleMatrixSizeChange(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded quantum-panel neon-border"
                      >
                        <option value={2}>2×2 (1 qubit)</option>
                        <option value={4}>4×4 (2 qubits)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Description (optional)</Label>
                    <Input
                      value={newGateDescription}
                      onChange={(e) => setNewGateDescription(e.target.value)}
                      placeholder="Brief description of the gate"
                      className="quantum-panel neon-border"
                    />
                  </div>

                  <div>
                    <Label>Unitary Matrix</Label>
                    <div className="grid gap-2 p-4 quantum-panel rounded" style={{ gridTemplateColumns: `repeat(${matrixSize}, 1fr)` }}>
                      {matrixValues.map((row, i) =>
                        row.map((val, j) => (
                          <Input
                            key={`${i}-${j}`}
                            value={val}
                            onChange={(e) => handleMatrixValueChange(i, j, e.target.value)}
                            placeholder="0"
                            className="text-center text-xs quantum-panel neon-border"
                          />
                        ))
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Enter complex numbers as: real, imaginary (i), or real±imaginary*i (e.g., 1+0.5i)
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateGate}
                      className="bg-quantum-glow text-quantum-void hover:bg-quantum-neon"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Create Gate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreating(false)}
                      className="neon-border"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              {gates.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No custom gates created yet. Click "New Gate" to create your first custom unitary gate.
                  </AlertDescription>
                </Alert>
              ) : (
                gates.map((gate) => (
                  <div
                    key={gate.id}
                    className="flex items-center justify-between p-3 quantum-panel rounded neon-border hover:bg-quantum-matrix/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-quantum-particle rounded flex items-center justify-center text-xs font-bold">
                        {gate.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-quantum-glow">{gate.name}</div>
                        {gate.description && (
                          <div className="text-xs text-muted-foreground">{gate.description}</div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={gate.isValid ? "default" : "destructive"}>
                            {gate.isValid ? 'Unitary' : 'Invalid'}
                          </Badge>
                          <span className="text-xs text-quantum-neon">
                            {gate.qubits} qubit{gate.qubits !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedGate(gate)}
                        className="text-quantum-particle hover:text-quantum-glow"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteGate(gate.id)}
                        className="text-destructive hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview">
            {selectedGate ? (
              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow flex items-center gap-2">
                    {selectedGate.name}
                    <Badge variant={selectedGate.isValid ? "default" : "destructive"}>
                      {selectedGate.isValid ? 'Unitary' : 'Invalid'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedGate.description && (
                    <p className="text-sm text-muted-foreground">{selectedGate.description}</p>
                  )}
                  
                  <div>
                    <Label className="text-quantum-neon">Unitary Matrix</Label>
                    <div className="mt-2 p-4 quantum-panel rounded">
                      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${selectedGate.matrix.length}, 1fr)` }}>
                        {selectedGate.matrix.map((row, i) =>
                          row.map((val, j) => (
                            <div
                              key={`${i}-${j}`}
                              className="text-center text-xs font-mono p-2 bg-quantum-matrix rounded"
                            >
                              {formatComplexNumber(val)}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <div>Qubits: {selectedGate.qubits}</div>
                    <div>Matrix Size: {selectedGate.matrix.length}×{selectedGate.matrix.length}</div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertDescription>
                  Select a gate from the "My Gates" tab to preview its matrix and properties.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
