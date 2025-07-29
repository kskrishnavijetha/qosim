
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Code } from 'lucide-react';

interface CodeEditorProps {
  language: string;
  code: string;
  onChange: (code: string) => void;
}

export function CodeEditor({ language, code, onChange }: CodeEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code className="w-5 h-5" />
          <span>{language.charAt(0).toUpperCase() + language.slice(1)} Editor</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Write your ${language} quantum algorithm here...`}
          className="min-h-[400px] font-mono text-sm"
        />
      </CardContent>
    </Card>
  );
}
