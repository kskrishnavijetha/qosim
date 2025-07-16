
import { OptimizedSimulationResult } from '@/lib/quantumSimulatorOptimized';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OutputGraphicalFormatProps {
  simulationResult: OptimizedSimulationResult;
}

export function OutputGraphicalFormat({ simulationResult }: OutputGraphicalFormatProps) {
  const { qubitStates, measurementProbabilities, entanglement } = simulationResult;

  const formatBasisState = (index: number, numQubits: number) => {
    return index.toString(2).padStart(numQubits, '0');
  };

  const numQubits = qubitStates.length;

  // Get significant measurement probabilities
  const significantStates = measurementProbabilities
    .map((prob, index) => ({ index, prob }))
    .filter(({ prob }) => prob > 0.001)
    .sort((a, b) => b.prob - a.prob)
    .slice(0, 10); // Show top 10 states

  return (
    <div className="space-y-6">
      {/* Visual Qubit States */}
      <div>
        <h4 className="text-sm font-mono text-quantum-glow mb-4">Qubit State Visualization</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {qubitStates.map((qubit, index) => {
            const amplitude = Math.sqrt(qubit.probability);
            return (
              <div key={index} className="flex flex-col items-center space-y-3">
                <div className="text-xs font-mono text-quantum-neon">Qubit {index}</div>
                
                {/* Bloch Sphere Representation */}
                <div 
                  className="w-16 h-16 rounded-full border-2 border-quantum-neon flex items-center justify-center quantum-float relative"
                  style={{
                    background: `conic-gradient(from ${qubit.phase}rad, hsl(var(--quantum-glow) / 0.3), hsl(var(--quantum-neon) / 0.5), hsl(var(--quantum-particle) / 0.3))`,
                    transform: `rotateX(${qubit.phase}rad)`,
                    boxShadow: `0 0 ${20 * amplitude}px hsl(var(--quantum-glow) / ${amplitude})`
                  }}
                >
                  <div 
                    className="w-2 h-2 bg-white rounded-full"
                    style={{
                      transform: `translate(${Math.cos(qubit.phase) * 8}px, ${Math.sin(qubit.phase) * 8}px)`
                    }}
                  />
                </div>
                
                {/* State Info */}
                <div className="text-center space-y-1">
                  <div className="text-xs font-mono text-quantum-glow">{qubit.state}</div>
                  <Badge variant="outline" className="text-xs">
                    {(qubit.probability * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Measurement Probability Chart */}
      <div>
        <h4 className="text-sm font-mono text-quantum-glow mb-4">Measurement Probabilities</h4>
        <div className="space-y-3">
          {significantStates.map(({ index, prob }) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-quantum-neon font-mono text-sm min-w-[60px]">
                    |{formatBasisState(index, numQubits)}⟩
                  </span>
                  <span className="text-xs text-quantum-particle">
                    ({index})
                  </span>
                </div>
                <Badge variant="outline" className="text-xs font-mono">
                  {(prob * 100).toFixed(2)}%
                </Badge>
              </div>
              
              <div className="relative">
                <Progress 
                  value={prob * 100} 
                  className="h-3 quantum-panel neon-border"
                />
                <div 
                  className="absolute top-0 left-0 h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${prob * 100}%`,
                    background: `linear-gradient(90deg, 
                      hsl(var(--quantum-glow) / 0.8), 
                      hsl(var(--quantum-neon) / 0.6), 
                      hsl(var(--quantum-particle) / 0.4)
                    )`,
                    boxShadow: `0 0 10px hsl(var(--quantum-glow) / ${prob})`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Entanglement Visualization */}
      {entanglement && entanglement.pairs.length > 0 && (
        <div>
          <h4 className="text-sm font-mono text-quantum-glow mb-4">Quantum Entanglement</h4>
          <div className="quantum-panel neon-border rounded p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-xs text-quantum-particle">Total Entanglement</span>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={entanglement.totalEntanglement * 100} 
                    className="h-2"
                  />
                  <Badge variant="outline" className="text-xs">
                    {(entanglement.totalEntanglement * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <span className="text-xs text-quantum-particle">Entangled Pairs</span>
                <div className="flex flex-wrap gap-1">
                  {entanglement.pairs.map((pair, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      Q{pair.qubit1}-Q{pair.qubit2}
                      <span className="text-quantum-glow ml-1">
                        {(pair.strength * 100).toFixed(0)}%
                      </span>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* State Summary */}
      <div>
        <h4 className="text-sm font-mono text-quantum-glow mb-3">State Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="quantum-panel neon-border rounded p-3 text-center">
            <div className="text-xs text-quantum-particle mb-1">Superposition</div>
            <div className="text-lg font-mono text-quantum-glow">
              {significantStates.length > 1 ? 'Yes' : 'No'}
            </div>
          </div>
          <div className="quantum-panel neon-border rounded p-3 text-center">
            <div className="text-xs text-quantum-particle mb-1">Max Probability</div>
            <div className="text-lg font-mono text-quantum-neon">
              {(Math.max(...measurementProbabilities) * 100).toFixed(1)}%
            </div>
          </div>
          <div className="quantum-panel neon-border rounded p-3 text-center">
            <div className="text-xs text-quantum-particle mb-1">Active States</div>
            <div className="text-lg font-mono text-quantum-plasma">
              {significantStates.length}
            </div>
          </div>
          <div className="quantum-panel neon-border rounded p-3 text-center">
            <div className="text-xs text-quantum-particle mb-1">Entanglement</div>
            <div className="text-lg font-mono text-quantum-glow">
              {entanglement ? (entanglement.totalEntanglement * 100).toFixed(0) + '%' : '0%'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
