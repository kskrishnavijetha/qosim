
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Brain, Sparkles, MessageSquare, Code, Lightbulb, Zap } from 'lucide-react';

interface AlgorithmAIProps {
  language: 'python' | 'javascript';
  onCodeGenerated: (code: string) => void;
}

interface Suggestion {
  id: string;
  title: string;
  description: string;
  code: string;
  category: 'optimization' | 'algorithm' | 'debugging' | 'learning';
  confidence: number;
}

const aiSuggestions: Record<string, Suggestion[]> = {
  javascript: [
    {
      id: 'bell-state-js',
      title: 'Create Bell State',
      description: 'Generate a maximally entangled two-qubit Bell state |Φ+⟩',
      category: 'algorithm',
      confidence: 0.95,
      code: `await sdk.initialize();
let circuit = sdk.createCircuit('Bell State', 2);
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'cnot', controlQubit: 0, qubit: 1 });
const result = await sdk.simulate(circuit);`
    },
    {
      id: 'superposition-js',
      title: 'Create Superposition',
      description: 'Put all qubits in equal superposition using Hadamard gates',
      category: 'algorithm',
      confidence: 0.92,
      code: `await sdk.initialize();
let circuit = sdk.createCircuit('Superposition', 3);
for (let i = 0; i < 3; i++) {
    circuit = sdk.addGate(circuit, { type: 'h', qubit: i });
}
const result = await sdk.simulate(circuit);`
    },
    {
      id: 'phase-kickback-js',
      title: 'Phase Kickback Demo',
      description: 'Demonstrate quantum phase kickback with controlled gates',
      category: 'learning',
      confidence: 0.88,
      code: `await sdk.initialize();
let circuit = sdk.createCircuit('Phase Kickback', 2);
circuit = sdk.addGate(circuit, { type: 'x', qubit: 1 }); // |1⟩ target
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 }); // Control in |+⟩
circuit = sdk.addGate(circuit, { type: 'cz', controlQubit: 0, qubit: 1 });
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 }); // Measure in X basis
const result = await sdk.simulate(circuit);`
    }
  ],
  python: [
    {
      id: 'bell-state-py',
      title: 'Create Bell State',
      description: 'Generate a maximally entangled two-qubit Bell state |Φ+⟩',
      category: 'algorithm',
      confidence: 0.95,
      code: `from qosim_sdk import QuantumSimulator

sim = QuantumSimulator(2)
sim.h(0)      # Create superposition
sim.cnot(0, 1)  # Create entanglement
result = sim.run()`
    },
    {
      id: 'deutsch-py',
      title: "Deutsch's Algorithm",
      description: 'Determine if a function is constant or balanced with just one query',
      category: 'algorithm',
      confidence: 0.90,
      code: `from qosim_sdk import QuantumSimulator

sim = QuantumSimulator(2)
# Initialize |01⟩
sim.x(1)
# Hadamard both qubits
sim.h(0)
sim.h(1)
# Oracle (example: balanced function)
sim.cnot(0, 1)
# Final Hadamard on query qubit
sim.h(0)
result = sim.run()`
    },
    {
      id: 'ghz-state-py',
      title: 'GHZ State',
      description: 'Create a three-qubit GHZ state for multipartite entanglement',
      category: 'algorithm',
      confidence: 0.87,
      code: `from qosim_sdk import QuantumSimulator

sim = QuantumSimulator(3)
sim.h(0)        # Create superposition on first qubit
sim.cnot(0, 1)  # Entangle first two qubits
sim.cnot(1, 2)  # Entangle with third qubit
result = sim.run()`
    }
  ]
};

export function AlgorithmAI({ language, onCodeGenerated }: AlgorithmAIProps) {
  const [naturalLanguageInput, setNaturalLanguageInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const { toast } = useToast();

  const suggestions = aiSuggestions[language] || [];

  const processNaturalLanguage = async () => {
    if (!naturalLanguageInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please describe what you want to create",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const code = await generateCodeFromNaturalLanguage(naturalLanguageInput, language);
      onCodeGenerated(code);
      setAiResponse(getAiExplanation(naturalLanguageInput));
      
      toast({
        title: "Code Generated",
        description: "AI has generated quantum circuit code from your description",
      });
    } catch (error) {
      toast({
        title: "Generation Error",
        description: "Failed to generate code from description",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCodeFromNaturalLanguage = async (input: string, lang: 'python' | 'javascript'): Promise<string> => {
    const lowerInput = input.toLowerCase();
    
    // Simple pattern matching for demo
    if (lowerInput.includes('bell state') || lowerInput.includes('entangled')) {
      return lang === 'javascript' 
        ? suggestions.find(s => s.id === 'bell-state-js')?.code || ''
        : suggestions.find(s => s.id === 'bell-state-py')?.code || '';
    }
    
    if (lowerInput.includes('superposition') || lowerInput.includes('hadamard')) {
      return lang === 'javascript' 
        ? suggestions.find(s => s.id === 'superposition-js')?.code || ''
        : `from qosim_sdk import QuantumSimulator\n\nsim = QuantumSimulator(2)\nsim.h(0)\nsim.h(1)\nresult = sim.run()`;
    }
    
    if (lowerInput.includes('grover') || lowerInput.includes('search')) {
      return lang === 'javascript'
        ? `await sdk.initialize();
let circuit = sdk.createCircuit('Grover Search', 2);
// Initialize superposition
circuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });
circuit = sdk.addGate(circuit, { type: 'h', qubit: 1 });
// Oracle and diffusion
circuit = sdk.addGate(circuit, { type: 'cz', controlQubit: 0, qubit: 1 });
const result = await sdk.simulate(circuit);`
        : `from qosim_sdk import QuantumSimulator

sim = QuantumSimulator(2)
sim.h(0)  # Initialize superposition
sim.h(1)
sim.cz(0, 1)  # Oracle
result = sim.run()`;
    }
    
    // Default simple circuit
    return lang === 'javascript'
      ? `await sdk.initialize();\nlet circuit = sdk.createCircuit('Custom Circuit', 2);\ncircuit = sdk.addGate(circuit, { type: 'h', qubit: 0 });\nconst result = await sdk.simulate(circuit);`
      : `from qosim_sdk import QuantumSimulator\n\nsim = QuantumSimulator(2)\nsim.h(0)\nresult = sim.run()`;
  };

  const getAiExplanation = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('bell state')) {
      return "I've generated a Bell state circuit that creates maximal entanglement between two qubits. The Hadamard gate creates superposition, and the CNOT gate creates the entanglement.";
    }
    
    if (lowerInput.includes('superposition')) {
      return "I've created a circuit that puts qubits into superposition using Hadamard gates. Each qubit will be in an equal superposition of |0⟩ and |1⟩.";
    }
    
    if (lowerInput.includes('grover')) {
      return "I've generated a simplified Grover's algorithm that can search through quantum states with quadratic speedup compared to classical search.";
    }
    
    return "I've generated a quantum circuit based on your description. The circuit uses fundamental quantum gates to achieve the desired quantum state preparation and manipulation.";
  };

  const applySuggestion = (suggestion: Suggestion) => {
    onCodeGenerated(suggestion.code);
    setAiResponse(`Applied suggestion: ${suggestion.description}`);
    
    toast({
      title: "Suggestion Applied",
      description: suggestion.title,
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'algorithm': return <Code className="w-4 h-4" />;
      case 'debugging': return <MessageSquare className="w-4 h-4" />;
      case 'learning': return <Lightbulb className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'optimization': return 'text-quantum-energy';
      case 'algorithm': return 'text-quantum-glow';
      case 'debugging': return 'text-red-400';
      case 'learning': return 'text-quantum-particle';
      default: return 'text-quantum-neon';
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Quantum AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Natural Language Input */}
        <div className="space-y-2">
          <h4 className="text-sm font-mono text-quantum-neon">Natural Language to Code</h4>
          <Textarea
            value={naturalLanguageInput}
            onChange={(e) => setNaturalLanguageInput(e.target.value)}
            placeholder="Describe what you want to create... (e.g., 'Create a Bell state between two qubits' or 'Make a superposition of 3 qubits')"
            className="quantum-panel neon-border h-20 text-sm"
          />
          <Button
            onClick={processNaturalLanguage}
            disabled={isProcessing || !naturalLanguageInput.trim()}
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
                Generate Code
              </>
            )}
          </Button>
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="p-3 bg-quantum-matrix/30 rounded-lg border border-quantum-neon/20">
            <div className="flex items-start gap-2">
              <Brain className="w-4 h-4 mt-0.5 text-quantum-neon" />
              <p className="text-xs text-quantum-particle">{aiResponse}</p>
            </div>
          </div>
        )}

        {/* AI Suggestions */}
        <div className="space-y-2">
          <h4 className="text-sm font-mono text-quantum-neon">Smart Suggestions</h4>
          <ScrollArea className="h-[200px] pr-2">
            <div className="space-y-2">
              {suggestions.map(suggestion => (
                <Button
                  key={suggestion.id}
                  variant="ghost"
                  className="w-full p-3 h-auto justify-start text-left hover:bg-quantum-matrix/50 border border-quantum-neon/20"
                  onClick={() => applySuggestion(suggestion)}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className={`mt-0.5 ${getCategoryColor(suggestion.category)}`}>
                      {getCategoryIcon(suggestion.category)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{suggestion.title}</span>
                        <Badge 
                          variant="outline" 
                          className="text-xs text-quantum-energy"
                        >
                          {(suggestion.confidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-quantum-neon/20">
          <Button
            variant="outline"
            size="sm"
            className="neon-border text-xs"
            onClick={() => setNaturalLanguageInput("Create a Bell state between two qubits")}
          >
            <Heart className="w-3 h-3 mr-1" />
            Bell State
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="neon-border text-xs"
            onClick={() => setNaturalLanguageInput("Create superposition on all qubits")}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Superposition
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
