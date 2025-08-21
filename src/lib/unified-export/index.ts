
export { Circuit, GateOp, validate } from './types';
export { toOpenQASM } from './openqasm-exporter';
export { toJSON } from './json-exporter';
export { toQiskit } from './qiskit-exporter';
export { toJavaScript } from './javascript-exporter';
export { convertToUnifiedCircuit } from './circuit-converter';

// Unified exporter class
export class UnifiedExporter {
  static export(circuit: Circuit, format: string): string {
    switch (format.toLowerCase()) {
      case 'qasm':
      case 'openqasm':
        return toOpenQASM(circuit);
      case 'json':
        return toJSON(circuit);
      case 'qiskit':
      case 'python':
        return toQiskit(circuit);
      case 'javascript':
      case 'js':
        return toJavaScript(circuit);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  static validateCircuit(circuit: Circuit): { isValid: boolean; errors: string[] } {
    const errors = validate(circuit);
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
