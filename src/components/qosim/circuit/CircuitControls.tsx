
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ZoomIn, ZoomOut, Move, Trash2 } from 'lucide-react';

interface CircuitControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
  onClear: () => void;
}

export function CircuitControls({ zoom, onZoomChange, onPanChange, onClear }: CircuitControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
        className="text-slate-400 border-slate-400/30"
      >
        <ZoomOut className="w-4 h-4" />
      </Button>
      
      <div className="w-20">
        <Slider
          value={[zoom]}
          onValueChange={([value]) => onZoomChange(value)}
          min={0.5}
          max={2}
          step={0.1}
          className="w-full"
        />
      </div>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => onZoomChange(Math.min(2, zoom + 0.1))}
        className="text-slate-400 border-slate-400/30"
      >
        <ZoomIn className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPanChange({ x: 0, y: 0 })}
        className="text-slate-400 border-slate-400/30"
      >
        <Move className="w-4 h-4" />
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={onClear}
        className="text-red-400 border-red-400/30"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
