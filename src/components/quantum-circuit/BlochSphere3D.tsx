
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

interface QubitState {
  qubit: number;
  amplitude0: { real: number; imag: number };
  amplitude1: { real: number; imag: number };
  probability0: number;
  probability1: number;
  phase: number;
  blochCoordinates: { x: number; y: number; z: number };
}

interface BlochSphere3DProps {
  qubitIndex: number;
  qubitState: QubitState;
}

function BlochSphereScene({ qubitState }: { qubitState: QubitState }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const stateVectorRef = useRef<THREE.Mesh>(null);

  const { x, y, z } = qubitState.blochCoordinates;

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.002;
    }
  });

  // Axis vectors
  const xAxis: [number, number, number][] = [[-1.2, 0, 0], [1.2, 0, 0]];
  const yAxis: [number, number, number][] = [[0, -1.2, 0], [0, 1.2, 0]];
  const zAxis: [number, number, number][] = [[0, 0, -1.2], [0, 0, 1.2]];

  // State color based on probabilities
  const getStateColor = () => {
    if (qubitState.probability0 > 0.95) return '#3b82f6'; // Blue for |0⟩
    if (qubitState.probability1 > 0.95) return '#ef4444'; // Red for |1⟩
    return '#8b5cf6'; // Purple for superposition
  };

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
        points={[[0, 0, 0], [x, y, z]] as [number, number, number][]}
        color={getStateColor()}
        lineWidth={4}
      />
      
      {/* State point */}
      <mesh ref={stateVectorRef} position={[x, y, z]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={getStateColor()} />
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

export function BlochSphere3D({ qubitIndex, qubitState }: BlochSphere3DProps) {
  return (
    <div className="text-center">
      <div className="text-xs font-mono text-quantum-neon mb-2">Qubit {qubitIndex}</div>
      <div className="aspect-square w-full max-w-[200px] mx-auto">
        <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} />
          <BlochSphereScene qubitState={qubitState} />
          <OrbitControls enableZoom={true} enablePan={false} />
        </Canvas>
      </div>
      <div className="mt-2 space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-quantum-particle">|0⟩:</span>
          <span className="text-quantum-glow">{(qubitState.probability0 * 100).toFixed(1)}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-quantum-particle">|1⟩:</span>
          <span className="text-quantum-neon">{(qubitState.probability1 * 100).toFixed(1)}%</span>
        </div>
        <div className="text-muted-foreground">
          φ: {qubitState.phase.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
