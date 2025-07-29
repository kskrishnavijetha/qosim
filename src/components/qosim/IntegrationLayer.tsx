
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OptimizationPanel } from './integration/OptimizationPanel';
import { SynchronizationPanel } from './integration/SynchronizationPanel';
import { CollaborativeEditor } from './integration/CollaborativeEditor';
import { VersionControl } from './integration/VersionControl';
import { type QuantumGate, type QuantumSimulationResult } from '@/types/qosim';
import { Zap, RefreshCw, GitBranch, Users, TrendingUp, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';

interface IntegrationLayerProps {
  circuit: QuantumGate[];
  simulationResult: QuantumSimulationResult | null;
  simulationHistory: QuantumSimulationResult[];
  onOptimizeCircuit: (optimizedCircuit: QuantumGate[]) => void;
  onSyncToSDK: () => void;
  onSyncToBuilder: () => void;
}

export function IntegrationLayer({
  circuit,
  simulationResult,
  simulationHistory,
  onOptimizeCircuit,
  onSyncToSDK,
  onSyncToBuilder
}: IntegrationLayerProps) {
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const handleCircuitOptimization = async () => {
    if (circuit.length === 0) {
      toast.error('No circuit to optimize');
      return;
    }

    setIsOptimizing(true);
    setOptimizationProgress(0);

    try {
      // Simulate optimization process
      const steps = [
        'Analyzing circuit topology...',
        'Identifying optimization opportunities...',
        'Applying gate reduction rules...',
        'Minimizing circuit depth...',
        'Validating optimized circuit...'
      ];

      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setOptimizationProgress(((i + 1) / steps.length) * 100);
        toast.info(steps[i]);
      }

      // Generate optimized circuit (remove redundant gates, combine rotations, etc.)
      const optimizedCircuit = circuit.filter((gate, index) => {
        // Simple optimization: remove consecutive X gates on same qubit
        if (gate.type === 'X') {
          const nextGate = circuit[index + 1];
          return !(nextGate?.type === 'X' && nextGate.qubits[0] === gate.qubits[0]);
        }
        return true;
      });

      onOptimizeCircuit(optimizedCircuit);
      toast.success(`Circuit optimized! Reduced from ${circuit.length} to ${optimizedCircuit.length} gates`);
    } catch (error) {
      toast.error('Optimization failed');
    } finally {
      setIsOptimizing(false);
      setOptimizationProgress(0);
    }
  };

  const handleSync = async (direction: 'to-sdk' | 'to-builder') => {
    setSyncStatus('syncing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (direction === 'to-sdk') {
        onSyncToSDK();
        toast.success('Circuit synced to Algorithms SDK');
      } else {
        onSyncToBuilder();
        toast.success('Code synced to Circuit Builder');
      }
      
      setSyncStatus('success');
      setLastSync(new Date());
      
      setTimeout(() => setSyncStatus('idle'), 2000);
    } catch (error) {
      setSyncStatus('error');
      toast.error('Synchronization failed');
      setTimeout(() => setSyncStatus('idle'), 2000);
    }
  };

  const circuitDepth = circuit.reduce((max, gate) => Math.max(max, gate.position.x / 60), 0);
  const qubitCount = circuit.length > 0 ? Math.max(...circuit.map(g => Math.max(...g.qubits))) + 1 : 0;
  const gateTypes = [...new Set(circuit.map(g => g.type))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-emerald-400">Integration Layer</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Sync: {syncStatus}
            </Badge>
            {lastSync && (
              <Badge variant="outline" className="text-xs">
                Last: {lastSync.toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSync('to-sdk')}
            disabled={syncStatus === 'syncing' || circuit.length === 0}
            className="text-purple-400 border-purple-400/30"
          >
            <ArrowLeftRight className="w-4 h-4 mr-1" />
            Sync to SDK
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSync('to-builder')}
            disabled={syncStatus === 'syncing'}
            className="text-cyan-400 border-cyan-400/30"
          >
            <ArrowLeftRight className="w-4 h-4 mr-1" />
            Sync to Builder
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/30 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Circuit Gates</p>
                <p className="text-2xl font-bold text-cyan-400">{circuit.length}</p>
              </div>
              <Zap className="w-8 h-8 text-cyan-400/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Circuit Depth</p>
                <p className="text-2xl font-bold text-purple-400">{Math.ceil(circuitDepth)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-400/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Qubits Used</p>
                <p className="text-2xl font-bold text-emerald-400">{qubitCount}</p>
              </div>
              <RefreshCw className="w-8 h-8 text-emerald-400/50" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-white/10">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Gate Types</p>
                <p className="text-2xl font-bold text-yellow-400">{gateTypes.length}</p>
              </div>
              <GitBranch className="w-8 h-8 text-yellow-400/50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="optimization" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/30">
          <TabsTrigger value="optimization" className="data-[state=active]:bg-yellow-500/20">
            <Zap className="w-4 h-4 mr-2" />
            AI Optimization
          </TabsTrigger>
          <TabsTrigger value="sync" className="data-[state=active]:bg-emerald-500/20">
            <RefreshCw className="w-4 h-4 mr-2" />
            Synchronization
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="data-[state=active]:bg-blue-500/20">
            <Users className="w-4 h-4 mr-2" />
            Collaboration
          </TabsTrigger>
          <TabsTrigger value="version" className="data-[state=active]:bg-purple-500/20">
            <GitBranch className="w-4 h-4 mr-2" />
            Version Control
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="optimization" className="mt-0">
            <div className="space-y-6">
              {/* Optimization Controls */}
              <Card className="bg-black/30 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-400">AI-Powered Circuit Optimization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isOptimizing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Optimization Progress</span>
                        <span className="text-yellow-400">{Math.round(optimizationProgress)}%</span>
                      </div>
                      <Progress value={optimizationProgress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleCircuitOptimization}
                      disabled={isOptimizing || circuit.length === 0}
                      className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 border-yellow-400/30"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {isOptimizing ? 'Optimizing...' : 'Optimize Circuit'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      disabled={!simulationResult}
                      className="text-slate-400 border-slate-400/30"
                    >
                      Analyze Performance
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <OptimizationPanel
                circuit={circuit}
                simulationResult={simulationResult}
                onOptimize={onOptimizeCircuit}
              />
            </div>
          </TabsContent>

          <TabsContent value="sync" className="mt-0">
            <SynchronizationPanel
              circuit={circuit}
              syncStatus={syncStatus}
              onSyncToSDK={() => handleSync('to-sdk')}
              onSyncToBuilder={() => handleSync('to-builder')}
            />
          </TabsContent>

          <TabsContent value="collaboration" className="mt-0">
            <CollaborativeEditor
              circuit={circuit}
              onCircuitUpdate={onOptimizeCircuit}
            />
          </TabsContent>

          <TabsContent value="version" className="mt-0">
            <VersionControl
              circuit={circuit}
              simulationHistory={simulationHistory}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
