
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { type QuantumGate } from '@/types/qosim';
import { Users, MessageSquare, GitBranch, Share2, Clock } from 'lucide-react';

interface CollaborationPanelProps {
  circuit: QuantumGate[];
  onVersionControl: (action: string) => void;
  onComment: (comment: string) => void;
}

export function CollaborationPanel({
  circuit,
  onVersionControl,
  onComment
}: CollaborationPanelProps) {
  const [comment, setComment] = useState('');
  const [collaborators] = useState([
    { id: '1', name: 'Alice', status: 'online', color: 'bg-green-500' },
    { id: '2', name: 'Bob', status: 'editing', color: 'bg-blue-500' },
    { id: '3', name: 'Charlie', status: 'away', color: 'bg-yellow-500' }
  ]);

  const handleAddComment = () => {
    if (comment.trim()) {
      onComment(comment);
      setComment('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Active Collaborators */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-emerald-400 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Active Collaborators
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {collaborators.map(collaborator => (
            <div key={collaborator.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${collaborator.color}`} />
                <span className="text-sm text-white">{collaborator.name}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {collaborator.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Comments */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-emerald-400 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
            />
            <Button
              onClick={handleAddComment}
              disabled={!comment.trim()}
              size="sm"
              className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
            >
              Add Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Version Control */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-emerald-400 flex items-center">
            <GitBranch className="w-4 h-4 mr-2" />
            Version Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex space-x-2">
            <Button
              onClick={() => onVersionControl('commit')}
              size="sm"
              variant="outline"
              className="flex-1 text-emerald-400 border-emerald-400/30"
            >
              Commit
            </Button>
            <Button
              onClick={() => onVersionControl('branch')}
              size="sm"
              variant="outline"
              className="flex-1 text-blue-400 border-blue-400/30"
            >
              Branch
            </Button>
          </div>
          <Button
            onClick={() => onVersionControl('merge')}
            size="sm"
            variant="outline"
            className="w-full text-purple-400 border-purple-400/30"
          >
            <GitBranch className="w-4 h-4 mr-2" />
            Merge Changes
          </Button>
        </CardContent>
      </Card>

      {/* Share Circuit */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-emerald-400 flex items-center">
            <Share2 className="w-4 h-4 mr-2" />
            Share Circuit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Input
            placeholder="Enter email to share..."
            className="bg-black/50 border-white/10 text-white"
          />
          <Button
            size="sm"
            className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400"
          >
            Send Invitation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
