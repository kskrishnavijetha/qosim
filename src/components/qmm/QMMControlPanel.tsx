
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, StepForward, StepBack, RotateCcw, Download, Upload } from 'lucide-react';

interface QMMControlPanelProps {
  isPlaying: boolean;
  currentTime: number;
  maxTime: number;
  playbackSpeed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onTimeChange: (time: number) => void;
  onSpeedChange: (speed: number) => void;
  onExport: (format: 'png' | 'svg' | 'json') => void;
  onImport: (file: File) => void;
}

export function QMMControlPanel({
  isPlaying,
  currentTime,
  maxTime,
  playbackSpeed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onTimeChange,
  onSpeedChange,
  onExport,
  onImport
}: QMMControlPanelProps) {

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow">QMM Control Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onStepBackward}
            className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
          >
            <StepBack className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={isPlaying ? onPause : onPlay}
            className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onStepForward}
            className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
          >
            <StepForward className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 ml-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-quantum-particle">Timeline</span>
              <Badge variant="outline" className="text-quantum-neon text-xs">
                {currentTime.toFixed(2)} / {maxTime.toFixed(2)} μs
              </Badge>
            </div>
            <Slider
              value={[currentTime]}
              max={maxTime}
              step={0.1}
              onValueChange={(value) => onTimeChange(value[0])}
              className="w-full"
            />
          </div>
        </div>

        {/* Playback Speed Control */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-quantum-particle">Playback Speed</span>
            <Badge variant="outline" className="text-quantum-plasma">
              {playbackSpeed}x
            </Badge>
          </div>
          <Slider
            value={[playbackSpeed]}
            min={0.1}
            max={5}
            step={0.1}
            onValueChange={(value) => onSpeedChange(value[0])}
            className="w-full"
          />
        </div>

        {/* Export/Import Controls */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-quantum-glow">Data Management</h4>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('png')}
              className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
            >
              <Download className="w-4 h-4 mr-1" />
              PNG
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('svg')}
              className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
            >
              <Download className="w-4 h-4 mr-1" />
              SVG
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onExport('json')}
              className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
            >
              <Download className="w-4 h-4 mr-1" />
              JSON
            </Button>
          </div>
          
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10 w-full"
            >
              <Upload className="w-4 h-4 mr-1" />
              Import Data
            </Button>
            <input
              type="file"
              accept=".json,.qasm,.py"
              onChange={handleFileInput}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Status Information */}
        <div className="quantum-panel neon-border rounded p-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-quantum-particle">Status:</span>
              <div className="text-quantum-glow">
                {isPlaying ? 'Playing' : 'Paused'}
              </div>
            </div>
            <div>
              <span className="text-quantum-particle">Progress:</span>
              <div className="text-quantum-neon">
                {((currentTime / maxTime) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
