import { useState } from "react";
import { QFSFile } from "@/lib/qfs/qfsCore";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Eye, Edit, Play, Share2, Globe } from "lucide-react";

interface QFSPermissionManagerProps {
  files: QFSFile[];
  selectedFile: string | null;
  onClose: () => void;
}

export function QFSPermissionManager({ files, selectedFile, onClose }: QFSPermissionManagerProps) {
  const [selectedFileId, setSelectedFileId] = useState(selectedFile || '');
  
  const file = files.find(f => f.id === selectedFileId);

  const permissionIcons = {
    readable: Eye,
    writable: Edit,
    executable: Play,
    shared: Share2,
    public: Globe
  };

  const getPermissionColor = (enabled: boolean) => 
    enabled ? 'text-green-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      {/* File Selection */}
      <div className="space-y-2">
        <Label htmlFor="file-select">Select File</Label>
        <Select value={selectedFileId} onValueChange={setSelectedFileId}>
          <SelectTrigger className="quantum-input">
            <SelectValue placeholder="Choose a file to manage permissions" />
          </SelectTrigger>
          <SelectContent className="quantum-panel border-quantum-glow/30">
            {files.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                <div className="flex items-center gap-2">
                  <span>{f.name}</span>
                  <Badge variant="secondary" className="text-xs">{f.type}</Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {file && (
        <>
          {/* File Information */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow flex items-center gap-2">
                <Lock className="w-5 h-5" />
                {file.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 font-medium">{file.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Size:</span>
                  <span className="ml-2 font-medium">{file.sizeDisplay}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="ml-2 font-medium">{file.permissions.owner}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Version:</span>
                  <span className="ml-2 font-medium">{file.metadata.version}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Permissions Overview */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Current Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(file.permissions).map(([key, enabled]) => {
                  if (key === 'owner') return null;
                  
                  const Icon = permissionIcons[key as keyof typeof permissionIcons];
                  return (
                    <div key={key} className="flex flex-col items-center gap-2 p-3 rounded-lg border border-muted/20">
                      <Icon className={`w-6 h-6 ${getPermissionColor(enabled)}`} />
                      <span className="text-sm font-medium capitalize">{key}</span>
                      <Badge 
                        variant={enabled ? "default" : "secondary"}
                        className={enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                      >
                        {enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Permission Controls */}
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Modify Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Basic Permissions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Basic Permissions</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="readable">Readable</Label>
                        <p className="text-xs text-muted-foreground">Allow viewing file content</p>
                      </div>
                    </div>
                    <Switch
                      id="readable"
                      checked={file.permissions.readable}
                      onCheckedChange={(checked) => {
                        // Handle permission change
                        console.log('Toggle readable:', checked);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="writable">Writable</Label>
                        <p className="text-xs text-muted-foreground">Allow modifying file content</p>
                      </div>
                    </div>
                    <Switch
                      id="writable"
                      checked={file.permissions.writable}
                      onCheckedChange={(checked) => {
                        console.log('Toggle writable:', checked);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Play className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="executable">Executable</Label>
                        <p className="text-xs text-muted-foreground">Allow running/executing file</p>
                      </div>
                    </div>
                    <Switch
                      id="executable"
                      checked={file.permissions.executable}
                      onCheckedChange={(checked) => {
                        console.log('Toggle executable:', checked);
                      }}
                    />
                  </div>
                </div>

                {/* Sharing Permissions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Sharing Permissions</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Share2 className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="shared">Shared</Label>
                        <p className="text-xs text-muted-foreground">Allow sharing with specific users</p>
                      </div>
                    </div>
                    <Switch
                      id="shared"
                      checked={file.permissions.shared}
                      onCheckedChange={(checked) => {
                        console.log('Toggle shared:', checked);
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="public">Public</Label>
                        <p className="text-xs text-muted-foreground">Make publicly accessible</p>
                      </div>
                    </div>
                    <Switch
                      id="public"
                      checked={file.permissions.public}
                      onCheckedChange={(checked) => {
                        console.log('Toggle public:', checked);
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button className="bg-quantum-glow text-black">
              Save Permissions
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}