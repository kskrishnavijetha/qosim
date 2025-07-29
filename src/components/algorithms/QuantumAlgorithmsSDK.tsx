
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { QOSimSDK } from '@/sdk/qosim-sdk';
import { AlgorithmLibrary } from './AlgorithmLibrary';
import { AlgorithmVisualizer } from './AlgorithmVisualizer';
import { SDKCodeEditor } from './SDKCodeEditor';
import { CircuitSDKBridge } from './CircuitSDKBridge';
import { AlgorithmAI } from './AlgorithmAI';
import { Zap, Code, Eye, GitBranch, Brain, Download } from 'lucide-react';

interface QuantumAlgorithmsSDKProps {
  onCircuitGenerated: (gates: any[]) => void;
  onAlgorithmExecuted: (result: any) => void;
  visualCircuit?: any;
  onVisualCircuitChange?: (circuit: any) => void;
}

export function QuantumAlgorithmsSDK({ 
  onCircuitGenerated, 
  onAlgorithmExecuted,
  visualCircuit,
  onVisualCircuitChange 
}: QuantumAlgorithmsSDKProps) {
  const [activeSDK, setActiveSDK] = useState<'python' | 'javascript'>('javascript');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('grover');
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  
  const { toast } = useToast();
  const sdk = new QOSimSDK();

  const executeAlgorithm = useCallback(async (algorithmCode: string, language: 'python' | 'javascript') => {
    if (isExecuting) return;
    
    setIsExecuting(true);
    try {
      await sdk.initialize();
      
      let result;
      if (language === 'javascript') {
        // Execute JavaScript SDK code
        result = await executeJavaScriptCode(algorithmCode);
      } else {
        // Execute Python SDK code via simulation
        result = await executePythonCode(algorithmCode);
      }
      
      setLastResult(result);
      onAlgorithmExecuted(result);
      
      // Convert to visual circuit if available
      if (result.circuit && onCircuitGenerated) {
        const gates = convertCircuitToGates(result.circuit);
        onCircuitGenerated(gates);
      }
      
      toast({
        title: "Algorithm Executed",
        description: `Successfully ran ${selectedAlgorithm} algorithm`,
      });
      
    } catch (error) {
      console.error('Algorithm execution error:', error);
      toast({
        title: "Execution Error",
        description: `Failed to execute algorithm: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  }, [isExecuting, selectedAlgorithm, onAlgorithmExecuted, onCircuitGenerated, sdk]);

  const executeJavaScriptCode = async (code: string) => {
    // Safe code execution environment
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const executionFunction = new AsyncFunction('sdk', 'console', code + '\n\nreturn result;');
    
    const mockConsole = {
      log: (...args: any[]) => console.log('[SDK]', ...args),
      error: (...args: any[]) => console.error('[SDK]', ...args),
      warn: (...args: any[]) => console.warn('[SDK]', ...args)
    };
    
    return await executionFunction(sdk, mockConsole);
  };

  const executePythonCode = async (code: string) => {
    // Simulate Python execution by converting to JavaScript equivalent
    // In a real implementation, this would use a Python interpreter or backend
    const jsEquivalent = convertPythonToJavaScript(code);
    return await executeJavaScriptCode(jsEquivalent);
  };

  const convertPythonToJavaScript = (pythonCode: string): string => {
    // Basic Python to JavaScript conversion for quantum operations
    return pythonCode
      .replace(/from qosim_sdk import/g, '// Using QOSim JavaScript SDK')
      .replace(/sim = QuantumSimulator\((\d+)\)/g, 'const circuit = sdk.createCircuit("Python Circuit", $1);')
      .replace(/sim\.h\((\d+)\)/g, 'circuit = sdk.addGate(circuit, { type: "h", qubit: $1 });')
      .replace(/sim\.x\((\d+)\)/g, 'circuit = sdk.addGate(circuit, { type: "x", qubit: $1 });')
      .replace(/sim\.cnot\((\d+), (\d+)\)/g, 'circuit = sdk.addGate(circuit, { type: "cnot", controlQubit: $1, qubit: $2 });')
      .replace(/result = sim\.run\(\)/g, 'const result = await sdk.simulate(circuit);');
  };

  const convertCircuitToGates = (circuit: any) => {
    return circuit.gates?.map((gate: any, index: number) => ({
      id: `sdk-${index}`,
      type: gate.type.toUpperCase(),
      qubit: gate.qubit,
      qubits: gate.controlQubit !== undefined ? [gate.controlQubit, gate.qubit] : [gate.qubit],
      position: index,
      angle: gate.angle
    })) || [];
  };

  const handleExportCode = useCallback(() => {
    if (!generatedCode) return;
    
    const blob = new Blob([generatedCode], { 
      type: activeSDK === 'python' ? 'text/x-python' : 'application/javascript' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_algorithm.${activeSDK === 'python' ? 'py' : 'js'}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedCode, activeSDK]);

  return (
    <div className="space-y-4">
      {/* SDK Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Quantum Algorithms SDK
          </CardTitle>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={activeSDK === 'javascript' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveSDK('javascript')}
                className="neon-border"
              >
                <Code className="w-4 h-4 mr-2" />
                JavaScript
              </Button>
              <Button
                variant={activeSDK === 'python' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveSDK('python')}
                className="neon-border"
              >
                <Code className="w-4 h-4 mr-2" />
                Python
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVisualizer(!showVisualizer)}
                className="neon-border"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showVisualizer ? 'Hide' : 'Show'} Visualizer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCode}
                disabled={!generatedCode}
                className="neon-border"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Code
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Algorithm Library & Code Editor */}
        <div className="space-y-4">
          <AlgorithmLibrary
            selectedAlgorithm={selectedAlgorithm}
            onAlgorithmSelect={setSelectedAlgorithm}
            language={activeSDK}
            onCodeGenerated={setGeneratedCode}
          />
          
          <SDKCodeEditor
            language={activeSDK}
            code={generatedCode}
            onCodeChange={setGeneratedCode}
            onExecute={(code) => executeAlgorithm(code, activeSDK)}
            isExecuting={isExecuting}
          />
          
          <AlgorithmAI
            language={activeSDK}
            onCodeGenerated={setGeneratedCode}
          />
        </div>

        {/* Visualizer & Bridge */}
        <div className="space-y-4">
          {showVisualizer && (
            <AlgorithmVisualizer
              result={lastResult}
              isRunning={isExecuting}
            />
          )}
          
          <CircuitSDKBridge
            visualCircuit={visualCircuit}
            onVisualCircuitChange={onVisualCircuitChange}
            onSDKCircuitGenerated={onCircuitGenerated}
            language={activeSDK}
            generatedCode={generatedCode}
            onCodeGenerated={setGeneratedCode}
          />
        </div>
      </div>

      {/* Results Display */}
      {lastResult && (
        <Card className="quantum-panel neon-border">
          <CardHeader>
            <CardTitle className="text-sm font-mono text-quantum-neon">
              Algorithm Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-muted-foreground">Circuit Name</div>
                <Badge variant="outline" className="text-quantum-particle">
                  {lastResult.circuit?.name || 'Generated Circuit'}
                </Badge>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Gates Count</div>
                <div className="text-quantum-glow font-mono">
                  {lastResult.circuit?.gates?.length || 0}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Execution Time</div>
                <div className="text-quantum-neon font-mono">
                  {lastResult.executionTime ? `${lastResult.executionTime.toFixed(2)}ms` : 'N/A'}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Fidelity</div>
                <div className="text-quantum-energy font-mono">
                  {lastResult.fidelity ? `${(lastResult.fidelity * 100).toFixed(1)}%` : 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
