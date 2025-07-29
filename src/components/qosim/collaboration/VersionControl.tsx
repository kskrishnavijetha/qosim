
import React from 'react';
import { Button } from '@/components/ui/button';
import { GitBranch, History } from 'lucide-react';

interface VersionControlProps {
  sharedData: any;
  onDataUpdate: (data: any) => void;
}

export function VersionControl({ sharedData, onDataUpdate }: VersionControlProps) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        QFS-powered version control for quantum circuits
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" size="sm" className="flex-1">
          <GitBranch className="w-4 h-4 mr-2" />
          Branch
        </Button>
        <Button variant="outline" size="sm" className="flex-1">
          <History className="w-4 h-4 mr-2" />
          History
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        Automatic versioning with rollback capabilities
      </div>
    </div>
  );
}
