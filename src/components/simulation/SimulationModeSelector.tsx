
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Brain, Cloud, Settings, Key, AlertTriangle } from 'lucide-react';
import { EnhancedSimulationMode } from '@/lib/enhancedQuantumSimulationService';
import { CloudSimulationConfig } from '@/lib/quantumSimulationService';

interface SimulationModeSelectorProps {
  currentMode: EnhancedSimulationMode;
  onModeChange: (mode: EnhancedSimulationMode) => void;
  cloudConfig: CloudSimulationConfig;
  onCloudConfigChange: (config: CloudSimulationConfig) => void;
  isCloudConfigured: boolean;
}

export function SimulationModeSelector({
  currentMode,
  onModeChange,
  cloudConfig,
  onCloudConfigChange,
  isCloudConfigured
}: SimulationModeSelectorProps) {
  const modes = [
    {
      id: 'fast' as EnhancedSimulationMode,
      name: 'Fast Mock',
      icon: Zap,
      description: 'Local simulation with basic quantum operations',
      features: ['Instant results', 'Basic gates', 'No noise model']
    },
    {
      id: 'accurate' as EnhancedSimulationMode,
      name: 'Accurate Local',
      icon: Brain,
      description: 'Enhanced local simulation with entanglement analysis',
      features: ['High precision', 'Entanglement metrics', 'Fidelity tracking']
    },
    {
      id: 'cloud' as EnhancedSimulationMode,
      name: 'IBM Quantum',
      icon: Cloud,
      description: 'Real quantum simulation via IBM Qiskit Runtime',
      features: ['Real backend simulation', 'Noise models', 'Hardware constraints'],
      requiresConfig: true
    },
    {
      id: 'step-by-step' as EnhancedSimulationMode,
      name: 'Debug Mode',
      icon: Settings,
      description: 'Step-by-step execution with pause/resume controls',
      features: ['Breakpoints', 'State inspection', 'Manual stepping']
    }
  ];

  const handleTokenChange = (token: string) => {
    onCloudConfigChange({ ...cloudConfig, ibmqToken: token });
  };

  const handleBackendChange = (backend: string) => {
    onCloudConfigChange({ ...cloudConfig, backend });
  };

  const handleShotsChange = (shots: number) => {
    onCloudConfigChange({ ...cloudConfig, shots });
  };

  const handleNoiseToggle = (useNoisySimulation: boolean) => {
    onCloudConfigChange({ ...cloudConfig, useNoisySimulation });
  };

  const handleModeSelection = async (mode: EnhancedSimulationMode) => {
    console.log('🔄 SimulationModeSelector: Mode selection triggered', mode);
    
    if (currentMode === mode) {
      console.log('🔄 Same mode selected, no change needed');
      return;
    }
    
    if (mode === 'cloud' && !isCloudConfigured) {
      console.log('🔄 Cloud mode selected but not configured');
      return;
    }
    
    console.log('🔄 Calling onModeChange with:', mode);
    await onModeChange(mode);
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Quantum Simulation Backend
          <Badge variant="outline" className="ml-auto text-xs">
            {modes.find(m => m.id === currentMode)?.name || 'Unknown'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={currentMode} onValueChange={handleModeSelection}>
          <TabsList className="grid w-full grid-cols-4 quantum-tabs">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const needsSetup = mode.requiresConfig && !isCloudConfigured;
              
              return (
                <TabsTrigger 
                  key={mode.id} 
                  value={mode.id}
                  className="flex items-center gap-2 data-[state=active]:bg-quantum-glow/20"
                  disabled={needsSetup}
                >
                  <Icon className="w-4 h-4" />
                  {mode.name}
                  {needsSetup && <Badge variant="outline" className="text-xs">Setup Required</Badge>}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {modes.map((mode) => {
            const Icon = mode.icon;
            
            return (
              <TabsContent key={mode.id} value={mode.id} className="mt-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-quantum-matrix rounded-lg">
                    <Icon className="w-6 h-6 text-quantum-neon mt-1" />
                    <div>
                      <h3 className="font-mono text-quantum-neon font-semibold">{mode.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{mode.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {mode.features.map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      {currentMode === mode.id && (
                        <Badge variant="default" className="mt-2 bg-quantum-glow text-black">
                          Currently Active
                        </Badge>
                      )}
                    </div>
                  </div>

                  {mode.id === 'cloud' && (
                    <div className="space-y-4 p-4 border border-quantum-neon/20 rounded-lg">
                      <div className="flex items-center gap-2 text-quantum-particle">
                        <Key className="w-4 h-4" />
                        <Label className="font-mono">IBM Quantum Configuration</Label>
                      </div>

                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                          <div className="text-sm text-yellow-500">
                            <p className="font-medium">Real API Keys Required</p>
                            <p className="text-xs opacity-90 mt-1">
                              To use IBM Quantum or AWS Braket, you need to provide your actual API keys from these services.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ibmq-token" className="text-sm font-mono">
                            IBM Quantum API Token *
                          </Label>
                          <Input
                            id="ibmq-token"
                            type="password"
                            placeholder="Enter your IBM Quantum token..."
                            value={cloudConfig.ibmqToken || ''}
                            onChange={(e) => handleTokenChange(e.target.value)}
                            className="font-mono text-xs"
                          />
                          <p className="text-xs text-muted-foreground">
                            Get your token from{' '}
                            <a 
                              href="https://quantum-computing.ibm.com/account" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-quantum-neon hover:underline"
                            >
                              IBM Quantum Platform
                            </a>
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="backend" className="text-sm font-mono">
                            Backend
                          </Label>
                          <Input
                            id="backend"
                            placeholder="ibmq_qasm_simulator"
                            value={cloudConfig.backend || 'ibmq_qasm_simulator'}
                            onChange={(e) => handleBackendChange(e.target.value)}
                            className="font-mono text-xs"
                          />
                          <p className="text-xs text-muted-foreground">
                            Available backends: ibmq_qasm_simulator, ibm_brisbane, ibm_kyoto
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="shots" className="text-sm font-mono">
                            Shots
                          </Label>
                          <Input
                            id="shots"
                            type="number"
                            placeholder="1024"
                            value={cloudConfig.shots || 1024}
                            onChange={(e) => handleShotsChange(parseInt(e.target.value))}
                            className="font-mono text-xs"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="noise-model"
                            checked={cloudConfig.useNoisySimulation || false}
                            onCheckedChange={handleNoiseToggle}
                          />
                          <Label htmlFor="noise-model" className="text-sm font-mono">
                            Use Hardware Noise Model
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      await handleModeSelection(mode.id);
                    }}
                    disabled={mode.requiresConfig && !isCloudConfigured}
                    className="w-full quantum-button"
                    variant={currentMode === mode.id ? "default" : "secondary"}
                  >
                    {currentMode === mode.id ? 'Currently Active' : 
                     (mode.requiresConfig && !isCloudConfigured) ? 'Enter API Key First' : 
                     `Switch to ${mode.name}`}
                  </Button>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
