
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Search, Copy, Download } from 'lucide-react';
import { ErrorDetails } from './ErrorModal';

interface ErrorConsolePanelProps {
  errors: ErrorDetails[];
  onClearAll: () => void;
  onViewError: (error: ErrorDetails) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function ErrorConsolePanel({ 
  errors, 
  onClearAll, 
  onViewError, 
  isVisible, 
  onToggleVisibility 
}: ErrorConsolePanelProps) {
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Button 
          onClick={onToggleVisibility} 
          variant="outline" 
          size="sm"
          className="bg-white dark:bg-gray-900 shadow-lg"
        >
          Error Console ({errors.length})
        </Button>
      </div>
    );
  }

  const filteredErrors = errors.filter(error => {
    const matchesFilter = filter === 'all' || error.category === filter;
    const matchesSearch = error.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         error.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExportErrors = () => {
    const errorData = filteredErrors.map(error => ({
      timestamp: new Date(error.timestamp).toISOString(),
      title: error.title,
      category: error.category,
      description: error.description,
      trace: error.trace
    }));

    const blob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qosim-errors-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-80 z-40 shadow-lg border-red-200 dark:border-red-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Error Console</CardTitle>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {filteredErrors.length} errors
            </Badge>
            <Button variant="ghost" size="sm" onClick={onToggleVisibility} className="h-6 w-6 p-0">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Search errors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Syntax Error">Syntax</SelectItem>
              <SelectItem value="Backend Error">Backend</SelectItem>
              <SelectItem value="Resource Limit">Resource</SelectItem>
              <SelectItem value="Timeout">Timeout</SelectItem>
              <SelectItem value="Simulation Error">Simulation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-1">
          <Button onClick={onClearAll} variant="ghost" size="sm" className="h-6 px-2 text-xs">
            <Trash2 className="w-3 h-3 mr-1" />
            Clear
          </Button>
          <Button onClick={handleExportErrors} variant="ghost" size="sm" className="h-6 px-2 text-xs">
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {filteredErrors.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">
                {errors.length === 0 ? 'No errors logged' : 'No errors match your filter'}
              </div>
            ) : (
              filteredErrors.map((error) => (
                <div
                  key={error.id}
                  className="p-2 border rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => onViewError(error)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium truncate">{error.title}</span>
                        <Badge variant="outline" className="text-xs h-4">
                          {error.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {error.description}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {new Date(error.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
