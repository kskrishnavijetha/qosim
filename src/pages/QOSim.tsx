
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cpu, Zap, Settings, Users, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';

function QOSimContent() {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-quantum-void text-quantum-glow">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-quantum-glow/20 rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-quantum-glow" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-quantum-glow">QOSim</h1>
              <p className="text-quantum-neon">Quantum Computing Simulator</p>
            </div>
          </div>
          <Badge variant="outline" className="text-quantum-glow border-quantum-glow">
            Beta v1.0
          </Badge>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="simulator" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Simulator
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Collaboration
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-quantum-glow">Welcome to QOSim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-quantum-neon mb-4">
                  QOSim is a comprehensive quantum computing simulation platform that provides 
                  tools for quantum circuit design, algorithm development, and collaborative research.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-quantum-matrix border-quantum-neon/30">
                    <CardContent className="p-4">
                      <h3 className="text-quantum-glow font-semibold mb-2">Quantum Simulator</h3>
                      <p className="text-quantum-neon text-sm">
                        Build and simulate quantum circuits with our interactive tools.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-quantum-matrix border-quantum-neon/30">
                    <CardContent className="p-4">
                      <h3 className="text-quantum-glow font-semibold mb-2">Collaboration</h3>
                      <p className="text-quantum-neon text-sm">
                        Work together on quantum projects with real-time collaboration.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-quantum-matrix border-quantum-neon/30">
                    <CardContent className="p-4">
                      <h3 className="text-quantum-glow font-semibold mb-2">AI Assistant</h3>
                      <p className="text-quantum-neon text-sm">
                        Get help with quantum concepts and circuit optimization.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-quantum-glow">Quantum Simulator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-quantum-neon mb-4">
                  The quantum simulator functionality is currently being developed.
                </p>
                <Button variant="outline" className="text-quantum-glow border-quantum-glow">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-quantum-glow">Collaboration Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-quantum-neon mb-4">
                  Collaborative features for working together on quantum projects.
                </p>
                <Button variant="outline" className="text-quantum-glow border-quantum-glow">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assistant" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-quantum-glow">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-quantum-neon mb-4">
                  AI-powered assistance for quantum computing concepts and problem-solving.
                </p>
                <Button variant="outline" className="text-quantum-glow border-quantum-glow">
                  Coming Soon
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function QOSim() {
  return (
    <AuthGuard>
      <QOSimContent />
    </AuthGuard>
  );
}
