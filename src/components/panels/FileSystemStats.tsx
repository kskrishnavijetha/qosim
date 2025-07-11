import { Card, CardContent } from "@/components/ui/card";

interface FileSystemStatsProps {
  favoriteCount: number;
}

export function FileSystemStats({ favoriteCount }: FileSystemStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Card className="quantum-panel neon-border">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-quantum-glow">1.2 TB</div>
            <div className="text-xs text-muted-foreground font-mono">USED</div>
          </div>
        </CardContent>
      </Card>
      <Card className="quantum-panel neon-border">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-quantum-neon">847</div>
            <div className="text-xs text-muted-foreground font-mono">FILES</div>
          </div>
        </CardContent>
      </Card>
      <Card className="quantum-panel neon-border">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">73%</div>
            <div className="text-xs text-muted-foreground font-mono">COHERENT</div>
          </div>
        </CardContent>
      </Card>
      <Card className="quantum-panel neon-border">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{favoriteCount}</div>
            <div className="text-xs text-muted-foreground font-mono">STARRED</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}