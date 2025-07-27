
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  GitBranch, 
  MessageSquare, 
  Clock,
  Eye,
  Edit,
  Share,
  Download,
  Upload,
  Merge,
  History
} from 'lucide-react';

export function QFSCollaborationHub() {
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState('');

  const branches = [
    { name: 'main', commits: 15, lastUpdate: '2 hours ago', author: 'user@example.com' },
    { name: 'feature/bell-optimization', commits: 8, lastUpdate: '1 day ago', author: 'dev@example.com' },
    { name: 'bugfix/entanglement-error', commits: 3, lastUpdate: '3 days ago', author: 'qa@example.com' }
  ];

  const commits = [
    {
      id: 'a1b2c3d',
      message: 'Optimize Bell state generation',
      author: 'user@example.com',
      timestamp: '2 hours ago',
      changes: '+15 -3'
    },
    {
      id: 'e4f5g6h',
      message: 'Fix entanglement measurement bug',
      author: 'dev@example.com',
      timestamp: '1 day ago',
      changes: '+8 -12'
    },
    {
      id: 'i7j8k9l',
      message: 'Add error correction gates',
      author: 'qa@example.com',
      timestamp: '3 days ago',
      changes: '+25 -5'
    }
  ];

  const collaborators = [
    { name: 'Alice Johnson', role: 'Lead Developer', status: 'online', avatar: '👩‍💻' },
    { name: 'Bob Smith', role: 'Quantum Researcher', status: 'offline', avatar: '👨‍🔬' },
    { name: 'Carol Davis', role: 'QA Engineer', status: 'online', avatar: '👩‍🔧' }
  ];

  const pullRequests = [
    {
      id: 'pr-001',
      title: 'Implement advanced error correction',
      author: 'Alice Johnson',
      branch: 'feature/error-correction',
      status: 'open',
      reviews: 2,
      changes: '+45 -12'
    },
    {
      id: 'pr-002',
      title: 'Optimize quantum gate sequences',
      author: 'Bob Smith',
      branch: 'feature/gate-optimization',
      status: 'review',
      reviews: 1,
      changes: '+23 -8'
    }
  ];

  const discussions = [
    {
      id: 'disc-001',
      title: 'Best practices for NISQ algorithms',
      author: 'Alice Johnson',
      replies: 5,
      lastReply: '30 min ago',
      category: 'General'
    },
    {
      id: 'disc-002',
      title: 'Error mitigation strategies',
      author: 'Carol Davis',
      replies: 8,
      lastReply: '2 hours ago',
      category: 'Technical'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Collaboration Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-quantum-glow">QFS Collaboration Hub</h2>
          <p className="text-quantum-particle">
            Quantum File System with version control and team collaboration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="neon-border">
            <Upload className="w-4 h-4 mr-2" />
            Push
          </Button>
          <Button variant="outline" className="neon-border">
            <Download className="w-4 h-4 mr-2" />
            Pull
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <GitBranch className="w-8 h-8 text-quantum-glow" />
              <div>
                <div className="text-2xl font-bold text-quantum-neon">3</div>
                <div className="text-sm text-quantum-particle">Active Branches</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-quantum-glow" />
              <div>
                <div className="text-2xl font-bold text-quantum-neon">3</div>
                <div className="text-sm text-quantum-particle">Collaborators</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-quantum-glow" />
              <div>
                <div className="text-2xl font-bold text-quantum-neon">2</div>
                <div className="text-sm text-quantum-particle">Pull Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel neon-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-quantum-glow" />
              <div>
                <div className="text-2xl font-bold text-quantum-neon">26</div>
                <div className="text-sm text-quantum-particle">Total Commits</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Collaboration Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Branches */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <GitBranch className="w-5 h-5" />
                Branches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {branches.map((branch) => (
                  <div key={branch.name} className="flex items-center justify-between p-3 bg-quantum-matrix/30 rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`neon-border ${branch.name === selectedBranch ? 'text-quantum-glow' : ''}`}>
                        {branch.name}
                      </Badge>
                      <div>
                        <div className="text-sm text-quantum-neon">{branch.commits} commits</div>
                        <div className="text-xs text-quantum-particle">
                          by {branch.author} • {branch.lastUpdate}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={branch.name === selectedBranch ? 'default' : 'outline'}
                        className="neon-border"
                        onClick={() => setSelectedBranch(branch.name)}
                      >
                        {branch.name === selectedBranch ? 'Current' : 'Switch'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="neon-border"
                      >
                        <Merge className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Commit History */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <History className="w-5 h-5" />
                Recent Commits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {commits.map((commit) => (
                  <div key={commit.id} className="flex items-center justify-between p-3 bg-quantum-matrix/30 rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="neon-border font-mono">
                        {commit.id}
                      </Badge>
                      <div>
                        <div className="text-sm text-quantum-neon">{commit.message}</div>
                        <div className="text-xs text-quantum-particle">
                          {commit.author} • {commit.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="neon-border text-xs">
                        {commit.changes}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="neon-border"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pull Requests */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Share className="w-5 h-5" />
                Pull Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pullRequests.map((pr) => (
                  <div key={pr.id} className="flex items-center justify-between p-3 bg-quantum-matrix/30 rounded">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`neon-border ${
                        pr.status === 'open' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {pr.status}
                      </Badge>
                      <div>
                        <div className="text-sm text-quantum-neon">{pr.title}</div>
                        <div className="text-xs text-quantum-particle">
                          {pr.author} • {pr.branch} • {pr.reviews} reviews
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="neon-border text-xs">
                        {pr.changes}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="neon-border"
                      >
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Collaborators */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Users className="w-5 h-5" />
                Collaborators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {collaborators.map((collaborator) => (
                  <div key={collaborator.name} className="flex items-center justify-between p-3 bg-quantum-matrix/30 rounded">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{collaborator.avatar}</div>
                      <div>
                        <div className="text-sm text-quantum-neon">{collaborator.name}</div>
                        <div className="text-xs text-quantum-particle">{collaborator.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        collaborator.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                      }`} />
                      <span className="text-xs text-quantum-particle">
                        {collaborator.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Input
                  placeholder="Commit message..."
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="quantum-input"
                />
                <Button className="w-full neon-border" disabled={!commitMessage.trim()}>
                  <Upload className="w-4 h-4 mr-2" />
                  Commit Changes
                </Button>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full neon-border">
                  <GitBranch className="w-4 h-4 mr-2" />
                  Create Branch
                </Button>
                <Button variant="outline" className="w-full neon-border">
                  <Share className="w-4 h-4 mr-2" />
                  Create PR
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Discussions */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Discussions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {discussions.map((discussion) => (
                  <div key={discussion.id} className="p-3 bg-quantum-matrix/30 rounded">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-sm text-quantum-neon">{discussion.title}</div>
                      <Badge variant="outline" className="neon-border text-xs">
                        {discussion.category}
                      </Badge>
                    </div>
                    <div className="text-xs text-quantum-particle">
                      {discussion.author} • {discussion.replies} replies • {discussion.lastReply}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
