import { useState, useEffect } from "react";
import { Terminal, X, Minus, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error" | "quantum";
  message: string;
}

export function QuantumConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  // Simulate quantum system logs
  useEffect(() => {
    const quantumLogs = [
      { level: "quantum" as const, message: "Quantum state initialized: |ψ⟩ = α|0⟩ + β|1⟩" },
      { level: "info" as const, message: "Entanglement protocol activated on qubits 0-15" },
      { level: "quantum" as const, message: "Superposition detected: coherence time 47.2μs" },
      { level: "warning" as const, message: "Decoherence threshold approaching on qubit 8" },
      { level: "info" as const, message: "Quantum circuit compiled successfully" },
      { level: "quantum" as const, message: "Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2 prepared" },
      { level: "error" as const, message: "Quantum error correction triggered" },
      { level: "info" as const, message: "Job #Q-4571 queued for execution" },
    ];

    const interval = setInterval(() => {
      const randomLog = quantumLogs[Math.floor(Math.random() * quantumLogs.length)];
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        level: randomLog.level,
        message: randomLog.message,
      };

      setLogs(prev => [newLog, ...prev.slice(0, 49)]); // Keep last 50 logs
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "text-red-400";
      case "warning": return "text-yellow-400";
      case "quantum": return "text-quantum-glow";
      default: return "text-quantum-neon";
    }
  };

  return (
    <div className={cn(
      "w-80 bg-quantum-void border-l neon-border quantum-panel h-full flex flex-col relative",
      isMinimized && "w-12"
    )}>
      {/* Animated background effect */}
      <div className="absolute inset-0 quantum-grid opacity-20 pointer-events-none" />
      
      <div className="flex items-center justify-between p-4 border-b border-quantum-matrix relative z-10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Terminal className="w-4 h-4 text-quantum-neon" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-quantum-glow rounded-full particle-animation" />
          </div>
          {!isMinimized && (
            <span className="font-mono text-sm font-medium">Quantum Console</span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-quantum-matrix rounded text-quantum-neon transition-all duration-300 hover:scale-110 hover:text-quantum-glow"
          >
            {isMinimized ? <Square className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          </button>
          <button className="p-1 hover:bg-quantum-matrix rounded text-quantum-neon transition-all duration-300 hover:scale-110 hover:text-red-400">
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full overflow-y-auto p-4 relative">
            <div className="space-y-2">
              {logs.map((log, index) => (
                <div 
                  key={log.id} 
                  className="flex gap-2 text-xs font-mono p-2 rounded hover:bg-quantum-matrix/30 transition-all duration-300 animate-in fade-in slide-in-from-top"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationDuration: '500ms',
                    animationFillMode: 'both'
                  }}
                >
                  <span className="text-muted-foreground shrink-0 opacity-70">
                    [{log.timestamp}]
                  </span>
                  <span className={cn(
                    "shrink-0 px-2 py-0.5 rounded text-xs font-bold", 
                    getLevelColor(log.level),
                    log.level === "quantum" && "quantum-glow",
                    log.level === "error" && "bg-red-500/20",
                    log.level === "warning" && "bg-yellow-500/20",
                    log.level === "info" && "bg-blue-500/20"
                  )}>
                    {log.level.toUpperCase()}
                  </span>
                  <span className="text-foreground break-words leading-relaxed">
                    {log.message}
                  </span>
                  
                  {/* Quantum level special effects */}
                  {log.level === "quantum" && (
                    <div className="ml-auto text-quantum-particle text-xs particle-animation">
                      ⚛️
                    </div>
                  )}
                </div>
              ))}
              
              {/* Live indicator */}
              <div className="flex items-center gap-2 p-2 text-xs font-mono text-quantum-glow">
                <div className="w-2 h-2 bg-quantum-glow rounded-full particle-animation"></div>
                <span>Live quantum stream active...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}