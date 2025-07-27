
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Send, X, Lightbulb, Zap, AlertTriangle } from 'lucide-react';
import type { QuantumGate } from '@/hooks/useCircuitBuilder';

interface AIAssistantProps {
  circuit: QuantumGate[];
  onClose: () => void;
  onSuggestion: (gate: Omit<QuantumGate, 'id'>) => void;
}

export function AIAssistant({ circuit, onClose, onSuggestion }: AIAssistantProps) {
  const [messages, setMessages] = useState([
    { id: 1, type: 'ai', text: 'Hello! I\'m your quantum circuit AI assistant. I can help you optimize your circuit, suggest gates, and provide insights.' },
    { id: 2, type: 'ai', text: 'What would you like to work on today?' }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestions = [
    {
      id: 1,
      type: 'optimization',
      title: 'Reduce Circuit Depth',
      description: 'I can help reduce your circuit depth by 2 layers using gate commutation rules.',
      action: () => {
        // Optimization logic here
        addMessage('ai', 'I\'ve analyzed your circuit and found opportunities to reduce depth by combining adjacent gates.');
      }
    },
    {
      id: 2,
      type: 'correction',
      title: 'Add Error Correction',
      description: 'Consider adding quantum error correction codes to improve circuit reliability.',
      action: () => {
        addMessage('ai', 'I recommend adding a 3-qubit repetition code for error correction.');
      }
    },
    {
      id: 3,
      type: 'enhancement',
      title: 'Bell State Preparation',
      description: 'I noticed you might want to create a Bell state. Let me help optimize this.',
      action: () => {
        onSuggestion({
          type: 'H',
          qubits: [0],
          layer: circuit.length,
          position: { x: 0, y: 0 }
        });
        setTimeout(() => {
          onSuggestion({
            type: 'CNOT',
            qubits: [0, 1],
            layer: circuit.length + 1,
            position: { x: 0, y: 0 }
          });
        }, 500);
        addMessage('ai', 'I\'ve added a Hadamard gate followed by a CNOT to create a Bell state.');
      }
    }
  ];

  const addMessage = (type: 'user' | 'ai', text: string) => {
    const newMessage = {
      id: Date.now(),
      type,
      text
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    addMessage('user', input);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      
      // Simple pattern matching for demo
      const response = generateResponse(input);
      addMessage('ai', response);
    }, 1000);
  };

  const generateResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('optimize') || input.includes('depth')) {
      return 'I can help optimize your circuit! Your current circuit has some opportunities for gate commutation. Would you like me to apply depth reduction techniques?';
    } else if (input.includes('error') || input.includes('correction')) {
      return 'Quantum error correction is crucial for reliable quantum computation. For your current circuit, I recommend implementing a stabilizer code. Would you like me to suggest specific error correction gates?';
    } else if (input.includes('bell') || input.includes('entangle')) {
      return 'Bell states are fundamental for quantum entanglement! I can help you create maximally entangled states. Would you like me to add the necessary gates?';
    } else if (input.includes('measure') || input.includes('measurement')) {
      return 'Measurement is a key operation in quantum circuits. I can help you add measurement gates at optimal positions. Where would you like to measure?';
    } else {
      return 'I understand you\'re working on your quantum circuit. Can you be more specific about what you\'d like help with? I can assist with optimization, error correction, gate suggestions, or circuit analysis.';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'correction': return <AlertTriangle className="w-4 h-4" />;
      case 'enhancement': return <Lightbulb className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'bg-blue-500';
      case 'correction': return 'bg-yellow-500';
      case 'enhancement': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Assistant
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* AI Suggestions */}
        <div className="space-y-2">
          <div className="font-medium">Smart Suggestions</div>
          <div className="space-y-2">
            {suggestions.map(suggestion => (
              <div key={suggestion.id} className="p-3 rounded-lg border hover:bg-muted cursor-pointer" onClick={suggestion.action}>
                <div className="flex items-start gap-2">
                  <div className={`p-1 rounded ${getSuggestionColor(suggestion.type)} text-white`}>
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{suggestion.title}</div>
                    <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="space-y-2">
          <div className="font-medium">Chat</div>
          
          <ScrollArea className="h-48 border rounded-lg p-2">
            <div className="space-y-2">
              {messages.map(message => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    <div className="text-sm">{message.text}</div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-2 rounded-lg">
                    <div className="text-sm">AI is typing...</div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about your circuit..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button size="sm" onClick={handleSend} disabled={!input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Circuit Analysis */}
        <div className="space-y-2">
          <div className="font-medium">Circuit Analysis</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Gate Count</span>
              <Badge variant="outline">{circuit.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Circuit Depth</span>
              <Badge variant="outline">
                {circuit.length > 0 ? Math.max(...circuit.map(g => g.layer)) + 1 : 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Optimization Score</span>
              <Badge variant="outline" className="bg-green-500 text-white">
                {Math.min(100, Math.max(0, 100 - circuit.length * 5))}%
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
