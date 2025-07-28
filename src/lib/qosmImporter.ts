
import { QuantumCircuit } from '@/hooks/useCircuitBuilder';
import { nanoid } from 'nanoid';

class QOSMImporter {
  async import(data: string, format: string): Promise<QuantumCircuit> {
    switch (format.toLowerCase()) {
      case 'qasm':
        return this.importQASM(data);
      case 'json':
        return this.importJSON(data);
      case 'python':
        return this.importPython(data);
      default:
        throw new Error(`Unsupported import format: ${format}`);
    }
  }

  private importQASM(qasm: string): QuantumCircuit {
    const lines = qasm.split('\n').filter(line => line.trim() && !line.startsWith('//'));
    
    let numQubits = 0;
    const gates: any[] = [];
    let layer = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('qreg')) {
        const match = trimmed.match(/qreg\s+\w+\[(\d+)\]/);
        if (match) {
          numQubits = parseInt(match[1]);
        }
      } else if (trimmed.includes('q[')) {
        const gate = this.parseQASMGate(trimmed, layer++);
        if (gate) {
          gates.push(gate);
        }
      }
    }

    // Create qubits
    const qubits = Array.from({ length: numQubits }, (_, i) => ({
      id: nanoid(),
      index: i,
      name: `q${i}`,
      state: 'computational' as const
    }));

    // Create circuit
    const circuit: QuantumCircuit = {
      id: nanoid(),
      name: 'Imported Circuit',
      qubits,
      gates: gates.map(gate => ({
        ...gate,
        qubits: gate.qubits.map((index: number) => qubits[index].id)
      })),
      layers: [],
      depth: layer,
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    return circuit;
  }

  private parseQASMGate(line: string, layer: number): any | null {
    const gatePatterns = [
      { pattern: /h\s+q\[(\d+)\]/, type: 'H' },
      { pattern: /x\s+q\[(\d+)\]/, type: 'X' },
      { pattern: /y\s+q\[(\d+)\]/, type: 'Y' },
      { pattern: /z\s+q\[(\d+)\]/, type: 'Z' },
      { pattern: /s\s+q\[(\d+)\]/, type: 'S' },
      { pattern: /t\s+q\[(\d+)\]/, type: 'T' },
      { pattern: /rx\(([^)]+)\)\s+q\[(\d+)\]/, type: 'RX' },
      { pattern: /ry\(([^)]+)\)\s+q\[(\d+)\]/, type: 'RY' },
      { pattern: /rz\(([^)]+)\)\s+q\[(\d+)\]/, type: 'RZ' },
      { pattern: /cx\s+q\[(\d+)\],q\[(\d+)\]/, type: 'CNOT' },
      { pattern: /cz\s+q\[(\d+)\],q\[(\d+)\]/, type: 'CZ' },
      { pattern: /swap\s+q\[(\d+)\],q\[(\d+)\]/, type: 'SWAP' },
      { pattern: /ccx\s+q\[(\d+)\],q\[(\d+)\],q\[(\d+)\]/, type: 'TOFFOLI' },
      { pattern: /measure\s+q\[(\d+)\]/, type: 'M' }
    ];

    for (const { pattern, type } of gatePatterns) {
      const match = line.match(pattern);
      if (match) {
        const gate: any = {
          id: nanoid(),
          type,
          qubits: [],
          position: { x: layer * 100, y: 0 },
          layer,
          params: {}
        };

        if (type === 'RX' || type === 'RY' || type === 'RZ') {
          gate.params.angle = parseFloat(match[1]);
          gate.qubits = [parseInt(match[2])];
        } else if (type === 'CNOT' || type === 'CZ' || type === 'SWAP') {
          gate.qubits = [parseInt(match[1]), parseInt(match[2])];
        } else if (type === 'TOFFOLI') {
          gate.qubits = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
        } else {
          gate.qubits = [parseInt(match[1])];
        }

        return gate;
      }
    }

    return null;
  }

  private importJSON(json: string): QuantumCircuit {
    const data = JSON.parse(json);
    
    // Create qubits
    const qubits = Array.from({ length: data.qubits }, (_, i) => ({
      id: nanoid(),
      index: i,
      name: `q${i}`,
      state: 'computational' as const
    }));

    // Create gates
    const gates = data.gates.map((gate: any, index: number) => ({
      id: nanoid(),
      type: gate.type,
      qubits: gate.qubits.map((index: number) => qubits[index].id),
      position: { x: (gate.layer || index) * 100, y: gate.qubits[0] * 80 },
      layer: gate.layer || index,
      params: gate.params || {},
      metadata: {
        label: gate.type,
        color: this.getGateColor(gate.type)
      }
    }));

    const circuit: QuantumCircuit = {
      id: nanoid(),
      name: data.name || 'Imported Circuit',
      description: data.description,
      qubits,
      gates,
      layers: [],
      depth: Math.max(...gates.map(g => g.layer)) + 1,
      metadata: data.metadata || {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    return circuit;
  }

  private importPython(python: string): QuantumCircuit {
    // This is a simplified Python parser - in a real implementation,
    // you'd want to use a proper AST parser
    const lines = python.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    let numQubits = 0;
    const gates: any[] = [];
    let layer = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.includes('QuantumCircuit(')) {
        const match = trimmed.match(/QuantumCircuit\((\d+)/);
        if (match) {
          numQubits = parseInt(match[1]);
        }
      } else if (trimmed.startsWith('qc.')) {
        const gate = this.parsePythonGate(trimmed, layer++);
        if (gate) {
          gates.push(gate);
        }
      }
    }

    // Create qubits
    const qubits = Array.from({ length: numQubits }, (_, i) => ({
      id: nanoid(),
      index: i,
      name: `q${i}`,
      state: 'computational' as const
    }));

    // Create circuit
    const circuit: QuantumCircuit = {
      id: nanoid(),
      name: 'Imported Python Circuit',
      qubits,
      gates: gates.map(gate => ({
        ...gate,
        qubits: gate.qubits.map((index: number) => qubits[index].id)
      })),
      layers: [],
      depth: layer,
      metadata: {
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        version: '1.0.0'
      }
    };

    return circuit;
  }

  private parsePythonGate(line: string, layer: number): any | null {
    const gatePatterns = [
      { pattern: /qc\.h\((\d+)\)/, type: 'H' },
      { pattern: /qc\.x\((\d+)\)/, type: 'X' },
      { pattern: /qc\.y\((\d+)\)/, type: 'Y' },
      { pattern: /qc\.z\((\d+)\)/, type: 'Z' },
      { pattern: /qc\.s\((\d+)\)/, type: 'S' },
      { pattern: /qc\.t\((\d+)\)/, type: 'T' },
      { pattern: /qc\.rx\(([^,]+),\s*(\d+)\)/, type: 'RX' },
      { pattern: /qc\.ry\(([^,]+),\s*(\d+)\)/, type: 'RY' },
      { pattern: /qc\.rz\(([^,]+),\s*(\d+)\)/, type: 'RZ' },
      { pattern: /qc\.cx\((\d+),\s*(\d+)\)/, type: 'CNOT' },
      { pattern: /qc\.cz\((\d+),\s*(\d+)\)/, type: 'CZ' },
      { pattern: /qc\.swap\((\d+),\s*(\d+)\)/, type: 'SWAP' },
      { pattern: /qc\.ccx\((\d+),\s*(\d+),\s*(\d+)\)/, type: 'TOFFOLI' },
      { pattern: /qc\.measure\((\d+)/, type: 'M' }
    ];

    for (const { pattern, type } of gatePatterns) {
      const match = line.match(pattern);
      if (match) {
        const gate: any = {
          id: nanoid(),
          type,
          qubits: [],
          position: { x: layer * 100, y: 0 },
          layer,
          params: {}
        };

        if (type === 'RX' || type === 'RY' || type === 'RZ') {
          gate.params.angle = parseFloat(match[1]);
          gate.qubits = [parseInt(match[2])];
        } else if (type === 'CNOT' || type === 'CZ' || type === 'SWAP') {
          gate.qubits = [parseInt(match[1]), parseInt(match[2])];
        } else if (type === 'TOFFOLI') {
          gate.qubits = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
        } else {
          gate.qubits = [parseInt(match[1])];
        }

        return gate;
      }
    }

    return null;
  }

  private getGateColor(gateType: string): string {
    const colors: { [key: string]: string } = {
      'H': '#FFD700',
      'X': '#FF6B6B',
      'Y': '#4ECDC4',
      'Z': '#45B7D1',
      'CNOT': '#96CEB4',
      'RX': '#FFEAA7',
      'RY': '#DDA0DD',
      'RZ': '#98D8C8',
      'S': '#F7DC6F',
      'T': '#BB8FCE',
      'SWAP': '#85C1E9',
      'TOFFOLI': '#F8C471'
    };
    return colors[gateType] || '#BDC3C7';
  }
}

export const qosmImporter = new QOSMImporter();
