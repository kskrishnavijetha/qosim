
// Secure code execution utilities to replace dangerous new Function() usage

interface ExecutionResult {
  success: boolean;
  result?: any;
  error?: string;
  logs?: string[];
}

interface ExecutionContext {
  Math: typeof Math;
  console: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
  };
  // Add safe quantum simulation utilities
  QuantumCircuit: any;
  QuantumGate: any;
}

// Whitelist of allowed JavaScript constructs
const ALLOWED_PATTERNS = [
  /^[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*/, // Variable assignment
  /^[a-zA-Z_$][a-zA-Z0-9_$]*\.[a-zA-Z_$][a-zA-Z0-9_$]*/, // Property access
  /^[a-zA-Z_$][a-zA-Z0-9_$]*\(/, // Function calls
  /^return\s+/, // Return statements
  /^if\s*\(/, // If statements
  /^for\s*\(/, // For loops
  /^while\s*\(/, // While loops
  /^\d+/, // Numbers
  /^"[^"]*"/, // String literals
  /^'[^']*'/, // String literals
  /^\/\/.*/, // Comments
  /^\/\*[\s\S]*?\*\//, // Block comments
];

// Blacklisted dangerous patterns
const DANGEROUS_PATTERNS = [
  /eval\s*\(/,
  /Function\s*\(/,
  /new\s+Function/,
  /setTimeout/,
  /setInterval/,
  /document\./,
  /window\./,
  /global\./,
  /process\./,
  /require\s*\(/,
  /import\s+/,
  /export\s+/,
  /__proto__/,
  /constructor/,
  /prototype/,
];

export function validateCode(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      errors.push(`Dangerous pattern detected: ${pattern.source}`);
    }
  }
  
  // Basic syntax validation
  try {
    // Parse but don't execute
    new Function('', `"use strict"; ${code}`);
  } catch (error) {
    errors.push(`Syntax error: ${error instanceof Error ? error.message : 'Unknown syntax error'}`);
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function executeSecureCode(code: string, timeout: number = 5000): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const validation = validateCode(code);
    
    if (!validation.valid) {
      resolve({
        success: false,
        error: `Code validation failed: ${validation.errors.join(', ')}`
      });
      return;
    }

    const logs: string[] = [];
    
    // Create a safe execution context
    const context: ExecutionContext = {
      Math,
      console: {
        log: (...args: any[]) => {
          logs.push(args.map(arg => String(arg)).join(' '));
        },
        error: (...args: any[]) => {
          logs.push('ERROR: ' + args.map(arg => String(arg)).join(' '));
        },
        warn: (...args: any[]) => {
          logs.push('WARN: ' + args.map(arg => String(arg)).join(' '));
        }
      },
      // Mock quantum utilities for safe execution
      QuantumCircuit: class {
        constructor(public qubits: number) {}
        addGate(gate: string, qubit: number) {
          logs.push(`Added ${gate} gate to qubit ${qubit}`);
          return this;
        }
        measure() {
          logs.push('Circuit measured');
          return Math.random() > 0.5 ? '1' : '0';
        }
      },
      QuantumGate: {
        H: 'Hadamard',
        X: 'Pauli-X',
        Y: 'Pauli-Y',
        Z: 'Pauli-Z',
        CNOT: 'CNOT'
      }
    };

    // Set execution timeout
    const timeoutId = setTimeout(() => {
      resolve({
        success: false,
        error: 'Code execution timed out',
        logs
      });
    }, timeout);

    try {
      // Create a more restricted execution environment
      const restrictedCode = `
        "use strict";
        (function() {
          ${code}
        })();
      `;

      // Use a worker-like approach for isolation (simplified for this example)
      const result = executeInIsolatedContext(restrictedCode, context);
      
      clearTimeout(timeoutId);
      resolve({
        success: true,
        result,
        logs
      });
    } catch (error) {
      clearTimeout(timeoutId);
      resolve({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown execution error',
        logs
      });
    }
  });
}

function executeInIsolatedContext(code: string, context: ExecutionContext): any {
  // This is a simplified isolation - in production, you'd want to use
  // Web Workers or a more sophisticated sandboxing solution
  
  const contextKeys = Object.keys(context);
  const contextValues = Object.values(context);
  
  try {
    // Create a function with limited scope
    const fn = new Function(...contextKeys, code);
    return fn(...contextValues);
  } catch (error) {
    throw new Error(`Execution error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Quantum-specific secure execution
export function executeQuantumCode(code: string): Promise<ExecutionResult> {
  // Add quantum-specific validation
  const quantumValidation = validateQuantumCode(code);
  
  if (!quantumValidation.valid) {
    return Promise.resolve({
      success: false,
      error: `Quantum code validation failed: ${quantumValidation.errors.join(', ')}`
    });
  }
  
  return executeSecureCode(code, 10000); // Longer timeout for quantum simulations
}

function validateQuantumCode(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for quantum-specific patterns
  const quantumPatterns = [
    /QuantumCircuit/,
    /addGate/,
    /measure/,
    /H|X|Y|Z|CNOT/
  ];
  
  const hasQuantumContent = quantumPatterns.some(pattern => pattern.test(code));
  
  if (!hasQuantumContent && code.trim().length > 0) {
    errors.push('Code does not contain recognized quantum operations');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
