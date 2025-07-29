
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CircuitExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CircuitExportDialog({ open, onOpenChange }: CircuitExportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Circuit</DialogTitle>
        </DialogHeader>
        <p>Export functionality coming soon</p>
      </DialogContent>
    </Dialog>
  );
}
