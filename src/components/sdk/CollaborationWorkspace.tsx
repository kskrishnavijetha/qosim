
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, GitBranch, MessageSquare, Share2, Plus, Eye, Edit, Clock, Star } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  collaborators: string[];
  lastModified: string;
  branches: number;
  stars: number;
  isPublic: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: 'Owner' | 'Collaborator' | 'Viewer';
  avatar: string;
  lastActive: string;
}

const projects: Project[] = [
  {
    id: 'vqe-molecules',
    name: 'VQE for Molecules',
    description: 'Collaborative VQE implementation for various molecules',
    owner: 'alice_quantum',
    collaborators: ['bob_dev', 'charlie_chem'],
    lastModified: '2 hours ago',
    branches: 3,
    stars: 24,
    isPublic: true
  },
  {
    id: 'quantum-ml',
    name: 'Quantum ML Library',
    description: 'Machine learning algorithms on quantum computers',
    owner: 'ml_team',
    collaborators: ['alice_quantum', 'david_ml'],
    lastModified: '1 day ago',
    branches: 7,
    stars: 156,
    isPublic: true
  },
  {
    id: 'error-correction',
    name: 'Error Correction Codes',
    description: 'Implementation of various quantum error correction codes',
    owner: 'alice_quantum',
    collaborators: ['eve_error'],
    lastModified: '3 days ago',
    branches: 2,
    stars: 89,
    isPublic: false
  }
];

const teamMembers: TeamMember[] = [
  {
    id: 'alice_quantum',
    name: 'Alice Quantum',
    role: 'Owner',
    avatar: 'AQ',
    lastActive: '2 minutes ago'
  },
  {
    id: 'bob_dev',
    name: 'Bob Developer',
    role: 'Collaborator',
    avatar: 'BD',
    lastActive: '1 hour ago'
  },
  {
    id: 'charlie_chem',
    name: 'Charlie Chemist',
    role: 'Collaborator',
    avatar: 'CC',
    lastActive: '3 hours ago'
  },
  {
    id: 'david_ml',
    name: 'David ML',
    role: 'Viewer',
    avatar: 'DM',
    lastActive: '1 day ago'
  }
];

export function CollaborationWorkspace() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-quantum-glow">Collaboration Workspace</h2>
          <p className="text-quantum-neon">Work together on quantum algorithms and circuits</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="neon-border">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-quantum-void border-quantum-neon">
            <DialogHeader>
              <DialogTitle className="text-quantum-glow">Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-quantum-neon mb-2">
                  Project Name
                </label>
                <Input placeholder="Enter project name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-quantum-neon mb-2">
                  Description
                </label>
                <Input placeholder="Brief description of the project" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-quantum-neon mb-2">
                    Visibility
                  </label>
                  <select className="w-full p-2 border border-quantum-neon/20 rounded bg-quantum-matrix/30">
                    <option>Public</option>
                    <option>Private</option>
                    <option>Team Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-quantum-neon mb-2">
                    Template
                  </label>
                  <select className="w-full p-2 border border-quantum-neon/20 rounded bg-quantum-matrix/30">
                    <option>Empty Project</option>
                    <option>Algorithm Library</option>
                    <option>Research Project</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="neon-border">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Card key={project.id} className="quantum-panel neon-border hover:shadow-lg hover:shadow-quantum-glow/10 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-quantum-glow">{project.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Badge variant={project.isPublic ? 'default' : 'outline'}>
                        {project.isPublic ? 'Public' : 'Private'}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-quantum-neon mt-2">{project.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-quantum-particle" />
                      <span className="text-quantum-neon">{project.collaborators.length + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-quantum-particle" />
                      <span className="text-quantum-neon">{project.branches}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-quantum-particle" />
                      <span className="text-quantum-neon">{project.stars}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-quantum-neon">by {project.owner}</span>
                    <span className="text-xs text-quantum-particle">•</span>
                    <span className="text-xs text-quantum-particle">{project.lastModified}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {project.collaborators.slice(0, 3).map((collaborator, index) => (
                        <Avatar key={index} className="w-6 h-6 border-2 border-quantum-void">
                          <AvatarFallback className="text-xs bg-quantum-matrix text-quantum-neon">
                            {collaborator.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    {project.collaborators.length > 3 && (
                      <span className="text-xs text-quantum-particle">
                        +{project.collaborators.length - 3} more
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setSelectedProject(project)}
                      className="flex-1 neon-border" 
                      variant="outline"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-lg text-quantum-glow">Team Members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-quantum-matrix/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-quantum-glow text-quantum-void">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-quantum-glow">{member.name}</div>
                        <div className="text-xs text-quantum-particle">{member.lastActive}</div>
                      </div>
                    </div>
                    <Badge variant={member.role === 'Owner' ? 'default' : 'outline'}>
                      {member.role}
                    </Badge>
                  </div>
                ))}
                
                <Button className="w-full neon-border" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </CardContent>
            </Card>

            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-lg text-quantum-glow">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-quantum-glow rounded-full mt-2"></div>
                    <div>
                      <div className="text-sm text-quantum-neon">
                        <strong>Alice Quantum</strong> pushed to main branch
                      </div>
                      <div className="text-xs text-quantum-particle">2 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-quantum-neon rounded-full mt-2"></div>
                    <div>
                      <div className="text-sm text-quantum-neon">
                        <strong>Bob Developer</strong> created new branch: feature/grovers-optimization
                      </div>
                      <div className="text-xs text-quantum-particle">5 hours ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-quantum-particle rounded-full mt-2"></div>
                    <div>
                      <div className="text-sm text-quantum-neon">
                        <strong>Charlie Chemist</strong> commented on VQE implementation
                      </div>
                      <div className="text-xs text-quantum-particle">1 day ago</div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-lg text-quantum-glow">Project Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    user: 'Alice Quantum',
                    action: 'committed changes to',
                    target: 'VQE for Molecules',
                    time: '2 hours ago',
                    details: 'Fixed convergence issue in optimization loop'
                  },
                  {
                    user: 'Bob Developer',
                    action: 'created branch',
                    target: 'feature/grovers-optimization',
                    time: '5 hours ago',
                    details: 'Working on amplitude amplification improvements'
                  },
                  {
                    user: 'Charlie Chemist',
                    action: 'opened discussion in',
                    target: 'Quantum ML Library',
                    time: '1 day ago',
                    details: 'Question about molecular orbital calculations'
                  },
                  {
                    user: 'David ML',
                    action: 'starred',
                    target: 'Error Correction Codes',
                    time: '2 days ago',
                    details: 'Interested in surface code implementation'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-quantum-matrix/20 rounded-lg">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-quantum-glow text-quantum-void">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm text-quantum-neon">
                        <strong>{activity.user}</strong> {activity.action} <strong>{activity.target}</strong>
                      </div>
                      <div className="text-xs text-quantum-particle mt-1">{activity.details}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Clock className="w-3 h-3 text-quantum-particle" />
                        <span className="text-xs text-quantum-particle">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-lg text-quantum-glow">Workspace Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-quantum-neon mb-2">
                      Default Visibility
                    </label>
                    <select className="w-full p-2 border border-quantum-neon/20 rounded bg-quantum-matrix/30">
                      <option>Public</option>
                      <option>Private</option>
                      <option>Team Only</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-quantum-neon mb-2">
                      Auto-save Interval
                    </label>
                    <select className="w-full p-2 border border-quantum-neon/20 rounded bg-quantum-matrix/30">
                      <option>30 seconds</option>
                      <option>1 minute</option>
                      <option>5 minutes</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-quantum-neon mb-2">
                      Default Branch Protection
                    </label>
                    <select className="w-full p-2 border border-quantum-neon/20 rounded bg-quantum-matrix/30">
                      <option>None</option>
                      <option>Require Reviews</option>
                      <option>Require Tests</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-quantum-neon mb-2">
                      Notification Preferences
                    </label>
                    <select className="w-full p-2 border border-quantum-neon/20 rounded bg-quantum-matrix/30">
                      <option>All Activities</option>
                      <option>Important Only</option>
                      <option>Disabled</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline">Reset to Defaults</Button>
                <Button className="neon-border">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
