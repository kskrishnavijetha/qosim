
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CircuitExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: string) => Promise<void>;
}

export function CircuitExportDialog({ open, onOpenChange, onExport }: CircuitExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Circuit</DialogTitle>
        </DialogHeader>
        <div>Export functionality placeholder</div>
      </DialogContent>
    </Dialog>
  );
}
