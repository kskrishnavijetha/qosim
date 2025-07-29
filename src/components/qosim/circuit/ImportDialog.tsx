
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: string, format: string) => Promise<void>;
}

export function ImportDialog({ isOpen, onClose, onImport }: ImportDialogProps) {
  const [format, setFormat] = useState<string>('qasm');
  const [importData, setImportData] = useState<string>('');
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!importData.trim()) {
      toast.error('Please enter code to import');
      return;
    }

    setIsImporting(true);
    try {
      await onImport(importData, format);
      toast.success(`Circuit imported from ${format.toUpperCase()}`);
      onClose();
      setImportData('');
    } catch (error) {
      toast.error('Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 text-white border-white/10">
        <DialogHeader>
          <DialogTitle className="text-yellow-400">Import Circuit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Import Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="bg-black/50 border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10">
                <SelectItem value="qasm">OpenQASM</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="python">Python (Qiskit)</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Code to Import</label>
            <Textarea
              placeholder="Paste your circuit code here..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="bg-black/50 border-white/10 text-white font-mono text-sm h-48"
            />
          </div>

          <Button
            onClick={handleImport}
            disabled={isImporting || !importData.trim()}
            className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400"
          >
            <Upload className="w-4 h-4 mr-2" />
            {isImporting ? 'Importing...' : 'Import Circuit'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
