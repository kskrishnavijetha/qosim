import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { useRealtimeChat, type RealtimeMessage } from '@/hooks/useRealtimeChat';
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Send, 
  Volume2, 
  VolumeX,
  Loader2,
  Bot,
  User
} from 'lucide-react';

interface RealtimeVoiceInterfaceProps {
  onCircuitGenerated?: (circuitData: any) => void;
}

export function RealtimeVoiceInterface({ onCircuitGenerated }: RealtimeVoiceInterfaceProps) {
  const { toast } = useToast();
  const [textInput, setTextInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  
  const {
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
    clearMessages
  } = useRealtimeChat();

  // Listen for circuit generation events
  useEffect(() => {
    const handleCircuitGenerated = (event: CustomEvent) => {
      if (onCircuitGenerated) {
        onCircuitGenerated(event.detail);
      }
    };

    window.addEventListener('quantumCircuitGenerated', handleCircuitGenerated as EventListener);
    return () => {
      window.removeEventListener('quantumCircuitGenerated', handleCircuitGenerated as EventListener);
    };
  }, [onCircuitGenerated]);

  const handleConnect = async () => {
    try {
      await connectToRealtime();
      toast({
        title: "Connected",
        description: "Voice interface is ready for quantum computing assistance",
      });
    } catch (error) {
      console.error('Connection failed:', error);
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : 'Failed to connect to voice service',
        variant: "destructive",
      });
    }
  };

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error('Recording failed:', error);
      toast({
        title: "Recording Failed",
        description: error instanceof Error ? error.message : 'Failed to start recording',
        variant: "destructive",
      });
    }
  };

  const handleSendText = () => {
    if (!textInput.trim()) return;
    
    try {
      sendTextMessage(textInput);
      setTextInput('');
    } catch (error) {
      console.error('Send failed:', error);
      toast({
        title: "Send Failed",
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = () => {
    switch (connectionStatus) {
      case 'connecting':
        return <Badge variant="secondary" className="gap-1"><Loader2 className="w-3 h-3 animate-spin" />Connecting</Badge>;
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      default:
        return <Badge variant="outline">Disconnected</Badge>;
    }
  };

  const formatMessage = (message: RealtimeMessage) => {
    const isUser = message.type === 'user';
    return (
      <div key={message.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
        <div className={`max-w-[80%] p-3 rounded-lg ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted'
        }`}>
          <p className="text-sm">{message.content}</p>
          <div className="text-xs opacity-70 mt-1">
            {message.timestamp.toLocaleTimeString()}
            {message.audioTranscript && (
              <span className="ml-2 italic">(voice)</span>
            )}
          </div>
        </div>
        {isUser && (
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-secondary-foreground" />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold">QOSim AI Voice Assistant</h3>
              <p className="text-sm text-muted-foreground">Real-time quantum computing help</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge()}
            {isSpeaking && (
              <Badge variant="secondary" className="gap-1 animate-pulse">
                <Volume2 className="w-3 h-3" />Speaking
              </Badge>
            )}
            {isRecording && (
              <Badge variant="secondary" className="gap-1 animate-pulse bg-red-500 text-white">
                <Mic className="w-3 h-3" />Listening
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4 p-4">
        {/* Connection Controls */}
        <div className="flex gap-2">
          {!isConnected ? (
            <Button 
              onClick={handleConnect}
              disabled={connectionStatus === 'connecting'}
              className="flex-1"
            >
              {connectionStatus === 'connecting' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Connect Voice
                </>
              )}
            </Button>
          ) : (
            <>
              <Button 
                onClick={disconnect}
                variant="destructive"
              >
                <PhoneOff className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
              <Button
                onClick={clearMessages}
                variant="outline"
              >
                Clear Chat
              </Button>
            </>
          )}
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 border rounded-lg p-4">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Start a conversation to get help with quantum computing!</p>
                <p className="text-sm mt-2">Try saying: "Create a Bell state circuit" or "Explain quantum entanglement"</p>
              </div>
            ) : (
              messages.map(formatMessage)
            )}
          </div>
        </ScrollArea>

        {/* Voice and Text Controls */}
        {isConnected && (
          <div className="space-y-3">
            {/* Voice Controls */}
            <div className="flex gap-2">
              <Button
                onMouseDown={handleStartRecording}
                onMouseUp={stopRecording}
                onTouchStart={handleStartRecording}
                onTouchEnd={stopRecording}
                disabled={!isConnected || isSpeaking}
                variant={isRecording ? "destructive" : "default"}
                className="flex-1"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-4 h-4 mr-2" />
                    Release to Stop
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 mr-2" />
                    Hold to Speak
                  </>
                )}
              </Button>
              <Button
                onClick={() => setIsMuted(!isMuted)}
                variant="outline"
                size="icon"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>

            {/* Text Input */}
            <div className="flex gap-2">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type a message or use voice..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
                disabled={!isConnected}
              />
              <Button
                onClick={handleSendText}
                disabled={!textInput.trim() || !isConnected}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}