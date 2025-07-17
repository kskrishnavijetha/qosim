
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLMSIntegrations } from "@/hooks/useLMSIntegrations";
import { BookOpen, Settings, Plus, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LMSIntegrationsProps {
  educatorId: string;
}

type LMSType = 'canvas' | 'moodle' | 'blackboard' | 'google_classroom' | 'schoology';

const LMSIntegrations: React.FC<LMSIntegrationsProps> = ({ educatorId }) => {
  const { integrations, loading, createIntegration, updateIntegration } = useLMSIntegrations(educatorId);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedLMS, setSelectedLMS] = useState<LMSType>('canvas');
  const [connectionData, setConnectionData] = useState({
    api_url: '',
    api_key: '',
    course_id: ''
  });
  const { toast } = useToast();

  const lmsOptions = [
    { 
      value: 'canvas' as const, 
      label: 'Canvas LMS', 
      icon: '🎨',
      description: 'Connect with Canvas for seamless gradebook integration'
    },
    { 
      value: 'moodle' as const, 
      label: 'Moodle', 
      icon: '📚',
      description: 'Integrate with Moodle courses and assignments'
    },
    { 
      value: 'blackboard' as const, 
      label: 'Blackboard', 
      icon: '⚫',
      description: 'Sync with Blackboard Learn courses'
    },
    { 
      value: 'google_classroom' as const, 
      label: 'Google Classroom', 
      icon: '🏫',
      description: 'Connect with Google Classroom for easy assignment distribution'
    },
    { 
      value: 'schoology' as const, 
      label: 'Schoology', 
      icon: '🎓',
      description: 'Integrate with Schoology platform'
    }
  ];

  const handleConnect = async () => {
    if (!connectionData.api_url || !connectionData.api_key) {
      toast({
        title: "Error",
        description: "API URL and API Key are required",
        variant: "destructive"
      });
      return;
    }

    try {
      await createIntegration({
        lms_type: selectedLMS,
        integration_data: connectionData,
        is_active: true
      });
      
      setConnectionData({ api_url: '', api_key: '', course_id: '' });
      setIsConnecting(false);
      
      toast({
        title: "Success!",
        description: `Successfully connected to ${lmsOptions.find(l => l.value === selectedLMS)?.label}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to LMS. Please check your credentials.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading LMS integrations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">LMS Integrations</h2>
          <p className="text-muted-foreground">Connect QOSim with your Learning Management System</p>
        </div>
        
        <Dialog open={isConnecting} onOpenChange={setIsConnecting}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Connect LMS</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* LMS Selection */}
              <div>
                <Label>Select Learning Management System</Label>
                <div className="grid grid-cols-1 gap-3 mt-3">
                  {lmsOptions.map((lms) => (
                    <div
                      key={lms.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedLMS === lms.value 
                          ? 'border-quantum-glow bg-quantum-glow/5' 
                          : 'border-border hover:border-quantum-glow/50'
                      }`}
                      onClick={() => setSelectedLMS(lms.value)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{lms.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold">{lms.label}</h4>
                          <p className="text-sm text-muted-foreground">{lms.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Connection Details */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="api_url">API URL *</Label>
                  <Input
                    id="api_url"
                    value={connectionData.api_url}
                    onChange={(e) => setConnectionData({...connectionData, api_url: e.target.value})}
                    placeholder="https://your-institution.instructure.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="api_key">API Key *</Label>
                  <Input
                    id="api_key"
                    type="password"
                    value={connectionData.api_key}
                    onChange={(e) => setConnectionData({...connectionData, api_key: e.target.value})}
                    placeholder="Your LMS API key"
                  />
                </div>
                
                <div>
                  <Label htmlFor="course_id">Course ID (Optional)</Label>
                  <Input
                    id="course_id"
                    value={connectionData.course_id}
                    onChange={(e) => setConnectionData({...connectionData, course_id: e.target.value})}
                    placeholder="Specific course to connect"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsConnecting(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConnect}>
                  Connect LMS
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Existing Integrations */}
      {integrations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No LMS integrations</h3>
            <p className="text-muted-foreground text-center mb-4">
              Connect your Learning Management System to sync assignments and grades
            </p>
            <Button onClick={() => setIsConnecting(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Connect Your First LMS
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {integrations.map((integration) => {
            const lmsInfo = lmsOptions.find(l => l.value === integration.lms_type);
            return (
              <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl">{lmsInfo?.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{lmsInfo?.label}</CardTitle>
                        <Badge 
                          variant={integration.is_active ? "default" : "secondary"}
                          className="mt-1"
                        >
                          {integration.is_active ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Connected:</span>
                      <span>{new Date(integration.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span>{new Date(integration.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Test Connection
                    </Button>
                    <Button size="sm" className="flex-1">
                      Sync Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Integration Benefits */}
      <Card className="bg-gradient-to-br from-quantum-glow/5 to-quantum-neon/5 border-quantum-glow/20">
        <CardHeader>
          <CardTitle className="text-quantum-glow">LMS Integration Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Automatic Sync</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Student rosters</li>
                <li>• Assignment creation</li>
                <li>• Grade passback</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Enhanced Workflow</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Single sign-on access</li>
                <li>• Embedded quantum circuits</li>
                <li>• Progress tracking</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LMSIntegrations;
