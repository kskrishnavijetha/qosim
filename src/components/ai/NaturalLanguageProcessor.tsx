
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Sparkles, Loader2, AlertCircle, Key } from 'lucide-react';
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
  const [response, setResponse] = useState<{
    explanation: string;
    confidence: number;
    gates?: any[];
    code?: string;
  } | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);

  const quickExamples = [
    "Create a Bell state between two qubits",
    "Generate Grover's algorithm for 3 qubits", 
    "Build a quantum Fourier transform circuit",
    "Create a superposition on 4 qubits",
    "Design a quantum error correction circuit"
  ];

  const processNaturalLanguage = async () => {
    if (!input.trim()) {
      toast.error('Please enter a description');
      return;
    }

    if (!apiKey.trim()) {
      toast.error('Please enter your Perplexity API key');
      setShowApiKeyInput(true);
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: `You are a quantum computing expert. When a user describes a quantum circuit or algorithm, respond with a JSON object containing:
              {
                "explanation": "Brief explanation of what the circuit does",
                "confidence": 0.95,
                "gates": [{"type": "H", "qubit": 0, "position": 0}, {"type": "CNOT", "qubits": [0, 1], "position": 1}],
                "code": "// Python-like pseudocode\\ncircuit.h(0)\\ncircuit.cnot(0, 1)"
              }
              
              Available gate types: H, X, Y, Z, RX, RY, RZ, CNOT, CZ, SWAP, TOFFOLI, U1, U2, U3.
              For multi-qubit gates, use "qubits" array instead of single "qubit".
              Always include position (0-indexed layer position).`
            },
            {
              role: 'user',
              content: input
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          return_images: false,
          return_related_questions: false,
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      
      if (!content) {
        throw new Error('No response from AI');
      }

      // Try to parse JSON response
      let parsedResponse;
      try {
        parsedResponse = JSON.parse(content);
      } catch {
        // If not JSON, create a fallback response
        parsedResponse = {
          explanation: content,
          confidence: 0.7,
          gates: [{ type: 'H', qubit: 0, position: 0 }],
          code: '// Basic quantum circuit\ncircuit.h(0);'
        };
      }

      setResponse(parsedResponse);

      if (parsedResponse.gates?.length > 0) {
        onCircuitGenerated(parsedResponse.gates);
      }

      if (parsedResponse.code) {
        onAlgorithmGenerated(parsedResponse.code);
      }

      toast.success('Circuit generated successfully!');
    } catch (error) {
      console.error('Natural language processing failed:', error);
      toast.error(`Failed to process input: ${error.message}`);
      
      // Fallback to local processing
      const fallbackResponse = await processLocally(input);
      setResponse(fallbackResponse);
      
      if (fallbackResponse.gates?.length > 0) {
        onCircuitGenerated(fallbackResponse.gates);
      }
      
      if (fallbackResponse.code) {
        onAlgorithmGenerated(fallbackResponse.code);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const processLocally = async (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('bell state')) {
      return {
        explanation: 'Generated a Bell state circuit creating entanglement between two qubits.',
        confidence: 0.95,
        gates: [
          { type: 'H', qubit: 0, position: 0 },
          { type: 'CNOT', qubits: [0, 1], position: 1 }
        ],
        code: '// Bell State\ncircuit.h(0);\ncircuit.cnot(0, 1);'
      };
    }
    
    if (lowerInput.includes('grover')) {
      return {
        explanation: 'Generated a simplified Grover search algorithm.',
        confidence: 0.88,
        gates: [
          { type: 'H', qubit: 0, position: 0 },
          { type: 'H', qubit: 1, position: 0 },
          { type: 'Z', qubit: 0, position: 1 },
          { type: 'CZ', qubits: [0, 1], position: 2 },
          { type: 'H', qubit: 0, position: 3 },
          { type: 'H', qubit: 1, position: 3 }
        ],
        code: '// Grover Algorithm\ncircuit.h([0, 1]);\ncircuit.z(0);\ncircuit.cz(0, 1);\ncircuit.h([0, 1]);'
      };
    }
    
    if (lowerInput.includes('superposition')) {
      const numQubits = 3;
      const gates = Array.from({ length: numQubits }, (_, i) => ({
        type: 'H',
        qubit: i,
        position: 0
      }));
      
      return {
        explanation: `Created superposition on ${numQubits} qubits using Hadamard gates.`,
        confidence: 0.92,
        gates,
        code: `// Superposition\n${gates.map(g => `circuit.h(${g.qubit});`).join('\n')}`
      };
    }
    
    return {
      explanation: 'Generated a basic quantum circuit. Try being more specific about the desired operation.',
      confidence: 0.6,
      gates: [{ type: 'H', qubit: 0, position: 0 }],
      code: '// Basic circuit\ncircuit.h(0);'
    };
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-quantum-glow">
          <MessageSquare className="w-5 h-5" />
          Natural Language to Quantum Circuit
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showApiKeyInput && (
          <div className="space-y-2">
            <Label htmlFor="api-key" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Perplexity API Key
            </Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Perplexity API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from{' '}
              <a 
                href="https://perplexity.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-quantum-neon underline"
              >
                Perplexity AI
              </a>
            </p>
            {apiKey && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowApiKeyInput(false)}
              >
                Hide API Key Input
              </Button>
            )}
          </div>
        )}

        {!showApiKeyInput && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowApiKeyInput(true)}
            className="w-full"
          >
            <Key className="w-4 h-4 mr-2" />
            Show API Key Input
          </Button>
        )}

        <Separator />
        
        <div className="space-y-2">
          <Label htmlFor="circuit-description">Describe your quantum circuit</Label>
          <Textarea
            id="circuit-description"
            placeholder="e.g., 'Create a Bell state between two qubits' or 'Generate a quantum Fourier transform for 3 qubits'"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label>Try these examples:</Label>
          <div className="flex flex-wrap gap-2">
            {quickExamples.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleExampleClick(example)}
                className="text-xs"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={processNaturalLanguage}
          disabled={isProcessing || !input.trim()}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Circuit
            </>
          )}
        </Button>

        {response && (
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">AI Response</CardTitle>
                <Badge variant="secondary">
                  {Math.round(response.confidence * 100)}% confidence
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-2">
                {response.explanation}
              </p>
              {response.gates && (
                <p className="text-xs text-quantum-particle">
                  Generated {response.gates.length} gates
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="bg-muted/30">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">How it works:</p>
                <p>Describe quantum circuits in plain English. The AI will generate the corresponding gates and code.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
