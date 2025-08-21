
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RefreshCw, Settings, Zap } from 'lucide-react';

interface SimulationControlsProps {
  shots: number;
  onShotsChange: (shots: number) => void;
  onRerun: () => void;
  isRerunning: boolean;
  showAdvanced: boolean;
  onToggleAdvanced: () => void;
}

export function SimulationControls({
  shots,
  onShotsChange,
  onRerun,
  isRerunning,
  showAdvanced,
  onToggleAdvanced
}: SimulationControlsProps) {
  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Simulation Controls
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Shots Control */}
          <div className="space-y-2">
            <Label htmlFor="shots" className="text-quantum-particle">
              Number of Shots
            </Label>
            <Input
              id="shots"
              type="number"
              min="1"
              max="100000"
              value={shots}
              onChange={(e) => onShotsChange(Number(e.target.value))}
              className="quantum-panel neon-border"
            />
          </div>

          {/* Advanced View Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="advanced-mode"
              checked={showAdvanced}
              onCheckedChange={onToggleAdvanced}
            />
            <Label htmlFor="advanced-mode" className="text-quantum-particle">
              Advanced View
            </Label>
          </div>

          {/* Rerun Button */}
          <Button
            onClick={onRerun}
            disabled={isRerunning}
            className="quantum-panel neon-border"
          >
            {isRerunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Rerun Simulation
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
