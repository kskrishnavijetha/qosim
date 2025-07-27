
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, Share, MessageSquare, History, X } from 'lucide-react';
import type { QuantumGate } from '@/hooks/useCircuitBuilder';

interface CollaborationPanelProps {
  circuit: QuantumGate[];
  onClose: () => void;
}

export function CollaborationPanel({ circuit, onClose }: CollaborationPanelProps) {
  const [collaborators] = useState([
    { id: 1, name: 'Alice', initials: 'A', status: 'online', role: 'editor' },
    { id: 2, name: 'Bob', initials: 'B', status: 'away', role: 'viewer' },
    { id: 3, name: 'Charlie', initials: 'C', status: 'offline', role: 'editor' }
  ]);
  
  const [comments] = useState([
    { id: 1, user: 'Alice', text: 'Added H gate for superposition', timestamp: '2 min ago' },
    { id: 2, user: 'Bob', text: 'Consider adding error correction', timestamp: '5 min ago' },
    { id: 3, user: 'Charlie', text: 'Circuit depth looks good', timestamp: '10 min ago' }
  ]);
  
  const [versions] = useState([
    { id: 1, version: 'v1.2', user: 'Alice', timestamp: '2 min ago', gates: 8 },
    { id: 2, version: 'v1.1', user: 'Bob', timestamp: '1 hour ago', gates: 6 },
    { id: 3, version: 'v1.0', user: 'Charlie', timestamp: '2 hours ago', gates: 4 }
  ]);

  const [newComment, setNewComment] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Collaboration
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Share Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Share className="w-4 h-4" />
            <span className="font-medium">Share Circuit</span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Enter email to invite"
              className="flex-1"
            />
            <Button size="sm">
              Invite
            </Button>
          </div>
        </div>

        {/* Collaborators */}
        <div className="space-y-3">
          <div className="font-medium">Collaborators ({collaborators.length})</div>
          <div className="space-y-2">
            {collaborators.map(collaborator => (
              <div key={collaborator.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                <div className="relative">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">{collaborator.initials}</AvatarFallback>
                  </Avatar>
                  <div 
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(collaborator.status)}`}
                  />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{collaborator.name}</div>
                  <div className="text-xs text-muted-foreground">{collaborator.status}</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {collaborator.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <span className="font-medium">Comments</span>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              className="flex-1"
            />
            <Button size="sm" onClick={handleAddComment}>
              Post
            </Button>
          </div>
          
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {comments.map(comment => (
                <div key={comment.id} className="p-2 rounded-lg bg-muted">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{comment.user}</span>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Version History */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4" />
            <span className="font-medium">Version History</span>
          </div>
          
          <ScrollArea className="h-32">
            <div className="space-y-2">
              {versions.map(version => (
                <div key={version.id} className="p-2 rounded-lg hover:bg-muted cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{version.version}</div>
                      <div className="text-xs text-muted-foreground">
                        by {version.user} • {version.timestamp}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {version.gates} gates
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Circuit Stats */}
        <div className="space-y-2">
          <div className="font-medium">Current Circuit</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-muted rounded-lg text-center">
              <div className="text-lg font-bold">{circuit.length}</div>
              <div className="text-xs text-muted-foreground">Gates</div>
            </div>
            <div className="p-2 bg-muted rounded-lg text-center">
              <div className="text-lg font-bold">
                {circuit.length > 0 ? Math.max(...circuit.map(g => g.layer)) + 1 : 0}
              </div>
              <div className="text-xs text-muted-foreground">Depth</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
