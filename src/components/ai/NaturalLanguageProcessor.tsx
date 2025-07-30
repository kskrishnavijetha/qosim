
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Sparkles, Zap, MessageSquare, Code } from 'lucide-react';
import { quantumAI } from '@/services/QuantumAIService';
import { toast } from 'sonner';

interface NaturalLanguageProcessorProps {
  onCircuitGenerated: (gates: any[]) => void;
  onAlgorithmGenerated: (code: string) => void;
}

export function NaturalLanguageProcessor({ 
  onCircuitGenerated, 
  onAlgorithmGenerated 
}: NaturalLanguageProcessorProps) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);
  const [processingStep, setProcessingStep] = useState('');
  const [progress, setProgress] = useState(0);

  const examplePrompts = [
    "Create a Bell state between qubits 0 and 1",
    "Build a 3-qubit GHZ state for quantum networking",
    "Generate Grover's algorithm for 2-qubit search",
    "Make superposition on 4 qubits using Hadamard gates",
    "Implement quantum teleportation protocol",
    "Create quantum Fourier transform circuit"
  ];

  const processNaturalLanguage = async () => {
    if (!input.trim()) {
      toast.error('Please enter a description of what you want to create');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessingStep('Analyzing natural language input...');

    try {
      // Simulate processing steps with progress updates
      await updateProgress(25, 'Understanding quantum concepts...');
      await updateProgress(50, 'Generating circuit structure...');
      await updateProgress(75, 'Optimizing gate sequence...');
      
      const result = await quantumAI.parseNaturalLanguage(input);
      
      setProgress(100);
      setProcessingStep('Complete!');
      setLastResult(result);
      
      // Generate both circuit and algorithm code
      onCircuitGenerated(result.circuitGates);
      onAlgorithmGenerated(result.algorithmCode);
      
      toast.success(`Circuit generated with ${(result.confidence * 100).toFixed(0)}% confidence`);
      
    } catch (error) {
      toast.error('Failed to process natural language input');
      console.error('Natural language processing error:', error);
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        setProgress(0);
        setProcessingStep('');
      }, 2000);
    }
  };

  const updateProgress = async (value: number, step: string) => {
    setProgress(value);
    setProcessingStep(step);
    await new Promise(resolve => setTimeout(resolve, 400));
  };

  const useExamplePrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-quantum-glow">
          <Brain className="w-5 h-5" />
          Natural Language to Quantum Circuit
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Input Area */}
        <div className="space-y-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to create... (e.g., 'Create a Bell state between two qubits')"
            className="min-h-[100px] quantum-panel neon-border"
            disabled={isProcessing}
          />
          
          <Button
            onClick={processNaturalLanguage}
            disabled={isProcessing || !input.trim()}
            className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
          >
            {isProcessing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Circuit
              </>
            )}
          </Button>
        </div>

        {/* Processing Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-quantum-particle">{processingStep}</span>
              <span className="text-quantum-neon">{progress}%</span>
            </div>
            <Progress value={progress} className="quantum-progress" />
          </div>
        )}

        {/* Results Display */}
        {lastResult && (
          <div className="space-y-3 p-4 bg-quantum-matrix/20 rounded-lg border border-quantum-neon/20">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-quantum-glow">Generated Result</h4>
              <Badge variant="outline" className="text-quantum-energy">
                {(lastResult.confidence * 100).toFixed(0)}% confidence
              </Badge>
            </div>
            
            <p className="text-sm text-quantum-particle">
              {lastResult.explanation}
            </p>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-quantum-void/30 rounded">
                <div className="text-quantum-neon">Gates Generated</div>
                <div className="font-mono">{lastResult.circuitGates.length}</div>
              </div>
              <div className="p-2 bg-quantum-void/30 rounded">
                <div className="text-quantum-neon">Circuit Depth</div>
                <div className="font-mono">
                  {Math.max(...lastResult.circuitGates.map((g: any) => g.position || 0)) + 1}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Example Prompts */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-quantum-neon">Try these examples:</h4>
          <div className="grid grid-cols-1 gap-2">
            {examplePrompts.slice(0, 3).map((prompt, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => useExamplePrompt(prompt)}
                disabled={isProcessing}
                className="text-left justify-start h-auto p-2 text-xs hover:bg-quantum-matrix/30"
              >
                <MessageSquare className="w-3 h-3 mr-2 shrink-0" />
                <span className="truncate">{prompt}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t border-quantum-neon/20">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 neon-border text-xs"
            onClick={() => setInput("Create a Bell state")}
            disabled={isProcessing}
          >
            <Zap className="w-3 h-3 mr-1" />
            Bell State
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 neon-border text-xs"
            onClick={() => setInput("Build superposition on 3 qubits")}
            disabled={isProcessing}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Superposition
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 neon-border text-xs"
            onClick={() => setInput("Implement Grover search")}
            disabled={isProcessing}
          >
            <Code className="w-3 h-3 mr-1" />
            Grover
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
