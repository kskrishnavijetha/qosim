
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Text } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Layers, Eye, RotateCcw, Zap } from 'lucide-react';
import { FourDToricCodeSimulator, FourDLatticePosition } from './FourDToricCodeSimulator';
import * as THREE from 'three';

interface FourDLatticeVisualizationProps {
  simulator: FourDToricCodeSimulator;
  timeStep: number;
  showEducationalOverlays: boolean;
  visualizationMode: '4d' | '3d' | '2d';
  onModeChange: (mode: '4d' | '3d' | '2d') => void;
}

function LatticeQubit({ 
  position, 
  hasError, 
  isLogical, 
  stabilizers, 
  onClick 
}: { 
  position: [number, number, number], 
  hasError: boolean, 
  isLogical: boolean,
  stabilizers: number,
  onClick: () => void 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      if (hasError) {
        meshRef.current.rotation.y += 0.05;
        meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.2);
      }
    }
  });

  const color = hasError ? '#ff4444' : isLogical ? '#44ff44' : '#4444ff';
  const size = hasError ? 0.15 : isLogical ? 0.12 : 0.08;

  return (
    <Sphere
      ref={meshRef}
      position={position}
      args={[size, 16, 16]}
      onClick={onClick}
    >
      <meshStandardMaterial 
        color={color} 
        emissive={hasError ? '#ff2222' : '#000000'}
        emissiveIntensity={hasError ? 0.3 : 0}
      />
    </Sphere>
  );
}

function StabilizerIndicator({ 
  position, 
  type, 
  syndrome, 
  qubits 
}: { 
  position: [number, number, number], 
  type: string,
  syndrome: number,
  qubits: FourDLatticePosition[]
}) {
  const color = syndrome === 1 ? '#ffaa00' : '#888888';
  const size = type === 'vertex' ? 0.05 : type === 'plaquette' ? 0.08 : 0.10;
  
  return (
    <>
      <Sphere position={position} args={[size, 8, 8]}>
        <meshStandardMaterial 
          color={color}
          transparent
          opacity={0.6}
        />
      </Sphere>
      
      {syndrome === 1 && (
        <Text
          position={[position[0], position[1] + 0.2, position[2]]}
          fontSize={0.1}
          color="#ffaa00"
        >
          {type[0].toUpperCase()}
        </Text>
      )}
    </>
  );
}

function LatticeConnections({ 
  qubits, 
  timeLayer 
}: { 
  qubits: Map<string, { state: any[], hasError: boolean }>,
  timeLayer: number 
}) {
  const lines = useMemo(() => {
    const connections: { start: [number, number, number], end: [number, number, number] }[] = [];
    
    for (const [key, qubit] of qubits) {
      const parts = key.split(',');
      const x = Number(parts[0]);
      const y = Number(parts[1]);
      const z = Number(parts[2]);
      const t = Number(parts[3]);
      const dir = parts[4];
      
      if (t !== timeLayer) continue;
      
      // Create connections based on direction
      const start: [number, number, number] = [x, y, z];
      let end: [number, number, number];
      
      switch (dir) {
        case 'x':
          end = [x + 1, y, z];
          break;
        case 'y':
          end = [x, y + 1, z];
          break;
        case 'z':
          end = [x, y, z + 1];
          break;
        case 't':
          // Time connections shown as vertical lines
          end = [x, y, z + 0.5];
          break;
        default:
          continue;
      }
      
      connections.push({ start, end });
    }
    
    return connections;
  }, [qubits, timeLayer]);

  return (
    <>
      {lines.map((line, index) => (
        <Line
          key={index}
          points={[line.start, line.end]}
          color="#666666"
          lineWidth={1}
          dashed
        />
      ))}
    </>
  );
}

function FourDLatticeScene({ 
  simulator, 
  timeStep, 
  showEducationalOverlays,
  timeSlice,
  showStabilizers,
  showConnections 
}: {
  simulator: FourDToricCodeSimulator,
  timeStep: number,
  showEducationalOverlays: boolean,
  timeSlice: number,
  showStabilizers: boolean,
  showConnections: boolean
}) {
  const qubits = simulator.getQubits();
  const stabilizers = simulator.getStabilizers();
  const errors = simulator.getErrors();
  const latticeSize = simulator.getLatticeSize();
  
  const visibleQubits = useMemo(() => {
    const visible: Array<{
      position: [number, number, number],
      hasError: boolean,
      isLogical: boolean,
      key: string
    }> = [];
    
    for (const [key, qubit] of qubits) {
      const parts = key.split(',');
      const x = Number(parts[0]);
      const y = Number(parts[1]);
      const z = Number(parts[2]);
      const t = Number(parts[3]);
      
      if (t === timeSlice) {
        visible.push({
          position: [x * 2, y * 2, z * 2],
          hasError: qubit.hasError,
          isLogical: false, // TODO: determine logical qubits
          key
        });
      }
    }
    
    return visible;
  }, [qubits, timeSlice]);
  
  const visibleStabilizers = useMemo(() => {
    return stabilizers
      .filter(s => s.position.t === timeSlice)
      .map(s => ({
        position: [s.position.x * 2, s.position.y * 2, s.position.z * 2] as [number, number, number],
        type: s.type,
        syndrome: s.syndrome,
        qubits: s.qubits
      }));
  }, [stabilizers, timeSlice]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 10]} intensity={0.5} />
      
      {/* Qubits */}
      {visibleQubits.map((qubit) => (
        <LatticeQubit
          key={qubit.key}
          position={qubit.position}
          hasError={qubit.hasError}
          isLogical={qubit.isLogical}
          stabilizers={0}
          onClick={() => console.log('Clicked qubit:', qubit.key)}
        />
      ))}
      
      {/* Stabilizers */}
      {showStabilizers && visibleStabilizers.map((stabilizer, index) => (
        <StabilizerIndicator
          key={index}
          position={stabilizer.position}
          type={stabilizer.type}
          syndrome={stabilizer.syndrome}
          qubits={stabilizer.qubits}
        />
      ))}
      
      {/* Connections */}
      {showConnections && (
        <LatticeConnections 
          qubits={qubits} 
          timeLayer={timeSlice}
        />
      )}
      
      {/* Grid lines for reference */}
      {showEducationalOverlays && (
        <>
          {/* X-axis grid */}
          {Array.from({ length: latticeSize[0] + 1 }, (_, i) => (
            <Line
              key={`x-${i}`}
              points={[[i * 2, 0, 0], [i * 2, latticeSize[1] * 2, 0]]}
              color="#333333"
              lineWidth={0.5}
            />
          ))}
          
          {/* Y-axis grid */}
          {Array.from({ length: latticeSize[1] + 1 }, (_, i) => (
            <Line
              key={`y-${i}`}
              points={[[0, i * 2, 0], [latticeSize[0] * 2, i * 2, 0]]}
              color="#333333"
              lineWidth={0.5}
            />
          ))}
        </>
      )}
      
      {/* Axis labels */}
      <Text position={[latticeSize[0] * 2 + 1, 0, 0]} fontSize={0.3} color="#ffffff">X</Text>
      <Text position={[0, latticeSize[1] * 2 + 1, 0]} fontSize={0.3} color="#ffffff">Y</Text>
      <Text position={[0, 0, latticeSize[2] * 2 + 1]} fontSize={0.3} color="#ffffff">Z</Text>
      
      {/* Time dimension indicator */}
      <Text 
        position={[0, 0, latticeSize[2] * 2 + 2]} 
        fontSize={0.2} 
        color="#ffaa00"
      >
        T = {timeSlice}
      </Text>
    </>
  );
}

export function FourDLatticeVisualization({
  simulator,
  timeStep,
  showEducationalOverlays,
  visualizationMode,
  onModeChange
}: FourDLatticeVisualizationProps) {
  const [timeSlice, setTimeSlice] = useState(0);
  const [showStabilizers, setShowStabilizers] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [cameraAngle, setCameraAngle] = useState(0);
  
  const latticeSize = simulator.getLatticeSize();

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
          <Layers className="w-5 h-5" />
          4D Lattice Visualization
        </CardTitle>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Select value={visualizationMode} onValueChange={(value: any) => onModeChange(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4d">4D View</SelectItem>
                <SelectItem value="3d">3D Slice</SelectItem>
                <SelectItem value="2d">2D Projection</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCameraAngle(prev => prev + Math.PI/4)}
              className="neon-border"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={showStabilizers}
                onCheckedChange={setShowStabilizers}
              />
              <span className="text-xs text-quantum-neon">Stabilizers</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={showConnections}
                onCheckedChange={setShowConnections}
              />
              <span className="text-xs text-quantum-particle">Connections</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Time Slice Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm text-muted-foreground">Time Slice</label>
            <Badge variant="outline" className="text-quantum-energy">
              T = {timeSlice} / {latticeSize[3] - 1}
            </Badge>
          </div>
          <Slider
            value={[timeSlice]}
            onValueChange={([value]) => setTimeSlice(value)}
            min={0}
            max={latticeSize[3] - 1}
            step={1}
            className="w-full"
          />
        </div>
        
        {/* 3D Canvas */}
        <div className="w-full h-96 bg-black rounded-lg overflow-hidden">
          <Canvas
            camera={{
              position: [10, 10, 10],
              fov: 50
            }}
          >
            <OrbitControls 
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
            />
            
            <FourDLatticeScene
              simulator={simulator}
              timeStep={timeStep}
              showEducationalOverlays={showEducationalOverlays}
              timeSlice={timeSlice}
              showStabilizers={showStabilizers}
              showConnections={showConnections}
            />
          </Canvas>
        </div>
        
        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 text-xs">
          <div className="text-center">
            <div className="text-lg font-mono text-quantum-glow">
              {Array.from(simulator.getQubits().values()).filter(q => q.hasError).length}
            </div>
            <div className="text-muted-foreground">Errors</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono text-quantum-neon">
              {simulator.getStabilizers().filter(s => s.syndrome === 1).length}
            </div>
            <div className="text-muted-foreground">Active Syndromes</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono text-quantum-particle">
              {simulator.getCorrections().length}
            </div>
            <div className="text-muted-foreground">Corrections</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-mono text-quantum-energy">
              {(simulator.getQubits().size / Math.pow(2, latticeSize.reduce((a, b) => a + b)) * 100).toFixed(1)}%
            </div>
            <div className="text-muted-foreground">Coverage</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
