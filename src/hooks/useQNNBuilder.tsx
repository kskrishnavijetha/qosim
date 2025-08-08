
import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

export interface QNNLayer {
  id: string;
  type: string;
  position: { x: number; y: number };
  config: {
    name: string;
    [key: string]: any;
  };
  connections: {
    inputs: string[];
    outputs: string[];
  };
}

export interface QNNArchitecture {
  id: string;
  name: string;
  layers: QNNLayer[];
  connections: Array<{
    from: string;
    to: string;
    type: 'quantum_to_classical' | 'classical_to_quantum' | 'quantum_to_quantum' | 'classical_to_classical';
  }>;
  metadata: {
    created: string;
    modified: string;
    totalParameters: number;
  };
}

export interface TrainingMetrics {
  currentEpoch: number;
  totalEpochs: number;
  currentLoss: number;
  currentAccuracy: number;
  lossHistory: number[];
  accuracyHistory: number[];
  isTraining: boolean;
}

export function useQNNBuilder() {
  const [qnnArchitecture, setQNNArchitecture] = useState<QNNArchitecture>({
    id: nanoid(),
    name: 'Untitled QNN',
    layers: [],
    connections: [],
    metadata: {
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      totalParameters: 0
    }
  });

  const [selectedLayer, setSelectedLayer] = useState<QNNLayer | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingMetrics, setTrainingMetrics] = useState<TrainingMetrics | null>(null);

  const addQuantumLayer = useCallback((layerType: string, config: any, position: { x: number; y: number }) => {
    const newLayer: QNNLayer = {
      id: nanoid(),
      type: layerType,
      position,
      config: {
        ...config,
        name: config.name || layerType.replace('quantum_', '').toUpperCase()
      },
      connections: {
        inputs: [],
        outputs: []
      }
    };

    setQNNArchitecture(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer],
      metadata: {
        ...prev.metadata,
        modified: new Date().toISOString(),
        totalParameters: prev.metadata.totalParameters + (config.qubits || 1) * (config.parameters ? Object.keys(config.parameters).length : 1)
      }
    }));
  }, []);

  const addMLLayer = useCallback((layerType: string, config: any, position: { x: number; y: number }) => {
    const newLayer: QNNLayer = {
      id: nanoid(),
      type: layerType,
      position,
      config: {
        ...config,
        name: config.name || layerType.toUpperCase()
      },
      connections: {
        inputs: [],
        outputs: []
      }
    };

    setQNNArchitecture(prev => ({
      ...prev,
      layers: [...prev.layers, newLayer],
      metadata: {
        ...prev.metadata,
        modified: new Date().toISOString(),
        totalParameters: prev.metadata.totalParameters + (config.units || config.filters || 1)
      }
    }));
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    setQNNArchitecture(prev => ({
      ...prev,
      layers: prev.layers.filter(layer => layer.id !== layerId),
      connections: prev.connections.filter(conn => conn.from !== layerId && conn.to !== layerId),
      metadata: {
        ...prev.metadata,
        modified: new Date().toISOString()
      }
    }));

    if (selectedLayer?.id === layerId) {
      setSelectedLayer(null);
    }
  }, [selectedLayer]);

  const moveLayer = useCallback((layerId: string, newPosition: { x: number; y: number }) => {
    setQNNArchitecture(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === layerId
          ? { ...layer, position: newPosition }
          : layer
      ),
      metadata: {
        ...prev.metadata,
        modified: new Date().toISOString()
      }
    }));
  }, []);

  const updateLayerParams = useCallback((layerId: string, params: any) => {
    setQNNArchitecture(prev => ({
      ...prev,
      layers: prev.layers.map(layer =>
        layer.id === layerId
          ? { ...layer, config: { ...layer.config, ...params } }
          : layer
      ),
      metadata: {
        ...prev.metadata,
        modified: new Date().toISOString()
      }
    }));
  }, []);

  const selectLayer = useCallback((layer: QNNLayer) => {
    setSelectedLayer(layer);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedLayer(null);
  }, []);

  const connectLayers = useCallback((fromLayerId: string, toLayerId: string) => {
    const fromLayer = qnnArchitecture.layers.find(l => l.id === fromLayerId);
    const toLayer = qnnArchitecture.layers.find(l => l.id === toLayerId);

    if (!fromLayer || !toLayer) return;

    const connectionType = 
      fromLayer.type.startsWith('quantum_') && toLayer.type.startsWith('quantum_') ? 'quantum_to_quantum' :
      fromLayer.type.startsWith('quantum_') && !toLayer.type.startsWith('quantum_') ? 'quantum_to_classical' :
      !fromLayer.type.startsWith('quantum_') && toLayer.type.startsWith('quantum_') ? 'classical_to_quantum' :
      'classical_to_classical';

    setQNNArchitecture(prev => ({
      ...prev,
      connections: [...prev.connections, { from: fromLayerId, to: toLayerId, type: connectionType }],
      metadata: {
        ...prev.metadata,
        modified: new Date().toISOString()
      }
    }));

    toast.success(`Connected ${fromLayer.config.name} to ${toLayer.config.name}`);
  }, [qnnArchitecture.layers]);

  const startTraining = useCallback(async (config: any) => {
    setIsTraining(true);
    setTrainingMetrics({
      currentEpoch: 0,
      totalEpochs: config.epochs || 10,
      currentLoss: 0,
      currentAccuracy: 0,
      lossHistory: [],
      accuracyHistory: [],
      isTraining: true
    });

    // Simulate training process
    for (let epoch = 0; epoch < (config.epochs || 10); epoch++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const loss = Math.exp(-epoch * 0.1) + Math.random() * 0.1;
      const accuracy = Math.min(95, (1 - Math.exp(-epoch * 0.1)) * 100 + Math.random() * 5);

      setTrainingMetrics(prev => prev ? {
        ...prev,
        currentEpoch: epoch + 1,
        currentLoss: loss,
        currentAccuracy: accuracy,
        lossHistory: [...prev.lossHistory, loss],
        accuracyHistory: [...prev.accuracyHistory, accuracy]
      } : null);

      if (!isTraining) break;
    }

    setIsTraining(false);
    setTrainingMetrics(prev => prev ? { ...prev, isTraining: false } : null);
  }, [isTraining]);

  const stopTraining = useCallback(() => {
    setIsTraining(false);
    setTrainingMetrics(prev => prev ? { ...prev, isTraining: false } : null);
  }, []);

  const exportQNN = useCallback(async (format: 'python' | 'javascript' | 'json') => {
    if (format === 'json') {
      return JSON.stringify(qnnArchitecture, null, 2);
    } else if (format === 'python') {
      return generatePythonCode(qnnArchitecture);
    } else {
      return generateJavaScriptCode(qnnArchitecture);
    }
  }, [qnnArchitecture]);

  const saveQNN = useCallback(async () => {
    try {
      const data = JSON.stringify(qnnArchitecture);
      localStorage.setItem('qnn_architecture', data);
      toast.success('QNN architecture saved');
    } catch (error) {
      toast.error('Failed to save QNN architecture');
    }
  }, [qnnArchitecture]);

  const loadQNN = useCallback(async (architecture?: QNNArchitecture) => {
    try {
      if (architecture) {
        setQNNArchitecture(architecture);
      } else {
        const data = localStorage.getItem('qnn_architecture');
        if (data) {
          setQNNArchitecture(JSON.parse(data));
          toast.success('QNN architecture loaded');
        }
      }
    } catch (error) {
      toast.error('Failed to load QNN architecture');
    }
  }, []);

  const clearArchitecture = useCallback(() => {
    setQNNArchitecture({
      id: nanoid(),
      name: 'Untitled QNN',
      layers: [],
      connections: [],
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        totalParameters: 0
      }
    });
    setSelectedLayer(null);
    setTrainingMetrics(null);
  }, []);

  return {
    qnnArchitecture,
    selectedLayer,
    isTraining,
    trainingMetrics,
    addQuantumLayer,
    addMLLayer,
    removeLayer,
    moveLayer,
    updateLayerParams,
    selectLayer,
    clearSelection,
    connectLayers,
    startTraining,
    stopTraining,
    exportQNN,
    saveQNN,
    loadQNN,
    clearArchitecture
  };
}

function generatePythonCode(architecture: QNNArchitecture): string {
  let code = `# Quantum Neural Network: ${architecture.name}\n`;
  code += `# Generated by QOSim QNN Visual Builder\n\n`;
  code += `import tensorflow as tf\n`;
  code += `import tensorflow_quantum as tfq\n`;
  code += `import cirq\n`;
  code += `import numpy as np\n\n`;
  
  code += `class QuantumNeuralNetwork(tf.keras.Model):\n`;
  code += `    def __init__(self):\n`;
  code += `        super().__init__()\n`;
  
  // Add layers
  architecture.layers.forEach((layer, index) => {
    if (layer.type.startsWith('quantum_')) {
      code += `        self.${layer.config.name.toLowerCase()}_${index} = self.build_quantum_layer("${layer.type}", ${JSON.stringify(layer.config)})\n`;
    } else {
      code += `        self.${layer.config.name.toLowerCase()}_${index} = self.build_classical_layer("${layer.type}", ${JSON.stringify(layer.config)})\n`;
    }
  });
  
  code += `\n    def call(self, inputs):\n`;
  code += `        x = inputs\n`;
  
  // Add forward pass
  architecture.layers.forEach((layer, index) => {
    code += `        x = self.${layer.config.name.toLowerCase()}_${index}(x)\n`;
  });
  
  code += `        return x\n\n`;
  code += `# Create and compile model\n`;
  code += `model = QuantumNeuralNetwork()\n`;
  code += `model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])\n`;
  
  return code;
}

function generateJavaScriptCode(architecture: QNNArchitecture): string {
  let code = `// Quantum Neural Network: ${architecture.name}\n`;
  code += `// Generated by QOSim QNN Visual Builder\n\n`;
  code += `import * as tf from '@tensorflow/tfjs';\n`;
  code += `import { QOSimSDK } from 'qosim-sdk';\n\n`;
  
  code += `class QuantumNeuralNetwork {\n`;
  code += `  constructor() {\n`;
  code += `    this.sdk = new QOSimSDK();\n`;
  code += `    this.layers = [];\n`;
  
  // Add layers
  architecture.layers.forEach((layer, index) => {
    if (layer.type.startsWith('quantum_')) {
      code += `    this.layers.push(this.buildQuantumLayer('${layer.type}', ${JSON.stringify(layer.config)}));\n`;
    } else {
      code += `    this.layers.push(this.buildClassicalLayer('${layer.type}', ${JSON.stringify(layer.config)}));\n`;
    }
  });
  
  code += `  }\n\n`;
  code += `  async predict(inputs) {\n`;
  code += `    let x = inputs;\n`;
  code += `    for (const layer of this.layers) {\n`;
  code += `      x = await layer.call(x);\n`;
  code += `    }\n`;
  code += `    return x;\n`;
  code += `  }\n`;
  code += `}\n\n`;
  code += `// Create model instance\n`;
  code += `const model = new QuantumNeuralNetwork();\n`;
  
  return code;
}
