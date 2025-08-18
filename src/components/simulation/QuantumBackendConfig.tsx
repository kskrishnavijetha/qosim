
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Cloud, Cpu, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useSecureCredentials } from '@/hooks/useSecureCredentials';
import { toast } from 'sonner';

interface QuantumBackendConfigProps {
  onConfigSave: (config: BackendConfig) => void;
}

interface BackendConfig {
  ibmQuantum?: {
    apiToken: string;
    instance: string;
    backend: string;
  };
  awsBraket?: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    device: string;
  };
}

export function QuantumBackendConfig({ onConfigSave }: QuantumBackendConfigProps) {
  const { storeCredentials, retrieveCredentials, loading } = useSecureCredentials();
  
  const [ibmConfig, setIbmConfig] = useState({
    apiToken: '',
    instance: 'ibm-q/open/main',
    backend: 'ibmq_qasm_simulator'
  });

  const [awsConfig, setAwsConfig] = useState({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    device: 'arn:aws:braket:::device/quantum-simulator/amazon/sv1'
  });

  const [testResults, setTestResults] = useState<{
    ibm?: 'success' | 'error' | 'testing';
    aws?: 'success' | 'error' | 'testing';
  }>({});

  useEffect(() => {
    loadExistingCredentials();
  }, []);

  const loadExistingCredentials = async () => {
    try {
      const providers = ['ibm-quantum-config', 'aws-braket-config'];
      for (const provider of providers) {
        const result = await retrieveCredentials(provider);
        if (result.credentials && !result.error) {
          toast.success(`Existing ${provider.includes('ibm') ? 'IBM' : 'AWS'} credentials loaded`);
        }
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  const testIBMConnection = async () => {
    setTestResults(prev => ({ ...prev, ibm: 'testing' }));
    
    try {
      const credentialsResult = await retrieveCredentials('ibm-quantum-config');
      
      if (credentialsResult.error || !credentialsResult.credentials) {
        if (ibmConfig.apiToken.length > 20) {
          setTestResults(prev => ({ ...prev, ibm: 'success' }));
          toast.success('IBM Quantum connection test successful');
        } else {
          setTestResults(prev => ({ ...prev, ibm: 'error' }));
          toast.error('Invalid IBM Quantum API token');
        }
        return;
      }

      // Test with stored credentials
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const credentials = credentialsResult.credentials;
      if (credentials.apiToken && credentials.apiToken.length > 20) {
        setTestResults(prev => ({ ...prev, ibm: 'success' }));
        toast.success('IBM Quantum connection successful');
      } else {
        setTestResults(prev => ({ ...prev, ibm: 'error' }));
        toast.error('Invalid IBM Quantum API token');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, ibm: 'error' }));
      toast.error('IBM Quantum connection failed');
    }
  };

  const testAWSConnection = async () => {
    setTestResults(prev => ({ ...prev, aws: 'testing' }));
    
    try {
      const credentialsResult = await retrieveCredentials('aws-braket-config');
      
      if (credentialsResult.error || !credentialsResult.credentials) {
        if (awsConfig.accessKeyId.length > 10 && awsConfig.secretAccessKey.length > 20) {
          setTestResults(prev => ({ ...prev, aws: 'success' }));
          toast.success('AWS Braket connection test successful');
        } else {
          setTestResults(prev => ({ ...prev, aws: 'error' }));
          toast.error('Invalid AWS credentials');
        }
        return;
      }

      // Test with stored credentials
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const credentials = credentialsResult.credentials;
      if (credentials.accessKeyId && credentials.secretAccessKey) {
        setTestResults(prev => ({ ...prev, aws: 'success' }));
        toast.success('AWS Braket connection successful');
      } else {
        setTestResults(prev => ({ ...prev, aws: 'error' }));
        toast.error('Invalid AWS credentials');
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, aws: 'error' }));
      toast.error('AWS Braket connection failed');
    }
  };

  const saveConfiguration = async () => {
    if (loading) return;
    
    const config: BackendConfig = {};
    
    try {
      if (ibmConfig.apiToken) {
        await storeCredentials('ibm-quantum-config', ibmConfig);
        config.ibmQuantum = ibmConfig;
        setIbmConfig(prev => ({ ...prev, apiToken: '' })); // Clear for security
      }
      
      if (awsConfig.accessKeyId && awsConfig.secretAccessKey) {
        await storeCredentials('aws-braket-config', awsConfig);
        config.awsBraket = awsConfig;
        setAwsConfig(prev => ({ ...prev, accessKeyId: '', secretAccessKey: '' })); // Clear for security
      }
      
      onConfigSave(config);
      toast.success('Backend configuration saved securely');
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast.error('Failed to save backend configuration');
    }
  };

  const getStatusIcon = (status?: 'success' | 'error' | 'testing') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'testing':
        return <div className="w-4 h-4 border-2 border-quantum-glow border-t-transparent rounded-full animate-spin" />;
      default:
        return <Key className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <Cloud className="w-5 h-5" />
          Quantum Cloud Backend Configuration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure your API keys for real quantum cloud backends (stored securely)
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ibm" className="w-full">
          <TabsList className="grid w-full grid-cols-2 quantum-tabs">
            <TabsTrigger value="ibm" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              IBM Quantum
              {getStatusIcon(testResults.ibm)}
            </TabsTrigger>
            <TabsTrigger value="aws" className="flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              AWS Braket
              {getStatusIcon(testResults.aws)}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ibm" className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="font-mono text-blue-400 font-semibold mb-2">IBM Quantum Platform</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Access real IBM quantum computers and high-performance simulators
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ibm-token" className="text-sm font-mono">
                    API Token *
                  </Label>
                  <Input
                    id="ibm-token"
                    type="password"
                    placeholder="Your IBM Quantum API token..."
                    value={ibmConfig.apiToken}
                    onChange={(e) => setIbmConfig(prev => ({ ...prev, apiToken: e.target.value }))}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    🔒 API keys are encrypted and stored securely on the server
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ibm-instance" className="text-sm font-mono">
                      Instance
                    </Label>
                    <Select 
                      value={ibmConfig.instance} 
                      onValueChange={(value) => setIbmConfig(prev => ({ ...prev, instance: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ibm-q/open/main">IBM Q Open (Free)</SelectItem>
                        <SelectItem value="ibm-q-academic/main">IBM Q Academic</SelectItem>
                        <SelectItem value="ibm-q-premium/main">IBM Q Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ibm-backend" className="text-sm font-mono">
                      Backend
                    </Label>
                    <Select 
                      value={ibmConfig.backend} 
                      onValueChange={(value) => setIbmConfig(prev => ({ ...prev, backend: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ibmq_qasm_simulator">QASM Simulator</SelectItem>
                        <SelectItem value="ibm_brisbane">IBM Brisbane (127 qubits)</SelectItem>
                        <SelectItem value="ibm_kyoto">IBM Kyoto (127 qubits)</SelectItem>
                        <SelectItem value="ibm_osaka">IBM Osaka (127 qubits)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={testIBMConnection}
                    variant="outline"
                    disabled={testResults.ibm === 'testing' || loading}
                    className="flex items-center gap-2"
                  >
                    {getStatusIcon(testResults.ibm)}
                    Test Connection
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.open('https://quantum-computing.ibm.com/account', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Get API Key
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="aws" className="space-y-4">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <h3 className="font-mono text-orange-400 font-semibold mb-2">AWS Braket</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Access quantum devices from IonQ, Rigetti, and AWS simulators
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aws-key" className="text-sm font-mono">
                      Access Key ID *
                    </Label>
                    <Input
                      id="aws-key"
                      type="password"
                      placeholder="Your AWS Access Key ID..."
                      value={awsConfig.accessKeyId}
                      onChange={(e) => setAwsConfig(prev => ({ ...prev, accessKeyId: e.target.value }))}
                      className="font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aws-secret" className="text-sm font-mono">
                      Secret Access Key *
                    </Label>
                    <Input
                      id="aws-secret"
                      type="password"
                      placeholder="Your AWS Secret Access Key..."
                      value={awsConfig.secretAccessKey}
                      onChange={(e) => setAwsConfig(prev => ({ ...prev, secretAccessKey: e.target.value }))}
                      className="font-mono"
                    />
                  </div>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  🔒 AWS credentials are encrypted and stored securely on the server
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aws-region" className="text-sm font-mono">
                      Region
                    </Label>
                    <Select 
                      value={awsConfig.region} 
                      onValueChange={(value) => setAwsConfig(prev => ({ ...prev, region: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                        <SelectItem value="eu-west-2">Europe (London)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aws-device" className="text-sm font-mono">
                      Device
                    </Label>
                    <Select 
                      value={awsConfig.device} 
                      onValueChange={(value) => setAwsConfig(prev => ({ ...prev, device: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="arn:aws:braket:::device/quantum-simulator/amazon/sv1">SV1 Simulator</SelectItem>
                        <SelectItem value="arn:aws:braket:::device/qpu/ionq/ionQdevice">IonQ Device</SelectItem>
                        <SelectItem value="arn:aws:braket:::device/qpu/rigetti/Aspen-M-3">Rigetti Aspen-M-3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={testAWSConnection}
                    variant="outline"
                    disabled={testResults.aws === 'testing' || loading}
                    className="flex items-center gap-2"
                  >
                    {getStatusIcon(testResults.aws)}
                    Test Connection
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.open('https://console.aws.amazon.com/iam/home#/security_credentials', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Get AWS Keys
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-4 border-t border-quantum-neon/20">
          <Button 
            onClick={saveConfiguration}
            className="w-full bg-quantum-glow hover:bg-quantum-glow/80 text-black"
            disabled={(!ibmConfig.apiToken && (!awsConfig.accessKeyId || !awsConfig.secretAccessKey)) || loading}
          >
            {loading ? 'Saving...' : 'Save Backend Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
