import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { 
      status: 400,
      headers: corsHeaders 
    });
  }

  if (!openAIApiKey) {
    return new Response("OpenAI API key not configured", { 
      status: 500,
      headers: corsHeaders 
    });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  console.log("WebSocket connection established, connecting to OpenAI...");
  
  // Connect to OpenAI Realtime API
  const openAISocket = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01", [
    "realtime",
    `Bearer.${openAIApiKey}`,
    "realtime-beta.1"
  ]);

  // Track connection state
  let isOpenAIConnected = false;
  let sessionConfigured = false;

  openAISocket.onopen = () => {
    console.log("Connected to OpenAI Realtime API");
    isOpenAIConnected = true;
  };

  openAISocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("OpenAI message:", data.type);
      
      // Handle session creation - send configuration after receiving session.created
      if (data.type === 'session.created' && !sessionConfigured) {
        console.log("Session created, configuring...");
        
        const sessionConfig = {
          type: "session.update",
          session: {
            modalities: ["text", "audio"],
            instructions: `You are QOSim, an advanced quantum computing simulator AI assistant. You help users understand and build quantum circuits in real-time. 
            
            Your capabilities include:
            - Explaining quantum gates, circuits, and algorithms in simple terms
            - Generating quantum circuit diagrams and code
            - Providing step-by-step circuit explanations
            - Optimizing quantum circuits for better performance
            - Teaching quantum concepts through interactive examples
            
            Always be helpful, educational, and enthusiastic about quantum computing. When creating circuits, provide visual descriptions and educational explanations.`,
            voice: "alloy",
            input_audio_format: "pcm16",
            output_audio_format: "pcm16",
            input_audio_transcription: {
              model: "whisper-1"
            },
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            tools: [
              {
                type: "function",
                name: "create_quantum_circuit",
                description: "Create and visualize a quantum circuit based on user specifications",
                parameters: {
                  type: "object",
                  properties: {
                    circuit_name: { type: "string" },
                    gates: { 
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          type: { type: "string" },
                          qubit: { type: "number" },
                          qubits: { type: "array", items: { type: "number" } },
                          position: { type: "number" },
                          angle: { type: "number" }
                        }
                      }
                    },
                    num_qubits: { type: "number" }
                  },
                  required: ["circuit_name", "gates", "num_qubits"]
                }
              },
              {
                type: "function",
                name: "explain_quantum_concept",
                description: "Provide detailed explanation of quantum computing concepts",
                parameters: {
                  type: "object",
                  properties: {
                    concept: { type: "string" },
                    level: { type: "string", enum: ["beginner", "intermediate", "advanced"] }
                  },
                  required: ["concept"]
                }
              }
            ],
            tool_choice: "auto",
            temperature: 0.8,
            max_response_output_tokens: "inf"
          }
        };
        
        openAISocket.send(JSON.stringify(sessionConfig));
        sessionConfigured = true;
        console.log("Session configuration sent");
      }
      
      // Forward all messages to client
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(event.data);
      }
    } catch (error) {
      console.error("Error processing OpenAI message:", error);
    }
  };

  openAISocket.onerror = (error) => {
    console.error("OpenAI WebSocket error:", error);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'error',
        message: 'Connection to AI service failed'
      }));
    }
  };

  openAISocket.onclose = (event) => {
    console.log("OpenAI connection closed:", event.code, event.reason);
    isOpenAIConnected = false;
    if (socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  };

  // Handle client messages
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Client message:", data.type);
      
      // Forward client messages to OpenAI if connected
      if (isOpenAIConnected && openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.send(event.data);
      } else {
        console.warn("OpenAI not connected, message queued");
      }
    } catch (error) {
      console.error("Error processing client message:", error);
    }
  };

  socket.onopen = () => {
    console.log("Client WebSocket connected");
  };

  socket.onerror = (error) => {
    console.error("Client WebSocket error:", error);
  };

  socket.onclose = () => {
    console.log("Client disconnected");
    if (openAISocket.readyState === WebSocket.OPEN) {
      openAISocket.close();
    }
  };

  return response;
});