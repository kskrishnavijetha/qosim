
import React from 'react';
import { QuantumCircuitBuilder } from '@/components/quantum-circuit/QuantumCircuitBuilder';
import { Toaster } from '@/components/ui/sonner';

export default function CircuitBuilder() {
  return (
    <div className="h-screen">
      <QuantumCircuitBuilder />
      <Toaster />
    </div>
  );
}
