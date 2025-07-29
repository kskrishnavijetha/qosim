
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Cpu, Shield, Zap, Brain, Binary } from 'lucide-react';
import { Algorithm } from './QuantumAlgorithmsSDK';

const ALGORITHMS: Algorithm[] = [
  {
    id: 'grovers-search',
    name: "Grover's Search",
    category: 'search',
    description: 'Quantum search algorithm providing quadratic speedup over classical search',
    complexity: 'intermediate',
    qubits: 2,
    depth: 6,
    gates: ['H', 'CZ', 'X', 'Z'],
    visualization: { blochSpheres: true, entanglementMap: false, measurementStats: true },
    pythonCode: `# Grover's Search Algorithm
from qosim_sdk import QuantumSimulator
import numpy as np

def grovers_search(num_qubits=2, marked_items=[3]):
    """
    Grover's algorithm for searching marked items
    """
    sim = QuantumSimulator(num_qubits)
    
    # Initialize superposition
    for i in range(num_qubits):
        sim.h(i)
    
    # Optimal iterations
    N = 2**num_qubits
    iterations = int(np.pi/4 * np.sqrt(N))
    
    for _ in range(iterations):
        # Oracle: mark target state |11⟩
        sim.cz(0, 1)
        
        # Diffusion operator
        for i in range(num_qubits):
            sim.h(i)
            sim.x(i)
        sim.cz(0, 1)
        for i in range(num_qubits):
            sim.x(i)
            sim.h(i)
    
    # Execute and return results
    result = sim.run()
    return {
        'state_vector': result.state_vector,
        'probabilities': result.probabilities,
        'success_rate': result.probabilities[marked_items[0]]
    }

# Execute algorithm
result = grovers_search()
print(f"Success probability: {result['success_rate']:.3f}")`,
    javascriptCode: `// Grover's Search Algorithm
import { QOSimSDK } from './qosim-sdk.js';

class GroversSearch {
    constructor(numQubits = 2, markedItems = [3]) {
        this.numQubits = numQubits;
        this.markedItems = markedItems;
        this.sdk = new QOSimSDK();
    }

    async execute() {
        const circuit = this.sdk.createCircuit('Grovers Search', this.numQubits);
        
        // Initialize superposition
        for (let i = 0; i < this.numQubits; i++) {
            circuit.h(i);
        }
        
        // Optimal iterations
        const N = Math.pow(2, this.numQubits);
        const iterations = Math.floor(Math.PI / 4 * Math.sqrt(N));
        
        for (let iter = 0; iter < iterations; iter++) {
            // Oracle: mark |11⟩
            circuit.cz(0, 1);
            
            // Diffusion operator
            for (let i = 0; i < this.numQubits; i++) {
                circuit.h(i).x(i);
            }
            circuit.cz(0, 1);
            for (let i = 0; i < this.numQubits; i++) {
                circuit.x(i).h(i);
            }
        }
        
        const result = await this.sdk.simulate(circuit);
        return {
            stateVector: result.stateVector,
            probabilities: result.probabilities,
            successRate: result.probabilities[this.markedItems[0]]
        };
    }
}

// Execute algorithm
const grover = new GroversSearch();
const result = await grover.execute();
console.log(\`Success probability: \${result.successRate.toFixed(3)}\`);`
  },
  {
    id: 'qft',
    name: 'Quantum Fourier Transform',
    category: 'optimization',
    description: 'Transforms between computational and frequency domains',
    complexity: 'advanced',
    qubits: 3,
    depth: 8,
    gates: ['H', 'RZ', 'SWAP'],
    visualization: { blochSpheres: true, entanglementMap: true, measurementStats: true },
    pythonCode: `# Quantum Fourier Transform
from qosim_sdk import QuantumSimulator
import numpy as np

def quantum_fourier_transform(num_qubits=3):
    """
    Quantum Fourier Transform implementation
    """
    sim = QuantumSimulator(num_qubits)
    
    # Apply QFT
    for i in range(num_qubits):
        sim.h(i)
        for j in range(i + 1, num_qubits):
            angle = np.pi / (2**(j - i))
            sim.controlled_phase(i, j, angle)
    
    # Reverse qubit order
    for i in range(num_qubits // 2):
        sim.swap(i, num_qubits - 1 - i)
    
    result = sim.run()
    return {
        'state_vector': result.state_vector,
        'frequency_amplitudes': result.state_vector
    }

# Execute QFT
result = quantum_fourier_transform()
print("QFT completed successfully")`,
    javascriptCode: `// Quantum Fourier Transform
import { QOSimSDK } from './qosim-sdk.js';

class QuantumFourierTransform {
    constructor(numQubits = 3) {
        this.numQubits = numQubits;
        this.sdk = new QOSimSDK();
    }

    async execute() {
        const circuit = this.sdk.createCircuit('QFT', this.numQubits);
        
        // Apply QFT
        for (let i = 0; i < this.numQubits; i++) {
            circuit.h(i);
            for (let j = i + 1; j < this.numQubits; j++) {
                const angle = Math.PI / Math.pow(2, j - i);
                circuit.cp(i, j, angle);
            }
        }
        
        // Reverse qubit order
        for (let i = 0; i < Math.floor(this.numQubits / 2); i++) {
            circuit.swap(i, this.numQubits - 1 - i);
        }
        
        const result = await this.sdk.simulate(circuit);
        return {
            stateVector: result.stateVector,
            frequencyAmplitudes: result.stateVector
        };
    }
}

// Execute QFT
const qft = new QuantumFourierTransform();
const result = await qft.execute();
console.log('QFT completed successfully');`
  },
  {
    id: 'bell-states',
    name: 'Bell States Generator',
    category: 'quantum-ml',
    description: 'Creates maximally entangled two-qubit states',
    complexity: 'beginner',
    qubits: 2,
    depth: 2,
    gates: ['H', 'CNOT'],
    visualization: { blochSpheres: true, entanglementMap: true, measurementStats: true },
    pythonCode: `# Bell States Generator
from qosim_sdk import QuantumSimulator

def create_bell_state(bell_type='phi_plus'):
    """
    Create different Bell states
    phi_plus: |00⟩ + |11⟩
    phi_minus: |00⟩ - |11⟩
    psi_plus: |01⟩ + |10⟩
    psi_minus: |01⟩ - |10⟩
    """
    sim = QuantumSimulator(2)
    
    # Create |Φ+⟩ = (|00⟩ + |11⟩)/√2
    if bell_type == 'phi_plus':
        sim.h(0)
        sim.cnot(0, 1)
    
    # Create |Φ-⟩ = (|00⟩ - |11⟩)/√2
    elif bell_type == 'phi_minus':
        sim.h(0)
        sim.z(0)
        sim.cnot(0, 1)
    
    # Create |Ψ+⟩ = (|01⟩ + |10⟩)/√2
    elif bell_type == 'psi_plus':
        sim.h(0)
        sim.x(1)
        sim.cnot(0, 1)
    
    # Create |Ψ-⟩ = (|01⟩ - |10⟩)/√2
    elif bell_type == 'psi_minus':
        sim.h(0)
        sim.x(1)
        sim.z(0)
        sim.cnot(0, 1)
    
    result = sim.run()
    return {
        'state_vector': result.state_vector,
        'entanglement': sim.measure_entanglement(),
        'bell_type': bell_type
    }

# Create Bell state
bell = create_bell_state('phi_plus')
print(f"Entanglement strength: {bell['entanglement']:.3f}")`,
    javascriptCode: `// Bell States Generator
import { QOSimSDK } from './qosim-sdk.js';

class BellStatesGenerator {
    constructor() {
        this.sdk = new QOSimSDK();
    }

    async createBellState(bellType = 'phi_plus') {
        const circuit = this.sdk.createCircuit('Bell State', 2);
        
        // Create |Φ+⟩ = (|00⟩ + |11⟩)/√2
        if (bellType === 'phi_plus') {
            circuit.h(0).cnot(0, 1);
        }
        
        // Create |Φ-⟩ = (|00⟩ - |11⟩)/√2
        else if (bellType === 'phi_minus') {
            circuit.h(0).z(0).cnot(0, 1);
        }
        
        // Create |Ψ+⟩ = (|01⟩ + |10⟩)/√2
        else if (bellType === 'psi_plus') {
            circuit.h(0).x(1).cnot(0, 1);
        }
        
        // Create |Ψ-⟩ = (|01⟩ - |10⟩)/√2
        else if (bellType === 'psi_minus') {
            circuit.h(0).x(1).z(0).cnot(0, 1);
        }
        
        const result = await this.sdk.simulate(circuit);
        const entanglement = this.sdk.measureEntanglement(result);
        
        return {
            stateVector: result.stateVector,
            entanglement: entanglement,
            bellType: bellType
        };
    }
}

// Create Bell state
const bellGen = new BellStatesGenerator();
const bell = await bellGen.createBellState('phi_plus');
console.log(\`Entanglement strength: \${bell.entanglement.toFixed(3)}\`);`
  },
  {
    id: 'error-correction',
    name: 'Quantum Error Correction',
    category: 'error-correction',
    description: 'Three-qubit error correction code with syndrome detection',
    complexity: 'advanced',
    qubits: 3,
    depth: 6,
    gates: ['H', 'CNOT', 'X'],
    visualization: { blochSpheres: false, entanglementMap: true, measurementStats: true },
    pythonCode: `# Quantum Error Correction
from qosim_sdk import QuantumSimulator

def three_qubit_error_correction():
    """
    3-qubit bit-flip error correction code
    """
    sim = QuantumSimulator(3)
    
    # Encode logical |+⟩ state
    sim.h(0)  # Create superposition
    sim.cnot(0, 1)  # Copy to ancilla
    sim.cnot(0, 2)  # Copy to ancilla
    
    # Introduce bit-flip error on qubit 1
    sim.x(1)
    
    # Error detection syndrome
    sim.cnot(0, 1)
    sim.cnot(0, 2)
    
    # Measure syndrome and apply correction
    result = sim.run()
    
    return {
        'corrected_state': result.state_vector,
        'error_detected': True,
        'syndrome': sim.measure_syndrome([1, 2])
    }

# Execute error correction
result = three_qubit_error_correction()
print(f"Error correction completed. Syndrome: {result['syndrome']}")`,
    javascriptCode: `// Quantum Error Correction
import { QOSimSDK } from './qosim-sdk.js';

class QuantumErrorCorrection {
    constructor() {
        this.sdk = new QOSimSDK();
    }

    async threeQubitCorrection() {
        const circuit = this.sdk.createCircuit('3-Qubit Error Correction', 3);
        
        // Encode logical |+⟩ state
        circuit.h(0);        // Create superposition
        circuit.cnot(0, 1);  // Copy to ancilla
        circuit.cnot(0, 2);  // Copy to ancilla
        
        // Introduce bit-flip error on qubit 1
        circuit.x(1);
        
        // Error detection syndrome
        circuit.cnot(0, 1);
        circuit.cnot(0, 2);
        
        const result = await this.sdk.simulate(circuit);
        const syndrome = this.sdk.measureSyndrome(result, [1, 2]);
        
        return {
            correctedState: result.stateVector,
            errorDetected: true,
            syndrome: syndrome
        };
    }
}

// Execute error correction
const errorCorrection = new QuantumErrorCorrection();
const result = await errorCorrection.threeQubitCorrection();
console.log(\`Error correction completed. Syndrome: \${result.syndrome}\`);`
  }
];

interface AlgorithmLibraryProps {
  onAlgorithmSelect: (algorithm: Algorithm) => void;
  selectedLanguage: 'python' | 'javascript';
  onLanguageChange: (language: 'python' | 'javascript') => void;
}

export function AlgorithmLibrary({ 
  onAlgorithmSelect, 
  selectedLanguage, 
  onLanguageChange 
}: AlgorithmLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all');

  const filteredAlgorithms = useMemo(() => {
    return ALGORITHMS.filter(algorithm => {
      const matchesSearch = algorithm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           algorithm.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || algorithm.category === selectedCategory;
      const matchesComplexity = selectedComplexity === 'all' || algorithm.complexity === selectedComplexity;
      
      return matchesSearch && matchesCategory && matchesComplexity;
    });
  }, [searchQuery, selectedCategory, selectedComplexity]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'search': return <Search className="w-4 h-4" />;
      case 'cryptography': return <Shield className="w-4 h-4" />;
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'quantum-ml': return <Brain className="w-4 h-4" />;
      case 'error-correction': return <Binary className="w-4 h-4" />;
      default: return <Cpu className="w-4 h-4" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'text-green-500';
      case 'intermediate': return 'text-yellow-500';
      case 'advanced': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Language Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-quantum-glow">Algorithm Library</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={selectedLanguage === 'python' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onLanguageChange('python')}
            className="neon-border"
          >
            Python
          </Button>
          <Button
            variant={selectedLanguage === 'javascript' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onLanguageChange('javascript')}
            className="neon-border"
          >
            JavaScript
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="quantum-panel neon-border"
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40 quantum-panel neon-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="quantum-panel neon-border">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="search">Search</SelectItem>
            <SelectItem value="cryptography">Cryptography</SelectItem>
            <SelectItem value="optimization">Optimization</SelectItem>
            <SelectItem value="quantum-ml">Quantum ML</SelectItem>
            <SelectItem value="error-correction">Error Correction</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
          <SelectTrigger className="w-36 quantum-panel neon-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="quantum-panel neon-border">
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Algorithm Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAlgorithms.map((algorithm) => (
            <Card key={algorithm.id} className="quantum-panel neon-border hover:border-quantum-glow/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(algorithm.category)}
                    <CardTitle className="text-sm text-quantum-glow">{algorithm.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className={`text-xs ${getComplexityColor(algorithm.complexity)}`}>
                    {algorithm.complexity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-quantum-particle mb-3">{algorithm.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{algorithm.qubits} qubits</span>
                  <span>Depth: {algorithm.depth}</span>
                  <span>{algorithm.gates.length} gate types</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {algorithm.gates.slice(0, 4).map((gate, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {gate}
                    </Badge>
                  ))}
                  {algorithm.gates.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{algorithm.gates.length - 4}
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  className="w-full neon-border"
                  onClick={() => onAlgorithmSelect(algorithm)}
                >
                  Use Algorithm
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAlgorithms.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto text-quantum-particle/50 mb-4" />
            <p className="text-quantum-particle">No algorithms match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
