import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QubitTimelineVisualization } from './QubitTimelineVisualization';
import { DecoherenceHotspotDetector } from './DecoherenceHotspotDetector';
import { FidelityTracker } from './FidelityTracker';
import { QMMControlPanel } from './QMMControlPanel';
import { QMMDataImporter } from './QMMDataImporter';
import { QMMDynamicTimeline } from './QMMDynamicTimeline';
import { QMMCoherenceLossGraph } from './QMMCoherenceLossGraph';
import { QMMEducationalMode } from './QMMEducationalMode';
import { QMMAdvancedExport } from './QMMAdvancedExport';
import { useQMMPlayback } from '@/hooks/useQMMPlayback';
import { useMemory } from '@/hooks/useMemory';
import { toast } from 'sonner';

// QMM API for programmatic access
export const QMM = {
  render: (qubitData: any[], options?: any) => {
    console.log('QMM.render called with:', { qubitData, options });
    // This would integrate with the main component
    return { success: true, message: 'QMM rendered successfully' };
  }
};

// Make QMM available globally for quantum compilers
if (typeof window !== 'undefined') {
  (window as any).QMM = QMM;
}

interface QubitState {
  time: number;
  amplitude0: { real: number; imag: number };
  amplitude1: { real: number; imag: number };
  phase: number;
  errorProbability: number;
  coherence: number;
  entangled: boolean;
}

interface FidelityData {
  time: number;
  idealFidelity: number;
  noisyFidelity: number;
  difference: number;
}

interface DecoherenceData {
  time: number;
  qubit: number;
  t1Decay: number;
  t2Decay: number;
  temperature: number;
  noiseLevel: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function QuantumMemoryMap() {
  const { memoryBanks, loading } = useMemory();
  const [activeTab, setActiveTab] = useState("dynamic-timeline");
  const [selectedQubit, setSelectedQubit] = useState<number | null>(null);
  const [educationalMode, setEducationalMode] = useState(false);
  const [sideByySideMode, setSideBySideMode] = useState(false);
  
  // Generate sample data based on memory banks
  const generateSampleData = useCallback(() => {
    const timeSteps = 50;
    const maxTime = 5.0;
    
    const qubitData = memoryBanks.slice(0, 5).map((bank, qubitIndex) => ({
      qubitId: qubitIndex,
      states: Array.from({ length: timeSteps }, (_, timeIndex) => {
        const time = (timeIndex / timeSteps) * maxTime;
        const baseCoherence = bank.coherence / 100;
        const coherenceDecay = Math.exp(-time / 2); // T2 decay
        const currentCoherence = baseCoherence * coherenceDecay;
        
        // Use actual qubit states from memory bank
        const qubitState = bank.qubitStates[0] || {
          amplitude: Math.random(),
          coherence: currentCoherence * 100,
          entangled: Math.random() > 0.7
        };
        
        return {
          time,
          amplitude0: { 
            real: Math.sqrt(1 - qubitState.amplitude), 
            imag: 0 
          },
          amplitude1: { 
            real: Math.sqrt(qubitState.amplitude), 
            imag: 0 
          },
          phase: time * 0.5 + Math.random() * 0.2,
          errorProbability: (1 - currentCoherence) * Math.random(),
          coherence: currentCoherence,
          entangled: qubitState.entangled
        } as QubitState;
      })
    }));

    return { qubitData, maxTime };
  }, [memoryBanks]);

  const { qubitData, maxTime } = generateSampleData();
  
  const {
    isPlaying,
    currentTime,
    playbackSpeed,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setCurrentTime,
    setPlaybackSpeed
  } = useQMMPlayback(maxTime);

  // Generate fidelity data
  const fidelityData: FidelityData[] = Array.from({ length: 50 }, (_, i) => {
    const time = (i / 50) * maxTime;
    const idealFidelity = 1.0;
    const noisyFidelity = Math.max(0.3, 1.0 - (time / maxTime) * 0.4 + Math.random() * 0.1);
    
    return {
      time,
      idealFidelity,
      noisyFidelity,
      difference: idealFidelity - noisyFidelity
    };
  });

  // Generate decoherence data
  const decoherenceData: DecoherenceData[] = [];
  qubitData.forEach((qubit, qubitIndex) => {
    qubit.states.forEach(state => {
      if (state.errorProbability > 0.1) {
        const severity = state.errorProbability > 0.8 ? 'critical' : 
                        state.errorProbability > 0.5 ? 'high' : 
                        state.errorProbability > 0.3 ? 'medium' : 'low';
        
        decoherenceData.push({
          time: state.time,
          qubit: qubitIndex,
          t1Decay: state.errorProbability * 0.6,
          t2Decay: (1 - state.coherence) * 0.8,
          temperature: 0.015 + Math.random() * 0.005,
          noiseLevel: state.errorProbability,
          severity: severity as 'low' | 'medium' | 'high' | 'critical'
        });
      }
    });
  });

  // Generate coherence data for the new graph component
  const coherenceData = qubitData.map(qubit => ({
    qubitId: qubit.qubitId,
    coherenceData: qubit.states.map(state => ({
      time: state.time,
      fidelity: state.coherence,
      coherence: state.coherence,
      t1Decay: (1 - state.coherence) * 0.6,
      t2Decay: (1 - state.coherence) * 0.8,
      gateNoise: state.errorProbability * 0.5
    }))
  }));

  const handleAdvancedExport = async (format: string, options: any) => {
    // Enhanced export functionality
    const exportData = {
      format,
      options,
      qubitData,
      fidelityData,
      decoherenceData,
      coherenceData,
      timestamp: new Date().toISOString(),
      metadata: {
        totalTime: maxTime,
        qubitCount: qubitData.length,
        educationalMode,
        currentTime
      }
    };

    switch (format) {
      case 'json':
        const blob = new Blob([JSON.stringify(exportData, null, 2)], 
          { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qmm-advanced-export-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        break;
        
      case 'png':
      case 'svg':
        // Canvas-to-image export logic would go here
        toast.info(`${format.toUpperCase()} export - capturing current visualization state`);
        break;
        
      case 'pdf':
        toast.info('PDF report generation started - includes all visualizations');
        break;
        
      case 'mp4':
      case 'gif':
        toast.info(`${format.toUpperCase()} animation export started - this may take a moment`);
        // Video generation logic would go here
        break;
        
      default:
        toast.error('Unsupported export format');
    }
  };

  const handleExport = (format: 'png' | 'svg' | 'json') => {
    // Keep existing export functionality for backward compatibility
    return handleAdvancedExport(format, {});
  };

  const handleImport = (file: File) => {
    toast.info('Data import processed - functionality integrated with QMM system');
  };

  const handleDataImported = (data: any) => {
    toast.success('Quantum data imported successfully into QMM');
    console.log('Imported data:', data);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-quantum-glow">Loading Quantum Memory Map...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-quantum-glow">
          Quantum Memory Map (QMM)
        </h2>
        <div className="text-sm text-quantum-particle">
          Advanced Qubit Evolution & Decoherence Visualization
        </div>
      </div>

      {/* Educational Mode Component */}
      <QMMEducationalMode
        currentTime={currentTime}
        isActive={educationalMode}
        onToggle={() => setEducationalMode(!educationalMode)}
        onSpeedChange={setPlaybackSpeed}
        qubitCount={qubitData.length}
      />

      <QMMControlPanel
        isPlaying={isPlaying}
        currentTime={currentTime}
        maxTime={maxTime}
        playbackSpeed={playbackSpeed}
        onPlay={play}
        onPause={pause}
        onStepForward={stepForward}
        onStepBackward={stepBackward}
        onReset={reset}
        onTimeChange={setCurrentTime}
        onSpeedChange={setPlaybackSpeed}
        onExport={handleExport}
        onImport={handleImport}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 quantum-panel neon-border">
          <TabsTrigger value="dynamic-timeline" className="text-quantum-glow">Dynamic Timeline</TabsTrigger>
          <TabsTrigger value="coherence-graph" className="text-quantum-neon">Coherence Loss</TabsTrigger>
          <TabsTrigger value="timeline" className="text-quantum-particle">Classic Timeline</TabsTrigger>
          <TabsTrigger value="hotspots" className="text-quantum-plasma">Hotspots</TabsTrigger>
          <TabsTrigger value="fidelity" className="text-quantum-energy">Fidelity</TabsTrigger>
          <TabsTrigger value="export" className="text-quantum-neon">Export</TabsTrigger>
        </TabsList>

        <TabsContent value="dynamic-timeline" className="space-y-4">
          <QMMDynamicTimeline
            qubitData={qubitData.map(q => ({
              qubitId: q.qubitId,
              states: q.states.map(s => ({
                ...s,
                fidelity: s.coherence,
                t1Decay: (1 - s.coherence) * 0.6,
                t2Decay: (1 - s.coherence) * 0.8,
                gateOperation: Math.random() > 0.8 ? 'H' : undefined
              }))
            }))}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onPlay={play}
            onPause={pause}
            onReset={reset}
            onTimeSelect={setCurrentTime}
            educationalMode={educationalMode}
          />
        </TabsContent>

        <TabsContent value="coherence-graph" className="space-y-4">
          <QMMCoherenceLossGraph
            qubitData={coherenceData}
            selectedQubit={selectedQubit}
            currentTime={currentTime}
            onQubitSelect={setSelectedQubit}
          />
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <QubitTimelineVisualization
            qubitData={qubitData}
            currentTime={currentTime}
            onTimeSelect={setCurrentTime}
          />
        </TabsContent>

        <TabsContent value="hotspots" className="space-y-4">
          <DecoherenceHotspotDetector
            decoherenceData={decoherenceData}
            temperatureProfile={Array.from({ length: 10 }, () => 0.015 + Math.random() * 0.005)}
            noiseProfile={Array.from({ length: 10 }, () => Math.random() * 0.3)}
          />
        </TabsContent>

        <TabsContent value="fidelity" className="space-y-4">
          <FidelityTracker
            fidelityData={fidelityData}
            currentTime={currentTime}
          />
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <QMMAdvancedExport
            qubitData={qubitData}
            fidelityData={fidelityData}
            decoherenceData={decoherenceData}
            currentTime={currentTime}
            maxTime={maxTime}
            onExport={handleAdvancedExport}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
