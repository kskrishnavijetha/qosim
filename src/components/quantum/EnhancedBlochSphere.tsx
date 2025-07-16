
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlochSphereData {
  qubit: number;
  x: number;
  y: number;
  z: number;
  theta: number;
  phi: number;
}

interface QubitState {
  qubit: number;
  state: string;
  amplitude: { real: number; imag: number };
  probability: number;
  phase: number;
}

interface EnhancedBlochSphereProps {
  blochSphereData: BlochSphereData[];
  qubitStates: QubitState[];
  selectedQubit: number;
  onQubitSelect: (qubit: number) => void;
}

function BlochSphereVisualization({ data }: { data: BlochSphereData }) {
  const stateVectorRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.002;
    }
  });

  // Axis vectors
  const xAxis = [[-1.2, 0, 0], [1.2, 0, 0]];
  const yAxis = [[0, -1.2, 0], [0, 1.2, 0]];
  const zAxis = [[0, 0, -1.2], [0, 0, 1.2]];

  return (
    <group>
      {/* Bloch sphere wireframe */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="hsl(var(--quantum-matrix))" 
          wireframe 
          transparent 
          opacity={0.2} 
        />
      </mesh>
      
      {/* Coordinate axes */}
      <Line
        points={xAxis}
        color="hsl(var(--quantum-neon))"
        lineWidth={2}
      />
      <Line
        points={yAxis}
        color="hsl(var(--quantum-glow))"
        lineWidth={2}
      />
      <Line
        points={zAxis}
        color="hsl(var(--quantum-particle))"
        lineWidth={2}
      />
      
      {/* State vector */}
      <Line
        points={[[0, 0, 0], [data.x, data.y, data.z]]}
        color="hsl(var(--quantum-plasma))"
        lineWidth={4}
      />
      
      {/* State point */}
      <mesh ref={stateVectorRef} position={[data.x, data.y, data.z]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="hsl(var(--quantum-plasma))" />
      </mesh>
      
      {/* Axis labels */}
      <Html position={[1.4, 0, 0]} center>
        <div className="text-xs text-quantum-neon font-mono bg-quantum-void px-1 rounded">+X</div>
      </Html>
      <Html position={[-1.4, 0, 0]} center>
        <div className="text-xs text-quantum-neon font-mono bg-quantum-void px-1 rounded">-X</div>
      </Html>
      <Html position={[0, 1.4, 0]} center>
        <div className="text-xs text-quantum-glow font-mono bg-quantum-void px-1 rounded">+Y</div>
      </Html>
      <Html position={[0, -1.4, 0]} center>
        <div className="text-xs text-quantum-glow font-mono bg-quantum-void px-1 rounded">-Y</div>
      </Html>
      <Html position={[0, 0, 1.4]} center>
        <div className="text-xs text-quantum-particle font-mono bg-quantum-void px-1 rounded">|0⟩</div>
      </Html>
      <Html position={[0, 0, -1.4]} center>
        <div className="text-xs text-quantum-particle font-mono bg-quantum-void px-1 rounded">|1⟩</div>
      </Html>
    </group>
  );
}

export function EnhancedBlochSphere({ 
  blochSphereData, 
  qubitStates, 
  selectedQubit, 
  onQubitSelect 
}: EnhancedBlochSphereProps) {
  const selectedData = blochSphereData[selectedQubit] || {
    qubit: 0,
    x: 0,
    y: 0,
    z: 1,
    theta: 0,
    phi: 0
  };

  const selectedState = qubitStates[selectedQubit] || {
    qubit: 0,
    state: '|0⟩',
    amplitude: { real: 1, imag: 0 },
    probability: 1,
    phase: 0
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow">Bloch Sphere Visualization</CardTitle>
        <CardDescription className="text-quantum-particle">
          Real-time quantum state representation for Qubit {selectedQubit}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 3D Bloch Sphere */}
          <div className="aspect-square">
            <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} />
              <BlochSphereVisualization data={selectedData} />
              <OrbitControls enableZoom={true} enablePan={false} />
            </Canvas>
          </div>
          
          {/* Qubit Information */}
          <div className="space-y-4">
            {/* Qubit Selector */}
            <div>
              <h4 className="text-sm font-mono text-quantum-glow mb-2">Select Qubit</h4>
              <div className="flex flex-wrap gap-2">
                {blochSphereData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => onQubitSelect(index)}
                    className={`px-3 py-1 text-xs font-mono rounded border transition-colors ${
                      index === selectedQubit
                        ? 'bg-quantum-glow text-quantum-void border-quantum-glow'
                        : 'bg-quantum-matrix text-quantum-neon border-quantum-neon hover:bg-quantum-neon hover:text-quantum-void'
                    }`}
                  >
                    Q{index}
                  </button>
                ))}
              </div>
            </div>

            {/* State Information */}
            <div className="quantum-panel neon-border rounded p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-quantum-particle text-sm">Quantum State:</span>
                <Badge variant="outline" className="text-quantum-glow font-mono">
                  {selectedState.state}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-quantum-particle text-sm">Probability:</span>
                <Badge variant="outline" className="text-quantum-neon">
                  {(selectedState.probability * 100).toFixed(2)}%
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-quantum-particle text-sm">Phase:</span>
                <span className="text-quantum-plasma font-mono text-sm">
                  {selectedState.phase.toFixed(3)} rad
                </span>
              </div>
              
              <div className="space-y-2">
                <span className="text-quantum-particle text-sm">Amplitude:</span>
                <div className="text-quantum-glow font-mono text-sm">
                  {selectedState.amplitude.real.toFixed(4)} + {SelectedState.amplitude.imag.toFixed(4)}i
                </div>
              </div>
            </div>

            {/* Bloch Coordinates */}
            <div className="quantum-panel neon-border rounded p-4 space-y-2">
              <h5 className="text-quantum-glow text-sm font-mono">Bloch Coordinates</h5>
              <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                <div className="text-center">
                  <div className="text-quantum-neon">X</div>
                  <div className="text-quantum-particle">{selectedData.x.toFixed(3)}</div>
                </div>
                <div className="text-center">
                  <div className="text-quantum-glow">Y</div>
                  <div className="text-quantum-particle">{selectedData.y.toFixed(3)}</div>
                </div>
                <div className="text-center">
                  <div className="text-quantum-particle">Z</div>
                  <div className="text-quantum-particle">{selectedData.z.toFixed(3)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-mono mt-3">
                <div className="text-center">
                  <div className="text-quantum-plasma">θ (theta)</div>
                  <div className="text-quantum-particle">{selectedData.theta.toFixed(3)}</div>
                </div>
                <div className="text-center">
                  <div className="text-quantum-plasma">φ (phi)</div>
                  <div className="text-quantum-particle">{selectedData.phi.toFixed(3)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
