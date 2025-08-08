
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { QNNLayer } from '@/hooks/useQNNBuilder';
import { Brain } from 'lucide-react';

interface QNNMLLibraryProps {
  onLayerAdd: (layerType: string, config: any, position: { x: number; y: number }) => void;
  selectedLayer: QNNLayer | null;
}

const classicalLayers = [
  { 
    type: 'dense', 
    name: 'Dense', 
    icon: '🧠', 
    description: 'Fully connected layer',
    config: { units: 64, activation: 'relu', use_bias: true }
  },
  { 
    type: 'conv2d', 
    name: 'Conv2D', 
    icon: '🔍', 
    description: '2D convolution layer',
    config: { filters: 32, kernel_size: 3, activation: 'relu', padding: 'same' }
  },
  { 
    type: 'maxpooling2d', 
    name: 'MaxPool2D', 
    icon: '📐', 
    description: '2D max pooling layer',
    config: { pool_size: 2, strides: 2 }
  },
  { 
    type: 'dropout', 
    name: 'Dropout', 
    icon: '💧', 
    description: 'Regularization layer',
    config: { rate: 0.2 }
  },
  { 
    type: 'batchnorm', 
    name: 'BatchNorm', 
    icon: '📊', 
    description: 'Batch normalization',
    config: { momentum: 0.99, epsilon: 0.001 }
  },
  { 
    type: 'flatten', 
    name: 'Flatten', 
    icon: '📏', 
    description: 'Flatten multi-dimensional input',
    config: {}
  }
];

const activationFunctions = [
  { type: 'relu', name: 'ReLU', icon: '📈' },
  { type: 'sigmoid', name: 'Sigmoid', icon: '〰️' },
  { type: 'tanh', name: 'Tanh', icon: '🌊' },
  { type: 'softmax', name: 'Softmax', icon: '🎯' },
  { type: 'leaky_relu', name: 'LeakyReLU', icon: '📉' },
  { type: 'elu', name: 'ELU', icon: '🔀' }
];

export function QNNMLLibrary({ onLayerAdd, selectedLayer }: QNNMLLibraryProps) {
  const handleLayerClick = (layer: any) => {
    onLayerAdd(layer.type, { ...layer.config, name: layer.name }, { x: 100, y: 100 });
  };

  const handleActivationClick = (activation: any) => {
    const config = {
      name: activation.name,
      activation: activation.type
    };
    onLayerAdd('activation', config, { x: 100, y: 100 });
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-blue-400 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Classical ML Layers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Core ML Layers */}
        <div>
          <h4 className="text-xs font-semibold text-blue-300 mb-2">Core Layers</h4>
          <div className="space-y-2">
            {classicalLayers.map((layer) => (
              <Button
                key={layer.type}
                variant="outline"
                size="sm"
                className="w-full h-auto p-3 text-left justify-start border-blue-500/20 hover:bg-blue-500/20"
                onClick={() => handleLayerClick(layer)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-lg">{layer.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-blue-400">{layer.name}</div>
                    <div className="text-xs text-muted-foreground">{layer.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <Separator />

        {/* Activation Functions */}
        <div>
          <h4 className="text-xs font-semibold text-blue-300 mb-2">Activations</h4>
          <div className="grid grid-cols-2 gap-2">
            {activationFunctions.map((activation) => (
              <Button
                key={activation.type}
                variant="outline"
                size="sm"
                className="h-12 flex flex-col items-center justify-center p-1 border-blue-500/20 hover:bg-blue-500/20"
                onClick={() => handleActivationClick(activation)}
                title={activation.name}
              >
                <div className="text-lg mb-1">{activation.icon}</div>
                <div className="text-xs text-blue-400">{activation.name}</div>
              </Button>
            ))}
          </div>
        </div>

        {/* Selected Layer Info */}
        {selectedLayer && !selectedLayer.type.startsWith('quantum_') && (
          <>
            <Separator />
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="text-xs font-semibold text-blue-400 mb-2">Selected Classical Layer</div>
              <div className="space-y-1 text-xs">
                <div><span className="text-blue-300">Type:</span> {selectedLayer.type}</div>
                <div><span className="text-blue-300">Name:</span> {selectedLayer.config.name}</div>
                {Object.entries(selectedLayer.config).map(([key, value]) => {
                  if (key === 'name') return null;
                  return (
                    <div key={key}>
                      <span className="text-blue-300">{key}:</span> {String(value)}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
