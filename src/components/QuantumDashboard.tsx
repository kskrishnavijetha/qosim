
import React, { useState } from "react";
import { QuantumSidebar } from "./QuantumSidebar";
import { CircuitsPanel } from "./panels/CircuitsPanel";
import { MyCircuitsPanel } from "./panels/MyCircuitsPanel";
import { JobsPanel } from "./panels/JobsPanel";
import { MemoryPanel } from "./panels/MemoryPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { LogsPanel } from "./panels/LogsPanel";
import { SDKDemoPanel } from "./panels/SDKDemoPanel";
import { QuantumAlgorithmsSDKPanel } from "./panels/QuantumAlgorithmsSDKPanel";
import { LearnWithTutorials } from "./tutorials/LearnWithTutorials";
import { UnifiedAIPanel } from "./ai/UnifiedAIPanel";

export function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("circuits");
  const [selectedSDK, setSelectedSDK] = useState<'javascript' | 'python'>('javascript');
  const [circuit, setCircuit] = useState(null);

  console.log("QuantumDashboard - activeTab:", activeTab);
  console.log("QuantumDashboard - selectedSDK:", selectedSDK);

  const handleSDKSelect = (sdkType: string) => {
    console.log("SDK selected:", sdkType);
    if (sdkType === 'javascript') {
      setSelectedSDK('javascript');
    } else if (sdkType === 'python') {
      setSelectedSDK('python');
    }
  };

  const handleCircuitGenerated = (newCircuit: any) => {
    setCircuit(newCircuit);
  };

  const handleAlgorithmGenerated = (algorithm: any) => {
    console.log("Algorithm generated:", algorithm);
  };

  const handleCircuitOptimized = (optimizedCircuit: any) => {
    setCircuit(optimizedCircuit);
  };

  const handleCircuitFixed = (fixedCircuit: any) => {
    setCircuit(fixedCircuit);
  };

  const handleShowStateVisualization = () => {
    console.log("Show state visualization");
  };

  const renderContent = () => {
    console.log("Rendering content for tab:", activeTab);
    
    switch (activeTab) {
      case "circuits":
        return <CircuitsPanel />;
      case "my-circuits":
        return <MyCircuitsPanel />;
      case "jobs":
        return <JobsPanel />;
      case "memory":
        return <MemoryPanel />;
      case "files":
        return <FilesPanel />;
      case "logs":
        return <LogsPanel />;
      case "sdk-demo":
        return <SDKDemoPanel defaultSDK={selectedSDK} />;
      case "javascript-sdk":
        return <SDKDemoPanel defaultSDK="javascript" />;
      case "python-sdk":
        return <SDKDemoPanel defaultSDK="python" />;
      case "algorithms-sdk":
        return <QuantumAlgorithmsSDKPanel />;
      case "learn-tutorials":
        return <LearnWithTutorials />;
      case "ai-panel":
        return (
          <UnifiedAIPanel
            circuit={circuit}
            onCircuitGenerated={handleCircuitGenerated}
            onAlgorithmGenerated={handleAlgorithmGenerated}
            onCircuitOptimized={handleCircuitOptimized}
            onCircuitFixed={handleCircuitFixed}
            onShowStateVisualization={handleShowStateVisualization}
          />
        );
      default:
        return (
          <div className="flex items-center justify-center h-full text-quantum-particle">
            <div className="text-center">
              <h2 className="text-2xl font-mono mb-4">Coming Soon</h2>
              <p>This panel is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-quantum-void text-quantum-glow">
      <div className="w-64 border-r border-quantum-matrix">
        <QuantumSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          onSDKSelect={handleSDKSelect}
        />
      </div>
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}
