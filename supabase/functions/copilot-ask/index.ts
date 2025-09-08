import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_query, framework = 'QOSim' } = await req.json();

    if (!user_query) {
      return new Response(
        JSON.stringify({ error: 'user_query is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Processing query:', user_query, 'Framework:', framework);

    // Create QOSim-specific prompt for quantum circuit generation
    const systemPrompt = `You are QOSim Co-Pilot, an AI quantum assistant.
Convert natural language queries into QOSim circuit code (Python).

If user says: "Create a Bell state", return:

\`\`\`python
from qosim import QuantumCircuit, Simulator
qc = QuantumCircuit(2)
qc.h(0); qc.cx(0, 1)
result = Simulator().run(qc)
print(result.probabilities())
\`\`\`

Always explain what the circuit does in simple terms.

Keep circuits short, optimized, and runnable in QOSim.

If unclear, ask clarifying questions.

Framework Guidelines:
- QOSim (default): Use QOSim syntax as shown above
- Qiskit: Use qiskit library syntax when specifically requested
- Cirq: Use cirq library syntax when specifically requested  
- PennyLane: Use pennylane library syntax when specifically requested

Return your response in this exact JSON format:
{
  "circuit_code": "# Python code using ${framework || 'QOSim'} syntax",
  "explanation": "## Simple explanation in Markdown format",
  "visual_hint": null
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt
          },
          { 
            role: 'user', 
            content: `Convert this natural language query into ${framework || 'QOSim'} quantum circuit code: "${user_query}"`
          }
        ],
        max_completion_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      return new Response(
        JSON.stringify({ error: 'Failed to process request with AI' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const aiResponse = await response.json();
    console.log('AI Response:', aiResponse);

    let result;
    try {
      result = JSON.parse(aiResponse.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response structure
      result = {
        circuit_code: `# ${framework || 'QOSim'} quantum circuit\n# Generated from: ${user_query}\n# Please check the explanation for details`,
        explanation: aiResponse.choices[0].message.content,
        visual_hint: null
      };
    }

    // Ensure required fields are present
    const finalResult = {
      circuit_code: result.circuit_code || `# ${framework || 'QOSim'} code for: ${user_query}`,
      explanation: result.explanation || 'Please try rephrasing your quantum computing question.',
      visual_hint: result.visual_hint || null
    };

    console.log('Returning result:', finalResult);

    return new Response(JSON.stringify(finalResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in copilot-ask function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});