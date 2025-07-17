
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { QOSimSDK } from '@/sdk/qosim-sdk';
import { GroverAlgorithm, GroverResult } from '@/sdk/algorithms/grovers';
import { QuantumFourierTransform, QFTResult } from '@/sdk/algorithms/qft';
import { BellStateGenerator, BellStateResult, BellStateType } from '@/sdk/algorithms/bellState';
import { ErrorCorrectionCodes, ErrorCorrectionResult, ErrorCorrectionCode, ErrorType } from '@/sdk/algorithms/errorCorrection';
import { Search, Waves, Heart, Shield, Play, Zap } from 'lucide-react';

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

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Quantum Algorithms SDK
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="grover" className="w-full">
          <TabsList className="grid w-full grid-cols-4 quantum-panel">
            <TabsTrigger value="grover" className="text-xs">Grover</TabsTrigger>
            <TabsTrigger value="qft" className="text-xs">QFT</TabsTrigger>
            <TabsTrigger value="bell" className="text-xs">Bell</TabsTrigger>
            <TabsTrigger value="error" className="text-xs">Error</TabsTrigger>
          </TabsList>

          <TabsContent value="grover" className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-quantum-neon" />
              <h3 className="font-semibold text-quantum-neon">Grover's Search Algorithm</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Quantum search algorithm that finds marked items quadratically faster than classical search.
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={runGrover}
                disabled={isExecuting}
                className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
              >
                <Play className="w-4 h-4 mr-2" />
                Execute 2-Qubit Grover Search
              </Button>
              <div className="text-xs text-muted-foreground">
                Searches for |11⟩ state in 2-qubit space
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qft" className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Waves className="w-4 h-4 text-quantum-neon" />
              <h3 className="font-semibold text-quantum-neon">Quantum Fourier Transform</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Transforms between computational and frequency domains, essential for many quantum algorithms.
            </p>
            <div className="flex flex-col gap-2">
              <Button 
                onClick={runQFT}
                disabled={isExecuting}
                className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
              >
                <Play className="w-4 h-4 mr-2" />
                Execute 3-Qubit QFT
              </Button>
              <div className="text-xs text-muted-foreground">
                Applies QFT to |001⟩ initial state
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bell" className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-quantum-neon" />
              <h3 className="font-semibold text-quantum-neon">Bell State Generator</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Creates maximally entangled two-qubit states for quantum communication and teleportation.
            </p>
            <div className="space-y-3">
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
            </div>
          </TabsContent>

          <TabsContent value="error" className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-quantum-neon" />
              <h3 className="font-semibold text-quantum-neon">Error Correction</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Protects quantum information from decoherence and errors using redundant encoding.
            </p>
            <div className="space-y-3">
              <Select value={selectedErrorCode} onValueChange={(value: ErrorCorrectionCode) => setSelectedErrorCode(value)}>
                <SelectTrigger className="quantum-panel neon-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="quantum-panel neon-border">
                  <SelectItem value="three-qubit">3-Qubit Code</SelectItem>
                  <SelectItem value="shor">Shor's 9-Qubit Code</SelectItem>
                  <SelectItem value="steane">Steane 7-Qubit Code</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedErrorType} onValueChange={(value: ErrorType) => setSelectedErrorType(value)}>
                <SelectTrigger className="quantum-panel neon-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="quantum-panel neon-border">
                  <SelectItem value="bit-flip">Bit-Flip Error</SelectItem>
                  <SelectItem value="phase-flip">Phase-Flip Error</SelectItem>
                  <SelectItem value="general">General Error</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={runErrorCorrection}
                disabled={isExecuting}
                className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
              >
                <Play className="w-4 h-4 mr-2" />
                Execute Error Correction
              </Button>
            </div>
          </TabsContent>
        </Tabs>

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
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
