
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Settings } from 'lucide-react';
import { FourDLatticePosition } from './FourDToricCodeSimulator';

interface NoiseInjectionControlsProps {
  noiseLevel: number;
  onNoiseLevelChange: (level: number) => void;
  onInjectError: (errorType: 'bit-flip' | 'phase-flip' | 'depolarizing', position: FourDLatticePosition) => void;
}

export function NoiseInjectionControls({
  noiseLevel,
  onNoiseLevelChange,
  onInjectError
}: NoiseInjectionControlsProps) {
  const [selectedErrorType, setSelectedErrorType] = useState<'bit-flip' | 'phase-flip' | 'depolarizing'>('bit-flip');
  const [targetPosition, setTargetPosition] = useState<FourDLatticePosition>({ x: 0, y: 0, z: 0, t: 0 });
  const [burstErrorCount, setBurstErrorCount] = useState(1);

  const handleManualErrorInjection = () => {
    onInjectError(selectedErrorType, targetPosition);
  };

  const handleBurstErrorInjection = () => {
    for (let i = 0; i < burstErrorCount; i++) {
      const randomPosition: FourDLatticePosition = {
        x: Math.floor(Math.random() * 4),
        y: Math.floor(Math.random() * 4),
        z: Math.floor(Math.random() * 4),
        t: Math.floor(Math.random() * 4)
      };
      onInjectError(selectedErrorType, randomPosition);
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-quantum-energy flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Noise Injection Controls
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Noise Level Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs text-muted-foreground">Global Noise Level</label>
            <Badge variant="outline" className="text-quantum-glow">
              {(noiseLevel * 100).toFixed(1)}%
            </Badge>
          </div>
          <Slider
            value={[noiseLevel]}
            onValueChange={([value]) => onNoiseLevelChange(value)}
            min={0}
            max={1}
            step={0.01}
            className="w-full"
          />
        </div>

        {/* Error Type Selection */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Error Type</label>
          <Select value={selectedErrorType} onValueChange={(value: any) => setSelectedErrorType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bit-flip">Bit Flip (X)</SelectItem>
              <SelectItem value="phase-flip">Phase Flip (Z)</SelectItem>
              <SelectItem value="depolarizing">Depolarizing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Manual Position Input */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Target Position</label>
          <div className="grid grid-cols-4 gap-2">
            <Input
              type="number"
              placeholder="X"
              value={targetPosition.x}
              onChange={(e) => setTargetPosition(prev => ({ ...prev, x: parseInt(e.target.value) || 0 }))}
              className="text-xs"
            />
            <Input
              type="number"
              placeholder="Y"
              value={targetPosition.y}
              onChange={(e) => setTargetPosition(prev => ({ ...prev, y: parseInt(e.target.value) || 0 }))}
              className="text-xs"
            />
            <Input
              type="number"
              placeholder="Z"
              value={targetPosition.z}
              onChange={(e) => setTargetPosition(prev => ({ ...prev, z: parseInt(e.target.value) || 0 }))}
              className="text-xs"
            />
            <Input
              type="number"
              placeholder="T"
              value={targetPosition.t}
              onChange={(e) => setTargetPosition(prev => ({ ...prev, t: parseInt(e.target.value) || 0 }))}
              className="text-xs"
            />
          </div>
        </div>

        {/* Injection Buttons */}
        <div className="space-y-2">
          <Button
            onClick={handleManualErrorInjection}
            className="w-full bg-quantum-energy hover:bg-quantum-energy/80 text-black"
            size="sm"
          >
            <Target className="w-4 h-4 mr-2" />
            Inject Single Error
          </Button>
          
          <div className="flex gap-2">
            <Input
              type="number"
              value={burstErrorCount}
              onChange={(e) => setBurstErrorCount(parseInt(e.target.value) || 1)}
              min={1}
              max={10}
              className="text-xs flex-1"
            />
            <Button
              onClick={handleBurstErrorInjection}
              variant="outline"
              size="sm"
              className="neon-border"
            >
              Burst Inject
            </Button>
          </div>
        </div>

        {/* Preset Noise Patterns */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Quick Presets</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNoiseLevelChange(0.05)}
              className="neon-border text-xs"
            >
              Low (5%)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNoiseLevelChange(0.15)}
              className="neon-border text-xs"
            >
              High (15%)
            </Button>
          </div>
        </div>

        {/* Error Statistics */}
        <div className="text-xs space-y-1 pt-2 border-t border-quantum-glow/20">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expected Errors/Step:</span>
            <span className="text-quantum-glow font-mono">
              {(noiseLevel * 64).toFixed(1)} {/* Assuming 64 qubits */}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
