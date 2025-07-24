
import React from 'react';
import { FileText, Code, FileCode, Braces } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ExportFormatButtonsProps {
  onExportJSON: () => void;
  onExportQASM: () => void;
  onExportPython: () => void;
  onExportJavaScript: () => void;
}

export function ExportFormatButtons({ 
  onExportJSON, 
  onExportQASM, 
  onExportPython,
  onExportJavaScript 
}: ExportFormatButtonsProps) {
  return (
    <Card className="quantum-panel border-quantum-glow/20">
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-quantum-glow">Export Formats</h3>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            onClick={onExportJSON} 
            variant="outline" 
            className="neon-border flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            JSON
          </Button>

          <Button 
            onClick={onExportQASM} 
            variant="outline" 
            className="neon-border flex items-center gap-2"
          >
            <Code className="w-4 h-4" />
            QASM
          </Button>

          <Button 
            onClick={onExportPython} 
            variant="outline" 
            className="neon-border flex items-center gap-2"
          >
            <FileCode className="w-4 h-4" />
            Python
          </Button>

          <Button 
            onClick={onExportJavaScript} 
            variant="outline" 
            className="neon-border flex items-center gap-2"
          >
            <Braces className="w-4 h-4" />
            JavaScript
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
