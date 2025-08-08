
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { QNNArchitecture } from '@/hooks/useQNNBuilder';
import { Bot, Sparkles, Lightbulb, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface QNNAIAssistantProps {
  architecture: QNNArchitecture;
  onArchitectureGenerated: (architecture: QNNArchitecture) => void;
  onSuggestionApplied: (suggestion: string) => void;
}

export function QNNAIAssistant({ 
  architecture, 
  onArchitectureGenerated, 
  onSuggestionApplied 
}: QNNAIAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateArchitecture = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedArchitecture = mockGenerateArchitecture(prompt);
      onArchitectureGenerated(generatedArchitecture);
      
      toast.success('QNN architecture generated successfully!');
    } catch (error) {
      toast.error('Failed to generate architecture');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSuggestions = async () => {
    const newSuggestions = mockGenerateSuggestions(architecture);
    setSuggestions(newSuggestions);
  };

  const applySuggestion = (suggestion: string) => {
    onSuggestionApplied(suggestion);
    toast.success('Suggestion applied');
  };

  const quickPrompts = [
    "Create a quantum classifier for MNIST digit recognition",
    "Build a hybrid QNN for image classification with Conv2D and quantum layers",
    "Design a variational quantum neural network for binary classification",
    "Generate a quantum autoencoder with classical preprocessing"
  ];

  return (
    <Card className="quantum-panel neon-border h-full">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
          <Bot className="w-4 h-4" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Architecture Generation */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-quantum-neon">Generate QNN Architecture</h4>
          
          <Textarea
            placeholder="Describe the quantum neural network you want to build..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="text-xs min-h-[80px]"
          />
          
          <Button
            size="sm"
            onClick={generateArchitecture}
            disabled={!prompt.trim() || isGenerating}
            className="w-full"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Architecture'}
          </Button>
        </div>

        {/* Quick Prompts */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-quantum-neon">Quick Start</h4>
          <div className="space-y-1">
            {quickPrompts.map((quickPrompt, index) => (
              <Button
                key={index}
                size="sm"
                variant="ghost"
                className="w-full text-left justify-start text-xs h-auto p-2"
                onClick={() => setPrompt(quickPrompt)}
              >
                {quickPrompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Optimization Suggestions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-quantum-neon">Optimization Suggestions</h4>
            <Button size="sm" variant="outline" onClick={generateSuggestions}>
              <Lightbulb className="w-4 h-4" />
            </Button>
          </div>
          
          {suggestions.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="p-3 bg-card/30 rounded border text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-muted-foreground">{suggestion}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => applySuggestion(suggestion)}
                    >
                      <Zap className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Architecture Analysis */}
        {architecture.layers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-quantum-neon">Architecture Analysis</h4>
            <div className="p-3 bg-card/30 rounded border text-xs">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-quantum-glow">
                    {architecture.layers.filter(l => l.type.startsWith('quantum_')).length} Quantum
                  </Badge>
                  <Badge variant="outline" className="text-blue-400">
                    {architecture.layers.filter(l => !l.type.startsWith('quantum_')).length} Classical
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  {mockAnalyzeArchitecture(architecture)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Mock AI functions (in a real implementation, these would call actual AI services)
function mockGenerateArchitecture(prompt: string): QNNArchitecture {
  const layers = [];
  
  if (prompt.toLowerCase().includes('mnist') || prompt.toLowerCase().includes('image')) {
    layers.push({
      id: 'layer_1',
      type: 'flatten',
      position: { x: 50, y: 50 },
      config: { name: 'Input Flatten' },
      connections: { inputs: [], outputs: [] }
    });
    
    layers.push({
      id: 'layer_2',
      type: 'quantum_variational',
      position: { x: 250, y: 50 },
      config: { name: 'Quantum Layer', qubits: 4, layers: 2 },
      connections: { inputs: [], outputs: [] }
    });
    
    layers.push({
      id: 'layer_3',
      type: 'dense',
      position: { x: 450, y: 50 },
      config: { name: 'Output Dense', units: 10, activation: 'softmax' },
      connections: { inputs: [], outputs: [] }
    });
  }

  return {
    id: `ai_generated_${Date.now()}`,
    name: 'AI Generated QNN',
    layers,
    connections: [
      { from: 'layer_1', to: 'layer_2', type: 'classical_to_quantum' },
      { from: 'layer_2', to: 'layer_3', type: 'quantum_to_classical' }
    ],
    metadata: {
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      totalParameters: 100
    }
  };
}

function mockGenerateSuggestions(architecture: QNNArchitecture): string[] {
  const suggestions = [];
  
  if (architecture.layers.length === 0) {
    suggestions.push("Start by adding an input layer to process your data");
    suggestions.push("Consider adding a quantum variational layer for feature learning");
  }
  
  const quantumLayers = architecture.layers.filter(l => l.type.startsWith('quantum_'));
  const classicalLayers = architecture.layers.filter(l => !l.type.startsWith('quantum_'));
  
  if (quantumLayers.length === 0) {
    suggestions.push("Add quantum layers to leverage quantum advantages");
  }
  
  if (classicalLayers.length === 0) {
    suggestions.push("Consider adding classical preprocessing layers");
  }
  
  if (architecture.connections.length < architecture.layers.length - 1) {
    suggestions.push("Connect more layers to create a proper forward pass");
  }
  
  suggestions.push("Add batch normalization after quantum layers for stability");
  suggestions.push("Consider using dropout for regularization");
  
  return suggestions;
}

function mockAnalyzeArchitecture(architecture: QNNArchitecture): string {
  const quantumCount = architecture.layers.filter(l => l.type.startsWith('quantum_')).length;
  const classicalCount = architecture.layers.filter(l => !l.type.startsWith('quantum_')).length;
  
  if (quantumCount > classicalCount) {
    return "Quantum-heavy architecture suitable for problems requiring quantum speedup";
  } else if (classicalCount > quantumCount) {
    return "Classical-heavy hybrid network good for feature preprocessing";
  } else {
    return "Balanced hybrid architecture with equal quantum and classical components";
  }
}
