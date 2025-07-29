
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle } from 'lucide-react';

interface SyncManagerProps {
  status: string;
  onStatusChange: (status: string) => void;
  sharedData: any;
}

export function SyncManager({ status, onStatusChange, sharedData }: SyncManagerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {status === 'active' ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <RefreshCw className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-sm font-medium">Sync Status</span>
        </div>
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status}
        </Badge>
      </div>

      <div className="text-sm text-muted-foreground">
        Automatically syncs circuits between visual builder and code editor
      </div>

      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onStatusChange(status === 'active' ? 'paused' : 'active')}
      >
        {status === 'active' ? 'Pause Sync' : 'Resume Sync'}
      </Button>
    </div>
  );
}
