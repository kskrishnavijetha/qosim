
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Play, Copy, Download, Settings, Code, Terminal, BookOpen } from 'lucide-react';
import { Algorithm } from './QuantumAlgorithmsSDK';

export interface CodeEditorProps {
  code: string;
  language: 'python' | 'javascript';
  selectedAlgorithm: Algorithm | null;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: 'python' | 'javascript') => void;
  onExecute: () => void;
  isExecuting: boolean;
}

export function CodeEditor({
  code,
  language,
  selectedAlgorithm,
  onCodeChange,
  onLanguageChange,
  onExecute,
  isExecuting
}: CodeEditorProps) {
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('dark');
  const [autoComplete, setAutoComplete] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [documentation, setDocumentation] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedAlgorithm) {
      setDocumentation(generateDocumentation(selectedAlgorithm));
    }
  }, [selectedAlgorithm]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Algorithm code copied to clipboard",
    });
  }, [code, toast]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedAlgorithm?.name || 'algorithm'}.${language === 'python' ? 'py' : 'js'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Code Downloaded",
      description: `Algorithm saved as ${a.download}`,
    });
  }, [code, language, selectedAlgorithm, toast]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      const newCode = code.substring(0, start) + '    ' + code.substring(end);
      onCodeChange(newCode);
      
      // Set cursor position after tab
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
    
    // Execute on Ctrl+Enter
    if (e.ctrlKey && e.key === 'Enter') {
      e.preventDefault();
      onExecute();
    }
  }, [code, onCodeChange, onExecute]);

  const getLanguageHighlightClass = (lang: string) => {
    return `language-${lang}`;
  };

  const generateDocumentation = (algorithm: Algorithm) => {
    return `
# ${algorithm.name}

**Category:** ${algorithm.category}
**Complexity:** ${algorithm.complexity}

## Description
${algorithm.description}

## Parameters
${algorithm.parameters.map(p => `- **${p.name}** (${p.type}): ${p.description} (default: ${p.default})`).join('\n')}

## Visualization
Type: ${algorithm.visualization.type}
Configuration: ${JSON.stringify(algorithm.visualization.config, null, 2)}

## Usage Examples
See the loaded code for implementation details.
    `.trim();
  };

  return (
    <div className="flex flex-col h-full bg-quantum-void">
      <div className="flex-none p-4 border-b border-quantum-neon/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-quantum-glow" />
            <h2 className="text-lg font-semibold text-quantum-glow">Code Editor</h2>
            {selectedAlgorithm && (
              <Badge variant="outline" className="text-quantum-particle">
                {selectedAlgorithm.name}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={language === 'python' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('python')}
              size="sm"
            >
              Python
            </Button>
            <Button
              variant={language === 'javascript' ? 'default' : 'outline'}
              onClick={() => onLanguageChange('javascript')}
              size="sm"
            >
              JavaScript
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={onExecute}
            disabled={isExecuting}
            size="sm"
            className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void"
          >
            <Play className="w-4 h-4 mr-2" />
            {isExecuting ? 'Executing...' : 'Execute'}
          </Button>
          <Button onClick={handleCopy} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12px</SelectItem>
              <SelectItem value="14">14px</SelectItem>
              <SelectItem value="16">16px</SelectItem>
              <SelectItem value="18">18px</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="editor" className="h-full flex flex-col">
          <TabsList className="flex-none grid w-full grid-cols-3 bg-quantum-matrix border-b border-quantum-neon/20">
            <TabsTrigger value="editor" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Editor
            </TabsTrigger>
            <TabsTrigger value="console" className="flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              Console
            </TabsTrigger>
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Documentation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 m-0 p-0">
            <div className="h-full flex">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={code}
                  onChange={(e) => onCodeChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`
                    w-full h-full p-4 bg-quantum-void text-quantum-neon font-mono resize-none
                    border-none outline-none ${getLanguageHighlightClass(language)}
                  `}
                  style={{ fontSize: `${fontSize}px` }}
                  placeholder={`Write your ${language} quantum algorithm here...`}
                  spellCheck={false}
                />
                
                {showLineNumbers && (
                  <div className="absolute left-0 top-0 p-4 pointer-events-none">
                    <div className="text-quantum-particle text-sm font-mono">
                      {code.split('\n').map((_, index) => (
                        <div key={index} className="h-5 leading-5">
                          {index + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {autoComplete && (
                <div className="w-60 border-l border-quantum-neon/20 bg-quantum-matrix p-4">
                  <h3 className="text-sm font-semibold text-quantum-glow mb-3">Auto-Complete</h3>
                  <div className="space-y-2">
                    {getAutoCompleteSuggestions(language).map((suggestion, index) => (
                      <div
                        key={index}
                        className="p-2 bg-quantum-void rounded text-xs cursor-pointer hover:bg-quantum-neon hover:text-quantum-void"
                        onClick={() => {
                          const textarea = textareaRef.current;
                          if (textarea) {
                            const start = textarea.selectionStart;
                            const end = textarea.selectionEnd;
                            const newCode = code.substring(0, start) + suggestion.code + code.substring(end);
                            onCodeChange(newCode);
                          }
                        }}
                      >
                        <div className="text-quantum-glow font-mono">{suggestion.name}</div>
                        <div className="text-quantum-particle">{suggestion.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="console" className="flex-1 m-0 p-0">
            <div className="h-full p-4 bg-quantum-void">
              <div className="h-full overflow-y-auto bg-black/50 rounded p-4 font-mono text-sm text-quantum-neon">
                <div className="text-quantum-glow">QOSim Console Output</div>
                <div className="text-quantum-particle">Ready to execute quantum algorithms...</div>
                <div className="text-quantum-particle">Press Ctrl+Enter to execute code</div>
                <div className="text-quantum-particle">---</div>
                {isExecuting && (
                  <div className="text-quantum-energy animate-pulse">
                    Executing quantum algorithm...
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="docs" className="flex-1 m-0 p-0">
            <div className="h-full p-4 bg-quantum-void overflow-y-auto">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-quantum-neon text-sm">
                  {documentation || 'Select an algorithm to view documentation'}
                </pre>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function getAutoCompleteSuggestions(language: 'python' | 'javascript') {
  if (language === 'python') {
    return [
      {
        name: 'sim.h(qubit)',
        description: 'Apply Hadamard gate',
        code: 'sim.h(0)'
      },
      {
        name: 'sim.cnot(control, target)',
        description: 'Apply CNOT gate',
        code: 'sim.cnot(0, 1)'
      },
      {
        name: 'sim.x(qubit)',
        description: 'Apply Pauli-X gate',
        code: 'sim.x(0)'
      },
      {
        name: 'sim.y(qubit)',
        description: 'Apply Pauli-Y gate',
        code: 'sim.y(0)'
      },
      {
        name: 'sim.z(qubit)',
        description: 'Apply Pauli-Z gate',
        code: 'sim.z(0)'
      },
      {
        name: 'sim.rx(qubit, angle)',
        description: 'Apply rotation around X-axis',
        code: 'sim.rx(0, np.pi/2)'
      },
      {
        name: 'sim.ry(qubit, angle)',
        description: 'Apply rotation around Y-axis',
        code: 'sim.ry(0, np.pi/2)'
      },
      {
        name: 'sim.rz(qubit, angle)',
        description: 'Apply rotation around Z-axis',
        code: 'sim.rz(0, np.pi/2)'
      },
      {
        name: 'sim.run()',
        description: 'Execute the circuit',
        code: 'result = sim.run()'
      }
    ];
  } else {
    return [
      {
        name: 'sim.addGate("H", qubit)',
        description: 'Apply Hadamard gate',
        code: 'sim.addGate("H", 0);'
      },
      {
        name: 'sim.addGate("CNOT", control, target)',
        description: 'Apply CNOT gate',
        code: 'sim.addGate("CNOT", 0, 1);'
      },
      {
        name: 'sim.addGate("X", qubit)',
        description: 'Apply Pauli-X gate',
        code: 'sim.addGate("X", 0);'
      },
      {
        name: 'sim.addGate("Y", qubit)',
        description: 'Apply Pauli-Y gate',
        code: 'sim.addGate("Y", 0);'
      },
      {
        name: 'sim.addGate("Z", qubit)',
        description: 'Apply Pauli-Z gate',
        code: 'sim.addGate("Z", 0);'
      },
      {
        name: 'sim.addGate("RX", qubit, angle)',
        description: 'Apply rotation around X-axis',
        code: 'sim.addGate("RX", 0, Math.PI/2);'
      },
      {
        name: 'sim.addGate("RY", qubit, angle)',
        description: 'Apply rotation around Y-axis',
        code: 'sim.addGate("RY", 0, Math.PI/2);'
      },
      {
        name: 'sim.addGate("RZ", qubit, angle)',
        description: 'Apply rotation around Z-axis',
        code: 'sim.addGate("RZ", 0, Math.PI/2);'
      },
      {
        name: 'sim.run()',
        description: 'Execute the circuit',
        code: 'sim.run();'
      }
    ];
  }
}
