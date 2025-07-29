
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Bot, Send, Lightbulb, Code, Zap, MessageSquare, Sparkles, RefreshCw } from 'lucide-react';
import { Algorithm } from './QuantumAlgorithmsSDK';

export interface AICodeAssistantProps {
  currentCode: string;
  selectedAlgorithm: Algorithm | null;
  language: 'python' | 'javascript';
  onCodeSuggestion: (code: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AICodeAssistant({
  currentCode,
  selectedAlgorithm,
  language,
  onCodeSuggestion
}: AICodeAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await generateAIResponse(input, currentCode, selectedAlgorithm, language);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.suggestedCode) {
        onCodeSuggestion(response.suggestedCode);
      }
    } catch (error) {
      toast({
        title: "AI Assistant Error",
        description: "Failed to generate response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickSuggestion = async (suggestion: string) => {
    setInput(suggestion);
    await handleSendMessage();
  };

  const generateOptimizedCode = async () => {
    if (!currentCode.trim()) {
      toast({
        title: "No Code to Optimize",
        description: "Please write some code first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const optimized = optimizeQuantumCode(currentCode, language);
      onCodeSuggestion(optimized);
      
      toast({
        title: "Code Optimized",
        description: "Your quantum algorithm has been optimized for better performance.",
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Failed to optimize code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFromNaturalLanguage = async () => {
    if (!input.trim()) {
      toast({
        title: "No Description Provided",
        description: "Please describe what you want to implement.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generated = await generateCodeFromDescription(input, language);
      onCodeSuggestion(generated);
      
      toast({
        title: "Code Generated",
        description: "Quantum algorithm generated from your description.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const quickSuggestions = [
    "How do I create a Bell state?",
    "Optimize this code for better performance",
    "Add error correction to my algorithm",
    "Explain this quantum algorithm step by step",
    "Generate a QFT implementation",
    "Help me debug this quantum circuit",
    "Convert this to a different quantum framework",
    "Add visualization to my algorithm"
  ];

  return (
    <div className="flex flex-col h-full bg-quantum-void">
      <div className="flex-none p-4 border-b border-quantum-neon/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-quantum-glow" />
            <h2 className="text-lg font-semibold text-quantum-glow">AI Code Assistant</h2>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-quantum-particle">
              {language.toUpperCase()}
            </Badge>
            <Button
              onClick={generateOptimizedCode}
              disabled={isGenerating}
              size="sm"
              className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
            >
              <Zap className="w-4 h-4 mr-2" />
              Optimize
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="flex-none grid w-full grid-cols-3 bg-quantum-matrix border-b border-quantum-neon/20">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="generate" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Generate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 m-0 p-0 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <Bot className="w-16 h-16 text-quantum-particle mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-quantum-glow mb-2">AI Assistant Ready</h3>
                  <p className="text-quantum-particle">Ask me anything about quantum programming!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-quantum-glow text-quantum-void'
                            : 'bg-quantum-matrix text-quantum-neon'
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className="text-xs opacity-50 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="bg-quantum-matrix text-quantum-neon p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Generating response...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            <div className="flex-none p-4 border-t border-quantum-neon/20">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me about quantum programming..."
                  className="quantum-panel neon-border"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isGenerating || !input.trim()}
                  className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="suggestions" className="flex-1 m-0 p-0">
            <div className="h-full p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickSuggestions.map((suggestion, index) => (
                  <Card key={index} className="quantum-panel neon-border cursor-pointer hover:border-quantum-glow transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-quantum-glow" />
                        <span className="text-sm text-quantum-neon">{suggestion}</span>
                      </div>
                      <Button
                        onClick={() => handleQuickSuggestion(suggestion)}
                        size="sm"
                        variant="outline"
                        className="mt-2 w-full border-quantum-neon text-quantum-neon hover:bg-quantum-neon hover:text-quantum-void"
                        disabled={isGenerating}
                      >
                        Ask This
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="generate" className="flex-1 m-0 p-0">
            <div className="h-full p-4">
              <Card className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-quantum-glow">Natural Language to Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-quantum-neon mb-2">
                        Describe what you want to implement:
                      </label>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Example: Create a quantum algorithm that generates a 3-qubit GHZ state with error correction..."
                        className="w-full h-32 p-3 bg-quantum-void border border-quantum-neon/20 rounded-lg text-quantum-neon resize-none"
                        disabled={isGenerating}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={generateFromNaturalLanguage}
                        disabled={isGenerating || !input.trim()}
                        className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isGenerating ? 'Generating...' : 'Generate Code'}
                      </Button>
                      <Button
                        onClick={() => setInput('')}
                        variant="outline"
                        disabled={isGenerating}
                        className="border-quantum-neon text-quantum-neon hover:bg-quantum-neon hover:text-quantum-void"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

async function generateAIResponse(
  query: string, 
  code: string, 
  algorithm: Algorithm | null, 
  language: 'python' | 'javascript'
): Promise<{ content: string; suggestedCode?: string }> {
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('bell state')) {
    return {
      content: `A Bell state is a maximally entangled quantum state of two qubits. Here's how to create one:

1. Start with two qubits in |00⟩ state
2. Apply a Hadamard gate to the first qubit: H|0⟩ = (|0⟩ + |1⟩)/√2
3. Apply a CNOT gate with the first qubit as control and second as target
4. The result is the Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2

This creates maximum entanglement between the two qubits.`,
      suggestedCode: language === 'python' ? 
        `# Bell State Creation\nsim = QuantumSimulator(2)\nsim.h(0)\nsim.cnot(0, 1)\nresult = sim.run()` :
        `// Bell State Creation\nconst sim = new QOSimSimulator(2);\nsim.addGate("H", 0);\nsim.addGate("CNOT", 0, 1);\nsim.run();`
    };
  }
  
  if (lowerQuery.includes('optimize')) {
    return {
      content: `I can help optimize your quantum code for better performance:

1. **Gate Reduction**: Minimize the number of gates
2. **Circuit Depth**: Reduce the depth for better coherence
3. **Parallelization**: Execute independent gates in parallel
4. **Error Mitigation**: Add error correction where needed

Let me analyze your current code and suggest optimizations.`,
      suggestedCode: optimizeQuantumCode(code, language)
    };
  }
  
  if (lowerQuery.includes('qft')) {
    return {
      content: `The Quantum Fourier Transform (QFT) is the quantum analogue of the classical Discrete Fourier Transform. It's essential for many quantum algorithms like Shor's algorithm.

Key steps:
1. Apply Hadamard gates
2. Apply controlled rotation gates
3. Swap qubits for correct output order

The QFT transforms computational basis states to frequency domain.`,
      suggestedCode: generateQFTCode(language)
    };
  }
  
  return {
    content: `I understand you're asking about "${query}". This is a great question about quantum computing! 

Based on your current code and the algorithm you're working with, I can help you:
- Understand quantum concepts
- Optimize your code
- Debug quantum circuits
- Implement new algorithms
- Add visualizations

Could you provide more specific details about what you'd like to achieve?`
  };
}

function optimizeQuantumCode(code: string, language: 'python' | 'javascript'): string {
  // Simple optimization example
  if (language === 'python') {
    return code
      .replace(/sim\.x\((\d+)\)\s*sim\.x\((\d+)\)/g, '# Optimized: Removed redundant X gates')
      .replace(/sim\.h\((\d+)\)\s*sim\.h\((\d+)\)/g, '# Optimized: Removed redundant H gates');
  } else {
    return code
      .replace(/sim\.addGate\("X", (\d+)\);\s*sim\.addGate\("X", (\d+)\);/g, '// Optimized: Removed redundant X gates')
      .replace(/sim\.addGate\("H", (\d+)\);\s*sim\.addGate\("H", (\d+)\);/g, '// Optimized: Removed redundant H gates');
  }
}

function generateQFTCode(language: 'python' | 'javascript'): string {
  if (language === 'python') {
    return `# Quantum Fourier Transform
import numpy as np
from qosim_sdk import QuantumSimulator

def qft_3qubit():
    sim = QuantumSimulator(3)
    
    # Apply QFT
    sim.h(0)
    sim.controlled_phase(0, 1, np.pi/2)
    sim.controlled_phase(0, 2, np.pi/4)
    sim.h(1)
    sim.controlled_phase(1, 2, np.pi/2)
    sim.h(2)
    
    # Swap qubits
    sim.swap(0, 2)
    
    return sim.run()

qft_3qubit()`;
  } else {
    return `// Quantum Fourier Transform
import { QOSimSimulator } from './qosim-core.js';

function qft3Qubit() {
    const sim = new QOSimSimulator(3);
    
    // Apply QFT
    sim.addGate("H", 0);
    sim.addGate("CP", 0, 1, Math.PI/2);
    sim.addGate("CP", 0, 2, Math.PI/4);
    sim.addGate("H", 1);
    sim.addGate("CP", 1, 2, Math.PI/2);
    sim.addGate("H", 2);
    
    // Swap qubits
    sim.addGate("SWAP", 0, 2);
    
    sim.run();
    return sim.getResults();
}

qft3Qubit();`;
  }
}

async function generateCodeFromDescription(description: string, language: 'python' | 'javascript'): Promise<string> {
  // Simple code generation based on description
  const lower = description.toLowerCase();
  
  if (lower.includes('ghz') || lower.includes('three qubit')) {
    if (language === 'python') {
      return `# GHZ State Generation
from qosim_sdk import QuantumSimulator

def create_ghz_state():
    sim = QuantumSimulator(3)
    
    # Create GHZ state |000⟩ + |111⟩
    sim.h(0)
    sim.cnot(0, 1)
    sim.cnot(1, 2)
    
    result = sim.run()
    print("GHZ State Created!")
    return result

create_ghz_state()`;
    } else {
      return `// GHZ State Generation
import { QOSimSimulator } from './qosim-core.js';

function createGHZState() {
    const sim = new QOSimSimulator(3);
    
    // Create GHZ state |000⟩ + |111⟩
    sim.addGate("H", 0);
    sim.addGate("CNOT", 0, 1);
    sim.addGate("CNOT", 1, 2);
    
    sim.run();
    console.log("GHZ State Created!");
    return sim.getResults();
}

createGHZState();`;
    }
  }
  
  return `# Generated from description: ${description}
# This is a template - please specify more details for better code generation
from qosim_sdk import QuantumSimulator

sim = QuantumSimulator(2)
sim.h(0)
result = sim.run()
print(result.state_vector)`;
}
