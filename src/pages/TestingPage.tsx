
import React from 'react';
import { AppFunctionsTester } from '@/components/testing/AppFunctionsTester';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, TestTube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TestingPage() {
  return (
    <div className="min-h-screen bg-quantum-void text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/app">
            <Button variant="ghost" className="mb-4 text-quantum-neon hover:text-quantum-glow">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to App
            </Button>
          </Link>
          
          <Card className="quantum-panel neon-border">
            <CardHeader>
              <CardTitle className="text-2xl font-mono text-quantum-glow flex items-center gap-2">
                <TestTube className="w-6 h-6" />
                QOSim Function Testing Suite
              </CardTitle>
              <p className="text-muted-foreground">
                Comprehensive testing of all app functionalities including authentication, 
                collaboration, cloud backends, file operations, and mobile responsiveness.
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-quantum-neon">Authentication Tests</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• User session validation</li>
                      <li>• Token persistence</li>
                      <li>• Auth state management</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-quantum-neon">Collaboration Tests</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Real-time connections</li>
                      <li>• Database accessibility</li>
                      <li>• Multi-user features</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-quantum-neon">Backend Tests</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Quantum simulation APIs</li>
                      <li>• Local backend execution</li>
                      <li>• Result processing</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-semibold text-quantum-neon">System Tests</h3>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• File operations</li>
                      <li>• Mobile responsiveness</li>
                      <li>• Touch interactions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <AppFunctionsTester />
      </div>
    </div>
  );
}
