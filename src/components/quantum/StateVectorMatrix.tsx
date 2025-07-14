import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StateVectorMatrixProps {
  stateVector: { real: number; imag: number; magnitude: number; phase: number }[];
  probabilities: number[];
  basisStates: { state: string; amplitude: { real: number; imag: number }; probability: number }[];
}

export function StateVectorMatrix({ stateVector, probabilities, basisStates }: StateVectorMatrixProps) {
  const formatComplex = (amplitude: { real: number; imag: number }) => {
    const real = amplitude.real.toFixed(4);
    const imag = Math.abs(amplitude.imag).toFixed(4);
    const sign = amplitude.imag >= 0 ? '+' : '-';
    return imag === '0.0000' ? real : `${real}${sign}${imag}i`;
  };

  const formatBasisState = (state: string) => {
    return `|${state}⟩`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* State Vector Matrix */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">State Vector</CardTitle>
          <CardDescription className="text-quantum-particle">
            Complex amplitudes for each basis state
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="quantum-panel neon-border rounded p-4 space-y-2 max-h-64 overflow-y-auto">
            {stateVector.map((amplitude, index) => {
              const binaryState = index.toString(2).padStart(Math.log2(stateVector.length), '0');
              return (
                <div key={index} className="flex items-center justify-between font-mono text-sm">
                  <span className="text-quantum-neon">{formatBasisState(binaryState)}:</span>
                  <div className="text-right">
                    <span className="text-quantum-glow">
                      {formatComplex(amplitude)}
                    </span>
                    <Badge 
                      variant="outline" 
                      className="ml-2 text-xs"
                      style={{ 
                        backgroundColor: `hsl(var(--quantum-matrix) / ${amplitude.magnitude})`,
                        borderColor: 'hsl(var(--quantum-glow))'
                      }}
                    >
                      {(amplitude.magnitude * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Measurement Probabilities */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Measurement Probabilities</CardTitle>
          <CardDescription className="text-quantum-particle">
            Probability of measuring each computational basis state
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {basisStates
              .filter(basis => basis.probability > 0.001) // Only show significant probabilities
              .sort((a, b) => b.probability - a.probability)
              .map((basis, index) => (
                <div key={index} className="quantum-panel neon-border rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-quantum-neon font-mono text-lg">
                      {formatBasisState(basis.state)}
                    </span>
                    <Badge 
                      variant="outline" 
                      className="text-quantum-glow text-sm"
                    >
                      {(basis.probability * 100).toFixed(2)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-quantum-void rounded-full h-2">
                    <div 
                      className="h-2 rounded-full neon-glow"
                      style={{
                        width: `${basis.probability * 100}%`,
                        background: 'linear-gradient(90deg, hsl(var(--quantum-matrix)), hsl(var(--quantum-glow)))'
                      }}
                    />
                  </div>
                  <div className="text-xs text-quantum-particle mt-1 font-mono">
                    Amplitude: {formatComplex(basis.amplitude)}
                  </div>
                </div>
              ))}
            
            {basisStates.filter(basis => basis.probability > 0.001).length === 0 && (
              <div className="text-center text-quantum-particle py-8">
                No significant measurement probabilities
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}