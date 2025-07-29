
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CircuitImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CircuitImportDialog({ open, onOpenChange }: CircuitImportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Circuit</DialogTitle>
        </DialogHeader>
        <p>Import functionality coming soon</p>
      </DialogContent>
    </Dialog>
  );
}
