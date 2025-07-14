"""
QOSim Python SDK
A quantum circuit simulation library for Python

Installation:
    pip install numpy

Usage:
    from qosim_sdk import QOSimulator, QuantumGate
    
    # Create a 3-qubit simulator
    sim = QOSimulator(3)
    
    # Add gates
    sim.h(0)  # Hadamard on qubit 0
    sim.cnot(0, 1)  # CNOT with control=0, target=1
    sim.x(2)  # Pauli-X on qubit 2
    
    # Run simulation
    result = sim.run()
    print(f"State vector: {result['state_vector']}")
    print(f"Probabilities: {result['probabilities']}")
"""

import numpy as np
import cmath
import json
from typing import List, Dict, Any, Optional, Tuple


class Complex:
    """Complex number representation"""
    
    def __init__(self, real: float, imag: float = 0):
        self.real = real
        self.imag = imag
    
    def __add__(self, other):
        if isinstance(other, Complex):
            return Complex(self.real + other.real, self.imag + other.imag)
        return Complex(self.real + other, self.imag)
    
    def __mul__(self, other):
        if isinstance(other, Complex):
            return Complex(
                self.real * other.real - self.imag * other.imag,
                self.real * other.imag + self.imag * other.real
            )
        return Complex(self.real * other, self.imag * other)
    
    def __abs__(self):
        return (self.real ** 2 + self.imag ** 2) ** 0.5
    
    def conjugate(self):
        return Complex(self.real, -self.imag)
    
    def to_dict(self):
        return {"real": self.real, "imag": self.imag}
    
    def __repr__(self):
        if self.imag >= 0:
            return f"{self.real:.4f}+{self.imag:.4f}i"
        return f"{self.real:.4f}{self.imag:.4f}i"


class QuantumGate:
    """Quantum gate representation"""
    
    def __init__(self, gate_type: str, qubits: List[int], angle: float = 0, position: int = 0):
        self.type = gate_type
        self.qubits = qubits
        self.angle = angle
        self.position = position
        self.id = f"{gate_type}_{position}_{hash(tuple(qubits))}"


class QOSimulator:
    """Quantum circuit simulator"""
    
    def __init__(self, num_qubits: int = 3):
        if num_qubits < 1 or num_qubits > 20:
            raise ValueError("Number of qubits must be between 1 and 20")
        
        self.num_qubits = num_qubits
        self.gates = []
        self.position = 0
        self.reset()
    
    def reset(self, num_qubits: Optional[int] = None):
        """Reset the simulator to initial state"""
        if num_qubits is not None:
            if num_qubits < 1 or num_qubits > 20:
                raise ValueError("Number of qubits must be between 1 and 20")
            self.num_qubits = num_qubits
        
        # Initialize |00...0⟩ state
        state_size = 2 ** self.num_qubits
        self.state_vector = np.zeros(state_size, dtype=complex)
        self.state_vector[0] = 1.0
        self.gates = []
        self.position = 0
    
    def _get_gate_matrix(self, gate_type: str, angle: float = 0) -> np.ndarray:
        """Get the matrix representation of a quantum gate"""
        if gate_type == 'I':
            return np.array([[1, 0], [0, 1]], dtype=complex)
        elif gate_type == 'X':
            return np.array([[0, 1], [1, 0]], dtype=complex)
        elif gate_type == 'Y':
            return np.array([[0, -1j], [1j, 0]], dtype=complex)
        elif gate_type == 'Z':
            return np.array([[1, 0], [0, -1]], dtype=complex)
        elif gate_type == 'H':
            return np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
        elif gate_type == 'RX':
            c, s = np.cos(angle/2), np.sin(angle/2)
            return np.array([[c, -1j*s], [-1j*s, c]], dtype=complex)
        elif gate_type == 'RY':
            c, s = np.cos(angle/2), np.sin(angle/2)
            return np.array([[c, -s], [s, c]], dtype=complex)
        elif gate_type == 'RZ':
            return np.array([[np.exp(-1j*angle/2), 0], [0, np.exp(1j*angle/2)]], dtype=complex)
        elif gate_type == 'T':
            return np.array([[1, 0], [0, np.exp(1j*np.pi/4)]], dtype=complex)
        elif gate_type == 'S':
            return np.array([[1, 0], [0, 1j]], dtype=complex)
        else:
            raise ValueError(f"Unknown gate type: {gate_type}")
    
    def _apply_single_qubit_gate(self, gate_matrix: np.ndarray, qubit: int):
        """Apply a single-qubit gate to the state vector"""
        n = self.num_qubits
        
        # Create the full gate matrix using tensor products
        full_matrix = 1
        for i in range(n):
            if i == qubit:
                if full_matrix == 1:
                    full_matrix = gate_matrix
                else:
                    full_matrix = np.kron(full_matrix, gate_matrix)
            else:
                identity = np.eye(2, dtype=complex)
                if full_matrix == 1:
                    full_matrix = identity
                else:
                    full_matrix = np.kron(full_matrix, identity)
        
        # Apply the gate
        self.state_vector = full_matrix @ self.state_vector
    
    def _apply_cnot(self, control: int, target: int):
        """Apply a CNOT gate"""
        n = self.num_qubits
        state_size = 2 ** n
        new_state = np.zeros(state_size, dtype=complex)
        
        for i in range(state_size):
            # Check if control qubit is 1
            if (i >> (n - 1 - control)) & 1:
                # Flip target qubit
                new_i = i ^ (1 << (n - 1 - target))
                new_state[new_i] = self.state_vector[i]
            else:
                # Keep the same
                new_state[i] = self.state_vector[i]
        
        self.state_vector = new_state
    
    def _add_gate(self, gate_type: str, qubits: List[int], angle: float = 0):
        """Add a gate to the circuit"""
        gate = QuantumGate(gate_type, qubits, angle, self.position)
        self.gates.append(gate)
        self.position += 1
        return self
    
    # Single-qubit gates
    def i(self, qubit: int):
        """Identity gate"""
        return self._add_gate('I', [qubit])
    
    def x(self, qubit: int):
        """Pauli-X gate"""
        return self._add_gate('X', [qubit])
    
    def y(self, qubit: int):
        """Pauli-Y gate"""
        return self._add_gate('Y', [qubit])
    
    def z(self, qubit: int):
        """Pauli-Z gate"""
        return self._add_gate('Z', [qubit])
    
    def h(self, qubit: int):
        """Hadamard gate"""
        return self._add_gate('H', [qubit])
    
    def t(self, qubit: int):
        """T gate"""
        return self._add_gate('T', [qubit])
    
    def s(self, qubit: int):
        """S gate"""
        return self._add_gate('S', [qubit])
    
    def rx(self, qubit: int, angle: float):
        """Rotation around X-axis"""
        return self._add_gate('RX', [qubit], angle)
    
    def ry(self, qubit: int, angle: float):
        """Rotation around Y-axis"""
        return self._add_gate('RY', [qubit], angle)
    
    def rz(self, qubit: int, angle: float):
        """Rotation around Z-axis"""
        return self._add_gate('RZ', [qubit], angle)
    
    # Two-qubit gates
    def cnot(self, control: int, target: int):
        """CNOT gate"""
        return self._add_gate('CNOT', [control, target])
    
    def cx(self, control: int, target: int):
        """Alias for CNOT"""
        return self.cnot(control, target)
    
    def run(self) -> Dict[str, Any]:
        """Execute the quantum circuit and return results"""
        # Reset state vector
        state_size = 2 ** self.num_qubits
        self.state_vector = np.zeros(state_size, dtype=complex)
        self.state_vector[0] = 1.0
        
        # Apply gates in order
        for gate in self.gates:
            if gate.type == 'CNOT':
                self._apply_cnot(gate.qubits[0], gate.qubits[1])
            else:
                matrix = self._get_gate_matrix(gate.type, gate.angle)
                self._apply_single_qubit_gate(matrix, gate.qubits[0])
        
        # Calculate probabilities
        probabilities = np.abs(self.state_vector) ** 2
        
        # Convert to readable format
        state_vector_dict = [
            {"real": float(amp.real), "imag": float(amp.imag)} 
            for amp in self.state_vector
        ]
        
        return {
            "state_vector": state_vector_dict,
            "probabilities": probabilities.tolist(),
            "num_qubits": self.num_qubits,
            "num_gates": len(self.gates)
        }
    
    def measure(self, qubit: Optional[int] = None) -> Dict[str, Any]:
        """Measure qubit(s) and return results"""
        result = self.run()
        
        if qubit is not None:
            # Measure specific qubit
            prob_0 = sum(p for i, p in enumerate(result["probabilities"]) 
                        if not (i >> (self.num_qubits - 1 - qubit)) & 1)
            prob_1 = 1 - prob_0
            return {
                "qubit": qubit,
                "probabilities": {"0": prob_0, "1": prob_1},
                "measurement": "0" if np.random.random() < prob_0 else "1"
            }
        else:
            # Measure all qubits
            measurements = []
            for q in range(self.num_qubits):
                prob_0 = sum(p for i, p in enumerate(result["probabilities"]) 
                           if not (i >> (self.num_qubits - 1 - q)) & 1)
                prob_1 = 1 - prob_0
                measurement = "0" if np.random.random() < prob_0 else "1"
                measurements.append({
                    "qubit": q,
                    "probabilities": {"0": prob_0, "1": prob_1},
                    "measurement": measurement
                })
            return {"measurements": measurements}
    
    def get_circuit_info(self) -> Dict[str, Any]:
        """Get information about the current circuit"""
        return {
            "num_qubits": self.num_qubits,
            "num_gates": len(self.gates),
            "gates": [
                {
                    "type": gate.type,
                    "qubits": gate.qubits,
                    "angle": gate.angle,
                    "position": gate.position
                }
                for gate in self.gates
            ]
        }
    
    def export_qasm(self) -> str:
        """Export circuit as OpenQASM 2.0"""
        qasm = f"OPENQASM 2.0;\ninclude \"qelib1.inc\";\n"
        qasm += f"qreg q[{self.num_qubits}];\n"
        qasm += f"creg c[{self.num_qubits}];\n\n"
        
        for gate in self.gates:
            if gate.type == 'H':
                qasm += f"h q[{gate.qubits[0]}];\n"
            elif gate.type == 'X':
                qasm += f"x q[{gate.qubits[0]}];\n"
            elif gate.type == 'Y':
                qasm += f"y q[{gate.qubits[0]}];\n"
            elif gate.type == 'Z':
                qasm += f"z q[{gate.qubits[0]}];\n"
            elif gate.type == 'CNOT':
                qasm += f"cx q[{gate.qubits[0]}],q[{gate.qubits[1]}];\n"
            elif gate.type == 'RX':
                qasm += f"rx({gate.angle}) q[{gate.qubits[0]}];\n"
            elif gate.type == 'RY':
                qasm += f"ry({gate.angle}) q[{gate.qubits[0]}];\n"
            elif gate.type == 'RZ':
                qasm += f"rz({gate.angle}) q[{gate.qubits[0]}];\n"
            elif gate.type == 'T':
                qasm += f"t q[{gate.qubits[0]}];\n"
            elif gate.type == 'S':
                qasm += f"s q[{gate.qubits[0]}];\n"
        
        qasm += f"\nmeasure q -> c;\n"
        return qasm
    
    def export_qiskit(self) -> str:
        """Export circuit as Qiskit Python code"""
        code = "from qiskit import QuantumCircuit, execute, Aer\n"
        code += "from qiskit.visualization import plot_histogram\n\n"
        code += f"# Create quantum circuit with {self.num_qubits} qubits\n"
        code += f"qc = QuantumCircuit({self.num_qubits}, {self.num_qubits})\n\n"
        
        for gate in self.gates:
            if gate.type == 'H':
                code += f"qc.h({gate.qubits[0]})\n"
            elif gate.type == 'X':
                code += f"qc.x({gate.qubits[0]})\n"
            elif gate.type == 'Y':
                code += f"qc.y({gate.qubits[0]})\n"
            elif gate.type == 'Z':
                code += f"qc.z({gate.qubits[0]})\n"
            elif gate.type == 'CNOT':
                code += f"qc.cx({gate.qubits[0]}, {gate.qubits[1]})\n"
            elif gate.type == 'RX':
                code += f"qc.rx({gate.angle}, {gate.qubits[0]})\n"
            elif gate.type == 'RY':
                code += f"qc.ry({gate.angle}, {gate.qubits[0]})\n"
            elif gate.type == 'RZ':
                code += f"qc.rz({gate.angle}, {gate.qubits[0]})\n"
            elif gate.type == 'T':
                code += f"qc.t({gate.qubits[0]})\n"
            elif gate.type == 'S':
                code += f"qc.s({gate.qubits[0]})\n"
        
        code += "\n# Add measurements\n"
        code += f"qc.measure_all()\n\n"
        code += "# Execute on simulator\n"
        code += "backend = Aer.get_backend('qasm_simulator')\n"
        code += "job = execute(qc, backend, shots=1024)\n"
        code += "result = job.result()\n"
        code += "counts = result.get_counts()\n\n"
        code += "# Display results\n"
        code += "print(counts)\n"
        code += "plot_histogram(counts)\n"
        
        return code


# Example usage and factory functions
def bell_state() -> QOSimulator:
    """Create a Bell state circuit"""
    sim = QOSimulator(2)
    sim.h(0).cnot(0, 1)
    return sim


def grover_2qubit() -> QOSimulator:
    """Create a 2-qubit Grover's algorithm circuit"""
    sim = QOSimulator(2)
    # Initialize superposition
    sim.h(0).h(1)
    # Oracle (assuming we're searching for |11⟩)
    sim.z(0).z(1).cnot(0, 1).z(1).cnot(0, 1)
    # Diffusion operator
    sim.h(0).h(1).z(0).z(1).cnot(0, 1).z(1).cnot(0, 1).h(0).h(1)
    return sim


def quantum_fourier_transform(n_qubits: int = 3) -> QOSimulator:
    """Create a Quantum Fourier Transform circuit"""
    sim = QOSimulator(n_qubits)
    
    for i in range(n_qubits):
        sim.h(i)
        for j in range(i + 1, n_qubits):
            angle = np.pi / (2 ** (j - i))
            # Controlled phase rotation (simplified)
            sim.rz(j, angle)
    
    return sim


if __name__ == "__main__":
    # Example usage
    print("QOSim Python SDK Example")
    print("=" * 40)
    
    # Create a Bell state
    sim = bell_state()
    result = sim.run()
    
    print("Bell State Circuit:")
    print(f"Qubits: {result['num_qubits']}")
    print(f"Gates: {result['num_gates']}")
    print(f"Probabilities: {result['probabilities']}")
    
    # Export examples
    print("\nQASM Export:")
    print(sim.export_qasm())
    
    print("\nQiskit Export:")
    print(sim.export_qiskit())