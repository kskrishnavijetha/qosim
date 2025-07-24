
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CollaborativeUser, CircuitComment } from '@/hooks/useRealtimeCircuitCollaboration';
import { Gate } from '@/hooks/useCircuitWorkspace';
import { 
  Users, 
  MessageSquare, 
  Check, 
  Clock,
  GitBranch,
  History,
  Eye
} from 'lucide-react';

interface CollaborationPanelProps {
  activeUsers: CollaborativeUser[];
  comments: CircuitComment[];
  onAddComment: (gateId: string, comment: string) => void;
  onResolveComment: (commentId: string) => void;
  circuit: Gate[];
}

export function CollaborationPanel({
  activeUsers,
  comments,
  onAddComment,
  onResolveComment,
  circuit
}: CollaborationPanelProps) {
  const [newComment, setNewComment] = useState('');
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false);

  const handleAddComment = () => {
    if (selectedGateId && newComment.trim()) {
      onAddComment(selectedGateId, newComment.trim());
      setNewComment('');
      setShowAddCommentDialog(false);
    }
  };

  const unresolvedComments = comments.filter(c => !c.resolved);
  const resolvedComments = comments.filter(c => c.resolved);

  return (
    <div className="h-full p-6 space-y-6">
      {/* Active Users */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Users className="w-5 h-5" />
            Active Collaborators
            <Badge variant="outline" className="text-quantum-neon">
              {activeUsers.length} online
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-quantum-void/30 border border-quantum-matrix">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback 
                      className="text-xs font-bold text-quantum-void"
                      style={{ backgroundColor: user.color }}
                    >
                      {user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-quantum-glow">{user.email}</p>
                    <p className="text-xs text-quantum-particle">
                      {user.cursor ? 'Active' : 'Idle'} • {user.lastSeen.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.cursor && (
                    <Badge variant="secondary" className="text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      Viewing
                    </Badge>
                  )}
                  {user.selectedGate && (
                    <Badge variant="outline" className="text-xs">
                      Gate Selected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            
            {activeUsers.length === 0 && (
              <div className="text-center py-8 text-quantum-particle">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No active collaborators</p>
                <p className="text-xs mt-1">Share this circuit to start collaborating</p>
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
              Comments & Reviews
              {unresolvedComments.length > 0 && (
                <Badge variant="destructive">
                  {unresolvedComments.length} unresolved
                </Badge>
              )}
            </CardTitle>
            
            <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="neon-border">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Add Comment
                </Button>
              </DialogTrigger>
              <DialogContent className="quantum-panel neon-border">
                <DialogHeader>
                  <DialogTitle className="text-quantum-glow">Add Circuit Comment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-quantum-neon">Select Gate</label>
                    <select
                      value={selectedGateId || ''}
                      onChange={(e) => setSelectedGateId(e.target.value)}
                      className="w-full mt-1 p-2 rounded border border-quantum-matrix bg-quantum-void text-quantum-glow"
                    >
                      <option value="">Choose a gate...</option>
                      {circuit.map((gate) => (
                        <option key={gate.id} value={gate.id}>
                          {gate.type} on Qubit {gate.qubit} (Position {gate.position})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-quantum-neon">Comment</label>
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add your comment or suggestion..."
                      className="mt-1"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleAddComment}
                    disabled={!selectedGateId || !newComment.trim()}
                    className="w-full"
                  >
                    Add Comment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Unresolved Comments */}
            {unresolvedComments.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-quantum-neon mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Unresolved Comments
                </h4>
                <div className="space-y-3">
                  {unresolvedComments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-lg bg-quantum-void/20 border border-quantum-matrix">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Gate {circuit.find(g => g.id === comment.gateId)?.type || 'Unknown'}
                          </Badge>
                          <span className="text-xs text-quantum-particle">
                            {comment.timestamp.toLocaleString()}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onResolveComment(comment.id)}
                          className="text-quantum-glow hover:text-quantum-neon"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-quantum-particle">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Resolved Comments */}
            {resolvedComments.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-quantum-neon mb-3 flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  Resolved Comments
                </h4>
                <div className="space-y-3">
                  {resolvedComments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-lg bg-quantum-void/10 border border-quantum-matrix/50 opacity-75">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          Gate {circuit.find(g => g.id === comment.gateId)?.type || 'Unknown'}
                        </Badge>
                        <span className="text-xs text-quantum-particle">
                          {comment.timestamp.toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-xs text-green-500">
                          Resolved
                        </Badge>
                      </div>
                      <p className="text-sm text-quantum-particle">{comment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {comments.length === 0 && (
              <div className="text-center py-8 text-quantum-particle">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No comments yet</p>
                <p className="text-xs mt-1">Add comments to start reviewing the circuit</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Version History */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Changes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 rounded bg-quantum-void/20">
              <GitBranch className="w-4 h-4 text-quantum-neon" />
              <span className="text-sm text-quantum-particle">Circuit saved</span>
              <span className="text-xs text-quantum-particle ml-auto">2 minutes ago</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-quantum-void/20">
              <GitBranch className="w-4 h-4 text-quantum-neon" />
              <span className="text-sm text-quantum-particle">H gate added to qubit 2</span>
              <span className="text-xs text-quantum-particle ml-auto">5 minutes ago</span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded bg-quantum-void/20">
              <GitBranch className="w-4 h-4 text-quantum-neon" />
              <span className="text-sm text-quantum-particle">CNOT gate removed</span>
              <span className="text-xs text-quantum-particle ml-auto">8 minutes ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
