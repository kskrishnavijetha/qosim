
export function useExportHandlers(circuit: any, numQubits: number, options: any) {
  return {
    exportToPNG: () => {},
    exportToSVG: () => {},
    exportToQASM: () => {},
    handleExportJSON: () => {},
    handleExportQASM: () => {},
    handleExportPython: () => {}
  };
}
