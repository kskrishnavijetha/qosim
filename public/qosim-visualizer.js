/**
 * QOSim Visualizer - Embeddable Circuit Renderer
 * Creates visual representations of quantum circuits
 */

export class CircuitVisualizer {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.options = {
      width: options.width || 800,
      height: options.height || 400,
      backgroundColor: options.backgroundColor || '#f8f9fa',
      lineColor: options.lineColor || '#333',
      gateColor: options.gateColor || '#007bff',
      textColor: options.textColor || '#333',
      fontSize: options.fontSize || 14,
      gateSize: options.gateSize || 40,
      wireSpacing: options.wireSpacing || 60,
      gateSpacing: options.gateSpacing || 80,
      ...options
    };
    
    this.canvas = null;
    this.ctx = null;
    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.canvas.style.border = '1px solid #ddd';
    this.canvas.style.borderRadius = '8px';
    
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
  }

  render(simulator) {
    this.clear();
    
    const numQubits = simulator.numQubits;
    const gates = simulator.gates;
    
    // Calculate layout
    const startX = 50;
    const startY = 50;
    const endX = this.options.width - 50;
    
    // Draw qubit wires
    this.drawQubitWires(numQubits, startX, startY, endX);
    
    // Draw qubit labels
    this.drawQubitLabels(numQubits, startX - 30, startY);
    
    // Draw gates
    this.drawGates(gates, numQubits, startX, startY);
    
    // Draw measurements
    this.drawMeasurements(simulator.measurements, numQubits, startX, startY, endX);
  }

  clear() {
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.fillRect(0, 0, this.options.width, this.options.height);
  }

  drawQubitWires(numQubits, startX, startY, endX) {
    this.ctx.strokeStyle = this.options.lineColor;
    this.ctx.lineWidth = 2;
    
    for (let i = 0; i < numQubits; i++) {
      const y = startY + i * this.options.wireSpacing;
      this.ctx.beginPath();
      this.ctx.moveTo(startX, y);
      this.ctx.lineTo(endX, y);
      this.ctx.stroke();
    }
  }

  drawQubitLabels(numQubits, x, startY) {
    this.ctx.fillStyle = this.options.textColor;
    this.ctx.font = `${this.options.fontSize}px Arial`;
    this.ctx.textAlign = 'center';
    
    for (let i = 0; i < numQubits; i++) {
      const y = startY + i * this.options.wireSpacing + 5;
      this.ctx.fillText(`q${i}`, x, y);
    }
  }

  drawGates(gates, numQubits, startX, startY) {
    let currentX = startX + this.options.gateSpacing;
    
    for (const gate of gates) {
      this.drawGate(gate, currentX, startY);
      currentX += this.options.gateSpacing;
    }
  }

  drawGate(gate, x, startY) {
    if (gate.name === 'CNOT') {
      this.drawCNOTGate(gate.qubits[0], gate.qubits[1], x, startY);
    } else if (gate.name === 'CCX') {
      this.drawToffoliGate(gate.qubits[0], gate.qubits[1], gate.qubits[2], x, startY);
    } else {
      this.drawSingleQubitGate(gate.name, gate.qubits[0], x, startY, gate.params);
    }
  }

  drawSingleQubitGate(gateName, qubit, x, startY, params = []) {
    const y = startY + qubit * this.options.wireSpacing;
    const size = this.options.gateSize;
    
    // Draw gate box
    this.ctx.fillStyle = this.options.gateColor;
    this.ctx.fillRect(x - size/2, y - size/2, size, size);
    
    // Draw gate border
    this.ctx.strokeStyle = this.options.lineColor;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x - size/2, y - size/2, size, size);
    
    // Draw gate text
    this.ctx.fillStyle = 'white';
    this.ctx.font = `${this.options.fontSize}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    let text = gateName;
    if (params.length > 0) {
      const param = params[0];
      const piRatio = param / Math.PI;
      if (Math.abs(piRatio - 0.5) < 1e-10) {
        text += '(π/2)';
      } else if (Math.abs(piRatio - 1) < 1e-10) {
        text += '(π)';
      } else {
        text += `(${param.toFixed(2)})`;
      }
    }
    
    this.ctx.fillText(text, x, y);
  }

  drawCNOTGate(control, target, x, startY) {
    const controlY = startY + control * this.options.wireSpacing;
    const targetY = startY + target * this.options.wireSpacing;
    
    // Draw control line
    this.ctx.strokeStyle = this.options.lineColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x, controlY);
    this.ctx.lineTo(x, targetY);
    this.ctx.stroke();
    
    // Draw control dot
    this.ctx.fillStyle = this.options.lineColor;
    this.ctx.beginPath();
    this.ctx.arc(x, controlY, 6, 0, 2 * Math.PI);
    this.ctx.fill();
    
    // Draw target circle
    this.ctx.strokeStyle = this.options.lineColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x, targetY, 12, 0, 2 * Math.PI);
    this.ctx.stroke();
    
    // Draw target plus
    this.ctx.beginPath();
    this.ctx.moveTo(x - 8, targetY);
    this.ctx.lineTo(x + 8, targetY);
    this.ctx.moveTo(x, targetY - 8);
    this.ctx.lineTo(x, targetY + 8);
    this.ctx.stroke();
  }

  drawToffoliGate(control1, control2, target, x, startY) {
    const control1Y = startY + control1 * this.options.wireSpacing;
    const control2Y = startY + control2 * this.options.wireSpacing;
    const targetY = startY + target * this.options.wireSpacing;
    
    const minY = Math.min(control1Y, control2Y, targetY);
    const maxY = Math.max(control1Y, control2Y, targetY);
    
    // Draw control line
    this.ctx.strokeStyle = this.options.lineColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x, minY);
    this.ctx.lineTo(x, maxY);
    this.ctx.stroke();
    
    // Draw control dots
    this.ctx.fillStyle = this.options.lineColor;
    this.ctx.beginPath();
    this.ctx.arc(x, control1Y, 6, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.arc(x, control2Y, 6, 0, 2 * Math.PI);
    this.ctx.fill();
    
    // Draw target circle
    this.ctx.strokeStyle = this.options.lineColor;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x, targetY, 12, 0, 2 * Math.PI);
    this.ctx.stroke();
    
    // Draw target plus
    this.ctx.beginPath();
    this.ctx.moveTo(x - 8, targetY);
    this.ctx.lineTo(x + 8, targetY);
    this.ctx.moveTo(x, targetY - 8);
    this.ctx.lineTo(x, targetY + 8);
    this.ctx.stroke();
  }

  drawMeasurements(measurements, numQubits, startX, startY, endX) {
    if (measurements.length === 0) return;
    
    const measureX = endX - 60;
    
    for (const qubit of measurements) {
      const y = startY + qubit * this.options.wireSpacing;
      
      // Draw measurement box
      this.ctx.strokeStyle = this.options.lineColor;
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(measureX - 20, y - 15, 40, 30);
      
      // Draw measurement symbol (meter)
      this.ctx.beginPath();
      this.ctx.arc(measureX, y, 8, Math.PI, 0);
      this.ctx.stroke();
      
      this.ctx.beginPath();
      this.ctx.moveTo(measureX, y);
      this.ctx.lineTo(measureX + 6, y - 6);
      this.ctx.stroke();
    }
  }

  exportImage(format = 'png') {
    return this.canvas.toDataURL(`image/${format}`);
  }

  resize(width, height) {
    this.options.width = width;
    this.options.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }
}

export class StateVectorVisualizer {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.getElementById(container) : container;
    this.options = {
      width: options.width || 600,
      height: options.height || 400,
      backgroundColor: options.backgroundColor || '#f8f9fa',
      barColor: options.barColor || '#007bff',
      phaseColor: options.phaseColor || '#dc3545',
      textColor: options.textColor || '#333',
      fontSize: options.fontSize || 12,
      showPhases: options.showPhases !== false,
      threshold: options.threshold || 1e-10,
      ...options
    };
    
    this.canvas = null;
    this.ctx = null;
    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.options.width;
    this.canvas.height = this.options.height;
    this.canvas.style.border = '1px solid #ddd';
    this.canvas.style.borderRadius = '8px';
    
    this.ctx = this.canvas.getContext('2d');
    this.container.appendChild(this.canvas);
  }

  render(simulator) {
    this.clear();
    
    const stateVector = simulator.getStateVector();
    const probabilities = simulator.getProbabilities();
    const basisStates = simulator.getBasisStates();
    
    if (basisStates.length === 0) return;
    
    this.drawProbabilityBars(basisStates);
    
    if (this.options.showPhases) {
      this.drawPhaseIndicators(basisStates);
    }
  }

  clear() {
    this.ctx.fillStyle = this.options.backgroundColor;
    this.ctx.fillRect(0, 0, this.options.width, this.options.height);
  }

  drawProbabilityBars(basisStates) {
    const margin = 40;
    const chartWidth = this.options.width - 2 * margin;
    const chartHeight = this.options.height - 2 * margin;
    const barWidth = chartWidth / basisStates.length;
    
    // Find max probability for scaling
    const maxProb = Math.max(...basisStates.map(s => s.probability));
    
    for (let i = 0; i < basisStates.length; i++) {
      const state = basisStates[i];
      const x = margin + i * barWidth;
      const barHeight = (state.probability / maxProb) * chartHeight * 0.8;
      const y = margin + chartHeight - barHeight;
      
      // Draw probability bar
      this.ctx.fillStyle = this.options.barColor;
      this.ctx.fillRect(x + 2, y, barWidth - 4, barHeight);
      
      // Draw state label
      this.ctx.fillStyle = this.options.textColor;
      this.ctx.font = `${this.options.fontSize}px Arial`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`|${state.state}⟩`, x + barWidth/2, margin + chartHeight + 20);
      
      // Draw probability value
      this.ctx.font = `${this.options.fontSize - 2}px Arial`;
      const probText = state.probability.toFixed(4);
      this.ctx.fillText(probText, x + barWidth/2, y - 5);
    }
    
    // Draw axes
    this.ctx.strokeStyle = this.options.textColor;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(margin, margin);
    this.ctx.lineTo(margin, margin + chartHeight);
    this.ctx.lineTo(margin + chartWidth, margin + chartHeight);
    this.ctx.stroke();
    
    // Y-axis label
    this.ctx.save();
    this.ctx.translate(15, margin + chartHeight/2);
    this.ctx.rotate(-Math.PI/2);
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Probability', 0, 0);
    this.ctx.restore();
  }

  drawPhaseIndicators(basisStates) {
    const margin = 40;
    const chartWidth = this.options.width - 2 * margin;
    const barWidth = chartWidth / basisStates.length;
    
    for (let i = 0; i < basisStates.length; i++) {
      const state = basisStates[i];
      const x = margin + i * barWidth + barWidth/2;
      const y = margin - 10;
      
      const phase = state.amplitude.phase();
      if (Math.abs(phase) > 1e-10) {
        // Draw phase indicator as colored circle
        const hue = ((phase + Math.PI) / (2 * Math.PI)) * 360;
        this.ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 6, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // Draw phase value
        this.ctx.fillStyle = this.options.textColor;
        this.ctx.font = `${this.options.fontSize - 3}px Arial`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${(phase/Math.PI).toFixed(2)}π`, x, y - 15);
      }
    }
  }
}