
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Users, Share2, MessageSquare, Eye, Edit, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Collaborator {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline';
  role: 'owner' | 'editor' | 'viewer';
  cursor?: { x: number; y: number };
}

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  position?: { x: number; y: number };
}

export function CollaborationPanel() {
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [collaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Alice Chen',
      avatar: '/avatars/alice.png',
      status: 'online',
      role: 'owner'
    },
    {
      id: '2', 
      name: 'Bob Smith',
      status: 'online',
      role: 'editor'
    },
    {
      id: '3',
      name: 'Carol Wu',
      status: 'offline',
      role: 'viewer'
    }
  ]);

  const [comments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Alice Chen',
      content: 'Should we add a Hadamard gate here for better superposition?',
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: '2',
      author: 'Bob Smith', 
      content: 'Great optimization! The circuit depth is much better now.',
      timestamp: new Date(Date.now() - 120000) // 2 minutes ago
    }
  ]);

  const handleGenerateShareUrl = () => {
    const mockUrl = `https://qosim.app/shared/${Math.random().toString(36).substr(2, 9)}`;
    setShareUrl(mockUrl);
    setIsSharing(true);
    
    toast({
      title: "Share Link Generated",
      description: "Circuit is now available for collaboration",
    });
  };

  const handleCopyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Share link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive"
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'owner': return 'default';
      case 'editor': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Share Controls */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share Circuit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isSharing ? (
            <Button onClick={handleGenerateShareUrl} className="w-full" size="sm">
              <Share2 className="w-4 h-4 mr-1" />
              Generate Share Link
            </Button>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-medium">Share URL</label>
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="text-xs"
                />
                <Button onClick={handleCopyShareUrl} size="sm">
                  Copy
                </Button>
              </div>
              <div className="text-xs text-muted-foreground">
                Anyone with this link can view and edit the circuit
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Collaborators */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            Collaborators ({collaborators.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {collaborators.map((collaborator) => (
            <div key={collaborator.id} className="flex items-center gap-2">
              <div className="relative">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={collaborator.avatar} />
                  <AvatarFallback className="text-xs">
                    {collaborator.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div 
                  className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-background ${
                    collaborator.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate">
                  {collaborator.name}
                </div>
              </div>
              <Badge variant={getRoleBadgeVariant(collaborator.role)} className="text-xs">
                {collaborator.role}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Comments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Comments ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {comments.map((comment, index) => (
            <div key={comment.id}>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-medium">{comment.author}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(comment.timestamp)}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                  {comment.content}
                </div>
              </div>
              {index < comments.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
          
          {comments.length === 0 && (
            <div className="text-center text-muted-foreground py-4">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <div className="text-xs">No comments yet</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Version Control */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-muted rounded">
              <div>
                <div className="font-medium">Current version</div>
                <div className="text-muted-foreground">Auto-saved 2 minutes ago</div>
              </div>
              <Badge variant="default" className="text-xs">Live</Badge>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer">
              <div>
                <div className="font-medium">Added optimization gates</div>
                <div className="text-muted-foreground">Alice Chen • 15 minutes ago</div>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded cursor-pointer">
              <div>
                <div className="font-medium">Initial circuit design</div>
                <div className="text-muted-foreground">Alice Chen • 1 hour ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
