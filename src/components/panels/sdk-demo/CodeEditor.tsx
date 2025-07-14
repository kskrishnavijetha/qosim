import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Code, Play, Download, Copy } from "lucide-react";
import { sdkExamples } from "./SDKExamples";

interface CodeEditorProps {
  selectedExample: string;
  customCode: string;
  isRunning: boolean;
  onExampleChange: (value: string) => void;
  onCodeChange: (value: string) => void;
  onRunExample: () => void;
  onCopyCode: (code: string) => void;
  onDownloadSDK: () => void;
}

export function CodeEditor({
  selectedExample,
  customCode,
  isRunning,
  onExampleChange,
  onCodeChange,
  onRunExample,
  onCopyCode,
  onDownloadSDK,
}: CodeEditorProps) {
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
          Select an example or write custom quantum circuits
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        <Select value={selectedExample} onValueChange={onExampleChange}>
          <SelectTrigger className="quantum-panel neon-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="quantum-panel neon-border">
            {Object.entries(sdkExamples).map(([key, example]) => (
              <SelectItem key={key} value={key}>
                {example.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-quantum-neon">
              {sdkExamples[selectedExample as keyof typeof sdkExamples].description}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onCopyCode(sdkExamples[selectedExample as keyof typeof sdkExamples].code)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <Textarea
            value={customCode || sdkExamples[selectedExample as keyof typeof sdkExamples].code}
            onChange={(e) => onCodeChange(e.target.value)}
            className="font-mono text-sm quantum-panel neon-border h-[300px] resize-none"
            placeholder="Write your quantum circuit code here..."
          />
          <Button 
            onClick={onRunExample} 
            disabled={isRunning}
            className="w-full bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? "Running Simulation..." : "Run Quantum Circuit"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}