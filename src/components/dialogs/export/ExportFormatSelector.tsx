
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
    console.log('Export action triggered');
    action();
    onOpenChange(false);
  };

  console.log('ExportFormatSelector render - open:', open);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <Download className="w-6 h-6 text-blue-600" />
            Choose Export Format
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-2">
          {exportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card key={option.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Button
                    onClick={() => handleExport(option.action)}
                    variant="ghost"
                    className="w-full justify-start gap-4 p-6 h-auto min-h-[80px] hover:bg-gray-50 dark:hover:bg-gray-700 text-left"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg text-gray-900 dark:text-white">{option.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">{option.description}</div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
