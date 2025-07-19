
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Brain, Cloud, Settings, Key, AlertTriangle, Cpu, ExternalLink, CheckCircle } from 'lucide-react';
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
      icon: Cpu,
      description: 'Real quantum simulation via IBM Qiskit Runtime',
      features: ['Real backend simulation', 'Noise models', 'Hardware constraints'],
      requiresConfig: true,
      configType: 'ibm'
    },
    {
      id: 'braket' as EnhancedSimulationMode,
      name: 'AWS Braket',
      icon: Cloud,
      description: 'AWS quantum computing service with multiple providers',
      features: ['IonQ devices', 'Rigetti QPUs', 'AWS simulators'],
      requiresConfig: true,
      configType: 'aws'
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

  const handleAWSKeyChange = (accessKeyId: string) => {
    onCloudConfigChange({ ...cloudConfig, awsAccessKeyId: accessKeyId });
  };

  const handleAWSSecretChange = (secretAccessKey: string) => {
    onCloudConfigChange({ ...cloudConfig, awsSecretAccessKey: secretAccessKey });
  };

  const handleAWSRegionChange = (region: string) => {
    onCloudConfigChange({ ...cloudConfig, awsRegion: region });
  };

  const handleAWSDeviceChange = (device: string) => {
    onCloudConfigChange({ ...cloudConfig, awsDevice: device });
  };

  const isIBMConfigured = () => {
    return cloudConfig.ibmqToken && cloudConfig.ibmqToken.length > 20;
  };

  const isAWSConfigured = () => {
    return cloudConfig.awsAccessKeyId && cloudConfig.awsSecretAccessKey && 
           cloudConfig.awsAccessKeyId.length > 10 && cloudConfig.awsSecretAccessKey.length > 20;
  };

  const isModeConfigured = (mode: any) => {
    if (!mode.requiresConfig) return true;
    if (mode.configType === 'ibm') return isIBMConfigured();
    if (mode.configType === 'aws') return isAWSConfigured();
    return false;
  };

  const handleModeSelection = async (mode: EnhancedSimulationMode) => {
    console.log('🔄 SimulationModeSelector: Mode selection triggered', mode);
    
    if (currentMode === mode) {
      console.log('🔄 Same mode selected, no change needed');
      return;
    }
    
    const selectedMode = modes.find(m => m.id === mode);
    if (selectedMode?.requiresConfig && !isModeConfigured(selectedMode)) {
      console.log('🔄 Mode selected but not configured - API keys needed');
      // Still allow tab selection to show configuration interface
      return;
    }
    
    console.log('🔄 Calling onModeChange with:', mode);
    await onModeChange(mode);
  };

  const getTabStatus = (mode: any) => {
    if (!mode.requiresConfig) return null;
    if (isModeConfigured(mode)) return 'configured';
    return 'setup';
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
        <Tabs defaultValue={currentMode} onValueChange={handleModeSelection}>
          <TabsList className="grid w-full grid-cols-5 quantum-tabs">
            {modes.map((mode) => {
              const Icon = mode.icon;
              const status = getTabStatus(mode);
              
              return (
                <TabsTrigger 
                  key={mode.id} 
                  value={mode.id}
                  className="flex items-center gap-2 data-[state=active]:bg-quantum-glow/20"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{mode.name}</span>
                  {status === 'setup' && (
                    <Badge variant="outline" className="text-xs bg-orange-500/20 text-orange-400 border-orange-500/50 hidden lg:inline">
                      Setup
                    </Badge>
                  )}
                  {status === 'configured' && (
                    <CheckCircle className="w-3 h-3 text-green-500 hidden lg:inline" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {modes.map((mode) => {
            const Icon = mode.icon;
            const isConfigured = isModeConfigured(mode);
            
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

                  {/* API Keys Required Alert */}
                  {mode.requiresConfig && !isConfigured && (
                    <Alert className="border-orange-500/20 bg-orange-500/10">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <AlertDescription className="text-orange-400">
                        <strong>API Keys Required:</strong> Enter your {mode.configType === 'ibm' ? 'IBM Quantum' : 'AWS'} credentials below to activate this backend.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Configuration Successful Alert */}
                  {mode.requiresConfig && isConfigured && (
                    <Alert className="border-green-500/20 bg-green-500/10">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <AlertDescription className="text-green-400">
                        <strong>Ready to Use:</strong> {mode.name} is configured and ready for quantum circuit execution.
                      </AlertDescription>
                    </Alert>
                  )}

                  {mode.id === 'cloud' && (
                    <div className="space-y-4 p-4 border border-quantum-neon/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-quantum-particle">
                          <Key className="w-4 h-4" />
                          <Label className="font-mono">IBM Quantum Configuration</Label>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://quantum-computing.ibm.com/account', '_blank')}
                          className="flex items-center gap-2 text-xs"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Get API Key
                        </Button>
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
                            Minimum 20 characters required for authentication
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
                            Available: ibmq_qasm_simulator, ibm_brisbane, ibm_kyoto
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

                  {mode.id === 'braket' && (
                    <div className="space-y-4 p-4 border border-quantum-neon/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-quantum-particle">
                          <Key className="w-4 h-4" />
                          <Label className="font-mono">AWS Braket Configuration</Label>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://console.aws.amazon.com/iam/home#/security_credentials', '_blank')}
                          className="flex items-center gap-2 text-xs"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Get AWS Keys
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="aws-access-key" className="text-sm font-mono">
                            AWS Access Key ID *
                          </Label>
                          <Input
                            id="aws-access-key"
                            type="password"
                            placeholder="Enter your AWS Access Key ID..."
                            value={cloudConfig.awsAccessKeyId || ''}
                            onChange={(e) => handleAWSKeyChange(e.target.value)}
                            className="font-mono text-xs"
                          />
                          <p className="text-xs text-muted-foreground">
                            Minimum 10 characters required
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="aws-secret-key" className="text-sm font-mono">
                            AWS Secret Access Key *
                          </Label>
                          <Input
                            id="aws-secret-key"
                            type="password"
                            placeholder="Enter your AWS Secret Access Key..."
                            value={cloudConfig.awsSecretAccessKey || ''}
                            onChange={(e) => handleAWSSecretChange(e.target.value)}
                            className="font-mono text-xs"
                          />
                          <p className="text-xs text-muted-foreground">
                            Minimum 20 characters required
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="aws-region" className="text-sm font-mono">
                            Region
                          </Label>
                          <Input
                            id="aws-region"
                            placeholder="us-east-1"
                            value={cloudConfig.awsRegion || 'us-east-1'}
                            onChange={(e) => handleAWSRegionChange(e.target.value)}
                            className="font-mono text-xs"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="aws-device" className="text-sm font-mono">
                            Device
                          </Label>
                          <Input
                            id="aws-device"
                            placeholder="arn:aws:braket:::device/quantum-simulator/amazon/sv1"
                            value={cloudConfig.awsDevice || 'arn:aws:braket:::device/quantum-simulator/amazon/sv1'}
                            onChange={(e) => handleAWSDeviceChange(e.target.value)}
                            className="font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('🔄 Button clicked for mode:', mode.id, 'isConfigured:', isConfigured);
                      if (isConfigured || !mode.requiresConfig) {
                        await handleModeSelection(mode.id);
                      }
                    }}
                    disabled={false}
                    className={`w-full transition-all ${
                      currentMode === mode.id 
                        ? 'bg-quantum-glow text-black hover:bg-quantum-glow/80' 
                        : isConfigured || !mode.requiresConfig
                        ? 'bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border'
                        : 'bg-orange-500/20 text-orange-400 border-orange-500/50 hover:bg-orange-500/30 cursor-pointer'
                    }`}
                    variant={currentMode === mode.id ? "default" : "secondary"}
                  >
                    {currentMode === mode.id ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Currently Active
                      </div>
                    ) : mode.requiresConfig && !isConfigured ? (
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4" />
                        Enter API Keys to Activate
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        Activate {mode.name}
                      </div>
                    )}
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
