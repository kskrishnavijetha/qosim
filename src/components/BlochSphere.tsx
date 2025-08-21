
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { Complex } from '@/lib/quantumSimulator';

interface BlochSphereProps {
  qubitState: {
    amplitude0: Complex;
    amplitude1: Complex;
    probability0: number;
    probability1: number;
    phase: number;
  };
  size?: number;
}

interface SphereVisualizationProps {
  qubitState: BlochSphereProps['qubitState'];
}

function SphereVisualization({ qubitState }: SphereVisualizationProps) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const vectorRef = useRef<THREE.Mesh>(null);
  
  // Calculate Bloch sphere coordinates from quantum state
  const getBlochCoordinates = (amp0: Complex, amp1: Complex) => {
    // Handle both Complex objects and plain objects
    const alpha = {
      real: typeof amp0.real === 'number' ? amp0.real : 1,
      imag: typeof amp0.imag === 'number' ? amp0.imag : 0
    };
    const beta = {
      real: typeof amp1.real === 'number' ? amp1.real : 0,
      imag: typeof amp1.imag === 'number' ? amp1.imag : 0
    };
    
    // For a qubit state |ψ⟩ = α|0⟩ + β|1⟩
    // Bloch coordinates: x = 2*Re(α*β*), y = 2*Im(α*β*), z = |α|² - |β|²
    const x = 2 * (alpha.real * beta.real + alpha.imag * beta.imag);
    const y = 2 * (alpha.imag * beta.real - alpha.real * beta.imag);
    const z = (alpha.real * alpha.real + alpha.imag * alpha.imag) - (beta.real * beta.real + beta.imag * beta.imag);
    
    return { x, y, z };
  };

  const { x, y, z } = getBlochCoordinates(qubitState.amplitude0, qubitState.amplitude1);
  
  // Determine color based on state
  const getStateColor = () => {
    if (qubitState.probability0 > 0.95) return '#3b82f6'; // Blue for |0⟩
    if (qubitState.probability1 > 0.95) return '#ef4444'; // Red for |1⟩
    return '#8b5cf6'; // Purple for superposition
  };

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.005;
    }
  });

  // Ensure coordinates are valid numbers
  const safeX = isNaN(x) ? 0 : x;
  const safeY = isNaN(y) ? 0 : y;
  const safeZ = isNaN(z) ? 1 : z;

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
      <mesh position={[0, 0, 1.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshBasicMaterial color="#10b981" />
      </mesh>
      <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0, 1.2, 0]} rotation={[Math.PI/2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshBasicMaterial color="#8b5cf6" />
      </mesh>
      
      {/* State vector */}
      <mesh ref={vectorRef} position={[safeX * 0.8, safeY * 0.8, safeZ * 0.8]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={getStateColor()} />
      </mesh>
      
      {/* State vector line */}
      <mesh 
        position={[safeX * 0.4, safeY * 0.4, safeZ * 0.4]} 
        rotation={[
          Math.atan2(safeY, Math.sqrt(safeX*safeX + safeZ*safeZ)), 
          Math.atan2(safeX, safeZ), 
          0
        ]}
      >
        <cylinderGeometry args={[0.02, 0.02, Math.sqrt(safeX*safeX + safeY*safeY + safeZ*safeZ) * 0.8]} />
        <meshBasicMaterial color={getStateColor()} />
      </mesh>
      
      {/* Axis labels */}
      <Html position={[0, 0, 1.4]} center>
        <div className="text-xs text-quantum-glow font-mono">|0⟩</div>
      </Html>
      <Html position={[0, 0, -1.4]} center>
        <div className="text-xs text-quantum-neon font-mono">|1⟩</div>
      </Html>
      <Html position={[1.4, 0, 0]} center>
        <div className="text-xs text-muted-foreground font-mono">X</div>
      </Html>
      <Html position={[0, 1.4, 0]} center>
        <div className="text-xs text-muted-foreground font-mono">Y</div>
      </Html>
    </group>
  );
}

export function BlochSphere({ qubitState, size = 200 }: BlochSphereProps) {
  // Provide fallback values if qubitState is invalid
  const safeQubitState = {
    amplitude0: qubitState?.amplitude0 || { real: 1, imag: 0 },
    amplitude1: qubitState?.amplitude1 || { real: 0, imag: 0 },
    probability0: qubitState?.probability0 || 1,
    probability1: qubitState?.probability1 || 0,
    phase: qubitState?.phase || 0
  };

  return (
    <div 
      className="relative bg-quantum-void border border-quantum-matrix rounded-lg overflow-hidden"
      style={{ width: size, height: size }}
    >
      <Canvas 
        camera={{ position: [2, 2, 2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        <SphereVisualization qubitState={safeQubitState} />
        <OrbitControls 
          enableZoom={true} 
          enablePan={false}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
      
      {/* Tooltip overlay */}
      <div className="absolute bottom-2 left-2 right-2 bg-quantum-matrix/90 rounded p-2 text-xs font-mono">
        <div className="text-quantum-glow">
          |0⟩: {(safeQubitState.probability0 * 100).toFixed(1)}%
        </div>
        <div className="text-quantum-neon">
          |1⟩: {(safeQubitState.probability1 * 100).toFixed(1)}%
        </div>
        <div className="text-muted-foreground">
          φ: {safeQubitState.phase.toFixed(2)}
        </div>
      </div>
    </div>
  );
}
