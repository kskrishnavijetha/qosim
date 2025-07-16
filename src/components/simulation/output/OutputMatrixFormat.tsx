
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { Badge } from '@/components/ui/badge';

interface OutputMatrixFormatProps {
  simulationResult: OptimizedSimulationResult;
}

export function OutputMatrixFormat({ simulationResult }: OutputMatrixFormatProps) {
  const { qubitStates, measurementProbabilities } = simulationResult;

  const formatComplex = (amplitude: { real: number; imag: number }) => {
    const real = amplitude.real.toFixed(4);
    const imag = Math.abs(amplitude.imag).toFixed(4);
    const sign = amplitude.imag >= 0 ? '+' : '-';
    return imag === '0.0000' ? real : `${real}${sign}${imag}i`;
  };

  const formatBasisState = (index: number, numQubits: number) => {
    return `|${index.toString(2).padStart(numQubits, '0')}⟩`;
  };

  const numQubits = qubitStates.length;
  const stateVectorSize = Math.pow(2, numQubits);

  return (
    <div className="space-y-6">
      {/* Individual Qubit States */}
      <div>
        <h4 className="text-sm font-mono text-quantum-glow mb-3">Individual Qubit States</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {qubitStates.map((qubit, index) => (
            <div key={index} className="quantum-panel neon-border rounded p-3">
              <div className="text-xs text-quantum-neon mb-2">Qubit {index}</div>
              <div className="font-mono text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-quantum-particle">State:</span>
                  <span className="text-quantum-glow">{qubit.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-quantum-particle">Amplitude:</span>
                  <span className="text-quantum-neon">
                    {formatComplex(qubit.amplitude)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-quantum-particle">Phase:</span>
                  <span className="text-quantum-plasma">
                    {qubit.phase.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-quantum-particle">Probability:</span>
                  <Badge variant="outline" className="text-xs">
                    {(qubit.probability * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full State Vector */}
      <div>
        <h4 className="text-sm font-mono text-quantum-glow mb-3">
          Full State Vector ({stateVectorSize} dimensions)
        </h4>
        <div className="quantum-panel neon-border rounded p-4 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {measurementProbabilities.map((prob, index) => {
              if (prob < 0.001) return null; // Skip negligible amplitudes
              
              // Calculate amplitude from probability (simplified)
              const amplitude = Math.sqrt(prob);
              
              return (
                <div key={index} className="flex items-center justify-between font-mono text-sm">
                  <span className="text-quantum-neon">
                    {formatBasisState(index, numQubits)}:
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-quantum-glow">
                      {amplitude.toFixed(4)}
                    </span>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        backgroundColor: `hsl(var(--quantum-matrix) / ${prob})`,
                        borderColor: 'hsl(var(--quantum-glow))'
                      }}
                    >
                      {(prob * 100).toFixed(2)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* State Vector Properties */}
      <div>
        <h4 className="text-sm font-mono text-quantum-glow mb-3">State Properties</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="quantum-panel neon-border rounded p-3 text-center">
            <div className="text-xs text-quantum-particle mb-1">Dimensions</div>
            <div className="text-lg font-mono text-quantum-glow">{stateVectorSize}</div>
          </div>
          <div className="quantum-panel neon-border rounded p-3 text-center">
            <div className="text-xs text-quantum-particle mb-1">Qubits</div>
            <div className="text-lg font-mono text-quantum-neon">{numQubits}</div>
          </div>
          <div className="quantum-panel neon-border rounded p-3 text-center">
            <div className="text-xs text-quantum-particle mb-1">Non-zero States</div>
            <div className="text-lg font-mono text-quantum-plasma">
              {measurementProbabilities.filter(p => p > 0.001).length}
            </div>
          </div>
          <div className="quantum-panel neon-border rounded p-3 text-center">
            <div className="text-xs text-quantum-particle mb-1">Normalization</div>
            <div className="text-lg font-mono text-quantum-glow">
              {measurementProbabilities.reduce((sum, p) => sum + p, 0).toFixed(3)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
