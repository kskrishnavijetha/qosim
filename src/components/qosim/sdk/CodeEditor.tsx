
import React, { forwardRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, Square } from 'lucide-react';

interface CodeEditorProps {
  language: 'python' | 'javascript';
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  isExecuting: boolean;
}

export const CodeEditor = forwardRef<any, CodeEditorProps>(
  ({ language, value, onChange, onExecute, isExecuting }, ref) => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-purple-400">{language} Editor</h3>
          <Button
            onClick={onExecute}
            disabled={isExecuting}
            size="sm"
            className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
          >
            {isExecuting ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Code
              </>
            )}
          </Button>
        </div>
        
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Enter your ${language} code here...`}
          className="bg-black/50 border-white/10 text-white font-mono text-sm min-h-[300px]"
        />
      </div>
    );
  }
);

CodeEditor.displayName = 'CodeEditor';
