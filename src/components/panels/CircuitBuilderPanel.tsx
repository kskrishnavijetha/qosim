
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Plus, Save } from 'lucide-react';

export function CircuitBuilderPanel() {
  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Circuit Builder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Circuit
            </Button>
            <Button size="sm" variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
          <div className="text-sm text-quantum-particle">
            Build quantum circuits with drag-and-drop interface
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
