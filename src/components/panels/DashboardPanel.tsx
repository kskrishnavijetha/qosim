
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, Users, FileCode } from 'lucide-react';

export function DashboardPanel() {
  return (
    <div className="flex flex-col h-full bg-quantum-void p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-quantum-glow quantum-float">
            Quantum Dashboard
          </h1>
          <p className="text-quantum-neon font-mono mt-2">
            System overview and performance metrics
          </p>
        </div>
        <Badge variant="outline" className="neon-border text-quantum-glow">
          QOSim v2.0
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="quantum-panel neon-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-quantum-particle">
              Active Circuits
            </CardTitle>
            <Zap className="h-4 w-4 text-quantum-glow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-quantum-glow">24</div>
            <p className="text-xs text-quantum-neon">
              +2 from last session
            </p>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-quantum-particle">
              Simulations Run
            </CardTitle>
            <Activity className="h-4 w-4 text-quantum-glow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-quantum-glow">1,247</div>
            <p className="text-xs text-quantum-neon">
              +180 today
            </p>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-quantum-particle">
              Team Members
            </CardTitle>
            <Users className="h-4 w-4 text-quantum-glow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-quantum-glow">8</div>
            <p className="text-xs text-quantum-neon">
              3 online now
            </p>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-quantum-particle">
              Files Stored
            </CardTitle>
            <FileCode className="h-4 w-4 text-quantum-glow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-quantum-glow">156</div>
            <p className="text-xs text-quantum-neon">
              12.3 MB used
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
