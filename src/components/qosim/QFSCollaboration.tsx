
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CollaborationPanel } from './collaboration/CollaborationPanel';
import { VersionControl } from './collaboration/VersionControl';
import { CommentSystem } from './collaboration/CommentSystem';
import { RealTimeEditor } from './collaboration/RealTimeEditor';
import { Users, GitBranch, MessageCircle, Edit } from 'lucide-react';

interface QFSCollaborationProps {
  sharedData: any;
  onDataUpdate: (data: any) => void;
}

export function QFSCollaboration({ sharedData, onDataUpdate }: QFSCollaborationProps) {
  const [activeUsers, setActiveUsers] = useState([]);
  const [comments, setComments] = useState([]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">QFS Collaboration</h2>
          <p className="text-muted-foreground">
            Real-time collaboration with version control and comments
          </p>
        </div>
        <Badge variant="default">
          {activeUsers.length} Active Users
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Active Collaboration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CollaborationPanel 
              activeUsers={activeUsers}
              onUsersUpdate={setActiveUsers}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GitBranch className="w-5 h-5" />
              <span>Version Control</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <VersionControl 
              sharedData={sharedData}
              onDataUpdate={onDataUpdate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span>Comments & Reviews</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CommentSystem 
              comments={comments}
              onCommentsUpdate={setComments}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>Real-time Editor</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RealTimeEditor 
              sharedData={sharedData}
              onDataUpdate={onDataUpdate}
              activeUsers={activeUsers}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
