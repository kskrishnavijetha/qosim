
import { QOSimError, ErrorFixSuggestion } from './ErrorHandlingService';

export class ErrorFixSuggestionService {
  private static instance: ErrorFixSuggestionService;

  static getInstance(): ErrorFixSuggestionService {
    if (!ErrorFixSuggestionService.instance) {
      ErrorFixSuggestionService.instance = new ErrorFixSuggestionService();
    }
    return ErrorFixSuggestionService.instance;
  }

  async generateFixSuggestions(error: QOSimError): Promise<ErrorFixSuggestion[]> {
    const suggestions: ErrorFixSuggestion[] = [];

    switch (error.type) {
      case 'circuit':
        suggestions.push(...this.generateCircuitFixSuggestions(error));
        break;
      case 'syntax':
        suggestions.push(...this.generateSyntaxFixSuggestions(error));
        break;
      case 'backend':
        suggestions.push(...this.generateBackendFixSuggestions(error));
        break;
      case 'runtime':
        suggestions.push(...this.generateRuntimeFixSuggestions(error));
        break;
    }

    return suggestions.sort((a, b) => b.confidence - a.confidence);
  }

  private generateCircuitFixSuggestions(error: QOSimError): ErrorFixSuggestion[] {
    const suggestions: ErrorFixSuggestion[] = [];

    if (error.message.includes('no qubit assignment')) {
      suggestions.push({
        description: 'Assign qubit 0 to this gate',
        action: 'modify',
        gateConfig: { qubit: 0 },
        confidence: 0.9
      });
      
      suggestions.push({
        description: 'Remove this gate from the circuit',
        action: 'remove',
        confidence: 0.7
      });
    }

    if (error.message.includes('CNOT gate requires exactly 2 qubits')) {
      suggestions.push({
        description: 'Set CNOT to use qubits 0 and 1',
        action: 'modify',
        gateConfig: { qubits: [0, 1] },
        confidence: 0.95
      });
      
      suggestions.push({
        description: 'Convert to single-qubit X gate on qubit 0',
        action: 'replace',
        gateConfig: { type: 'X', qubit: 0 },
        confidence: 0.6
      });
    }

    if (error.message.includes('Toffoli gate requires exactly 3 qubits')) {
      suggestions.push({
        description: 'Set Toffoli to use qubits 0, 1, and 2',
        action: 'modify',
        gateConfig: { qubits: [0, 1, 2] },
        confidence: 0.9
      });
      
      suggestions.push({
        description: 'Convert to CNOT gate using first two qubits',
        action: 'replace',
        gateConfig: { type: 'CNOT', qubits: [0, 1] },
        confidence: 0.7
      });
    }

    if (error.message.includes('Invalid qubit index')) {
      const maxQubit = 4;
      suggestions.push({
        description: `Change qubit index to valid range (0-${maxQubit})`,
        action: 'modify',
        gateConfig: { qubit: 0 },
        confidence: 0.85
      });
    }

    if (error.message.includes('missing angle parameter')) {
      suggestions.push({
        description: 'Set rotation angle to π/2 (90 degrees)',
        action: 'modify',
        gateConfig: { angle: Math.PI / 2 },
        confidence: 0.8
      });
      
      suggestions.push({
        description: 'Set rotation angle to π (180 degrees)',
        action: 'modify',
        gateConfig: { angle: Math.PI },
        confidence: 0.7
      });
    }

    return suggestions;
  }

  private generateSyntaxFixSuggestions(error: QOSimError): ErrorFixSuggestion[] {
    const suggestions: ErrorFixSuggestion[] = [];

    if (error.message.includes('Missing Qiskit import')) {
      suggestions.push({
        description: 'Add Qiskit import statement',
        action: 'add',
        code: 'from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister',
        confidence: 0.95
      });
    }

    if (error.message.includes('CNOT gate requires 2 qubits')) {
      suggestions.push({
        description: 'Fix CNOT gate syntax',
        action: 'replace',
        code: 'circuit.cx(0, 1)  # control=0, target=1',
        confidence: 0.9
      });
    }

    if (error.message.includes('QASM version not specified')) {
      suggestions.push({
        description: 'Add QASM version declaration',
        action: 'add',
        code: 'OPENQASM 2.0;',
        confidence: 0.9
      });
    }

    return suggestions;
  }

  private generateBackendFixSuggestions(error: QOSimError): ErrorFixSuggestion[] {
    const suggestions: ErrorFixSuggestion[] = [];

    if (error.message.includes('authentication')) {
      suggestions.push({
        description: 'Re-enter your API credentials',
        action: 'modify',
        confidence: 0.8
      });
      
      suggestions.push({
        description: 'Switch to local simulator',
        action: 'modify',
        confidence: 0.9
      });
    }

    if (error.message.includes('timeout')) {
      suggestions.push({
        description: 'Reduce circuit depth and complexity',
        action: 'modify',
        confidence: 0.7
      });
      
      suggestions.push({
        description: 'Try again in a few minutes',
        action: 'modify',
        confidence: 0.6
      });
    }

    if (error.message.includes('quota')) {
      suggestions.push({
        description: 'Use local simulator instead',
        action: 'modify',
        confidence: 0.9
      });
    }

    return suggestions;
  }

  private generateRuntimeFixSuggestions(error: QOSimError): ErrorFixSuggestion[] {
    const suggestions: ErrorFixSuggestion[] = [];

    if (error.message.includes('undefined')) {
      suggestions.push({
        description: 'Initialize all variables before use',
        action: 'modify',
        confidence: 0.8
      });
    }

    if (error.message.includes('memory')) {
      suggestions.push({
        description: 'Reduce circuit size or qubit count',
        action: 'modify',
        confidence: 0.7
      });
    }

    return suggestions;
  }
}

export const errorFixSuggestionService = ErrorFixSuggestionService.getInstance();
