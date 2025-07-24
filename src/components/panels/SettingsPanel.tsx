
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, ChevronRight } from 'lucide-react';

export function SettingsPanel() {
  return (
    <div className="p-6 space-y-6">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl text-quantum-glow flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-quantum-neon">
            Configure your quantum simulation environment and preferences.
          </p>
          <Button>
            Configure Settings <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
