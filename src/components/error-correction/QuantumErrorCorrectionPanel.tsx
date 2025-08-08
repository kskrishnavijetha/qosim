import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Zap, Target, BookOpen } from 'lucide-react';
import { FourDToricCode } from './FourDToricCode';
import { ErrorCorrectionComparison } from './ErrorCorrectionComparison';

interface EducationalContent {
  title: string;
  description: string;
  keyPoints: string[];
}

export function QuantumErrorCorrectionPanel() {
  console.log('QuantumErrorCorrectionPanel: Component is rendering');
  
  const [activeTab, setActiveTab] = useState('4d-simulator');
  const [showEducationalInfo, setShowEducationalInfo] = useState(false);

  const educationalContent: Record<string, EducationalContent> = {
    '4d-simulator': {
      title: '4D Topological Quantum Error Correction',
      description: 'The 4D toric code extends the 2D toric code into four dimensions, providing superior error correction capabilities.',
      keyPoints: [
        'Uses a 4D hypercubic lattice with periodic boundary conditions',
        'Each physical qubit participates in multiple stabilizer measurements',
        'Logical qubits are encoded in non-trivial 4D topological loops',
        'Higher error threshold compared to 2D and 3D codes',
        'Requires complex decoding algorithms but provides better protection'
      ]
    },
    'comparison': {
      title: 'Comparing Error Correction Codes',
      description: 'Different dimensional topological codes offer various trade-offs between error protection and resource requirements.',
      keyPoints: [
        '2D codes: Lower overhead, easier to implement, moderate protection',
        '3D codes: Better error suppression, more complex decoding',
        '4D codes: Highest error thresholds, significant resource overhead',
        'Higher dimensions generally provide better error correction',
        'Practical implementation becomes more challenging in higher dimensions'
      ]
    }
  };

  console.log('QuantumErrorCorrectionPanel: Active tab:', activeTab);

  return (
    <div className="h-full w-full space-y-4 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-quantum-neon" />
          <div>
            <h1 className="text-3xl font-bold text-quantum-glow">
              Quantum Error Correction Suite
            </h1>
            <p className="text-quantum-text">
              Advanced topological error correction simulation and analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-quantum-neon border-quantum-neon">
            <Zap className="w-4 h-4 mr-1" />
            Advanced Module
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEducationalInfo(!showEducationalInfo)}
            className="border-quantum-neon/30 text-quantum-glow hover:bg-quantum-neon/10"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            {showEducationalInfo ? 'Hide' : 'Show'} Info
          </Button>
        </div>
      </div>

      {showEducationalInfo && (
        <Alert className="bg-quantum-dark border-quantum-neon/30">
          <Info className="h-4 w-4 text-quantum-neon" />
          <AlertDescription className="text-quantum-text">
            <div className="space-y-2">
              <h3 className="font-semibold text-quantum-glow">
                {educationalContent[activeTab]?.title}
              </h3>
              <p className="text-sm">
                {educationalContent[activeTab]?.description}
              </p>
              <ul className="text-sm space-y-1 ml-4">
                {educationalContent[activeTab]?.keyPoints.map((point, idx) => (
                  <li key={idx} className="list-disc">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
        <TabsList className="grid w-full grid-cols-2 bg-quantum-dark border-quantum-neon/30">
          <TabsTrigger 
            value="4d-simulator" 
            className="data-[state=active]:bg-quantum-neon/20 text-quantum-text"
          >
            <Target className="w-4 h-4 mr-2" />
            4D Toric Code Simulator
          </TabsTrigger>
          <TabsTrigger 
            value="comparison" 
            className="data-[state=active]:bg-quantum-neon/20 text-quantum-text"
          >
            <Zap className="w-4 h-4 mr-2" />
            Multi-Dimensional Comparison
          </TabsTrigger>
        </TabsList>

        <TabsContent value="4d-simulator" className="h-[calc(100%-80px)] mt-4">
          <div className="p-4 bg-quantum-dark border border-quantum-neon/30 rounded-lg">
            <h2 className="text-xl text-quantum-glow mb-4">4D Toric Code Simulator</h2>
            <p className="text-quantum-text mb-4">
              This is a placeholder for the 4D Toric Code simulator. The 3D visualization components 
              may be causing rendering issues.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-quantum-void/50 rounded border border-quantum-neon/20">
                <h3 className="text-quantum-neon mb-2">Lattice Parameters</h3>
                <p className="text-sm text-quantum-text">Size: 3×3×3 lattice</p>
                <p className="text-sm text-quantum-text">Physical Qubits: 81</p>
                <p className="text-sm text-quantum-text">Stabilizers: 162</p>
              </div>
              <div className="p-4 bg-quantum-void/50 rounded border border-quantum-neon/20">
                <h3 className="text-quantum-neon mb-2">Error Rates</h3>
                <p className="text-sm text-quantum-text">Bit Flip: 1.0%</p>
                <p className="text-sm text-quantum-text">Phase Flip: 1.0%</p>
                <p className="text-sm text-quantum-text">Depolarizing: 0.5%</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="h-[calc(100%-80px)] mt-4">
          <div className="p-4 bg-quantum-dark border border-quantum-neon/30 rounded-lg">
            <h2 className="text-xl text-quantum-glow mb-4">Multi-Dimensional Comparison</h2>
            <p className="text-quantum-text mb-4">
              This is a placeholder for the error correction comparison. The complex 3D visualizations 
              may be causing performance issues.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-quantum-void/50 rounded border border-quantum-neon/20">
                <h3 className="text-quantum-neon mb-2">2D Surface Code</h3>
                <p className="text-sm text-quantum-text">Threshold: 1.1%</p>
                <p className="text-sm text-quantum-text">Physical Qubits: 25</p>
                <p className="text-sm text-quantum-text">Overhead: 1.0×</p>
              </div>
              <div className="p-4 bg-quantum-void/50 rounded border border-quantum-neon/20">
                <h3 className="text-quantum-neon mb-2">3D Surface Code</h3>
                <p className="text-sm text-quantum-text">Threshold: 3.1%</p>
                <p className="text-sm text-quantum-text">Physical Qubits: 216</p>
                <p className="text-sm text-quantum-text">Overhead: 2.5×</p>
              </div>
              <div className="p-4 bg-quantum-void/50 rounded border border-quantum-neon/20">
                <h3 className="text-quantum-neon mb-2">4D Toric Code</h3>
                <p className="text-sm text-quantum-text">Threshold: 5.0%</p>
                <p className="text-sm text-quantum-text">Physical Qubits: 1296</p>
                <p className="text-sm text-quantum-text">Overhead: 5.0×</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
