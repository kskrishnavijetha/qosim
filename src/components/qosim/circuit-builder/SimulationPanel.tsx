
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  BarChart3, 
  Zap, 
  Activity, 
  Target,
  Clock,
  Cpu
} from 'lucide-react';

interface SimulationPanelProps {
  simulationResult: any;
  isSimulating: boolean;
  onSimulate: () => void;
}

export function SimulationPanel({ simulationResult, isSimulating, onSimulate }: SimulationPanelProps) {
  const [activeView, setActiveView] = useState('states');

  const formatComplex = (complex: any) => {
    if (!complex || typeof complex !== 'object') return '0';
    const real = typeof complex.real === 'number' ? complex.real : 0;
    const imag = typeof complex.imag === 'number' ? complex.imag : 0;
    
    if (Math.abs(imag) < 1e-10) return real.toFixed(4);
    if (Math.abs(real) < 1e-10) return `${imag.toFixed(4)}i`;
    
    const sign = imag >= 0 ? '+' : '';
    return `${real.toFixed(4)}${sign}${imag.toFixed(4)}i`;
  };

  const renderStateVector = () => {
    if (!simulationResult?.stateVector) return null;
    
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-quantum-neon">State Vector</div>
        <div className="max-h-48 overflow-y-auto space-y-1">
          {simulationResult.stateVector.map((amplitude: any, index: number) => {
            const probability = Math.abs(amplitude.real || 0) ** 2 + Math.abs(amplitude.imag || 0) ** 2;
            const binaryState = index.toString(2).padStart(Math.log2(simulationResult.stateVector.length), '0');
            
            if (probability < 0.001) return null;
            
            return (
              <div key={index} className="flex items-center justify-between p-2 bg-quantum-matrix/50 rounded">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="neon-border font-mono">
                    |{binaryState}⟩
                  </Badge>
                  <div className="text-xs text-quantum-particle">
                    {formatComplex(amplitude)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs text-quantum-neon">
                    {(probability * 100).toFixed(2)}%
                  </div>
                  <div className="w-16 h-2 bg-quantum-void rounded">
                    <div 
                      className="h-full bg-quantum-glow rounded" 
                      style={{ width: `${probability * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderQubitStates = () => {
    if (!simulationResult?.qubitStates) return null;
    
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-quantum-neon">Individual Qubits</div>
        <div className="space-y-2">
          {simulationResult.qubitStates.map((qubit: any, index: number) => (
            <div key={index} className="p-3 bg-quantum-matrix/50 rounded">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="neon-border">
                  Qubit {index}
                </Badge>
                <div className="text-xs text-quantum-particle">
                  Coherence: {((qubit.coherence || 0.95) * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>|0⟩:</span>
                  <span className="text-quantum-neon">
                    {((qubit.probability || 0.5) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>|1⟩:</span>
                  <span className="text-quantum-neon">
                    {((1 - (qubit.probability || 0.5)) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Phase:</span>
                  <span className="text-quantum-particle">
                    {((qubit.phase || 0) / Math.PI).toFixed(2)}π
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>State:</span>
                  <span className="text-quantum-energy">
                    {qubit.state || 'mixed'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEntanglement = () => {
    if (!simulationResult?.entanglement) return null;
    
    const entanglement = simulationResult.entanglement;
    
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-quantum-neon">Entanglement Analysis</div>
        
        <div className="p-3 bg-quantum-matrix/50 rounded">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm">Total Entanglement</span>
            <Badge variant="outline" className="neon-border">
              {(entanglement.totalEntanglement || 0).toFixed(3)}
            </Badge>
          </div>
          
          <Progress 
            value={(entanglement.totalEntanglement || 0) * 100} 
            className="h-2 quantum-progress"
          />
        </div>
        
        {entanglement.pairs && entanglement.pairs.length > 0 && (
          <div className="space-y-1">
            <div className="text-xs text-quantum-particle">Entangled Pairs</div>
            {entanglement.pairs.map((pair: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-quantum-matrix/30 rounded">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="neon-border text-xs">
                    Q{pair.qubit1} ↔ Q{pair.qubit2}
                  </Badge>
                </div>
                <div className="text-xs text-quantum-neon">
                  {(pair.strength || 0).toFixed(3)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderMetrics = () => {
    if (!simulationResult) return null;
    
    return (
      <div className="space-y-2">
        <div className="text-sm font-medium text-quantum-neon">Simulation Metrics</div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-quantum-matrix/50 rounded">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-quantum-particle" />
              <span className="text-xs">Execution Time</span>
            </div>
            <div className="text-sm text-quantum-neon mt-1">
              {simulationResult.executionTime || 0}ms
            </div>
          </div>
          
          <div className="p-2 bg-quantum-matrix/50 rounded">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-quantum-particle" />
              <span className="text-xs">Fidelity</span>
            </div>
            <div className="text-sm text-quantum-neon mt-1">
              {((simulationResult.fidelity || 0) * 100).toFixed(1)}%
            </div>
          </div>
          
          <div className="p-2 bg-quantum-matrix/50 rounded">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-quantum-particle" />
              <span className="text-xs">Mode</span>
            </div>
            <div className="text-sm text-quantum-neon mt-1">
              {simulationResult.mode || 'fast'}
            </div>
          </div>
          
          <div className="p-2 bg-quantum-matrix/50 rounded">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-quantum-particle" />
              <span className="text-xs">Memory</span>
            </div>
            <div className="text-sm text-quantum-neon mt-1">
              {Math.pow(2, Math.log2(simulationResult.stateVector?.length || 4))} states
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="quantum-panel neon-border h-fit">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Simulation
        </CardTitle>
        
        <Button
          onClick={onSimulate}
          disabled={isSimulating}
          className="w-full neon-border"
        >
          {isSimulating ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Simulating...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run Simulation
            </>
          )}
        </Button>
        
        {isSimulating && (
          <Progress value={75} className="quantum-progress" />
        )}
      </CardHeader>
      
      <CardContent>
        {simulationResult ? (
          <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 quantum-tabs">
              <TabsTrigger value="states" className="quantum-tab">States</TabsTrigger>
              <TabsTrigger value="qubits" className="quantum-tab">Qubits</TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-2 quantum-tabs">
              <TabsTrigger value="entanglement" className="quantum-tab">Entanglement</TabsTrigger>
              <TabsTrigger value="metrics" className="quantum-tab">Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="states" className="space-y-3">
              {renderStateVector()}
            </TabsContent>

            <TabsContent value="qubits" className="space-y-3">
              {renderQubitStates()}
            </TabsContent>

            <TabsContent value="entanglement" className="space-y-3">
              {renderEntanglement()}
            </TabsContent>

            <TabsContent value="metrics" className="space-y-3">
              {renderMetrics()}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8 text-quantum-particle">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No simulation results yet</p>
            <p className="text-xs opacity-70">Add gates and run simulation</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
