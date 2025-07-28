
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { QOSimSDK } from '@/sdk/qosim-sdk';
import { QuantumAlgorithmsSDK } from './QuantumAlgorithmsSDK';
import { GroverAlgorithm, GroverResult } from '@/sdk/algorithms/grovers';
import { QuantumFourierTransform, QFTResult } from '@/sdk/algorithms/qft';
import { BellStateGenerator, BellStateResult, BellStateType } from '@/sdk/algorithms/bellState';
import { ErrorCorrectionCodes, ErrorCorrectionResult, ErrorCorrectionCode, ErrorType } from '@/sdk/algorithms/errorCorrection';
import { ShorAlgorithm, ShorResult } from '@/sdk/algorithms/shor';
import { VariationalQuantumEigensolver, VQEResult } from '@/sdk/algorithms/vqe';
import { QAOAAlgorithm, QAOAResult } from '@/sdk/algorithms/qaoa';
import { Search, Waves, Heart, Shield, Play, Zap, Code, Cpu, Activity, FileText } from 'lucide-react';

interface QuantumAlgorithmsPanelProps {
  onCircuitGenerated: (gates: any[]) => void;
  onAlgorithmExecuted: (result: any) => void;
}

export function QuantumAlgorithmsPanel({ onCircuitGenerated, onAlgorithmExecuted }: QuantumAlgorithmsPanelProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [selectedBellType, setSelectedBellType] = useState<BellStateType>('phi+');
  const [selectedErrorCode, setSelectedErrorCode] = useState<ErrorCorrectionCode>('three-qubit');
  const [selectedErrorType, setSelectedErrorType] = useState<ErrorType>('bit-flip');
  
  const { toast } = useToast();
  const sdk = new QOSimSDK();

  const executeAlgorithm = async (algorithmFn: () => Promise<any>, algorithmName: string) => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    try {
      await sdk.initialize();
      const result = await algorithmFn();
      setLastResult(result);
      
      // Convert circuit to gate format for visualization
      const gates = result.circuit.gates.map((gate: any, index: number) => ({
        id: `${algorithmName}-${index}`,
        type: gate.type.toUpperCase(),
        qubit: gate.qubit,
        qubits: gate.controlQubit !== undefined ? [gate.controlQubit, gate.qubit] : undefined,
        position: index,
        angle: gate.angle
      }));
      
      onCircuitGenerated(gates);
      onAlgorithmExecuted(result);
      
      toast({
        title: `${algorithmName} Executed`,
        description: `Successfully generated ${algorithmName.toLowerCase()} circuit with ${gates.length} gates`,
      });
      
    } catch (error) {
      console.error(`${algorithmName} execution error:`, error);
      toast({
        title: "Algorithm Error",
        description: `Failed to execute ${algorithmName}: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const runGrover = () => {
    const grover = new GroverAlgorithm(sdk);
    executeAlgorithm(() => grover.quickGrover2Q(), "Grover's Algorithm");
  };

  const runQFT = () => {
    const qft = new QuantumFourierTransform(sdk);
    executeAlgorithm(() => qft.quickQFT3Q(), "Quantum Fourier Transform");
  };

  const runBellState = () => {
    const bellGen = new BellStateGenerator(sdk);
    executeAlgorithm(() => bellGen.createBellState({ type: selectedBellType }), "Bell State Generator");
  };

  const runErrorCorrection = () => {
    const errorCorrection = new ErrorCorrectionCodes(sdk);
    executeAlgorithm(() => errorCorrection.createErrorCorrectionCircuit({
      code: selectedErrorCode,
      errorType: selectedErrorType,
      logicalState: '1',
      introduceError: true,
      errorQubit: 1
    }), "Error Correction");
  };

  const runShor = () => {
    const shor = new ShorAlgorithm(sdk);
    executeAlgorithm(() => shor.quickShor15(), "Shor's Algorithm");
  };

  const runVQE = () => {
    const vqe = new VariationalQuantumEigensolver(sdk);
    executeAlgorithm(() => vqe.quickVQE_H2(), "VQE Algorithm");
  };

  const runQAOA = () => {
    const qaoa = new QAOAAlgorithm(sdk);
    executeAlgorithm(() => qaoa.quickMaxCut(), "QAOA Algorithm");
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="quick-run" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quick-run">Quick Run</TabsTrigger>
          <TabsTrigger value="sdk">Advanced SDK</TabsTrigger>
        </TabsList>

        <TabsContent value="quick-run">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Algorithm Runner
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Grover's Algorithm */}
                <Card className="quantum-panel">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="w-4 h-4 text-quantum-neon" />
                      <h3 className="font-semibold text-quantum-neon">Grover's Search</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Quantum search with quadratic speedup
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={runGrover}
                      disabled={isExecuting}
                      className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run 2-Qubit Search
                    </Button>
                  </CardContent>
                </Card>

                {/* Bell States */}
                <Card className="quantum-panel">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-quantum-neon" />
                      <h3 className="font-semibold text-quantum-neon">Bell States</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Maximally entangled states
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Select value={selectedBellType} onValueChange={(value: BellStateType) => setSelectedBellType(value)}>
                      <SelectTrigger className="quantum-panel neon-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="quantum-panel neon-border">
                        <SelectItem value="phi+">|Φ+⟩ = (|00⟩ + |11⟩)/√2</SelectItem>
                        <SelectItem value="phi-">|Φ-⟩ = (|00⟩ - |11⟩)/√2</SelectItem>
                        <SelectItem value="psi+">|Ψ+⟩ = (|01⟩ + |10⟩)/√2</SelectItem>
                        <SelectItem value="psi-">|Ψ-⟩ = (|01⟩ - |10⟩)/√2</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button 
                      onClick={runBellState}
                      disabled={isExecuting}
                      className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Generate Bell State
                    </Button>
                  </CardContent>
                </Card>

                {/* QFT */}
                <Card className="quantum-panel">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Waves className="w-4 h-4 text-quantum-neon" />
                      <h3 className="font-semibold text-quantum-neon">Quantum FFT</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Frequency domain transformation
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={runQFT}
                      disabled={isExecuting}
                      className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Run 3-Qubit QFT
                    </Button>
                  </CardContent>
                </Card>

                {/* Shor's Algorithm */}
                <Card className="quantum-panel">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-quantum-neon" />
                      <h3 className="font-semibold text-quantum-neon">Shor's Algorithm</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Quantum factorization
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={runShor}
                      disabled={isExecuting}
                      className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Factor 15
                    </Button>
                  </CardContent>
                </Card>

                {/* VQE */}
                <Card className="quantum-panel">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-quantum-neon" />
                      <h3 className="font-semibold text-quantum-neon">VQE</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Variational optimization
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={runVQE}
                      disabled={isExecuting}
                      className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Optimize H₂
                    </Button>
                  </CardContent>
                </Card>

                {/* QAOA */}
                <Card className="quantum-panel">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-quantum-neon" />
                      <h3 className="font-semibold text-quantum-neon">QAOA</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Approximate optimization
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={runQAOA}
                      disabled={isExecuting}
                      className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Solve MaxCut
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Results Display */}
              {lastResult && (
                <div className="mt-6 p-4 bg-quantum-matrix rounded-lg border border-quantum-neon/20">
                  <h4 className="text-sm font-mono text-quantum-neon mb-2">Algorithm Result</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Circuit:</span>
                      <Badge variant="outline" className="text-quantum-particle">
                        {lastResult.circuit?.name || 'Generated'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gates:</span>
                      <span className="text-quantum-glow">{lastResult.circuit?.gates.length || 0}</span>
                    </div>
                    {lastResult.successProbability && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Success Rate:</span>
                        <span className="text-quantum-neon">{(lastResult.successProbability * 100).toFixed(1)}%</span>
                      </div>
                    )}
                    {lastResult.expectedEntanglement && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entanglement:</span>
                        <span className="text-quantum-energy">{(lastResult.expectedEntanglement * 100).toFixed(1)}%</span>
                      </div>
                    )}
                    {lastResult.groundStateEnergy && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ground Energy:</span>
                        <span className="text-quantum-glow">{lastResult.groundStateEnergy.toFixed(4)}</span>
                      </div>
                    )}
                    {lastResult.factors && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Factors:</span>
                        <span className="text-quantum-neon">{lastResult.factors.join(' × ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sdk">
          <QuantumAlgorithmsSDK />
        </TabsContent>
      </Tabs>
    </div>
  );
}
