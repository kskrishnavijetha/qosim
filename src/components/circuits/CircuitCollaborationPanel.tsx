
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuantumCircuit } from '@/hooks/useCircuitBuilder';
import { Users, Share2, Save, Upload, Clock, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface CircuitCollaborationPanelProps {
  circuit: QuantumCircuit;
  onSave: () => Promise<void>;
  onLoad: (circuit?: QuantumCircuit) => Promise<void>;
}

export function CircuitCollaborationPanel({ 
  circuit, 
  onSave, 
  onLoad 
}: CircuitCollaborationPanelProps) {
  const [shareLink, setShareLink] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [versions, setVersions] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleShare = async () => {
    try {
      // Generate shareable link
      const link = `${window.location.origin}/circuit/${circuit.id}`;
      setShareLink(link);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(link);
      toast.success('Share link copied to clipboard');
    } catch (error) {
      toast.error('Failed to create share link');
    }
  };

  const handleAddCollaborator = () => {
    if (newCollaborator.trim() && !collaborators.includes(newCollaborator)) {
      setCollaborators([...collaborators, newCollaborator]);
      setNewCollaborator('');
      toast.success('Collaborator added');
    }
  };

  const handleRemoveCollaborator = (collaborator: string) => {
    setCollaborators(collaborators.filter(c => c !== collaborator));
    toast.success('Collaborator removed');
  };

  const handleSaveVersion = async () => {
    try {
      await onSave();
      // Add to version history
      const newVersion = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        author: 'Current User',
        description: `Version ${versions.length + 1}`,
        gates: circuit.gates.length,
        qubits: circuit.qubits.length
      };
      setVersions([newVersion, ...versions]);
      toast.success('Version saved');
    } catch (error) {
      toast.error('Failed to save version');
    }
  };

  const handleLoadVersion = async (version: any) => {
    try {
      await onLoad();
      toast.success('Version loaded');
    } catch (error) {
      toast.error('Failed to load version');
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: 'Current User',
        timestamp: new Date().toISOString(),
        content: newComment,
        gate: null // Could be linked to a specific gate
      };
      setComments([...comments, comment]);
      setNewComment('');
      toast.success('Comment added');
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="w-4 h-4" />
            Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="share" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="share">Share</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="share" className="space-y-4">
              <div className="space-y-2">
                <Button
                  onClick={handleShare}
                  className="w-full"
                  variant="outline"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Generate Share Link
                </Button>
                
                {shareLink && (
                  <div className="space-y-2">
                    <Label>Share Link</Label>
                    <Input
                      value={shareLink}
                      readOnly
                      className="font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Collaborators</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCollaborator}
                    onChange={(e) => setNewCollaborator(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddCollaborator}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
                
                <div className="space-y-1">
                  {collaborators.map(collaborator => (
                    <div key={collaborator} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{collaborator}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCollaborator(collaborator)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="versions" className="space-y-4">
              <div className="space-y-2">
                <Button
                  onClick={handleSaveVersion}
                  className="w-full"
                  variant="outline"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Current Version
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Version History</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {versions.map(version => (
                    <div key={version.id} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{version.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {version.author} • {new Date(version.timestamp).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {version.gates} gates
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {version.qubits} qubits
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLoadVersion(version)}
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Load
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="comments" className="space-y-4">
              <div className="space-y-2">
                <Label>Add Comment</Label>
                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Enter your comment..."
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAddComment}
                    size="sm"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Comments</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {comments.map(comment => (
                    <div key={comment.id} className="p-2 bg-muted rounded space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {comment.author} • {new Date(comment.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm">{comment.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
