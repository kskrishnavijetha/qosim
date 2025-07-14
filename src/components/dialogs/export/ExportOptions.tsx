import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface ExportOptionsProps {
  projectName: string;
  onProjectNameChange: (name: string) => void;
}

export function ExportOptions({ projectName, onProjectNameChange }: ExportOptionsProps) {
  return (
    <Card className="quantum-panel border-quantum-glow/20">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder="Enter project name"
            className="neon-border"
          />
        </div>
      </CardContent>
    </Card>
  );
}