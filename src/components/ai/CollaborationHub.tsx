import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useRealtimeCollaboration } from '@/hooks/useRealtimeCollaboration';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Share2, 
  Eye, 
  Edit3, 
  MessageCircle, 
  Clock,
  Zap,
  Copy,
  Link,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface CollaborationHubProps {
  circuitId: string | null;
  onCollaborativeEdit: (change: any) => void;
  onStartSession: () => void;
}

export function CollaborationHub({ 
  circuitId, 
  onCollaborativeEdit,
  onStartSession 
}: CollaborationHubProps) {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isHosting, setIsHosting] = useState(false);
  
  const {
    activeUsers,
    recentChanges,
    isConnected,
    broadcastChange,
    joinCircuit,
    leaveCircuit,
  } = useRealtimeCollaboration(circuitId);

  useEffect(() => {
    if (circuitId) {
      const url = `${window.location.origin}/shared-circuit/${circuitId}`;
      setShareUrl(url);
    }
  }, [circuitId]);

  const handleStartCollaboration = async () => {
    if (!circuitId) {
      // Create a new collaboration session
      const newSessionId = `session-${Date.now()}`;
      setSessionId(newSessionId);
      setIsHosting(true);
      onStartSession();
    }
    
    await joinCircuit();
    toast.success('Collaboration session started!');
  };

  const handleEndCollaboration = async () => {
    await leaveCircuit();
    setSessionId(null);
    setIsHosting(false);
    toast.info('Left collaboration session');
  };

  const handleShareCircuit = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const handleBroadcastChange = (changeType: string, data: any) => {
    broadcastChange(changeType as any, data);
    onCollaborativeEdit({ type: changeType, data, userId: user?.id });
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'gate_added': return <Zap className="w-3 h-3 text-green-500" />;
      case 'gate_removed': return <Zap className="w-3 h-3 text-red-500" />;
      case 'gate_moved': return <Edit3 className="w-3 h-3 text-blue-500" />;
      case 'circuit_saved': return <Copy className="w-3 h-3 text-purple-500" />;
      default: return <MessageCircle className="w-3 h-3 text-gray-500" />;
    }
  };

  const formatChangeDescription = (change: any) => {
    switch (change.type) {
      case 'gate_added':
        return `Added ${change.data.gateType || 'gate'} to qubit ${change.data.qubit || '?'}`;
      case 'gate_removed':
        return `Removed gate from position ${change.data.position || '?'}`;
      case 'gate_moved':
        return `Moved gate from ${change.data.from} to ${change.data.to}`;
      case 'circuit_saved':
        return 'Saved circuit changes';
      case 'user_joined':
        return `${change.data.userName} joined the session`;
      case 'user_left':
        return `${change.data.userName} left the session`;
      default:
        return 'Made a change';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5" />
          Collaboration Hub
          <Badge variant={isConnected ? "default" : "secondary"} className="ml-auto">
            {isConnected ? 'Connected' : 'Offline'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm font-medium">
              {isConnected ? 'Real-time Collaboration Active' : 'Not Connected'}
            </span>
          </div>
          <Button
            size="sm"
            onClick={isConnected ? handleEndCollaboration : handleStartCollaboration}
            variant={isConnected ? "destructive" : "default"}
          >
            {isConnected ? 'Leave Session' : 'Start Session'}
          </Button>
        </div>

        {/* Active Users */}
        {activeUsers.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Active Users ({activeUsers.length})
            </h4>
            <ScrollArea className="h-20">
              <div className="flex flex-wrap gap-2">
                {activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{user.name}</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Share Controls */}
        {circuitId && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share Circuit
            </h4>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleShareCircuit}
                className="flex-1"
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy Link
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(shareUrl, '_blank')}
              >
                <Link className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        <Separator />

        {/* Recent Activity */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent Activity
          </h4>
          
          <ScrollArea className="h-32">
            {recentChanges.length > 0 ? (
              <div className="space-y-2">
                {recentChanges.map((change, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-muted/50 rounded text-xs">
                    {getChangeIcon(change.type)}
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{formatChangeDescription(change)}</p>
                      <p className="text-muted-foreground">
                        {new Date(change.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No recent activity</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Collaboration Features */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Collaboration Features</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => handleBroadcastChange('message', { text: 'Hello from AI!' })}
              disabled={!isConnected}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              AI Assist
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              disabled={!isConnected}
            >
              <Settings className="w-3 h-3 mr-1" />
              Settings
            </Button>
          </div>
        </div>

        {/* Connection Instructions */}
        {!isConnected && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium mb-1">How to Collaborate:</h4>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Click "Start Session" to begin hosting</li>
              <li>Share the generated link with collaborators</li>
              <li>Work on circuits together in real-time</li>
              <li>AI assists all participants simultaneously</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
}