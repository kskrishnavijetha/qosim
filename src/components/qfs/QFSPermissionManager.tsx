
import { useState } from "react";
import { QFSFile } from "@/lib/qfs/qfsCore";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Eye, Edit, Play, Share2, Globe, ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface QFSPermissionManagerProps {
  files: QFSFile[];
  selectedFile: string | null;
  onClose: () => void;
}

export function QFSPermissionManager({ files, selectedFile, onClose }: QFSPermissionManagerProps) {
  const [selectedFileId, setSelectedFileId] = useState(selectedFile || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
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

  const handlePermissionChange = async (permission: string, enabled: boolean) => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update file permissions with type safety
      const updatedPermissions = { ...file.permissions };
      if (permission in updatedPermissions && permission !== 'owner') {
        (updatedPermissions as any)[permission] = enabled;
        file.permissions = updatedPermissions;
      }
      
      toast({
        title: "Permission Updated",
        description: `${permission} permission ${enabled ? 'enabled' : 'disabled'} for ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update permission",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkPermissionAction = async (action: string) => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPermissions = { ...file.permissions };
      
      switch (action) {
        case 'grant-all':
          Object.keys(updatedPermissions).forEach(key => {
            if (key !== 'owner') {
              (updatedPermissions as any)[key] = true;
            }
          });
          break;
        case 'revoke-all':
          Object.keys(updatedPermissions).forEach(key => {
            if (key !== 'owner') {
              (updatedPermissions as any)[key] = false;
            }
          });
          break;
        case 'readonly':
          (updatedPermissions as any).readable = true;
          (updatedPermissions as any).writable = false;
          (updatedPermissions as any).executable = false;
          break;
        case 'readwrite':
          (updatedPermissions as any).readable = true;
          (updatedPermissions as any).writable = true;
          (updatedPermissions as any).executable = false;
          break;
      }
      
      file.permissions = updatedPermissions;
      
      toast({
        title: "Bulk Action Complete",
        description: `Applied ${action} to ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply bulk action",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const savePermissions = async () => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Permissions Saved",
        description: `Successfully saved permissions for ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save permissions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      {/* File Selection */}
      <div className="space-y-2">
        <Label htmlFor="file-select">Select File</Label>
        <Select value={selectedFileId} onValueChange={setSelectedFileId}>
          <SelectTrigger className="quantum-input">
            <SelectValue placeholder="Choose a file to manage permissions" />
          </SelectTrigger>
          <SelectContent className="quantum-panel border-quantum-glow/30 bg-background z-[100]">
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
            <CardHeader className="pb-3">
              <CardTitle className="text-quantum-glow flex items-center gap-2 text-lg">
                <Lock className="w-4 h-4" />
                {file.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-3 text-sm">
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

          {/* Quick Actions Dropdown */}
          <Card className="quantum-panel neon-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-quantum-glow flex items-center justify-between text-lg">
                Quick Actions
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isLoading}>
                      Bulk Actions
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="quantum-panel border-quantum-glow/30 bg-background z-[100]">
                    <DropdownMenuItem onClick={() => handleBulkPermissionAction('grant-all')}>
                      <Unlock className="w-4 h-4 mr-2" />
                      Grant All Permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkPermissionAction('revoke-all')}>
                      <Lock className="w-4 h-4 mr-2" />
                      Revoke All Permissions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleBulkPermissionAction('readonly')}>
                      <Eye className="w-4 h-4 mr-2" />
                      Set Read-Only
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkPermissionAction('readwrite')}>
                      <Edit className="w-4 h-4 mr-2" />
                      Set Read-Write
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Current Permissions Overview */}
          <Card className="quantum-panel neon-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-quantum-glow text-lg">Current Permissions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(file.permissions).map(([key, enabled]) => {
                  if (key === 'owner') return null;
                  
                  const Icon = permissionIcons[key as keyof typeof permissionIcons];
                  return (
                    <div key={key} className="flex flex-col items-center gap-2 p-2 rounded-lg border border-muted/20">
                      <Icon className={`w-5 h-5 ${getPermissionColor(Boolean(enabled))}`} />
                      <span className="text-xs font-medium capitalize">{key}</span>
                      <Badge 
                        variant={enabled ? "default" : "secondary"}
                        className={`text-xs ${enabled ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
                      >
                        {enabled ? 'On' : 'Off'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Permission Controls */}
          <Card className="quantum-panel neon-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-quantum-glow text-lg">Modify Permissions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                {/* Basic Permissions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Basic Permissions</h4>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="readable" className="text-sm">Readable</Label>
                        <p className="text-xs text-muted-foreground">Allow viewing file content</p>
                      </div>
                    </div>
                    <Switch
                      id="readable"
                      checked={Boolean((file.permissions as any).readable)}
                      onCheckedChange={(checked) => handlePermissionChange('readable', checked)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="writable" className="text-sm">Writable</Label>
                        <p className="text-xs text-muted-foreground">Allow modifying file content</p>
                      </div>
                    </div>
                    <Switch
                      id="writable"
                      checked={Boolean((file.permissions as any).writable)}
                      onCheckedChange={(checked) => handlePermissionChange('writable', checked)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Play className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="executable" className="text-sm">Executable</Label>
                        <p className="text-xs text-muted-foreground">Allow running/executing file</p>
                      </div>
                    </div>
                    <Switch
                      id="executable"
                      checked={Boolean((file.permissions as any).executable)}
                      onCheckedChange={(checked) => handlePermissionChange('executable', checked)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Sharing Permissions */}
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Sharing Permissions</h4>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Share2 className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="shared" className="text-sm">Shared</Label>
                        <p className="text-xs text-muted-foreground">Allow sharing with specific users</p>
                      </div>
                    </div>
                    <Switch
                      id="shared"
                      checked={Boolean((file.permissions as any).shared)}
                      onCheckedChange={(checked) => handlePermissionChange('shared', checked)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <Label htmlFor="public" className="text-sm">Public</Label>
                        <p className="text-xs text-muted-foreground">Make publicly accessible</p>
                      </div>
                    </div>
                    <Switch
                      id="public"
                      checked={Boolean((file.permissions as any).public)}
                      onCheckedChange={(checked) => handlePermissionChange('public', checked)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button 
              className="bg-quantum-glow text-black hover:bg-quantum-glow/80"
              onClick={savePermissions}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Permissions'}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
