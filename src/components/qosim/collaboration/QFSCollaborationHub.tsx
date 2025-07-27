
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  GitBranch, 
  Clock, 
  Share2,
  Eye,
  Edit,
  Star,
  Activity
} from 'lucide-react';

export function QFSCollaborationHub() {
  const [activeProject, setActiveProject] = useState('bell-state-optimizer');

  const projects = [
    {
      id: 'bell-state-optimizer',
      name: 'Bell State Optimizer',
      description: 'Optimizing Bell state generation circuits',
      collaborators: 4,
      lastActivity: '2 hours ago',
      status: 'active'
    },
    {
      id: 'grovers-implementation',
      name: 'Grover\'s Implementation',
      description: 'Collaborative Grover\'s algorithm development',
      collaborators: 2,
      lastActivity: '1 day ago',
      status: 'review'
    }
  ];

  const collaborators = [
    { id: 1, name: 'Alice Cooper', role: 'Project Lead', avatar: '', online: true },
    { id: 2, name: 'Bob Wilson', role: 'Quantum Engineer', avatar: '', online: true },
    { id: 3, name: 'Carol Davis', role: 'Algorithm Specialist', avatar: '', online: false },
    { id: 4, name: 'David Miller', role: 'Code Reviewer', avatar: '', online: true }
  ];

  const activities = [
    { id: 1, user: 'Alice Cooper', action: 'Updated circuit depth optimization', time: '2 hours ago' },
    { id: 2, user: 'Bob Wilson', action: 'Added error correction gates', time: '4 hours ago' },
    { id: 3, user: 'Carol Davis', action: 'Commented on gate placement', time: '6 hours ago' },
    { id: 4, user: 'David Miller', action: 'Approved merge request', time: '8 hours ago' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">QFS Collaboration Hub</h2>
          <p className="text-muted-foreground">Real-time collaboration on quantum projects</p>
        </div>
        <Button>
          <Share2 className="w-4 h-4 mr-2" />
          Create Project
        </Button>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map(project => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{project.name}</CardTitle>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{project.collaborators} collaborators</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{project.lastActivity}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => setActiveProject(project.id)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Open Project
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Create Branch
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Start Discussion
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Circuit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collaborators.map(collaborator => (
                  <div key={collaborator.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={collaborator.avatar} />
                          <AvatarFallback>
                            {collaborator.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                          collaborator.online ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div>
                        <div className="font-medium">{collaborator.name}</div>
                        <div className="text-sm text-muted-foreground">{collaborator.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {collaborator.online ? 'Online' : 'Offline'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex gap-2">
                  <Input placeholder="Invite by email..." className="flex-1" />
                  <Button>Invite</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {' '}
                        <span>{activity.action}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Collaboration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Notifications</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Email notifications for comments</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Real-time collaboration alerts</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">Weekly project summaries</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Permissions</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Allow circuit sharing</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Enable version control</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" />
                    <span className="text-sm">Public project visibility</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
