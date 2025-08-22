
import React, { useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

interface BlochSphereProps {
  blochSphereData: Array<{
    x: number;
    y: number;
    z: number;
    qubit: number;
    theta?: number;
    phi?: number;
  }>;
  qubitStates: Array<{
    qubit: number;
    state: string;
    amplitude: { real: number; imag: number };
    phase: number;
    probability: number;
  }>;
  selectedQubit: number;
  onQubitSelect: (qubit: number) => void;
}

function QubitVector({ position, color, qubit, isSelected, onClick }: {
  position: [number, number, number];
  color: string;
  qubit: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current && isSelected) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const linePoints = useMemo(() => [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(position[0] * 0.9, position[1] * 0.9, position[2] * 0.9)
  ], [position]);

  return (
    <group ref={groupRef} onClick={onClick}>
      {/* Vector line */}
      <Line
        points={linePoints}
        color={color}
        lineWidth={isSelected ? 6 : 3}
      />
      
      {/* Vector point */}
      <mesh
        ref={meshRef}
        position={[position[0] * 0.9, position[1] * 0.9, position[2] * 0.9]}
      >
        <sphereGeometry args={[isSelected ? 0.08 : 0.05, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Qubit label */}
      <Text
        position={[position[0] * 1.1, position[1] * 1.1, position[2] * 1.1]}
        fontSize={0.08}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        Q{qubit}
      </Text>
    </group>
  );
}

function BlochSphereScene({ blochSphereData, qubitStates, selectedQubit, onQubitSelect }: BlochSphereProps) {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.002;
    }
  });

  // Create axes
  const axes = useMemo(() => [
    { start: [-1.1, 0, 0], end: [1.1, 0, 0], color: '#ef4444', label: 'X' },
    { start: [0, -1.1, 0], end: [0, 1.1, 0], color: '#22c55e', label: 'Y' },
    { start: [0, 0, -1.1], end: [0, 0, 1.1], color: '#3b82f6', label: 'Z' }
  ], []);

  // Calculate qubit vectors with proper Bloch coordinates
  const qubitVectors = useMemo(() => {
    return qubitStates.map((state, index) => {
      let x = 0, y = 0, z = 1; // Default to |0⟩ state

      // Use provided Bloch data if available
      const blochData = blochSphereData[index];
      if (blochData && (Math.abs(blochData.x) + Math.abs(blochData.y) + Math.abs(blochData.z)) > 0.01) {
        x = blochData.x;
        y = blochData.y;
        z = blochData.z;
      } else {
        // Calculate from quantum state
        const { amplitude, phase } = state;
        const alpha = Math.sqrt(Math.max(0, 1 - state.probability));
        const beta = Math.sqrt(Math.max(0, state.probability));
        
        // Bloch sphere coordinates
        x = 2 * alpha * beta * Math.cos(phase);
        y = 2 * alpha * beta * Math.sin(phase);
        z = alpha * alpha - beta * beta;
      }

      // Ensure coordinates are within unit sphere
      const magnitude = Math.sqrt(x*x + y*y + z*z);
      if (magnitude > 1) {
        x /= magnitude;
        y /= magnitude;
        z /= magnitude;
      }

      return {
        position: [x, y, z] as [number, number, number],
        qubit: state.qubit,
        color: `hsl(${(state.qubit * 60) % 360}, 70%, 60%)`
      };
    });
  }, [blochSphereData, qubitStates]);

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} />
      
      {/* Main Bloch sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#1f2937"
          wireframe
          opacity={0.2}
          transparent
        />
      </mesh>
      
      {/* Coordinate axes */}
      {axes.map((axis, index) => (
        <group key={index}>
          <Line
            points={[new THREE.Vector3(...axis.start), new THREE.Vector3(...axis.end)]}
            color={axis.color}
            lineWidth={2}
          />
          <Text
            position={axis.end.map(coord => coord * 1.2) as [number, number, number]}
            fontSize={0.1}
            color={axis.color}
            anchorX="center"
            anchorY="middle"
          >
            {axis.label}
          </Text>
        </group>
      ))}
      
      {/* State labels */}
      <Text
        position={[0, 0, 1.2]}
        fontSize={0.1}
        color="#22c55e"
        anchorX="center"
        anchorY="middle"
      >
        |0⟩
      </Text>
      <Text
        position={[0, 0, -1.2]}
        fontSize={0.1}
        color="#ef4444"
        anchorX="center"
        anchorY="middle"
      >
        |1⟩
      </Text>
      
      {/* Qubit state vectors */}
      {qubitVectors.map((vector) => (
        <QubitVector
          key={vector.qubit}
          position={vector.position}
          color={vector.color}
          qubit={vector.qubit}
          isSelected={vector.qubit === selectedQubit}
          onClick={() => onQubitSelect(vector.qubit)}
        />
      ))}
    </>
  );
}

export function BlochSphereVisualization(props: BlochSphereProps) {
  return (
    <div className="h-80 w-full bg-quantum-void/20 rounded-lg border border-quantum-matrix overflow-hidden">
      <Canvas
        camera={{ 
          position: [2.5, 2.5, 2.5], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          <BlochSphereScene {...props} />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            autoRotate={false}
            maxDistance={8}
            minDistance={1.5}
            dampingFactor={0.05}
            enableDamping={true}
          />
        </Suspense>
      </Canvas>
      
      {/* Loading fallback */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-quantum-particle text-sm opacity-50">
          3D Bloch Sphere
        </div>
      </div>
    </div>
  );
}
