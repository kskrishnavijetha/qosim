
import React, { useRef, useEffect, useMemo } from 'react';
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

function QubitVector({ position, color, qubit, isSelected }: {
  position: [number, number, number];
  color: string;
  qubit: number;
  isSelected: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
    }
  });

  const arrowGeometry = useMemo(() => {
    const geometry = new THREE.ConeGeometry(0.05, 0.2, 8);
    return geometry;
  }, []);

  const linePoints = useMemo(() => [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(position[0] * 0.8, position[1] * 0.8, position[2] * 0.8)
  ], [position]);

  return (
    <group>
      {/* Vector line */}
      <Line
        points={linePoints}
        color={color}
        lineWidth={isSelected ? 4 : 2}
      />
      
      {/* Arrow head */}
      <mesh
        ref={meshRef}
        position={position}
        geometry={arrowGeometry}
        lookAt={new THREE.Vector3(0, 0, 0)}
      >
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Qubit label */}
      <Text
        position={[position[0] * 1.2, position[1] * 1.2, position[2] * 1.2]}
        fontSize={0.1}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        Q{qubit}
      </Text>
    </group>
  );
}

function BlochSphere({ blochSphereData, qubitStates, selectedQubit, onQubitSelect }: BlochSphereProps) {
  const sphereRef = useRef<THREE.Mesh>(null);

  // Create axes
  const axes = useMemo(() => [
    { start: [-1.2, 0, 0], end: [1.2, 0, 0], color: '#ff6b6b', label: 'X' },
    { start: [0, -1.2, 0], end: [0, 1.2, 0], color: '#4ecdc4', label: 'Y' },
    { start: [0, 0, -1.2], end: [0, 0, 1.2], color: '#45b7d1', label: 'Z' }
  ], []);

  // Calculate proper Bloch coordinates for each qubit
  const qubitVectors = useMemo(() => {
    return qubitStates.map((state, index) => {
      const blochData = blochSphereData[index];
      
      if (blochData && Math.abs(blochData.x) + Math.abs(blochData.y) + Math.abs(blochData.z) > 0.01) {
        return {
          position: [blochData.x, blochData.y, blochData.z] as [number, number, number],
          qubit: state.qubit,
          color: `hsl(${(state.qubit * 60) % 360}, 70%, 60%)`
        };
      }
      
      // Calculate from amplitude and phase if Bloch data is missing/invalid
      const { amplitude, phase } = state;
      const prob0 = amplitude.real * amplitude.real + amplitude.imag * amplitude.imag;
      const prob1 = 1 - prob0;
      
      // Convert to Bloch sphere coordinates
      const theta = 2 * Math.acos(Math.sqrt(Math.max(0, Math.min(1, prob0))));
      const phi = phase;
      
      const x = Math.sin(theta) * Math.cos(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(theta);
      
      return {
        position: [x || 0, y || 0, z || 1] as [number, number, number],
        qubit: state.qubit,
        color: `hsl(${(state.qubit * 60) % 360}, 70%, 60%)`
      };
    });
  }, [blochSphereData, qubitStates]);

  return (
    <Canvas
      camera={{ position: [2, 2, 2], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Main Bloch sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#1a1a2e"
          wireframe
          opacity={0.3}
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
            position={axis.end.map(coord => coord * 1.1) as [number, number, number]}
            fontSize={0.15}
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
        position={[0, 0, 1.3]}
        fontSize={0.12}
        color="#4ecdc4"
        anchorX="center"
        anchorY="middle"
      >
        |0⟩
      </Text>
      <Text
        position={[0, 0, -1.3]}
        fontSize={0.12}
        color="#ff6b6b"
        anchorX="center"
        anchorY="middle"
      >
        |1⟩
      </Text>
      
      {/* Qubit state vectors */}
      {qubitVectors.map((vector, index) => (
        <QubitVector
          key={vector.qubit}
          position={vector.position}
          color={vector.color}
          qubit={vector.qubit}
          isSelected={vector.qubit === selectedQubit}
        />
      ))}
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={false}
        maxDistance={5}
        minDistance={1}
      />
    </Canvas>
  );
}

export function BlochSphereVisualization(props: BlochSphereProps) {
  return (
    <div className="h-80 w-full bg-quantum-void/20 rounded-lg border border-quantum-matrix">
      <BlochSphere {...props} />
    </div>
  );
}
