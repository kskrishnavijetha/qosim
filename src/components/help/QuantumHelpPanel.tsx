
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle, BookOpen, Video, MessageSquare } from 'lucide-react';

export function QuantumHelpPanel() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <HelpCircle className="w-6 h-6 text-quantum-glow" />
        <h1 className="text-2xl font-bold text-quantum-glow">Help & Documentation</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="quantum-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-quantum-glow">
              <BookOpen className="w-5 h-5" />
              Documentation
            </CardTitle>
          </CardHeader>
          <CardContent className="text-quantum-particle">
            <p>Access comprehensive guides and API documentation for QOSim.</p>
            <div className="mt-4 text-sm text-quantum-particle/70">
              • Getting Started Guide
              • API Reference
              • Best Practices
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-quantum-glow">
              <Video className="w-5 h-5" />
              Tutorials
            </CardTitle>
          </CardHeader>
          <CardContent className="text-quantum-particle">
            <p>Interactive tutorials and video guides for quantum computing.</p>
            <div className="mt-4 text-sm text-quantum-particle/70">
              • Beginner Tutorials
              • Advanced Topics
              • Algorithm Examples
            </div>
          </CardContent>
        </Card>

        <Card className="quantum-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-quantum-glow">
              <MessageSquare className="w-5 h-5" />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent className="text-quantum-particle">
            <p>Get help from the community and support team.</p>
            <div className="mt-4 text-sm text-quantum-particle/70">
              • FAQ
              • Community Forum
              • Contact Support
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
