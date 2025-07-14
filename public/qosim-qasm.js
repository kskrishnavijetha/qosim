/**
 * QOSim QASM - OpenQASM 2.0 Parser and Exporter
 * Converts between QOSim circuits and QASM format
 */

import { QOSimSimulator } from './qosim-core.js';

export class QASMParser {
  constructor() {
    this.version = '2.0';
  }

  parse(qasmCode) {
    const lines = qasmCode.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('//'));
    
    let numQubits = 0;
    let numClassical = 0;
    const gates = [];
    const measurements = [];

    for (const line of lines) {
      if (line.startsWith('OPENQASM')) {
        // Version check
        continue;
      } else if (line.startsWith('include')) {
        // Standard library includes
        continue;
      } else if (line.startsWith('qreg')) {
        // Quantum register declaration: qreg q[5];
        const match = line.match(/qreg\s+(\w+)\[(\d+)\];/);
        if (match) {
          numQubits = parseInt(match[2]);
        }
      } else if (line.startsWith('creg')) {
        // Classical register declaration: creg c[5];
        const match = line.match(/creg\s+(\w+)\[(\d+)\];/);
        if (match) {
          numClassical = parseInt(match[2]);
        }
      } else if (line.includes('measure')) {
        // Measurement: measure q[0] -> c[0];
        const match = line.match(/measure\s+(\w+)\[(\d+)\]\s*->\s*(\w+)\[(\d+)\];/);
        if (match) {
          measurements.push({
            qubit: parseInt(match[2]),
            classical: parseInt(match[4])
          });
        }
      } else {
        // Gate operations
        const gate = this.parseGateOperation(line);
        if (gate) {
          gates.push(gate);
        }
      }
    }

    return {
      numQubits,
      numClassical,
      gates,
      measurements
    };
  }

  parseGateOperation(line) {
    // Remove semicolon and split by spaces
    const cleanLine = line.replace(';', '').trim();
    const parts = cleanLine.split(/\s+/);
    
    if (parts.length === 0) return null;

    const gateName = parts[0].toLowerCase();
    
    // Handle parameterized gates: rx(pi/2) q[0];
    const paramMatch = cleanLine.match(/(\w+)\((.*?)\)\s+(.+)/);
    if (paramMatch) {
      const [, gate, paramStr, qubitsStr] = paramMatch;
      const params = this.parseParameters(paramStr);
      const qubits = this.parseQubits(qubitsStr);
      
      return {
        name: gate.toUpperCase(),
        qubits,
        params
      };
    }

    // Handle multi-qubit gates: cx q[0],q[1];
    if (parts.length >= 2) {
      const qubitsStr = parts.slice(1).join(' ');
      const qubits = this.parseQubits(qubitsStr);
      
      // Map common QASM gate names
      const gateMap = {
        'cx': 'CNOT',
        'cnot': 'CNOT',
        'ccx': 'CCX',
        'toffoli': 'CCX',
        'h': 'H',
        'x': 'X',
        'y': 'Y',
        'z': 'Z',
        's': 'S',
        't': 'T',
        'rx': 'RX',
        'ry': 'RY',
        'rz': 'RZ'
      };

      return {
        name: gateMap[gateName] || gateName.toUpperCase(),
        qubits,
        params: []
      };
    }

    return null;
  }

  parseQubits(qubitsStr) {
    // Parse qubit references like "q[0],q[1]" or "q[0] q[1]"
    const qubits = [];
    const matches = qubitsStr.matchAll(/(\w+)\[(\d+)\]/g);
    
    for (const match of matches) {
      qubits.push(parseInt(match[2]));
    }
    
    return qubits;
  }

  parseParameters(paramStr) {
    // Parse parameters like "pi/2" or "0.5*pi"
    const params = [];
    const parts = paramStr.split(',').map(p => p.trim());
    
    for (const part of parts) {
      if (part.includes('pi')) {
        // Handle pi expressions
        let value = Math.PI;
        if (part.includes('/')) {
          const [numerator, denominator] = part.split('/');
          if (numerator.includes('pi')) {
            value = Math.PI / parseFloat(denominator);
          } else {
            value = parseFloat(numerator) * Math.PI / parseFloat(denominator);
          }
        } else if (part.includes('*')) {
          const [multiplier] = part.split('*');
          value = parseFloat(multiplier) * Math.PI;
        }
        params.push(value);
      } else {
        params.push(parseFloat(part));
      }
    }
    
    return params;
  }

  toSimulator(qasmCode) {
    const parsed = this.parse(qasmCode);
    const simulator = new QOSimSimulator(parsed.numQubits);
    
    // Add gates
    for (const gate of parsed.gates) {
      if (gate.name === 'CNOT' && gate.qubits.length === 2) {
        simulator.addGate('CNOT', gate.qubits[0], gate.qubits[1]);
      } else if (gate.name === 'CCX' && gate.qubits.length === 3) {
        simulator.addGate('CCX', gate.qubits[0], gate.qubits[1], gate.qubits[2]);
      } else if (['RX', 'RY', 'RZ'].includes(gate.name) && gate.params.length > 0) {
        simulator.addGate(gate.name, gate.qubits[0], gate.params[0]);
      } else if (gate.qubits.length === 1) {
        simulator.addGate(gate.name, gate.qubits[0]);
      }
    }
    
    // Add measurements
    for (const measurement of parsed.measurements) {
      simulator.measure(measurement.qubit);
    }
    
    return simulator;
  }
}

export class QASMExporter {
  constructor() {
    this.version = '2.0';
  }

  export(simulator) {
    let qasm = `OPENQASM ${this.version};\n`;
    qasm += `include "qelib1.inc";\n\n`;
    qasm += `qreg q[${simulator.numQubits}];\n`;
    
    if (simulator.measurements.length > 0) {
      qasm += `creg c[${simulator.measurements.length}];\n`;
    }
    
    qasm += '\n';

    // Export gates
    for (const gate of simulator.gates) {
      qasm += this.exportGate(gate) + '\n';
    }

    // Export measurements
    for (let i = 0; i < simulator.measurements.length; i++) {
      const qubit = simulator.measurements[i];
      qasm += `measure q[${qubit}] -> c[${i}];\n`;
    }

    return qasm;
  }

  exportGate(gate) {
    const gateName = gate.name.toLowerCase();
    
    if (gate.name === 'CNOT') {
      return `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];`;
    } else if (gate.name === 'CCX') {
      return `ccx q[${gate.qubits[0]}],q[${gate.qubits[1]}],q[${gate.qubits[2]}];`;
    } else if (['RX', 'RY', 'RZ'].includes(gate.name) && gate.params.length > 0) {
      const param = this.formatParameter(gate.params[0]);
      return `${gateName}(${param}) q[${gate.qubits[0]}];`;
    } else {
      return `${gateName} q[${gate.qubits[0]}];`;
    }
  }

  formatParameter(value) {
    // Convert radians back to pi expressions when possible
    const piRatio = value / Math.PI;
    
    if (Math.abs(piRatio - Math.round(piRatio)) < 1e-10) {
      const rounded = Math.round(piRatio);
      if (rounded === 0) return '0';
      if (rounded === 1) return 'pi';
      if (rounded === -1) return '-pi';
      return `${rounded}*pi`;
    }
    
    // Check for common fractions of pi
    const commonFractions = [
      { value: 0.5, str: 'pi/2' },
      { value: 0.25, str: 'pi/4' },
      { value: 0.125, str: 'pi/8' },
      { value: 1/3, str: 'pi/3' },
      { value: 2/3, str: '2*pi/3' },
      { value: 3/4, str: '3*pi/4' },
      { value: -0.5, str: '-pi/2' },
      { value: -0.25, str: '-pi/4' },
    ];
    
    for (const fraction of commonFractions) {
      if (Math.abs(piRatio - fraction.value) < 1e-10) {
        return fraction.str;
      }
    }
    
    return value.toString();
  }
}

// Utility functions
export function loadQASM(qasmCode) {
  const parser = new QASMParser();
  return parser.toSimulator(qasmCode);
}

export function exportQASM(simulator) {
  const exporter = new QASMExporter();
  return exporter.export(simulator);
}