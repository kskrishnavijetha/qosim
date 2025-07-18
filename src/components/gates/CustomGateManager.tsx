import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Check, X, Eye, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { CustomGate, validateUnitaryMatrix, parseMatrixInput } from '@/lib/customGates';
import { CustomGatePreview } from './CustomGatePreview';

interface CustomGateManagerProps {
  onGateCreated: (gate: CustomGate) => void;
  onGateDeleted: (gateId: string) => void;
  customGates: CustomGate[];
}

export function CustomGateManager({ onGateCreated, onGateDeleted, customGates }: CustomGateManagerProps) {
  const [gateName, setGateName] = useState('');
  const [gateDescription, setGateDescription] = useState('');
  const [matrixInput, setMatrixInput] = useState('');
  const [selectedSize, setSelectedSize] = useState<2 | 4 | 8>(2);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    errors: string[];
    matrix?: (number | [number, number])[][];
  } | null>(null);
  const [previewGate, setPreviewGate] = useState<CustomGate | null>(null);

  const handleMatrixInputChange = (value: string) => {
    setMatrixInput(value);
    
    if (value.trim()) {
      try {
        const matrix = parseMatrixInput(value, selectedSize);
        const validation = validateUnitaryMatrix(matrix);
        setValidationResult(validation);
        
        if (validation.isValid && validation.matrix) {
          setPreviewGate({
            id: 'preview',
            name: gateName || 'Preview',
            description: gateDescription,
            matrix: validation.matrix,
            size: selectedSize,
            qubits: Math.log2(selectedSize),
            color: '#3b82f6',
            createdAt: new Date().toISOString()
          });
        } else {
          setPreviewGate(null);
        }
      } catch (error) {
        setValidationResult({
          isValid: false,
          errors: [error instanceof Error ? error.message : 'Invalid matrix format']
        });
        setPreviewGate(null);
      }
    } else {
      setValidationResult(null);
      setPreviewGate(null);
    }
  };

  const handleSizeChange = (size: 2 | 4 | 8) => {
    setSelectedSize(size);
    setMatrixInput('');
    setValidationResult(null);
    setPreviewGate(null);
  };

  const handleCreateGate = () => {
    if (!gateName.trim()) {
      toast.error('Gate name is required');
      return;
    }

    if (!validationResult?.isValid || !validationResult.matrix) {
      toast.error('Please provide a valid unitary matrix');
      return;
    }

    // Check for duplicate names
    if (customGates.some(gate => gate.name.toLowerCase() === gateName.toLowerCase())) {
      toast.error('Gate name already exists');
      return;
    }

    const newGate: CustomGate = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: gateName,
      description: gateDescription,
      matrix: validationResult.matrix,
      size: selectedSize,
      qubits: Math.log2(selectedSize),
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      createdAt: new Date().toISOString()
    };

    onGateCreated(newGate);
    
    // Reset form
    setGateName('');
    setGateDescription('');
    setMatrixInput('');
    setValidationResult(null);
    setPreviewGate(null);
    
    toast.success('Custom gate created successfully!');
  };

  const getMatrixTemplate = (size: number) => {
    switch (size) {
      case 2:
        return '[[1, 0],\n [0, 1]]';
      case 4:
        return '[[1, 0, 0, 0],\n [0, 1, 0, 0],\n [0, 0, 1, 0],\n [0, 0, 0, 1]]';
      case 8:
        return '[[1, 0, 0, 0, 0, 0, 0, 0],\n [0, 1, 0, 0, 0, 0, 0, 0],\n [0, 0, 1, 0, 0, 0, 0, 0],\n [0, 0, 0, 1, 0, 0, 0, 0],\n [0, 0, 0, 0, 1, 0, 0, 0],\n [0, 0, 0, 0, 0, 1, 0, 0],\n [0, 0, 0, 0, 0, 0, 1, 0],\n [0, 0, 0, 0, 0, 0, 0, 1]]';
      default:
        return '';
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-quantum-glow">
          <Plus className="w-5 h-5" />
          Custom Gate Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Gate</TabsTrigger>
            <TabsTrigger value="library">Gate Library ({customGates.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gateName">Gate Name</Label>
                  <Input
                    id="gateName"
                    value={gateName}
                    onChange={(e) => setGateName(e.target.value)}
                    placeholder="e.g., MyGate"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="gateDescription">Description (optional)</Label>
                  <Input
                    id="gateDescription"
                    value={gateDescription}
                    onChange={(e) => setGateDescription(e.target.value)}
                    placeholder="Brief description of the gate"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Gate Size</Label>
                  <div className="flex gap-2 mt-1">
                    {[2, 4, 8].map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSizeChange(size as 2 | 4 | 8)}
                      >
                        {size}×{size} ({size === 2 ? '1' : size === 4 ? '2' : '3'} qubit{size > 2 ? 's' : ''})
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="matrixInput">Unitary Matrix</Label>
                  <Textarea
                    id="matrixInput"
                    value={matrixInput}
                    onChange={(e) => handleMatrixInputChange(e.target.value)}
                    placeholder={`Enter ${selectedSize}×${selectedSize} matrix as JSON array:\n${getMatrixTemplate(selectedSize)}`}
                    className="mt-1 font-mono text-sm"
                    rows={selectedSize + 2}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use complex numbers as [real, imaginary] or simple numbers for real values
                  </p>
                </div>

                {/* Validation Result */}
                {validationResult && (
                  <Alert variant={validationResult.isValid ? "default" : "destructive"}>
                    <div className="flex items-center gap-2">
                      {validationResult.isValid ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      <AlertDescription>
                        {validationResult.isValid ? (
                          <span className="text-green-600">✓ Valid unitary matrix</span>
                        ) : (
                          <div>
                            <span className="font-medium">Validation errors:</span>
                            <ul className="list-disc list-inside mt-1">
                              {validationResult.errors.map((error, i) => (
                                <li key={i} className="text-sm">{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </AlertDescription>
                    </div>
                  </Alert>
                )}

                <Button
                  onClick={handleCreateGate}
                  disabled={!validationResult?.isValid || !gateName.trim()}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Create Custom Gate
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <Label>Live Preview</Label>
                </div>
                
                {previewGate ? (
                  <CustomGatePreview gate={previewGate} />
                ) : (
                  <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center text-muted-foreground">
                    Enter a valid matrix to see preview
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            {customGates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No custom gates created yet</p>
                <p className="text-sm">Create your first custom gate to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customGates.map((gate) => (
                  <Card key={gate.id} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{gate.name}</CardTitle>
                        <Badge variant="outline" style={{ backgroundColor: gate.color + '20', borderColor: gate.color }}>
                          {gate.size}×{gate.size}
                        </Badge>
                      </div>
                      {gate.description && (
                        <p className="text-xs text-muted-foreground">{gate.description}</p>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CustomGatePreview gate={gate} compact />
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onGateDeleted(gate.id)}
                          className="flex-1"
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
