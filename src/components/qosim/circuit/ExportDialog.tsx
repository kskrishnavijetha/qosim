
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type QuantumGate } from '@/types/qosim';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string) => Promise<string>;
  circuit: QuantumGate[];
}

export function ExportDialog({ isOpen, onClose, onExport, circuit }: ExportDialogProps) {
  const [format, setFormat] = useState<string>('qasm');
  const [exportedCode, setExportedCode] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const code = await onExport(format);
      setExportedCode(code);
      toast.success(`Circuit exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedCode);
    toast.success('Code copied to clipboard');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 text-white border-white/10">
        <DialogHeader>
          <DialogTitle className="text-cyan-400">Export Circuit</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Export Format</label>
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

          <div className="flex space-x-2">
            <Button
              onClick={handleExport}
              disabled={isExporting || circuit.length === 0}
              className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>

          {exportedCode && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-slate-400">Exported Code</label>
                <Button
                  onClick={handleCopy}
                  size="sm"
                  variant="outline"
                  className="text-slate-400 border-slate-400/30"
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={exportedCode}
                readOnly
                className="bg-black/50 border-white/10 text-white font-mono text-sm h-48"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
