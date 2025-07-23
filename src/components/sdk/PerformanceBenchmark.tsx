
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, BarChart3, Zap, Clock, Cpu, Database, TrendingUp } from 'lucide-react';

const benchmarkResults = [
  {
    algorithm: 'Bell State',
    backend: 'Local',
    qubits: 2,
    gates: 2,
    executionTime: 1.2,
    fidelity: 0.999,
    memoryUsage: '64 KB',
    throughput: 833
  },
  {
    algorithm: 'Bell State',
    backend: 'IBM Q',
    qubits: 2,
    gates: 2,
    executionTime: 45.6,
    fidelity: 0.952,
    memoryUsage: '128 KB',
    throughput: 22
  },
  {
    algorithm: 'Grover 3Q',
    backend: 'Local',
    qubits: 3,
    gates: 15,
    executionTime: 8.4,
    fidelity: 0.985,
    memoryUsage: '256 KB',
    throughput: 119
  },
  {
    algorithm: 'Grover 3Q',
    backend: 'AWS Braket',
    qubits: 3,
    gates: 15,
    executionTime: 120.3,
    fidelity: 0.934,
    memoryUsage: '512 KB',
    throughput: 8
  },
  {
    algorithm: 'QFT 4Q',
    backend: 'Local',
    qubits: 4,
    gates: 24,
    executionTime: 15.7,
    fidelity: 0.978,
    memoryUsage: '1 MB',
    throughput: 64
  },
  {
    algorithm: 'QFT 4Q',
    backend: 'Rigetti',
    qubits: 4,
    gates: 24,
    executionTime: 89.2,
    fidelity: 0.941,
    memoryUsage: '2 MB',
    throughput: 11
  }
];

export function PerformanceBenchmark() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('all');
  const [selectedBackend, setSelectedBackend] = useState('all');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runBenchmark = async () => {
    setIsRunning(true);
    setProgress(0);
    
    const intervals = [20, 40, 60, 80, 100];
    
    for (const targetProgress of intervals) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setProgress(targetProgress);
    }
    
    setIsRunning(false);
  };

  const filteredResults = benchmarkResults.filter(result => {
    const matchesAlgorithm = selectedAlgorithm === 'all' || result.algorithm.toLowerCase().includes(selectedAlgorithm.toLowerCase());
    const matchesBackend = selectedBackend === 'all' || result.backend.toLowerCase().includes(selectedBackend.toLowerCase());
    return matchesAlgorithm && matchesBackend;
  });

  const getBackendColor = (backend: string) => {
    switch (backend) {
      case 'Local': return 'bg-green-500/20 text-green-400';
      case 'IBM Q': return 'bg-blue-500/20 text-blue-400';
      case 'AWS Braket': return 'bg-orange-500/20 text-orange-400';
      case 'Rigetti': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-quantum-neon/20 text-quantum-neon';
    }
  };

  return (
    <div className="space-y-6">
      {/* Benchmark Controls */}
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-xl text-quantum-glow flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Performance Benchmark Suite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-quantum-neon mb-2">Algorithm</label>
              <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Algorithms</SelectItem>
                  <SelectItem value="bell">Bell State</SelectItem>
                  <SelectItem value="grover">Grover's Search</SelectItem>
                  <SelectItem value="qft">QFT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-quantum-neon mb-2">Backend</label>
              <Select value={selectedBackend} onValueChange={setSelectedBackend}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Backends</SelectItem>
                  <SelectItem value="local">Local Simulator</SelectItem>
                  <SelectItem value="ibm">IBM Q</SelectItem>
                  <SelectItem value="aws">AWS Braket</SelectItem>
                  <SelectItem value="rigetti">Rigetti</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={runBenchmark} 
                disabled={isRunning}
                className="w-full neon-border"
              >
                {isRunning ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Benchmark
                  </>
                )}
              </Button>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Compare Results
              </Button>
            </div>
          </div>
          
          {isRunning && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-quantum-neon">Benchmark Progress</span>
                <span className="text-quantum-particle">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="results" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-lg text-quantum-glow">Benchmark Results</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-quantum-neon">Algorithm</TableHead>
                    <TableHead className="text-quantum-neon">Backend</TableHead>
                    <TableHead className="text-quantum-neon">Qubits</TableHead>
                    <TableHead className="text-quantum-neon">Gates</TableHead>
                    <TableHead className="text-quantum-neon">Time (ms)</TableHead>
                    <TableHead className="text-quantum-neon">Fidelity</TableHead>
                    <TableHead className="text-quantum-neon">Memory</TableHead>
                    <TableHead className="text-quantum-neon">Throughput</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-quantum-glow font-medium">
                        {result.algorithm}
                      </TableCell>
                      <TableCell>
                        <Badge className={getBackendColor(result.backend)}>
                          {result.backend}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-quantum-particle">{result.qubits}</TableCell>
                      <TableCell className="text-quantum-particle">{result.gates}</TableCell>
                      <TableCell className="text-quantum-particle">{result.executionTime}</TableCell>
                      <TableCell className="text-quantum-particle">
                        {(result.fidelity * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-quantum-particle">{result.memoryUsage}</TableCell>
                      <TableCell className="text-quantum-particle">
                        {result.throughput} ops/s
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="quantum-panel neon-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Average Execution Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-quantum-glow">
                  {(filteredResults.reduce((sum, r) => sum + r.executionTime, 0) / filteredResults.length).toFixed(1)}ms
                </div>
                <p className="text-sm text-quantum-neon mt-2">
                  Across {filteredResults.length} benchmarks
                </p>
              </CardContent>
            </Card>

            <Card className="quantum-panel neon-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Average Fidelity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-quantum-glow">
                  {(filteredResults.reduce((sum, r) => sum + r.fidelity, 0) / filteredResults.length * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-quantum-neon mt-2">
                  Quantum state accuracy
                </p>
              </CardContent>
            </Card>

            <Card className="quantum-panel neon-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Average Throughput
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-quantum-glow">
                  {(filteredResults.reduce((sum, r) => sum + r.throughput, 0) / filteredResults.length).toFixed(0)}
                </div>
                <p className="text-sm text-quantum-neon mt-2">
                  Operations per second
                </p>
              </CardContent>
            </Card>

            <Card className="quantum-panel neon-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-quantum-glow flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Memory Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-quantum-glow">
                  {Math.round(filteredResults.length / 6 * 100)}%
                </div>
                <p className="text-sm text-quantum-neon mt-2">
                  Optimal memory usage
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-lg text-quantum-glow">Performance Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-quantum-glow">Backend Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-quantum-neon">Local Simulator</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-quantum-matrix/30 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                        </div>
                        <span className="text-quantum-particle text-sm">95%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-quantum-neon">IBM Q</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-quantum-matrix/30 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }} />
                        </div>
                        <span className="text-quantum-particle text-sm">78%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-quantum-neon">AWS Braket</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-quantum-matrix/30 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '72%' }} />
                        </div>
                        <span className="text-quantum-particle text-sm">72%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-quantum-glow">Algorithm Complexity</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-quantum-neon">Bell State</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-quantum-matrix/30 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }} />
                        </div>
                        <span className="text-quantum-particle text-sm">Low</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-quantum-neon">Grover's Search</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-quantum-matrix/30 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }} />
                        </div>
                        <span className="text-quantum-particle text-sm">Medium</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-quantum-neon">QFT</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-quantum-matrix/30 rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }} />
                        </div>
                        <span className="text-quantum-particle text-sm">High</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-lg text-quantum-glow">Backend Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['Local', 'IBM Q', 'AWS Braket', 'Rigetti'].map(backend => {
                    const backendResults = filteredResults.filter(r => r.backend === backend);
                    const avgTime = backendResults.reduce((sum, r) => sum + r.executionTime, 0) / backendResults.length;
                    const avgFidelity = backendResults.reduce((sum, r) => sum + r.fidelity, 0) / backendResults.length;
                    
                    return (
                      <Card key={backend} className="quantum-panel neon-border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-quantum-glow">{backend}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-quantum-neon">Avg Time:</span>
                            <span className="text-quantum-particle">{avgTime.toFixed(1)}ms</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-quantum-neon">Avg Fidelity:</span>
                            <span className="text-quantum-particle">{(avgFidelity * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-quantum-neon">Tests:</span>
                            <span className="text-quantum-particle">{backendResults.length}</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="text-sm text-quantum-neon space-y-2">
                  <h4 className="font-semibold text-quantum-glow">Key Insights:</h4>
                  <ul className="space-y-1 text-quantum-particle">
                    <li>• Local simulators provide fastest execution times for development</li>
                    <li>• IBM Q offers good balance of performance and real quantum hardware</li>
                    <li>• AWS Braket provides scalable cloud-based quantum computing</li>
                    <li>• Rigetti excels in specific algorithm types with optimized gates</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
