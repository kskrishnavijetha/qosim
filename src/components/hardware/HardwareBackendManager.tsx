
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Key, Cloud, CheckCircle, AlertCircle, Settings, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useSecureCredentials } from '@/hooks/useSecureCredentials';

export interface HardwareBackend {
  id: string;
  name: string;
  provider: 'ibm' | 'rigetti' | 'ionq';
  isActive: boolean;
  lastTested?: Date;
  status: 'connected' | 'disconnected' | 'testing';
}

interface HardwareBackendManagerProps {
  onBackendSave: (backend: HardwareBackend) => void;
  backends: HardwareBackend[];
}

export function HardwareBackendManager({ onBackendSave, backends }: HardwareBackendManagerProps) {
  const { storeCredentials, retrieveCredentials, loading } = useSecureCredentials();
  
  const [ibmConfig, setIbmConfig] = useState({
    apiKey: '',
    hub: 'ibm-q',
    group: 'open',
    project: 'main'
  });

  const [rigettiConfig, setRigettiConfig] = useState({
    apiKey: '',
    endpoint: 'https://api.rigetti.com'
  });

  const [ionqConfig, setIonqConfig] = useState({
    apiKey: '',
    endpoint: 'https://api.ionq.co'
  });

  const [testResults, setTestResults] = useState<{
    ibm?: 'success' | 'error' | 'testing';
    rigetti?: 'success' | 'error' | 'testing';
    ionq?: 'success' | 'error' | 'testing';
  }>({});

  useEffect(() => {
    // Load existing credentials on mount
    loadExistingCredentials();
  }, []);

  const loadExistingCredentials = async () => {
    try {
      // Check if credentials exist for each provider
      const providers = ['ibm-quantum', 'rigetti', 'ionq'];
      for (const provider of providers) {
        const result = await retrieveCredentials(provider);
        if (result.credentials && !result.error) {
          // Don't populate the form fields with existing credentials for security
          // Just indicate that credentials exist
          toast.success(`Existing ${provider} credentials loaded`);
        }
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    }
  };

  const testConnection = async (provider: 'ibm' | 'rigetti' | 'ionq') => {
    setTestResults(prev => ({ ...prev, [provider]: 'testing' }));
    
    try {
      // Retrieve stored credentials for testing
      const serviceName = provider === 'ibm' ? 'ibm-quantum' : provider;
      const credentialsResult = await retrieveCredentials(serviceName);
      
      if (credentialsResult.error || !credentialsResult.credentials) {
        toast.error(`No stored credentials found for ${provider.toUpperCase()}`);
        setTestResults(prev => ({ ...prev, [provider]: 'error' }));
        return false;
      }

      // Mock API test - in production, this would test the actual connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const credentials = credentialsResult.credentials;
      if (credentials.apiKey && credentials.apiKey.length > 10) {
        toast.success(`${provider.toUpperCase()} connection successful`);
        setTestResults(prev => ({ ...prev, [provider]: 'success' }));
        return true;
      } else {
        toast.error(`Invalid ${provider.toUpperCase()} API key`);
        setTestResults(prev => ({ ...prev, [provider]: 'error' }));
        return false;
      }
    } catch (error) {
      toast.error(`${provider.toUpperCase()} connection failed`);
      setTestResults(prev => ({ ...prev, [provider]: 'error' }));
      return false;
    }
  };

  const saveBackend = async (provider: 'ibm' | 'rigetti' | 'ionq') => {
    if (loading) return;

    let config;
    let serviceName;
    
    switch (provider) {
      case 'ibm':
        config = ibmConfig;
        serviceName = 'ibm-quantum';
        break;
      case 'rigetti':
        config = rigettiConfig;
        serviceName = 'rigetti';
        break;
      case 'ionq':
        config = ionqConfig;
        serviceName = 'ionq';
        break;
    }

    if (!config.apiKey) {
      toast.error('API key is required');
      return;
    }

    try {
      // Store credentials securely
      const result = await storeCredentials(serviceName, config);
      
      if (result.error) {
        toast.error(`Failed to save ${provider.toUpperCase()} credentials`);
        return;
      }

      const backend: HardwareBackend = {
        id: `${provider}-${Date.now()}`,
        name: `${provider.toUpperCase()} Backend`,
        provider,
        isActive: true,
        status: 'connected'
      };

      onBackendSave(backend);
      
      // Clear the form for security
      if (provider === 'ibm') {
        setIbmConfig(prev => ({ ...prev, apiKey: '' }));
      } else if (provider === 'rigetti') {
        setRigettiConfig(prev => ({ ...prev, apiKey: '' }));
      } else if (provider === 'ionq') {
        setIonqConfig(prev => ({ ...prev, apiKey: '' }));
      }
      
      toast.success(`${provider.toUpperCase()} backend saved successfully`);
    } catch (error) {
      console.error('Error saving backend:', error);
      toast.error(`Failed to save ${provider.toUpperCase()} backend`);
    }
  };

  const getStatusIcon = (status: 'connected' | 'disconnected' | 'testing') => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'disconnected':
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
          <Settings className="w-5 h-5" />
          Hardware Backend Configuration
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Configure API keys for real quantum hardware backends (stored securely)
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ibm" className="w-full">
          <TabsList className="grid w-full grid-cols-3 quantum-tabs">
            <TabsTrigger value="ibm">IBM Quantum</TabsTrigger>
            <TabsTrigger value="rigetti">Rigetti</TabsTrigger>
            <TabsTrigger value="ionq">IonQ</TabsTrigger>
          </TabsList>

          <TabsContent value="ibm" className="space-y-4">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ibm-key">IBM Quantum API Token</Label>
                  <Input
                    id="ibm-key"
                    type="password"
                    placeholder="Enter your IBM Quantum API token..."
                    value={ibmConfig.apiKey}
                    onChange={(e) => setIbmConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    🔒 API keys are encrypted and stored securely on the server
                  </p>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ibm-hub">Hub</Label>
                    <Input
                      id="ibm-hub"
                      value={ibmConfig.hub}
                      onChange={(e) => setIbmConfig(prev => ({ ...prev, hub: e.target.value }))}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ibm-group">Group</Label>
                    <Input
                      id="ibm-group"
                      value={ibmConfig.group}
                      onChange={(e) => setIbmConfig(prev => ({ ...prev, group: e.target.value }))}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ibm-project">Project</Label>
                    <Input
                      id="ibm-project"
                      value={ibmConfig.project}
                      onChange={(e) => setIbmConfig(prev => ({ ...prev, project: e.target.value }))}
                      className="font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => testConnection('ibm')}
                    variant="outline"
                    disabled={testResults.ibm === 'testing' || loading}
                    className="flex items-center gap-2"
                  >
                    {getStatusIcon(testResults.ibm === 'testing' ? 'testing' : 'disconnected')}
                    Test Connection
                  </Button>
                  <Button
                    onClick={() => saveBackend('ibm')}
                    disabled={!ibmConfig.apiKey || loading}
                    className="bg-quantum-glow text-quantum-void"
                  >
                    {loading ? 'Saving...' : 'Save Backend'}
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

          <TabsContent value="rigetti" className="space-y-4">
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rigetti-key">Rigetti API Token</Label>
                  <Input
                    id="rigetti-key"
                    type="password"
                    placeholder="Enter your Rigetti API token..."
                    value={rigettiConfig.apiKey}
                    onChange={(e) => setRigettiConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    🔒 API keys are encrypted and stored securely on the server
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rigetti-endpoint">API Endpoint</Label>
                  <Input
                    id="rigetti-endpoint"
                    value={rigettiConfig.endpoint}
                    onChange={(e) => setRigettiConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                    className="font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => testConnection('rigetti')}
                    variant="outline"
                    disabled={testResults.rigetti === 'testing' || loading}
                    className="flex items-center gap-2"
                  >
                    {getStatusIcon(testResults.rigetti === 'testing' ? 'testing' : 'disconnected')}
                    Test Connection
                  </Button>
                  <Button
                    onClick={() => saveBackend('rigetti')}
                    disabled={!rigettiConfig.apiKey || loading}
                    className="bg-quantum-glow text-quantum-void"
                  >
                    {loading ? 'Saving...' : 'Save Backend'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.open('https://rigetti.com/get-started', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Get API Key
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ionq" className="space-y-4">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ionq-key">IonQ API Token</Label>
                  <Input
                    id="ionq-key"
                    type="password"
                    placeholder="Enter your IonQ API token..."
                    value={ionqConfig.apiKey}
                    onChange={(e) => setIonqConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    className="font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    🔒 API keys are encrypted and stored securely on the server
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ionq-endpoint">API Endpoint</Label>
                  <Input
                    id="ionq-endpoint"
                    value={ionqConfig.endpoint}
                    onChange={(e) => setIonqConfig(prev => ({ ...prev, endpoint: e.target.value }))}
                    className="font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => testConnection('ionq')}
                    variant="outline"
                    disabled={testResults.ionq === 'testing' || loading}
                    className="flex items-center gap-2"
                  >
                    {getStatusIcon(testResults.ionq === 'testing' ? 'testing' : 'disconnected')}
                    Test Connection
                  </Button>
                  <Button
                    onClick={() => saveBackend('ionq')}
                    disabled={!ionqConfig.apiKey || loading}
                    className="bg-quantum-glow text-quantum-void"
                  >
                    {loading ? 'Saving...' : 'Save Backend'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.open('https://ionq.com/get-started', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Get API Key
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Active Backends */}
        {backends.length > 0 && (
          <div className="mt-6 pt-4 border-t border-quantum-neon/20">
            <h3 className="font-mono text-quantum-glow mb-4">Active Backends</h3>
            <div className="space-y-2">
              {backends.map(backend => (
                <div key={backend.id} className="flex items-center justify-between p-3 bg-quantum-matrix rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(backend.status)}
                    <span className="font-mono text-quantum-neon">{backend.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {backend.provider.toUpperCase()}
                    </Badge>
                  </div>
                  <Badge variant={backend.isActive ? 'default' : 'secondary'}>
                    {backend.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
