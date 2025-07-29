
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface CollaborationPanelProps {
  activeUsers: any[];
  onUsersUpdate: (users: any[]) => void;
}

export function CollaborationPanel({ activeUsers, onUsersUpdate }: CollaborationPanelProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Real-time collaborative editing with multi-user support
      </div>

      <div className="flex items-center space-x-2">
        <Users className="w-4 h-4" />
        <span className="text-sm font-medium">Active Users: {activeUsers.length}</span>
      </div>

      {activeUsers.length > 0 ? (
        <div className="space-y-2">
          {activeUsers.map((user, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {user.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{user.name || 'Anonymous'}</span>
              <Badge variant="outline" className="text-xs">Online</Badge>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-4">
          No other users online
        </div>
      )}
    </div>
  );
}
