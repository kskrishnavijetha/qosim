
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';
import { executeSecureCode, executeQuantumCode } from '@/lib/secureCodeExecutor';

interface SDKPlaygroundProps {
  code: string;
  onChange: (code: string) => void;
  onRun?: () => void;
}

export function SDKPlayground({ code, onChange, onRun }: SDKPlaygroundProps) {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setOutput('Running code...\n');
    
    try {
      const result = await executeQuantumCode(code);
      
      if (result.success) {
        let outputText = 'Code executed successfully!\n';
        
        if (result.logs && result.logs.length > 0) {
          outputText += '\nOutput:\n' + result.logs.join('\n');
        }
        
        if (result.result !== undefined) {
          outputText += '\nResult: ' + String(result.result);
        }
        
        setOutput(outputText);
        toast.success('Code executed successfully');
      } else {
        setOutput(`Error: ${result.error}\n${result.logs ? result.logs.join('\n') : ''}`);
        toast.error('Code execution failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setOutput(`Execution failed: ${errorMessage}`);
      toast.error('Code execution failed');
    } finally {
      setIsRunning(false);
      onRun?.();
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quantum-circuit.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded');
  };

  return (
    <div className="space-y-4">
      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Code Editor</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={copyCode}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button size="sm" variant="outline" onClick={downloadCode}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            className="font-mono text-sm h-64 quantum-panel neon-border"
            placeholder="Write your quantum circuit code here..."
          />
          <Button 
            onClick={runCode} 
            disabled={isRunning}
            className="mt-4 w-full bg-quantum-glow text-quantum-void"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Code'}
          </Button>
        </CardContent>
      </Card>

      <Card className="quantum-panel neon-border">
        <CardHeader>
          <CardTitle className="text-quantum-glow">Output</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="font-mono text-sm whitespace-pre-wrap bg-quantum-matrix p-4 rounded min-h-32 text-quantum-neon">
            {output || 'Run your code to see output here...'}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
