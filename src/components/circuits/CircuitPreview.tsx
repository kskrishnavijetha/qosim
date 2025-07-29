
import React from 'react';

interface CircuitPreviewProps {
  circuit?: any;
}

export function CircuitPreview({ circuit }: CircuitPreviewProps) {
  return (
    <div className="p-4 border rounded">
      <p className="text-muted-foreground">Circuit preview coming soon</p>
    </div>
  );
}
