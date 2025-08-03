
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Cpu, 
  Wifi, 
  WifiOff, 
  Clock, 
  DollarSign, 
  Zap, 
  RefreshCw,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { QuantumDevice } from '@/services/quantumHardwareService';

interface DeviceSelectorProps {
  devices: QuantumDevice[];
  selectedDevice: QuantumDevice | null;
  onDeviceSelect: (device: QuantumDevice) => void;
  onRefreshDevices: () => void;
}

export function DeviceSelector({ 
  devices, 
  selectedDevice, 
  onDeviceSelect, 
  onRefreshDevices 
}: DeviceSelectorProps) {
  const getProviderColor = (provider: string) => {
    const colors = {
      ibm: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
      ionq: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
      rigetti: 'bg-green-500/20 border-green-500/50 text-green-400',
      azure: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
      emulator: 'bg-gray-500/20 border-gray-500/50 text-gray-400'
    };
    return colors[provider as keyof typeof colors] || colors.emulator;
  };

  const getQueueStatus = (queueLength: number) => {
    if (queueLength === 0) return { color: 'text-green-500', text: 'No Queue' };
    if (queueLength < 10) return { color: 'text-yellow-500', text: 'Short Queue' };
    if (queueLength < 50) return { color: 'text-orange-500', text: 'Medium Queue' };
    return { color: 'text-red-500', text: 'Long Queue' };
  };

  const formatCost = (costPerShot: number, shots: number = 1024) => {
    return `$${(costPerShot * shots).toFixed(3)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-mono text-quantum-glow">Available Quantum Devices</h3>
        <Button
          onClick={onRefreshDevices}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Devices
        </Button>
      </div>

      {devices.length === 0 ? (
        <Card className="quantum-panel">
          <CardContent className="p-8 text-center">
            <Cpu className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-mono text-muted-foreground mb-2">No Devices Available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure hardware backends to access quantum devices
            </p>
            <Button variant="outline" onClick={onRefreshDevices}>
              Refresh Devices
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {devices.map((device) => {
            const queueStatus = getQueueStatus(device.queueLength);
            const isSelected = selectedDevice?.id === device.id;
            
            return (
              <Card 
                key={device.id} 
                className={`quantum-panel cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-quantum-glow neon-border-active' : 'hover:neon-border'
                }`}
                onClick={() => onDeviceSelect(device)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-mono text-quantum-neon flex items-center gap-2">
                      {device.isOnline ? (
                        <Wifi className="w-4 h-4 text-green-500" />
                      ) : (
                        <WifiOff className="w-4 h-4 text-red-500" />
                      )}
                      {device.name}
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-quantum-glow" />
                      )}
                    </CardTitle>
                    
                    <Badge className={getProviderColor(device.provider)}>
                      {device.provider.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Device Specs */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-muted-foreground">Qubits</div>
                      <div className="font-mono text-quantum-particle">{device.qubits}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Error Rate</div>
                      <div className="font-mono text-quantum-energy">{(device.errorRate * 100).toFixed(2)}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Coherence</div>
                      <div className="font-mono text-quantum-neon">{device.limitations.coherenceTime}μs</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Cost (1K shots)</div>
                      <div className="font-mono text-quantum-glow">{formatCost(device.cost.perShot)}</div>
                    </div>
                  </div>

                  {/* Queue Status */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Queue Status</span>
                      <span className={queueStatus.color}>{queueStatus.text}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {device.queueLength} jobs ahead
                      </span>
                    </div>
                  </div>

                  {/* Gate Set Preview */}
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Supported Gates</div>
                    <div className="flex flex-wrap gap-1">
                      {device.gateSet.slice(0, 6).map((gate) => (
                        <Badge key={gate} variant="secondary" className="text-xs py-0 px-2">
                          {gate.toUpperCase()}
                        </Badge>
                      ))}
                      {device.gateSet.length > 6 && (
                        <Badge variant="secondary" className="text-xs py-0 px-2">
                          +{device.gateSet.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Device Status */}
                  <div className="flex items-center gap-2 pt-2 border-t border-quantum-neon/20">
                    {device.isOnline ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs">Online</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-500">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-xs">Offline</span>
                      </div>
                    )}
                    
                    <div className="text-xs text-muted-foreground">
                      Last calibrated: {new Date(device.calibrationTime).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
