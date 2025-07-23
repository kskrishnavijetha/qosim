
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw, Save, Share2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { QuantumGatePalette } from './QuantumGatePalette';
import { RealtimeSimulationPanel } from './RealtimeSimulationPanel';
import { WorkspaceToolbar } from './WorkspaceToolbar';
import { CircuitExporter } from './CircuitExporter';
import { useCircuitWorkspace, type Gate, type Circuit } from '@/hooks/useCircuitWorkspace';
import { OptimizedQuantumWorkspace } from './OptimizedQuantumWorkspace';

export function QuantumOSWorkspace() {
  // Use the new optimized workspace
  return <OptimizedQuantumWorkspace />;
}
