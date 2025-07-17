
import React, { useState } from "react";
import { Users, Plus, Mail, Shield, Clock, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCircuitSharing } from "@/hooks/useCircuitSharing";
import { useToast } from "@/hooks/use-toast";

interface CollaborationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circuitId: string;
  circuitName: string;
}

export function CollaborationDialog({ open, onOpenChange, circuitId, circuitName }: CollaborationDialogProps) {
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] = useState<"view" | "edit" | "admin">("edit");
  const [sharePermission, setSharePermission] = useState<"view" | "edit">("view");
  const [shareExpires, setShareExpires] = useState<string>("never");
  
  const { createShareLink, inviteCollaborator, loading } = useCircuitSharing();
  const { toast } = useToast();

  const handleCreateShareLink = async () => {
    const expiresIn = shareExpires === "never" ? undefined : parseInt(shareExpires);
    const result = await createShareLink(circuitId, sharePermission, expiresIn);
    
    if (result?.shareUrl) {
      navigator.clipboard.writeText(result.shareUrl);
      toast({
        title: "Share link created!",
        description: "Link copied to clipboard",
      });
    }
  };

  const handleInviteCollaborator = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }

    const success = await inviteCollaborator(circuitId, inviteEmail, invitePermission);
    if (success) {
      setInviteEmail("");
      toast({
        title: "Invitation sent!",
        description: `Invited ${inviteEmail} to collaborate`,
      });
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "admin": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "edit": return "bg-quantum-glow/10 text-quantum-glow border-quantum-glow/20";
      case "view": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="quantum-panel border-quantum-glow/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-quantum-glow flex items-center gap-2">
            <Users className="w-5 h-5" />
            Collaborate on "{circuitName}"
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="share" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="share">Share Link</TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Permission Level</Label>
                <Select value={sharePermission} onValueChange={(value: "view" | "edit") => setSharePermission(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        View Only
                      </div>
                    </SelectItem>
                    <SelectItem value="edit">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Can Edit
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Link Expires</Label>
                <Select value={shareExpires} onValueChange={setShareExpires}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="24">24 Hours</SelectItem>
                    <SelectItem value="168">1 Week</SelectItem>
                    <SelectItem value="720">1 Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCreateShareLink} 
                disabled={loading}
                className="w-full bg-quantum-glow hover:bg-quantum-glow/80 text-black"
              >
                <Clock className="w-4 h-4 mr-2" />
                Create Share Link
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="collaborators" className="space-y-4">
            <div className="space-y-4">
              <div className="p-4 border border-quantum-glow/20 rounded-lg space-y-3">
                <h3 className="font-medium text-quantum-glow">Invite New Collaborator</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="collaborator@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Permission Level</Label>
                  <Select value={invitePermission} onValueChange={(value: "view" | "edit" | "admin") => setInvitePermission(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View Only</SelectItem>
                      <SelectItem value="edit">Can Edit</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleInviteCollaborator} 
                  disabled={loading || !inviteEmail.trim()}
                  className="w-full"
                  variant="outline"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium text-quantum-glow">Current Collaborators</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-quantum-glow/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-quantum-glow/20 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-quantum-glow" />
                      </div>
                      <div>
                        <div className="font-medium">You (Owner)</div>
                        <div className="text-sm text-muted-foreground">Full access</div>
                      </div>
                    </div>
                    <Badge className={getPermissionColor("admin")}>
                      Admin
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
