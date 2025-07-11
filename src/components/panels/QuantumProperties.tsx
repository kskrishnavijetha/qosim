import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface File {
  id: string;
  name: string;
  type: string;
  size: string;
  modified: string;
  superposition: boolean;
  favorite: boolean;
  tags: string[];
  versions: number;
  lastVersion: string;
}

interface QuantumPropertiesProps {
  files: File[];
}

export function QuantumProperties({ files }: QuantumPropertiesProps) {
  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow">Quantum Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Superposition Files:</span>
            <span className="text-quantum-glow">{files.filter(f => f.superposition).length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Entangled Pairs:</span>
            <span className="text-quantum-neon">2</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quantum Compression:</span>
            <span className="text-green-400">78.4%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Decoherence Risk:</span>
            <span className="text-yellow-400">Low</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Versions:</span>
            <span className="text-blue-400">{files.reduce((sum, f) => sum + f.versions, 0)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}