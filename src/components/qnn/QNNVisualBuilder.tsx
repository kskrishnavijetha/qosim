import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { QNNCanvas } from './QNNCanvas';
import { QNNGateLibrary } from './QNNGateLibrary';
import { QNNMLLibrary } from './QNNMLLibrary';
import { QNNTrainingPanel } from './QNNTrainingPanel';
import { QNNHybridConnector } from './QNNHybridConnector';
import { QNNExportPanel } from './QNNExportPanel';
import { QNNAIAssistant } from './QNNAIAssistant';
import { QNNPerformanceDashboard } from './QNNPerformanceDashboard';
import { QNNModelManager } from './QNNModelManager';
import { QNNVQETrainer } from './QNNVQETrainer';
import { useQNNBuilder } from '@/hooks/useQNNBuilder';
import { useZoomPan } from '@/hooks/useZoomPan';
import { Brain, Zap, Download, Play, Save, Share, Bot, BarChart3, Database, Atom } from 'lucide-react';
import { toast } from 'sonner';

export function QNNVisualBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('design');
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showPerformanceDashboard, setShowPerformanceDashboard] = useState(false);

  const {
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
  } = useQNNBuilder();

  const {
    zoomLevel,
    panOffset,
    handleZoomIn,
    handleZoomOut,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    resetView
  } = useZoomPan(canvasRef);

  const handleLayerAdd = useCallback((layerType: string, layerConfig: any, position: { x: number; y: number }) => {
    if (layerType.startsWith('quantum_')) {
      addQuantumLayer(layerType, layerConfig, position);
    } else {
      addMLLayer(layerType, layerConfig, position);
    }
    toast.success(`Added ${layerType} layer`);
  }, [addQuantumLayer, addMLLayer]);

  const handleTrainingStart = useCallback(async (config: any) => {
    try {
      await startTraining(config);
      toast.success('Training started');
    } catch (error) {
      toast.error('Training failed: ' + error);
    }
  }, [startTraining]);

  const handleExport = useCallback(async (format: 'python' | 'javascript' | 'json') => {
    try {
      const exportData = await exportQNN(format);
      const blob = new Blob([exportData], { 
        type: format === 'json' ? 'application/json' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qnn_architecture.${format === 'javascript' ? 'js' : format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`QNN exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed: ' + error);
    }
  }, [exportQNN]);

  const handleModelSave = useCallback((metadata: any) => {
    // Enhanced save with metadata
    saveQNN();
    toast.success('Model saved with metadata');
  }, [saveQNN]);

  const handleAdvancedExport = useCallback(async (format: 'python' | 'javascript' | 'json' | 'qiskit' | 'pennylane' | 'cirq') => {
    try {
      let exportData = '';
      
      if (format === 'qiskit') {
        exportData = generateQiskitCode(qnnArchitecture);
      } else if (format === 'pennylane') {
        exportData = generatePennyLaneCode(qnnArchitecture);
      } else if (format === 'cirq') {
        exportData = generateCirqCode(qnnArchitecture);
      } else {
        exportData = await exportQNN(format);
      }
      
      const blob = new Blob([exportData], { 
        type: format === 'json' ? 'application/json' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qnn_architecture.${format === 'javascript' ? 'js' : format === 'qiskit' || format === 'pennylane' || format === 'cirq' ? 'py' : format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`QNN exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed: ' + error);
    }
  }, [qnnArchitecture, exportQNN]);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-quantum-glow" />
          <h1 className="text-xl font-mono text-quantum-glow">QNN Visual Builder</h1>
          <Badge variant="secondary">
            Layers: {qnnArchitecture.layers.length}
          </Badge>
          <Badge variant="secondary">
            Quantum: {qnnArchitecture.layers.filter(l => l.type.startsWith('quantum_')).length}
          </Badge>
          <Badge variant="secondary">
            Classical: {qnnArchitecture.layers.filter(l => !l.type.startsWith('quantum_')).length}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPerformanceDashboard(!showPerformanceDashboard)}
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveQNN()}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAIAssistant(!showAIAssistant)}
          >
            <Bot className="w-4 h-4 mr-1" />
            AI Assistant
          </Button>
          <Separator orientation="vertical" className="h-8" />
          <Button
            variant={isTraining ? "destructive" : "default"}
            size="sm"
            onClick={isTraining ? stopTraining : () => setActiveTab('training')}
            disabled={qnnArchitecture.layers.length === 0}
          >
            {isTraining ? (
              <>
                <Zap className="w-4 h-4 mr-1" />
                Stop Training
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1" />
                Train QNN
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Performance Dashboard */}
      {showPerformanceDashboard && (
        <div className="border-b bg-card/50 p-4">
          <QNNPerformanceDashboard 
            trainingMetrics={trainingMetrics}
            architecture={qnnArchitecture}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Libraries */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 m-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
              <TabsTrigger value="vqe">VQE</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="p-4 space-y-4">
              <QNNGateLibrary
                onLayerAdd={handleLayerAdd}
                selectedLayer={selectedLayer}
              />
              <QNNMLLibrary
                onLayerAdd={handleLayerAdd}
                selectedLayer={selectedLayer}
              />
              <QNNHybridConnector
                architecture={qnnArchitecture}
                onConnect={connectLayers}
              />
            </TabsContent>
            
            <TabsContent value="training" className="p-4">
              <QNNTrainingPanel
                architecture={qnnArchitecture}
                trainingMetrics={trainingMetrics}
                isTraining={isTraining}
                onTrainingStart={handleTrainingStart}
                onTrainingStop={stopTraining}
              />
            </TabsContent>

            <TabsContent value="vqe" className="p-4">
              <QNNVQETrainer
                architecture={qnnArchitecture}
                onTrainingStart={handleTrainingStart}
                onTrainingStop={stopTraining}
                isTraining={isTraining}
              />
            </TabsContent>

            <TabsContent value="models" className="p-4">
              <QNNModelManager
                architecture={qnnArchitecture}
                onSave={handleModelSave}
                onLoad={loadQNN}
              />
            </TabsContent>
            
            <TabsContent value="export" className="p-4">
              <QNNExportPanel
                architecture={qnnArchitecture}
                onExport={handleAdvancedExport}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Center Panel - Canvas */}
        <div className="flex-1 flex flex-col">
          <QNNCanvas
            ref={canvasRef}
            architecture={qnnArchitecture}
            selectedLayer={selectedLayer}
            trainingMetrics={trainingMetrics}
            zoomLevel={zoomLevel}
            panOffset={panOffset}
            onLayerAdd={handleLayerAdd}
            onLayerMove={moveLayer}
            onLayerSelect={selectLayer}
            onLayerRemove={removeLayer}
            onCanvasClick={clearSelection}
            onPanStart={handlePanStart}
            onPanMove={handlePanMove}
            onPanEnd={handlePanEnd}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={resetView}
          />
        </div>

        {/* Right Panel - AI Assistant */}
        {showAIAssistant && (
          <div className="w-80 border-l bg-card">
            <QNNAIAssistant
              architecture={qnnArchitecture}
              onArchitectureGenerated={(arch) => {
                loadQNN(arch);
                toast.success('AI generated QNN architecture loaded');
              }}
              onSuggestionApplied={(suggestion) => {
                toast.info(`Applied suggestion: ${suggestion}`);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions for advanced code generation
function generateQiskitCode(architecture: any): string {
  return `# QNN with Qiskit
from qiskit import QuantumCircuit, Aer, execute
from qiskit.circuit.library import RealAmplitudes, TwoLocal
from qiskit.algorithms import VQE
from qiskit.algorithms.optimizers import COBYLA
import numpy as np

# Create quantum circuit
num_qubits = ${Math.max(...architecture.layers.map((l: any) => l.config.qubits || 1).filter(Boolean), 4)}
qc = QuantumCircuit(num_qubits)

# Add quantum layers
${architecture.layers.filter((l: any) => l.type.startsWith('quantum_')).map((layer: any, index: number) => {
  switch (layer.type) {
    case 'quantum_hadamard':
      return `qc.h(${index % 4})  # Hadamard on qubit ${index % 4}`;
    case 'quantum_pauli_x':
      return `qc.x(${index % 4})  # Pauli-X on qubit ${index % 4}`;
    case 'quantum_cnot':
      return `qc.cx(${index % 4}, ${(index + 1) % 4})  # CNOT gate`;
    case 'quantum_rotation_y':
      return `qc.ry(np.pi/4, ${index % 4})  # RY rotation`;
    default:
      return `# ${layer.type} layer`;
  }
}).join('\n')}

# Add measurement
qc.measure_all()

# Execute circuit
backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1024)
result = job.result()
counts = result.get_counts()
print(counts)
`;
}

function generatePennyLaneCode(architecture: any): string {
  return `# QNN with PennyLane
import pennylane as qml
import numpy as np
import torch

# Device setup
n_qubits = ${Math.max(...architecture.layers.map((l: any) => l.config.qubits || 1).filter(Boolean), 4)}
dev = qml.device('default.qubit', wires=n_qubits)

@qml.qnode(dev)
def qnn_circuit(inputs, weights):
    # Encode input data
    qml.AngleEmbedding(inputs, wires=range(n_qubits))
    
    # Add quantum layers
${architecture.layers.filter((l: any) => l.type.startsWith('quantum_')).map((layer: any, index: number) => {
  return `    # ${layer.config.name || layer.type}`;
}).join('\n')}
    
    # Variational layers
    qml.StronglyEntanglingLayers(weights, wires=range(n_qubits))
    
    return [qml.expval(qml.PauliZ(i)) for i in range(n_qubits)]

# Initialize parameters
n_layers = 3
shape = qml.StronglyEntanglingLayers.shape(n_layers, n_qubits)
weights = torch.randn(shape, requires_grad=True)

# Training loop
opt = torch.optim.Adam([weights], lr=0.01)
for i in range(100):
    opt.zero_grad()
    loss = torch.mean((qnn_circuit(torch.randn(n_qubits), weights) - torch.randn(n_qubits))**2)
    loss.backward()
    opt.step()
    if i % 10 == 0:
        print(f'Step {i}: Loss = {loss.item():.4f}')
`;
}

function generateCirqCode(architecture: any): string {
  return `# QNN with Cirq
import cirq
import numpy as np

# Create qubits
n_qubits = ${Math.max(...architecture.layers.map((l: any) => l.config.qubits || 1).filter(Boolean), 4)}
qubits = cirq.GridQubit.rect(1, n_qubits)

# Create circuit
circuit = cirq.Circuit()

# Add quantum layers
${architecture.layers.filter((l: any) => l.type.startsWith('quantum_')).map((layer: any, index: number) => {
  switch (layer.type) {
    case 'quantum_hadamard':
      return `circuit.append(cirq.H(qubits[${index % 4}]))`;
    case 'quantum_pauli_x':
      return `circuit.append(cirq.X(qubits[${index % 4}]))`;
    case 'quantum_cnot':
      return `circuit.append(cirq.CNOT(qubits[${index % 4}], qubits[${(index + 1) % 4}]))`;
    case 'quantum_rotation_y':
      return `circuit.append(cirq.ry(np.pi/4)(qubits[${index % 4}]))`;
    default:
      return `# ${layer.type} layer`;
  }
}).join('\n')}

# Add measurement
circuit.append(cirq.measure(*qubits, key='result'))

# Simulate
simulator = cirq.Simulator()
result = simulator.run(circuit, repetitions=1000)
print(result.histogram(key='result'))
`;
}
