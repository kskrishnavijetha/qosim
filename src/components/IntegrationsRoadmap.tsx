import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Cloud, 
  Github, 
  Zap, 
  Mail, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  Database,
  Upload,
  Download,
  Cpu,
  Share2
} from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned' | 'requires-setup';
  priority: 'high' | 'medium' | 'low';
  category: 'storage' | 'development' | 'quantum-cloud' | 'notifications';
  icon: React.ComponentType<any>;
  requirements: string[];
  benefits: string[];
  progress: number;
  documentation?: string;
  setupAction?: string;
}

const integrations: Integration[] = [
  {
    id: 'github',
    name: 'GitHub Repository Sync',
    description: 'Sync quantum circuits with GitHub repositories for version control and collaboration',
    status: 'requires-setup',
    priority: 'high',
    category: 'development',
    icon: Github,
    requirements: [
      'Connect to Lovable GitHub integration',
      'Repository access permissions',
      'Circuit serialization format'
    ],
    benefits: [
      'Version control for circuits',
      'Team collaboration',
      'Open source sharing',
      'Automated backups'
    ],
    progress: 20,
    documentation: 'https://docs.lovable.dev/integrations/github/',
    setupAction: 'Connect GitHub'
  },
  {
    id: 'google-drive',
    name: 'Google Drive Backup',
    description: 'Automatically backup circuits to Google Drive for cloud storage',
    status: 'planned',
    priority: 'medium',
    category: 'storage',
    icon: Cloud,
    requirements: [
      'Google Drive API access',
      'OAuth2 authentication',
      'Supabase backend integration',
      'Secure API key storage'
    ],
    benefits: [
      'Automatic circuit backups',
      'Cross-device synchronization',
      'Unlimited storage',
      'Share circuits easily'
    ],
    progress: 0,
    setupAction: 'Setup Supabase'
  },
  {
    id: 'dropbox',
    name: 'Dropbox Integration',
    description: 'Sync circuits with Dropbox for file sharing and backup',
    status: 'planned',
    priority: 'low',
    category: 'storage',
    icon: Upload,
    requirements: [
      'Dropbox API access',
      'OAuth2 authentication',
      'Supabase backend integration'
    ],
    benefits: [
      'Alternative cloud storage',
      'File sharing capabilities',
      'Offline access'
    ],
    progress: 0,
    setupAction: 'Setup Supabase'
  },
  {
    id: 'ibm-q',
    name: 'IBM Quantum Network',
    description: 'Export circuits to IBM Quantum Experience and run on real quantum hardware',
    status: 'planned',
    priority: 'high',
    category: 'quantum-cloud',
    icon: Cpu,
    requirements: [
      'IBM Quantum API token',
      'QASM 2.0/3.0 export support',
      'Supabase edge functions',
      'Job status monitoring'
    ],
    benefits: [
      'Run on real quantum hardware',
      'Access IBM quantum computers',
      'Compare simulation vs real results',
      'Research-grade capabilities'
    ],
    progress: 30,
    setupAction: 'Setup Supabase'
  },
  {
    id: 'aws-braket',
    name: 'AWS Braket Integration',
    description: 'Deploy circuits to AWS Braket quantum computing service',
    status: 'planned',
    priority: 'high',
    category: 'quantum-cloud',
    icon: Zap,
    requirements: [
      'AWS credentials',
      'Braket API access',
      'OpenQASM 3.0 support',
      'Cost monitoring'
    ],
    benefits: [
      'Access multiple quantum providers',
      'Hybrid classical-quantum algorithms',
      'Enterprise-grade security',
      'Pay-per-use pricing'
    ],
    progress: 0,
    setupAction: 'Setup Supabase'
  },
  {
    id: 'classiq',
    name: 'Classiq Platform Export',
    description: 'Export high-level quantum algorithms to Classiq synthesis platform',
    status: 'planned',
    priority: 'medium',
    category: 'quantum-cloud',
    icon: Share2,
    requirements: [
      'Classiq API access',
      'High-level circuit representation',
      'Algorithm synthesis support'
    ],
    benefits: [
      'High-level quantum programming',
      'Automatic optimization',
      'Hardware-agnostic deployment'
    ],
    progress: 0,
    setupAction: 'Setup Supabase'
  },
  {
    id: 'email-notifications',
    name: 'Email Notifications',
    description: 'Send email notifications for export completion and circuit sharing',
    status: 'planned',
    priority: 'medium',
    category: 'notifications',
    icon: Mail,
    requirements: [
      'Email service provider',
      'Supabase auth integration',
      'Email templates',
      'User preferences'
    ],
    benefits: [
      'Export completion alerts',
      'Share circuit notifications',
      'Weekly progress reports',
      'Collaboration updates'
    ],
    progress: 0,
    setupAction: 'Setup Supabase'
  }
];

const getStatusIcon = (status: Integration['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'in-progress':
      return <Clock className="w-4 h-4 text-yellow-500" />;
    case 'requires-setup':
      return <AlertCircle className="w-4 h-4 text-blue-500" />;
    default:
      return <Clock className="w-4 h-4 text-gray-500" />;
  }
};

const getStatusColor = (status: Integration['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500';
    case 'in-progress':
      return 'bg-yellow-500';
    case 'requires-setup':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};

const getPriorityColor = (priority: Integration['priority']) => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

export function IntegrationsRoadmap() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Integrations', count: integrations.length },
    { id: 'storage', name: 'Cloud Storage', count: integrations.filter(i => i.category === 'storage').length },
    { id: 'development', name: 'Development', count: integrations.filter(i => i.category === 'development').length },
    { id: 'quantum-cloud', name: 'Quantum Cloud', count: integrations.filter(i => i.category === 'quantum-cloud').length },
    { id: 'notifications', name: 'Notifications', count: integrations.filter(i => i.category === 'notifications').length },
  ];

  const filteredIntegrations = selectedCategory === 'all' 
    ? integrations 
    : integrations.filter(i => i.category === selectedCategory);

  const overallProgress = Math.round(
    integrations.reduce((sum, i) => sum + i.progress, 0) / integrations.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="quantum-panel border-quantum-glow/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-quantum-glow flex items-center gap-2">
                <Database className="w-6 h-6" />
                Integrations Roadmap
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Planned integrations to enhance QOSim's connectivity and functionality
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Overall Progress</div>
              <div className="text-2xl font-bold text-quantum-glow">{overallProgress}%</div>
            </div>
          </div>
          <Progress value={overallProgress} className="w-full" />
        </CardHeader>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="data-[state=active]:bg-quantum-glow/20">
              {category.name} ({category.count})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredIntegrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <Card key={integration.id} className="quantum-panel border-quantum-glow/20 hover:border-quantum-glow/40 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-quantum-glow" />
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        {getStatusIcon(integration.status)}
                        <Badge variant="outline" className={`text-xs ${getPriorityColor(integration.priority)}`}>
                          {integration.priority}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {integration.description}
                    </p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{integration.progress}%</span>
                      </div>
                      <Progress value={integration.progress} className="h-2" />
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Requirements:</h4>
                      <ul className="text-xs space-y-1">
                        {integration.requirements.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-quantum-neon rounded-full" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Benefits:</h4>
                      <ul className="text-xs space-y-1">
                        {integration.benefits.slice(0, 3).map((benefit, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {integration.setupAction && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 neon-border"
                          onClick={() => {
                            if (integration.setupAction === 'Connect GitHub') {
                              window.open('https://docs.lovable.dev/integrations/github/', '_blank');
                            } else if (integration.setupAction === 'Setup Supabase') {
                              window.open('https://docs.lovable.dev/integrations/supabase/', '_blank');
                            }
                          }}
                        >
                          {integration.setupAction}
                        </Button>
                      )}
                      {integration.documentation && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="p-2"
                          onClick={() => window.open(integration.documentation, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Implementation Notes */}
      <Card className="quantum-panel border-quantum-glow/20">
        <CardHeader>
          <CardTitle className="text-lg">Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-quantum-glow mb-2">Prerequisites</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Supabase integration for secure API key storage</li>
                <li>• OAuth2 authentication flows</li>
                <li>• Edge functions for external API calls</li>
                <li>• User preference management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-quantum-glow mb-2">Security Considerations</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• API keys stored in Supabase secrets</li>
                <li>• User consent for data sharing</li>
                <li>• Rate limiting and quota management</li>
                <li>• Encrypted circuit data transmission</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}