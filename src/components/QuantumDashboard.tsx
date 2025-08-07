import React, { useState, useEffect } from 'react';
import { Activity, BookOpen, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { UserProfileDropdown } from './UserProfileDropdown';
import { InteractiveCircuitBuilder } from './circuits/InteractiveCircuitBuilder';
import { CircuitsPanel } from './panels/CircuitsPanel';
import { FilesPanel } from './panels/FilesPanel';
import { JobsPanel } from './panels/JobsPanel';
import { LogsPanel } from './panels/LogsPanel';
import { MemoryPanel } from './panels/MemoryPanel';
import { LearningModeToggle } from './learning/LearningModeToggle';
import { TutorialStepGuide } from './learning/TutorialStepGuide';
import GitHubIntegration from './github/GitHubIntegration';

interface CircuitGate {
  id: string;
  type: string;
  targets: string[];
}

export default function QuantumDashboard() {
  const [circuit, setCircuit] = useState<CircuitGate[]>([]);
  const [showLearningMode, setShowLearningMode] = useState(false);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [memory, setMemory] = useState<{ [key: string]: string }>({});
  const [showGitHubPanel, setShowGitHubPanel] = useState(false);

  const addLog = (log: string) => {
    setLogs((prevLogs) => [...prevLogs, log]);
  };

  const updateMemory = (address: string, value: string) => {
    setMemory((prevMemory) => ({ ...prevMemory, [address]: value }));
  };

  const handleCircuitChange = (newCircuit: CircuitGate[]) => {
    setCircuit(newCircuit);
  };

  return (
    <div className="h-screen bg-quantum-void text-quantum-glow flex flex-col overflow-hidden">
      {/* Header */}
      <div className="quantum-panel border-b border-quantum-matrix p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-8 h-8 text-quantum-glow particle-animation" />
          <h1 className="text-2xl font-bold font-mono">Quantum OS</h1>
          <span className="text-sm text-quantum-neon">v2.0.1</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowGitHubPanel(true)}
            className="border-quantum-matrix hover:bg-quantum-matrix text-quantum-neon"
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLearningMode(!showLearningMode)}
            className="border-quantum-matrix hover:bg-quantum-matrix text-quantum-neon"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {showLearningMode ? 'Exit' : 'Learn'}
          </Button>
          
          <UserProfileDropdown />
        </div>
      </div>

      {/* GitHub Panel Dialog */}
      <Dialog open={showGitHubPanel} onOpenChange={setShowGitHubPanel}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto quantum-panel">
          <DialogHeader>
            <DialogTitle className="text-quantum-glow flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Integration
            </DialogTitle>
          </DialogHeader>
          <GitHubIntegration />
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="flex-grow flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={20}>
            <FilesPanel setActiveFile={setActiveFile} />
            <ResizableHandle className="bg-quantum-matrix" />
            <CircuitsPanel />
          </ResizablePanel>

          <ResizablePanel defaultSize={60} className="flex flex-col">
            <InteractiveCircuitBuilder onCircuitChange={handleCircuitChange} />
          </ResizablePanel>

          <ResizablePanel defaultSize={20}>
            <JobsPanel />
            <ResizableHandle className="bg-quantum-matrix" />
            <LogsPanel logs={logs} />
            <MemoryPanel memory={memory} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
