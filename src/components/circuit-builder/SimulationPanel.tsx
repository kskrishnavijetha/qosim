
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Zap, BarChart3, Atom, Globe } from 'lucide-react';
import type { QuantumGate } from '@/hooks/useCircuitBuilder';
import type { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';

interface SimulationPanelProps {
  circuit: QuantumGate[];
  simulationResult: OptimizedSimulationResult | null;
  isSimulating: boolean;
}

export function SimulationPanel({ circuit, simulationResult, isSimulating }: SimulationPanelProps) {
  const [activeView, setActiveView] = useState('overview');
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        setAnimationFrame(prev => (prev + 1) % 60);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isSimulating]);

  const renderStateVector = () => {
    if (!simulationResult?.stateVector) return null;
    
    return (
      <div className="space-y-2">
        {simulationResult.stateVector.slice(0, 16).map((amplitude, i) => {
          const magnitude = Math.sqrt(amplitude.real * amplitude.real + amplitude.imag * amplitude.imag);
          const phase = Math.atan2(amplitude.imag, amplitude.real);
          const probability = magnitude * magnitude;
          
          return (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-12 text-xs font-mono">|{i.toString(2).padStart(3, '0')}⟩</div>
              <div className="flex-1">
                <Progress value={probability * 100} className="h-2" />
              </div>
              <div className="w-16 text-xs font-mono text-right">
                {probability.toFixed(3)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderBlochSpheres = () => {
    if (!simulationResult?.qubitStates) return null;
    
    return (
      <div className="grid grid-cols-2 gap-4">
        {simulationResult.qubitStates.slice(0, 4).map((qubit, i) => (
          <div key={i} className="text-center">
            <div className="text-sm font-mono mb-2">Q{i}</div>
            <div 
              className="w-16 h-16 rounded-full border-2 border-primary mx-auto relative bg-gradient-to-br from-primary/20 to-primary/5"
              style={{
                transform: `rotate(${qubit.phase}rad)`
              }}
            >
              <div 
                className="absolute w-2 h-2 bg-primary rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%, -50%) translateY(${-qubit.probability * 20}px)`
                }}
              />
            </div>
            <div className="text-xs mt-1 font-mono">{qubit.state}</div>
            <div className="text-xs text-muted-foreground">
              P: {qubit.probability.toFixed(3)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderEntanglement = () => {
    if (!simulationResult?.entanglement) return null;
    
    const { pairs, totalEntanglement } = simulationResult.entanglement;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Entanglement</span>
          <Badge variant="outline">{(totalEntanglement * 100).toFixed(1)}%</Badge>
        </div>
        
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalEntanglement * 100}%` }}
          />
        </div>
        
        {pairs.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Entangled Pairs</div>
            {pairs.map((pair, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="font-mono">Q{pair.qubit1} ↔ Q{pair.qubit2}</span>
                <Badge variant="secondary">{(pair.strength * 100).toFixed(1)}%</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMeasurementProbabilities = () => {
    if (!simulationResult?.measurementProbabilities) return null;
    
    return (
      <div className="space-y-2">
        {simulationResult.measurementProbabilities.slice(0, 8).map((prob, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-12 text-xs font-mono">|{i.toString(2).padStart(3, '0')}⟩</div>
            <div className="flex-1">
              <Progress value={prob * 100} className="h-2" />
            </div>
            <div className="w-16 text-xs font-mono text-right">
              {(prob * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCircuitStats = () => {
    const stats = {
      gates: circuit.length,
      depth: circuit.length > 0 ? Math.max(...circuit.map(g => g.layer)) + 1 : 0,
      qubits: new Set(circuit.flatMap(g => g.qubits)).size,
      types: new Set(circuit.map(g => g.type)).size
    };
    
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">{stats.gates}</div>
          <div className="text-sm text-muted-foreground">Gates</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">{stats.depth}</div>
          <div className="text-sm text-muted-foreground">Depth</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">{stats.qubits}</div>
          <div className="text-sm text-muted-foreground">Qubits</div>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <div className="text-2xl font-bold text-primary">{stats.types}</div>
          <div className="text-sm text-muted-foreground">Types</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Quantum Simulation
          {isSimulating && (
            <Badge variant="outline" className="animate-pulse">
              Running
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeView} onValueChange={setActiveView}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="states">States</TabsTrigger>
            <TabsTrigger value="bloch">Bloch</TabsTrigger>
            <TabsTrigger value="entangle">Entangle</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="text-sm text-muted-foreground">Circuit Statistics</div>
            {renderCircuitStats()}
            
            {simulationResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Simulation Results</span>
                  <Badge variant="outline">
                    {simulationResult.executionTime.toFixed(2)}ms
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Fidelity</span>
                    <span className="font-mono">{(simulationResult.fidelity * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Mode</span>
                    <Badge variant="secondary">{simulationResult.mode}</Badge>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="states" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">State Vector</span>
              <Badge variant="outline">
                {simulationResult?.stateVector.length || 0} states
              </Badge>
            </div>
            {renderStateVector()}
          </TabsContent>
          
          <TabsContent value="bloch" className="space-y-4">
            <div className="text-sm font-medium mb-4">Bloch Spheres</div>
            {renderBlochSpheres()}
          </TabsContent>
          
          <TabsContent value="entangle" className="space-y-4">
            <div className="text-sm font-medium mb-4">Entanglement Analysis</div>
            {renderEntanglement()}
          </TabsContent>
        </Tabs>
        
        {circuit.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Add gates to your circuit to see simulation results</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
