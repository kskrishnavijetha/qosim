
import React from 'react';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ErrorToastProps {
  error: {
    id: string;
    title: string;
    description: string;
    category: string;
  };
  onDismiss: () => void;
  onViewDetails: () => void;
}

export function ErrorToast({ error, onDismiss, onViewDetails }: ErrorToastProps) {
  return (
    <div className="fixed top-4 right-4 z-50 w-96 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg shadow-lg animate-in slide-in-from-right-2">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm truncate">{error.title}</h4>
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400">
                {error.category}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{error.description}</p>
            <div className="flex gap-2 mt-3">
              <Button onClick={onViewDetails} variant="outline" size="sm" className="h-7 px-2 text-xs">
                <ExternalLink className="w-3 h-3 mr-1" />
                Details
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
