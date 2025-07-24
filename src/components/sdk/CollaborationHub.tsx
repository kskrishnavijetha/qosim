
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Plus, 
  GitBranch, 
  MessageSquare, 
  Share, 
  GitMerge,
  Clock,
  Star,
  Eye
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  owner: {
    name: string;
    avatar: string;
  };
  collaborators: number;
  lastActivity: string;
  status: 'active' | 'archived' | 'draft';
  visibility: 'public' | 'private';
  stars: number;
  forks: number;
  tags: string[];
}

const collaborationProjects: Project[] = [
  {
    id: 'quantum-ml-research',
    name: 'Quantum ML Research',
    description: 'Collaborative research on quantum machine learning algorithms',
    owner: {
      name: 'Dr. Alice Chen',
      avatar: '/api/placeholder/32/32'
    },
    collaborators: 8,
    lastActivity: '2 hours ago',
    status: 'active',
    visibility: 'public',
    stars: 45,
    forks: 12,
    tags: ['research', 'ml', 'collaboration']
  },
  {
    id: 'qaoa-portfolio',
    name: 'QAOA Portfolio Optimization',
    description: 'Team project implementing QAOA for financial portfolio optimization',
    owner: {
      name: 'QuantumFinance Team',
      avatar: '/api/placeholder/32/32'
    },
    collaborators: 5,
    lastActivity: '1 day ago',
    status: 'active',
    visibility: 'private',
    stars: 23,
    forks: 7,
    tags: ['finance', 'qaoa', 'optimization']
  },
  {
    id: 'error-correction-study',
    name: 'Error Correction Study Group',
    description: 'Study group focused on quantum error correction implementations',
    owner: {
      name: 'QEC Study Group',
      avatar: '/api/placeholder/32/32'
    },
    collaborators: 12,
    lastActivity: '3 days ago',
    status: 'active',
    visibility: 'public',
    stars: 67,
    forks: 19,
    tags: ['education', 'error-correction', 'study-group']
  }
];

export function CollaborationHub() {
  const [selectedTab, setSelectedTab] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = collaborationProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'archived': return 'bg-gray-500';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getVisibilityColor = (visibility: string) => {
    return visibility === 'public' ? 'text-green-500' : 'text-orange-500';
  };

  return (
    <div className="space-y-6">
      {/* Collaboration Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl text-quantum-glow flex items-center gap-3">
            <Users className="w-6 h-6" />
            Collaboration Hub
            <Badge variant="outline" className="text-quantum-energy">
              Team Workspaces
            </Badge>
          </CardTitle>
          <p className="text-quantum-particle">
            Collaborate on quantum projects with Git-style version control and team management
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search projects, teams, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-quantum-matrix border-quantum-neon/30"
            />
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Join Team
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 quantum-tabs">
          <TabsTrigger value="projects" className="quantum-tab">
            <GitBranch className="w-4 h-4 mr-2" />
            Projects ({filteredProjects.length})
          </TabsTrigger>
          <TabsTrigger value="teams" className="quantum-tab">
            <Users className="w-4 h-4 mr-2" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="discussions" className="quantum-tab">
            <MessageSquare className="w-4 h-4 mr-2" />
            Discussions
          </TabsTrigger>
          <TabsTrigger value="activity" className="quantum-tab">
            <Clock className="w-4 h-4 mr-2" />
            Activity Feed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          <div className="space-y-4">
            {filteredProjects.map(project => (
              <Card key={project.id} className="quantum-panel neon-border hover:neon-glow transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-quantum-glow">{project.name}</h3>
                        <Badge className={`text-white ${getStatusColor(project.status)}`}>
                          {project.status}
                        </Badge>
                        <Badge variant={project.visibility === 'public' ? 'default' : 'secondary'}>
                          <Eye className={`w-3 h-3 mr-1 ${getVisibilityColor(project.visibility)}`} />
                          {project.visibility}
                        </Badge>
                      </div>
                      
                      <p className="text-quantum-particle mb-4">{project.description}</p>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={project.owner.avatar} />
                            <AvatarFallback>{project.owner.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-quantum-particle">{project.owner.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-quantum-particle">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {project.collaborators} collaborators
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            {project.stars}
                          </span>
                          <span className="flex items-center gap-1">
                            <GitBranch className="w-4 h-4" />
                            {project.forks} forks
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {project.lastActivity}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="ml-6 flex gap-2">
                      <Button size="sm">
                        <GitBranch className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <GitMerge className="w-4 h-4 mr-1" />
                        Fork
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-lg text-quantum-glow">Quantum Research Lab</CardTitle>
                <p className="text-sm text-quantum-particle">Academic research collaboration</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-quantum-matrix">
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <Badge variant="secondary">15 members</Badge>
                </div>
                <div className="space-y-2 text-sm text-quantum-particle">
                  <div>• 5 active projects</div>
                  <div>• Quantum ML focus</div>
                  <div>• Weekly meetings</div>
                </div>
                <Button className="w-full mt-4" size="sm">
                  Request to Join
                </Button>
              </CardContent>
            </Card>
            
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-lg text-quantum-glow">Industry Quantum Alliance</CardTitle>
                <p className="text-sm text-quantum-particle">Industry collaboration network</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-quantum-matrix">
                        <AvatarFallback>C{i}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <Badge variant="secondary">42 members</Badge>
                </div>
                <div className="space-y-2 text-sm text-quantum-particle">
                  <div>• Commercial applications</div>
                  <div>• Cross-industry projects</div>
                  <div>• Monthly showcases</div>
                </div>
                <Button className="w-full mt-4" size="sm">
                  Request to Join
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="discussions" className="space-y-6">
          <div className="space-y-4">
            {[
              {
                title: "Best practices for quantum error correction",
                author: "Dr. Alice Chen",
                replies: 23,
                lastActivity: "2 hours ago",
                tags: ["error-correction", "best-practices"]
              },
              {
                title: "QAOA parameter optimization strategies",
                author: "Bob Martinez",
                replies: 15,
                lastActivity: "1 day ago",
                tags: ["qaoa", "optimization", "parameters"]
              },
              {
                title: "Comparing quantum simulators performance",
                author: "QuantumDev Team",
                replies: 31,
                lastActivity: "3 days ago",
                tags: ["performance", "simulators", "benchmarking"]
              }
            ].map((discussion, index) => (
              <Card key={index} className="quantum-panel neon-border hover:neon-glow transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg text-quantum-glow mb-2">{discussion.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-quantum-particle mb-2">
                        <span>by {discussion.author}</span>
                        <span>{discussion.replies} replies</span>
                        <span>{discussion.lastActivity}</span>
                      </div>
                      <div className="flex gap-1">
                        {discussion.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <MessageSquare className="w-5 h-5 text-quantum-neon" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="space-y-4">
            {[
              {
                user: "Dr. Alice Chen",
                action: "pushed 3 commits to",
                target: "quantum-ml-research",
                time: "2 hours ago",
                type: "commit"
              },
              {
                user: "Bob Martinez",
                action: "opened a pull request in",
                target: "qaoa-portfolio",
                time: "4 hours ago",
                type: "pr"
              },
              {
                user: "QuantumTeam",
                action: "created a new project",
                target: "quantum-cryptography",
                time: "1 day ago",
                type: "project"
              },
              {
                user: "Sarah Johnson",
                action: "joined the team",
                target: "Quantum Research Lab",
                time: "2 days ago",
                type: "team"
              }
            ].map((activity, index) => (
              <Card key={index} className="quantum-panel neon-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{activity.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <span className="text-quantum-neon font-medium">{activity.user}</span>
                      <span className="text-quantum-particle"> {activity.action} </span>
                      <span className="text-quantum-glow font-medium">{activity.target}</span>
                      <div className="text-sm text-quantum-particle">{activity.time}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
