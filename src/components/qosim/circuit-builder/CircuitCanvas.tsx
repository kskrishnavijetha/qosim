
import React, { useRef, useEffect } from 'react';

interface CircuitCanvasProps {
  circuit: any;
  onCircuitChange: (circuit: any) => void;
}

export function CircuitCanvas({ circuit, onCircuitChange }: CircuitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw qubits
    for (let i = 0; i < circuit.qubits; i++) {
      const y = 50 + i * 80;
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(750, y);
      ctx.stroke();

      // Qubit label
      ctx.fillStyle = '#333';
      ctx.font = '14px monospace';
      ctx.fillText(`|q${i}⟩`, 10, y + 5);
    }

    // Draw gates
    circuit.gates.forEach((gate: any, index: number) => {
      const x = 100 + index * 60;
      const y = 50 + gate.qubit * 80;

      ctx.fillStyle = '#4f46e5';
      ctx.fillRect(x - 15, y - 15, 30, 30);
      
      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(gate.type, x, y + 4);
    });
  }, [circuit]);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}
