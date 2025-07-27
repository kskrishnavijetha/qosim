
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Share2, 
  Clock, 
  Eye,
  Edit,
  UserPlus,
  GitBranch,
  Star
} from 'lucide-react';
import { toast } from 'sonner';

interface CollaborationPanelProps {}

export function CollaborationPanel({}: CollaborationPanelProps) {
  const [activeUsers, setActiveUsers] = useState([
    { id: '1', name: 'Alice Cooper', avatar: '', status: 'online', lastSeen: 'now' },
    { id: '2', name: 'Bob Wilson', avatar: '', status: 'editing', lastSeen: '2m ago' },
    { id: '3', name: 'Carol Davis', avatar: '', status: 'away', lastSeen: '15m ago' }
  ]);

  const [comments, setComments] = useState([
    { id: '1', user: 'Alice Cooper', message: 'Great use of the Bell state here!', timestamp: '2m ago', gateId: 'gate-1' },
    { id: '2', user: 'Bob Wilson', message: 'Should we optimize the depth here?', timestamp: '5m ago', gateId: 'gate-2' },
    { id: '3', user: 'Carol Davis', message: 'Added error correction to T gate', timestamp: '10m ago', gateId: 'gate-3' }
  ]);

  const [newComment, setNewComment] = useState('');
  const [shareLink, setShareLink] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now().toString(),
      user: 'You',
      message: newComment,
      timestamp: 'now',
      gateId: 'current'
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
    toast.success('Comment added');
  };

  const handleGenerateShareLink = () => {
    const link = `https://qosim.app/circuit/${Math.random().toString(36).substr(2, 9)}`;
    setShareLink(link);
    navigator.clipboard.writeText(link);
    toast.success('Share link copied to clipboard');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'editing': return 'bg-blue-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Eye className="w-3 h-3" />;
      case 'editing': return <Edit className="w-3 h-3" />;
      case 'away': return <Clock className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
          <TabsTrigger value="comments" className="text-xs">Comments</TabsTrigger>
          <TabsTrigger value="share" className="text-xs">Share</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Active Users ({activeUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                {activeUsers.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(user.status)} flex items-center justify-center`}>
                          {getStatusIcon(user.status)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.lastSeen}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {user.status}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full" onClick={() => toast.success('Invite sent!')}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Collaborator
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <GitBranch className="w-4 h-4 text-muted-foreground" />
                  <span>Alice added H gate to qubit 0</span>
                  <span className="text-muted-foreground">2m ago</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-muted-foreground" />
                  <span>Bob starred this circuit</span>
                  <span className="text-muted-foreground">5m ago</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span>Carol left a comment</span>
                  <span className="text-muted-foreground">10m ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comments ({comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                  Post Comment
                </Button>
              </div>

              <div className="space-y-3 max-h-48 overflow-y-auto">
                {comments.map(comment => (
                  <div key={comment.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{comment.user}</span>
                      <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.message}</p>
                    {comment.gateId && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        Gate: {comment.gateId}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share Circuit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleGenerateShareLink} className="w-full">
                <Share2 className="w-4 h-4 mr-2" />
                Generate Share Link
              </Button>

              {shareLink && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Share Link</label>
                  <div className="flex gap-2">
                    <Input value={shareLink} readOnly className="font-mono text-sm" />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(shareLink);
                        toast.success('Link copied!');
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Permission Level</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View Only
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Can Edit
                  </Button>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  Circuit will be accessible to anyone with the link
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Share as QASM
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Share as Python
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  Share as JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
