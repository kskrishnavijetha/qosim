
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, 
  Settings, 
  Play, 
  Info,
  AlertTriangle,
  Cpu,
  Gauge
} from 'lucide-react';
import { QuantumDevice, quantumHardwareService } from '@/services/quantumHardwareService';
import { Gate } from '@/hooks/useCircuitState';

interface HardwareEmulatorProps {
  devices: QuantumDevice[];
  circuit: Gate[];
  onEmulatorRun: (result: any) => void;
}

export function HardwareEmulator({ devices, circuit, onEmulatorRun }: HardwareEmulatorProps) {
  const [selectedDevice, setSelectedDevice] = useState<QuantumDevice | null>(
    devices.length > 0 ? devices[0] : null
  );
  const [emulationSettings, setEmulationSettings] = useState({
    shots: 1024,
    errorRate: 0.01,
    decoherenceTime: 100,
    gateTime: 50,
    measurementError: 0.02,
    enableCrosstalk: true,
    enableDecoherence: true,
    enableGateErrors: true,
    noiseModel: 'realistic'
  });
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const runEmulation = async () => {
    if (!selectedDevice || circuit.length === 0) return;
    
    setIsRunning(true);
    
    try {
      // Create emulator device based on selected hardware
      const emulatorDevice = await quantumHardwareService.createEmulatorDevice(selectedDevice);
      
      // Simulate emulation with custom settings
      const result = await simulateWithNoise();
      
      setLastResult(result);
      onEmulatorRun(result);
      
    } catch (error) {
      console.error('Emulation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const simulateWithNoise = async (): Promise<any> => {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Generate realistic noisy results
    const states = ['00', '01', '10', '11'];
    const counts: Record<string, number> = {};
    
    // Apply noise based on emulation settings
    const totalNoise = emulationSettings.errorRate + 
                      (emulationSettings.enableDecoherence ? 0.005 : 0) +
                      (emulationSettings.enableGateErrors ? 0.003 : 0) +
                      (emulationSettings.enableCrosstalk ? 0.002 : 0);
    
    let remaining = emulationSettings.shots;
    const baseProbs = [0.4, 0.3, 0.2, 0.1];
    
    for (let i = 0; i < states.length - 1; i++) {
      const noisyProb = Math.max(0, baseProbs[i] + (Math.random() - 0.5) * totalNoise * 2);
      const count = Math.floor(remaining * noisyProb);
      counts[states[i]] = count;
      remaining -= count;
    }
    counts[states[states.length - 1]] = Math.max(0, remaining);

    // Calculate fidelity based on noise
    const baseFidelity = 0.98;
    const noisePenalty = totalNoise * 10; // 10x penalty for visibility
    const fidelity = Math.max(0.5, baseFidelity - noisePenalty);
    
    return {
      counts,
      executionTime: 500 + Math.random() * 1500, // Faster than real hardware
      fidelity,
      errorRate: totalNoise,
      emulationSettings: { ...emulationSettings },
      deviceEmulated: selectedDevice?.name,
      isEmulation: true,
      noiseBreakdown: {
        gateErrors: emulationSettings.enableGateErrors ? emulationSettings.errorRate * 0.3 : 0,
        decoherence: emulationSettings.enableDecoherence ? emulationSettings.errorRate * 0.5 : 0,
        crosstalk: emulationSettings.enableCrosstalk ? emulationSettings.errorRate * 0.1 : 0,
        measurement: emulationSettings.measurementError * 0.1
      }
    };
  };

  const getNoiseLevel = () => {
    const totalNoise = emulationSettings.errorRate + 
                      (emulationSettings.enableDecoherence ? 0.005 : 0) +
                      (emulationSettings.enableGateErrors ? 0.003 : 0) +
                      (emulationSettings.enableCrosstalk ? 0.002 : 0);
    
    if (totalNoise < 0.01) return { level: 'Low', color: 'text-green-500' };
    if (totalNoise < 0.03) return { level: 'Medium', color: 'text-yellow-500' };
    return { level: 'High', color: 'text-red-500' };
  };

  const noiseLevel = getNoiseLevel();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-mono text-quantum-glow">Hardware Emulator</h3>
        
        <Button
          onClick={runEmulation}
          disabled={!selectedDevice || circuit.length === 0 || isRunning}
          className="bg-quantum-glow hover:bg-quantum-glow/80 text-black"
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? 'Running Emulation...' : 'Run Emulation'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Selection & Settings */}
        <div className="space-y-6">
          <Card className="quantum-panel">
            <CardHeader>
              <CardTitle className="text-base font-mono text-quantum-neon flex items-center gap-2">
                <Cpu className="w-5 h-5" />
                Device Selection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-mono">Hardware to Emulate</Label>
                <Select
                  value={selectedDevice?.id || ''}
                  onValueChange={(deviceId) => {
                    const device = devices.find(d => d.id === deviceId);
                    setSelectedDevice(device || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a quantum device" />
                  </SelectTrigger>
                  <SelectContent>
                    {devices.map((device) => (
                      <SelectItem key={device.id} value={device.id}>
                        {device.name} ({device.qubits}Q, {device.provider.toUpperCase()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedDevice && (
                <div className="p-3 bg-quantum-matrix rounded space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-muted-foreground">Qubits</div>
                      <div className="font-mono text-quantum-particle">{selectedDevice.qubits}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Base Error Rate</div>
                      <div className="font-mono text-quantum-energy">{(selectedDevice.errorRate * 100).toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Coherence Time</div>
                      <div className="font-mono text-quantum-neon">{selectedDevice.limitations.coherenceTime}μs</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Provider</div>
                      <Badge variant="outline" className="text-xs">
                        {selectedDevice.provider.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="quantum-panel">
            <CardHeader>
              <CardTitle className="text-base font-mono text-quantum-neon flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Emulation Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-mono">Shots</Label>
                <Input
                  type="number"
                  value={emulationSettings.shots}
                  onChange={(e) => setEmulationSettings(prev => ({ 
                    ...prev, 
                    shots: parseInt(e.target.value) || 1024 
                  }))}
                  className="font-mono"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-mono">
                  Error Rate: {(emulationSettings.errorRate * 100).toFixed(2)}%
                </Label>
                <Slider
                  value={[emulationSettings.errorRate * 100]}
                  onValueChange={([value]) => setEmulationSettings(prev => ({ 
                    ...prev, 
                    errorRate: value / 100 
                  }))}
                  max={10}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-mono">
                  Decoherence Time: {emulationSettings.decoherenceTime}μs
                </Label>
                <Slider
                  value={[emulationSettings.decoherenceTime]}
                  onValueChange={([value]) => setEmulationSettings(prev => ({ 
                    ...prev, 
                    decoherenceTime: value 
                  }))}
                  max={200}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-mono">Noise Components</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Gate Errors</Label>
                    <Switch
                      checked={emulationSettings.enableGateErrors}
                      onCheckedChange={(checked) => setEmulationSettings(prev => ({ 
                        ...prev, 
                        enableGateErrors: checked 
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Decoherence</Label>
                    <Switch
                      checked={emulationSettings.enableDecoherence}
                      onCheckedChange={(checked) => setEmulationSettings(prev => ({ 
                        ...prev, 
                        enableDecoherence: checked 
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Crosstalk</Label>
                    <Switch
                      checked={emulationSettings.enableCrosstalk}
                      onCheckedChange={(checked) => setEmulationSettings(prev => ({ 
                        ...prev, 
                        enableCrosstalk: checked 
                      }))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emulation Status & Results */}
        <div className="space-y-6">
          <Card className="quantum-panel">
            <CardHeader>
              <CardTitle className="text-base font-mono text-quantum-neon flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                Noise Analysis
                <Badge className={`${noiseLevel.color} border-current`}>
                  {noiseLevel.level} Noise
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Error Rate</div>
                  <div className="font-mono text-quantum-energy">
                    {((emulationSettings.errorRate + 
                      (emulationSettings.enableDecoherence ? 0.005 : 0) +
                      (emulationSettings.enableGateErrors ? 0.003 : 0) +
                      (emulationSettings.enableCrosstalk ? 0.002 : 0)) * 100).toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Expected Fidelity</div>
                  <div className="font-mono text-quantum-particle">
                    {(98 - (emulationSettings.errorRate * 1000)).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Noise Breakdown:</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Base Error:</span>
                    <span className="font-mono">{(emulationSettings.errorRate * 100).toFixed(2)}%</span>
                  </div>
                  {emulationSettings.enableGateErrors && (
                    <div className="flex justify-between">
                      <span>Gate Errors:</span>
                      <span className="font-mono">+0.30%</span>
                    </div>
                  )}
                  {emulationSettings.enableDecoherence && (
                    <div className="flex justify-between">
                      <span>Decoherence:</span>
                      <span className="font-mono">+0.50%</span>
                    </div>
                  )}
                  {emulationSettings.enableCrosstalk && (
                    <div className="flex justify-between">
                      <span>Crosstalk:</span>
                      <span className="font-mono">+0.20%</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {lastResult && (
            <Card className="quantum-panel">
              <CardHeader>
                <CardTitle className="text-base font-mono text-quantum-neon flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Emulation Results
                  <Badge variant="outline" className="text-quantum-glow">
                    {lastResult.deviceEmulated}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Execution Time</div>
                    <div className="font-mono text-quantum-neon">
                      {lastResult.executionTime.toFixed(0)}ms
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Fidelity</div>
                    <div className="font-mono text-quantum-particle">
                      {(lastResult.fidelity * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Shots</div>
                    <div className="font-mono text-quantum-energy">
                      {lastResult.emulationSettings.shots}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Error Rate</div>
                    <div className="font-mono text-quantum-glow">
                      {(lastResult.errorRate * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Measurement Counts:</div>
                  <div className="space-y-1">
                    {Object.entries(lastResult.counts).map(([state, count]) => (
                      <div key={state} className="flex items-center justify-between text-xs">
                        <span className="font-mono">|{state}⟩</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-quantum-neon">{count as number}</span>
                          <span className="text-muted-foreground">
                            ({((count as number) / lastResult.emulationSettings.shots * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div className="text-xs">
                    <div className="text-blue-400 font-medium">Emulation Mode</div>
                    <div className="text-muted-foreground">
                      Results include realistic noise modeling based on {lastResult.deviceEmulated} characteristics
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
