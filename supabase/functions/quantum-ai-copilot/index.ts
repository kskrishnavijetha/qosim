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

// Rate limiting and retry logic
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const makeOpenAIRequest = async (requestBody: any, retries = 3): Promise<any> => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        return await response.json();
      }

      // Handle rate limiting (429) with exponential backoff
      if (response.status === 429) {
        const backoffTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000; // 1-2s, 2-4s, 4-8s
        console.log(`🔄 Rate limited, retrying in ${backoffTime}ms (attempt ${attempt + 1}/${retries})`);
        
        if (attempt < retries - 1) {
          await delay(backoffTime);
          continue;
        }
      }

      // For other errors, throw immediately
      throw new Error(`OpenAI API error: ${response.status}`);
      
    } catch (error) {
      if (attempt === retries - 1) {
        throw error;
      }
      console.log(`🔄 Request failed, retrying... (attempt ${attempt + 1}/${retries})`);
      await delay(1000 * (attempt + 1));
    }
  }
};

// Fallback responses for when API is unavailable
const getFallbackResponse = (type: string, input: string, circuit: any[]) => {
  switch (type) {
    case 'natural_language':
      if (input.toLowerCase().includes('bell')) {
        return {
          gates: [
            { type: 'H', qubit: 0, position: 0 },
            { type: 'CNOT', qubits: [0, 1], position: 1 }
          ],
          explanation: 'Created a Bell state circuit with Hadamard and CNOT gates (offline mode)'
        };
      }
      return {
        gates: [{ type: 'H', qubit: 0, position: 0 }],
        explanation: 'Created a basic superposition circuit (offline mode)'
      };
      
    case 'optimization':
      return {
        optimizations: ['Circuit analysis unavailable in offline mode'],
        summary: 'AI optimization temporarily unavailable',
        gateSavings: 0,
        depthSavings: 0
      };
      
    case 'explanation':
      return {
        text: `This circuit has ${circuit.length} gates. AI explanation temporarily unavailable - try again in a moment.`
      };
      
    case 'research':
      return {
        text: 'Research search temporarily unavailable. Please try again in a moment.'
      };
      
    case 'debug':
      return {
        text: 'Circuit debugging temporarily unavailable. Please try again in a moment.'
      };
      
    default:
      return {
        text: 'AI assistant temporarily unavailable. Please try again in a moment.'
      };
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, input, circuit, numQubits, framework }: AIRequest = await req.json();

    console.log('🧠 AI Co-Pilot Request:', { type, input, circuitLength: circuit?.length || 0 });

    // Check if OpenAI API key is available
    if (!openAIApiKey) {
      console.error('❌ OpenAI API key not configured');
      const fallback = getFallbackResponse(type, input, circuit || []);
      return new Response(JSON.stringify({
        ...fallback,
        type,
        timestamp: new Date().toISOString(),
        model: 'fallback',
        warning: 'AI features require OpenAI API key configuration'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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

    try {
      // Make the OpenAI request with retry logic
      const data = await makeOpenAIRequest({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.3,
      });

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

    } catch (apiError) {
      console.error('🚨 OpenAI API failed after retries:', apiError);
      
      // Return fallback response
      const fallback = getFallbackResponse(type, input, circuit || []);
      return new Response(JSON.stringify({
        ...fallback,
        type,
        timestamp: new Date().toISOString(),
        model: 'fallback',
        warning: 'AI temporarily unavailable, using fallback response'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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