import { Zap } from "lucide-react";

interface CircuitPreviewProps {
  fileId: string;
}

export function CircuitPreview({ fileId }: CircuitPreviewProps) {
  // Mock circuit visualization based on file ID
  const getCircuitPattern = (id: string) => {
    switch (id) {
      case "qfs-001": // Bell state
        return (
          <div className="flex flex-col gap-1 text-quantum-glow text-xs">
            <div className="flex items-center">
              <div className="w-2 h-px bg-quantum-glow"></div>
              <div className="w-3 h-3 border border-quantum-glow rounded-full flex items-center justify-center text-[8px]">H</div>
              <div className="w-2 h-px bg-quantum-glow"></div>
              <div className="w-2 h-2 bg-quantum-glow rounded-full"></div>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-px bg-quantum-glow"></div>
              <div className="w-3 h-px bg-transparent"></div>
              <div className="w-2 h-px bg-quantum-glow"></div>
              <div className="w-2 h-2 border border-quantum-glow rounded-full"></div>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-quantum-glow/50">
            <Zap className="w-8 h-8" />
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {getCircuitPattern(fileId)}
    </div>
  );
}