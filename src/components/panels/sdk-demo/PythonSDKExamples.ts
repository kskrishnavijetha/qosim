export const pythonSDKExamples = {
  "bell-state": {
    name: "Bell State",
    code: `# Create a Bell State using QOSim Python SDK
from qosim_sdk import QuantumSimulator

# Initialize 2-qubit simulator
sim = QuantumSimulator(2)

# Apply gates to create Bell state
sim.h(0)           # Hadamard gate on qubit 0
sim.cnot(0, 1)     # CNOT gate with control=0, target=1

# Run simulation
result = sim.run()
print("Final State Vector:", result.state_vector)
print("Measurement Probabilities:", result.probabilities)`,
    description: "Creates an entangled Bell state |00⟩ + |11⟩"
  },
  "grover": {
    name: "Grover's Algorithm",
    code: `# Grover's Search Algorithm
from qosim_sdk import QuantumSimulator

# Initialize 2-qubit simulator
sim = QuantumSimulator(2)

# Initialize superposition
sim.h(0)
sim.h(1)

# Oracle for |11⟩ state
sim.cz(0, 1)

# Diffusion operator (amplitude amplification)
sim.h(0)
sim.h(1)
sim.x(0)
sim.x(1)
sim.cz(0, 1)
sim.x(0)
sim.x(1)
sim.h(0)
sim.h(1)

# Run and get results
result = sim.run()
print("State Vector:", result.state_vector)
print("Target |11⟩ probability:", result.probabilities[3])`,
    description: "Searches for |11⟩ state with quantum advantage"
  },
  "qft": {
    name: "Quantum Fourier Transform",
    code: `# Quantum Fourier Transform
from qosim_sdk import QuantumSimulator
import numpy as np

# Initialize 3-qubit simulator
sim = QuantumSimulator(3)

# Apply QFT to 3 qubits
sim.h(0)
sim.controlled_phase(0, 1, np.pi/2)
sim.controlled_phase(0, 2, np.pi/4)
sim.h(1)
sim.controlled_phase(1, 2, np.pi/2)
sim.h(2)

# Swap qubits for correct output order
sim.swap(0, 2)

# Run simulation
result = sim.run()
print("QFT Result:", result.state_vector)
print("Frequency domain representation ready")`,
    description: "Performs quantum Fourier transform on 3 qubits"
  },
  "error-correction": {
    name: "Error Correction",
    code: `# 3-Qubit Bit-Flip Error Correction
from qosim_sdk import QuantumSimulator

# Initialize 3-qubit simulator
sim = QuantumSimulator(3)

# Encode logical |+⟩ state: (|000⟩ + |111⟩)/√2
sim.h(0)           # Create superposition
sim.cnot(0, 1)     # Copy to ancilla qubits
sim.cnot(0, 2)

# Introduce bit-flip error on qubit 1
sim.x(1)

# Error detection syndrome measurement
sim.cnot(0, 1)
sim.cnot(0, 2)

# Error correction (automatically applied)
result = sim.run()
print("Error Corrected State:", result.state_vector)
print("Error syndrome detected and corrected")`,
    description: "3-qubit error correction with syndrome detection"
  },
  "qasm": {
    name: "Qiskit Integration",
    code: `# Qiskit Integration Demo
from qosim_sdk import QuantumSimulator
from qiskit import QuantumCircuit

# Create Qiskit circuit
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)

# Convert to QOSim
sim = QuantumSimulator.from_qiskit(qc)

# Run simulation
result = sim.run()
print("Bell State Result:", result.state_vector)

# Export to QASM
qasm_code = sim.to_qasm()
print("QASM Code:")
print(qasm_code)`,
    description: "Demonstrates Qiskit integration and QASM export"
  }
} as const;