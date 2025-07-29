
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GitBranch, 
  RefreshCw, 
  Users, 
  Zap,
  Brain,
  BookOpen,
  Settings,
  Activity,
  Database,
  MessageSquare,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

export function IntegrationLayer() {
  const [syncStatus, setSyncStatus] = useState('connected');
  const [collaborators, setCollaborators] = useState(3);
  const [aiSuggestions, setAiSuggestions] = useState(5);

  const integrationModules = [
    { 
      name: 'Circuit Builder ⟷ SDK', 
      status: 'active', 
      description: 'Seamless conversion between visual and code-based workflows',
      lastSync: '2 seconds ago'
    },
    { 
      name: 'Unified Simulation Engine', 
      status: 'active', 
      description: 'Consistent quantum simulation across all modules',
      lastSync: 'Real-time'
    },
    { 
      name: 'QFS Collaboration', 
      status: 'active', 
      description: 'Multi-user editing with version control and comments',
      lastSync: '1 minute ago'
    },
    { 
      name: 'AI-Powered Optimization', 
      status: 'active', 
      description: 'Intelligent circuit optimization and suggestions',
      lastSync: '30 seconds ago'
    },
    { 
      name: 'Education Mode', 
      status: 'active', 
      description: 'Tutorial integration across visual and code interfaces',
      lastSync: '5 minutes ago'
    }
  ];

  const recentActivity = [
    { type: 'sync', user: 'Alice', action: 'Converted Bell State circuit to Python SDK', time: '2m ago' },
    { type: 'collaboration', user: 'Bob', action: 'Added comment on Grover implementation', time: '5m ago' },
    { type: 'ai', user: 'AI Assistant', action: 'Suggested circuit depth optimization', time: '8m ago' },
    { type: 'education', user: 'System', action: 'Tutorial progress synchronized', time: '12m ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Integration Layer Header */}
      <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Integration Layer
              </CardTitle>
              <CardDescription className="text-quantum-particle">
                Unified ecosystem connecting Circuit Builder, Algorithms SDK, and collaborative features
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`${syncStatus === 'connected' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${syncStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'}`} />
                {syncStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </Badge>
              <Badge variant="outline" className="border-quantum-neon/30 text-quantum-neon">
                {collaborators} Active Users
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Integration Status Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
          <CardContent className="p-4 text-center">
            <RefreshCw className="h-8 w-8 text-quantum-energy mx-auto mb-2" />
            <div className="text-lg font-bold text-quantum-glow">Real-time</div>
            <div className="text-xs text-quantum-particle">Sync Status</div>
          </CardContent>
        </Card>

        <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-quantum-glow mx-auto mb-2" />
            <div className="text-lg font-bold text-quantum-glow">{collaborators}</div>
            <div className="text-xs text-quantum-particle">Collaborators</div>
          </CardContent>
        </Card>

        <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 text-quantum-neon mx-auto mb-2" />
            <div className="text-lg font-bold text-quantum-glow">{aiSuggestions}</div>
            <div className="text-xs text-quantum-particle">AI Suggestions</div>
          </CardContent>
        </Card>

        <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 text-quantum-energy mx-auto mb-2" />
            <div className="text-lg font-bold text-quantum-glow">99.9%</div>
            <div className="text-xs text-quantum-particle">Uptime</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Integration Modules */}
        <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-quantum-glow flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Integration Modules
            </CardTitle>
            <CardDescription className="text-quantum-particle text-xs">
              Status and health of integration components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {integrationModules.map((module, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-quantum-neon/10 bg-quantum-void/20">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full ${module.status === 'active' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <h4 className="text-sm font-medium text-quantum-glow">{module.name}</h4>
                  </div>
                  <p className="text-xs text-quantum-particle">{module.description}</p>
                  <div className="text-xs text-quantum-energy mt-1">Last sync: {module.lastSync}</div>
                </div>
                <Button variant="ghost" size="sm" className="text-quantum-particle hover:text-quantum-glow">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Real-time Activity Feed */}
        <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-quantum-glow flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Real-time Activity
            </CardTitle>
            <CardDescription className="text-quantum-particle text-xs">
              Live updates from all integrated modules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-quantum-void/20">
                <div className="flex-shrink-0 mt-1">
                  {activity.type === 'sync' && <RefreshCw className="h-4 w-4 text-quantum-energy" />}
                  {activity.type === 'collaboration' && <MessageSquare className="h-4 w-4 text-quantum-glow" />}
                  {activity.type === 'ai' && <Brain className="h-4 w-4 text-quantum-neon" />}
                  {activity.type === 'education' && <BookOpen className="h-4 w-4 text-quantum-particle" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-quantum-glow">{activity.user}</span>
                    <span className="text-xs text-quantum-particle">{activity.time}</span>
                  </div>
                  <p className="text-xs text-quantum-particle">{activity.action}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Cross-Module Workflow */}
      <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-quantum-glow flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Cross-Module Workflow
          </CardTitle>
          <CardDescription className="text-quantum-particle text-xs">
            Seamless transitions between visual and code-based development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Circuit to Code */}
            <div className="p-4 rounded-lg border border-quantum-neon/20 bg-quantum-void/20">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-quantum-energy/20 flex items-center justify-center mx-auto mb-2">
                  <GitBranch className="h-6 w-6 text-quantum-energy" />
                </div>
                <h3 className="text-sm font-medium text-quantum-glow">Visual → Code</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-quantum-particle">Export to Python/JS</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-quantum-particle">Preserve parameters</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-quantum-particle">Generate documentation</span>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 bg-quantum-energy text-black hover:bg-quantum-energy/80">
                Convert Circuit
              </Button>
            </div>

            {/* Code to Circuit */}
            <div className="p-4 rounded-lg border border-quantum-glow/20 bg-quantum-void/20">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-quantum-glow/20 flex items-center justify-center mx-auto mb-2">
                  <RefreshCw className="h-6 w-6 text-quantum-glow" />
                </div>
                <h3 className="text-sm font-medium text-quantum-glow">Code → Visual</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-quantum-particle">Parse SDK code</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-quantum-particle">Render visual circuit</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-quantum-particle">Maintain functionality</span>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 bg-quantum-glow text-black hover:bg-quantum-glow/80">
                Import Code
              </Button>
            </div>

            {/* AI Integration */}
            <div className="p-4 rounded-lg border border-quantum-neon/20 bg-quantum-void/20">
              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-quantum-neon/20 flex items-center justify-center mx-auto mb-2">
                  <Brain className="h-6 w-6 text-quantum-neon" />
                </div>
                <h3 className="text-sm font-medium text-quantum-glow">AI Enhancement</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-quantum-particle">Circuit optimization</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-quantum-particle">Error correction</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3 w-3 text-green-400" />
                  <span className="text-quantum-particle">Context suggestions</span>
                </div>
              </div>
              <Button size="sm" className="w-full mt-3 bg-quantum-neon text-black hover:bg-quantum-neon/80">
                Get AI Help
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Health & Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-quantum-glow flex items-center gap-2">
              <Database className="h-4 w-4" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-quantum-particle">Simulation Engine</span>
                  <span className="text-xs text-quantum-glow">98%</span>
                </div>
                <Progress value={98} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-quantum-particle">QFS Sync</span>
                  <span className="text-xs text-quantum-glow">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-quantum-particle">AI Services</span>
                  <span className="text-xs text-quantum-glow">95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
            </div>

            <div className="pt-2 border-t border-quantum-neon/10">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-quantum-particle">Memory Usage</div>
                  <div className="text-quantum-glow font-medium">2.1 GB</div>
                </div>
                <div>
                  <div className="text-quantum-particle">CPU Load</div>
                  <div className="text-quantum-glow font-medium">15%</div>
                </div>
                <div>
                  <div className="text-quantum-particle">Network</div>
                  <div className="text-quantum-glow font-medium">125ms</div>
                </div>
                <div>
                  <div className="text-quantum-particle">Storage</div>
                  <div className="text-quantum-glow font-medium">78%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-quantum-neon/20 bg-quantum-matrix/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-quantum-glow flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded bg-quantum-void/20">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-quantum-glow">Bell State Circuit</div>
                  <div className="text-xs text-quantum-particle">Visual → Python SDK</div>
                </div>
                <div className="text-xs text-quantum-energy">2m</div>
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded bg-quantum-void/20">
                <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-quantum-glow">Grover Algorithm</div>
                  <div className="text-xs text-quantum-particle">JavaScript → Circuit</div>
                </div>
                <div className="text-xs text-quantum-energy">5m</div>
              </div>
              
              <div className="flex items-center gap-3 p-2 rounded bg-quantum-void/20">
                <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-quantum-glow">QFT Optimization</div>
                  <div className="text-xs text-quantum-particle">AI suggestions applied</div>
                </div>
                <div className="text-xs text-quantum-energy">8m</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
