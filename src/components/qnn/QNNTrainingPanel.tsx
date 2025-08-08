
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { QNNArchitecture, TrainingMetrics } from '@/hooks/useQNNBuilder';
import { Play, Pause, Square, TrendingUp, TrendingDown } from 'lucide-react';

interface QNNTrainingPanelProps {
  architecture: QNNArchitecture;
  trainingMetrics: TrainingMetrics | null;
  isTraining: boolean;
  onTrainingStart: (config: any) => void;
  onTrainingStop: () => void;
}

export function QNNTrainingPanel({
  architecture,
  trainingMetrics,
  isTraining,
  onTrainingStart,
  onTrainingStop
}: QNNTrainingPanelProps) {
  const [trainingConfig, setTrainingConfig] = useState({
    dataset: 'mnist',
    epochs: 10,
    batchSize: 32,
    learningRate: 0.001,
    optimizer: 'adam',
    lossFunction: 'categorical_crossentropy'
  });

  const handleConfigChange = (key: string, value: any) => {
    setTrainingConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleStartTraining = () => {
    if (architecture.layers.length === 0) {
      return;
    }
    onTrainingStart(trainingConfig);
  };

  const chartData = trainingMetrics ? 
    trainingMetrics.lossHistory.map((loss, index) => ({
      epoch: index + 1,
      loss,
      accuracy: trainingMetrics.accuracyHistory[index] || 0
    })) : [];

  return (
    <Card className="quantum-panel neon-border h-full">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
          <Play className="w-4 h-4" />
          QNN Training Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Training Configuration */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-quantum-neon">Training Configuration</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="dataset" className="text-xs">Dataset</Label>
              <Select value={trainingConfig.dataset} onValueChange={(value) => handleConfigChange('dataset', value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mnist">MNIST</SelectItem>
                  <SelectItem value="cifar10">CIFAR-10</SelectItem>
                  <SelectItem value="iris">Iris</SelectItem>
                  <SelectItem value="custom">Custom CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="epochs" className="text-xs">Epochs</Label>
              <Input
                id="epochs"
                type="number"
                value={trainingConfig.epochs}
                onChange={(e) => handleConfigChange('epochs', parseInt(e.target.value))}
                className="h-8 text-xs"
                min="1"
                max="1000"
              />
            </div>

            <div>
              <Label htmlFor="batchSize" className="text-xs">Batch Size</Label>
              <Input
                id="batchSize"
                type="number"
                value={trainingConfig.batchSize}
                onChange={(e) => handleConfigChange('batchSize', parseInt(e.target.value))}
                className="h-8 text-xs"
                min="1"
                max="512"
              />
            </div>

            <div>
              <Label htmlFor="learningRate" className="text-xs">Learning Rate</Label>
              <Input
                id="learningRate"
                type="number"
                value={trainingConfig.learningRate}
                onChange={(e) => handleConfigChange('learningRate', parseFloat(e.target.value))}
                className="h-8 text-xs"
                step="0.0001"
                min="0.0001"
                max="0.1"
              />
            </div>

            <div>
              <Label htmlFor="optimizer" className="text-xs">Optimizer</Label>
              <Select value={trainingConfig.optimizer} onValueChange={(value) => handleConfigChange('optimizer', value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adam">Adam</SelectItem>
                  <SelectItem value="sgd">SGD</SelectItem>
                  <SelectItem value="rmsprop">RMSprop</SelectItem>
                  <SelectItem value="quantum_adam">Quantum Adam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="lossFunction" className="text-xs">Loss Function</Label>
              <Select value={trainingConfig.lossFunction} onValueChange={(value) => handleConfigChange('lossFunction', value)}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="categorical_crossentropy">Categorical Crossentropy</SelectItem>
                  <SelectItem value="binary_crossentropy">Binary Crossentropy</SelectItem>
                  <SelectItem value="mse">Mean Squared Error</SelectItem>
                  <SelectItem value="quantum_loss">Quantum Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Training Controls */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleStartTraining}
              disabled={isTraining || architecture.layers.length === 0}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Training
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={onTrainingStop}
              disabled={!isTraining}
            >
              <Square className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Training Progress */}
        {trainingMetrics && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-quantum-neon">Training Progress</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Epoch {trainingMetrics.currentEpoch} / {trainingMetrics.totalEpochs}</span>
                  <span>{Math.round((trainingMetrics.currentEpoch / trainingMetrics.totalEpochs) * 100)}%</span>
                </div>
                <Progress 
                  value={(trainingMetrics.currentEpoch / trainingMetrics.totalEpochs) * 100} 
                  className="h-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <div>
                    <div className="text-muted-foreground">Loss</div>
                    <div className="font-mono text-red-400">{trainingMetrics.currentLoss.toFixed(4)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <div>
                    <div className="text-muted-foreground">Accuracy</div>
                    <div className="font-mono text-green-400">{trainingMetrics.currentAccuracy.toFixed(2)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Training Charts */}
        {trainingMetrics && chartData.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-quantum-neon">Training Curves</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="epoch" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        fontSize: '12px'
                      }} 
                    />
                    <Legend fontSize={10} />
                    <Line 
                      type="monotone" 
                      dataKey="loss" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      dot={false}
                      name="Loss"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accuracy" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      dot={false}
                      name="Accuracy (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {/* Architecture Summary */}
        <Separator />
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-quantum-neon">Architecture Summary</h4>
          <div className="text-xs space-y-1">
            <div>Total Layers: {architecture.layers.length}</div>
            <div>Quantum Layers: {architecture.layers.filter(l => l.type.startsWith('quantum_')).length}</div>
            <div>Classical Layers: {architecture.layers.filter(l => !l.type.startsWith('quantum_')).length}</div>
            <div>Total Parameters: {architecture.metadata.totalParameters}</div>
            <div>Connections: {architecture.connections.length}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
