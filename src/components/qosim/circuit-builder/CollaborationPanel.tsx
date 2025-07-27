
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Share, 
  MessageSquare, 
  Clock,
  Eye,
  Edit,
  GitBranch,
  UserPlus
} from 'lucide-react';
import { Gate } from '@/hooks/useCircuitState';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeCollaboration } from '@/hooks/useRealtimeCollaboration';
import { toast } from 'sonner';

interface CollaborationPanelProps {
  circuit: Gate[];
  onCircuitUpdate: (circuit: Gate[]) => void;
}

export function CollaborationPanel({ circuit, onCircuitUpdate }: CollaborationPanelProps) {
  const { user } = useAuth();
  const [shareEmail, setShareEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  
  const circuitId = `circuit_${Date.now()}`;
  const {
    activeUsers,
    recentChanges,
    isConnected,
    broadcastChange
  } = useRealtimeCollaboration(circuitId);

  const handleShare = async () => {
    if (!shareEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSharing(true);
    try {
      // Simulate sharing process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Circuit shared', {
        description: `Shared with ${shareEmail}`
      });
      
      setShareEmail('');
    } catch (error) {
      toast.error('Failed to share circuit');
    } finally {
      setIsSharing(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    try {
      await broadcastChange('circuit_saved', {
        comment,
        timestamp: new Date().toISOString(),
        user: user?.email
      });
      
      toast.success('Comment added');
      setComment('');
    } catch (error) {
      toast.error('Failed to add comment');
    }
  };

  const handleCreateBranch = () => {
    const branchName = `branch_${Date.now()}`;
    toast.success('Branch created', {
      description: `Created branch: ${branchName}`
    });
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <Card className="quantum-panel neon-border h-fit">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <Users className="w-5 h-5" />
          Collaboration
        </CardTitle>
        
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-quantum-particle">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Active Users */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-quantum-neon">Active Users</h4>
            <Badge variant="outline" className="neon-border">
              {activeUsers.length}
            </Badge>
          </div>
          
          <div className="space-y-1">
            {activeUsers.length > 0 ? (
              activeUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-quantum-matrix/50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs text-quantum-neon">{user.name}</span>
                  </div>
                  <div className="text-xs text-quantum-particle">
                    {formatTimeAgo(user.lastSeen)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-quantum-particle text-center py-2">
                No other users online
              </div>
            )}
          </div>
        </div>

        {/* Share Circuit */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-quantum-neon">Share Circuit</h4>
          
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter email address"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="quantum-input"
            />
            
            <div className="flex gap-2">
              <Button
                onClick={handleShare}
                disabled={isSharing}
                size="sm"
                className="neon-border flex-1"
              >
                <Share className="w-4 h-4 mr-2" />
                {isSharing ? 'Sharing...' : 'Share'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="neon-border"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard');
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-quantum-neon">Comments</h4>
          
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="quantum-input"
            />
            
            <Button
              onClick={handleAddComment}
              disabled={!comment.trim()}
              size="sm"
              className="neon-border"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </div>

        {/* Version Control */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-quantum-neon">Version Control</h4>
          
          <div className="space-y-2">
            <Button
              onClick={handleCreateBranch}
              variant="outline"
              size="sm"
              className="w-full neon-border"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Create Branch
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="neon-border"
                onClick={() => toast.info('Coming soon')}
              >
                Commit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="neon-border"
                onClick={() => toast.info('Coming soon')}
              >
                Push
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Changes */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-quantum-neon">Recent Changes</h4>
          
          <div className="max-h-32 overflow-y-auto space-y-1">
            {recentChanges.length > 0 ? (
              recentChanges.map((change, index) => (
                <div key={index} className="p-2 bg-quantum-matrix/30 rounded">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-quantum-neon">
                      {change.type.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-quantum-particle">
                      {formatTimeAgo(change.timestamp)}
                    </div>
                  </div>
                  <div className="text-xs text-quantum-particle">
                    by {change.userId}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-quantum-particle text-center py-2">
                No recent changes
              </div>
            )}
          </div>
        </div>

        {/* Collaboration Stats */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-quantum-neon">Stats</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span>Total Changes:</span>
              <span className="text-quantum-neon">{recentChanges.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Contributors:</span>
              <span className="text-quantum-neon">{activeUsers.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Branches:</span>
              <span className="text-quantum-neon">1</span>
            </div>
            <div className="flex justify-between">
              <span>Version:</span>
              <span className="text-quantum-neon">v1.0</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
