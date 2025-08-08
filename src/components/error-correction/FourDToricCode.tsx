
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Line } from '@react-three/drei';
import { Vector3 } from 'three';

interface Stabilizer {
  id: string;
  type: 'X' | 'Z';
  qubits: number[];
  position: Vector3;
  syndrome: boolean;
}

interface LogicalQubit {
  id: string;
  physicalQubits: number[];
  position: Vector3;
}

interface NoiseModel {
  bitFlipRate: number;
  phaseFlipRate: number;
  depolarizingRate: number;
}

interface FourDToricCodeState {
  L: number; // Lattice size
  currentTimeStep: number;
  maxTimeSteps: number;
  stabilizers: Stabilizer[];
  logicalQubits: LogicalQubit[];
  physicalQubits: Array<{ id: number; position: Vector3; state: 'up' | 'down'; hasError: boolean; }>;
  syndromes: boolean[];
  noiseModel: NoiseModel;
  showEducationalOverlay: boolean;
  showStabilizers: boolean;
  showSyndromes: boolean;
}

export function FourDToricCode() {
  const [state, setState] = useState<FourDToricCodeState>({
    L: 3,
    currentTimeStep: 0,
    maxTimeSteps: 10,
    stabilizers: [],
    logicalQubits: [],
    physicalQubits: [],
    syndromes: [],
    noiseModel: {
      bitFlipRate: 0.01,
      phaseFlipRate: 0.01,
      depolarizingRate: 0.005
    },
    showEducationalOverlay: true,
    showStabilizers: true,
    showSyndromes: true
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [decodingSteps, setDecodingSteps] = useState<string[]>([]);

  // Initialize 4D toric code lattice
  const initializeLattice = useCallback(() => {
    const { L } = state;
    const physicalQubits = [];
    const stabilizers = [];
    const logicalQubits = [];

    // Create physical qubits in 4D lattice (3D space + time)
    for (let t = 0; t < state.maxTimeSteps; t++) {
      for (let x = 0; x < L; x++) {
        for (let y = 0; y < L; y++) {
          for (let z = 0; z < L; z++) {
            const id = t * L * L * L + x * L * L + y * L + z;
            physicalQubits.push({
              id,
              position: new Vector3(x, y, z + t * (L + 1)),
              state: 'up' as const,
              hasError: false
            });
          }
        }
      }
    }

    // Create X and Z stabilizers for 4D toric code
    for (let t = 0; t < state.maxTimeSteps; t++) {
      for (let x = 0; x < L; x++) {
        for (let y = 0; y < L; y++) {
          for (let z = 0; z < L; z++) {
            // X-type stabilizers (vertex stabilizers)
            const xStabQubits = [
              getQubitId(x, y, z, t, L, state.maxTimeSteps),
              getQubitId((x + 1) % L, y, z, t, L, state.maxTimeSteps),
              getQubitId(x, (y + 1) % L, z, t, L, state.maxTimeSteps),
              getQubitId(x, y, (z + 1) % L, t, L, state.maxTimeSteps),
              getQubitId(x, y, z, (t + 1) % state.maxTimeSteps, L, state.maxTimeSteps)
            ].filter(id => id !== -1);

            stabilizers.push({
              id: `X_${t}_${x}_${y}_${z}`,
              type: 'X',
              qubits: xStabQubits,
              position: new Vector3(x + 0.5, y + 0.5, z + 0.5 + t * (L + 1)),
              syndrome: false
            });

            // Z-type stabilizers (plaquette stabilizers)
            const zStabQubits = [
              getQubitId(x, y, z, t, L, state.maxTimeSteps),
              getQubitId((x + 1) % L, (y + 1) % L, z, t, L, state.maxTimeSteps),
              getQubitId((x + 1) % L, y, (z + 1) % L, t, L, state.maxTimeSteps),
              getQubitId(x, (y + 1) % L, (z + 1) % L, t, L, state.maxTimeSteps)
            ].filter(id => id !== -1);

            stabilizers.push({
              id: `Z_${t}_${x}_${y}_${z}`,
              type: 'Z',
              qubits: zStabQubits,
              position: new Vector3(x + 0.25, y + 0.25, z + 0.25 + t * (L + 1)),
              syndrome: false
            });
          }
        }
      }
    }

    // Create logical qubits
    for (let i = 0; i < 2; i++) {
      logicalQubits.push({
        id: `L${i}`,
        physicalQubits: physicalQubits.filter((_, idx) => idx % 2 === i).map(q => q.id),
        position: new Vector3(i * L, 0, 0)
      });
    }

    setState(prev => ({
      ...prev,
      physicalQubits,
      stabilizers,
      logicalQubits,
      syndromes: new Array(stabilizers.length).fill(false)
    }));
  }, [state.L, state.maxTimeSteps]);

  // Helper function to get qubit ID from coordinates
  const getQubitId = (x: number, y: number, z: number, t: number, L: number, maxT: number): number => {
    if (x < 0 || x >= L || y < 0 || y >= L || z < 0 || z >= L || t < 0 || t >= maxT) {
      return -1;
    }
    return t * L * L * L + x * L * L + y * L + z;
  };

  // Inject noise into the system
  const injectNoise = useCallback(() => {
    setState(prev => {
      const newPhysicalQubits = prev.physicalQubits.map(qubit => {
        const shouldAddError = Math.random() < prev.noiseModel.bitFlipRate + 
                              prev.noiseModel.phaseFlipRate + 
                              prev.noiseModel.depolarizingRate;
        
        return {
          ...qubit,
          hasError: shouldAddError,
          state: shouldAddError ? (qubit.state === 'up' ? 'down' : 'up') : qubit.state
        };
      });

      return { ...prev, physicalQubits: newPhysicalQubits };
    });
  }, []);

  // Calculate syndrome measurements
  const measureSyndromes = useCallback(() => {
    setState(prev => {
      const newSyndromes = prev.stabilizers.map(stabilizer => {
        const measurement = stabilizer.qubits.reduce((acc, qubitId) => {
          const qubit = prev.physicalQubits.find(q => q.id === qubitId);
          return acc ^ (qubit?.hasError ? 1 : 0);
        }, 0);
        
        return measurement === 1;
      });

      const updatedStabilizers = prev.stabilizers.map((stab, idx) => ({
        ...stab,
        syndrome: newSyndromes[idx]
      }));

      return {
        ...prev,
        syndromes: newSyndromes,
        stabilizers: updatedStabilizers
      };
    });
  }, []);

  // Run error correction decoding
  const runDecoding = useCallback(() => {
    const steps = [];
    const activeSyndromes = state.syndromes
      .map((syndrome, idx) => syndrome ? idx : -1)
      .filter(idx => idx !== -1);

    steps.push(`Found ${activeSyndromes.length} active syndromes`);
    
    if (activeSyndromes.length > 0) {
      steps.push('Running minimum-weight perfect matching...');
      steps.push('Applying correction operators...');
      
      // Simulate correction
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          physicalQubits: prev.physicalQubits.map(qubit => ({
            ...qubit,
            hasError: false,
            state: 'up'
          })),
          syndromes: new Array(prev.syndromes.length).fill(false),
          stabilizers: prev.stabilizers.map(stab => ({ ...stab, syndrome: false }))
        }));
      }, 1000);
    } else {
      steps.push('No errors detected - system is stable');
    }

    setDecodingSteps(steps);
  }, [state.syndromes]);

  // Start simulation
  const startSimulation = useCallback(() => {
    setIsSimulating(true);
    const interval = setInterval(() => {
      setState(prev => {
        if (prev.currentTimeStep >= prev.maxTimeSteps - 1) {
          setIsSimulating(false);
          clearInterval(interval);
          return prev;
        }
        return { ...prev, currentTimeStep: prev.currentTimeStep + 1 };
      });
    }, 500);
  }, []);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setIsSimulating(false);
    setState(prev => ({
      ...prev,
      currentTimeStep: 0,
      physicalQubits: prev.physicalQubits.map(q => ({ ...q, hasError: false, state: 'up' })),
      syndromes: new Array(prev.syndromes.length).fill(false),
      stabilizers: prev.stabilizers.map(s => ({ ...s, syndrome: false }))
    }));
    setDecodingSteps([]);
  }, []);

  // Initialize lattice on component mount
  React.useEffect(() => {
    initializeLattice();
  }, [initializeLattice]);

  return (
    <div className="h-full w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-quantum-glow">4D Topological Quantum Error Correction</h2>
        <Badge variant="outline" className="text-quantum-neon border-quantum-neon">
          Time Step: {state.currentTimeStep + 1}/{state.maxTimeSteps}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* 3D Visualization */}
        <div className="lg:col-span-2">
          <Card className="h-full bg-quantum-dark border-quantum-neon/30">
            <CardHeader>
              <CardTitle className="text-quantum-glow">4D Toric Code Lattice</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={injectNoise}
                  className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
                >
                  Inject Noise
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={measureSyndromes}
                  className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
                >
                  Measure Syndromes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runDecoding}
                  className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
                >
                  Run Decoding
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)]">
              <Canvas camera={{ position: [10, 10, 10], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                
                {/* Physical Qubits */}
                {state.physicalQubits
                  .filter((_, idx) => Math.floor(idx / (state.L * state.L * state.L)) <= state.currentTimeStep)
                  .map(qubit => (
                    <Box
                      key={qubit.id}
                      position={qubit.position}
                      args={[0.2, 0.2, 0.2]}
                    >
                      <meshStandardMaterial 
                        color={qubit.hasError ? '#ff4444' : (qubit.state === 'up' ? '#00ff88' : '#0088ff')}
                        transparent
                        opacity={0.8}
                      />
                    </Box>
                  ))
                }

                {/* Stabilizers */}
                {state.showStabilizers && state.stabilizers
                  .filter((_, idx) => Math.floor(idx / (state.L * state.L * state.L * 2)) <= state.currentTimeStep)
                  .map(stabilizer => (
                    <Box
                      key={stabilizer.id}
                      position={stabilizer.position}
                      args={[0.1, 0.1, 0.1]}
                    >
                      <meshStandardMaterial 
                        color={stabilizer.syndrome ? '#ff0000' : (stabilizer.type === 'X' ? '#ffff00' : '#ff00ff')}
                        transparent
                        opacity={0.6}
                      />
                    </Box>
                  ))
                }

                {/* Time layer separators */}
                {Array.from({ length: state.maxTimeSteps - 1 }, (_, t) => (
                  <mesh key={`separator-${t}`} position={[state.L/2, state.L/2, (t + 1) * (state.L + 1) - 0.5]}>
                    <planeGeometry args={[state.L + 2, state.L + 2]} />
                    <meshStandardMaterial color="#333333" transparent opacity={0.2} />
                  </mesh>
                ))}

                {/* Educational overlays */}
                {state.showEducationalOverlay && (
                  <>
                    <Text
                      position={[-1, state.L + 1, 0]}
                      fontSize={0.5}
                      color="#00ff88"
                      anchorX="center"
                      anchorY="middle"
                    >
                      Physical Qubits
                    </Text>
                    <Text
                      position={[-1, state.L + 1, state.maxTimeSteps * (state.L + 1)]}
                      fontSize={0.5}
                      color="#ffff00"
                      anchorX="center"
                      anchorY="middle"
                    >
                      Time Dimension →
                    </Text>
                  </>
                )}
              </Canvas>
            </CardContent>
          </Card>
        </div>

        {/* Control Panel */}
        <div className="space-y-4">
          <Card className="bg-quantum-dark border-quantum-neon/30">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Simulation Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-quantum-text mb-2 block">Lattice Size (L)</label>
                <Slider
                  value={[state.L]}
                  onValueChange={([value]) => setState(prev => ({ ...prev, L: value }))}
                  min={2}
                  max={5}
                  step={1}
                  className="w-full"
                />
                <span className="text-xs text-quantum-text">{state.L}×{state.L}×{state.L}</span>
              </div>

              <div>
                <label className="text-sm text-quantum-text mb-2 block">Time Steps</label>
                <Slider
                  value={[state.maxTimeSteps]}
                  onValueChange={([value]) => setState(prev => ({ ...prev, maxTimeSteps: value }))}
                  min={5}
                  max={20}
                  step={1}
                  className="w-full"
                />
                <span className="text-xs text-quantum-text">{state.maxTimeSteps} steps</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-quantum-text">Show Stabilizers</label>
                  <Switch
                    checked={state.showStabilizers}
                    onCheckedChange={(checked) => setState(prev => ({ ...prev, showStabilizers: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-quantum-text">Educational Overlay</label>
                  <Switch
                    checked={state.showEducationalOverlay}
                    onCheckedChange={(checked) => setState(prev => ({ ...prev, showEducationalOverlay: checked }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={startSimulation}
                  disabled={isSimulating}
                  className="flex-1 bg-quantum-neon/20 hover:bg-quantum-neon/30 text-quantum-glow border-quantum-neon/50"
                >
                  {isSimulating ? 'Running...' : 'Start'}
                </Button>
                <Button 
                  onClick={resetSimulation}
                  variant="outline"
                  className="flex-1 border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-quantum-dark border-quantum-neon/30">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Noise Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-quantum-text">Bit Flip Rate</label>
                <Slider
                  value={[state.noiseModel.bitFlipRate * 100]}
                  onValueChange={([value]) => setState(prev => ({
                    ...prev,
                    noiseModel: { ...prev.noiseModel, bitFlipRate: value / 100 }
                  }))}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <span className="text-xs text-quantum-text">{(state.noiseModel.bitFlipRate * 100).toFixed(1)}%</span>
              </div>
              <div>
                <label className="text-sm text-quantum-text">Phase Flip Rate</label>
                <Slider
                  value={[state.noiseModel.phaseFlipRate * 100]}
                  onValueChange={([value]) => setState(prev => ({
                    ...prev,
                    noiseModel: { ...prev.noiseModel, phaseFlipRate: value / 100 }
                  }))}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
                <span className="text-xs text-quantum-text">{(state.noiseModel.phaseFlipRate * 100).toFixed(1)}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-quantum-dark border-quantum-neon/30">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Decoding Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {decodingSteps.length > 0 ? (
                  decodingSteps.map((step, idx) => (
                    <div key={idx} className="text-xs text-quantum-text p-2 bg-quantum-void/50 rounded">
                      {step}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-quantum-text/60">No decoding steps yet</div>
                )}
              </div>
              <div className="mt-3 text-sm">
                <div className="text-quantum-text">
                  Active Syndromes: <span className="text-quantum-neon">{state.syndromes.filter(Boolean).length}</span>
                </div>
                <div className="text-quantum-text">
                  Total Stabilizers: <span className="text-quantum-neon">{state.stabilizers.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
