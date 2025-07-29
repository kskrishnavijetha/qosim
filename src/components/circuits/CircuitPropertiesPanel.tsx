
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CircuitGate, CircuitQubit, QuantumCircuit, CircuitSimulationResult } from '@/hooks/useCircuitBuilder';
import { Trash2, Edit3, Info } from 'lucide-react';

interface CircuitPropertiesPanelProps {
  circuit: QuantumCircuit;
  selectedGate: CircuitGate | null;
  onGateUpdate: (gateId: string, params: { [key: string]: any }) => void;
  onQubitRemove: (qubitId: string) => void;
  simulationResult: CircuitSimulationResult | null;
}

export function CircuitPropertiesPanel({ 
  circuit, 
  selectedGate, 
  onGateUpdate, 
  onQubitRemove, 
  simulationResult 
}: CircuitPropertiesPanelProps) {
  const handleParamChange = (param: string, value: any) => {
    if (selectedGate) {
      onGateUpdate(selectedGate.id, { [param]: value });
    }
  };

  const renderGateProperties = () => {
    if (!selectedGate) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Gate Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Select a gate to view its properties
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Gate Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Gate Type</Label>
            <Badge variant="secondary">{selectedGate.type}</Badge>
          </div>

          <div className="space-y-2">
            <Label>Layer</Label>
            <div className="text-sm">{selectedGate.layer}</div>
          </div>

          <div className="space-y-2">
            <Label>Qubits</Label>
            <div className="flex flex-wrap gap-1">
              {selectedGate.qubits.map(qubitId => {
                const qubit = circuit.qubits.find(q => q.id === qubitId);
                return (
                  <Badge key={qubitId} variant="outline">
                    {qubit?.name || 'Unknown'}
                  </Badge>
                );
              })}
            </div>
          </div>

          {selectedGate.params?.angle !== undefined && (
            <div className="space-y-2">
              <Label>Angle (radians)</Label>
              <Input
                type="number"
                step="0.1"
                value={selectedGate.params.angle}
                onChange={(e) => handleParamChange('angle', parseFloat(e.target.value))}
              />
              <div className="text-xs text-muted-foreground">
                {(selectedGate.params.angle * 180 / Math.PI).toFixed(1)}°
              </div>
            </div>
          )}

          {selectedGate.metadata?.label && (
            <div className="space-y-2">
              <Label>Label</Label>
              <Input
                value={selectedGate.metadata.label}
                onChange={(e) => handleParamChange('label', e.target.value)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderQubitStates = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="w-4 h-4" />
            Qubit States
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {circuit.qubits.map(qubit => {
            const stateInfo = simulationResult?.qubitStates.find(
              qs => qs.qubit === qubit.id
            );
            
            return (
              <div key={qubit.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">{qubit.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onQubitRemove(qubit.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                {stateInfo ? (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      State: {stateInfo.state}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Probability: {(stateInfo.probability * 100).toFixed(1)}%
                    </div>
                    <Progress 
                      value={stateInfo.probability * 100} 
                      className="h-1"
                    />
                  </div>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {qubit.state}
                  </Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    );
  };

  const renderCircuitInfo = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Circuit Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Name</Label>
            <div className="text-sm">{circuit.name}</div>
          </div>
          
          {circuit.description && (
            <div className="space-y-2">
              <Label>Description</Label>
              <div className="text-sm text-muted-foreground">
                {circuit.description}
              </div>
            </div>
          )}
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Qubits:</span>
              <div className="font-mono">{circuit.qubits.length}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Gates:</span>
              <div className="font-mono">{circuit.gates.length}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Depth:</span>
              <div className="font-mono">{circuit.depth}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Version:</span>
              <div className="font-mono">{circuit.metadata.version}</div>
            </div>
          </div>
          
          {simulationResult && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Simulation Results</Label>
                <div className="text-xs space-y-1">
                  <div>
                    Fidelity: {(simulationResult.fidelity * 100).toFixed(2)}%
                  </div>
                  <div>
                    Execution Time: {simulationResult.executionTime.toFixed(2)}ms
                  </div>
                  <div>
                    Entanglement: {(simulationResult.entanglement.strength * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4 p-4">
      {renderGateProperties()}
      {renderQubitStates()}
      {renderCircuitInfo()}
    </div>
  );
}
