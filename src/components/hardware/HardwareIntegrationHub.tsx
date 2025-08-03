
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Cpu, 
  Cloud, 
  Zap, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Settings,
  Play,
  Pause,
  X,
  RefreshCw,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { quantumHardwareService, QuantumDevice, HardwareJob } from '@/services/quantumHardwareService';
import { HardwareBackendManager } from './HardwareBackendManager';
import { DeviceSelector } from './DeviceSelector';
import { JobMonitor } from './JobMonitor';
import { ResultComparison } from './ResultComparison';
import { CostTracker } from './CostTracker';
import { HardwareEmulator } from './HardwareEmulator';
import { Gate } from '@/hooks/useCircuitState';

interface HardwareIntegrationHubProps {
  circuit: Gate[];
  simulationResult?: any;
  onExecutionComplete?: (result: any) => void;
}

export function HardwareIntegrationHub({ 
  circuit, 
  simulationResult, 
  onExecutionComplete 
}: HardwareIntegrationHubProps) {
  const [devices, setDevices] = useState<QuantumDevice[]>([]);
  const [jobs, setJobs] = useState<HardwareJob[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<QuantumDevice | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [usage, setUsage] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('devices');

  useEffect(() => {
    loadDevices();
    loadJobs();
    loadUsage();
    
    // Set up polling for job updates
    const interval = setInterval(() => {
      loadJobs();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadDevices = async () => {
    try {
      const availableDevices = await quantumHardwareService.getAvailableDevices();
      setDevices(availableDevices);
      
      if (availableDevices.length > 0 && !selectedDevice) {
        setSelectedDevice(availableDevices[0]);
      }
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  };

  const loadJobs = async () => {
    try {
      const userJobs = await quantumHardwareService.getUserJobs();
      setJobs(userJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    }
  };

  const loadUsage = async () => {
    try {
      const userUsage = await quantumHardwareService.getUserUsage();
      setUsage(userUsage);
    } catch (error) {
      console.error('Failed to load usage:', error);
    }
  };

  const executeOnHardware = async (shots: number = 1024) => {
    if (!selectedDevice || !circuit.length) return;
    
    setIsExecuting(true);
    try {
      const jobId = await quantumHardwareService.submitJob(
        selectedDevice.id,
        { gates: circuit, name: 'Hardware Execution' },
        { shots }
      );
      
      await loadJobs();
      setActiveTab('monitor');
    } catch (error) {
      console.error('Failed to execute on hardware:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleJobComplete = (job: HardwareJob) => {
    if (job.results && onExecutionComplete) {
      onExecutionComplete({
        ...job.results,
        jobInfo: {
          id: job.id,
          device: job.device,
          provider: job.provider,
          cost: job.cost.actual
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Quantum Hardware Integration
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {selectedDevice && (
                <Badge variant="outline" className="text-quantum-particle">
                  {selectedDevice.name} ({selectedDevice.qubits}Q)
                </Badge>
              )}
              
              <Button
                onClick={() => executeOnHardware(1024)}
                disabled={!selectedDevice || !circuit.length || isExecuting}
                className="bg-quantum-glow hover:bg-quantum-glow/80 text-black"
              >
                <Play className="w-4 h-4 mr-2" />
                {isExecuting ? 'Executing...' : 'Execute on Hardware'}
              </Button>
            </div>
          </div>
          
          {usage && (
            <div className="grid grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-mono text-quantum-neon">{usage.monthlyJobs}</div>
                <div className="text-xs text-muted-foreground">Jobs This Month</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono text-quantum-energy">${usage.monthlyCost.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Monthly Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono text-quantum-particle">{usage.totalJobs}</div>
                <div className="text-xs text-muted-foreground">Total Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono text-quantum-glow">${usage.totalCost.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">Total Cost</div>
              </div>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Main Integration Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 quantum-tabs">
          <TabsTrigger value="backends" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Backends
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="monitor" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Jobs ({jobs.filter(j => j.status !== 'completed' && j.status !== 'failed').length})
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="costs" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Costs
          </TabsTrigger>
          <TabsTrigger value="emulator" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Emulator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="backends">
          <HardwareBackendManager
            backends={[]}
            onBackendSave={(backend) => {
              console.log('Backend saved:', backend);
              loadDevices();
            }}
          />
        </TabsContent>

        <TabsContent value="devices">
          <DeviceSelector
            devices={devices}
            selectedDevice={selectedDevice}
            onDeviceSelect={setSelectedDevice}
            onRefreshDevices={loadDevices}
          />
        </TabsContent>

        <TabsContent value="monitor">
          <JobMonitor
            jobs={jobs}
            onJobCancel={(jobId) => quantumHardwareService.cancelJob(jobId)}
            onJobComplete={handleJobComplete}
            onRefresh={loadJobs}
          />
        </TabsContent>

        <TabsContent value="results">
          <ResultComparison
            simulationResult={simulationResult}
            hardwareJobs={jobs.filter(j => j.status === 'completed')}
          />
        </TabsContent>

        <TabsContent value="costs">
          <CostTracker
            usage={usage}
            jobs={jobs}
          />
        </TabsContent>

        <TabsContent value="emulator">
          <HardwareEmulator
            devices={devices}
            circuit={circuit}
            onEmulatorRun={(result) => {
              console.log('Emulator result:', result);
              if (onExecutionComplete) {
                onExecutionComplete(result);
              }
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
