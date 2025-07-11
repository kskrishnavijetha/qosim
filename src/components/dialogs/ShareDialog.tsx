import React, { useState } from "react";
import { Share2, Copy, Eye, Edit, Code, Twitter, Linkedin, MessageCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: {
    id: string;
    name: string;
    type: string;
  };
}

export function ShareDialog({ open, onOpenChange, file }: ShareDialogProps) {
  const [isEditable, setIsEditable] = useState(false);
  const [expiresIn, setExpiresIn] = useState("never");
  const [shareUrl, setShareUrl] = useState("");
  const [embedCode, setEmbedCode] = useState("");
  const { toast } = useToast();

  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    const permissions = isEditable ? "edit" : "view";
    const expiry = expiresIn !== "never" ? `&expires=${Date.now() + (parseInt(expiresIn) * 24 * 60 * 60 * 1000)}` : "";
    const url = `${baseUrl}/shared/${file.id}?permission=${permissions}${expiry}`;
    setShareUrl(url);
    
    // Generate embed code
    const embed = `<iframe src="${baseUrl}/embed/${file.id}?permission=${permissions}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`;
    setEmbedCode(embed);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy manually",
        variant: "destructive",
      });
    }
  };

  const shareToSocial = (platform: string) => {
    const text = `Check out this quantum circuit: ${file.name}`;
    const url = shareUrl || `${window.location.origin}/shared/${file.id}`;
    
    const socialUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      discord: `https://discord.com/channels/@me`
    };
    
    if (platform === "discord") {
      copyToClipboard(`${text} ${url}`, "Discord message");
    } else {
      window.open(socialUrls[platform as keyof typeof socialUrls], '_blank');
    }
  };

  React.useEffect(() => {
    if (open) {
      generateShareUrl();
    }
  }, [open, isEditable, expiresIn]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="quantum-panel border-quantum-glow/30 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-quantum-glow flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Circuit - {file.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="link" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link">Share Link</TabsTrigger>
            <TabsTrigger value="embed">Embed Code</TabsTrigger>
            <TabsTrigger value="social">Social Share</TabsTrigger>
          </TabsList>

          <TabsContent value="link" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="editable">Access Level</Label>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <Switch
                    id="editable"
                    checked={isEditable}
                    onCheckedChange={(checked) => {
                      setIsEditable(checked);
                      generateShareUrl();
                    }}
                  />
                  <Edit className="w-4 h-4 text-quantum-glow" />
                </div>
              </div>
              
              <div className="text-center">
                <Badge variant={isEditable ? "default" : "secondary"}>
                  {isEditable ? "Editable Access" : "Read-Only Access"}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires">Link Expires</Label>
                <select
                  className="w-full p-2 rounded border border-quantum-glow/30 bg-quantum-void"
                  value={expiresIn}
                  onChange={(e) => {
                    setExpiresIn(e.target.value);
                    generateShareUrl();
                  }}
                >
                  <option value="never">Never</option>
                  <option value="1">1 Day</option>
                  <option value="7">1 Week</option>
                  <option value="30">1 Month</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shareUrl">Share URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="shareUrl"
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    onClick={() => copyToClipboard(shareUrl, "Share link")}
                    size="sm"
                    variant="outline"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="embed" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Embed this circuit in your website or blog:
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="embedCode">Embed Code</Label>
                <div className="relative">
                  <Textarea
                    id="embedCode"
                    value={embedCode}
                    readOnly
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={() => copyToClipboard(embedCode, "Embed code")}
                    size="sm"
                    variant="outline"
                    className="absolute top-2 right-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="p-4 border border-quantum-glow/30 rounded bg-quantum-matrix/20">
                <div className="text-sm font-semibold mb-2">Preview:</div>
                <div className="text-xs text-muted-foreground">
                  Circuit will be displayed in a 800x600 iframe with quantum theme
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Share on social platforms:
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <Button
                  onClick={() => shareToSocial("twitter")}
                  className="flex items-center gap-3 justify-start h-12"
                  variant="outline"
                >
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <div className="text-left">
                    <div className="font-semibold">Share on Twitter</div>
                    <div className="text-xs text-muted-foreground">Post to your timeline</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => shareToSocial("linkedin")}
                  className="flex items-center gap-3 justify-start h-12"
                  variant="outline"
                >
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold">Share on LinkedIn</div>
                    <div className="text-xs text-muted-foreground">Share with your network</div>
                  </div>
                </Button>
                
                <Button
                  onClick={() => shareToSocial("discord")}
                  className="flex items-center gap-3 justify-start h-12"
                  variant="outline"
                >
                  <MessageCircle className="w-5 h-5 text-indigo-400" />
                  <div className="text-left">
                    <div className="font-semibold">Share on Discord</div>
                    <div className="text-xs text-muted-foreground">Copy message for Discord</div>
                  </div>
                </Button>
              </div>
              
              <div className="p-3 border border-quantum-glow/30 rounded bg-quantum-matrix/20">
                <div className="text-sm">
                  <strong>Preview:</strong> "Check out this quantum circuit: {file.name}"
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}