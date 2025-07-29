
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Database, Monitor, Bell } from 'lucide-react';

export function QuantumSettingsPanel() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-quantum-glow" />
        <h1 className="text-2xl font-bold text-quantum-glow">Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="quantum-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-quantum-glow">
              <Database className="w-5 h-5" />
              Simulation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="text-quantum-particle">
            <p>Configure quantum simulation parameters and backend preferences.</p>
            <div className="mt-4 text-sm text-quantum-particle/70">
              Coming soon...
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-quantum-glow">
              <Monitor className="w-5 h-5" />
              Display Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="text-quantum-particle">
            <p>Customize visualization and UI preferences.</p>
            <div className="mt-4 text-sm text-quantum-particle/70">
              Coming soon...
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-quantum-glow">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="text-quantum-particle">
            <p>Manage alerts and notification preferences.</p>
            <div className="mt-4 text-sm text-quantum-particle/70">
              Coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
