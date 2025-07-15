import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Github, 
  GitBranch, 
  GitCommit, 
  Download, 
  Upload, 
  RotateCw, 
  Settings,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  GitPullRequest
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  updated_at: string;
  default_branch: string;
}

interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  html_url: string;
}

const GitHubIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [repositories, setRepositories] = useState<GitHubRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    // Simulate connection status check
    const checkConnection = () => {
      const connected = localStorage.getItem('github_connected') === 'true';
      setIsConnected(connected);
      
      if (connected) {
        setRepositories([
          {
            id: 1,
            name: 'quantum-circuits',
            full_name: 'user/quantum-circuits',
            private: false,
            html_url: 'https://github.com/user/quantum-circuits',
            updated_at: '2024-01-15T10:30:00Z',
            default_branch: 'main'
          },
          {
            id: 2,
            name: 'qosim-projects',
            full_name: 'user/qosim-projects',
            private: true,
            html_url: 'https://github.com/user/qosim-projects',
            updated_at: '2024-01-14T15:45:00Z',
            default_branch: 'main'
          }
        ]);
      }
    };
    
    checkConnection();
  }, []);

  const connectToGitHub = async () => {
    setLoading(true);
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      localStorage.setItem('github_connected', 'true');
      setIsConnected(true);
      toast({
        description: "Successfully connected to GitHub!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to connect to GitHub",
      });
    } finally {
      setLoading(false);
    }
  };

  const disconnectGitHub = () => {
    localStorage.removeItem('github_connected');
    setIsConnected(false);
    setRepositories([]);
    setSelectedRepo(null);
    setCommits([]);
    toast({
      description: "Disconnected from GitHub",
    });
  };

  const selectRepository = async (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setLoading(true);
    
    try {
      // Simulate fetching commits
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCommits([
        {
          sha: 'abc123',
          commit: {
            message: 'Add Bell state circuit',
            author: {
              name: 'John Doe',
              date: '2024-01-15T10:30:00Z'
            }
          },
          html_url: 'https://github.com/user/quantum-circuits/commit/abc123'
        },
        {
          sha: 'def456',
          commit: {
            message: 'Update quantum algorithms',
            author: {
              name: 'Jane Smith',
              date: '2024-01-14T15:45:00Z'
            }
          },
          html_url: 'https://github.com/user/quantum-circuits/commit/def456'
        }
      ]);
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to fetch repository data",
      });
    } finally {
      setLoading(false);
    }
  };

  const syncWithGitHub = async (action: 'push' | 'pull') => {
    setSyncStatus('syncing');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSyncStatus('success');
      toast({
        description: `Successfully ${action === 'push' ? 'pushed to' : 'pulled from'} GitHub!`,
      });
      
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (error) {
      setSyncStatus('error');
      toast({
        variant: "destructive",
        description: `Failed to ${action} with GitHub`,
      });
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const createRepository = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newRepo = {
        id: Date.now(),
        name: 'new-quantum-project',
        full_name: 'user/new-quantum-project',
        private: false,
        html_url: 'https://github.com/user/new-quantum-project',
        updated_at: new Date().toISOString(),
        default_branch: 'main'
      };
      setRepositories(prev => [newRepo, ...prev]);
      toast({
        description: "Repository created successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to create repository",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your GitHub account to sync quantum circuits with your repositories.
            </AlertDescription>
          </Alert>
          
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Connect to GitHub</h3>
              <p className="text-muted-foreground">
                Sync your quantum circuits with GitHub for version control and collaboration.
              </p>
            </div>
            
            <Button 
              onClick={connectToGitHub} 
              disabled={loading}
              className="w-full max-w-sm"
            >
              <Github className="w-4 h-4 mr-2" />
              {loading ? 'Connecting...' : 'Connect GitHub Account'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <GitBranch className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">Version Control</h4>
              <p className="text-sm text-muted-foreground">
                Track changes to your quantum circuits
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <GitCommit className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">Collaboration</h4>
              <p className="text-sm text-muted-foreground">
                Share circuits with your team
              </p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <RotateCw className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold">Sync</h4>
              <p className="text-sm text-muted-foreground">
                Keep circuits synchronized across devices
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5" />
              GitHub Integration
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            </CardTitle>
            <Button variant="outline" size="sm" onClick={disconnectGitHub}>
              <Settings className="w-4 h-4 mr-2" />
              Disconnect
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Badge 
                  variant={syncStatus === 'success' ? 'default' : syncStatus === 'error' ? 'destructive' : 'outline'}
                >
                  {syncStatus === 'idle' && <Clock className="w-3 h-3 mr-1" />}
                  {syncStatus === 'syncing' && <RotateCw className="w-3 h-3 mr-1 animate-spin" />}
                  {syncStatus === 'success' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {syncStatus === 'error' && <AlertCircle className="w-3 h-3 mr-1" />}
                  {syncStatus === 'idle' ? 'Ready' : 
                   syncStatus === 'syncing' ? 'Syncing' :
                   syncStatus === 'success' ? 'Synced' : 'Error'}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => syncWithGitHub('pull')}
                disabled={syncStatus === 'syncing'}
              >
                <Download className="w-4 h-4 mr-2" />
                Pull
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => syncWithGitHub('push')}
                disabled={syncStatus === 'syncing'}
              >
                <Upload className="w-4 h-4 mr-2" />
                Push
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Repository Management */}
      <Tabs defaultValue="repositories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="repositories">Repositories</TabsTrigger>
          <TabsTrigger value="commits">Recent Commits</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="repositories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Repositories</CardTitle>
                <Button onClick={createRepository} disabled={loading}>
                  <Github className="w-4 h-4 mr-2" />
                  Create New Repository
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repositories.map((repo) => (
                  <div 
                    key={repo.id} 
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedRepo?.id === repo.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => selectRepository(repo)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{repo.name}</h3>
                          {repo.private && (
                            <Badge variant="secondary" className="text-xs">Private</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{repo.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          Updated {new Date(repo.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                        <Badge variant="outline">{repo.default_branch}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Commits</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedRepo ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GitBranch className="w-4 h-4" />
                    Showing commits from <strong>{selectedRepo.name}</strong>
                  </div>
                  {commits.map((commit) => (
                    <div key={commit.sha} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{commit.commit.message}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{commit.commit.author.name}</span>
                            <span>{new Date(commit.commit.author.date).toLocaleDateString()}</span>
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {commit.sha.substring(0, 7)}
                            </code>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={commit.html_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <GitCommit className="w-8 h-8 mx-auto mb-2" />
                  <p>Select a repository to view commits</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Auto-sync interval</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Every 5 minutes</option>
                  <option>Every 15 minutes</option>
                  <option>Every hour</option>
                  <option>Manual only</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Default branch</label>
                <Input placeholder="main" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Commit message template</label>
                <Input placeholder="Update quantum circuit: {circuit_name}" />
              </div>
              
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium">Export circuits on save</h4>
                  <p className="text-xs text-muted-foreground">
                    Automatically export circuits to repository when saved
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GitHubIntegration;