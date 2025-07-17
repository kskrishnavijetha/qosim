
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ExternalLink, Settings, Check, AlertCircle } from 'lucide-react';
import { useLMSIntegrations } from '@/hooks/useLMSIntegrations';
import { toast } from 'sonner';

const lmsPlatforms = [
  {
    id: 'canvas',
    name: 'Canvas',
    description: 'Integrate with Instructure Canvas LMS',
    logo: '🎨',
    features: ['Grade passback', 'Single sign-on', 'Assignment sync'],
    setupFields: [
      { key: 'canvas_url', label: 'Canvas URL', placeholder: 'https://yourschool.instructure.com' },
      { key: 'api_key', label: 'API Key', placeholder: 'Your Canvas API key' }
    ]
  },
  {
    id: 'moodle',
    name: 'Moodle',
    description: 'Connect with Moodle learning management system',
    logo: '📚',
    features: ['Course integration', 'Grade sync', 'User authentication'],
    setupFields: [
      { key: 'moodle_url', label: 'Moodle URL', placeholder: 'https://learn.yourschool.edu' },
      { key: 'web_service_token', label: 'Web Service Token', placeholder: 'Your Moodle token' }
    ]
  },
  {
    id: 'blackboard',
    name: 'Blackboard',
    description: 'Integrate with Blackboard Learn platform',
    logo: '⬛',
    features: ['Deep linking', 'Grade center sync', 'User management'],
    setupFields: [
      { key: 'blackboard_url', label: 'Blackboard URL', placeholder: 'https://yourschool.blackboard.com' },
      { key: 'application_key', label: 'Application Key', placeholder: 'Your application key' }
    ]
  },
  {
    id: 'google_classroom',
    name: 'Google Classroom',
    description: 'Connect with Google Classroom',
    logo: '🎓',
    features: ['Assignment distribution', 'Grade sync', 'OAuth integration'],
    setupFields: [
      { key: 'client_id', label: 'OAuth Client ID', placeholder: 'Your Google OAuth client ID' },
      { key: 'client_secret', label: 'Client Secret', placeholder: 'Your client secret' }
    ]
  },
  {
    id: 'schoology',
    name: 'Schoology',
    description: 'Integrate with Schoology learning platform',
    logo: '🏫',
    features: ['Assignment sync', 'Gradebook integration', 'Single sign-on'],
    setupFields: [
      { key: 'consumer_key', label: 'Consumer Key', placeholder: 'Your Schoology consumer key' },
      { key: 'consumer_secret', label: 'Consumer Secret', placeholder: 'Your consumer secret' }
    ]
  }
];

export function LMSIntegrations() {
  const { integrations, loading, createIntegration, updateIntegration, deleteIntegration } = useLMSIntegrations();
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [setupData, setSetupData] = useState<Record<string, string>>({});

  const handleSetup = async () => {
    if (!selectedPlatform) return;

    try {
      await createIntegration({
        lms_type: selectedPlatform,
        integration_data: setupData,
        is_active: true
      });
      setShowSetupDialog(false);
      setSetupData({});
      setSelectedPlatform(null);
      toast.success('LMS integration configured successfully!');
    } catch (error) {
      toast.error('Failed to configure LMS integration');
    }
  };

  const toggleIntegration = async (integrationId: string, isActive: boolean) => {
    try {
      await updateIntegration(integrationId, { is_active: isActive });
      toast.success(`Integration ${isActive ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update integration');
    }
  };

  const getIntegrationStatus = (platformId: string) => {
    return integrations.find(i => i.lms_type === platformId);
  };

  if (loading) {
    return <div className="text-quantum-glow">Loading integrations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">LMS Integrations</h2>
        <p className="text-quantum-silver">
          Connect QOSim with your Learning Management System to streamline grade sync and student access.
        </p>
      </div>

      {/* Integration Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {lmsPlatforms.map((platform) => {
          const integration = getIntegrationStatus(platform.id);
          const isConnected = !!integration;
          const isActive = integration?.is_active || false;

          return (
            <Card key={platform.id} className="bg-quantum-matrix border-quantum-circuit">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{platform.logo}</div>
                    <div>
                      <CardTitle className="text-white">{platform.name}</CardTitle>
                      <CardDescription className="text-quantum-silver">
                        {platform.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {isConnected ? (
                      <Badge className="bg-green-500/20 text-green-400">
                        <Check className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-quantum-circuit text-quantum-silver">
                        Not Connected
                      </Badge>
                    )}
                    {isConnected && (
                      <Switch
                        checked={isActive}
                        onCheckedChange={(checked) => toggleIntegration(integration.id, checked)}
                      />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-white text-sm font-medium mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {platform.features.map((feature, index) => (
                      <li key={index} className="text-quantum-silver text-sm flex items-center gap-2">
                        <div className="w-1 h-1 bg-quantum-glow rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  {isConnected ? (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 border-quantum-circuit text-quantum-glow"
                        onClick={() => {
                          setSelectedPlatform(platform.id);
                          setSetupData(integration.integration_data || {});
                          setShowSetupDialog(true);
                        }}
                      >
                        <Settings className="w-3 h-3 mr-2" />
                        Configure
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-500 text-red-400 hover:bg-red-500/10"
                        onClick={() => deleteIntegration(integration.id)}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button 
                      size="sm" 
                      className="flex-1 bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
                      onClick={() => {
                        setSelectedPlatform(platform.id);
                        setSetupData({});
                        setShowSetupDialog(true);
                      }}
                    >
                      Connect
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="border-quantum-circuit text-quantum-glow">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="bg-quantum-matrix border-quantum-circuit">
          <DialogHeader>
            <DialogTitle className="text-white">
              Configure {selectedPlatform && lmsPlatforms.find(p => p.id === selectedPlatform)?.name}
            </DialogTitle>
            <DialogDescription className="text-quantum-silver">
              Enter your LMS credentials to establish the connection.
            </DialogDescription>
          </DialogHeader>
          
          {selectedPlatform && (
            <div className="space-y-4">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div className="text-sm text-blue-400">
                    <p className="font-medium">Security Notice</p>
                    <p>Your credentials are encrypted and stored securely. We only access what's necessary for integration.</p>
                  </div>
                </div>
              </div>

              {lmsPlatforms
                .find(p => p.id === selectedPlatform)
                ?.setupFields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key} className="text-quantum-glow">
                      {field.label}
                    </Label>
                    <Input
                      id={field.key}
                      type={field.key.includes('secret') || field.key.includes('key') || field.key.includes('token') ? 'password' : 'text'}
                      value={setupData[field.key] || ''}
                      onChange={(e) => setSetupData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="bg-quantum-void border-quantum-circuit text-white"
                    />
                  </div>
                ))}

              <div className="flex gap-2">
                <Button 
                  onClick={handleSetup}
                  className="flex-1 bg-quantum-glow hover:bg-quantum-glow/80 text-quantum-void"
                >
                  {getIntegrationStatus(selectedPlatform) ? 'Update' : 'Connect'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSetupDialog(false)}
                  className="border-quantum-circuit text-quantum-glow"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Help Section */}
      <Card className="bg-quantum-matrix border-quantum-circuit">
        <CardHeader>
          <CardTitle className="text-white">Need Help?</CardTitle>
          <CardDescription className="text-quantum-silver">
            Get assistance with setting up your LMS integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start border-quantum-circuit text-quantum-glow">
            📖 View Integration Documentation
          </Button>
          <Button variant="outline" className="w-full justify-start border-quantum-circuit text-quantum-glow">
            🎥 Watch Setup Video Tutorials
          </Button>
          <Button variant="outline" className="w-full justify-start border-quantum-circuit text-quantum-glow">
            💬 Contact Integration Support
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
