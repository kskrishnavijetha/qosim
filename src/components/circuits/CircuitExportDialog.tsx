export interface CircuitExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  circuit: any;
  onExport: (format: string) => Promise<void>;
}

export function CircuitExportDialog({ open, onOpenChange, circuit, onExport }: CircuitExportDialogProps) {
  return (
    <div>
      {/* Placeholder export dialog */}
      <p>Export Dialog Placeholder</p>
    </div>
  );
}
