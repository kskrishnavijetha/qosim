

import { useState } from "react";
import { CircuitsPanel } from "./panels/CircuitsPanel";
import { QuantumAlgorithmsPanel } from "./algorithms/QuantumAlgorithmsPanel";
import { UnifiedAIPanel } from "./ai/UnifiedAIPanel";
import { FilesPanel } from "./panels/FilesPanel";
import { JobsPanel } from "./panels/JobsPanel";
import { MemoryPanel } from "./panels/MemoryPanel";
import { LogsPanel } from "./panels/LogsPanel";
import { LearnWithTutorials } from "./tutorials/LearnWithTutorials";
import { SDKDemoPanel } from "./panels/SDKDemoPanel";
import { QuantumSidebar } from "./QuantumSidebar";
import { FeedbackWidget } from "./FeedbackWidget";
import { MyCircuitsPanel } from "./panels/MyCircuitsPanel";

export function QuantumDashboard() {
  const [activeTab, setActiveTab] = useState("circuit");
  const [circuit, setCircuit] = useState<any[]>([]);
  const [algorithmResult, setAlgorithmResult] = useState<any>(null);

  const handleCircuitGenerated = (gates: any[]) => {
    setCircuit(gates);
    console.log('Circuit generated:', gates);
  };

  const handleAlgorithmGenerated = (code: string) => {
    console.log('Algorithm generated:', code);
  };

  const handleAlgorithmExecuted = (result: any) => {
    setAlgorithmResult(result);
    console.log('Algorithm executed:', result);
  };

  const handleCircuitOptimized = (gates: any[]) => {
    setCircuit(gates);
    console.log('Circuit optimized:', gates);
  };

  const handleCircuitFixed = (gates: any[]) => {
    setCircuit(gates);
    console.log('Circuit fixed:', gates);
  };

  const handleShowStateVisualization = (step: number) => {
    console.log('Show state visualization for step:', step);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "circuit":
        return <CircuitsPanel />;
      case "my-circuits":
        return <MyCircuitsPanel />;
      case "algorithms":
        return (
          <QuantumAlgorithmsPanel 
            onCircuitGenerated={handleCircuitGenerated}
            onAlgorithmExecuted={handleAlgorithmExecuted}
          />
        );
      case "ai":
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
      case "files":
        return <FilesPanel />;
      case "jobs":
        return <JobsPanel />;
      case "memory":
        return <MemoryPanel />;
      case "logs":
        return <LogsPanel />;
      case "learning":
        return <LearnWithTutorials />;
      case "sdk":
        return <SDKDemoPanel />;
      default:
        return <CircuitsPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-quantum-matrix text-quantum-glow">
      <div className="flex h-screen">
        <QuantumSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
        />
        
        <div className="flex-1 overflow-hidden">
          <div className="h-full">
            {renderActiveTab()}
          </div>
        </div>
      </div>
      
      <FeedbackWidget />
    </div>
  );
}

