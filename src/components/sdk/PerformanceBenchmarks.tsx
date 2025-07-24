
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gauge, 
  Play, 
  BarChart3, 
  TrendingUp, 
  Zap,
  Clock,
  Cpu,
  Activity
} from 'lucide-react';

interface BenchmarkResult {
  algorithm: string;
  qubits: number;
  gates: number;
  executionTime: number;
  accuracy: number;
  backend: string;
  timestamp: string;
}

const mockBenchmarkResults: BenchmarkResult[] = [
  {
    algorithm: 'Bell State',
    qubits: 2,
    gates: 2,
    executionTime: 0.8,
    accuracy: 99.9,
    backend: 'QOSim Local',
    timestamp: '2024-01-20 14:30:22'
  },
  {
    algorithm: 'Grover Search',
    qubits: 3,
    gates: 12,
    executionTime: 2.4,
    accuracy: 97.5,
    backend: 'QOSim Local',
    timestamp: '2024-01-20 14:25:15'
  },
  {
    algorithm: 'QFT',
    qubits: 4,
    gates: 16,
    executionTime: 5.2,
    accuracy: 98.8,
    backend: 'QOSim Local',
    timestamp: '2024-01-20 14:20:10'
  }
];

export function PerformanceBenchmarks() {
  const [runningBenchmark, setRunningBenchmark] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BenchmarkResult[]>(mockBenchmarkResults);

  const runBenchmark = async (algorithm: string) => {
    setRunningBenchmark(algorithm);
    setProgress(0);

    // Simulate benchmark execution
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setRunningBenchmark(null);
          
          // Add mock result
          const newResult: BenchmarkResult = {
            algorithm,
            qubits: Math.floor(Math.random() * 5) + 2,
            gates: Math.floor(Math.random() * 20) + 5,
            executionTime: Math.random() * 10 + 1,
            accuracy: 95 + Math.random() * 5,
            backend: 'QOSim Local',
            timestamp: new Date().toLocaleString()
          };
          
          setResults(prev => [newResult, ...prev]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const benchmarkSuites = [
    {
      name: 'Quantum Fundamentals',
      algorithms: ['Bell State', 'GHZ State', 'W State'],
      description: 'Basic quantum state preparation benchmarks'
    },
    {
      name: 'Search Algorithms',
      algorithms: ['Grover Search', 'Amplitude Amplification'],
      description: 'Quantum search algorithm performance'
    },
    {
      name: 'Transform Algorithms',
      algorithms: ['QFT', 'Inverse QFT', 'QWT'],
      description: 'Quantum transform benchmarks'
    },
    {
      name: 'Optimization',
      algorithms: ['VQE', 'QAOA', 'Ansatz Optimization'],
      description: 'Variational quantum algorithm benchmarks'
    }
  ];

  const getPerformanceColor = (executionTime: number) => {
    if (executionTime < 2) return 'text-green-500';
    if (executionTime < 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy > 98) return 'text-green-500';
    if (accuracy > 95) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Benchmark Header */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl text-quantum-glow flex items-center gap-3">
            <Gauge className="w-6 h-6" />
            Performance Benchmarking Suite
            <Badge variant="outline" className="text-quantum-energy">
              Cross-Platform Testing
            </Badge>
          </CardTitle>
          <p className="text-quantum-particle">
            Compare quantum algorithm performance across different backends and configurations
          </p>
        </CardHeader>
      </Card>

      <Tabs defaultValue="run-benchmarks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 quantum-tabs">
          <TabsTrigger value="run-benchmarks" className="quantum-tab">
            <Play className="w-4 h-4 mr-2" />
            Run Benchmarks
          </TabsTrigger>
          <TabsTrigger value="results" className="quantum-tab">
            <BarChart3 className="w-4 h-4 mr-2" />
            Results ({results.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="quantum-tab">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="run-benchmarks" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benchmarkSuites.map((suite, index) => (
              <Card key={index} className="quantum-panel neon-border">
                <CardHeader>
                  <CardTitle className="text-lg text-quantum-glow">{suite.name}</CardTitle>
                  <p className="text-sm text-quantum-particle">{suite.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {suite.algorithms.map(algorithm => (
                    <div key={algorithm} className="flex items-center justify-between p-3 bg-quantum-matrix rounded-lg">
                      <div>
                        <div className="font-mono text-quantum-neon">{algorithm}</div>
                        {runningBenchmark === algorithm && (
                          <div className="mt-2">
                            <Progress value={progress} className="w-full" />
                            <div className="text-xs text-quantum-particle mt-1">
                              Running benchmark... {progress}%
                            </div>
                          </div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => runBenchmark(algorithm)}
                        disabled={runningBenchmark !== null}
                      >
                        {runningBenchmark === algorithm ? (
                          <Zap className="w-4 h-4 animate-spin" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index} className="quantum-panel neon-border">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <div className="font-mono text-quantum-glow">{result.algorithm}</div>
                      <div className="text-xs text-quantum-particle">{result.timestamp}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-quantum-neon font-mono">{result.qubits}</div>
                      <div className="text-xs text-quantum-particle">Qubits</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-quantum-energy font-mono">{result.gates}</div>
                      <div className="text-xs text-quantum-particle">Gates</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-mono ${getPerformanceColor(result.executionTime)}`}>
                        {result.executionTime.toFixed(1)}ms
                      </div>
                      <div className="text-xs text-quantum-particle">Execution</div>
                    </div>
                    
                    <div className="text-center">
                      <div className={`font-mono ${getAccuracyColor(result.accuracy)}`}>
                        {result.accuracy.toFixed(1)}%
                      </div>
                      <div className="text-xs text-quantum-particle">Accuracy</div>
                    </div>
                    
                    <div className="text-center">
                      <Badge variant="secondary" className="text-xs">
                        {result.backend}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Average Execution Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-mono text-quantum-neon">
                  {(results.reduce((sum, r) => sum + r.executionTime, 0) / results.length).toFixed(1)}ms
                </div>
                <div className="text-sm text-quantum-particle">Across all algorithms</div>
              </CardContent>
            </Card>
            
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Average Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-mono text-quantum-energy">
                  {(results.reduce((sum, r) => sum + r.accuracy, 0) / results.length).toFixed(1)}%
                </div>
                <div className="text-sm text-quantum-particle">Simulation fidelity</div>
              </CardContent>
            </Card>
            
            <Card className="quantum-panel neon-border">
              <CardHeader>
                <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Total Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-mono text-quantum-matrix">
                  {results.length}
                </div>
                <div className="text-sm text-quantum-particle">Completed tests</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
