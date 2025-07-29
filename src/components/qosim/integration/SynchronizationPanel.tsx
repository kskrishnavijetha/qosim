
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { type QuantumGate } from '@/types/qosim';
import { RefreshCw, ArrowLeftRight, CheckCircle, AlertCircle } from 'lucide-react';

interface SynchronizationPanelProps {
  circuit: QuantumGate[];
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  onSyncToSDK: () => void;
  onSyncToBuilder: () => void;
}

export function SynchronizationPanel({ 
  circuit, 
  syncStatus, 
  onSyncToSDK, 
  onSyncToBuilder 
}: SynchronizationPanelProps) {
  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <ArrowLeftRight className="w-4 h-4" />;
    }
  };

  const getSyncColor = () => {
    switch (syncStatus) {
      case 'syncing': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sync Status */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-emerald-400 flex items-center">
            <RefreshCw className="w-5 h-5 mr-2" />
            Real-Time Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status:</span>
            <div className={`flex items-center space-x-2 ${getSyncColor()}`}>
              {getSyncIcon()}
              <span className="capitalize">{syncStatus}</span>
            </div>
          </div>
          
          {syncStatus === 'syncing' && (
            <Progress value={65} className="w-full" />
          )}
        </CardContent>
      </Card>

      {/* Sync Targets */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-emerald-400">Synchronization Targets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Circuit Builder Sync */}
          <div className="bg-black/50 rounded-lg p-4 border border-cyan-400/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-cyan-400 font-medium">Circuit Builder</h4>
              <Badge variant="outline" className="text-cyan-400">
                Visual Design
              </Badge>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              Sync code changes back to visual circuit representation
            </p>
            <Button
              onClick={onSyncToBuilder}
              disabled={syncStatus === 'syncing'}
              size="sm"
              className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Sync to Builder
            </Button>
          </div>

          {/* SDK Sync */}
          <div className="bg-black/50 rounded-lg p-4 border border-purple-400/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-purple-400 font-medium">Algorithms SDK</h4>
              <Badge variant="outline" className="text-purple-400">
                Code Development
              </Badge>
            </div>
            <p className="text-slate-300 text-sm mb-3">
              Convert visual circuit to SDK code format
            </p>
            <Button
              onClick={onSyncToSDK}
              disabled={syncStatus === 'syncing' || circuit.length === 0}
              size="sm"
              className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400"
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Sync to SDK
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Auto-sync Settings */}
      <Card className="bg-black/30 border-white/10">
        <CardHeader>
          <CardTitle className="text-emerald-400">Auto-Sync Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Auto-sync on changes</span>
            <Badge variant="outline" className="text-green-400">
              Enabled
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Sync interval</span>
            <Badge variant="outline" className="text-slate-400">
              2s
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-sm">Conflict resolution</span>
            <Badge variant="outline" className="text-yellow-400">
              Manual
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
