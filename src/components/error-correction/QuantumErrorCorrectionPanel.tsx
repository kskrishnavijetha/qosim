
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
      description: 'The 4D toric code extends the 2D toric code into four dimensions, providing superior error correction capabilities with WebGL visualization and real-time syndrome tracking.',
      keyPoints: [
        'Interactive 4D lattice visualization using Three.js with WebGL acceleration',
        'Real-time error syndrome detection and automatic correction algorithms',
        'Anyonic braiding simulation in 4D space with user-defined error patterns',
        'Surface code behavior visualization with qubit decoherence tracking',
        'Higher error threshold compared to 2D and 3D codes with visual feedback'
      ]
    },
    'comparison': {
      title: 'Multi-Dimensional TQEC Comparison',
      description: 'Compare different dimensional topological codes with interactive 3D lattice structures and performance metrics.',
      keyPoints: [
        '2D Surface Code: Interactive planar lattice with syndrome visualization',
        '3D Codes: Volumetric error correction with enhanced protection',
        '4D Toric Code: Hypercubic lattice with maximum error suppression',
        'Real-time performance comparison with visual error tracking',
        'Automatic correction algorithm benchmarking across dimensions'
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
              4D Topological Quantum Error Correction Suite
            </h1>
            <p className="text-quantum-text">
              Advanced 4D TQEC simulation with WebGL visualization and real-time syndrome tracking
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-quantum-neon border-quantum-neon">
            <Zap className="w-4 h-4 mr-1" />
            4D TQEC Module
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
            4D TQEC Simulator
          </TabsTrigger>
          <TabsTrigger 
            value="comparison" 
            className="data-[state=active]:bg-quantum-neon/20 text-quantum-text"
          >
            <Zap className="w-4 h-4 mr-2" />
            Multi-Dimensional Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="4d-simulator" className="h-[calc(100%-80px)] mt-4">
          <FourDToricCode />
        </TabsContent>

        <TabsContent value="comparison" className="h-[calc(100%-80px)] mt-4">
          <ErrorCorrectionComparison />
        </TabsContent>
      </Tabs>
    </div>
  );
}
