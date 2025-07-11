import { GitBranch, Clock, User, Eye, Download, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VersionHistoryProps {
  fileId: string;
}

interface Version {
  id: string;
  version: string;
  timestamp: string;
  author: string;
  changes: string;
  gateCount: number;
  type: "major" | "minor" | "patch";
}

export function VersionHistory({ fileId }: VersionHistoryProps) {
  // Mock version data based on file ID
  const getVersions = (id: string): Version[] => {
    const baseVersions: Version[] = [
      {
        id: "v3.4",
        version: "v3.4",
        timestamp: "2024-01-15 14:30",
        author: "quantum_dev",
        changes: "Added error correction gates",
        gateCount: 24,
        type: "major"
      },
      {
        id: "v3.3",
        version: "v3.3",
        timestamp: "2024-01-15 12:15",
        author: "quantum_dev",
        changes: "Optimized gate sequence",
        gateCount: 22,
        type: "minor"
      },
      {
        id: "v3.2",
        version: "v3.2",
        timestamp: "2024-01-14 18:45",
        author: "alice_q",
        changes: "Fixed measurement timing",
        gateCount: 20,
        type: "patch"
      },
      {
        id: "v3.1",
        version: "v3.1",
        timestamp: "2024-01-14 16:22",
        author: "bob_quantum",
        changes: "Initial implementation",
        gateCount: 18,
        type: "major"
      },
    ];
    
    return baseVersions;
  };

  const versions = getVersions(fileId);

  const getVersionTypeColor = (type: string) => {
    switch (type) {
      case "major": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "minor": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "patch": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  const handleRevert = (version: string) => {
    console.log("Reverting to version:", version);
    // Implementation for reverting to a specific version
  };

  const handlePreview = (version: string) => {
    console.log("Previewing version:", version);
    // Implementation for previewing a version
  };

  const handleDownload = (version: string) => {
    console.log("Downloading version:", version);
    // Implementation for downloading a version
  };

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      <div className="text-sm text-muted-foreground mb-4">
        {versions.length} versions • Latest: {versions[0]?.version}
      </div>
      
      {versions.map((version, index) => (
        <Card key={version.id} className="quantum-panel border-quantum-glow/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <GitBranch className="w-4 h-4 text-quantum-glow" />
                  <span className="font-mono text-quantum-glow font-medium">
                    {version.version}
                  </span>
                  <Badge className={getVersionTypeColor(version.type)}>
                    {version.type}
                  </Badge>
                  {index === 0 && (
                    <Badge className="bg-quantum-glow/20 text-quantum-glow border-quantum-glow/30">
                      Current
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{version.timestamp}</span>
                    <User className="w-3 h-3 ml-4" />
                    <span>{version.author}</span>
                  </div>
                  
                  <p className="text-foreground">{version.changes}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{version.gateCount} gates</span>
                    <span>•</span>
                    <span>Quantum fidelity: {(95 + Math.random() * 4).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePreview(version.version)}
                  className="text-quantum-neon hover:text-quantum-neon"
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(version.version)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Download className="w-4 h-4" />
                </Button>
                {index !== 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevert(version.version)}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            
            {/* Gate diff visualization */}
            {index > 0 && (
              <div className="mt-3 pt-3 border-t border-quantum-glow/20">
                <div className="text-xs text-muted-foreground">
                  Changes from {versions[index]?.version}:
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="text-green-400 text-xs">
                    +{Math.abs(version.gateCount - (versions[index]?.gateCount || 0))} gates
                  </span>
                  <span className="text-quantum-glow text-xs">
                    ~{Math.floor(Math.random() * 3 + 1)} optimizations
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}