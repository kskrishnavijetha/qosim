import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Zap, BookOpen } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
}

interface Suggestion {
  type: 'next-gate' | 'algorithm' | 'tip';
  title: string;
  description: string;
  gates?: string[];
  icon: React.ReactNode;
}

interface GateSuggestionsPanelProps {
  circuit: Gate[];
  onSuggestionClick: (suggestion: Suggestion) => void;
}

export function GateSuggestionsPanel({ circuit, onSuggestionClick }: GateSuggestionsPanelProps) {
  const generateSuggestions = (): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    const gateTypes = circuit.map(g => g.type);
    const lastGateType = gateTypes[gateTypes.length - 1];
    
    // Algorithm-based suggestions
    if (gateTypes.includes('H') && gateTypes.includes('CNOT')) {
      suggestions.push({
        type: 'algorithm',
        title: 'Bell State Ready',
        description: 'You have the components for a Bell state! Consider adding measurement gates.',
        gates: ['M'],
        icon: <Zap className="w-4 h-4" />
      });
    }
    
    if (gateTypes.includes('H') && !gateTypes.includes('CNOT')) {
      suggestions.push({
        type: 'algorithm',
        title: 'Entanglement Opportunity',
        description: 'Add a CNOT gate to create entanglement with your superposition.',
        gates: ['CNOT'],
        icon: <Zap className="w-4 h-4" />
      });
    }
    
    if (gateTypes.filter(g => g === 'H').length >= 2 && !gateTypes.includes('X')) {
      suggestions.push({
        type: 'algorithm',
        title: 'Grover\'s Algorithm',
        description: 'Multiple Hadamards detected. Consider adding X gates for oracle implementation.',
        gates: ['X', 'Z'],
        icon: <Zap className="w-4 h-4" />
      });
    }

    // Next gate suggestions based on last gate
    if (lastGateType === 'H') {
      suggestions.push({
        type: 'next-gate',
        title: 'Common After Hadamard',
        description: 'CNOT for entanglement or Pauli gates for rotation',
        gates: ['CNOT', 'X', 'Z'],
        icon: <Lightbulb className="w-4 h-4" />
      });
    }
    
    if (lastGateType === 'X') {
      suggestions.push({
        type: 'next-gate',
        title: 'Common After Pauli-X',
        description: 'Z gate for phase manipulation or measurement',
        gates: ['Z', 'M'],
        icon: <Lightbulb className="w-4 h-4" />
      });
    }
    
    if (lastGateType === 'CNOT') {
      suggestions.push({
        type: 'next-gate',
        title: 'Common After CNOT',
        description: 'Measurement to observe entanglement or more rotations',
        gates: ['M', 'RX', 'RY'],
        icon: <Lightbulb className="w-4 h-4" />
      });
    }

    // Educational tips
    if (circuit.length === 0) {
      suggestions.push({
        type: 'tip',
        title: 'Start with Superposition',
        description: 'Begin with a Hadamard gate to create quantum superposition - the foundation of quantum computing.',
        icon: <BookOpen className="w-4 h-4" />
      });
    }
    
    if (gateTypes.includes('H') && circuit.length === 1) {
      suggestions.push({
        type: 'tip',
        title: 'Superposition Created',
        description: 'Your qubit is now in superposition! It exists in both |0⟩ and |1⟩ states simultaneously.',
        icon: <BookOpen className="w-4 h-4" />
      });
    }
    
    if (gateTypes.includes('M') && gateTypes.includes('H')) {
      suggestions.push({
        type: 'tip',
        title: 'Quantum Measurement',
        description: 'Measurement collapses the superposition. You\'ll get random 0 or 1 results with equal probability.',
        icon: <BookOpen className="w-4 h-4" />
      });
    }

    return suggestions;
  };

  const suggestions = generateSuggestions();

  if (suggestions.length === 0) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Build your circuit to see suggestions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="quantum-panel neon-border animate-in fade-in slide-in-from-right">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="text-quantum-neon mt-0.5">
                {suggestion.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">{suggestion.title}</h4>
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {suggestion.type === 'next-gate' ? 'Next' : 
                     suggestion.type === 'algorithm' ? 'Algorithm' : 'Tip'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {suggestion.description}
                </p>
                {suggestion.gates && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {suggestion.gates.map((gate, gateIndex) => (
                      <Button
                        key={gateIndex}
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs neon-border hover:scale-105 transition-all duration-200"
                        onClick={() => onSuggestionClick(suggestion)}
                      >
                        {gate}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {index < suggestions.length - 1 && <Separator className="opacity-30" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}