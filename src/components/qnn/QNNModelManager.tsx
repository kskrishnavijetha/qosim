
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QNNArchitecture } from '@/hooks/useQNNBuilder';
import { Save, FolderOpen, Share, History, Download, Upload, GitBranch, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface QNNModelManagerProps {
  architecture: QNNArchitecture;
  onSave: (metadata: any) => void;
  onLoad: (architecture: QNNArchitecture) => void;
}

interface SavedModel {
  id: string;
  name: string;
  architecture: QNNArchitecture;
  metadata: {
    description: string;
    tags: string[];
    dataset: string;
    performance: {
      accuracy: number;
      loss: number;
      trainingTime: number;
    };
    version: number;
    created: string;
    modified: string;
  };
}

export function QNNModelManager({ architecture, onSave, onLoad }: QNNModelManagerProps) {
  const [modelName, setModelName] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [dataset, setDataset] = useState('');
  const [savedModels, setSavedModels] = useState<SavedModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<SavedModel | null>(null);

  const handleSaveModel = () => {
    if (!modelName.trim()) {
      toast.error('Please enter a model name');
      return;
    }

    const newModel: SavedModel = {
      id: `model_${Date.now()}`,
      name: modelName,
      architecture: { ...architecture },
      metadata: {
        description,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        dataset,
        performance: {
          accuracy: Math.random() * 100,
          loss: Math.random() * 0.5,
          trainingTime: Math.random() * 120
        },
        version: 1,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }
    };

    setSavedModels(prev => [...prev, newModel]);
    onSave(newModel.metadata);
    toast.success(`Model "${modelName}" saved successfully`);
    
    // Clear form
    setModelName('');
    setDescription('');
    setTags('');
    setDataset('');
  };

  const handleLoadModel = (model: SavedModel) => {
    onLoad(model.architecture);
    setSelectedModel(model);
    toast.success(`Model "${model.name}" loaded successfully`);
  };

  const handleExportModel = (model: SavedModel, format: 'json' | 'zip') => {
    const exportData = {
      model: model.architecture,
      metadata: model.metadata,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${model.name}_v${model.metadata.version}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(`Model exported as ${format.toUpperCase()}`);
  };

  const handleShareModel = (model: SavedModel) => {
    const shareData = {
      title: `QNN Model: ${model.name}`,
      text: `Check out my Quantum Neural Network model with ${model.architecture.layers.length} layers!`,
      url: window.location.href + `?model=${model.id}`
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast.success('Shareable link copied to clipboard');
    }
  };

  const getCircuitStats = (arch: QNNArchitecture) => {
    const quantumLayers = arch.layers.filter(l => l.type.startsWith('quantum_'));
    const classicalLayers = arch.layers.filter(l => !l.type.startsWith('quantum_'));
    const circuitDepth = Math.max(1, arch.layers.length * 2);
    const qubitCount = Math.max(...arch.layers.map(l => l.config.qubits || 1).filter(Boolean), 1);
    
    return { quantumLayers: quantumLayers.length, classicalLayers: classicalLayers.length, circuitDepth, qubitCount };
  };

  return (
    <Card className="quantum-panel neon-border h-full">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
          <Save className="w-4 h-4" />
          Model Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="save" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="save">Save</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="versions">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="save" className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="modelName" className="text-xs">Model Name</Label>
                <Input
                  id="modelName"
                  placeholder="Enter model name..."
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  className="text-xs"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-xs">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your QNN model..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-xs min-h-[60px]"
                />
              </div>
              
              <div>
                <Label htmlFor="tags" className="text-xs">Tags</Label>
                <Input
                  id="tags"
                  placeholder="classification, hybrid, vqc (comma separated)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="text-xs"
                />
              </div>
              
              <div>
                <Label htmlFor="dataset" className="text-xs">Dataset</Label>
                <Input
                  id="dataset"
                  placeholder="e.g., MNIST, CIFAR-10, Custom"
                  value={dataset}
                  onChange={(e) => setDataset(e.target.value)}
                  className="text-xs"
                />
              </div>

              <Separator />
              
              {/* Current Architecture Stats */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-quantum-neon">Current Architecture</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(() => {
                    const stats = getCircuitStats(architecture);
                    return (
                      <>
                        <div className="flex justify-between">
                          <span>Layers:</span>
                          <span className="text-quantum-glow">{architecture.layers.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Circuit Depth:</span>
                          <span className="text-quantum-neon">{stats.circuitDepth}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Qubit Count:</span>
                          <span className="text-quantum-energy">{stats.qubitCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Parameters:</span>
                          <span className="text-quantum-particle">{architecture.metadata.totalParameters}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              <Button
                onClick={handleSaveModel}
                disabled={!modelName.trim() || architecture.layers.length === 0}
                className="w-full"
                size="sm"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Model
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="models" className="space-y-4">
            {savedModels.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No saved models yet</p>
                <p className="text-xs">Save your first QNN model to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {savedModels.map((model) => (
                  <Card key={model.id} className="border border-quantum-neon/20">
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-sm font-semibold text-quantum-glow">{model.name}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2">{model.metadata.description}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            v{model.metadata.version}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {model.metadata.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Accuracy:</span>
                            <div className="text-green-400">{model.metadata.performance.accuracy.toFixed(1)}%</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Loss:</span>
                            <div className="text-red-400">{model.metadata.performance.loss.toFixed(3)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Training:</span>
                            <div className="text-blue-400">{model.metadata.performance.trainingTime.toFixed(1)}s</div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLoadModel(model)}
                            className="flex-1"
                          >
                            <FolderOpen className="w-3 h-3 mr-1" />
                            Load
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleExportModel(model, 'json')}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleShareModel(model)}
                          >
                            <Share className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="versions" className="space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Version History</p>
              <p className="text-xs">Track changes and revert to previous versions</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-3 p-3 bg-card/30 rounded border">
                  <GitBranch className="w-4 h-4 text-quantum-neon" />
                  <div className="flex-1 text-left">
                    <div className="text-xs font-semibold">Current Version</div>
                    <div className="text-xs text-muted-foreground">
                      {architecture.layers.length} layers • Modified {new Date(architecture.metadata.modified).toLocaleString()}
                    </div>
                  </div>
                  <Badge variant="default" className="text-xs">HEAD</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 bg-card/20 rounded border opacity-50">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1 text-left">
                    <div className="text-xs">Auto-save checkpoint</div>
                    <div className="text-xs text-muted-foreground">2 minutes ago</div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-xs">Restore</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
