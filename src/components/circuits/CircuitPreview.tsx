
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface CircuitPreviewProps {
  fileId?: string;
  circuit?: any;
}

export function CircuitPreview({ fileId, circuit }: CircuitPreviewProps) {
  return (
    <Card className="w-full h-32">
      <CardContent className="p-2">
        <div className="text-sm text-muted-foreground">
          Circuit Preview {fileId && `(${fileId})`}
        </div>
      </CardContent>
    </Card>
  );
}
