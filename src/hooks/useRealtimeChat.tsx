import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioRecorder, encodeAudioForAPI, playAudioData, clearAudioQueue } from '@/utils/RealtimeAudio';

export interface RealtimeMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  audioTranscript?: string;
}

export interface CircuitData {
  circuit_name: string;
  gates: any[];
  num_qubits: number;
}

export const useRealtimeChat = () => {
  const [messages, setMessages] = useState<RealtimeMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const currentTranscriptRef = useRef<string>('');
  const currentMessageIdRef = useRef<string>('');

  // Get the correct WebSocket URL - using the project's Supabase URL
  const getWebSocketUrl = () => {
    // Extract project ID from current domain
    const currentDomain = window.location.hostname;
    const projectId = currentDomain.split('.')[0];
    return `wss://${projectId}.functions.supabase.co/realtime-chat`;
  };

  const initializeAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      // Resume context if suspended (required for some browsers)
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    }
    return audioContextRef.current;
  }, []);

  const handleMessage = useCallback(async (event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received message:', data.type, data);

      switch (data.type) {
        case 'session.created':
          console.log('Session created successfully');
          setIsConnected(true);
          setConnectionStatus('connected');
          break;

        case 'session.updated':
          console.log('Session configuration updated');
          break;

        case 'input_audio_buffer.speech_started':
          console.log('User started speaking');
          setIsRecording(true);
          break;

        case 'input_audio_buffer.speech_stopped':
          console.log('User stopped speaking');
          setIsRecording(false);
          break;

        case 'response.audio.delta':
          // Play audio chunk
          if (data.delta) {
            const audioContext = await initializeAudioContext();
            const binaryString = atob(data.delta);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            await playAudioData(audioContext, bytes);
            setIsSpeaking(true);
          }
          break;

        case 'response.audio.done':
          console.log('Audio response completed');
          setIsSpeaking(false);
          break;

        case 'response.audio_transcript.delta':
          // Accumulate transcript
          if (data.delta) {
            currentTranscriptRef.current += data.delta;
          }
          break;

        case 'response.audio_transcript.done':
          // Complete transcript received
          if (currentTranscriptRef.current) {
            const messageId = `msg_${Date.now()}`;
            const newMessage: RealtimeMessage = {
              id: messageId,
              type: 'assistant',
              content: currentTranscriptRef.current,
              timestamp: new Date(),
            };
            
            setMessages(prev => [...prev, newMessage]);
            currentTranscriptRef.current = '';
          }
          break;

        case 'conversation.item.input_audio_transcription.completed':
          // User's speech transcription
          if (data.transcript) {
            const messageId = `msg_${Date.now()}`;
            const newMessage: RealtimeMessage = {
              id: messageId,
              type: 'user',
              content: data.transcript,
              timestamp: new Date(),
              audioTranscript: data.transcript,
            };
            
            setMessages(prev => [...prev, newMessage]);
          }
          break;

        case 'response.function_call_arguments.done':
          // Handle function calls (circuit creation, explanations)
          if (data.arguments) {
            try {
              const args = JSON.parse(data.arguments);
              console.log('Function call completed:', data.name, args);
              
              if (data.name === 'create_quantum_circuit') {
                // Handle circuit creation
                const circuitData: CircuitData = {
                  circuit_name: args.circuit_name,
                  gates: args.gates || [],
                  num_qubits: args.num_qubits || 2
                };
                
                // Add circuit visualization message
                const messageId = `circuit_${Date.now()}`;
                const newMessage: RealtimeMessage = {
                  id: messageId,
                  type: 'assistant',
                  content: `Created quantum circuit: ${circuitData.circuit_name}`,
                  timestamp: new Date(),
                };
                
                setMessages(prev => [...prev, newMessage]);
                
                // Trigger circuit visualization in the main app
                window.dispatchEvent(new CustomEvent('quantumCircuitGenerated', {
                  detail: circuitData
                }));
              }
            } catch (error) {
              console.error('Error parsing function arguments:', error);
            }
          }
          break;

        case 'response.created':
          console.log('Response started');
          break;

        case 'response.done':
          console.log('Response completed');
          setIsSpeaking(false);
          break;

        case 'error':
          console.error('Realtime API error:', data);
          setConnectionStatus('disconnected');
          break;

        default:
          console.log('Unhandled message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }, [initializeAudioContext]);

  const connectToRealtime = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('Already connected');
      return;
    }

    try {
      setConnectionStatus('connecting');
      
      const wsUrl = getWebSocketUrl();
      console.log('Connecting to:', wsUrl);
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
      };

      wsRef.current.onmessage = handleMessage;

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
        setIsConnected(false);
      };

      wsRef.current.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason);
        setConnectionStatus('disconnected');
        setIsConnected(false);
        setIsSpeaking(false);
        setIsRecording(false);
      };

      // Initialize audio context
      await initializeAudioContext();

    } catch (error) {
      console.error('Error connecting to realtime:', error);
      setConnectionStatus('disconnected');
    }
  }, [handleMessage, initializeAudioContext]);

  const startRecording = useCallback(async () => {
    try {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        throw new Error('Not connected to realtime service');
      }

      if (recorderRef.current) {
        recorderRef.current.stop();
      }

      const audioContext = await initializeAudioContext();
      
      recorderRef.current = new AudioRecorder((audioData) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          const encodedAudio = encodeAudioForAPI(audioData);
          wsRef.current.send(JSON.stringify({
            type: 'input_audio_buffer.append',
            audio: encodedAudio
          }));
        }
      });

      await recorderRef.current.start();
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }, [initializeAudioContext]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    console.log('Recording stopped');
  }, []);

  const sendTextMessage = useCallback((text: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      throw new Error('Not connected to realtime service');
    }

    // Add user message to chat
    const messageId = `msg_${Date.now()}`;
    const newMessage: RealtimeMessage = {
      id: messageId,
      type: 'user',
      content: text,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);

    // Send to OpenAI
    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: text
          }
        ]
      }
    };

    wsRef.current.send(JSON.stringify(event));
    wsRef.current.send(JSON.stringify({ type: 'response.create' }));
  }, []);

  const disconnect = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    clearAudioQueue();
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setIsSpeaking(false);
    setIsRecording(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    messages,
    isConnected,
    isRecording,
    isSpeaking,
    connectionStatus,
    connectToRealtime,
    startRecording,
    stopRecording,
    sendTextMessage,
    disconnect,
    clearMessages: () => setMessages([])
  };
};