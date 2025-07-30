import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Brain, Sparkles, TrendingUp, BookOpen, Zap } from 'lucide-react';
import { quantumAI, AIRecommendation } from '@/services/QuantumAIService';

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
  educationalContext?: string;
}

interface GateSuggestionsPanelProps {
  circuit: Gate[];
  onSuggestionClick: (suggestion: Suggestion) => void;
}

export function GateSuggestionsPanel({ circuit, onSuggestionClick }: GateSuggestionsPanelProps) {
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

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

  // Get AI-powered recommendations
  useEffect(() => {
    if (circuit.length > 0) {
      loadAIRecommendations();
    }
  }, [circuit]);

  const loadAIRecommendations = async () => {
    setIsLoadingAI(true);
    try {
      const recommendations = await quantumAI.getContextualRecommendations(circuit);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error('Failed to load AI recommendations:', error);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const suggestions = generateSuggestions();
  const allRecommendations: (Suggestion & AIRecommendation)[] = [
    ...suggestions.map(s => ({
      ...s,
      type: s.type as any,
      confidence: 0.8,
      implementation: s.gates?.join(', ') || '',
      educationalContext: s.educationalContext
    })), 
    ...aiRecommendations.map(r => ({
      ...r,
      icon: getRecommendationIcon(r.type),
      gates: r.implementation ? r.implementation.split(',') : undefined
    }))
  ];

  if (allRecommendations.length === 0 && !isLoadingAI) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI-Powered Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Build your circuit to see AI suggestions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="quantum-panel neon-border animate-in fade-in slide-in-from-right">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
          <Brain className="w-4 h-4" />
          AI-Powered Suggestions
          {isLoadingAI && <div className="w-3 h-3 border border-quantum-neon border-t-transparent rounded-full animate-spin" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {allRecommendations.map((recommendation, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="text-quantum-neon mt-0.5">
                {recommendation.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">{recommendation.title}</h4>
                  <Badge 
                    variant="secondary" 
                    className="text-xs"
                  >
                    {getRecommendationTypeLabel(recommendation.type)}
                  </Badge>
                  {recommendation.confidence && (
                    <Badge variant="outline" className="text-xs text-quantum-energy">
                      {(recommendation.confidence * 100).toFixed(0)}%
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {recommendation.description}
                </p>
                {recommendation.educationalContext && (
                  <p className="text-xs text-quantum-particle italic">
                    💡 {recommendation.educationalContext}
                  </p>
                )}
                {recommendation.implementation && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {recommendation.implementation.split(',').map((item, itemIndex) => (
                      <Button
                        key={itemIndex}
                        variant="outline"
                        size="sm"
                        className="h-6 px-2 text-xs neon-border hover:scale-105 transition-all duration-200"
                        onClick={() => onSuggestionClick(recommendation as any)}
                      >
                        {item.trim()}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {index < allRecommendations.length - 1 && <Separator className="opacity-30" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function getRecommendationIcon(type: string) {
  switch (type) {
    case 'algorithm': return <Sparkles className="w-4 h-4" />;
    case 'optimization': return <TrendingUp className="w-4 h-4" />;
    case 'educational': return <BookOpen className="w-4 h-4" />;
    default: return <Lightbulb className="w-4 h-4" />;
  }
}

function getRecommendationTypeLabel(type: string) {
  switch (type) {
    case 'algorithm': return 'Algorithm';
    case 'optimization': return 'Optimize';
    case 'educational': return 'Learn';
    case 'gate': return 'Gate';
    default: return 'Suggestion';
  }
}
