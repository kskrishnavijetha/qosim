import { useState } from "react";
import { 
  FileText, 
  Download, 
  Edit, 
  Code,
  File,
  Database,
  Cpu,
  Folder
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { QuantumFile } from "@/hooks/useQuantumFiles";

interface FileViewerProps {
  file: QuantumFile;
  onClose: () => void;
}

export function FileViewer({ file, onClose }: FileViewerProps) {
  const [activeTab, setActiveTab] = useState("content");

  console.log('FileViewer rendering with file:', file?.name);

  if (!file) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <FileText className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-lg font-medium">No file selected</p>
          <p className="text-sm text-muted-foreground">Select a file to view its contents</p>
        </div>
      </div>
    );
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "circuit":
      case "qasm":
        return <Code className="w-5 h-5 text-blue-500" />;
      case "algorithm":
        return <Cpu className="w-5 h-5 text-green-500" />;
      case "model":
        return <Database className="w-5 h-5 text-purple-500" />;
      case "folder":
        return <Folder className="w-5 h-5 text-yellow-500" />;
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const getFileContent = (file: QuantumFile) => {
    // If file has contentData, use it
    if (file.contentData) {
      return typeof file.contentData === 'string' ? file.contentData : JSON.stringify(file.contentData, null, 2);
    }

    // Otherwise generate sample content based on type
    switch (file.type) {
      case "circuit":
        return `OPENQASM 2.0;
include "qelib1.inc";

qreg q[2];
creg c[2];

// Bell state preparation
h q[0];
cx q[0],q[1];

// Measurement
measure q -> c;`;

      case "algorithm":
        return `# Grover's Search Algorithm
def grover_search(oracle, n_qubits):
    """
    Implementation of Grover's quantum search algorithm
    """
    circuit = QuantumCircuit(n_qubits)
    
    # Initialize superposition
    for qubit in range(n_qubits):
        circuit.h(qubit)
    
    # Apply Grover iterations
    iterations = int(np.pi/4 * np.sqrt(2**n_qubits))
    for _ in range(iterations):
        # Apply oracle
        oracle(circuit)
        
        # Apply diffusion operator
        diffusion_operator(circuit)
    
    return circuit`;

      case "data":
        return `{
  "experiment": "Bell State Measurement",
  "results": [
    {"state": "00", "count": 512, "probability": 0.512},
    {"state": "11", "count": 488, "probability": 0.488}
  ],
  "total_shots": 1000,
  "fidelity": 0.987,
  "execution_time": "0.245s",
  "backend": "qasm_simulator"
}`;

      case "model":
        return `# Quantum Neural Network Model Definition
# Architecture: Variational Quantum Classifier
# Framework: PennyLane

import pennylane as qml
import numpy as np

# Model parameters
n_qubits = 4
n_layers = 3
n_features = 4

# Quantum device
dev = qml.device('default.qubit', wires=n_qubits)

@qml.qnode(dev)
def quantum_neural_network(inputs, weights):
    # Feature encoding
    for i in range(n_features):
        qml.RY(inputs[i], wires=i)
    
    # Variational layers
    for layer in range(n_layers):
        for qubit in range(n_qubits):
            qml.RY(weights[layer, qubit, 0], wires=qubit)
            qml.RZ(weights[layer, qubit, 1], wires=qubit)
        
        # Entangling gates
        for qubit in range(n_qubits-1):
            qml.CNOT(wires=[qubit, qubit+1])
    
    return qml.expval(qml.PauliZ(0))`;

      default:
        return `File: ${file.name}
Type: ${file.type.toUpperCase()}
Size: ${file.sizeDisplay}
Created: ${file.createdAt.toLocaleString()}
Modified: ${file.updatedAt.toLocaleString()}

Superposition State: ${file.superposition ? 'Active' : 'Collapsed'}
Favorite: ${file.favorite ? 'Yes' : 'No'}
Tags: ${file.tags.join(', ') || 'None'}
Version: ${file.lastVersion} (${file.versions} total versions)`;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          {getFileIcon(file.type)}
          <div>
            <h3 className="text-xl font-semibold">{file.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{file.type.toUpperCase()}</Badge>
              <span className="text-sm text-muted-foreground">{file.sizeDisplay}</span>
              {file.superposition && (
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Superposition
                </Badge>
              )}
              {file.favorite && (
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  ★ Favorite
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="flex-1 overflow-auto">
            <Card className="h-full">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col">
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      {getFileIcon(file.type)}
                      {file.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {file.type === "circuit" && "Quantum Circuit Definition - OpenQASM Format"}
                      {file.type === "algorithm" && "Quantum Algorithm Implementation - Python"}
                      {file.type === "data" && "Simulation Results Data - JSON Format"}
                      {file.type === "model" && "Quantum Machine Learning Model - PennyLane"}
                      {file.type === "folder" && "Directory Container"}
                      {!["circuit", "algorithm", "data", "model", "folder"].includes(file.type) && "File Contents"}
                    </p>
                  </div>
                  
                  <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-auto">
                    <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                      {getFileContent(file)}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="flex-1 overflow-auto">
            <Card className="h-full">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">File Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Name</label>
                          <p className="font-mono text-sm mt-1">{file.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Type</label>
                          <div className="mt-1">
                            <Badge variant="outline">{file.type.toUpperCase()}</Badge>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Size</label>
                          <p className="font-mono text-sm mt-1">{file.sizeDisplay} ({file.sizeBytes} bytes)</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Timestamps</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Created</label>
                          <p className="text-sm mt-1">{file.createdAt.toLocaleString()}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Modified</label>
                          <p className="text-sm mt-1">{file.updatedAt.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-3">Quantum Properties</h4>
                    <div className="flex flex-wrap gap-2">
                      {file.superposition && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Superposition Active
                        </Badge>
                      )}
                      {file.favorite && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          ★ Favorite
                        </Badge>
                      )}
                      {file.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {file.versions > 1 && (
                    <div>
                      <h4 className="font-semibold text-lg mb-3">Version Control</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Versions</span>
                          <span className="text-sm font-medium">{file.versions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Current Version</span>
                          <span className="text-sm font-medium">{file.lastVersion}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
