import { Gate } from '@/hooks/useCircuitState';

export interface ParsedCircuitResult {
  gates: Gate[];
  framework: string;
  qubits: number;
  success: boolean;
  error?: string;
}

export class CircuitCodeParser {
  static parseCircuitCode(code: string, framework: string = 'QOSim'): ParsedCircuitResult {
    const lines = code.split('\n').filter(line => line.trim());
    const gates: Gate[] = [];
    let qubits = 2; // Default qubit count
    let gateCount = 0;

    try {
      switch (framework.toLowerCase()) {
        case 'qosim':
          return this.parseQOSim(lines, gates, gateCount, qubits);
        case 'qiskit':
          return this.parseQiskit(lines, gates, gateCount, qubits);
        case 'cirq':
          return this.parseCirq(lines, gates, gateCount, qubits);
        case 'pennylane':
          return this.parsePennyLane(lines, gates, gateCount, qubits);
        default:
          return this.parseQOSim(lines, gates, gateCount, qubits);
      }
    } catch (error) {
      return {
        gates: [],
        framework,
        qubits: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown parsing error'
      };
    }
  }

  private static parseQOSim(lines: string[], gates: Gate[], gateCount: number, qubits: number): ParsedCircuitResult {
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Parse QuantumCircuit initialization
      const circuitMatch = trimmedLine.match(/QuantumCircuit\((\d+)\)/);
      if (circuitMatch) {
        qubits = parseInt(circuitMatch[1]);
        continue;
      }

      // Parse gate operations: qc.gate(qubit1, qubit2, ...)
      const gateMatch = trimmedLine.match(/qc\.(\w+)\((.*?)\)/);
      if (gateMatch) {
        const gateType = gateMatch[1];
        const params = gateMatch[2].split(',').map(p => p.trim());
        
        const gate = this.createGateFromQOSim(gateType, params, gateCount++);
        if (gate) {
          gates.push(gate);
        }
      }

      // Parse alternative syntax: circuit.gate(params)
      const altGateMatch = trimmedLine.match(/circuit\.(\w+)\((.*?)\)/);
      if (altGateMatch) {
        const gateType = altGateMatch[1];
        const params = altGateMatch[2].split(',').map(p => p.trim());
        
        const gate = this.createGateFromQOSim(gateType, params, gateCount++);
        if (gate) {
          gates.push(gate);
        }
      }
    }

    return {
      gates,
      framework: 'QOSim',
      qubits,
      success: true
    };
  }

  private static parseQiskit(lines: string[], gates: Gate[], gateCount: number, qubits: number): ParsedCircuitResult {
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Parse QuantumCircuit initialization
      const circuitMatch = trimmedLine.match(/QuantumCircuit\((\d+)/);
      if (circuitMatch) {
        qubits = parseInt(circuitMatch[1]);
        continue;
      }

      // Parse QASM-style gates
      if (trimmedLine.startsWith('h ')) {
        const qubitMatch = trimmedLine.match(/h q\[?(\d+)\]?/);
        if (qubitMatch) {
          gates.push({
            id: `qiskit-gate-${Date.now()}-${gateCount++}`,
            type: 'H',
            qubit: parseInt(qubitMatch[1]),
            position: gateCount
          });
        }
      }

      if (trimmedLine.startsWith('cx ')) {
        const qubitMatch = trimmedLine.match(/cx q\[?(\d+)\]?,q\[?(\d+)\]?/);
        if (qubitMatch) {
          gates.push({
            id: `qiskit-gate-${Date.now()}-${gateCount++}`,
            type: 'CNOT',
            qubits: [parseInt(qubitMatch[1]), parseInt(qubitMatch[2])],
            position: gateCount
          });
        }
      }

      // Parse circuit method calls: circuit.h(0), circuit.cx(0, 1)
      const methodMatch = trimmedLine.match(/circuit\.(\w+)\((.*?)\)/);
      if (methodMatch) {
        const gateType = methodMatch[1];
        const params = methodMatch[2].split(',').map(p => parseInt(p.trim()));
        
        const gate = this.createGateFromQiskit(gateType, params, gateCount++);
        if (gate) {
          gates.push(gate);
        }
      }
    }

    return {
      gates,
      framework: 'Qiskit',
      qubits,
      success: true
    };
  }

  private static parseCirq(lines: string[], gates: Gate[], gateCount: number, qubits: number): ParsedCircuitResult {
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Parse Cirq operations
      const opMatch = trimmedLine.match(/cirq\.(\w+)\((.*?)\)/);
      if (opMatch) {
        const gateType = opMatch[1];
        const params = opMatch[2].split(',').map(p => p.trim());
        
        const gate = this.createGateFromCirq(gateType, params, gateCount++);
        if (gate) {
          gates.push(gate);
        }
      }

      // Parse circuit append operations
      const appendMatch = trimmedLine.match(/circuit\.append\(cirq\.(\w+)\((.*?)\)\)/);
      if (appendMatch) {
        const gateType = appendMatch[1];
        const params = appendMatch[2].split(',').map(p => p.trim());
        
        const gate = this.createGateFromCirq(gateType, params, gateCount++);
        if (gate) {
          gates.push(gate);
        }
      }
    }

    return {
      gates,
      framework: 'Cirq',
      qubits: Math.max(2, qubits),
      success: true
    };
  }

  private static parsePennyLane(lines: string[], gates: Gate[], gateCount: number, qubits: number): ParsedCircuitResult {
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Parse PennyLane gate operations
      const gateMatch = trimmedLine.match(/qml\.(\w+)\((.*?)\)/);
      if (gateMatch) {
        const gateType = gateMatch[1];
        const params = gateMatch[2].split(',').map(p => p.trim());
        
        const gate = this.createGateFromPennyLane(gateType, params, gateCount++);
        if (gate) {
          gates.push(gate);
        }
      }

      // Parse @qml.qnode decorator to determine qubits
      const qnodeMatch = trimmedLine.match(/dev\s*=\s*qml\.device.*?wires\s*=\s*(\d+)/);
      if (qnodeMatch) {
        qubits = parseInt(qnodeMatch[1]);
      }
    }

    return {
      gates,
      framework: 'PennyLane',
      qubits: Math.max(2, qubits),
      success: true
    };
  }

  private static createGateFromQOSim(gateType: string, params: string[], position: number): Gate | null {
    const gateId = `qosim-gate-${Date.now()}-${position}`;
    
    switch (gateType.toLowerCase()) {
      case 'h':
        return {
          id: gateId,
          type: 'H',
          qubit: parseInt(params[0]) || 0,
          position
        };
      case 'x':
        return {
          id: gateId,
          type: 'X',
          qubit: parseInt(params[0]) || 0,
          position
        };
      case 'y':
        return {
          id: gateId,
          type: 'Y',
          qubit: parseInt(params[0]) || 0,
          position
        };
      case 'z':
        return {
          id: gateId,
          type: 'Z',
          qubit: parseInt(params[0]) || 0,
          position
        };
      case 'cx':
      case 'cnot':
        if (params.length >= 2) {
          return {
            id: gateId,
            type: 'CNOT',
            qubits: [parseInt(params[0]), parseInt(params[1])],
            position
          };
        }
        break;
      case 'rz':
        if (params.length >= 2) {
          return {
            id: gateId,
            type: 'RZ',
            qubit: parseInt(params[1]) || 0,
            angle: parseFloat(params[0]) || 0,
            position
          };
        }
        break;
      case 'ry':
        if (params.length >= 2) {
          return {
            id: gateId,
            type: 'RY',
            qubit: parseInt(params[1]) || 0,
            angle: parseFloat(params[0]) || 0,
            position
          };
        }
        break;
    }
    return null;
  }

  private static createGateFromQiskit(gateType: string, params: number[], position: number): Gate | null {
    const gateId = `qiskit-gate-${Date.now()}-${position}`;
    
    switch (gateType.toLowerCase()) {
      case 'h':
        return {
          id: gateId,
          type: 'H',
          qubit: params[0] || 0,
          position
        };
      case 'x':
        return {
          id: gateId,
          type: 'X',
          qubit: params[0] || 0,
          position
        };
      case 'y':
        return {
          id: gateId,
          type: 'Y',
          qubit: params[0] || 0,
          position
        };
      case 'z':
        return {
          id: gateId,
          type: 'Z',
          qubit: params[0] || 0,
          position
        };
      case 'cx':
      case 'cnot':
        if (params.length >= 2) {
          return {
            id: gateId,
            type: 'CNOT',
            qubits: [params[0], params[1]],
            position
          };
        }
        break;
    }
    return null;
  }

  private static createGateFromCirq(gateType: string, params: string[], position: number): Gate | null {
    const gateId = `cirq-gate-${Date.now()}-${position}`;
    
    switch (gateType.toLowerCase()) {
      case 'h':
        const qubit = params[0]?.match(/\d+/)?.[0];
        if (qubit) {
          return {
            id: gateId,
            type: 'H',
            qubit: parseInt(qubit),
            position
          };
        }
        break;
      case 'x':
        const xQubit = params[0]?.match(/\d+/)?.[0];
        if (xQubit) {
          return {
            id: gateId,
            type: 'X',
            qubit: parseInt(xQubit),
            position
          };
        }
        break;
      case 'cnot':
      case 'cx':
        if (params.length >= 2) {
          const control = params[0]?.match(/\d+/)?.[0];
          const target = params[1]?.match(/\d+/)?.[0];
          if (control && target) {
            return {
              id: gateId,
              type: 'CNOT',
              qubits: [parseInt(control), parseInt(target)],
              position
            };
          }
        }
        break;
    }
    return null;
  }

  private static createGateFromPennyLane(gateType: string, params: string[], position: number): Gate | null {
    const gateId = `pennylane-gate-${Date.now()}-${position}`;
    
    switch (gateType.toLowerCase()) {
      case 'hadamard':
        const wireMatch = params.find(p => p.includes('wires'))?.match(/(\d+)/);
        if (wireMatch) {
          return {
            id: gateId,
            type: 'H',
            qubit: parseInt(wireMatch[1]),
            position
          };
        }
        break;
      case 'paulix':
        const xWireMatch = params.find(p => p.includes('wires'))?.match(/(\d+)/);
        if (xWireMatch) {
          return {
            id: gateId,
            type: 'X',
            qubit: parseInt(xWireMatch[1]),
            position
          };
        }
        break;
      case 'cnot':
        const cnotWires = params.find(p => p.includes('wires'))?.match(/\[(\d+),\s*(\d+)\]/);
        if (cnotWires) {
          return {
            id: gateId,
            type: 'CNOT',
            qubits: [parseInt(cnotWires[1]), parseInt(cnotWires[2])],
            position
          };
        }
        break;
    }
    return null;
  }

  static extractCodeBlocks(content: string): string[] {
    const codeBlocks: string[] = [];
    
    // Extract Python code blocks
    const pythonMatches = content.match(/```python\n([\s\S]*?)\n```/g);
    if (pythonMatches) {
      pythonMatches.forEach(match => {
        const code = match.replace(/```python\n/, '').replace(/\n```/, '');
        codeBlocks.push(code);
      });
    }
    
    // Extract general code blocks
    const generalMatches = content.match(/```\n([\s\S]*?)\n```/g);
    if (generalMatches) {
      generalMatches.forEach(match => {
        const code = match.replace(/```\n/, '').replace(/\n```/, '');
        codeBlocks.push(code);
      });
    }
    
    // Extract QASM code blocks
    const qasmMatches = content.match(/```qasm\n([\s\S]*?)\n```/g);
    if (qasmMatches) {
      qasmMatches.forEach(match => {
        const code = match.replace(/```qasm\n/, '').replace(/\n```/, '');
        codeBlocks.push(code);
      });
    }
    
    return codeBlocks;
  }
}