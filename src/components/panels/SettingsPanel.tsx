
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings, Cpu, Zap } from 'lucide-react';

export function SettingsPanel() {
  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Simulator Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-quantum-neon">Real-time Simulation</div>
              <div className="text-xs text-quantum-particle">Enable live updates</div>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-quantum-neon">Advanced Mode</div>
              <div className="text-xs text-quantum-particle">Show detailed controls</div>
            </div>
            <Switch />
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Cpu className="w-4 h-4 mr-2" />
              Backend
            </Button>
            <Button size="sm" variant="outline">
              <Zap className="w-4 h-4 mr-2" />
              Performance
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
