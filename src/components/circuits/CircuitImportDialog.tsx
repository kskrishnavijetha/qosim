
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CircuitImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport?: (data: string, format: string) => Promise<void>;
}

export function CircuitImportDialog({ open, onOpenChange, onImport }: CircuitImportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Circuit</DialogTitle>
        </DialogHeader>
        <div>Import functionality placeholder</div>
      </DialogContent>
    </Dialog>
  );
}
