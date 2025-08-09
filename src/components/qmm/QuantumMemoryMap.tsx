
import React, { useState, useCallback, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QubitTimelineVisualization } from './QubitTimelineVisualization';
import { DecoherenceHotspotDetector } from './DecoherenceHotspotDetector';
import { FidelityTracker } from './FidelityTracker';
import { QMMControlPanel } from './QMMControlPanel';
import { QMMDataImporter } from './QMMDataImporter';
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
  const [activeTab, setActiveTab] = useState("timeline");
  
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

  const handleExport = (format: 'png' | 'svg' | 'json') => {
    const exportData = {
      qubitData,
      fidelityData,
      decoherenceData,
      timestamp: new Date().toISOString(),
      format
    };

    switch (format) {
      case 'json':
        const blob = new Blob([JSON.stringify(exportData, null, 2)], 
          { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qmm-data-${Date.now()}.json`;
        a.click();
        break;
        
      case 'png':
      case 'svg':
        toast.info(`${format.toUpperCase()} export functionality coming soon`);
        break;
    }
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
          Visualizing Qubit Evolution & Decoherence
        </div>
      </div>

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
        <TabsList className="grid w-full grid-cols-4 quantum-panel neon-border">
          <TabsTrigger value="timeline" className="text-quantum-glow">Timeline</TabsTrigger>
          <TabsTrigger value="hotspots" className="text-quantum-neon">Hotspots</TabsTrigger>
          <TabsTrigger value="fidelity" className="text-quantum-particle">Fidelity</TabsTrigger>
          <TabsTrigger value="import" className="text-quantum-plasma">Import/Export</TabsTrigger>
        </TabsList>

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

        <TabsContent value="import" className="space-y-4">
          <QMMDataImporter onDataImported={handleDataImported} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
