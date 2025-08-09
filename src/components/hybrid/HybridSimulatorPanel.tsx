
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, Square, StepForward, RotateCcw, Zap, Cpu, Brain } from 'lucide-react';
import { ClassicalLogicPanel } from './ClassicalLogicPanel';
import { QuantumCircuitPanel } from './QuantumCircuitPanel';
import { SignalFlowVisualization } from './SignalFlowVisualization';
import { HybridExecutionEngine } from './HybridExecutionEngine';
import { PerformanceMetricsPanel } from './PerformanceMetricsPanel';
import { EducationalModePanel } from './EducationalModePanel';
import { useHybridSimulation } from '@/hooks/useHybridSimulation';

export function HybridSimulatorPanel() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [educationalMode, setEducationalMode] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null);
  
  const {
    isRunning,
    isPaused,
    currentStep,
    totalSteps,
    classicalState,
    quantumState,
    signalFlow,
    connections,
    metrics,
    educationalContent,
    startSimulation,
    pauseSimulation,
    stopSimulation,
    stepForward,
    reset,
    addConnection,
    removeConnection
  } = useHybridSimulation();

  const handlePlay = () => {
    if (isPaused) {
      startSimulation();
    } else {
      startSimulation();
    }
  };

  const handleConnectionSelect = (connectionId: string) => {
    setSelectedConnection(connectionId);
  };

  return (
    <div className="h-full flex flex-col space-y-4 p-4 bg-quantum-void">
      {/* Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Hybrid Classical-Quantum Simulator
              <Badge variant="outline" className="text-xs text-quantum-energy">
                LIVE
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEducationalMode(!educationalMode)}
                className={`neon-border ${
                  educationalMode ? 'bg-quantum-energy/20 text-quantum-energy' : ''
                }`}
              >
                <Brain className="w-4 h-4 mr-2" />
                Educational Mode
              </Button>
            </div>
          </div>
          
          {/* Control Panel */}
          <div className="flex items-center gap-2 mt-4">
            <Button
              onClick={handlePlay}
              disabled={isRunning && !isPaused}
              className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
            >
              {isRunning && !isPaused ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              onClick={pauseSimulation}
              disabled={!isRunning}
              variant="outline"
              className="neon-border"
            >
              <Pause className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={stepForward}
              disabled={isRunning && !isPaused}
              variant="outline"
              className="neon-border"
            >
              <StepForward className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={stopSimulation}
              variant="outline"
              className="neon-border"
            >
              <Square className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={reset}
              variant="outline"
              className="neon-border"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2 ml-4 text-sm text-quantum-particle">
              <span>Step:</span>
              <Badge variant="outline" className="font-mono">
                {currentStep}/{totalSteps}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="simulator">Hybrid Simulator</TabsTrigger>
            <TabsTrigger value="metrics">Performance</TabsTrigger>
            <TabsTrigger value="educational">Educational</TabsTrigger>
            <TabsTrigger value="export">Export & Share</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulator" className="h-full space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              {/* Classical Logic Panel */}
              <ClassicalLogicPanel
                state={classicalState}
                isRunning={isRunning}
                currentStep={currentStep}
                onConnectionCreate={addConnection}
                onConnectionSelect={handleConnectionSelect}
                selectedConnection={selectedConnection}
              />
              
              {/* Quantum Circuit Panel */}
              <QuantumCircuitPanel
                state={quantumState}
                isRunning={isRunning}
                currentStep={currentStep}
                connections={connections}
                selectedConnection={selectedConnection}
              />
            </div>
            
            {/* Signal Flow Visualization */}
            <SignalFlowVisualization
              signalFlow={signalFlow}
              connections={connections}
              isRunning={isRunning}
              selectedConnection={selectedConnection}
              onConnectionSelect={handleConnectionSelect}
            />
          </TabsContent>
          
          <TabsContent value="metrics" className="h-full">
            <PerformanceMetricsPanel
              metrics={metrics}
              isRunning={isRunning}
              currentStep={currentStep}
            />
          </TabsContent>
          
          <TabsContent value="educational" className="h-full">
            <EducationalModePanel
              content={educationalContent}
              currentStep={currentStep}
              isActive={educationalMode}
              onToggle={setEducationalMode}
            />
          </TabsContent>
          
          <TabsContent value="export" className="h-full">
            <div className="text-center text-quantum-particle">
              Export and sharing features coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
