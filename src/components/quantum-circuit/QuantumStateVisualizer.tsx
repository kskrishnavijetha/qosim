
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlochSphere3D } from './BlochSphere3D';
import { AmplitudeChart } from './AmplitudeChart';
import { useCircuitStore } from '@/store/circuitStore';
import { useQuantumSimulation } from '@/hooks/useQuantumSimulation';
import { Eye, Activity } from 'lucide-react';

export function QuantumStateVisualizer() {
  const { gates, numQubits } = useCircuitStore();
  const { simulationResult } = useQuantumSimulation();

  const qubitStates = useMemo(() => {
    if (!simulationResult) {
      // Default state |0⟩ for all qubits
      return Array.from({ length: numQubits }, (_, i) => ({
        qubit: i,
        amplitude0: { real: 1, imag: 0 },
        amplitude1: { real: 0, imag: 0 },
        probability0: 1,
        probability1: 0,
        phase: 0,
        blochCoordinates: { x: 0, y: 0, z: 1 }
      }));
    }

    return simulationResult.qubitStates.map((state, i) => ({
      qubit: i,
      amplitude0: { real: Math.sqrt(1 - state.probability), imag: 0 },
      amplitude1: { real: Math.sqrt(state.probability), imag: 0 },
      probability0: 1 - state.probability,
      probability1: state.probability,
      phase: state.blochCoordinates ? Math.atan2(state.blochCoordinates.y, state.blochCoordinates.x) : 0,
      blochCoordinates: state.blochCoordinates || { x: 0, y: 0, z: 1 }
    }));
  }, [simulationResult, numQubits]);

  const stateVector = useMemo(() => {
    if (!simulationResult) {
      const size = Math.pow(2, numQubits);
      return Array.from({ length: size }, (_, i) => ({
        index: i,
        amplitude: { real: i === 0 ? 1 : 0, imag: 0 },
        probability: i === 0 ? 1 : 0,
        state: i.toString(2).padStart(numQubits, '0')
      }));
    }

    return simulationResult.stateVector.map((amp, i) => ({
      index: i,
      amplitude: amp,
      probability: amp.real * amp.real + amp.imag * amp.imag,
      state: i.toString(2).padStart(numQubits, '0')
    }));
  }, [simulationResult, numQubits]);

  if (gates.length === 0) {
    return (
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Quantum State Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Add gates to your circuit to see quantum state visualization</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bloch Spheres */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Bloch Sphere Visualization
            <Badge variant="secondary" className="ml-2">
              {numQubits} qubits
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {qubitStates.map(state => (
              <BlochSphere3D
                key={state.qubit}
                qubitIndex={state.qubit}
                qubitState={state}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Amplitude Chart */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-sm text-quantum-neon flex items-center gap-2">
            <Activity className="w-4 h-4" />
            State Vector Amplitudes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AmplitudeChart stateVector={stateVector} />
        </CardContent>
      </Card>
    </div>
  );
}
