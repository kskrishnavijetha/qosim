
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Code, Share } from 'lucide-react';

interface ExportPanelProps {
  circuit: any;
  onExport: (format: string) => void;
}

export function ExportPanel({ circuit, onExport }: ExportPanelProps) {
  const exportFormats = [
    { key: 'qasm', label: 'OpenQASM', icon: FileText },
    { key: 'json', label: 'JSON', icon: Code },
    { key: 'python', label: 'Python (Qiskit)', icon: Download },
    { key: 'javascript', label: 'JavaScript', icon: Code },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Share className="w-5 h-5" />
          <span>Export Circuit</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {exportFormats.map((format) => (
          <Button
            key={format.key}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onExport(format.key)}
          >
            <format.icon className="w-4 h-4 mr-2" />
            {format.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
