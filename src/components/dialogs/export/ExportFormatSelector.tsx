
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
      <DialogContent className="sm:max-w-[425px] bg-background border border-border shadow-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Choose Export Format
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.id}
                onClick={() => handleExport(option.action)}
                variant="outline"
                className="w-full justify-start gap-3 p-4 h-auto hover:bg-accent/50"
              >
                <Icon className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">{option.name}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
