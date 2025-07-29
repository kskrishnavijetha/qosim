
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { type QuantumGate, type QuantumSimulationResult } from '@/types/qosim';
import { Bot, Lightbulb, Zap, Code2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface AIAssistantProps {
  circuit: QuantumGate[];
  simulationResult: QuantumSimulationResult | null;
  onOptimizationSuggestion: (suggestion: string) => void;
  onCircuitGeneration: (circuit: QuantumGate[]) => void;
}

export function AIAssistant({
  circuit,
  simulationResult,
  onOptimizationSuggestion,
  onCircuitGeneration
}: AIAssistantProps) {
  const [userQuery, setUserQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestions] = useState([
    'Optimize this circuit for better performance',
    'Generate a Bell state circuit',
    'Add error correction to this circuit',
    'Explain the entanglement in this circuit'
  ]);

  const handleAIQuery = async () => {
    if (!userQuery.trim()) return;
    
    setIsProcessing(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (userQuery.toLowerCase().includes('optimize')) {
        onOptimizationSuggestion('Consider reducing circuit depth by combining consecutive rotations');
      } else if (userQuery.toLowerCase().includes('bell state')) {
        const bellCircuit: QuantumGate[] = [
          {
            id: 'h_0',
            type: 'H',
            qubits: [0],
            position: { x: 60, y: 0 },
            metadata: { timestamp: Date.now() }
          },
          {
            id: 'cnot_01',
            type: 'CNOT',
            qubits: [0, 1],
            position: { x: 120, y: 0 },
            metadata: { timestamp: Date.now() + 1 }
          }
        ];
        onCircuitGeneration(bellCircuit);
      }
      
      toast.success('AI Analysis Complete');
      setUserQuery('');
    } catch (error) {
      toast.error('AI processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUserQuery(suggestion);
  };

  return (
    <div className="space-y-4">
      {/* AI Chat Interface */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-400 flex items-center">
            <Bot className="w-4 h-4 mr-2" />
            AI Assistant Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Ask me anything about your quantum circuit..."
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="bg-black/50 border-white/10 text-white min-h-[80px]"
          />
          <Button
            onClick={handleAIQuery}
            disabled={isProcessing || !userQuery.trim()}
            className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400"
          >
            {isProcessing ? (
              <>
                <Bot className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <MessageSquare className="w-4 h-4 mr-2" />
                Ask AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Quick Suggestions */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-400 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2" />
            Quick Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left justify-start text-slate-300 border-slate-600/30 hover:bg-purple-500/10"
            >
              {suggestion}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Circuit Analysis */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-400 flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Circuit Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Complexity:</span>
            <Badge variant="outline" className="text-xs">
              {circuit.length > 10 ? 'High' : circuit.length > 5 ? 'Medium' : 'Low'}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Optimization:</span>
            <Badge variant="outline" className="text-xs">
              {circuit.length > 8 ? 'Recommended' : 'Good'}
            </Badge>
          </div>
          <Button
            onClick={() => onOptimizationSuggestion('AI recommends reducing gate count')}
            size="sm"
            variant="outline"
            className="w-full text-yellow-400 border-yellow-400/30"
          >
            <Code2 className="w-4 h-4 mr-2" />
            Get Optimization Tips
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
