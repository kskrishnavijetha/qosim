
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/lib/analytics';

interface Gate {
  id: string;
  type: string;
  qubit?: number;
  qubits?: number[];
  position: number;
  angle?: number;
  label?: string;
  comment?: string;
}

interface ExportOptions {
  projectName: string;
}

export function useExportHandlers(
  circuit: Gate[], 
  numQubits: number, 
  options: ExportOptions
) {
  const { toast } = useToast();

  const generateCircuitData = (gates: Gate[]) => {
    return gates
      .sort((a, b) => a.position - b.position)
      .map(gate => ({
        gate: gate.type,
        qubit: gate.qubit,
        qubits: gate.qubits,
        time: gate.position,
        angle: gate.angle
      }));
  };

  const getValidQubitIndex = (qubit: number | undefined): number => {
    if (qubit === undefined || qubit === null || isNaN(qubit)) {
      return 0; // Default to qubit 0 if undefined
    }
    return Math.max(0, Math.min(qubit, numQubits - 1)); // Clamp to valid range
  };

  const getValidQubitIndices = (qubits: number[] | undefined): number[] => {
    if (!qubits || !Array.isArray(qubits)) {
      return [0, 1]; // Default for two-qubit gates
    }
    return qubits.map(q => getValidQubitIndex(q));
  };

  const handleExportJSON = () => {
    try {
      const data = generateCircuitData(circuit);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${options.projectName}.json`;
      a.click();
      URL.revokeObjectURL(url);
      trackEvent('circuit_exported', { format: 'json', gateCount: circuit.length });
      toast({ title: "JSON exported successfully!" });
    } catch (error) {
      toast({ title: "Export failed", description: String(error), variant: "destructive" });
    }
  };

  const handleExportQASM = () => {
    try {
      let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\nqreg q[${numQubits}];\ncreg c[${numQubits}];\n\n`;
      
      // Sort gates by position to ensure correct execution order
      const sortedGates = [...circuit].sort((a, b) => a.position - b.position);
      
      sortedGates.forEach(gate => {
        switch (gate.type) {
          case 'H':
            const hQubit = getValidQubitIndex(gate.qubit);
            qasm += `h q[${hQubit}];\n`;
            break;
          case 'X':
            const xQubit = getValidQubitIndex(gate.qubit);
            qasm += `x q[${xQubit}];\n`;
            break;
          case 'Y':
            const yQubit = getValidQubitIndex(gate.qubit);
            qasm += `y q[${yQubit}];\n`;
            break;
          case 'Z':
            const zQubit = getValidQubitIndex(gate.qubit);
            qasm += `z q[${zQubit}];\n`;
            break;
          case 'S':
            const sQubit = getValidQubitIndex(gate.qubit);
            qasm += `s q[${sQubit}];\n`;
            break;
          case 'T':
            const tQubit = getValidQubitIndex(gate.qubit);
            qasm += `t q[${tQubit}];\n`;
            break;
          case 'CNOT':
            const cnotQubits = getValidQubitIndices(gate.qubits);
            qasm += `cx q[${cnotQubits[0]}],q[${cnotQubits[1]}];\n`;
            break;
          case 'CZ':
            const czQubits = getValidQubitIndices(gate.qubits);
            qasm += `cz q[${czQubits[0]}],q[${czQubits[1]}];\n`;
            break;
          case 'RX':
            const rxQubit = getValidQubitIndex(gate.qubit);
            const rxAngle = gate.angle || 0;
            qasm += `rx(${rxAngle}) q[${rxQubit}];\n`;
            break;
          case 'RY':
            const ryQubit = getValidQubitIndex(gate.qubit);
            const ryAngle = gate.angle || 0;
            qasm += `ry(${ryAngle}) q[${ryQubit}];\n`;
            break;
          case 'RZ':
            const rzQubit = getValidQubitIndex(gate.qubit);
            const rzAngle = gate.angle || 0;
            qasm += `rz(${rzAngle}) q[${rzQubit}];\n`;
            break;
          case 'M':
            const mQubit = getValidQubitIndex(gate.qubit);
            qasm += `measure q[${mQubit}] -> c[${mQubit}];\n`;
            break;
          default:
            console.warn(`Unsupported gate type for QASM export: ${gate.type}`);
        }
      });
      
      const blob = new Blob([qasm], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${options.projectName}.qasm`;
      a.click();
      URL.revokeObjectURL(url);
      trackEvent('circuit_exported', { format: 'qasm', gateCount: circuit.length });
      toast({ title: "QASM exported successfully!" });
    } catch (error) {
      toast({ title: "Export failed", description: String(error), variant: "destructive" });
    }
  };

  const handleExportPython = () => {
    try {
      let python = `# Quantum Circuit - ${options.projectName}\n`;
      python += `# Generated by QOSim\n\n`;
      python += `from qiskit import QuantumCircuit, execute, Aer\n`;
      python += `from qiskit.visualization import plot_histogram\n`;
      python += `import numpy as np\n\n`;
      python += `# Create quantum circuit\n`;
      python += `qc = QuantumCircuit(${numQubits}, ${numQubits})\n\n`;
      
      // Sort gates by position to ensure correct execution order
      const sortedGates = [...circuit].sort((a, b) => a.position - b.position);
      
      sortedGates.forEach(gate => {
        switch (gate.type) {
          case 'H':
            const hQubit = getValidQubitIndex(gate.qubit);
            python += `qc.h(${hQubit})  # Hadamard gate\n`;
            break;
          case 'X':
            const xQubit = getValidQubitIndex(gate.qubit);
            python += `qc.x(${xQubit})  # Pauli-X gate\n`;
            break;
          case 'Y':
            const yQubit = getValidQubitIndex(gate.qubit);
            python += `qc.y(${yQubit})  # Pauli-Y gate\n`;
            break;
          case 'Z':
            const zQubit = getValidQubitIndex(gate.qubit);
            python += `qc.z(${zQubit})  # Pauli-Z gate\n`;
            break;
          case 'CNOT':
            const cnotQubits = getValidQubitIndices(gate.qubits);
            python += `qc.cx(${cnotQubits[0]}, ${cnotQubits[1]})  # CNOT gate\n`;
            break;
          case 'CZ':
            const czQubits = getValidQubitIndices(gate.qubits);
            python += `qc.cz(${czQubits[0]}, ${czQubits[1]})  # CZ gate\n`;
            break;
          case 'RX':
            const rxQubit = getValidQubitIndex(gate.qubit);
            const rxAngle = gate.angle || Math.PI / 2;
            python += `qc.rx(${rxAngle}, ${rxQubit})  # RX rotation\n`;
            break;
          case 'RY':
            const ryQubit = getValidQubitIndex(gate.qubit);
            const ryAngle = gate.angle || Math.PI / 2;
            python += `qc.ry(${ryAngle}, ${ryQubit})  # RY rotation\n`;
            break;
          case 'RZ':
            const rzQubit = getValidQubitIndex(gate.qubit);
            const rzAngle = gate.angle || Math.PI / 2;
            python += `qc.rz(${rzAngle}, ${rzQubit})  # RZ rotation\n`;
            break;
          case 'S':
            const sQubit = getValidQubitIndex(gate.qubit);
            python += `qc.s(${sQubit})  # S gate\n`;
            break;
          case 'T':
            const tQubit = getValidQubitIndex(gate.qubit);
            python += `qc.t(${tQubit})  # T gate\n`;
            break;
          case 'M':
            const mQubit = getValidQubitIndex(gate.qubit);
            python += `qc.measure(${mQubit}, ${mQubit})  # Measurement\n`;
            break;
          default:
            console.warn(`Unsupported gate type for Python export: ${gate.type}`);
        }
      });
      
      python += `\n# Execute the circuit\n`;
      python += `backend = Aer.get_backend('qasm_simulator')\n`;
      python += `job = execute(qc, backend, shots=1024)\n`;
      python += `result = job.result()\n`;
      python += `counts = result.get_counts(qc)\n\n`;
      python += `# Display results\n`;
      python += `print("Measurement results:")\n`;
      python += `print(counts)\n\n`;
      python += `# Uncomment to visualize\n`;
      python += `# plot_histogram(counts)\n`;
      python += `# print(qc.draw())\n`;
      
      const blob = new Blob([python], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${options.projectName}.py`;
      a.click();
      URL.revokeObjectURL(url);
      trackEvent('circuit_exported', { format: 'python' as any, gateCount: circuit.length });
      toast({ title: "Python exported successfully!" });
    } catch (error) {
      toast({ title: "Export failed", description: String(error), variant: "destructive" });
    }
  };

  return {
    handleExportJSON,
    handleExportQASM,
    handleExportPython
  };
}
