import { useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlochSphereProps {
  qubitStates: {
    real: number;
    imag: number;
    magnitude: number;
    phase: number;
  }[];
  measurements: { [qubit: number]: { "0": number; "1": number } };
}

export function BlochSphereVisualization({ qubitStates, measurements }: BlochSphereProps) {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const drawBlochSphere = (canvas: HTMLCanvasElement, state: any, qubitIndex: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Set quantum theme colors
    ctx.strokeStyle = 'hsl(var(--quantum-glow))';
    ctx.fillStyle = 'hsl(var(--quantum-particle))';

    // Draw sphere outline
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw equator
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw meridian
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 0.3, radius, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Calculate state vector on Bloch sphere
    const prob0 = measurements[qubitIndex]?.["0"] || 0;
    const prob1 = measurements[qubitIndex]?.["1"] || 0;
    
    // Convert to spherical coordinates
    const theta = 2 * Math.acos(Math.sqrt(prob0)); // polar angle
    const phi = state.phase; // azimuthal angle

    // Convert to Cartesian coordinates
    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    // Project to 2D
    const screenX = centerX + x * radius;
    const screenY = centerY - z * radius;

    // Draw state vector
    ctx.strokeStyle = 'hsl(var(--quantum-matrix))';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(screenX, screenY);
    ctx.stroke();

    // Draw state point
    ctx.fillStyle = 'hsl(var(--quantum-glow))';
    ctx.beginPath();
    ctx.arc(screenX, screenY, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Add axis labels
    ctx.fillStyle = 'hsl(var(--quantum-neon))';
    ctx.font = '12px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('|0⟩', centerX, centerY - radius - 10);
    ctx.fillText('|1⟩', centerX, centerY + radius + 20);
    ctx.textAlign = 'left';
    ctx.fillText('X', centerX + radius + 5, centerY + 5);
    ctx.textAlign = 'right';
    ctx.fillText('Y', centerX - radius - 5, centerY - 5);
  };

  useEffect(() => {
    canvasRefs.current.forEach((canvas, index) => {
      if (canvas && qubitStates[index]) {
        drawBlochSphere(canvas, qubitStates[index], index);
      }
    });
  }, [qubitStates, measurements]);

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <CardTitle className="text-quantum-glow">Bloch Sphere Visualization</CardTitle>
        <CardDescription className="text-quantum-particle">
          Real-time qubit state representation on the Bloch sphere
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {qubitStates.map((state, index) => (
            <div key={index} className="text-center">
              <div className="quantum-panel neon-border p-4 rounded-lg">
                <h4 className="text-quantum-neon font-mono mb-2">Qubit {index}</h4>
                <canvas
                  ref={el => canvasRefs.current[index] = el}
                  width={200}
                  height={200}
                  className="border border-quantum-matrix rounded bg-quantum-void/20"
                />
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-quantum-particle">|0⟩:</span>
                    <Badge variant="outline" className="text-quantum-glow">
                      {((measurements[index]?.["0"] || 0) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-quantum-particle">|1⟩:</span>
                    <Badge variant="outline" className="text-quantum-matrix">
                      {((measurements[index]?.["1"] || 0) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="text-xs text-quantum-neon">
                    φ = {state.phase.toFixed(3)} rad
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}