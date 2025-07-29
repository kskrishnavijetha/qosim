import React, { useState } from 'react';
import { QuantumSidebar } from './components/QuantumSidebar';
import { CircuitsPanel } from './components/panels/CircuitsPanel';
import { QuantumAlgorithmsSDK } from './components/quantum-algorithms-sdk/QuantumAlgorithmsSDK';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('circuits');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [currentCircuit, setCurrentCircuit] = useState<any>(null);
  const [lastAlgorithmResult, setLastAlgorithmResult] = useState<any>(null);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCircuitGenerated = (circuitData: any) => {
    setCurrentCircuit(circuitData);
  };

  const handleAlgorithmExecuted = (result: any) => {
    setLastAlgorithmResult(result);
  };

  const handleSDKSelect = (sdkType: string) => {
    if (sdkType === 'quantum-algorithms') {
      setActiveTab('quantum-algorithms-sdk');
    }
  };

  const handleCircuitExport = (circuitData: any) => {
    // Convert SDK algorithm to circuit builder format
    console.log('Exporting algorithm to Circuit Builder:', circuitData);
    // Implementation would sync the algorithm to the visual circuit builder
  };

  const handleCircuitImport = (circuitData: any) => {
    // Import visual circuit to SDK
    console.log('Importing circuit from Circuit Builder:', circuitData);
    // Implementation would convert visual circuit to SDK code
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'circuits':
        return <CircuitsPanel />;
      case 'quantum-algorithms-sdk':
        return (
          <QuantumAlgorithmsSDK
            onCircuitExport={handleCircuitExport}
            onCircuitImport={handleCircuitImport}
            collaborationEnabled={true}
            currentCircuit={currentCircuit}
          />
        );
      default:
        return <CircuitsPanel />;
    }
  };

  return (
    <div className="flex h-screen bg-quantum-void text-white quantum-grid">
      <QuantumSidebar 
        onTabChange={setActiveTab}
        activeTab={activeTab}
        onTemplateSelect={handleTemplateSelect}
        onCircuitGenerated={handleCircuitGenerated}
        onAlgorithmExecuted={handleAlgorithmExecuted}
        onSDKSelect={handleSDKSelect}
      />
      <main className="flex-1 overflow-hidden">
        {renderMainContent()}
      </main>
    </div>
  );
}
