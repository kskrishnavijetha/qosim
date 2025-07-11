import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Brain, Cloud, Settings, Key } from 'lucide-react';
import { SimulationMode, CloudSimulationConfig } from '@/lib/quantumSimulationService';

interface SimulationModeSelectorProps {
  currentMode: SimulationMode;
  onModeChange: (mode: SimulationMode) => void;
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
      id: 'fast' as SimulationMode,
      name: 'Fast Mock',
      icon: Zap,
      description: 'Local simulation with basic quantum operations',
      features: ['Instant results', 'Basic gates', 'No noise model']
    },
    {
      id: 'accurate' as SimulationMode,
      name: 'Accurate Local',
      icon: Brain,
      description: 'Enhanced local simulation with entanglement analysis',
      features: ['High precision', 'Entanglement metrics', 'Fidelity tracking']
    },
    {
      id: 'cloud' as SimulationMode,
      name: 'Qiskit Cloud',
      icon: Cloud,
      description: 'Real quantum simulation via IBM Qiskit',
      features: ['Real backend simulation', 'Noise models', 'Hardware constraints'],
      requiresConfig: true
    }
  ];

  const handleTokenChange = (token: string) => {
    console.log('Token changed:', token, 'Length:', token.length);
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

  console.log('SimulationModeSelector render - isCloudConfigured:', isCloudConfigured, 'cloudConfig:', cloudConfig);

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Quantum Simulation Backend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={currentMode} onValueChange={(mode) => onModeChange(mode as SimulationMode)}>
          <TabsList className="grid w-full grid-cols-3 quantum-tabs">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const needsSetup = mode.requiresConfig && !isCloudConfigured;
              
              return (
                <TabsTrigger 
                  key={mode.id} 
                  value={mode.id}
                  className="flex items-center gap-2 data-[state=active]:bg-quantum-glow/20"
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
                    </div>
                  </div>

                  {mode.id === 'cloud' && (
                    <div className="space-y-4 p-4 border border-quantum-neon/20 rounded-lg">
                      <div className="flex items-center gap-2 text-quantum-particle">
                        <Key className="w-4 h-4" />
                        <Label className="font-mono">Cloud Configuration</Label>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="ibmq-token" className="text-sm font-mono">
                            IBMQ API Token
                          </Label>
                          <Input
                            id="ibmq-token"
                            type="password"
                            placeholder="Enter your IBMQ token..."
                            value={cloudConfig.ibmqToken || ''}
                            onChange={(e) => handleTokenChange(e.target.value)}
                            className="font-mono text-xs"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="backend" className="text-sm font-mono">
                            Backend
                          </Label>
                          <Input
                            id="backend"
                            placeholder="aer_simulator"
                            value={cloudConfig.backend || 'aer_simulator'}
                            onChange={(e) => handleBackendChange(e.target.value)}
                            className="font-mono text-xs"
                          />
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
                            Use Noise Model
                          </Label>
                        </div>
                      </div>
                      
                      {!isCloudConfigured && (
                        <div className="text-xs text-muted-foreground font-mono">
                          💡 Get your free IBMQ token at{' '}
                          <a 
                            href="https://quantum-computing.ibm.com/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-quantum-neon hover:underline"
                          >
                            quantum-computing.ibm.com
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={currentMode === mode.id ? undefined : () => onModeChange(mode.id)}
                    disabled={(mode.requiresConfig && !isCloudConfigured) || currentMode === mode.id}
                    className="w-full quantum-button"
                    variant={currentMode === mode.id ? "default" : "secondary"}
                  >
                    {currentMode === mode.id ? 'Currently Active' : 
                     (mode.requiresConfig && !isCloudConfigured) ? 'Configure First' : 
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