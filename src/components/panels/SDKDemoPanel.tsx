import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CodeEditor } from "./sdk-demo/CodeEditor";
import { SimulationOutput } from "./sdk-demo/SimulationOutput";
import { SDKFeatures } from "./sdk-demo/SDKFeatures";
import { sdkExamples, mockSimulationResults } from "./sdk-demo/SDKExamples";

export function SDKDemoPanel() {
  const [selectedExample, setSelectedExample] = useState("bell-state");
  const [customCode, setCustomCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runExample = async () => {
    setIsRunning(true);
    setOutput("");
    
    try {
      const example = sdkExamples[selectedExample as keyof typeof sdkExamples];
      const result = mockSimulationResults[selectedExample as keyof typeof mockSimulationResults];
      
      setTimeout(() => {
        setOutput(JSON.stringify(result, null, 2));
        setIsRunning(false);
        toast({
          title: "Simulation Complete",
          description: `${example.name} executed successfully`,
        });
      }, 1500);
      
    } catch (error) {
      setIsRunning(false);
      setOutput(`Error: ${error}`);
      toast({
        title: "Simulation Error",
        description: "Failed to execute the quantum circuit",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Code copied successfully",
    });
  };

  const downloadSDK = () => {
    toast({
      title: "SDK Download",
      description: "QOSim SDK files are available in the /src directory",
    });
  };

  return (
    <div className="flex flex-col h-full bg-quantum-void p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-quantum-glow quantum-float">
            QOSim SDK Demo
          </h1>
          <p className="text-quantum-neon font-mono mt-2">
            Interactive quantum circuit programming with JavaScript
          </p>
        </div>
        <Badge variant="outline" className="neon-border text-quantum-glow">
          SDK v1.0.0
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <CodeEditor
          selectedExample={selectedExample}
          customCode={customCode}
          isRunning={isRunning}
          onExampleChange={setSelectedExample}
          onCodeChange={setCustomCode}
          onRunExample={runExample}
          onCopyCode={copyToClipboard}
          onDownloadSDK={downloadSDK}
        />
        
        <SimulationOutput
          output={output}
          isRunning={isRunning}
        />
      </div>

      <SDKFeatures />
    </div>
  );
}