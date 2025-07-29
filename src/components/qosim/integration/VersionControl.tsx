
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { type QuantumGate, type QuantumSimulationResult } from '@/types/qosim';
import { GitBranch, Clock, Tag, ArrowRight } from 'lucide-react';

interface VersionControlProps {
  circuit: QuantumGate[];
  simulationHistory: QuantumSimulationResult[];
}

export function VersionControl({ circuit, simulationHistory }: VersionControlProps) {
  const [commitMessage, setCommitMessage] = useState('');
  
  const versions = [
    { 
      id: 'v1.2.0', 
      message: 'Added Bell state preparation',
      timestamp: '2024-01-15 14:30',
      gates: 8,
      author: 'Alice'
    },
    { 
      id: 'v1.1.0', 
      message: 'Implemented Grover search',
      timestamp: '2024-01-14 09:15',
      gates: 12,
      author: 'Bob'
    },
    { 
      id: 'v1.0.0', 
      message: 'Initial circuit implementation',
      timestamp: '2024-01-13 16:45',
      gates: 6,
      author: 'Charlie'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Current State */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center">
            <GitBranch className="w-5 h-5 mr-2" />
            Version Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-black/50 rounded-lg p-4 border border-purple-400/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-purple-400">
                  main
                </Badge>
                <Badge variant="outline" className="text-green-400">
                  {circuit.length} gates
                </Badge>
              </div>
              <span className="text-slate-400 text-sm">Working directory</span>
            </div>
            <p className="text-slate-300 text-sm">Current circuit has uncommitted changes</p>
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Commit message..."
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              className="bg-black/50 border-white/10 text-white"
            />
            <div className="flex space-x-2">
              <Button
                disabled={!commitMessage.trim()}
                className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Commit Changes
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-400 border-slate-400/30"
              >
                <Tag className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version History */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {versions.map((version, index) => (
            <div key={version.id} className="bg-black/50 rounded-lg p-3 border border-purple-400/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-purple-400 text-xs">
                    {version.id}
                  </Badge>
                  <span className="text-white text-sm font-medium">{version.author}</span>
                </div>
                <span className="text-slate-400 text-xs">{version.timestamp}</span>
              </div>
              <p className="text-slate-300 text-sm mb-2">{version.message}</p>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {version.gates} gates
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-purple-400 border-purple-400/30"
                >
                  <ArrowRight className="w-3 h-3 mr-1" />
                  Restore
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Branching */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-purple-400">Branch Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Current branch:</span>
            <Badge variant="outline" className="text-purple-400">main</Badge>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-slate-400 border-slate-400/30"
            >
              New Branch
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-slate-400 border-slate-400/30"
            >
              Merge
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
