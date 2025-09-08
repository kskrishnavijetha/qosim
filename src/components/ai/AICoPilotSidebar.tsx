import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Bot, 
  User, 
  Zap, 
  Trash2, 
  Download,
  Copy,
  CircuitBoard
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isProcessing?: boolean;
}

interface AICoPilotSidebarProps {
  onInsertToCanvas?: (content: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AICoPilotSidebar({ onInsertToCanvas, isOpen, onClose }: AICoPilotSidebarProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    const processingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'Analyzing quantum circuit request...',
      timestamp: new Date(),
      isProcessing: true,
    };

    setMessages(prev => [...prev, userMessage, processingMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI processing (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock AI response based on user input
      const response = generateMockResponse(userMessage.content);
      
      setMessages(prev => prev.map(msg => 
        msg.id === processingMessage.id 
          ? { ...msg, content: response, isProcessing: false }
          : msg
      ));

      toast({
        title: "AI Response Generated",
        description: "Your quantum circuit suggestion is ready!",
      });
    } catch (error) {
      setMessages(prev => prev.filter(msg => msg.id !== processingMessage.id));
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('bell') || lowerInput.includes('entanglement')) {
      return `# Bell State Circuit

To create a Bell state (maximally entangled two-qubit state):

## Circuit Description
$$|\\psi\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$$

## Gates Required:
1. **Hadamard Gate** on qubit 0: $H|0\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)$
2. **CNOT Gate** with qubit 0 as control, qubit 1 as target

## Quantum Code:
\`\`\`qasm
OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];
creg c[2];
h q[0];
cx q[0],q[1];
measure q[0] -> c[0];
measure q[1] -> c[1];
\`\`\`

This creates perfect entanglement with 50% probability of measuring |00⟩ or |11⟩.`;
    }
    
    if (lowerInput.includes('grover') || lowerInput.includes('search')) {
      return `# Grover's Search Algorithm

## Overview
Grover's algorithm provides quadratic speedup for searching unsorted databases.

## Key Components:
1. **Oracle Function**: $O|x\\rangle = (-1)^{f(x)}|x\\rangle$
2. **Diffusion Operator**: $2|s\\rangle\\langle s| - I$

## Iterations Required:
$$\\text{Iterations} ≈ \\frac{\\pi}{4}\\sqrt{N}$$

For N = 4 items, optimal iterations: ~1
For N = 16 items, optimal iterations: ~3

Would you like me to generate the specific circuit for your search space?`;
    }
    
    if (lowerInput.includes('superposition')) {
      return `# Creating Superposition States

## Equal Superposition:
Use Hadamard gates: $H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$

## Custom Amplitude States:
For state $\\alpha|0\\rangle + \\beta|1\\rangle$ with $|\\alpha|^2 + |\\beta|^2 = 1$:

Use rotation gates:
- $R_y(2\\arccos(\\alpha))$ for amplitude control
- $R_z(\\phi)$ for phase control

## Multi-Qubit Superposition:
$H^{\\otimes n}|0\\rangle^{\\otimes n} = \\frac{1}{\\sqrt{2^n}}\\sum_{x=0}^{2^n-1}|x\\rangle$`;
    }
    
    return `# Quantum Circuit Analysis

I understand you're working on: "${input}"

## General Recommendations:
- Consider **decoherence effects** for longer circuits
- Use **error correction** for critical computations  
- Optimize **gate depth** for NISQ devices

## Next Steps:
1. Define your quantum state preparation
2. Apply quantum operations
3. Add measurement basis
4. Consider noise mitigation

Would you like me to elaborate on any specific aspect of your quantum circuit?`;
  };

  const handleInsertToCanvas = (content: string) => {
    if (onInsertToCanvas) {
      onInsertToCanvas(content);
      toast({
        title: "Inserted to Canvas",
        description: "Circuit has been added to your quantum canvas.",
      });
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({
      title: "Chat Cleared",
      description: "All messages have been removed.",
    });
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard.",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-sidebar-background border-l border-sidebar-border shadow-quantum z-50 flex flex-col">
      {/* Header */}
      <CardHeader className="border-b border-sidebar-border bg-gradient-quantum">
        <CardTitle className="flex items-center justify-between text-sidebar-primary-foreground">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-quantum-glow" />
            <span className="font-bold">AI Co-Pilot</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-quantum-energy/20 text-quantum-energy">
              {user ? 'Authenticated' : 'Guest'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-sidebar-primary-foreground hover:bg-white/10"
            >
              ×
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      {/* Chat Controls */}
      <div className="p-4 border-b border-sidebar-border bg-sidebar-accent/50">
        <div className="flex items-center justify-between">
          <span className="text-sm text-sidebar-foreground">
            Quantum Circuit Assistant
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              disabled={messages.length === 0}
              className="text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 mx-auto text-quantum-glow mb-4 animate-pulse" />
              <p className="text-sidebar-foreground/70 text-sm">
                Ask me about quantum circuits, algorithms, or quantum computing concepts!
              </p>
              <div className="mt-4 text-xs text-sidebar-foreground/50 space-y-1">
                <p>• "Create a Bell state circuit"</p>
                <p>• "Explain Grover's algorithm"</p>
                <p>• "How to create superposition?"</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-quantum-glow/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-quantum-glow" />
                    </div>
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-sidebar-accent border border-sidebar-border'
                  }`}
                >
                  {message.isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-quantum-glow border-t-transparent"></div>
                      <span className="text-sm">{message.content}</span>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert text-sidebar-foreground">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                  
                  {!message.isProcessing && message.type === 'assistant' && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-sidebar-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInsertToCanvas(message.content)}
                        className="text-xs"
                      >
                        <CircuitBoard className="h-3 w-3 mr-1" />
                        Insert to Canvas
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyMessage(message.content)}
                        className="text-xs"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {message.type === 'user' && (
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-background">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about quantum circuits..."
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="quantum-glow"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {!user && (
          <p className="text-xs text-sidebar-foreground/50 mt-2">
            Sign in for enhanced AI features and circuit saving
          </p>
        )}
      </div>
    </div>
  );
}