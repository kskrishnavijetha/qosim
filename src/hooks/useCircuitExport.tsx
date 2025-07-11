import { useState } from 'react';
import JSZip from 'jszip';
import html2canvas from 'html2canvas';

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
  includeComments: boolean;
  customLabels: boolean;
  projectName: string;
}

export function useCircuitExport() {
  const [isExporting, setIsExporting] = useState(false);

  const generateCircuitData = (gates: Gate[]) => {
    return gates
      .sort((a, b) => a.position - b.position)
      .map(gate => ({
        gate: gate.type,
        qubit: gate.qubit,
        qubits: gate.qubits,
        time: gate.position,
        angle: gate.angle,
        label: gate.label,
        comment: gate.comment
      }));
  };

  const exportToJSON = (circuit: Gate[], options: ExportOptions) => {
    const data = generateCircuitData(circuit);
    const metadata = {
      project: options.projectName,
      created: new Date().toISOString(),
      qubits: Math.max(...circuit.map(g => Math.max(g.qubit || 0, ...(g.qubits || [])))) + 1,
      gates: circuit.length
    };
    
    const exportData = {
      metadata,
      circuit: data
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    return blob;
  };

  const exportToQASM = (circuit: Gate[], options: ExportOptions, numQubits: number = 5) => {
    let qasm = `OPENQASM 2.0;\ninclude "qelib1.inc";\n`;
    if (options.includeComments) {
      qasm += `// ${options.projectName}\n// Generated on ${new Date().toISOString()}\n`;
    }
    qasm += `qreg q[${numQubits}];\ncreg c[${numQubits}];\n\n`;
    
    circuit.forEach(gate => {
      if (options.includeComments && gate.comment) {
        qasm += `// ${gate.comment}\n`;
      }
      
      const label = options.customLabels && gate.label ? ` // ${gate.label}` : '';
      
      switch (gate.type) {
        case 'H':
          qasm += `h q[${gate.qubit}];${label}\n`;
          break;
        case 'X':
          qasm += `x q[${gate.qubit}];${label}\n`;
          break;
        case 'Z':
          qasm += `z q[${gate.qubit}];${label}\n`;
          break;
        case 'CNOT':
          if (gate.qubits) qasm += `cx q[${gate.qubits[0]}],q[${gate.qubits[1]}];${label}\n`;
          break;
        case 'RX':
          qasm += `rx(${gate.angle}) q[${gate.qubit}];${label}\n`;
          break;
        case 'RY':
          qasm += `ry(${gate.angle}) q[${gate.qubit}];${label}\n`;
          break;
        case 'M':
          qasm += `measure q[${gate.qubit}] -> c[${gate.qubit}];${label}\n`;
          break;
      }
    });
    
    const blob = new Blob([qasm], { type: 'text/plain' });
    return blob;
  };

  const exportToQiskit = (circuit: Gate[], options: ExportOptions, numQubits: number = 5) => {
    let python = `from qiskit import QuantumCircuit, ClassicalRegister, QuantumRegister\n`;
    python += `from qiskit.visualization import plot_histogram\n\n`;
    
    if (options.includeComments) {
      python += `# ${options.projectName}\n# Generated on ${new Date().toISOString()}\n\n`;
    }
    
    python += `# Create quantum circuit\n`;
    python += `qreg = QuantumRegister(${numQubits}, 'q')\n`;
    python += `creg = ClassicalRegister(${numQubits}, 'c')\n`;
    python += `circuit = QuantumCircuit(qreg, creg)\n\n`;
    
    circuit.forEach(gate => {
      if (options.includeComments && gate.comment) {
        python += `# ${gate.comment}\n`;
      }
      
      const label = options.customLabels && gate.label ? `  # ${gate.label}` : '';
      
      switch (gate.type) {
        case 'H':
          python += `circuit.h(qreg[${gate.qubit}])${label}\n`;
          break;
        case 'X':
          python += `circuit.x(qreg[${gate.qubit}])${label}\n`;
          break;
        case 'Z':
          python += `circuit.z(qreg[${gate.qubit}])${label}\n`;
          break;
        case 'CNOT':
          if (gate.qubits) python += `circuit.cx(qreg[${gate.qubits[0]}], qreg[${gate.qubits[1]}])${label}\n`;
          break;
        case 'RX':
          python += `circuit.rx(${gate.angle}, qreg[${gate.qubit}])${label}\n`;
          break;
        case 'RY':
          python += `circuit.ry(${gate.angle}, qreg[${gate.qubit}])${label}\n`;
          break;
        case 'M':
          python += `circuit.measure(qreg[${gate.qubit}], creg[${gate.qubit}])${label}\n`;
          break;
      }
    });
    
    python += `\n# Display circuit\nprint(circuit)\n`;
    
    const blob = new Blob([python], { type: 'text/plain' });
    return blob;
  };

  const captureCircuitImage = async (elementRef: React.RefObject<HTMLElement>): Promise<Blob> => {
    if (!elementRef.current) throw new Error('Circuit element not found');
    
    const canvas = await html2canvas(elementRef.current, {
      backgroundColor: '#0a0a0a',
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, 'image/png');
    });
  };

  const exportToSVG = (circuit: Gate[], numQubits: number = 5): Blob => {
    const width = Math.max(circuit.length * 60 + 100, 400);
    const height = numQubits * 60 + 100;
    
    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="100%" height="100%" fill="#0a0a0a"/>`;
    
    // Draw qubit lines
    for (let i = 0; i < numQubits; i++) {
      const y = 50 + i * 60;
      svg += `<line x1="50" y1="${y}" x2="${width - 50}" y2="${y}" stroke="#00d9ff" stroke-width="2"/>`;
      svg += `<text x="20" y="${y + 5}" fill="#00d9ff" font-family="monospace" font-size="12">q${i}</text>`;
    }
    
    // Draw gates
    circuit.forEach((gate, index) => {
      const x = 80 + gate.position * 50;
      const y = 50 + (gate.qubit || 0) * 60;
      
      switch (gate.type) {
        case 'H':
        case 'X':
        case 'Z':
          svg += `<rect x="${x - 15}" y="${y - 15}" width="30" height="30" fill="#00d9ff" rx="5"/>`;
          svg += `<text x="${x}" y="${y + 5}" text-anchor="middle" fill="black" font-family="monospace" font-size="12" font-weight="bold">${gate.type}</text>`;
          break;
        case 'CNOT':
          if (gate.qubits) {
            const y1 = 50 + gate.qubits[0] * 60;
            const y2 = 50 + gate.qubits[1] * 60;
            svg += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#ff6b9d" stroke-width="3"/>`;
            svg += `<circle cx="${x}" cy="${y1}" r="8" fill="#ff6b9d"/>`;
            svg += `<circle cx="${x}" cy="${y2}" r="8" fill="none" stroke="#ff6b9d" stroke-width="3"/>`;
            svg += `<line x1="${x - 5}" y1="${y2}" x2="${x + 5}" y2="${y2}" stroke="#ff6b9d" stroke-width="2"/>`;
            svg += `<line x1="${x}" y1="${y2 - 5}" x2="${x}" y2="${y2 + 5}" stroke="#ff6b9d" stroke-width="2"/>`;
          }
          break;
      }
    });
    
    svg += `</svg>`;
    
    return new Blob([svg], { type: 'image/svg+xml' });
  };

  const exportToZip = async (
    circuit: Gate[], 
    options: ExportOptions, 
    circuitImageBlob?: Blob,
    numQubits: number = 5
  ) => {
    setIsExporting(true);
    
    try {
      const zip = new JSZip();
      
      // Add JSON
      const jsonBlob = exportToJSON(circuit, options);
      zip.file(`${options.projectName}.json`, jsonBlob);
      
      // Add QASM
      const qasmBlob = exportToQASM(circuit, options, numQubits);
      zip.file(`${options.projectName}.qasm`, qasmBlob);
      
      // Add Qiskit Python
      const qiskitBlob = exportToQiskit(circuit, options, numQubits);
      zip.file(`${options.projectName}.py`, qiskitBlob);
      
      // Add SVG
      const svgBlob = exportToSVG(circuit, numQubits);
      zip.file(`${options.projectName}.svg`, svgBlob);
      
      // Add PNG if provided
      if (circuitImageBlob) {
        zip.file(`${options.projectName}.png`, circuitImageBlob);
      }
      
      // Add README
      const readme = `# ${options.projectName}

## Quantum Circuit Export

This package contains multiple formats of your quantum circuit:

- \`${options.projectName}.json\` - Circuit data in JSON format
- \`${options.projectName}.qasm\` - OpenQASM 2.0 format
- \`${options.projectName}.py\` - Qiskit Python script
- \`${options.projectName}.svg\` - Vector circuit diagram
${circuitImageBlob ? `- \`${options.projectName}.png\` - Raster circuit image\n` : ''}

Generated on: ${new Date().toLocaleString()}
Total gates: ${circuit.length}
Qubits used: ${numQubits}
`;
      
      zip.file('README.md', readme);
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      return zipBlob;
    } finally {
      setIsExporting(false);
    }
  };

  const exportToGitHub = async (
    circuit: Gate[],
    options: ExportOptions,
    repository: string,
    token: string,
    numQubits: number = 5
  ) => {
    setIsExporting(true);
    
    try {
      const [owner, repo] = repository.split('/');
      const baseUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
      
      const files = [
        {
          path: `circuits/${options.projectName}.json`,
          content: btoa(await exportToJSON(circuit, options).text()),
          message: `Add quantum circuit: ${options.projectName}.json`
        },
        {
          path: `circuits/${options.projectName}.qasm`,
          content: btoa(await exportToQASM(circuit, options, numQubits).text()),
          message: `Add quantum circuit: ${options.projectName}.qasm`
        },
        {
          path: `circuits/${options.projectName}.py`,
          content: btoa(await exportToQiskit(circuit, options, numQubits).text()),
          message: `Add quantum circuit: ${options.projectName}.py`
        }
      ];
      
      const uploadPromises = files.map(async (file) => {
        const response = await fetch(`${baseUrl}/${file.path}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: file.message,
            content: file.content,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload ${file.path}: ${response.statusText}`);
        }
        
        return response.json();
      });
      
      await Promise.all(uploadPromises);
      return true;
    } catch (error) {
      console.error('GitHub export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    isExporting,
    exportToJSON,
    exportToQASM,
    exportToQiskit,
    exportToSVG,
    exportToZip,
    exportToGitHub,
    captureCircuitImage,
    downloadBlob
  };
}