
export interface CustomGate {
  id: string;
  name: string;
  description?: string;
  matrix: (number | [number, number])[][]; // Each element can be real number or [real, imaginary] complex
  size: 2 | 4 | 8; // 2^n where n is number of qubits
  color: string;
  createdAt: string;
}

export interface Complex {
  real: number;
  imaginary: number;
}

export function parseComplexNumber(value: any): Complex {
  if (typeof value === 'number') {
    return { real: value, imaginary: 0 };
  }
  
  if (Array.isArray(value) && value.length === 2) {
    return { real: value[0], imaginary: value[1] };
  }
  
  throw new Error('Invalid complex number format. Use number or [real, imaginary] array.');
}

export function formatComplexNumber(value: any, compact = false): string {
  try {
    const complex = parseComplexNumber(value);
    const { real, imaginary } = complex;
    
    // Format for display
    const realStr = Math.abs(real) < 1e-10 ? '0' : real.toFixed(compact ? 2 : 3);
    const imagStr = Math.abs(imaginary) < 1e-10 ? '0' : Math.abs(imaginary).toFixed(compact ? 2 : 3);
    
    if (Math.abs(imaginary) < 1e-10) {
      return realStr;
    }
    
    if (Math.abs(real) < 1e-10) {
      return `${imaginary < 0 ? '-' : ''}${imagStr}i`;
    }
    
    const sign = imaginary >= 0 ? '+' : '-';
    return compact ? `${realStr}${sign}${imagStr}i` : `${realStr} ${sign} ${imagStr}i`;
  } catch {
    return 'Invalid';
  }
}

export function parseMatrixInput(input: string, expectedSize: number): (number | [number, number])[][] {
  try {
    // Remove whitespace and parse JSON
    const parsed = JSON.parse(input.trim());
    
    if (!Array.isArray(parsed)) {
      throw new Error('Matrix must be a 2D array');
    }
    
    if (parsed.length !== expectedSize) {
      throw new Error(`Matrix must be ${expectedSize}×${expectedSize}`);
    }
    
    for (let i = 0; i < expectedSize; i++) {
      if (!Array.isArray(parsed[i])) {
        throw new Error(`Row ${i} must be an array`);
      }
      
      if (parsed[i].length !== expectedSize) {
        throw new Error(`Row ${i} must have ${expectedSize} elements`);
      }
      
      // Validate each element
      for (let j = 0; j < expectedSize; j++) {
        try {
          parseComplexNumber(parsed[i][j]);
        } catch (error) {
          throw new Error(`Invalid number at position [${i}][${j}]: ${error}`);
        }
      }
    }
    
    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format. Use proper array syntax like [[1, 0], [0, 1]]');
    }
    throw error;
  }
}

export function validateUnitaryMatrix(matrix: (number | [number, number])[][]): {
  isValid: boolean;
  errors: string[];
  matrix?: (number | [number, number])[][];
} {
  const errors: string[] = [];
  const n = matrix.length;
  
  try {
    // Convert to complex numbers
    const complexMatrix = matrix.map(row =>
      row.map(value => parseComplexNumber(value))
    );
    
    // Check if matrix is square
    if (!matrix.every(row => row.length === n)) {
      errors.push('Matrix must be square');
      return { isValid: false, errors };
    }
    
    // Compute U * U†
    const conjugateTranspose = getConjugateTranspose(complexMatrix);
    const product = multiplyComplexMatrices(complexMatrix, conjugateTranspose);
    
    // Check if result is identity matrix (within tolerance)
    const tolerance = 1e-10;
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const expected = i === j ? 1 : 0;
        const actualReal = product[i][j].real;
        const actualImag = product[i][j].imaginary;
        
        if (Math.abs(actualReal - expected) > tolerance || Math.abs(actualImag) > tolerance) {
          errors.push(`Unitarity check failed at position [${i}][${j}]. Expected ${expected}, got ${formatComplexNumber([actualReal, actualImag])}`);
        }
      }
    }
    
    if (errors.length === 0) {
      return { isValid: true, errors: [], matrix };
    }
    
  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return { isValid: false, errors };
}

function getConjugateTranspose(matrix: Complex[][]): Complex[][] {
  const n = matrix.length;
  const result: Complex[][] = [];
  
  for (let i = 0; i < n; i++) {
    result[i] = [];
    for (let j = 0; j < n; j++) {
      // Transpose and conjugate
      result[i][j] = {
        real: matrix[j][i].real,
        imaginary: -matrix[j][i].imaginary
      };
    }
  }
  
  return result;
}

function multiplyComplexMatrices(a: Complex[][], b: Complex[][]): Complex[][] {
  const n = a.length;
  const result: Complex[][] = [];
  
  for (let i = 0; i < n; i++) {
    result[i] = [];
    for (let j = 0; j < n; j++) {
      let real = 0;
      let imaginary = 0;
      
      for (let k = 0; k < n; k++) {
        // (a + bi)(c + di) = (ac - bd) + (ad + bc)i
        const ac = a[i][k].real * b[k][j].real;
        const bd = a[i][k].imaginary * b[k][j].imaginary;
        const ad = a[i][k].real * b[k][j].imaginary;
        const bc = a[i][k].imaginary * b[k][j].real;
        
        real += ac - bd;
        imaginary += ad + bc;
      }
      
      result[i][j] = { real, imaginary };
    }
  }
  
  return result;
}

// Common unitary matrix templates
export const COMMON_GATES: Partial<CustomGate>[] = [
  {
    name: 'Pauli-X',
    description: 'Bit flip gate',
    matrix: [[0, 1], [1, 0]],
    size: 2
  },
  {
    name: 'Pauli-Y',
    description: 'Bit and phase flip gate',
    matrix: [[0, [0, -1]], [[0, 1], 0]],
    size: 2
  },
  {
    name: 'Pauli-Z',
    description: 'Phase flip gate',
    matrix: [[1, 0], [0, -1]],
    size: 2
  },
  {
    name: 'Hadamard',
    description: 'Creates superposition',
    matrix: [[0.7071, 0.7071], [0.7071, -0.7071]],
    size: 2
  },
  {
    name: 'CNOT',
    description: 'Controlled NOT gate',
    matrix: [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 0, 1], [0, 0, 1, 0]],
    size: 4
  }
];
