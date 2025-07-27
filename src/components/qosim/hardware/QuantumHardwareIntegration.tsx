
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Cpu, 
  Zap, 
  DollarSign,
  Clock,
  Target,
  Settings,
  Play,
  Pause,
  AlertCircle
} from 'lucide-react';

export function QuantumHardwareIntegration() {
  const [selectedProvider, setSelectedProvider] = useState('ibm');
  const [apiKeys, setApiKeys] = useState({
    ibm: '',
    ionq: '',
    rigetti: '',
    braket: ''
  });

  const quantumProviders = {
    ibm: {
      name: 'IBM Quantum',
      status: 'connected',
      qubits: 127,
      fidelity: 0.995,
      queueTime: '2 min',
      cost: '$0.01/shot',
      backends: ['ibmq_qasm_simulator', 'ibmq_manila', 'ibmq_jakarta']
    },
    ionq: {
      name: 'IonQ',
      status: 'disconnected',
      qubits: 32,
      fidelity: 0.998,
      queueTime: '5 min',
      cost: '$0.02/shot',
      backends: ['ionq_qpu', 'ionq_simulator']
    },
    rigetti: {
      name: 'Rigetti',
      status: 'maintenance',
      qubits: 80,
      fidelity: 0.992,
      queueTime: '8 min',
      cost: '$0.015/shot',
      backends: ['Aspen-M-3', 'Aspen-11']
    },
    braket: {
      name: 'AWS Braket',
      status: 'connected',
      qubits: 34,
      fidelity: 0.994,
      queueTime: '3 min',
      cost: '$0.008/shot',
      backends: ['SV1', 'TN1', 'dm1']
    }
  };

  const jobHistory = [
    {
      id: 'job_001',
      provider: 'IBM Quantum',
      backend: 'ibmq_manila',
      status: 'completed',
      shots: 1024,
      duration: '45s',
      cost: '$10.24',
      fidelity: 0.993
    },
    {
      id: 'job_002',
      provider: 'IonQ',
      backend: 'ionq_qpu',
      status: 'running',
      shots: 512,
      duration: '1m 23s',
      cost: '$10.24',
      fidelity: null
    },
    {
      id: 'job_003',
      provider: 'AWS Braket',
      backend: 'SV1',
      status: 'queued',
      shots: 2048,
      duration: null,
      cost: '$16.38',
      fidelity: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'disconnected': return 'text-red-400';
      case 'maintenance': return 'text-yellow-400';
      case 'completed': return 'text-green-400';
      case 'running': return 'text-blue-400';
      case 'queued': return 'text-yellow-400';
      case 'failed': return 'text-red-400';
      default: return 'text-quantum-neon';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return '✓';
      case 'disconnected': return '✗';
      case 'maintenance': return '⚠';
      case 'completed': return '✓';
      case 'running': return '▶';
      case 'queued': return '⏳';
      case 'failed': return '✗';
      default: return '?';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hardware Integration Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-quantum-glow">Quantum Hardware Integration</h2>
          <p className="text-quantum-particle">
            Connect to real quantum computers and cloud simulators
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="neon-border">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button variant="outline" className="neon-border">
            <DollarSign className="w-4 h-4 mr-2" />
            Billing
          </Button>
        </div>
      </div>

      {/* Provider Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(quantumProviders).map(([key, provider]) => (
          <Card key={key} className="quantum-panel neon-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-quantum-glow text-lg">
                  {provider.name}
                </CardTitle>
                <Badge variant="outline" className={`neon-border ${getStatusColor(provider.status)}`}>
                  {getStatusIcon(provider.status)} {provider.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-quantum-particle">Qubits:</span>
                  <div className="text-quantum-neon">{provider.qubits}</div>
                </div>
                <div>
                  <span className="text-quantum-particle">Fidelity:</span>
                  <div className="text-quantum-neon">{provider.fidelity}</div>
                </div>
                <div>
                  <span className="text-quantum-particle">Queue:</span>
                  <div className="text-quantum-neon">{provider.queueTime}</div>
                </div>
                <div>
                  <span className="text-quantum-particle">Cost:</span>
                  <div className="text-quantum-neon">{provider.cost}</div>
                </div>
              </div>
              <Button
                size="sm"
                className="w-full neon-border"
                onClick={() => setSelectedProvider(key)}
              >
                {provider.status === 'connected' ? 'Configure' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Interface */}
      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 quantum-tabs">
          <TabsTrigger value="providers" className="quantum-tab">
            <Cloud className="w-4 h-4 mr-2" />
            Providers
          </TabsTrigger>
          <TabsTrigger value="jobs" className="quantum-tab">
            <Cpu className="w-4 h-4 mr-2" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="quantum-tab">
            <Target className="w-4 h-4 mr-2" />
            Monitoring
          </TabsTrigger>
          <TabsTrigger value="optimization" className="quantum-tab">
            <Zap className="w-4 h-4 mr-2" />
            Optimization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-quantum-glow">Provider Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="provider-select">Select Provider</Label>
                  <select
                    id="provider-select"
                    value={selectedProvider}
                    onChange={(e) => setSelectedProvider(e.target.value)}
                    className="quantum-input"
                  >
                    {Object.entries(quantumProviders).map(([key, provider]) => (
                      <option key={key} value={key}>
                        {provider.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKeys[selectedProvider as keyof typeof apiKeys]}
                    onChange={(e) => setApiKeys({
                      ...apiKeys,
                      [selectedProvider]: e.target.value
                    })}
                    className="quantum-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backend-select">Backend</Label>
                  <select
                    id="backend-select"
                    className="quantum-input"
                  >
                    {quantumProviders[selectedProvider as keyof typeof quantumProviders].backends.map((backend) => (
                      <option key={backend} value={backend}>
                        {backend}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button className="neon-border flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                  <Button variant="outline" className="neon-border">
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-quantum-glow">Provider Details</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedProvider && (
                  <div className="space-y-3">
                    <div className="p-3 bg-quantum-matrix/30 rounded">
                      <div className="text-sm font-medium text-quantum-neon mb-2">
                        {quantumProviders[selectedProvider as keyof typeof quantumProviders].name}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Qubits: {quantumProviders[selectedProvider as keyof typeof quantumProviders].qubits}</div>
                        <div>Fidelity: {quantumProviders[selectedProvider as keyof typeof quantumProviders].fidelity}</div>
                        <div>Queue: {quantumProviders[selectedProvider as keyof typeof quantumProviders].queueTime}</div>
                        <div>Cost: {quantumProviders[selectedProvider as keyof typeof quantumProviders].cost}</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm font-medium text-quantum-neon">Available Backends</div>
                      {quantumProviders[selectedProvider as keyof typeof quantumProviders].backends.map((backend) => (
                        <div key={backend} className="flex items-center justify-between p-2 bg-quantum-matrix/20 rounded">
                          <span className="text-quantum-particle text-sm">{backend}</span>
                          <Badge variant="outline" className="neon-border">
                            Available
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Job History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {jobHistory.map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-3 bg-quantum-matrix/30 rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`neon-border ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)} {job.status}
                      </Badge>
                      <div>
                        <div className="text-sm font-medium text-quantum-neon">{job.id}</div>
                        <div className="text-xs text-quantum-particle">
                          {job.provider} • {job.backend} • {job.shots} shots
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-quantum-neon">{job.cost}</div>
                      <div className="text-xs text-quantum-particle">
                        {job.duration || 'Pending'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-quantum-glow">Real-time Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-quantum-particle">System Status</span>
                    <Badge variant="outline" className="neon-border text-green-400">
                      ✓ Operational
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-quantum-particle">Queue Position</span>
                    <span className="text-quantum-neon">#3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-quantum-particle">Estimated Wait</span>
                    <span className="text-quantum-neon">5 min</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-quantum-particle">Current Fidelity</span>
                    <span className="text-quantum-neon">99.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-quantum-glow">Cost Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-quantum-particle">Today's Usage</span>
                    <span className="text-quantum-neon">$45.67</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-quantum-particle">Monthly Budget</span>
                    <span className="text-quantum-neon">$500.00</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-quantum-particle">Remaining</span>
                    <span className="text-quantum-neon">$454.33</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-quantum-particle">Alert Threshold</span>
                    <span className="text-quantum-energy">80%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Hardware Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-quantum-matrix/30 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-quantum-glow" />
                    <span className="font-medium text-quantum-neon">Error Mitigation</span>
                  </div>
                  <p className="text-sm text-quantum-particle mb-3">
                    Automatically applies error correction and noise mitigation techniques
                  </p>
                  <Button size="sm" className="neon-border">
                    Enable Auto-Correction
                  </Button>
                </div>

                <div className="p-4 bg-quantum-matrix/30 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-quantum-glow" />
                    <span className="font-medium text-quantum-neon">Circuit Optimization</span>
                  </div>
                  <p className="text-sm text-quantum-particle mb-3">
                    Optimizes circuits for specific hardware architectures
                  </p>
                  <Button size="sm" className="neon-border">
                    Optimize for Hardware
                  </Button>
                </div>

                <div className="p-4 bg-quantum-matrix/30 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-quantum-glow" />
                    <span className="font-medium text-quantum-neon">Queue Management</span>
                  </div>
                  <p className="text-sm text-quantum-particle mb-3">
                    Intelligent job scheduling and queue optimization
                  </p>
                  <Button size="sm" className="neon-border">
                    Configure Scheduling
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
