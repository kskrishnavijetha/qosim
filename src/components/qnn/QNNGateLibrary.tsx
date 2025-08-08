
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QNNLayer } from '@/hooks/useQNNBuilder';
import { Zap, RotateCcw } from 'lucide-react';

interface QNNGateLibraryProps {
  onLayerAdd: (layerType: string, config: any, position: { x: number; y: number }) => void;
  selectedLayer: QNNLayer | null;
}

const quantumGates = [
  { type: 'quantum_pauli_x', name: 'Pauli-X', icon: 'X', color: 'bg-red-500', description: 'Quantum NOT gate' },
  { type: 'quantum_pauli_y', name: 'Pauli-Y', icon: 'Y', color: 'bg-green-500', description: 'Pauli-Y rotation' },
  { type: 'quantum_pauli_z', name: 'Pauli-Z', icon: 'Z', color: 'bg-blue-500', description: 'Phase flip gate' },
  { type: 'quantum_hadamard', name: 'Hadamard', icon: 'H', color: 'bg-purple-500', description: 'Superposition gate' },
  { type: 'quantum_cnot', name: 'CNOT', icon: '⊕', color: 'bg-cyan-500', description: 'Controlled NOT' },
  { type: 'quantum_rotation_x', name: 'RX', icon: 'Rx', color: 'bg-orange-500', description: 'X-axis rotation' },
  { type: 'quantum_rotation_y', name: 'RY', icon: 'Ry', color: 'bg-pink-500', description: 'Y-axis rotation' },
  { type: 'quantum_rotation_z', name: 'RZ', icon: 'Rz', color: 'bg-indigo-500', description: 'Z-axis rotation' },
];

const quantumLayers = [
  { 
    type: 'quantum_variational', 
    name: 'Variational Layer', 
    icon: '🌀', 
    description: 'Parametric quantum layer with trainable parameters',
    config: { qubits: 4, layers: 2, entangling: 'circular' }
  },
  { 
    type: 'quantum_convolution', 
    name: 'Quantum Conv', 
    icon: '🔍', 
    description: 'Quantum convolution for image processing',
    config: { qubits: 4, kernel_size: 2, stride: 1 }
  },
  { 
    type: 'quantum_perceptron', 
    name: 'Quantum Perceptron', 
    icon: '🧠', 
    description: 'Single-layer quantum perceptron',
    config: { qubits: 4, activation: 'measurement' }
  },
  { 
    type: 'quantum_entangling', 
    name: 'Entangling Layer', 
    icon: '🔗', 
    description: 'Create entanglement between qubits',
    config: { qubits: 4, pattern: 'linear' }
  },
  { 
    type: 'quantum_measurement', 
    name: 'Measurement', 
    icon: '📏', 
    description: 'Quantum measurement to classical output',
    config: { qubits: 4, basis: 'computational' }
  }
];

export function QNNGateLibrary({ onLayerAdd, selectedLayer }: QNNGateLibraryProps) {
  const handleGateClick = (gate: any) => {
    const defaultConfig = {
      name: gate.name,
      qubits: gate.type === 'quantum_cnot' ? 2 : 1,
      parameters: gate.type.includes('rotation') ? { angle: Math.PI / 4 } : {}
    };
    
    onLayerAdd(gate.type, defaultConfig, { x: 100, y: 100 });
  };

  const handleLayerClick = (layer: any) => {
    onLayerAdd(layer.type, { ...layer.config, name: layer.name }, { x: 100, y: 100 });
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Quantum Gates & Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Quantum Gates */}
        <div>
          <h4 className="text-xs font-semibold text-quantum-neon mb-2">Basic Gates</h4>
          <div className="grid grid-cols-2 gap-2">
            {quantumGates.map((gate) => (
              <Button
                key={gate.type}
                variant="outline"
                size="sm"
                className="h-12 flex flex-col items-center justify-center p-1 neon-border hover:bg-quantum-glow/20"
                onClick={() => handleGateClick(gate)}
                title={gate.description}
              >
                <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white mb-1 ${gate.color}`}>
                  {gate.icon}
                </div>
                <div className="text-xs">{gate.name}</div>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Quantum ML Layers */}
        <div>
          <h4 className="text-xs font-semibold text-quantum-neon mb-2">Quantum ML Layers</h4>
          <div className="space-y-2">
            {quantumLayers.map((layer) => (
              <Button
                key={layer.type}
                variant="outline"
                size="sm"
                className="w-full h-auto p-3 text-left justify-start neon-border hover:bg-quantum-glow/20"
                onClick={() => handleLayerClick(layer)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg">{layer.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-quantum-glow">{layer.name}</div>
                    <div className="text-xs text-muted-foreground">{layer.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Layer Info */}
        {selectedLayer && selectedLayer.type.startsWith('quantum_') && (
          <>
            <Separator />
            <div className="p-3 bg-quantum-matrix/30 rounded-lg border border-quantum-neon/20">
              <div className="text-xs font-semibold text-quantum-glow mb-2">Selected Quantum Layer</div>
              <div className="space-y-1 text-xs">
                <div><span className="text-quantum-neon">Type:</span> {selectedLayer.type}</div>
                <div><span className="text-quantum-neon">Name:</span> {selectedLayer.config.name}</div>
                {selectedLayer.config.qubits && (
                  <div><span className="text-quantum-neon">Qubits:</span> {selectedLayer.config.qubits}</div>
                )}
                {selectedLayer.config.parameters && Object.keys(selectedLayer.config.parameters).length > 0 && (
                  <div>
                    <span className="text-quantum-neon">Parameters:</span>
                    {Object.entries(selectedLayer.config.parameters).map(([key, value]) => (
                      <div key={key} className="ml-2">
                        {key}: {typeof value === 'number' ? value.toFixed(3) : String(value)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
