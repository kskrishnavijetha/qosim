
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
import { useQNNBuilder } from '@/hooks/useQNNBuilder';
import { useZoomPan } from '@/hooks/useZoomPan';
import { Brain, Zap, Download, Play, Save, Share, Bot } from 'lucide-react';
import { toast } from 'sonner';

export function QNNVisualBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('design');
  const [showAIAssistant, setShowAIAssistant] = useState(false);

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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Libraries */}
        <div className="w-80 border-r bg-card overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 m-4">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
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
            
            <TabsContent value="export" className="p-4">
              <QNNExportPanel
                architecture={qnnArchitecture}
                onExport={handleExport}
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
