
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { type QuantumGate } from '@/types/qosim';
import { Users, MessageSquare, Eye, Edit3 } from 'lucide-react';

interface CollaborativeEditorProps {
  circuit: QuantumGate[];
  onCircuitUpdate: (circuit: QuantumGate[]) => void;
}

export function CollaborativeEditor({ circuit, onCircuitUpdate }: CollaborativeEditorProps) {
  const [collaborators] = useState([
    { id: '1', name: 'Alice', status: 'editing', cursor: { x: 120, y: 60 }, color: 'bg-blue-500' },
    { id: '2', name: 'Bob', status: 'viewing', cursor: { x: 180, y: 120 }, color: 'bg-green-500' },
    { id: '3', name: 'Charlie', status: 'commenting', cursor: { x: 240, y: 60 }, color: 'bg-purple-500' }
  ]);

  const [comments] = useState([
    { id: '1', user: 'Alice', text: 'Should we add error correction here?', position: { x: 120, y: 60 } },
    { id: '2', user: 'Bob', text: 'This CNOT might be redundant', position: { x: 180, y: 120 } }
  ]);

  return (
    <div className="space-y-6">
      {/* Active Collaborators */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Real-Time Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {collaborators.map(collaborator => (
              <div key={collaborator.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${collaborator.color}`} />
                  <span className="text-white font-medium">{collaborator.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {collaborator.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-1">
                  {collaborator.status === 'editing' ? (
                    <Edit3 className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-green-400" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Live Comments */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-blue-400 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Circuit Comments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="bg-black/50 rounded-lg p-3 border border-blue-400/20">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-blue-400 font-medium text-sm">{comment.user}</span>
                  <Badge variant="outline" className="text-xs">
                    Gate @ {comment.position.x}, {comment.position.y}
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm">{comment.text}</p>
              </div>
            ))}
          </div>
          
          <div className="space-y-2">
            <Input
              placeholder="Add a comment..."
              className="bg-black/50 border-white/10 text-white"
            />
            <Button
              size="sm"
              className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
            >
              Add Comment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Tools */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-blue-400">Collaboration Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-slate-400 border-slate-400/30"
            >
              Share Session
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-slate-400 border-slate-400/30"
            >
              Lock Circuit
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full text-slate-400 border-slate-400/30"
          >
            Export Collaboration Log
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
