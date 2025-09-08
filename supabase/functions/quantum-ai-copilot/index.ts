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
}

interface AIRequest {
  type: 'natural_language' | 'optimization' | 'explanation' | 'research' | 'debug';
  input: string;
  circuit?: QuantumGate[];
  numQubits?: number;
  framework?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, input, circuit, numQubits, framework }: AIRequest = await req.json();

    console.log('🧠 AI Co-Pilot Request:', { type, input, circuitLength: circuit?.length || 0 });

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'natural_language':
        systemPrompt = `You are a quantum computing expert AI assistant. Convert natural language descriptions into quantum circuits. 
        
        Available gates: H (Hadamard), X (Pauli-X), Y (Pauli-Y), Z (Pauli-Z), CNOT, RX (rotation-X), RY (rotation-Y).
        
        For common circuits:
        - Bell state: H on qubit 0, CNOT(0,1)
        - GHZ state: H on qubit 0, CNOT(0,1), CNOT(1,2)
        - Superposition: H on all qubits
        
        Respond with JSON: { "gates": [...], "explanation": "..." }`;
        userPrompt = `Create a quantum circuit for: "${input}". Use ${numQubits || 3} qubits.`;
        break;

      case 'optimization':
        systemPrompt = `You are a quantum circuit optimization expert. Analyze circuits for redundancies, gate cancellations, and depth reduction opportunities.
        
        Common optimizations:
        - Remove adjacent inverse gates (X-X, H-H cancellations)
        - Commute gates to reduce depth
        - Use efficient gate decompositions
        
        Respond with JSON: { "optimizations": [...], "summary": "...", "gateSavings": number, "depthSavings": number }`;
        userPrompt = `Optimize this quantum circuit: ${JSON.stringify(circuit)}`;
        break;

      case 'explanation':
        systemPrompt = `You are a quantum computing educator. Explain quantum circuits in simple, educational terms.
        
        For each gate, explain:
        - What it does physically
        - Its mathematical effect
        - Why it's useful
        
        Make explanations accessible to beginners while being technically accurate.`;
        userPrompt = `Explain this quantum circuit: ${JSON.stringify(circuit)}. Focus on the quantum effects and practical applications.`;
        break;

      case 'research':
        systemPrompt = `You are a quantum computing research assistant. Find relevant academic papers and research topics.
        
        Focus on:
        - Recent developments (2020+)
        - Practical implementations
        - Algorithmic improvements
        - Hardware advances
        
        Provide paper titles, authors, and brief summaries.`;
        userPrompt = `Find research papers related to: "${input}"`;
        break;

      case 'debug':
        systemPrompt = `You are a quantum circuit debugging expert. Identify potential issues in quantum circuits.
        
        Look for:
        - Unused qubits
        - Measurement inconsistencies
        - Excessive circuit depth
        - Redundant operations
        - Potential decoherence issues
        
        Suggest specific fixes.`;
        userPrompt = `Debug this quantum circuit for errors and inefficiencies: ${JSON.stringify(circuit)}`;
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
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('🧠 AI Response:', aiResponse.substring(0, 200) + '...');

    // Try to parse JSON responses, fallback to plain text
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch {
      parsedResponse = { text: aiResponse };
    }

    // Add metadata based on request type
    const result = {
      ...parsedResponse,
      type,
      timestamp: new Date().toISOString(),
      model: 'gpt-4o-mini'
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