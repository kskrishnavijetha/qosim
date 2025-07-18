
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Settings, Play, Pause, RotateCcw, Download } from 'lucide-react';
import { SimulationModeSelector } from '../simulation/SimulationModeSelector';

interface MobileSimulationControlsProps {
  onUndo: () => void;
  onClear: () => void;
  onExportJSON: () => void;
  onExportQASM: () => void;
  canUndo: boolean;
  simulationMode: any;
  onModeChange: (mode: any) => void;
  cloudConfig: any;
  onCloudConfigChange: (config: any) => void;
  isCloudConfigured: boolean;
}

export function MobileSimulationControls({
  onUndo,
  onClear,
  onExportJSON,
  onExportQASM,
  canUndo,
  simulationMode,
  onModeChange,
  cloudConfig,
  onCloudConfigChange,
  isCloudConfigured
}: MobileSimulationControlsProps) {
  return (
    <div className="flex gap-2 p-3 bg-quantum-matrix border-t border-quantum-neon/20">
      {/* Quick Actions */}
      <Button
        variant="outline"
        size="sm"
        onClick={onUndo}
        disabled={!canUndo}
        className="flex-1"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onClear}
        className="flex-1"
      >
        Clear
      </Button>
      
      {/* Settings Drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1">
            <Settings className="w-4 h-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Simulation Settings</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <SimulationModeSelector
              currentMode={simulationMode}
              onModeChange={onModeChange}
              cloudConfig={cloudConfig}
              onCloudConfigChange={onCloudConfigChange}
              isCloudConfigured={isCloudConfigured}
            />
          </div>
        </DrawerContent>
      </Drawer>
      
      {/* Export Drawer */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm" className="flex-1">
            <Download className="w-4 h-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Export Circuit</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 space-y-3">
            <Button onClick={onExportJSON} className="w-full">
              Export JSON
            </Button>
            <Button onClick={onExportQASM} className="w-full">
              Export QASM
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
