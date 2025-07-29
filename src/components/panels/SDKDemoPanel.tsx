
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SDKDemoPanelProps {
  defaultSDK?: string;
}

export function SDKDemoPanel({ defaultSDK = 'javascript' }: SDKDemoPanelProps) {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>SDK Demo Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <p>SDK Demo for: {defaultSDK}</p>
          <p>This is a placeholder component.</p>
        </CardContent>
      </Card>
    </div>
  );
}
