
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CodeEditor } from "./sdk-demo/CodeEditor";
import { SimulationOutput } from "./sdk-demo/SimulationOutput";
import { SDKFeatures } from "./sdk-demo/SDKFeatures";
import { SDKPlayground } from "@/components/sdk/SDKPlayground";
import { PythonSDKPlayground } from "@/components/sdk/PythonSDKPlayground";
import { sdkExamples } from "./sdk-demo/SDKExamples";
import { pythonSDKExamples } from "./sdk-demo/PythonSDKExamples";
import { quantumSimulation, QuantumSimulationResult } from "@/lib/realQuantumSimulation";
import { useIsMobile } from "@/hooks/use-mobile";

interface SDKDemoPanelProps {
  defaultSDK?: 'javascript' | 'python';
}

export function SDKDemoPanel({ defaultSDK = 'javascript' }: SDKDemoPanelProps) {
  const [selectedExample, setSelectedExample] = useState("bell-state");
  const [customCode, setCustomCode] = useState("");
  const [output, setOutput] = useState("");
  const [simulationResult, setSimulationResult] = useState<QuantumSimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedSDK, setSelectedSDK] = useState<'javascript' | 'python'>(defaultSDK);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    setSelectedSDK(defaultSDK);
  }, [defaultSDK]);

  const runExample = async () => {
    setIsRunning(true);
    setOutput("");
    setSimulationResult(null);
    
    try {
      const currentExamples = selectedSDK === 'javascript' ? sdkExamples : pythonSDKExamples;
      const example = currentExamples[selectedExample as keyof typeof currentExamples];
      let result: QuantumSimulationResult;
      
      // Run real quantum simulation based on selected example
      if (customCode.trim()) {
        result = await quantumSimulation.executeCustomCode(customCode);
      } else {
        switch (selectedExample) {
          case "bell-state":
            result = await quantumSimulation.simulateBellState();
            break;
          case "grover":
            result = await quantumSimulation.simulateGrover();
            break;
          case "qft":
            result = await quantumSimulation.simulateQFT();
            break;
          case "error-correction":
            result = await quantumSimulation.simulateErrorCorrection();
            break;
          case "qasm":
            // For QASM, we'll run a simple Bell state as example
            result = await quantumSimulation.simulateBellState();
            break;
          default:
            result = await quantumSimulation.simulateBellState();
        }
      }
      
      setSimulationResult(result);
      setOutput(`Execution completed in ${result.executionTime.toFixed(2)}ms
      
Circuit Info:
- Qubits: ${result.circuitInfo.numQubits}
- Depth: ${result.circuitInfo.depth}
- Gates: ${JSON.stringify(result.circuitInfo.gateCount)}

State Vector (first 4 amplitudes):
${result.stateVector.slice(0, 4).map((amp, i) => 
  `|${i.toString(2).padStart(Math.log2(result.stateVector.length), '0')}⟩: ${amp.real.toFixed(4)}${amp.imag >= 0 ? '+' : ''}${amp.imag.toFixed(4)}i`
).join('\n')}

Basis States with >1% probability:
${result.basisStates.filter(b => b.probability > 0.01).map(b => 
  `|${b.state}⟩: ${(b.probability * 100).toFixed(2)}%`
).join('\n')}`);
      
      setIsRunning(false);
      toast({
        title: "Quantum Simulation Complete",
        description: `${example?.name || 'Custom code'} executed successfully in ${result.executionTime.toFixed(1)}ms`,
      });
      
    } catch (error) {
      console.error('Quantum simulation error:', error);
      setIsRunning(false);
      setOutput(`Error: ${error.message}`);
      toast({
        title: "Simulation Error", 
        description: `Failed to execute: ${error.message}`,
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
    <div className="flex flex-col h-full bg-quantum-void p-3 lg:p-6 space-y-4 lg:space-y-6">
      <div className={`flex justify-between ${isMobile ? 'flex-col gap-3' : 'items-center'}`}>
        <div>
          <h1 className={`font-bold text-quantum-glow quantum-float ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
            {selectedSDK === 'javascript' ? 'JavaScript SDK' : 'Python SDK'}
          </h1>
          <p className={`text-quantum-neon font-mono mt-2 ${isMobile ? 'text-sm' : ''}`}>
            Interactive quantum circuit programming with {selectedSDK === 'javascript' ? 'JavaScript' : 'Python'}
          </p>
        </div>
        <Badge variant="outline" className="neon-border text-quantum-glow self-start">
          SDK v1.0.0
        </Badge>
      </div>

      <div className={`gap-4 lg:gap-6 flex-1 ${isMobile ? 'flex flex-col' : 'grid grid-cols-1'}`}>
        <CodeEditor
          selectedExample={selectedExample}
          customCode={customCode}
          isRunning={isRunning}
          selectedSDK={selectedSDK}
          onExampleChange={setSelectedExample}
          onCodeChange={setCustomCode}
          onRunExample={runExample}
          onCopyCode={copyToClipboard}
          onDownloadSDK={downloadSDK}
          onSDKChange={setSelectedSDK}
        />
        
        {/* Simulation Results - now shown below code editor */}
        <SimulationOutput
          output={output}
          isRunning={isRunning}
          simulationResult={simulationResult}
        />
      </div>

      <SDKFeatures />
      
      {/* SDK Playground Integration */}
      <div className="space-y-4">
        <div>
          <h3 className={`font-semibold text-quantum-glow ${isMobile ? 'text-base' : 'text-lg'}`}>
            {selectedSDK === 'javascript' ? 'JavaScript' : 'Python'} SDK Playground
          </h3>
          <p className={`text-quantum-neon ${isMobile ? 'text-xs' : 'text-sm'}`}>
            Interactive testing environment with export functionality
          </p>
        </div>
        {selectedSDK === 'javascript' ? (
          <SDKPlayground />
        ) : (
          <PythonSDKPlayground />
        )}
      </div>
    </div>
  );
}
