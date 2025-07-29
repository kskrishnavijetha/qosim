import React, { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { QuantumSidebar } from './components/QuantumSidebar';
import { CircuitsPanel } from './components/panels/CircuitsPanel';
import { QuantumAlgorithmsPanel } from './components/algorithms/QuantumAlgorithmsPanel';
import { SDKDemoPanel } from './components/panels/SDKDemoPanel';
import { QuantumResultsDisplay } from './components/quantum/QuantumResultsDisplay';
import { useCircuitState, Gate } from './hooks/useCircuitState';
import { useQuantumBackend } from './hooks/useQuantumBackend';
import { useCircuitSharing } from './hooks/useCircuitSharing';
import { MemoryPanel } from './components/panels/MemoryPanel';
import { JobsPanel } from './components/panels/JobsPanel';
import { FilesPanel } from './components/panels/FilesPanel';
import { QuantumTestSuite } from './components/testing/QuantumTestSuite';
import { LogsPanel } from './components/panels/LogsPanel';
import { QuantumAlgorithmsSDK } from './components/quantum-algorithms-sdk/QuantumAlgorithmsSDK';
import { QuantumSettingsPanel } from './components/settings/QuantumSettingsPanel';
import { QuantumHelpPanel } from './components/help/QuantumHelpPanel';

export default function App() {
  const {
    circuit,
    setCircuit,
    simulationResult,
    simulateQuantumState
  } = useCircuitState();

  const {
    isExecuting,
    lastResult,
    executeCircuit
  } = useQuantumBackend();

  const {
    saveCircuit,
    loadCircuit
  } = useCircuitSharing();

  const [currentPanel, setCurrentPanel] = useState('circuits');
  const [isSDKActive, setIsSDKActive] = useState(false);

  const handleCircuitSave = useCallback(async () => {
    // Convert Gate[] to QuantumCircuit format
    const quantumCircuit = {
      id: nanoid(),
      name: 'Saved Circuit',
      description: 'Circuit saved from builder',
      qubits: Array.from({ length: 5 }, (_, i) => ({
        id: nanoid(),
        index: i,
        name: `q${i}`,
        state: 'computational' as const
      })),
      gates: circuit.map(gate => ({
        id: gate.id,
        type: gate.type,
        qubits: gate.qubits || [gate.qubit?.toString() || '0'],
        position: { x: gate.position * 100, y: (gate.qubit || 0) * 50 },
        layer: gate.position,
        params: gate.params ? { angle: gate.angle } : undefined,
        metadata: {
          label: gate.type,
          angle: gate.angle
        }
      })),
      layers: [],
      depth: Math.max(...circuit.map(g => g.position)) + 1,
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: '1.0.0'
      }
    };
    await saveCircuit(quantumCircuit);
  }, [circuit, saveCircuit]);

  const handleCircuitLoad = useCallback(async () => {
    const loadedCircuit = await loadCircuit();
    if (loadedCircuit && loadedCircuit.gates) {
      // Convert QuantumCircuit back to Gate[] format
      const gates = loadedCircuit.gates.map(gate => ({
        id: gate.id,
        type: gate.type,
        qubit: gate.qubits[0] ? parseInt(gate.qubits[0]) : 0,
        qubits: gate.qubits.map(q => parseInt(q)),
        position: gate.layer,
        angle: gate.params?.angle || gate.metadata?.angle
      }));
      setCircuit(gates);
      simulateQuantumState(gates);
    }
  }, [loadCircuit, setCircuit, simulateQuantumState]);

  const handleAlgorithmExecuted = useCallback((result: any) => {
    console.log('Algorithm executed:', result);
    // Handle algorithm execution result (display, etc.)
  }, []);

  const handleSDKToggle = useCallback(() => {
    setIsSDKActive(!isSDKActive);
    if (!isSDKActive) {
      setCurrentPanel('sdk');
    }
  }, [isSDKActive]);

  const handleSDKCircuitGenerated = useCallback((gates: any[]) => {
    // Convert SDK gates to circuit state format
    const convertedGates = gates.map(gate => ({
      ...gate,
      id: gate.id || nanoid(),
      type: gate.type,
      qubit: gate.qubit,
      qubits: gate.qubits,
      position: gate.position || 0,
      angle: gate.angle
    }));

    // Update circuit state
    setCircuit(convertedGates);
    simulateQuantumState(convertedGates);
    
    // Switch to circuits panel to show result
    setCurrentPanel('circuits');
    setIsSDKActive(false);
  }, [setCircuit, simulateQuantumState]);

  const handleSDKCodeExported = useCallback((code: string, format: string) => {
    console.log(`SDK Code exported in ${format} format:`, code);
    // Handle code export (save to file, etc.)
  }, []);

  return (
    <div className="min-h-screen bg-quantum-void text-quantum-neon">
      <div className="flex h-screen">
        <QuantumSidebar
          currentPanel={currentPanel}
          onPanelChange={setCurrentPanel}
          isSDKActive={isSDKActive}
          onSDKToggle={handleSDKToggle}
        />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-hidden">
            {isSDKActive ? (
              <QuantumAlgorithmsSDK
                onCircuitGenerated={handleSDKCircuitGenerated}
                onCodeExported={handleSDKCodeExported}
                currentCircuit={circuit}
              />
            ) : (
              <>
                {currentPanel === 'circuits' && (
                  <CircuitsPanel />
                )}
                {currentPanel === 'sdk' && (
                  <SDKDemoPanel />
                )}
                {currentPanel === 'algorithms' && (
                  <QuantumAlgorithmsPanel
                    onCircuitGenerated={setCircuit}
                    onAlgorithmExecuted={handleAlgorithmExecuted}
                  />
                )}
                {currentPanel === 'memory' && (
                  <MemoryPanel />
                )}
                {currentPanel === 'logs' && (
                  <LogsPanel />
                )}
                {currentPanel === 'jobs' && (
                  <JobsPanel />
                )}
                {currentPanel === 'files' && (
                  <FilesPanel />
                )}
                {currentPanel === 'testing' && (
                  <QuantumTestSuite 
                    circuit={circuit}
                    onCircuitLoad={handleCircuitLoad}
                  />
                )}
                {currentPanel === 'settings' && (
                  <QuantumSettingsPanel />
                )}
                {currentPanel === 'help' && (
                  <QuantumHelpPanel />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
