
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Book, Eye, Info, Layers } from 'lucide-react';

interface EducationalOverlaysProps {
  latticeSize: [number, number, number, number];
  currentTimeStep: number;
  simulationResults: any;
}

export function EducationalOverlays({ 
  latticeSize, 
  currentTimeStep, 
  simulationResults 
}: EducationalOverlaysProps) {
  const [showLatticeInfo, setShowLatticeInfo] = useState(true);
  const [showStabilizerInfo, setShowStabilizerInfo] = useState(true);
  const [showSyndromeInfo, setShowSyndromeInfo] = useState(true);
  const [showCodeProperties, setShowCodeProperties] = useState(true);

  const [Lx, Ly, Lz, Lt] = latticeSize;
  const totalQubits = (Lx * (Ly - 1) * Lz * Lt) + 
                     ((Lx - 1) * Ly * Lz * Lt) + 
                     (Lx * Ly * (Lz - 1) * Lt) + 
                     (Lx * Ly * Lz * (Lt - 1));

  const logicalQubits = 1; // For toric code
  const stabilizers = (Lx * Ly * Lz * Lt) + // vertex stabilizers
                     (3 * Lx * Ly * Lz * Lt); // plaquette/cube/hypercube stabilizers (simplified)

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-sm font-mono text-quantum-glow flex items-center gap-2">
          <Book className="w-4 h-4" />
          Educational Overlays
        </CardTitle>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={showLatticeInfo}
              onCheckedChange={setShowLatticeInfo}
            />
            <span className="text-xs text-quantum-neon">Lattice Info</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={showStabilizerInfo}
              onCheckedChange={setShowStabilizerInfo}
            />
            <span className="text-xs text-quantum-particle">Stabilizers</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={showSyndromeInfo}
              onCheckedChange={setShowSyndromeInfo}
            />
            <span className="text-xs text-quantum-energy">Syndromes</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Switch
              checked={showCodeProperties}
              onCheckedChange={setShowCodeProperties}
            />
            <span className="text-xs text-quantum-glow">Code Properties</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Lattice Information */}
        {showLatticeInfo && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono text-quantum-neon flex items-center gap-2">
              <Layers className="w-3 h-3" />
              4D Lattice Structure
            </h4>
            <div className="bg-black/50 rounded p-3 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground">Dimensions:</div>
                  <div className="text-quantum-glow font-mono">
                    {Lx} × {Ly} × {Lz} × {Lt}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Qubits:</div>
                  <div className="text-quantum-particle font-mono">{totalQubits}</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="text-muted-foreground">Qubit Distribution:</div>
                <div className="space-y-1 ml-2">
                  <div>• X-edges: {Lx * (Ly - 1) * Lz * Lt}</div>
                  <div>• Y-edges: {(Lx - 1) * Ly * Lz * Lt}</div>
                  <div>• Z-edges: {Lx * Ly * (Lz - 1) * Lt}</div>
                  <div>• T-edges: {Lx * Ly * Lz * (Lt - 1)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stabilizer Information */}
        {showStabilizerInfo && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono text-quantum-particle flex items-center gap-2">
              <Info className="w-3 h-3" />
              Stabilizer Generators
            </h4>
            <div className="bg-black/50 rounded p-3 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground">Total Stabilizers:</div>
                  <div className="text-quantum-energy font-mono">{stabilizers}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Logical Qubits:</div>
                  <div className="text-quantum-glow font-mono">{logicalQubits}</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="text-muted-foreground">Stabilizer Types:</div>
                <div className="space-y-1 ml-2">
                  <div className="flex justify-between">
                    <span>• Vertex (X-type):</span>
                    <Badge variant="outline" className="text-quantum-neon text-xs">
                      {Lx * Ly * Lz * Lt}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>• Plaquette (Z-type):</span>
                    <Badge variant="outline" className="text-quantum-particle text-xs">
                      {Lx * Ly * Lz * Lt}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>• Cube stabilizers:</span>
                    <Badge variant="outline" className="text-quantum-energy text-xs">
                      {Lx * Ly * Lz * Lt}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>• Hypercube:</span>
                    <Badge variant="outline" className="text-quantum-glow text-xs">
                      {Lx * Ly * Lz * Lt}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Syndrome Information */}
        {showSyndromeInfo && simulationResults && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono text-quantum-energy flex items-center gap-2">
              <Eye className="w-3 h-3" />
              Current Syndromes
            </h4>
            <div className="bg-black/50 rounded p-3 text-xs space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-muted-foreground">Active Syndromes:</div>
                  <div className="text-quantum-energy font-mono">
                    {simulationResults.timeSteps?.[currentTimeStep]?.syndromes?.length || 0}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Detection Rate:</div>
                  <div className="text-quantum-glow font-mono">
                    {simulationResults.timeSteps?.[currentTimeStep]?.syndromes?.length > 0 ? '100%' : '0%'}
                  </div>
                </div>
              </div>
              
              {simulationResults.timeSteps?.[currentTimeStep]?.syndromes?.length > 0 && (
                <>
                  <Separator />
                  <div className="text-muted-foreground">Pattern Analysis:</div>
                  <div className="text-xs">
                    • Syndromes indicate error locations in 4D
                    • Decoding finds minimum-weight error chains
                    • 4D topology provides error correction advantage
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Code Properties */}
        {showCodeProperties && (
          <div className="space-y-2">
            <h4 className="text-xs font-mono text-quantum-glow">
              4D Toric Code Properties
            </h4>
            <div className="bg-black/50 rounded p-3 text-xs space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Code Distance:</span>
                  <Badge variant="outline" className="text-quantum-glow">
                    d = min(Lx, Ly, Lz, Lt)
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Error Threshold:</span>
                  <Badge variant="outline" className="text-quantum-energy">
                    ~12% (theoretical)
                  </Badge>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Encoding Rate:</span>
                  <Badge variant="outline" className="text-quantum-neon">
                    k/n = {logicalQubits}/{totalQubits}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-1">
                <div className="text-muted-foreground">Key Advantages:</div>
                <div className="space-y-1 ml-2 text-xs">
                  <div>• Higher error threshold than 2D/3D codes</div>
                  <div>• Topological protection in 4D space</div>
                  <div>• Self-correcting properties</div>
                  <div>• Efficient decoding algorithms</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
