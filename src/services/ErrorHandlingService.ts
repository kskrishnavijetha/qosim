export type ErrorSeverity = 'critical' | 'warning' | 'info';
export type ErrorType = 'syntax' | 'runtime' | 'backend' | 'circuit' | 'connection';

export interface QOSimError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  cause: string;
  possibleFix: string;
  timestamp: number;
  location?: {
    line?: number;
    column?: number;
    gateId?: string;
    qubitIndex?: number;
  };
  context?: any;
  dismissed?: boolean;
  pinned?: boolean;
}

export interface ErrorFixSuggestion {
  description: string;
  action: 'replace' | 'add' | 'remove' | 'modify';
  code?: string;
  gateConfig?: any;
  confidence: number;
}

export class ErrorHandlingService {
  private static instance: ErrorHandlingService;
  private errors: QOSimError[] = [];
  private listeners: ((errors: QOSimError[]) => void)[] = [];
  private maxErrors = 100;

  static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  addError(error: Omit<QOSimError, 'id' | 'timestamp'>): QOSimError {
    const newError: QOSimError = {
      ...error,
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      dismissed: false,
      pinned: false
    };

    this.errors.unshift(newError);
    
    // Keep only the most recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    this.notifyListeners();
    console.error('QOSim Error:', newError);
    
    return newError;
  }

  removeError(errorId: string): void {
    this.errors = this.errors.filter(error => error.id !== errorId);
    this.notifyListeners();
  }

  dismissError(errorId: string): void {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.dismissed = true;
      this.notifyListeners();
    }
  }

  pinError(errorId: string): void {
    const error = this.errors.find(e => e.id === errorId);
    if (error) {
      error.pinned = !error.pinned;
      this.notifyListeners();
    }
  }

  getErrors(filter?: { type?: ErrorType; severity?: ErrorSeverity; dismissed?: boolean }): QOSimError[] {
    let filteredErrors = [...this.errors];

    if (filter) {
      if (filter.type) {
        filteredErrors = filteredErrors.filter(e => e.type === filter.type);
      }
      if (filter.severity) {
        filteredErrors = filteredErrors.filter(e => e.severity === filter.severity);
      }
      if (filter.dismissed !== undefined) {
        filteredErrors = filteredErrors.filter(e => e.dismissed === filter.dismissed);
      }
    }

    return filteredErrors;
  }

  clearErrors(filter?: { type?: ErrorType; severity?: ErrorSeverity }): void {
    if (!filter) {
      this.errors = this.errors.filter(e => e.pinned);
    } else {
      this.errors = this.errors.filter(e => {
        if (e.pinned) return true;
        if (filter.type && e.type === filter.type) return false;
        if (filter.severity && e.severity === filter.severity) return false;
        return true;
      });
    }
    this.notifyListeners();
  }

  exportErrors(format: 'json' | 'csv' = 'json'): string {
    const errors = this.getErrors({ dismissed: false });
    
    if (format === 'json') {
      return JSON.stringify(errors, null, 2);
    } else {
      const headers = ['Timestamp', 'Type', 'Severity', 'Message', 'Cause', 'Location'];
      const rows = errors.map(error => [
        new Date(error.timestamp).toISOString(),
        error.type,
        error.severity,
        error.message,
        error.cause,
        error.location ? JSON.stringify(error.location) : ''
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  }

  subscribe(callback: (errors: QOSimError[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.errors));
  }

  // Circuit validation methods
  validateCircuit(circuit: any[]): QOSimError[] {
    const errors: QOSimError[] = [];

    circuit.forEach((gate, index) => {
      // Check for missing qubit assignments
      if (!gate.qubit && !gate.qubits) {
        errors.push(this.addError({
          type: 'circuit',
          severity: 'critical',
          message: 'Gate has no qubit assignment',
          cause: `Gate at position ${index} (${gate.type}) has no target qubit`,
          possibleFix: 'Assign a valid qubit index to this gate',
          location: { gateId: gate.id }
        }));
      }

      // Check for invalid qubit indices
      const qubits = gate.qubits || [gate.qubit];
      qubits.forEach((qubit: number) => {
        if (qubit < 0 || qubit > 4) {
          errors.push(this.addError({
            type: 'circuit',
            severity: 'critical',
            message: 'Invalid qubit index',
            cause: `Qubit index ${qubit} is out of valid range (0-4)`,
            possibleFix: 'Use qubit indices between 0 and 4',
            location: { gateId: gate.id, qubitIndex: qubit }
          }));
        }
      });

      // Check for multi-qubit gate requirements
      if (gate.type === 'CNOT' && (!gate.qubits || gate.qubits.length !== 2)) {
        errors.push(this.addError({
          type: 'circuit',
          severity: 'critical',
          message: 'CNOT gate requires exactly 2 qubits',
          cause: 'CNOT gate has incorrect qubit configuration',
          possibleFix: 'Assign exactly 2 different qubits to the CNOT gate',
          location: { gateId: gate.id }
        }));
      }

      if (gate.type === 'TOFFOLI' && (!gate.qubits || gate.qubits.length !== 3)) {
        errors.push(this.addError({
          type: 'circuit',
          severity: 'critical',
          message: 'Toffoli gate requires exactly 3 qubits',
          cause: 'Toffoli gate has incorrect qubit configuration',
          possibleFix: 'Assign exactly 3 different qubits to the Toffoli gate',
          location: { gateId: gate.id }
        }));
      }

      // Check for rotation gate angles
      if (['RX', 'RY', 'RZ'].includes(gate.type) && gate.angle === undefined) {
        errors.push(this.addError({
          type: 'circuit',
          severity: 'warning',
          message: 'Rotation gate missing angle parameter',
          cause: `${gate.type} gate has no rotation angle specified`,
          possibleFix: 'Add an angle parameter (in radians) to the rotation gate',
          location: { gateId: gate.id }
        }));
      }
    });

    return errors;
  }

  // Code validation methods
  validateCode(code: string, language: 'qiskit' | 'cirq' | 'qasm'): QOSimError[] {
    const errors: QOSimError[] = [];
    const lines = code.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      if (language === 'qiskit') {
        // Check for common Qiskit syntax errors
        if (line.includes('QuantumCircuit(') && !line.includes('qiskit')) {
          errors.push(this.addError({
            type: 'syntax',
            severity: 'critical',
            message: 'Missing Qiskit import',
            cause: 'QuantumCircuit used without importing qiskit',
            possibleFix: 'Add: from qiskit import QuantumCircuit',
            location: { line: lineNumber }
          }));
        }

        if (line.includes('.cx(') && line.split(',').length !== 2) {
          errors.push(this.addError({
            type: 'syntax',
            severity: 'critical',
            message: 'CNOT gate requires 2 qubits',
            cause: 'cx() gate called with incorrect number of arguments',
            possibleFix: 'Use circuit.cx(control_qubit, target_qubit)',
            location: { line: lineNumber }
          }));
        }
      }

      if (language === 'qasm') {
        // Check QASM syntax
        if (line.trim().startsWith('OPENQASM') && !line.includes('2.0')) {
          errors.push(this.addError({
            type: 'syntax',
            severity: 'warning',
            message: 'QASM version not specified',
            cause: 'OPENQASM declaration missing version',
            possibleFix: 'Use: OPENQASM 2.0;',
            location: { line: lineNumber }
          }));
        }
      }

      // Check for undefined variables
      const undefinedMatch = line.match(/(\w+)\s*\(/);
      if (undefinedMatch && !line.includes('def ') && !line.includes('import')) {
        const functionName = undefinedMatch[1];
        if (!['print', 'len', 'range', 'enumerate'].includes(functionName)) {
          // This is a simplified check - in reality you'd maintain a symbol table
        }
      }
    });

    return errors;
  }

  // Backend error handling
  handleBackendError(error: any, backend: string): QOSimError {
    let severity: ErrorSeverity = 'critical';
    let cause = 'Unknown backend error';
    let possibleFix = 'Check your connection and try again';

    if (error.message?.includes('authentication')) {
      cause = 'Authentication failed with quantum backend';
      possibleFix = 'Check your API credentials and permissions';
    } else if (error.message?.includes('timeout')) {
      cause = 'Backend request timed out';
      possibleFix = 'Try reducing circuit complexity or try again later';
      severity = 'warning';
    } else if (error.message?.includes('quota')) {
      cause = 'Backend quota exceeded';
      possibleFix = 'Wait for quota reset or upgrade your account';
    }

    return this.addError({
      type: 'backend',
      severity,
      message: `${backend} execution failed`,
      cause,
      possibleFix,
      context: { backend, originalError: error.message }
    });
  }
}

export const errorHandlingService = ErrorHandlingService.getInstance();
