import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, Play, Download, Copy } from "lucide-react";
import { sdkExamples } from "./SDKExamples";
import { pythonSDKExamples } from "./PythonSDKExamples";
import { SDKPlayground } from "@/components/sdk/SDKPlayground";
import { PythonSDKPlayground } from "@/components/sdk/PythonSDKPlayground";

interface CodeEditorProps {
  selectedExample: string;
  customCode: string;
  isRunning: boolean;
  selectedSDK: 'javascript' | 'python';
  onExampleChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onRunExample: () => void;
  onCopyCode: (code: string) => void;
  onDownloadSDK: () => void;
  onSDKChange: (sdk: 'javascript' | 'python') => void;
}

export function CodeEditor({
  selectedExample,
  customCode,
  isRunning,
  selectedSDK,
  onExampleChange,
  onCodeChange,
  onRunExample,
  onCopyCode,
  onDownloadSDK,
  onSDKChange,
}: CodeEditorProps) {
  const currentExamples = selectedSDK === 'javascript' ? sdkExamples : pythonSDKExamples;
  return (
    <Card className="quantum-panel neon-border flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-quantum-glow flex items-center gap-2">
            <Code className="w-5 h-5" />
            Code Examples
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onDownloadSDK}
              className="neon-border"
            >
              <Download className="w-4 h-4 mr-2" />
              Download SDK
            </Button>
          </div>
        </div>
        <CardDescription className="text-quantum-particle">
          Select SDK and example or write custom quantum circuits
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-quantum-neon mb-2 block">SDK Language</label>
            <Select value={selectedSDK} onValueChange={onSDKChange}>
              <SelectTrigger className="quantum-panel neon-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="quantum-panel neon-border">
                <SelectItem value="javascript">JavaScript SDK</SelectItem>
                <SelectItem value="python">Python SDK</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-quantum-neon mb-2 block">Example</label>
            <Select value={selectedExample} onValueChange={onExampleChange}>
              <SelectTrigger className="quantum-panel neon-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="quantum-panel neon-border">
                {Object.entries(currentExamples).map(([key, example]) => (
                  <SelectItem key={key} value={key}>
                    {example.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-quantum-neon">
              {currentExamples[selectedExample as keyof typeof currentExamples]?.description || "Custom code"}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCopyCode(currentExamples[selectedExample as keyof typeof currentExamples]?.code || customCode)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Textarea
            value={customCode || currentExamples[selectedExample as keyof typeof currentExamples]?.code || ""}
            onChange={(e) => onCodeChange(e.target.value)}
            className="font-mono text-sm quantum-panel neon-border h-[300px] resize-none"
            placeholder={`Write your ${selectedSDK === 'javascript' ? 'JavaScript' : 'Python'} quantum circuit code here...`}
          />
          <Button 
            onClick={onRunExample} 
            disabled={isRunning}
            className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? "Running Simulation..." : `Run ${selectedSDK === 'javascript' ? 'JavaScript' : 'Python'} Circuit`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}