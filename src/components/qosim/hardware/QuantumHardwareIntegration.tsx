
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Zap, 
  Settings, 
  Play,
  Pause,
  DollarSign,
  Activity,
  Shield,
  Clock
} from 'lucide-react';

export function QuantumHardwareIntegration() {
  const [selectedProvider, setSelectedProvider] = useState('ibm');
  const [isConnected, setIsConnected] = useState(false);
  const [jobQueue, setJobQueue] = useState([]);

  const providers = {
    ibm: {
      name: 'IBM Quantum',
      status: 'Available',
      qubits: 127,
      cost: '$0.00015/shot',
      latency: '2-5 min',
      fidelity: '99.5%',
      icon: '🔬'
    },
    ionq: {
      name: 'IonQ',
      status: 'Available',
      qubits: 32,
      cost: '$0.001/shot',
      latency: '1-3 min',
      fidelity: '99.8%',
      icon: '⚡'
    },
    rigetti: {
      name: 'Rigetti',
      status: 'Maintenance',
      qubits: 80,
      cost: '$0.0005/shot',
      latency: '30s-2min',
      fidelity: '99.2%',
      icon: '🌐'
    },
    google: {
      name: 'Google Quantum AI',
      status: 'Limited',
      qubits: 70,
      cost: '$0.0008/shot',
      latency: '1-4 min',
      fidelity: '99.6%',
      icon: '🎯'
    }
  };

  const handleConnect = (provider: string) => {
    setSelectedProvider(provider);
    setIsConnected(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-500';
      case 'Limited': return 'bg-yellow-500';
      case 'Maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quantum Hardware Integration</h2>
          <p className="text-muted-foreground">Connect to real quantum computers worldwide</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-gray-400'}`} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </Badge>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(providers).map(([key, provider]) => (
              <Card key={key} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-xl">{provider.icon}</span>
                      {provider.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(provider.status)}`} />
                      <span className="text-sm">{provider.status}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Qubits</div>
                      <div className="font-mono text-lg">{provider.qubits}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Cost</div>
                      <div className="font-mono text-lg">{provider.cost}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Latency</div>
                      <div className="font-mono text-sm">{provider.latency}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Fidelity</div>
                      <div className="font-mono text-sm">{provider.fidelity}</div>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    disabled={provider.status === 'Maintenance'}
                    onClick={() => handleConnect(key)}
                  >
                    <Cloud className="w-4 h-4 mr-2" />
                    {provider.status === 'Maintenance' ? 'Unavailable' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {isConnected && (
            <Card>
              <CardHeader>
                <CardTitle>Connection Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>API Key</Label>
                    <Input type="password" placeholder="Enter your API key" />
                  </div>
                  <div>
                    <Label>Backend</Label>
                    <Input placeholder="Select backend" />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button>
                    <Play className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    Calibrate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Job Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Jobs in Queue</h3>
                <p className="text-muted-foreground mb-4">
                  Submit a quantum circuit to run on real hardware
                </p>
                <Button>
                  <Play className="w-4 h-4 mr-2" />
                  Submit Job
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Bell State Experiment</h4>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Provider:</span> IBM Quantum
                    </div>
                    <div>
                      <span className="text-muted-foreground">Shots:</span> 1024
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fidelity:</span> 99.2%
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cost:</span> $0.15
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Monthly Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$47.82</div>
                <p className="text-sm text-muted-foreground">of $100 budget</p>
                <Progress value={47.82} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Shots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">127,384</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Avg Cost per Shot</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$0.0004</div>
                <p className="text-sm text-muted-foreground">Across all providers</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
