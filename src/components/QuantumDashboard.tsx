
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CircuitEditor } from '@/components/circuit/CircuitEditor';
import { SimulatorOutput } from '@/components/simulation/SimulatorOutput';
import { SimulationModeSelector } from '@/components/simulation/SimulationModeSelector';
import { HardwareIntegrationHub } from '@/components/hardware/HardwareIntegrationHub';
import { QuantumBackendConfig } from '@/components/simulation/QuantumBackendConfig';
import { SDKDemoPanel } from '@/components/panels/SDKDemoPanel';
import { useCircuitState } from '@/hooks/useCircuitState';
import { useSimulator } from '@/hooks/useSimulator';
import { useToast } from "@/components/ui/use-toast"
import { type CloudSimulationConfig } from '@/lib/quantumSimulationService';

export default function QuantumDashboard() {
  const { toast } = useToast()
  const {
    circuit,
    addGate,
    removeGate,
    moveGate,
    clearCircuit,
    loadExampleCircuit,
  } = useCircuitState();
  const {
    mode,
    setMode,
    config,
    setConfig,
    isConfigured,
    simulationResult,
    simulateCircuit,
    executionComplete
  } = useSimulator(circuit);

  return (
    <Tabs defaultValue="circuit" className="w-full">
      <TabsList className="grid w-full grid-cols-5 quantum-tabs">
        <TabsTrigger value="circuit">Circuit</TabsTrigger>
        <TabsTrigger value="simulator">Simulator</TabsTrigger>
        <TabsTrigger value="hardware">Hardware</TabsTrigger>
        <TabsTrigger value="config">Config</TabsTrigger>
        <TabsTrigger value="sdk">SDK</TabsTrigger>
      </TabsList>
      <TabsContent value="circuit" className="space-y-6">
        <CircuitEditor
          circuit={circuit}
          addGate={addGate}
          removeGate={removeGate}
          moveGate={moveGate}
          clearCircuit={clearCircuit}
          loadExampleCircuit={loadExampleCircuit}
        />
      </TabsContent>

      <TabsContent value="simulator" className="space-y-6">
        <SimulatorOutput
          simulationResult={simulationResult}
        />

        <SimulationModeSelector
          currentMode={mode}
          onModeChange={async (newMode) => {
            console.log('QuantumDashboard: Mode change requested', newMode);
            setMode(newMode);
            await simulateCircuit(newMode);
          }}
          cloudConfig={config}
          onCloudConfigChange={setConfig}
          isCloudConfigured={isConfigured}
        />
      </TabsContent>

      <TabsContent value="hardware" className="space-y-6">
        <HardwareIntegrationHub
          circuit={circuit}
          simulationResult={simulationResult}
          onExecutionComplete={executionComplete}
        />
      </TabsContent>

      <TabsContent value="config" className="space-y-6">
        <QuantumBackendConfig
          onConfigSave={(newConfig) => {
            console.log('QuantumDashboard: New config saved', newConfig);
            // Simply cast the config as any to avoid type issues for now
            setConfig(newConfig as CloudSimulationConfig);
            toast({
              title: "Configuration Saved",
              description: "Your backend configuration has been updated.",
            })
          }}
        />
      </TabsContent>

      <TabsContent value="sdk" className="space-y-6">
        <SDKDemoPanel />
      </TabsContent>
    </Tabs>
  );
}
