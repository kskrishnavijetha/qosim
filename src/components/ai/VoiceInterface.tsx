import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  Settings,
  Waves
} from 'lucide-react';
import { toast } from 'sonner';

interface VoiceInterfaceProps {
  onVoiceCommand: (command: string) => void;
  onTextToSpeech: (text: string) => void;
  isEnabled?: boolean;
}

export function VoiceInterface({ 
  onVoiceCommand, 
  onTextToSpeech,
  isEnabled = true 
}: VoiceInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isEnabled) return;

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onstart = () => {
        console.log('Voice recognition started');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence);
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          onVoiceCommand(finalTranscript);
          setTranscript('');
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error(`Voice recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
      };
    }

    // Initialize Speech Synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isEnabled, onVoiceCommand]);

  const startListening = async () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported in this browser');
      return;
    }

    try {
      // Request microphone access and set up audio level monitoring
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
          setAudioLevel(average / 255 * 100);
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
      recognitionRef.current.start();
      toast.success('Voice recognition started - speak now!');
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setAudioLevel(0);
    setIsListening(false);
    toast.info('Voice recognition stopped');
  };

  const speak = (text: string) => {
    if (!synthRef.current) {
      toast.error('Text-to-speech not supported in this browser');
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;

    // Get available voices and prefer a clear English voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.lang.startsWith('en') && 
      (voice.name.includes('Google') || voice.name.includes('Microsoft'))
    );
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log('Started speaking:', text);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      console.log('Finished speaking');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      toast.error('Text-to-speech error');
    };

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isEnabled) {
    return (
      <Card className="w-full opacity-50">
        <CardContent className="p-4 text-center">
          <MicOff className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Voice interface disabled</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Waves className="w-5 h-5" />
          Voice Interface
          <Badge variant={isListening ? "default" : "secondary"} className="ml-auto">
            {isListening ? 'Listening' : 'Idle'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Audio Level Indicator */}
        {isListening && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              <Progress value={audioLevel} className="flex-1 h-2" />
              <span className="text-xs text-muted-foreground">{Math.round(audioLevel)}%</span>
            </div>
            
            {transcript && (
              <div className="p-2 bg-muted rounded text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">Transcript:</span>
                  {confidence > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {Math.round(confidence * 100)}% confident
                    </Badge>
                  )}
                </div>
                <p>"{transcript}"</p>
              </div>
            )}
          </div>
        )}

        {/* Voice Controls */}
        <div className="flex gap-2">
          <Button
            onClick={handleToggleListening}
            className={`flex-1 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
            variant={isListening ? "default" : "outline"}
          >
            {isListening ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Button>
          
          <Button
            onClick={isSpeaking ? stopSpeaking : () => speak('Hello! I am your quantum AI assistant. How can I help you today?')}
            variant="outline"
            className={isSpeaking ? 'bg-orange-500 text-white' : ''}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Quick Commands */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Quick Voice Commands:</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 justify-start text-xs"
              onClick={() => speak('Try saying: Create a Bell state circuit')}
            >
              "Create a Bell state"
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 justify-start text-xs"
              onClick={() => speak('Try saying: Optimize my circuit')}
            >
              "Optimize my circuit"
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 justify-start text-xs"
              onClick={() => speak('Try saying: Explain quantum entanglement')}
            >
              "Explain entanglement"
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 justify-start text-xs"
              onClick={() => speak('Try saying: Run simulation')}
            >
              "Run simulation"
            </Button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>Speech Recognition {isListening ? 'Active' : 'Inactive'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`} />
            <span>Text-to-Speech {isSpeaking ? 'Active' : 'Inactive'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}