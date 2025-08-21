
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Terminal,
  Filter,
  Download,
  Trash2,
  Pin,
  Clock,
  AlertCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { QOSimError, ErrorType, ErrorSeverity, errorHandlingService } from '@/services/ErrorHandlingService';
import { cn } from '@/lib/utils';

interface ErrorLoggingConsoleProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function ErrorLoggingConsole({ isVisible, onToggleVisibility }: ErrorLoggingConsoleProps) {
  const [errors, setErrors] = useState<QOSimError[]>([]);
  const [filteredErrors, setFilteredErrors] = useState<QOSimError[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | ErrorType>('all');
  const [severityFilter, setSeverityFilter] = useState<ErrorSeverity | 'all'>('all');
  const [showDismissed, setShowDismissed] = useState(false);

  useEffect(() => {
    const unsubscribe = errorHandlingService.subscribe(setErrors);
    return unsubscribe;
  }, []);

  useEffect(() => {
    let filtered = [...errors];

    if (activeTab !== 'all') {
      filtered = filtered.filter(error => error.type === activeTab);
    }

    if (severityFilter !== 'all') {
      filtered = filtered.filter(error => error.severity === severityFilter);
    }

    if (!showDismissed) {
      filtered = filtered.filter(error => !error.dismissed);
    }

    setFilteredErrors(filtered);
  }, [errors, activeTab, severityFilter, showDismissed]);

  const getSeverityIcon = (severity: ErrorSeverity) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'info':
        return <Info className="w-3 h-3 text-blue-500" />;
    }
  };

  const getSeverityCount = (severity: ErrorSeverity) => {
    return errors.filter(e => e.severity === severity && !e.dismissed).length;
  };

  const getTypeCount = (type: ErrorType) => {
    return errors.filter(e => e.type === type && !e.dismissed).length;
  };

  const handleExport = (format: 'json' | 'csv') => {
    const exportData = errorHandlingService.exportErrors(format);
    const blob = new Blob([exportData], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qosim-errors.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearErrors = () => {
    if (activeTab === 'all') {
      errorHandlingService.clearErrors();
    } else {
      errorHandlingService.clearErrors({ type: activeTab });
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          onClick={onToggleVisibility}
          className="rounded-full shadow-lg"
          size="sm"
        >
          <Terminal className="w-4 h-4 mr-2" />
          Error Console ({errors.filter(e => !e.dismissed).length})
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-0 left-0 right-0 h-80 z-40 rounded-t-lg border-t shadow-lg bg-background">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Error Console
            <Badge variant="outline" className="text-xs">
              {filteredErrors.length} errors
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {/* Severity Filters */}
            <div className="flex items-center gap-1">
              <Button
                variant={severityFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('all')}
                className="h-6 px-2 text-xs"
              >
                All
              </Button>
              <Button
                variant={severityFilter === 'critical' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('critical')}
                className="h-6 px-2 text-xs"
              >
                Critical ({getSeverityCount('critical')})
              </Button>
              <Button
                variant={severityFilter === 'warning' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('warning')}
                className="h-6 px-2 text-xs bg-yellow-500 hover:bg-yellow-600"
              >
                Warning ({getSeverityCount('warning')})
              </Button>
              <Button
                variant={severityFilter === 'info' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSeverityFilter('info')}
                className="h-6 px-2 text-xs bg-blue-500 hover:bg-blue-600"
              >
                Info ({getSeverityCount('info')})
              </Button>
            </div>

            {/* Action Buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDismissed(!showDismissed)}
              className="h-6 px-2 text-xs"
            >
              <Filter className="w-3 h-3 mr-1" />
              {showDismissed ? 'Hide Dismissed' : 'Show Dismissed'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('json')}
              className="h-6 px-2 text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              JSON
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExport('csv')}
              className="h-6 px-2 text-xs"
            >
              <Download className="w-3 h-3 mr-1" />
              CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearErrors}
              className="h-6 px-2 text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleVisibility}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="h-8 mx-4">
            <TabsTrigger value="all" className="text-xs h-6">
              All ({errors.filter(e => !e.dismissed).length})
            </TabsTrigger>
            <TabsTrigger value="syntax" className="text-xs h-6">
              Syntax ({getTypeCount('syntax')})
            </TabsTrigger>
            <TabsTrigger value="runtime" className="text-xs h-6">
              Runtime ({getTypeCount('runtime')})
            </TabsTrigger>
            <TabsTrigger value="circuit" className="text-xs h-6">
              Circuit ({getTypeCount('circuit')})
            </TabsTrigger>
            <TabsTrigger value="backend" className="text-xs h-6">
              Backend ({getTypeCount('backend')})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-2">
            <ScrollArea className="h-48 px-4">
              <div className="space-y-2">
                {filteredErrors.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No errors to display</p>
                  </div>
                ) : (
                  filteredErrors.map((error) => (
                    <div
                      key={error.id}
                      className={cn(
                        "p-3 rounded-lg border text-sm",
                        error.dismissed && "opacity-50",
                        error.pinned && "border-blue-500",
                        error.severity === 'critical' && "border-red-200 bg-red-50 dark:bg-red-950",
                        error.severity === 'warning' && "border-yellow-200 bg-yellow-50 dark:bg-yellow-950",
                        error.severity === 'info' && "border-blue-200 bg-blue-50 dark:bg-blue-950"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-2 flex-1">
                          {getSeverityIcon(error.severity)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{error.message}</p>
                              <Badge variant="outline" className="text-xs">
                                {error.type}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-2">{error.cause}</p>
                            <p className="text-xs text-blue-600">{error.possibleFix}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => errorHandlingService.pinError(error.id)}
                            className={cn(
                              "h-6 w-6 p-0",
                              error.pinned && "text-blue-600"
                            )}
                          >
                            <Pin className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => errorHandlingService.dismissError(error.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 pt-2 border-t text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimestamp(error.timestamp)}
                        </div>
                        {error.location && (
                          <div>
                            {error.location.line && `Line ${error.location.line}`}
                            {error.location.gateId && `Gate ${error.location.gateId}`}
                            {error.location.qubitIndex !== undefined && `Qubit ${error.location.qubitIndex}`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
