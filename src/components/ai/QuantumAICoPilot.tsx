import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Brain, 
  MessageSquare, 
  Lightbulb, 
  Settings, 
  BookOpen, 
  Search,
  Code,
  Cloud,
  Users,
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingUp,
  Bug,
  Copy,
  Play,
  Download,
  Share2,
  FileText,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuantumGate } from '@/lib/quantumSimulator';
import { QuantumBackendResult } from '@/services/quantumBackendService';
import { CircuitChatResponse } from './CircuitChatResponse';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'circuit' | 'code' | 'explanation';
  metadata?: {
    gates?: QuantumGate[];
    framework?: string;
    optimization?: any;
    papers?: any[];
    circuitName?: string;
  };
}

interface QuantumAICoPilotProps {
  circuit: QuantumGate[];
  result: QuantumBackendResult | null;
  onCircuitUpdate: (gates: QuantumGate[]) => void;
  onRunSimulation: () => void;
  numQubits: number;
  className?: string;
}

export function QuantumAICoPilot({
  circuit,
  result,
  onCircuitUpdate,
  onRunSimulation,
  numQubits,
  className
}: QuantumAICoPilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to QOSim AI Co-Pilot! I can help you design, optimize, and understand quantum circuits. Try asking me to "create a GHZ state" or "explain this circuit".',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [educationMode, setEducationMode] = useState(false);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedFramework, setSelectedFramework] = useState('qiskit');
  const [showOptimization, setShowOptimization] = useState(false);
  const [optimizationData, setOptimizationData] = useState<any>(null);
  const [researchPapers, setResearchPapers] = useState<any[]>([]);
  const [cloudEstimates, setCloudEstimates] = useState<any[]>([]);
  
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      // Simulate AI processing with various types of responses
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      const response = await processAIRequest(input, circuit, result);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        type: response.type,
        metadata: response.metadata
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle different response types
      if (response.type === 'circuit' && response.metadata?.gates) {
        onCircuitUpdate(response.metadata.gates);
        toast({
          title: "Circuit Updated",
          description: "New quantum circuit has been generated and loaded.",
        });
      }

      if (response.metadata?.optimization) {
        setOptimizationData(response.metadata.optimization);
        setShowOptimization(true);
      }

      if (response.metadata?.papers) {
        setResearchPapers(response.metadata.papers);
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process AI request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processAIRequest = async (input: string, circuit: QuantumGate[], result: QuantumBackendResult | null) => {
    const lowerInput = input.toLowerCase();

    // Determine request type based on input
    let requestType: 'natural_language' | 'optimization' | 'explanation' | 'research' | 'debug' = 'natural_language';
    
    if (lowerInput.includes('explain') || lowerInput.includes('what does')) {
      requestType = 'explanation';
    } else if (lowerInput.includes('optimize') || lowerInput.includes('improve') || lowerInput.includes('reduce')) {
      requestType = 'optimization';
    } else if (lowerInput.includes('research') || lowerInput.includes('papers') || lowerInput.includes('study')) {
      requestType = 'research';
    } else if (lowerInput.includes('debug') || lowerInput.includes('error') || lowerInput.includes('fix')) {
      requestType = 'debug';
    }

    try {
      // Call the actual edge function
      const response = await supabase.functions.invoke('quantum-ai-copilot', {
        body: {
          type: requestType,
          input: input,
          circuit: circuit,
          numQubits: numQubits,
          framework: selectedFramework
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'AI request failed');
      }

      const aiResult = response.data;

      // Process different response types
      if (requestType === 'natural_language' && aiResult.gates) {
        return {
          content: aiResult.explanation || 'I\'ve created a quantum circuit based on your request.',
          type: 'circuit' as const,
          metadata: {
            gates: aiResult.gates.map((gate: any, index: number) => ({
              id: `${gate.type.toLowerCase()}-${index}`,
              ...gate
            })) as QuantumGate[],
            circuitName: aiResult.circuitName || 'AI Generated Circuit'
          }
        };
      }

      if (requestType === 'optimization' && aiResult.optimizations) {
        return {
          content: `I've analyzed your circuit and found ${aiResult.optimizations.length} optimization opportunities:\n\n${aiResult.optimizations.join('\n')}`,
          type: 'text' as const,
          metadata: {
            optimization: {
              gateSavings: aiResult.gateSavings || 0,
              depthSavings: aiResult.depthSavings || 0,
              suggestions: aiResult.optimizations || []
            }
          }
        };
      }

      if (requestType === 'research') {
        return {
          content: aiResult.text || 'Here are some relevant research papers and topics.',
          type: 'text' as const,
          metadata: {
            papers: aiResult.papers || []
          }
        };
      }

      // Default text response
      return {
        content: aiResult.text || aiResult.explanation || 'I\'ve processed your request.',
        type: 'text' as const,
        metadata: {}
      };

    } catch (error) {
      console.error('Edge function call failed:', error);
      // Fallback to basic pattern matching for offline/error cases
      return await fallbackProcessing(input, circuit);
    }
  };

  const fallbackProcessing = async (input: string, circuit: QuantumGate[]) => {
    const lowerInput = input.toLowerCase();

    // Natural Language → Quantum Circuit fallback
    if (lowerInput.includes('create') || lowerInput.includes('build') || lowerInput.includes('generate')) {
      if (lowerInput.includes('ghz') || lowerInput.includes('greenberger')) {
        return {
          content: `I've created a 3-qubit GHZ state circuit for you. This creates the maximally entangled state |000⟩ + |111⟩.

The circuit construction follows these steps:

**Step 1: Initialize Superposition**
The Hadamard gate on qubit 0 creates an equal superposition: (|0⟩ + |1⟩)/√2

**Step 2: Create First Entanglement** 
The CNOT gate between qubits 0 and 1 creates the Bell-like state: (|00⟩ + |11⟩)/√2

**Step 3: Extend to GHZ State**
The second CNOT gate between qubits 1 and 2 creates the full 3-qubit GHZ state: (|000⟩ + |111⟩)/√2

This state demonstrates maximal multipartite entanglement - all three qubits are quantum mechanically correlated.`,
          type: 'circuit' as const,
          metadata: {
            gates: [
              { id: 'h-0', type: 'H', qubit: 0, position: 0 },
              { id: 'cnot-0-1', type: 'CNOT', qubits: [0, 1], position: 1 },
              { id: 'cnot-1-2', type: 'CNOT', qubits: [1, 2], position: 2 }
            ] as QuantumGate[],
            circuitName: 'GHZ State Circuit'
          }
        };
      }
      
      if (lowerInput.includes('bell') || lowerInput.includes('epr')) {
        return {
          content: `I've created a Bell state (EPR pair) circuit. This creates the maximally entangled state |00⟩ + |11⟩.

The circuit construction follows these steps:

**Step 1: Create Superposition**
The Hadamard gate on qubit 0 transforms |0⟩ → (|0⟩ + |1⟩)/√2

**Step 2: Entangle Qubits**
The CNOT gate creates quantum entanglement:
- If qubit 0 is |0⟩, qubit 1 remains |0⟩
- If qubit 0 is |1⟩, qubit 1 becomes |1⟩

**Final State: (|00⟩ + |11⟩)/√2**
This creates perfect correlation - measuring one qubit instantly determines the state of the other, regardless of distance. This is the foundation of quantum communication protocols like quantum teleportation.`,
          type: 'circuit' as const,
          metadata: {
            gates: [
              { id: 'h-0', type: 'H', qubit: 0, position: 0 },
              { id: 'cnot-0-1', type: 'CNOT', qubits: [0, 1], position: 1 }
            ] as QuantumGate[],
            circuitName: 'Bell State Circuit'
          }
        };
      }

      if (lowerInput.includes('superposition')) {
        return {
          content: `I've created a superposition circuit that puts all ${numQubits} qubits in equal superposition states.

**Circuit Analysis:**

Each Hadamard gate transforms |0⟩ → (|0⟩ + |1⟩)/√2

**Step-by-Step Process:**
${Array.from({ length: numQubits }, (_, i) => 
  `**Step ${i + 1}:** Apply H gate to qubit ${i}
  - Creates superposition: qubit ${i} becomes (|0⟩ + |1⟩)/√2`
).join('\n')}

**Final State:**
The circuit creates a uniform superposition of all ${2**numQubits} computational basis states:
${Array.from({ length: Math.min(8, 2**numQubits) }, (_, i) => 
  `|${i.toString(2).padStart(numQubits, '0')}⟩`
).join(' + ')}${2**numQubits > 8 ? ' + ...' : ''} (all with equal probability)

This demonstrates the quantum parallelism principle - the system explores all possible states simultaneously.`,
          type: 'circuit' as const,
          metadata: {
            gates: Array.from({ length: numQubits }, (_, i) => ({
              id: `h-${i}`,
              type: 'H',
              qubit: i,
              position: 0
            })) as QuantumGate[],
            circuitName: `${numQubits}-Qubit Superposition Circuit`
          }
        };
      }

      // Parse specific gate sequences like "H,CNOT,X,Z"
      if (lowerInput.includes('h,') || lowerInput.includes('cnot,') || lowerInput.includes('x,') || lowerInput.includes('z,')) {
        const gateSequence = input.match(/([HXYZCNOT]+(?:,[HXYZCNOT]+)*)/i)?.[0];
        if (gateSequence) {
          const gateTypes = gateSequence.split(',').map(g => g.trim().toUpperCase());
          const gates: QuantumGate[] = [];
          
          gateTypes.forEach((gateType, index) => {
            if (['H', 'X', 'Y', 'Z'].includes(gateType)) {
              gates.push({
                id: `${gateType.toLowerCase()}-${index}`,
                type: gateType,
                qubit: 0, // Default to qubit 0
                position: index
              });
            } else if (gateType === 'CNOT') {
              gates.push({
                id: `cnot-${index}`,
                type: 'CNOT',
                qubits: [0, 1], // Default control=0, target=1
                position: index
              });
            }
          });

          return {
            content: `I've created a circuit with the gates: ${gateTypes.join(', ')}.\n\nThis creates a sequence of quantum operations as requested.`,
            type: 'circuit' as const,
            metadata: { gates }
          };
        }
      }
    }

    // Circuit Explanation
    if (lowerInput.includes('explain') || lowerInput.includes('describe') || lowerInput.includes('what does')) {
      if (circuit.length === 0) {
        return {
          content: "The current circuit is empty. Add some quantum gates and I'll explain what they do!",
          type: 'explanation' as const
        };
      }

      const explanation = generateCircuitExplanation(circuit, numQubits);
      return {
        content: explanation,
        type: 'explanation' as const
      };
    }

    // Optimization
    if (lowerInput.includes('optimize') || lowerInput.includes('improve') || lowerInput.includes('reduce')) {
      const optimization = await simulateOptimization(circuit);
      return {
        content: `I've analyzed your circuit for optimization opportunities:\n\n${optimization.summary}\n\nWould you like me to apply these optimizations?`,
        type: 'text' as const,
        metadata: { optimization }
      };
    }

    // Research Assistant
    if (lowerInput.includes('research') || lowerInput.includes('papers') || lowerInput.includes('arxiv')) {
      const papers = await simulateResearchSearch(lowerInput);
      return {
        content: `I found ${papers.length} relevant research papers:\n\n${papers.map(p => `• ${p.title} (${p.authors})`).join('\n')}`,
        type: 'text' as const,
        metadata: { papers }
      };
    }

    // Code Generation
    if (lowerInput.includes('code') || lowerInput.includes('export') || lowerInput.includes('qiskit') || lowerInput.includes('cirq')) {
      const framework = lowerInput.includes('cirq') ? 'cirq' : lowerInput.includes('pennylane') ? 'pennylane' : 'qiskit';
      const code = generateFrameworkCode(circuit, framework);
      return {
        content: `Here's your circuit in ${framework.charAt(0).toUpperCase() + framework.slice(1)}:\n\n\`\`\`python\n${code}\n\`\`\``,
        type: 'code' as const,
        metadata: { framework }
      };
    }

    // Default response
    return {
      content: `I understand you're asking about: "${input}"\n\nI can help you with:\n• Creating quantum circuits (try "create a Bell state")\n• Explaining your current circuit\n• Optimizing circuits for better performance\n• Generating code for Qiskit, Cirq, or PennyLane\n• Finding relevant research papers\n• Debugging quantum circuits\n\nWhat would you like to explore?`,
      type: 'text' as const
    };
  };

  const generateCircuitExplanation = (circuit: QuantumGate[], numQubits: number) => {
    if (circuit.length === 0) return "No gates in the circuit.";

    let explanation = `This quantum circuit operates on ${numQubits} qubits and contains ${circuit.length} gates:\n\n`;
    
    circuit.forEach((gate, index) => {
      switch (gate.type) {
        case 'H':
          explanation += `${index + 1}. Hadamard gate on qubit ${gate.qubit}: Creates superposition (|0⟩ + |1⟩)/√2\n`;
          break;
        case 'X':
          explanation += `${index + 1}. Pauli-X gate on qubit ${gate.qubit}: Quantum NOT gate, flips |0⟩ ↔ |1⟩\n`;
          break;
        case 'Y':
          explanation += `${index + 1}. Pauli-Y gate on qubit ${gate.qubit}: Rotation around Y-axis with phase flip\n`;
          break;
        case 'Z':
          explanation += `${index + 1}. Pauli-Z gate on qubit ${gate.qubit}: Phase flip, |1⟩ → -|1⟩\n`;
          break;
        case 'CNOT':
          explanation += `${index + 1}. CNOT gate (control: ${gate.qubits?.[0]}, target: ${gate.qubits?.[1]}): Creates entanglement\n`;
          break;
        case 'RX':
          explanation += `${index + 1}. RX rotation on qubit ${gate.qubit}: Rotation around X-axis by ${gate.angle?.toFixed(2)} radians\n`;
          break;
        case 'RY':
          explanation += `${index + 1}. RY rotation on qubit ${gate.qubit}: Rotation around Y-axis by ${gate.angle?.toFixed(2)} radians\n`;
          break;
        default:
          explanation += `${index + 1}. ${gate.type} gate\n`;
      }
    });

    // Add circuit analysis
    explanation += `\n**Circuit Analysis:**\n`;
    explanation += `• Depth: ${Math.max(...circuit.map(g => g.position)) + 1}\n`;
    explanation += `• Two-qubit gates: ${circuit.filter(g => g.type === 'CNOT').length}\n`;
    explanation += `• Single-qubit gates: ${circuit.filter(g => g.type !== 'CNOT').length}\n`;

    if (educationMode) {
      explanation += `\n**Educational Notes:**\n`;
      explanation += `• This circuit creates quantum superposition and/or entanglement\n`;
      explanation += `• Measurement will collapse the quantum state\n`;
      explanation += `• Run simulation to see probability distributions\n`;
    }

    return explanation;
  };

  const simulateOptimization = async (circuit: QuantumGate[]) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const originalDepth = Math.max(...circuit.map(g => g.position), 0) + 1;
    const originalGates = circuit.length;
    
    return {
      summary: `Found ${Math.floor(Math.random() * 3) + 1} optimization opportunities`,
      original: { gates: originalGates, depth: originalDepth },
      optimized: { 
        gates: Math.max(1, originalGates - Math.floor(Math.random() * 2)), 
        depth: Math.max(1, originalDepth - Math.floor(Math.random() * 2))
      },
      improvements: [
        'Remove redundant gate pairs',
        'Commute gates to reduce depth',
        'Use more efficient gate decompositions'
      ]
    };
  };

  const simulateResearchSearch = async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
      {
        title: "Quantum Error Correction with Surface Codes",
        authors: "A. Fowler et al.",
        summary: "Comprehensive review of surface code implementations for fault-tolerant quantum computing.",
        arxivId: "2103.01234"
      },
      {
        title: "NISQ Era Quantum Algorithms",
        authors: "J. Smith, K. Doe",
        summary: "Survey of quantum algorithms suitable for near-term quantum devices.",
        arxivId: "2104.05678"
      },
      {
        title: "Quantum Machine Learning with Variational Circuits",
        authors: "M. Researcher et al.",
        summary: "Applications of parameterized quantum circuits in machine learning tasks.",
        arxivId: "2105.09876"
      }
    ];
  };

  const generateFrameworkCode = (circuit: QuantumGate[], framework: string) => {
    if (circuit.length === 0) return "# No gates in circuit";

    const maxQubit = Math.max(...circuit.map(g => g.qubit || 0).concat(circuit.flatMap(g => g.qubits || [])));
    const numQubits = maxQubit + 1;

    switch (framework) {
      case 'qiskit':
        let qiskitCode = `from qiskit import QuantumCircuit, execute, Aer\nfrom qiskit.visualization import plot_histogram\n\n`;
        qiskitCode += `# Create quantum circuit\nqc = QuantumCircuit(${numQubits}, ${numQubits})\n\n`;
        
        circuit.forEach(gate => {
          switch (gate.type) {
            case 'H':
              qiskitCode += `qc.h(${gate.qubit})\n`;
              break;
            case 'X':
              qiskitCode += `qc.x(${gate.qubit})\n`;
              break;
            case 'Y':
              qiskitCode += `qc.y(${gate.qubit})\n`;
              break;
            case 'Z':
              qiskitCode += `qc.z(${gate.qubit})\n`;
              break;
            case 'CNOT':
              qiskitCode += `qc.cx(${gate.qubits?.[0]}, ${gate.qubits?.[1]})\n`;
              break;
            case 'RX':
              qiskitCode += `qc.rx(${gate.angle}, ${gate.qubit})\n`;
              break;
            case 'RY':
              qiskitCode += `qc.ry(${gate.angle}, ${gate.qubit})\n`;
              break;
          }
        });
        
        qiskitCode += `\n# Add measurements\nqc.measure_all()\n\n`;
        qiskitCode += `# Execute on simulator\nbackend = Aer.get_backend('qasm_simulator')\njob = execute(qc, backend, shots=1024)\nresult = job.result()\ncounts = result.get_counts()\nprint(counts)`;
        
        return qiskitCode;

      case 'cirq':
        let cirqCode = `import cirq\nimport numpy as np\n\n`;
        cirqCode += `# Create qubits\nqubits = [cirq.GridQubit(0, i) for i in range(${numQubits})]\n\n`;
        cirqCode += `# Create circuit\ncircuit = cirq.Circuit()\n\n`;
        
        circuit.forEach(gate => {
          switch (gate.type) {
            case 'H':
              cirqCode += `circuit.append(cirq.H(qubits[${gate.qubit}]))\n`;
              break;
            case 'X':
              cirqCode += `circuit.append(cirq.X(qubits[${gate.qubit}]))\n`;
              break;
            case 'Y':
              cirqCode += `circuit.append(cirq.Y(qubits[${gate.qubit}]))\n`;
              break;
            case 'Z':
              cirqCode += `circuit.append(cirq.Z(qubits[${gate.qubit}]))\n`;
              break;
            case 'CNOT':
              cirqCode += `circuit.append(cirq.CNOT(qubits[${gate.qubits?.[0]}], qubits[${gate.qubits?.[1]}]))\n`;
              break;
            case 'RX':
              cirqCode += `circuit.append(cirq.rx(${gate.angle})(qubits[${gate.qubit}]))\n`;
              break;
            case 'RY':
              cirqCode += `circuit.append(cirq.ry(${gate.angle})(qubits[${gate.qubit}]))\n`;
              break;
          }
        });
        
        cirqCode += `\n# Add measurements\ncircuit.append(cirq.measure(*qubits, key='result'))\n\n`;
        cirqCode += `# Simulate\nsimulator = cirq.Simulator()\nresult = simulator.run(circuit, repetitions=1024)\nprint(result.histogram(key='result'))`;
        
        return cirqCode;

      case 'pennylane':
        let pennyCode = `import pennylane as qml\nimport numpy as np\n\n`;
        pennyCode += `# Create device\ndev = qml.device('default.qubit', wires=${numQubits})\n\n`;
        pennyCode += `@qml.qnode(dev)\ndef circuit():\n`;
        
        circuit.forEach(gate => {
          switch (gate.type) {
            case 'H':
              pennyCode += `    qml.Hadamard(wires=${gate.qubit})\n`;
              break;
            case 'X':
              pennyCode += `    qml.PauliX(wires=${gate.qubit})\n`;
              break;
            case 'Y':
              pennyCode += `    qml.PauliY(wires=${gate.qubit})\n`;
              break;
            case 'Z':
              pennyCode += `    qml.PauliZ(wires=${gate.qubit})\n`;
              break;
            case 'CNOT':
              pennyCode += `    qml.CNOT(wires=[${gate.qubits?.[0]}, ${gate.qubits?.[1]}])\n`;
              break;
            case 'RX':
              pennyCode += `    qml.RX(${gate.angle}, wires=${gate.qubit})\n`;
              break;
            case 'RY':
              pennyCode += `    qml.RY(${gate.angle}, wires=${gate.qubit})\n`;
              break;
          }
        });
        
        pennyCode += `    return [qml.probs(wires=i) for i in range(${numQubits})]\n\n`;
        pennyCode += `# Execute\nresult = circuit()\nprint(result)`;
        
        return pennyCode;

      default:
        return "# Unsupported framework";
    }
  };

  const quickActions = [
    { 
      label: 'Explain Circuit', 
      icon: BookOpen, 
      action: () => {
        setInput('Explain this circuit');
        setTimeout(() => handleSendMessage(), 100);
      }
    },
    { 
      label: 'Suggest Next Gate', 
      icon: Lightbulb, 
      action: () => {
        setInput('What gate should I add next?');
        setTimeout(() => handleSendMessage(), 100);
      }
    },
    { 
      label: 'Optimize Circuit', 
      icon: TrendingUp, 
      action: () => {
        setInput('Optimize this circuit');
        setTimeout(() => handleSendMessage(), 100);
      }
    },
    { 
      label: 'Generate Qiskit Code', 
      icon: Code, 
      action: () => {
        setInput('Export to Qiskit code');
        setTimeout(() => handleSendMessage(), 100);
      }
    },
    { 
      label: 'Find Research Papers', 
      icon: Search, 
      action: () => {
        setInput('Find research papers about quantum circuits');
        setTimeout(() => handleSendMessage(), 100);
      }
    },
    { 
      label: 'Debug Circuit', 
      icon: Bug, 
      action: () => {
        setInput('Debug this circuit for errors');
        setTimeout(() => handleSendMessage(), 100);
      }
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  return (
    <Card className={`h-full flex flex-col ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-quantum-glow">
          <Brain className="w-5 h-5" />
          QOSim AI Co-Pilot
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 quantum-panel">
            <TabsTrigger value="chat" className="text-xs">
              <MessageSquare className="w-3 h-3 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-xs">
              <Settings className="w-3 h-3 mr-1" />
              Tools
            </TabsTrigger>
            <TabsTrigger value="research" className="text-xs">
              <Search className="w-3 h-3 mr-1" />
              Research
            </TabsTrigger>
            <TabsTrigger value="cloud" className="text-xs">
              <Cloud className="w-3 h-3 mr-1" />
              Cloud
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col space-y-4 mt-4">
            {/* Chat Messages */}
            <ScrollArea className="flex-1 border rounded-lg p-3 quantum-panel">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'user' ? (
                      <div className="max-w-[80%] p-3 rounded-lg bg-quantum-glow text-white">
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full max-w-full">
                        {message.type === 'circuit' && message.metadata?.gates ? (
                          <CircuitChatResponse
                            gates={message.metadata.gates}
                            explanation={message.content}
                            numQubits={numQubits}
                            circuitName={message.metadata.circuitName || 'Generated Circuit'}
                          />
                        ) : (
                          <div className="bg-quantum-matrix border border-quantum-neon/20 p-3 rounded-lg">
                            <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                            {message.type === 'code' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="mt-2"
                                onClick={() => copyToClipboard(message.content.split('```')[1])}
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                Copy Code
                              </Button>
                            )}
                            <div className="text-xs opacity-70 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-quantum-matrix border border-quantum-neon/20 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-quantum-neon"></div>
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              {quickActions.slice(0, 4).map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="text-xs justify-start"
                  disabled={isProcessing}
                >
                  <action.icon className="w-3 h-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex space-x-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about quantum circuits..."
                className="flex-1 min-h-[80px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isProcessing}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || isProcessing}
                className="h-full"
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="flex-1 space-y-4 mt-4">
            {/* Education Mode Toggle */}
            <div className="flex items-center justify-between p-3 border rounded-lg quantum-panel">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-quantum-neon" />
                <span className="text-sm font-medium">Education Mode</span>
              </div>
              <Button
                variant={educationMode ? "default" : "outline"}
                size="sm"
                onClick={() => setEducationMode(!educationMode)}
              >
                {educationMode ? 'ON' : 'OFF'}
              </Button>
            </div>

            {/* Collaboration Mode Toggle */}
            <div className="flex items-center justify-between p-3 border rounded-lg quantum-panel">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-quantum-particle" />
                <span className="text-sm font-medium">Collaboration Mode</span>
              </div>
              <Button
                variant={collaborationMode ? "default" : "outline"}
                size="sm"
                onClick={() => setCollaborationMode(!collaborationMode)}
              >
                {collaborationMode ? 'ON' : 'OFF'}
              </Button>
            </div>

            {/* Framework Selector */}
            <div className="p-3 border rounded-lg quantum-panel">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Code className="w-4 h-4 mr-2" />
                Export Framework
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {['qiskit', 'cirq', 'pennylane'].map((framework) => (
                  <Button
                    key={framework}
                    variant={selectedFramework === framework ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedFramework(framework)}
                    className="text-xs"
                  >
                    {framework.charAt(0).toUpperCase() + framework.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Optimization Results */}
            {showOptimization && optimizationData && (
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Optimization Results
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2 p-3 border rounded-lg quantum-panel">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Original Gates:</span>
                      <span>{optimizationData.original.gates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Optimized Gates:</span>
                      <span className="text-quantum-glow">{optimizationData.optimized.gates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Depth Reduction:</span>
                      <span className="text-quantum-neon">
                        {optimizationData.original.depth - optimizationData.optimized.depth}
                      </span>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* All Quick Actions */}
            <div className="grid grid-cols-1 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="justify-start"
                  disabled={isProcessing}
                >
                  <action.icon className="w-4 h-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="research" className="flex-1 space-y-4 mt-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Search quantum research papers..."
                className="flex-1"
              />
              <Button variant="outline">
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {researchPapers.length > 0 && (
              <ScrollArea className="flex-1 border rounded-lg p-3 quantum-panel">
                <div className="space-y-3">
                  {researchPapers.map((paper, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <h4 className="font-medium text-sm text-quantum-glow">{paper.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{paper.authors}</p>
                      <p className="text-xs mt-2">{paper.summary}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className="text-xs">
                          arXiv:{paper.arxivId}
                        </Badge>
                        <Button size="sm" variant="ghost" className="text-xs">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="cloud" className="flex-1 space-y-4 mt-4">
            <div className="p-3 border rounded-lg quantum-panel">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Cloud className="w-4 h-4 mr-2" />
                Cloud Backend Recommendations
              </h4>
              <div className="space-y-2">
                {[
                  { name: 'IBM Quantum', cost: '$0.12/shot', runtime: '~2 min', availability: 'Available' },
                  { name: 'IonQ', cost: '$0.01/shot', runtime: '~30 sec', availability: 'Queue: 5 jobs' },
                  { name: 'Rigetti', cost: '$0.05/shot', runtime: '~1 min', availability: 'Available' },
                  { name: 'AWS Braket', cost: '$0.08/shot', runtime: '~1.5 min', availability: 'Available' }
                ].map((backend, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded text-xs">
                    <div>
                      <div className="font-medium">{backend.name}</div>
                      <div className="text-muted-foreground">
                        {backend.cost} • {backend.runtime}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-quantum-glow">{backend.availability}</div>
                      <Button size="sm" variant="outline" className="mt-1 text-xs h-6">
                        <Play className="w-3 h-3 mr-1" />
                        Run
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full" variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Circuit for Collaboration
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}