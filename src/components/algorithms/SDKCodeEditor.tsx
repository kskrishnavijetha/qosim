
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, Play, Copy, Download, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SDKCodeEditorProps {
  language: 'python' | 'javascript';
  code: string;
  onCodeChange: (code: string) => void;
  onExecute: (code: string) => Promise<void>;
  isExecuting: boolean;
}

interface SyntaxError {
  line: number;
  message: string;
  type: 'error' | 'warning';
}

export function SDKCodeEditor({
  language,
  code,
  onCodeChange,
  onExecute,
  isExecuting
}: SDKCodeEditorProps) {
  const [syntaxErrors, setSyntaxErrors] = useState<SyntaxError[]>([]);
  const [isValid, setIsValid] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Syntax validation
  useEffect(() => {
    validateSyntax(code);
  }, [code, language]);

  const validateSyntax = (currentCode: string) => {
    const errors: SyntaxError[] = [];
    const lines = currentCode.split('\n');

    lines.forEach((line, index) => {
      if (language === 'javascript') {
        // Basic JavaScript validation
        if (line.includes('await') && !line.includes('async') && index === 0) {
          errors.push({
            line: index + 1,
            message: 'await must be used in async context',
            type: 'error'
          });
        }
        
        // Check for unclosed parentheses/brackets
        const openParens = (line.match(/\(/g) || []).length;
        const closeParens = (line.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
          errors.push({
            line: index + 1,
            message: 'Unclosed parentheses',
            type: 'warning'
          });
        }
      } else {
        // Basic Python validation
        if (line.trim() && !line.startsWith('#') && !line.includes(':') && 
            (line.includes('def ') || line.includes('class ') || 
             line.includes('if ') || line.includes('for ') || line.includes('while '))) {
          errors.push({
            line: index + 1,
            message: 'Missing colon at end of statement',
            type: 'error'
          });
        }
      }
    });

    setSyntaxErrors(errors);
    setIsValid(errors.filter(e => e.type === 'error').length === 0);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Code has been copied to clipboard",
    });
  };

  const handleDownloadCode = () => {
    const blob = new Blob([code], { 
      type: language === 'python' ? 'text/x-python' : 'application/javascript' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_algorithm.${language === 'python' ? 'py' : 'js'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExecute = async () => {
    if (!isValid) {
      toast({
        title: "Syntax Errors",
        description: "Please fix syntax errors before executing",
        variant: "destructive"
      });
      return;
    }

    try {
      await onExecute(code);
    } catch (error) {
      console.error('Execution error:', error);
    }
  };

  const addLineNumbers = (text: string) => {
    return text.split('\n').map((line, index) => (
      <div key={index} className="flex">
        <span className="w-8 text-right pr-2 text-quantum-particle select-none">
          {index + 1}
        </span>
        <span className="flex-1">{line || ' '}</span>
      </div>
    ));
  };

  return (
    <Card className="quantum-panel neon-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-mono text-quantum-glow flex items-center gap-2">
            <Code className="w-5 h-5" />
            {language === 'python' ? 'Python' : 'JavaScript'} Editor
            {isValid ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
          </CardTitle>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="neon-border"
            >
              <Copy className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadCode}
              className="neon-border"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {syntaxErrors.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {syntaxErrors.map((error, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className={`text-xs ${
                  error.type === 'error' ? 'text-red-400 border-red-400' : 'text-yellow-400 border-yellow-400'
                }`}
              >
                Line {error.line}: {error.message}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onCodeChange(e.target.value)}
            className="font-mono text-sm quantum-panel neon-border h-[300px] resize-none pl-12"
            placeholder={`Write your ${language} quantum circuit code here...`}
            spellCheck={false}
          />
          
          {/* Line numbers overlay */}
          <div className="absolute top-3 left-3 pointer-events-none font-mono text-sm text-quantum-particle leading-6">
            {code.split('\n').map((_, index) => (
              <div key={index} className="h-6">
                {index + 1}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2 text-xs text-quantum-particle">
            <span>Lines: {code.split('\n').length}</span>
            <span>•</span>
            <span>Characters: {code.length}</span>
            <span>•</span>
            <span className={isValid ? 'text-green-400' : 'text-red-400'}>
              {isValid ? 'Valid' : 'Syntax Error'}
            </span>
          </div>
          
          <Button
            onClick={handleExecute}
            disabled={isExecuting || !isValid}
            className="bg-quantum-matrix hover:bg-quantum-glow text-quantum-glow hover:text-quantum-void neon-border"
          >
            {isExecuting ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Execute Code
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
