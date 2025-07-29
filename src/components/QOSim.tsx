
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuantumCircuitBuilder } from './qosim/QuantumCircuitBuilder';
import { QuantumAlgorithmsSDK } from './qosim/QuantumAlgorithmsSDK';
import { IntegrationLayer } from './qosim/IntegrationLayer';
import { QFSCollaboration } from './qosim/QFSCollaboration';
import { Circuit, Zap, Link, Users } from 'lucide-react';

export function QOSim() {
  const [activeModule, setActiveModule] = useState('circuit-builder');
  const [sharedData, setSharedData] = useState({
    circuits: [],
    algorithms: [],
    collaborationState: null
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">Q</span>
              </div>
              <h1 className="text-2xl font-bold">QOSim</h1>
              <span className="text-sm text-muted-foreground">Quantum OS Simulator</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeModule} onValueChange={setActiveModule} className="container mx-auto px-4 py-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="circuit-builder" className="flex items-center space-x-2">
            <Circuit className="w-4 h-4" />
            <span>Circuit Builder</span>
          </TabsTrigger>
          <TabsTrigger value="algorithms-sdk" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Algorithms SDK</span>
          </TabsTrigger>
          <TabsTrigger value="integration" className="flex items-center space-x-2">
            <Link className="w-4 h-4" />
            <span>Integration</span>
          </TabsTrigger>
          <TabsTrigger value="collaboration" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Collaboration</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="circuit-builder" className="mt-6">
          <QuantumCircuitBuilder 
            sharedData={sharedData}
            onDataUpdate={setSharedData}
          />
        </TabsContent>

        <TabsContent value="algorithms-sdk" className="mt-6">
          <QuantumAlgorithmsSDK 
            sharedData={sharedData}
            onDataUpdate={setSharedData}
          />
        </TabsContent>

        <TabsContent value="integration" className="mt-6">
          <IntegrationLayer 
            sharedData={sharedData}
            onDataUpdate={setSharedData}
          />
        </TabsContent>

        <TabsContent value="collaboration" className="mt-6">
          <QFSCollaboration 
            sharedData={sharedData}
            onDataUpdate={setSharedData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
