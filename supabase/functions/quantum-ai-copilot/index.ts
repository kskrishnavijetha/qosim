import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QuantumGate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  params?: any;
}

interface AIRequest {
  type: 'natural_language' | 'optimization' | 'explanation' | 'research' | 'debug' | 'code_complete' | 'translate' | 'insights' | 'learn';
  input: string;
  circuit?: QuantumGate[];
  numQubits?: number;
  framework?: 'qiskit' | 'cirq' | 'pennylane' | 'qosim';
  context?: string;
  simulationResult?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, input, circuit, numQubits, framework, context, simulationResult }: AIRequest = await req.json();

    console.log('🧠 AI Co-Pilot Request:', { type, input, circuitLength: circuit?.length || 0, framework });

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'natural_language':
        systemPrompt = `You are a quantum computing expert AI assistant. Convert natural language descriptions into quantum circuits for multiple frameworks.
        
        Available gates: H (Hadamard), X (Pauli-X), Y (Pauli-Y), Z (Pauli-Z), CNOT, RX, RY, RZ, CZ, SWAP, Toffoli, S, T, Phase.
        
        For common circuits:
        - Bell state: H on qubit 0, CNOT(0,1)
        - GHZ state: H on qubit 0, CNOT(0,1), CNOT(1,2)
        - Superposition: H on all qubits
        - Deutsch-Jozsa: H on all qubits, Oracle, H on first n-1 qubits
        - Grover: Initialize, Oracle, Diffusion operator
        
        Respond with JSON: { 
          "gates": [...], 
          "explanation": "...", 
          "qiskit_code": "...", 
          "cirq_code": "...", 
          "pennylane_code": "...",
          "qosim_code": "..."
        }`;
        userPrompt = `Create a quantum circuit for: "${input}". Use ${numQubits || 3} qubits. Target framework: ${framework || 'qosim'}.`;
        break;

      case 'optimization':
        systemPrompt = `You are a quantum circuit optimization expert. Analyze circuits for:
        - Gate count reduction
        - Depth minimization  
        - Error mitigation strategies
        - Transpilation optimization
        - Hardware-specific optimizations
        
        Respond with JSON: { 
          "optimized_gates": [...], 
          "optimizations": [...], 
          "gate_reduction": number, 
          "depth_reduction": number,
          "error_mitigation": [...],
          "explanation": "..."
        }`;
        userPrompt = `Optimize this quantum circuit: ${JSON.stringify(circuit)}. Target: ${framework || 'general'} with ${numQubits} qubits.`;
        break;

      case 'explanation':
        systemPrompt = `You are a quantum computing educator. Explain quantum circuits clearly:
        - Physical intuition behind gates
        - Mathematical transformations
        - Quantum effects (superposition, entanglement, interference)
        - Practical applications
        - Step-by-step execution
        
        Make explanations accessible yet technically accurate.`;
        userPrompt = `Explain this quantum circuit: ${JSON.stringify(circuit)}. Include quantum effects, mathematics, and applications.`;
        break;

      case 'research':
        systemPrompt = `You are a quantum computing research assistant. Focus on:
        - Recent papers (2020+)
        - Algorithmic advances
        - Hardware developments
        - Implementation techniques
        - Benchmarking results
        
        Provide paper titles, authors, key insights, and practical relevance.`;
        userPrompt = `Find research related to: "${input}". Include recent developments and practical implementations.`;
        break;

      case 'debug':
        systemPrompt = `You are a quantum circuit debugging expert. Identify:
        - Logical errors in gate sequences
        - Inefficient patterns
        - Decoherence issues
        - Measurement problems
        - State preparation errors
        
        Provide specific fixes and improvements.`;
        userPrompt = `Debug this quantum circuit: ${JSON.stringify(circuit)}. Context: ${context || 'general debugging'}`;
        break;

      case 'code_complete':
        systemPrompt = `You are a quantum programming assistant. Provide:
        - Code completions for ${framework || 'multiple frameworks'}
        - Syntax corrections
        - Best practices
        - Performance optimizations
        - Library-specific idioms`;
        userPrompt = `Complete this quantum code: "${input}". Framework: ${framework || 'qosim'}. Context: ${context || ''}`;
        break;

      case 'translate':
        systemPrompt = `You are a quantum framework translator. Convert between:
        - Qiskit ↔ Cirq ↔ PennyLane ↔ QOSim
        - Maintain semantic equivalence
        - Preserve gate parameters
        - Handle framework-specific features
        
        Respond with JSON containing all framework versions.`;
        userPrompt = `Translate this circuit from ${framework} to all other frameworks: ${JSON.stringify(circuit)}`;
        break;

      case 'insights':
        systemPrompt = `You are a quantum simulation analyst. Analyze results:
        - Statistical patterns
        - Quantum effects observed
        - Performance metrics
        - Suggested improvements
        - Next experiment ideas`;
        userPrompt = `Analyze these simulation results: ${JSON.stringify(simulationResult)}. Circuit: ${JSON.stringify(circuit)}. Provide insights and suggestions.`;
        break;

      case 'learn':
        systemPrompt = `You are a quantum computing tutor. Create:
        - Interactive tutorials
        - Step-by-step guidance
        - Quizzes and exercises
        - Conceptual explanations
        - Practical examples
        
        Adapt to user's level and provide engaging content.`;
        userPrompt = `Create a learning module for: "${input}". Context: ${context || 'beginner level'}`;
        break;

      default:
        throw new Error('Invalid request type');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_completion_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('🧠 AI Response length:', aiResponse.length);

    // Try to parse JSON responses, fallback to plain text
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      parsedResponse = { text: aiResponse };
    }

    // Add metadata
    const result = {
      ...parsedResponse,
      type,
      framework,
      timestamp: new Date().toISOString(),
      model: 'gpt-5-2025-08-07'
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in quantum-ai-copilot function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      type: 'error',
      timestamp: new Date().toISOString() 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});