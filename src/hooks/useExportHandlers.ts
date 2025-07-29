
import { useCallback } from 'react';

export function useExportHandlers() {
  const exportToPNG = useCallback(() => {
    console.log('Export to PNG functionality coming soon');
  }, []);

  const exportToSVG = useCallback(() => {
    console.log('Export to SVG functionality coming soon');
  }, []);

  const exportToQASM = useCallback(() => {
    console.log('Export to QASM functionality coming soon');
  }, []);

  return {
    exportToPNG,
    exportToSVG,
    exportToQASM
  };
}
