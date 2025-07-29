
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useRealtimeCollaboration } from '@/hooks/useRealtimeCollaboration';
import { useAuth } from '@/contexts/AuthContext';
import { Users, MessageSquare, History, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  position?: { x: number; y: number };
  gateId?: string;
}

interface CollaborativeCircuitEditorProps {
  circuitId: string;
  onCommentAdd?: (comment: Comment) => void;
}

export function CollaborativeCircuitEditor({ 
  circuitId, 
  onCommentAdd 
}: CollaborativeCircuitEditorProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true);

  const {
    activeUsers,
    recentChanges,
    isConnected,
    broadcastChange
  } = useRealtimeCollaboration(circuitId);

  const addComment = async () => {
    if (!newComment.trim() || !user) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: user.id,
      userName: user.email || 'Anonymous',
      content: newComment,
      timestamp: new Date().toISOString()
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
    
    // Broadcast comment
    await broadcastChange('comment_added', comment);
    onCommentAdd?.(comment);
    
    toast.success('Comment added');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      addComment();
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Users */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Users className="w-5 h-5" />
            Active Collaborators
            <Badge variant={isConnected ? 'default' : 'secondary'}>
              {isConnected ? 'Connected' : 'Offline'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {activeUsers.map((user, index) => (
              <div key={user.id} className="flex items-center gap-2 p-2 bg-quantum-void rounded">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-quantum-particle">{user.name}</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            ))}
            
            {activeUsers.length === 0 && (
              <div className="text-xs text-quantum-particle">
                No other users currently editing
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-quantum-glow flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comments & Feedback
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              {showComments ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardHeader>
        
        {showComments && (
          <CardContent className="space-y-4">
            {/* Add Comment */}
            <div className="space-y-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a comment... (Ctrl+Enter to send)"
                className="quantum-panel neon-border"
              />
              <Button
                onClick={addComment}
                disabled={!newComment.trim()}
                size="sm"
                className="w-full"
              >
                Add Comment
              </Button>
            </div>

            {/* Comments List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="p-3 bg-quantum-void rounded border border-quantum-matrix">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {comment.userName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-quantum-glow">{comment.userName}</span>
                    <span className="text-xs text-quantum-particle">
                      {new Date(comment.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-quantum-particle">{comment.content}</p>
                </div>
              ))}
              
              {comments.length === 0 && (
                <div className="text-center text-quantum-particle text-sm py-4">
                  No comments yet. Be the first to add feedback!
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Recent Activity */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recentChanges.slice(0, 5).map((change, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-quantum-void rounded">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {change.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-quantum-particle">
                    {new Date(change.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            
            {recentChanges.length === 0 && (
              <div className="text-xs text-quantum-particle text-center py-2">
                No recent activity
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
