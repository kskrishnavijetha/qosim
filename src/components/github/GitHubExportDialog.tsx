import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Github, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  GitBranch,
  FolderOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GitHubExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circuitName: string;
  circuitData: any;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  default_branch: string;
}

const GitHubExportDialog = ({ open, onOpenChange, circuitName, circuitData }: GitHubExportDialogProps) => {
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [branch, setBranch] = useState('main');
  const [filePath, setFilePath] = useState(`circuits/${circuitName.toLowerCase().replace(/\s+/g, '-')}.json`);
  const [commitMessage, setCommitMessage] = useState(`Add ${circuitName} quantum circuit`);
  const [description, setDescription] = useState('');
  const [exportFormats, setExportFormats] = useState({
    json: true,
    qasm: false,
    python: false,
    markdown: false
  });
  const [createPR, setCreatePR] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const { toast } = useToast();

  // Mock repositories for demonstration
  const repositories: Repository[] = [
    {
      id: 1,
      name: 'quantum-circuits',
      full_name: 'user/quantum-circuits',
      private: false,
      default_branch: 'main'
    },
    {
      id: 2,
      name: 'qosim-projects',
      full_name: 'user/qosim-projects',
      private: true,
      default_branch: 'main'
    },
    {
      id: 3,
      name: 'research-quantum',
      full_name: 'org/research-quantum',
      private: false,
      default_branch: 'develop'
    }
  ];

  const handleExport = async () => {
    if (!selectedRepo) {
      toast({
        variant: "destructive",
        description: "Please select a repository",
      });
      return;
    }

    setLoading(true);

    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      setExportComplete(true);
      toast({
        description: "Circuit exported to GitHub successfully!",
      });

      setTimeout(() => {
        setExportComplete(false);
        onOpenChange(false);
        resetForm();
      }, 2000);

    } catch (error) {
      toast({
        variant: "destructive",
        description: "Failed to export circuit to GitHub",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedRepo('');
    setBranch('main');
    setFilePath(`circuits/${circuitName.toLowerCase().replace(/\s+/g, '-')}.json`);
    setCommitMessage(`Add ${circuitName} quantum circuit`);
    setDescription('');
    setExportFormats({
      json: true,
      qasm: false,
      python: false,
      markdown: false
    });
    setCreatePR(false);
  };

  const selectedRepository = repositories.find(repo => repo.full_name === selectedRepo);

  if (exportComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Export Complete
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Successfully Exported!</h3>
            <p className="text-muted-foreground mb-4">
              Your quantum circuit has been exported to GitHub.
            </p>
            {selectedRepository && (
              <Button variant="outline" asChild>
                <a 
                  href={`https://github.com/${selectedRepository.full_name}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            Export to GitHub
          </DialogTitle>
          <DialogDescription>
            Export your quantum circuit to a GitHub repository
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Repository Selection */}
          <div className="space-y-2">
            <Label htmlFor="repository">Repository</Label>
            <Select value={selectedRepo} onValueChange={setSelectedRepo}>
              <SelectTrigger>
                <SelectValue placeholder="Select a repository" />
              </SelectTrigger>
              <SelectContent>
                {repositories.map((repo) => (
                  <SelectItem key={repo.id} value={repo.full_name}>
                    <div className="flex items-center gap-2">
                      <span>{repo.name}</span>
                      {repo.private && (
                        <Badge variant="secondary" className="text-xs">Private</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Branch Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <div className="relative">
                <GitBranch className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="pl-10"
                  placeholder="main"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filepath">File Path</Label>
              <div className="relative">
                <FolderOpen className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="filepath"
                  value={filePath}
                  onChange={(e) => setFilePath(e.target.value)}
                  className="pl-10"
                  placeholder="circuits/my-circuit.json"
                />
              </div>
            </div>
          </div>

          {/* Export Formats */}
          <div className="space-y-3">
            <Label>Export Formats</Label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(exportFormats).map(([format, checked]) => (
                <div key={format} className="flex items-center space-x-2">
                  <Checkbox
                    id={format}
                    checked={checked}
                    onCheckedChange={(checked) => 
                      setExportFormats(prev => ({ ...prev, [format]: !!checked }))
                    }
                  />
                  <Label htmlFor={format} className="capitalize">
                    {format === 'qasm' ? 'OpenQASM' : format}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Commit Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="commit-message">Commit Message</Label>
              <Input
                id="commit-message"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="Add quantum circuit"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional details about this circuit..."
                rows={3}
              />
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="create-pr"
                checked={createPR}
                onCheckedChange={(checked) => setCreatePR(!!checked)}
              />
              <Label htmlFor="create-pr">Create Pull Request</Label>
            </div>
            
            {createPR && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  A pull request will be created instead of committing directly to the branch.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* File Preview */}
          <div className="space-y-2">
            <Label>Files to be created:</Label>
            <div className="border rounded-lg p-3 space-y-2">
              {exportFormats.json && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{filePath}</span>
                  <Badge variant="outline">JSON</Badge>
                </div>
              )}
              {exportFormats.qasm && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{filePath.replace('.json', '.qasm')}</span>
                  <Badge variant="outline">QASM</Badge>
                </div>
              )}
              {exportFormats.python && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{filePath.replace('.json', '.py')}</span>
                  <Badge variant="outline">Python</Badge>
                </div>
              )}
              {exportFormats.markdown && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="w-4 h-4" />
                  <span>{filePath.replace('.json', '.md')}</span>
                  <Badge variant="outline">Markdown</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Export Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={loading || !selectedRepo}>
              {loading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-pulse" />
                  Exporting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Export to GitHub
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GitHubExportDialog;