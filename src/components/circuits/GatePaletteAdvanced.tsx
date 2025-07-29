
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CircuitGate } from '@/hooks/useCircuitBuilder';
import { Plus, Zap, RotateCcw } from 'lucide-react';

interface GatePaletteAdvancedProps {
  onGateSelect: (gateType: string, qubits: string[], position: { x: number; y: number }) => void;
  onQubitAdd: () => void;
  selectedGate: CircuitGate | null;
}

const singleGates = [
  { type: 'I', name: 'Identity', color: 'bg-slate-500' },
  { type: 'H', name: 'Hadamard', color: 'bg-purple-500' },
  { type: 'X', name: 'Pauli-X', color: 'bg-cyan-500' },
  { type: 'Y', name: 'Pauli-Y', color: 'bg-purple-500' },
  { type: 'Z', name: 'Pauli-Z', color: 'bg-purple-500' },
  { type: 'S', name: 'S Gate', color: 'bg-cyan-500' },
  { type: 'T', name: 'T Gate', color: 'bg-cyan-500' }
];

const parametricGates = [
  { type: 'RX', name: 'Rotation X', color: 'bg-cyan-500' },
  { type: 'RY', name: 'Rotation Y', color: 'bg-slate-600' },
  { type: 'RZ', name: 'Rotation Z', color: 'bg-orange-500' }
];

const multiGates = [
  { type: 'CNOT', name: 'CNOT', color: 'bg-purple-500' },
  { type: 'CZ', name: 'CZ', color: 'bg-red-500' },
  { type: 'SWAP', name: 'SWAP', color: 'bg-green-500' }
];

const specialGates = [
  { type: 'M', name: 'Measure', color: 'bg-red-600' },
  { type: 'BARRIER', name: 'Barrier', color: 'bg-orange-500' }
];

export function GatePaletteAdvanced({ onGateSelect, onQubitAdd, selectedGate }: GatePaletteAdvancedProps) {
  const [customAngle, setCustomAngle] = useState(Math.PI / 4);
  const [selectedQubits, setSelectedQubits] = useState<string[]>([]);

  const handleGateClick = (gateType: string) => {
    onGateSelect(gateType, selectedQubits, { x: 200, y: 100 });
  };

  const renderGateSection = (title: string, gates: typeof singleGates, icon?: React.ReactNode) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
          {icon}
          <span>{title}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {gates.map((gate) => (
            <Button
              key={gate.type}
              variant="outline"
              className={`h-12 w-full ${gate.color} border-0 text-white font-bold hover:opacity-80 transition-opacity rounded-lg`}
              onClick={() => handleGateClick(gate.type)}
            >
              {gate.type}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-800 p-4 space-y-6 min-h-full">
      {/* Header */}
      <div className="flex items-center gap-2 text-cyan-400 font-medium">
        <div className="w-4 h-4 bg-cyan-400 rounded-sm"></div>
        <span>Quantum Gate Palette</span>
      </div>

      {/* Circuit Controls */}
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
          onClick={onQubitAdd}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Qubit
        </Button>
        
        {selectedGate && (
          <div className="p-2 bg-slate-700 rounded">
            <div className="text-xs font-semibold mb-1 text-slate-300">Selected Gate</div>
            <Badge variant="secondary" className="bg-slate-600 text-white">
              {selectedGate.type}
            </Badge>
          </div>
        )}
      </div>

      {/* Gate Sections */}
      {renderGateSection('Single Gates', singleGates, 
        <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
      )}

      {renderGateSection('Parametric Gates', parametricGates, 
        <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
      )}

      {/* Angle parameter for rotation gates */}
      <div className="space-y-2">
        <Label htmlFor="angle" className="text-sm text-slate-300">Rotation Angle</Label>
        <Input
          id="angle"
          type="number"
          value={customAngle}
          onChange={(e) => setCustomAngle(parseFloat(e.target.value))}
          step="0.1"
          min="0"
          max={2 * Math.PI}
          className="bg-slate-700 border-slate-600 text-white"
        />
        <div className="text-xs text-slate-400">
          {(customAngle * 180 / Math.PI).toFixed(1)}°
        </div>
      </div>

      {renderGateSection('Multi Gates', multiGates, 
        <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
      )}

      {renderGateSection('Special Gates', specialGates, 
        <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
      )}

      {/* Quick Actions */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-300">Quick Actions</div>
        <div className="space-y-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
            onClick={() => handleGateClick('H')}
          >
            <Zap className="w-4 h-4 mr-1" />
            Add Hadamard
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
            onClick={() => handleGateClick('CNOT')}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Add CNOT
          </Button>
        </div>
      </div>
    </div>
  );
}
