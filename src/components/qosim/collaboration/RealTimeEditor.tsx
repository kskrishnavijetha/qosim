
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Edit, Users } from 'lucide-react';

interface RealTimeEditorProps {
  sharedData: any;
  onDataUpdate: (data: any) => void;
  activeUsers: any[];
}

export function RealTimeEditor({ sharedData, onDataUpdate, activeUsers }: RealTimeEditorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Edit className="w-4 h-4" />
          <span className="text-sm font-medium">Real-time Editor</span>
        </div>
        <Badge variant="outline">
          <Users className="w-3 h-3 mr-1" />
          {activeUsers.length}
        </Badge>
      </div>

      <div className="text-sm text-muted-foreground">
        Synchronized editing with live cursor tracking
      </div>

      <div className="border rounded-lg p-4 bg-muted/10 min-h-[100px]">
        <div className="text-center text-muted-foreground">
          Shared workspace ready for collaboration
        </div>
      </div>
    </div>
  );
}
