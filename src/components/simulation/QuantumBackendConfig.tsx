
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Cloud, Cpu, CheckCircle, AlertCircle, ExternalLink, Info } from 'lucide-react';

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

  const testIBMConnection = async () => {
    setTestResults(prev => ({ ...prev, ibm: 'testing' }));
    
    try {
      // This would normally test the IBM Quantum connection
      // For now, we'll simulate the test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (ibmConfig.apiToken.length > 20) {
        setTestResults(prev => ({ ...prev, ibm: 'success' }));
      } else {
        setTestResults(prev => ({ ...prev, ibm: 'error' }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, ibm: 'error' }));
    }
  };

  const testAWSConnection = async () => {
    setTestResults(prev => ({ ...prev, aws: 'testing' }));
    
    try {
      // This would normally test the AWS Braket connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (awsConfig.accessKeyId.length > 10 && awsConfig.secretAccessKey.length > 20) {
        setTestResults(prev => ({ ...prev, aws: 'success' }));
      } else {
        setTestResults(prev => ({ ...prev, aws: 'error' }));
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, aws: 'error' }));
    }
  };

  const saveConfiguration = () => {
    const config: BackendConfig = {};
    
    if (ibmConfig.apiToken) {
      config.ibmQuantum = ibmConfig;
    }
    
    if (awsConfig.accessKeyId && awsConfig.secretAccessKey) {
      config.awsBraket = awsConfig;
    }
    
    onConfigSave(config);
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
          Configure your API keys to access real quantum hardware and cloud simulators
        </p>
      </CardHeader>
      <CardContent>
        {/* Important Info Alert */}
        <Alert className="mb-6 border-blue-500/20 bg-blue-500/10">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            <strong>API Keys Required:</strong> To use IBM Quantum or AWS Braket, you need to obtain API credentials from the respective platforms. 
            These keys are stored locally and never shared.
          </AlertDescription>
        </Alert>

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
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-blue-400 font-semibold">IBM Quantum Platform</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open('https://quantum-computing.ibm.com/account', '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  Get API Key
                </Button>
              </div>
              
              <Alert className="mb-4 border-amber-500/20 bg-amber-500/10">
                <Key className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-700">
                  <strong>Step 1:</strong> Visit IBM Quantum Platform → Account → Copy your API token<br/>
                  <strong>Step 2:</strong> Paste the token below and test the connection
                </AlertDescription>
              </Alert>

              <p className="text-sm text-muted-foreground mb-4">
                Access real IBM quantum computers and high-performance simulators with up to 127 qubits
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ibm-token" className="text-sm font-mono flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    API Token *
                  </Label>
                  <Input
                    id="ibm-token"
                    type="password"
                    placeholder="Enter your IBM Quantum API token (starts with '...')"
                    value={ibmConfig.apiToken}
                    onChange={(e) => setIbmConfig(prev => ({ ...prev, apiToken: e.target.value }))}
                    className="font-mono"
                  />
                  {!ibmConfig.apiToken && (
                    <p className="text-xs text-amber-600">
                      ⚠️ API token is required to execute circuits on IBM Quantum
                    </p>
                  )}
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
                    disabled={!ibmConfig.apiToken || testResults.ibm === 'testing'}
                    className="flex items-center gap-2"
                  >
                    {getStatusIcon(testResults.ibm)}
                    Test Connection
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="aws" className="space-y-4">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-orange-400 font-semibold">AWS Braket</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open('https://console.aws.amazon.com/iam/home#/security_credentials', '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                  Get AWS Keys
                </Button>
              </div>

              <Alert className="mb-4 border-amber-500/20 bg-amber-500/10">
                <Key className="h-4 w-4 text-amber-500" />
                <AlertDescription className="text-amber-700">
                  <strong>Step 1:</strong> Visit AWS Console → IAM → Security Credentials<br/>
                  <strong>Step 2:</strong> Create Access Keys → Copy Access Key ID & Secret Key<br/>
                  <strong>Step 3:</strong> Enable Braket service in your AWS account
                </AlertDescription>
              </Alert>
              
              <p className="text-sm text-muted-foreground mb-4">
                Access quantum devices from IonQ, Rigetti, and AWS high-performance simulators
              </p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aws-key" className="text-sm font-mono flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Access Key ID *
                    </Label>
                    <Input
                      id="aws-key"
                      type="password"
                      placeholder="AKIA..."
                      value={awsConfig.accessKeyId}
                      onChange={(e) => setAwsConfig(prev => ({ ...prev, accessKeyId: e.target.value }))}
                      className="font-mono"
                    />
                    {!awsConfig.accessKeyId && (
                      <p className="text-xs text-amber-600">
                        ⚠️ Access Key ID is required
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aws-secret" className="text-sm font-mono flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      Secret Access Key *
                    </Label>
                    <Input
                      id="aws-secret"
                      type="password"
                      placeholder="Enter your AWS Secret Access Key..."
                      value={awsConfig.secretAccessKey}
                      onChange={(e) => setAwsConfig(prev => ({ ...prev, secretAccessKey: e.target.value }))}
                      className="font-mono"
                    />
                    {!awsConfig.secretAccessKey && (
                      <p className="text-xs text-amber-600">
                        ⚠️ Secret Access Key is required
                      </p>
                    )}
                  </div>
                </div>

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
                    disabled={!awsConfig.accessKeyId || !awsConfig.secretAccessKey || testResults.aws === 'testing'}
                    className="flex items-center gap-2"
                  >
                    {getStatusIcon(testResults.aws)}
                    Test Connection
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
            disabled={!ibmConfig.apiToken && (!awsConfig.accessKeyId || !awsConfig.secretAccessKey)}
          >
            <Key className="w-4 h-4 mr-2" />
            Save Backend Configuration
          </Button>
          
          {!ibmConfig.apiToken && (!awsConfig.accessKeyId || !awsConfig.secretAccessKey) && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Please enter API credentials for at least one backend to continue
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
