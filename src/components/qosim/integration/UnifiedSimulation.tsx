
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cpu, Play } from 'lucide-react';

interface UnifiedSimulationProps {
  sharedData: any;
  onDataUpdate: (data: any) => void;
}

export function UnifiedSimulation({ sharedData, onDataUpdate }: UnifiedSimulationProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Unified Simulation Engine</div>
        <Badge variant="outline">Ready</Badge>
      </div>

      <div className="text-sm text-muted-foreground">
        Consistent quantum simulation across visual and code-based workflows
      </div>

      <Button className="w-full">
        <Play className="w-4 h-4 mr-2" />
        Run Unified Simulation
      </Button>

      <div className="text-xs text-muted-foreground">
        <Cpu className="w-3 h-3 inline mr-1" />
        High-performance quantum state simulation
      </div>
    </div>
  );
}
