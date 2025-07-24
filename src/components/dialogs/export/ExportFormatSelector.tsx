
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Code, FileCode, Braces, Download } from 'lucide-react';

interface ExportFormatSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExportJSON: () => void;
  onExportQASM: () => void;
  onExportPython: () => void;
  onExportJavaScript: () => void;
}

export function ExportFormatSelector({ 
  open, 
  onOpenChange, 
  onExportJSON, 
  onExportQASM, 
  onExportPython,
  onExportJavaScript 
}: ExportFormatSelectorProps) {
  const exportOptions = [
    {
      id: 'json',
      name: 'JSON',
      description: 'Export as JSON circuit data',
      icon: FileText,
      action: onExportJSON
    },
    {
      id: 'qasm',
      name: 'OpenQASM',
      description: 'Export as OpenQASM 2.0 code',
      icon: Code,
      action: onExportQASM
    },
    {
      id: 'python',
      name: 'Python',
      description: 'Export as Python/Qiskit code',
      icon: FileCode,
      action: onExportPython
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      description: 'Export as JavaScript/QOSim SDK code',
      icon: Braces,
      action: onExportJavaScript
    }
  ];

  const handleExport = (action: () => void) => {
    action();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="quantum-panel border-quantum-glow/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-quantum-glow flex items-center gap-2">
            <Download className="w-5 h-5" />
            Choose Export Format
          </DialogTitle>
        </DialogHeader>

        <Card className="quantum-panel border-quantum-glow/20">
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              {exportOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.id}
                    onClick={() => handleExport(option.action)}
                    variant="outline"
                    className="w-full justify-start gap-3 p-4 h-auto neon-border hover:bg-quantum-matrix/20"
                  >
                    <Icon className="w-5 h-5 text-quantum-glow" />
                    <div className="text-left">
                      <div className="font-medium text-quantum-glow">{option.name}</div>
                      <div className="text-sm text-quantum-particle">{option.description}</div>
                    </div>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
