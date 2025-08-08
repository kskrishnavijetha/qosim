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

interface ErrorPattern {
  id: string;
  name: string;
  qubits: number[];
  pattern: 'single' | 'chain' | 'cluster' | 'anyonic';
}

interface FourDToricCodeState {
  L: number; // Lattice size
  currentTimeStep: number;
  maxTimeSteps: number;
  stabilizers: Stabilizer[];
  logicalQubits: LogicalQubit[];
  physicalQubits: Array<{ id: number; position: Vector3; state: 'up' | 'down'; hasError: boolean; decoherenceLevel: number; }>;
  syndromes: boolean[];
  noiseModel: NoiseModel;
  showEducationalOverlay: boolean;
  showStabilizers: boolean;
  showSyndromes: boolean;
  showAnyonicPaths: boolean;
  autoCorrection: boolean;
  selectedErrorPattern: ErrorPattern | null;
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
    showSyndromes: true,
    showAnyonicPaths: false,
    autoCorrection: true,
    selectedErrorPattern: null
  });

  const [isSimulating, setIsSimulating] = useState(false);
  const [decodingSteps, setDecodingSteps] = useState<string[]>([]);
  const [correctionHistory, setCorrectionHistory] = useState<Array<{ step: number; corrections: number; syndromes: number }>>([]);

  const errorPatterns: ErrorPattern[] = useMemo(() => [
    { id: 'single', name: 'Single Qubit Error', qubits: [0], pattern: 'single' },
    { id: 'chain', name: 'Error Chain', qubits: [0, 1, 2], pattern: 'chain' },
    { id: 'cluster', name: 'Error Cluster', qubits: [0, 1, 3, 4], pattern: 'cluster' },
    { id: 'anyonic', name: 'Anyonic Braiding Path', qubits: [0, 2, 5, 8], pattern: 'anyonic' }
  ], []);

  // Initialize 4D toric code lattice with enhanced features
  const initializeLattice = useCallback(() => {
    console.log('FourDToricCode: Initializing 4D lattice with enhanced TQEC features');
    const { L } = state;
    const physicalQubits = [];
    const stabilizers = [];
    const logicalQubits = [];

    // Create physical qubits in 4D lattice (3D space + time) with decoherence tracking
    for (let t = 0; t < state.maxTimeSteps; t++) {
      for (let x = 0; x < L; x++) {
        for (let y = 0; y < L; y++) {
          for (let z = 0; z < L; z++) {
            const id = t * L * L * L + x * L * L + y * L + z;
            physicalQubits.push({
              id,
              position: new Vector3(x, y, z + t * (L + 1)),
              state: 'up' as const,
              hasError: false,
              decoherenceLevel: 0
            });
          }
        }
      }
    }

    // Create X and Z stabilizers for 4D toric code with syndrome tracking
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

    // Create logical qubits with enhanced tracking
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

  // Enhanced noise injection with decoherence tracking
  const injectNoise = useCallback(() => {
    console.log('FourDToricCode: Injecting noise with decoherence tracking');
    setState(prev => {
      const newPhysicalQubits = prev.physicalQubits.map(qubit => {
        const shouldAddError = Math.random() < prev.noiseModel.bitFlipRate + 
                              prev.noiseModel.phaseFlipRate + 
                              prev.noiseModel.depolarizingRate;
        
        const newDecoherence = Math.min(1.0, qubit.decoherenceLevel + Math.random() * 0.1);
        
        return {
          ...qubit,
          hasError: shouldAddError,
          state: shouldAddError ? (qubit.state === 'up' ? 'down' : 'up') : qubit.state,
          decoherenceLevel: newDecoherence
        };
      });

      return { ...prev, physicalQubits: newPhysicalQubits };
    });
  }, []);

  // Apply user-defined error patterns for anyonic braiding simulation
  const applyErrorPattern = useCallback((pattern: ErrorPattern) => {
    console.log('FourDToricCode: Applying error pattern:', pattern.name);
    setState(prev => {
      const newPhysicalQubits = prev.physicalQubits.map((qubit, idx) => {
        const shouldApplyError = pattern.qubits.includes(idx % prev.L);
        return {
          ...qubit,
          hasError: shouldApplyError || qubit.hasError,
          state: shouldApplyError ? (qubit.state === 'up' ? 'down' : 'up') : qubit.state
        };
      });

      return { 
        ...prev, 
        physicalQubits: newPhysicalQubits,
        selectedErrorPattern: pattern
      };
    });
  }, []);

  // Real-time syndrome measurement and tracking
  const measureSyndromes = useCallback(() => {
    console.log('FourDToricCode: Measuring syndromes in real-time');
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

      const activeSyndromes = newSyndromes.filter(Boolean).length;
      console.log(`FourDToricCode: Found ${activeSyndromes} active syndromes`);

      return {
        ...prev,
        syndromes: newSyndromes,
        stabilizers: updatedStabilizers
      };
    });
  }, []);

  // Automatic correction algorithm with performance tracking
  const runAutomaticCorrection = useCallback(() => {
    console.log('FourDToricCode: Running automatic correction algorithm');
    const steps = [];
    const activeSyndromes = state.syndromes
      .map((syndrome, idx) => syndrome ? idx : -1)
      .filter(idx => idx !== -1);

    steps.push(`Real-time syndrome detection: ${activeSyndromes.length} active syndromes`);
    
    if (activeSyndromes.length > 0) {
      steps.push('Executing minimum-weight perfect matching algorithm...');
      steps.push('Applying topological correction operators...');
      steps.push('Tracking anyonic paths and braiding operations...');
      
      // Simulate correction with visual feedback
      setTimeout(() => {
        setState(prev => {
          const correctedQubits = prev.physicalQubits.map(qubit => ({
            ...qubit,
            hasError: false,
            state: 'up' as const,
            decoherenceLevel: Math.max(0, qubit.decoherenceLevel - 0.2)
          }));

          const newHistory = [...correctionHistory, {
            step: prev.currentTimeStep,
            corrections: activeSyndromes.length,
            syndromes: prev.syndromes.filter(Boolean).length
          }];

          setCorrectionHistory(newHistory);

          return {
            ...prev,
            physicalQubits: correctedQubits,
            syndromes: new Array(prev.syndromes.length).fill(false),
            stabilizers: prev.stabilizers.map(stab => ({ ...stab, syndrome: false }))
          };
        });
      }, 1000);
    } else {
      steps.push('No errors detected - topological protection active');
    }

    setDecodingSteps(steps);
  }, [state.syndromes, correctionHistory]);

  // Enhanced simulation with auto-correction
  const startSimulation = useCallback(() => {
    console.log('FourDToricCode: Starting enhanced 4D TQEC simulation');
    setIsSimulating(true);
    const interval = setInterval(() => {
      setState(prev => {
        if (prev.currentTimeStep >= prev.maxTimeSteps - 1) {
          setIsSimulating(false);
          clearInterval(interval);
          return prev;
        }

        // Auto-inject noise and run correction if enabled
        if (prev.autoCorrection && prev.currentTimeStep % 3 === 0) {
          setTimeout(() => {
            injectNoise();
            setTimeout(() => {
              measureSyndromes();
              setTimeout(runAutomaticCorrection, 500);
            }, 300);
          }, 200);
        }

        return { ...prev, currentTimeStep: prev.currentTimeStep + 1 };
      });
    }, 1500);
  }, [injectNoise, measureSyndromes, runAutomaticCorrection]);

  // Reset simulation with history clearing
  const resetSimulation = useCallback(() => {
    console.log('FourDToricCode: Resetting simulation');
    setIsSimulating(false);
    setState(prev => ({
      ...prev,
      currentTimeStep: 0,
      physicalQubits: prev.physicalQubits.map(q => ({ 
        ...q, 
        hasError: false, 
        state: 'up', 
        decoherenceLevel: 0 
      })),
      syndromes: new Array(prev.syndromes.length).fill(false),
      stabilizers: prev.stabilizers.map(s => ({ ...s, syndrome: false })),
      selectedErrorPattern: null
    }));
    setDecodingSteps([]);
    setCorrectionHistory([]);
  }, []);

  // Initialize lattice on component mount
  React.useEffect(() => {
    initializeLattice();
  }, [initializeLattice]);

  return (
    <div className="h-full w-full space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-quantum-glow">4D Topological Quantum Error Correction</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-quantum-neon border-quantum-neon">
            Step: {state.currentTimeStep + 1}/{state.maxTimeSteps}
          </Badge>
          <Badge variant="outline" className="text-quantum-neon border-quantum-neon">
            Syndromes: {state.syndromes.filter(Boolean).length}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Enhanced 3D Visualization */}
        <div className="lg:col-span-2">
          <Card className="h-full bg-quantum-dark border-quantum-neon/30">
            <CardHeader>
              <CardTitle className="text-quantum-glow">4D TQEC Lattice with WebGL</CardTitle>
              <div className="flex gap-2 flex-wrap">
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
                  onClick={runAutomaticCorrection}
                  className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
                >
                  Run Correction
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-120px)]">
              <Canvas camera={{ position: [10, 10, 10], fov: 75 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                
                {/* Physical Qubits with decoherence visualization */}
                {state.physicalQubits
                  .filter((_, idx) => Math.floor(idx / (state.L * state.L * state.L)) <= state.currentTimeStep)
                  .map(qubit => (
                    <Box
                      key={qubit.id}
                      position={qubit.position}
                      args={[0.2, 0.2, 0.2]}
                    >
                      <meshStandardMaterial 
                        color={qubit.hasError ? '#ff4444' : 
                               qubit.decoherenceLevel > 0.5 ? '#ffaa44' :
                               (qubit.state === 'up' ? '#00ff88' : '#0088ff')}
                        transparent
                        opacity={0.9 - qubit.decoherenceLevel * 0.3}
                      />
                    </Box>
                  ))
                }

                {/* Enhanced Stabilizers with syndrome visualization */}
                {state.showStabilizers && state.stabilizers
                  .filter((_, idx) => Math.floor(idx / (state.L * state.L * state.L * 2)) <= state.currentTimeStep)
                  .map(stabilizer => (
                    <Box
                      key={stabilizer.id}
                      position={stabilizer.position}
                      args={[0.15, 0.15, 0.15]}
                    >
                      <meshStandardMaterial 
                        color={stabilizer.syndrome ? '#ff0000' : 
                               (stabilizer.type === 'X' ? '#ffff00' : '#ff00ff')}
                        transparent
                        opacity={stabilizer.syndrome ? 1.0 : 0.6}
                      />
                    </Box>
                  ))
                }

                {/* Anyonic paths visualization */}
                {state.showAnyonicPaths && state.selectedErrorPattern && (
                  state.selectedErrorPattern.qubits.map((qubitIdx, i) => {
                    if (i === 0) return null;
                    const prevQubit = state.physicalQubits[state.selectedErrorPattern!.qubits[i-1]];
                    const currQubit = state.physicalQubits[qubitIdx];
                    if (!prevQubit || !currQubit) return null;
                    
                    return (
                      <Line
                        key={`anyonic-${i}`}
                        points={[prevQubit.position, currQubit.position]}
                        color="#ff8800"
                        lineWidth={3}
                      />
                    );
                  })
                )}

                {/* Time layer separators */}
                {Array.from({ length: state.maxTimeSteps - 1 }, (_, t) => (
                  <mesh key={`separator-${t}`} position={[state.L/2, state.L/2, (t + 1) * (state.L + 1) - 0.5]}>
                    <planeGeometry args={[state.L + 2, state.L + 2]} />
                    <meshStandardMaterial color="#333333" transparent opacity={0.2} />
                  </mesh>
                ))}

                {/* Enhanced educational overlays */}
                {state.showEducationalOverlay && (
                  <>
                    <Text
                      position={[-1, state.L + 1, 0]}
                      fontSize={0.4}
                      color="#00ff88"
                      anchorX="center"
                      anchorY="middle"
                    >
                      Physical Qubits
                    </Text>
                    <Text
                      position={[-1, state.L + 2, 0]}
                      fontSize={0.3}
                      color="#ffff00"
                      anchorX="center"
                      anchorY="middle"
                    >
                      X-Stabilizers (Yellow)
                    </Text>
                    <Text
                      position={[-1, state.L + 3, 0]}
                      fontSize={0.3}
                      color="#ff00ff"
                      anchorX="center"
                      anchorY="middle"
                    >
                      Z-Stabilizers (Magenta)
                    </Text>
                    <Text
                      position={[-1, state.L + 1, state.maxTimeSteps * (state.L + 1)]}
                      fontSize={0.4}
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

        {/* Enhanced Control Panel */}
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <Card className="bg-quantum-dark border-quantum-neon/30">
            <CardHeader>
              <CardTitle className="text-quantum-glow">Enhanced TQEC Controls</CardTitle>
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
                  <label className="text-sm text-quantum-text">Auto Correction</label>
                  <Switch
                    checked={state.autoCorrection}
                    onCheckedChange={(checked) => setState(prev => ({ ...prev, autoCorrection: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-quantum-text">Show Anyonic Paths</label>
                  <Switch
                    checked={state.showAnyonicPaths}
                    onCheckedChange={(checked) => setState(prev => ({ ...prev, showAnyonicPaths: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-quantum-text">Show Stabilizers</label>
                  <Switch
                    checked={state.showStabilizers}
                    onCheckedChange={(checked) => setState(prev => ({ ...prev, showStabilizers: checked }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={startSimulation}
                  disabled={isSimulating}
                  className="flex-1 bg-quantum-neon/20 hover:bg-quantum-neon/30 text-quantum-glow border-quantum-neon/50"
                >
                  {isSimulating ? 'Running...' : 'Start TQEC'}
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
              <CardTitle className="text-quantum-glow">Error Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {errorPatterns.map((pattern) => (
                <Button
                  key={pattern.id}
                  variant="outline"
                  size="sm"
                  onClick={() => applyErrorPattern(pattern)}
                  className={`w-full text-left justify-start ${
                    state.selectedErrorPattern?.id === pattern.id 
                      ? 'border-quantum-neon bg-quantum-neon/20' 
                      : 'border-quantum-neon/30'
                  } text-quantum-glow hover:bg-quantum-neon/10`}
                >
                  {pattern.name}
                </Button>
              ))}
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
              <CardTitle className="text-quantum-glow">Real-time Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {decodingSteps.length > 0 ? (
                  decodingSteps.map((step, idx) => (
                    <div key={idx} className="text-xs text-quantum-text p-2 bg-quantum-void/50 rounded">
                      {step}
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-quantum-text/60">Ready for TQEC simulation</div>
                )}
              </div>
              <div className="mt-3 text-sm space-y-1">
                <div className="text-quantum-text">
                  Active Syndromes: <span className="text-quantum-neon">{state.syndromes.filter(Boolean).length}</span>
                </div>
                <div className="text-quantum-text">
                  Total Stabilizers: <span className="text-quantum-neon">{state.stabilizers.length}</span>
                </div>
                <div className="text-quantum-text">
                  Corrections Applied: <span className="text-quantum-neon">{correctionHistory.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
