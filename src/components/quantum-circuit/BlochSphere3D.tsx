
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider } from '@/components/ui/tooltip';

interface BlochSphere3DProps {
  qubitIndex: number;
  isSelected: boolean;
  onSelect: () => void;
  qubitState: {
    state: string;
    probability: number;
    blochCoordinates: { x: number; y: number; z: number };
  };
}

function BlochSphereScene({ qubitState }: { qubitState: BlochSphere3DProps['qubitState'] }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const stateVectorRef = useRef<THREE.Mesh>(null);
  const { x, y, z } = qubitState.blochCoordinates;

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group>
      {/* Bloch sphere wireframe */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#374151" 
          wireframe 
          transparent 
          opacity={0.3} 
        />
      </mesh>
      
      {/* Coordinate axes */}
      <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.02, 0.02, 2.4]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2.4]} />
        <meshBasicMaterial color="#8b5cf6" />
      </mesh>
      <mesh position={[0, 0, 1.2]}>
        <cylinderGeometry args={[0.02, 0.02, 2.4]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      
      {/* State vector */}
      <mesh position={[x * 0.8, y * 0.8, z * 0.8]} ref={stateVectorRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      
      {/* State vector line */}
      <mesh 
        position={[x * 0.4, y * 0.4, z * 0.4]} 
        rotation={[
          Math.atan2(y, Math.sqrt(x*x + z*z)), 
          Math.atan2(x, z), 
          0
        ]}
      >
        <cylinderGeometry args={[0.02, 0.02, Math.sqrt(x*x + y*y + z*z) * 0.8]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      
      {/* Labels */}
      <Text position={[0, 0, 1.4]} fontSize={0.1} color="#10b981">
        |0⟩
      </Text>
      <Text position={[0, 0, -1.4]} fontSize={0.1} color="#ef4444">
        |1⟩
      </Text>
      <Text position={[1.4, 0, 0]} fontSize={0.1} color="#f59e0b">
        X
      </Text>
      <Text position={[0, 1.4, 0]} fontSize={0.1} color="#8b5cf6">
        Y
      </Text>
    </group>
  );
}

export function BlochSphere3D({ qubitIndex, isSelected, onSelect, qubitState }: BlochSphere3DProps) {
  return (
    <TooltipProvider>
      <Card 
        className={`quantum-panel cursor-pointer transition-all ${
          isSelected ? 'neon-border ring-2 ring-quantum-glow' : 'neon-border'
        }`}
        onClick={onSelect}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-quantum-neon flex items-center justify-between">
            Qubit {qubitIndex}
            <Badge variant="outline" className="text-xs">
              {qubitState.state}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="aspect-square bg-quantum-void rounded-lg overflow-hidden">
            <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} />
              <BlochSphereScene qubitState={qubitState} />
              <OrbitControls enableZoom={true} enablePan={false} />
            </Canvas>
          </div>
          <div className="mt-2 text-xs text-center">
            <div className="text-quantum-particle">
              P = {(qubitState.probability * 100).toFixed(1)}%
            </div>
            <div className="text-muted-foreground">
              ({qubitState.blochCoordinates.x.toFixed(2)}, {qubitState.blochCoordinates.y.toFixed(2)}, {qubitState.blochCoordinates.z.toFixed(2)})
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
