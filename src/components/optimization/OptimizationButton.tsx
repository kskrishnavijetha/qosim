
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { aiOptimizationEngine } from '@/services/aiOptimizationEngine';
import { Gate } from '@/hooks/useCircuitWorkspace';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface OptimizationButtonProps {
  circuit: Gate[];
  onOptimizedCircuit: (gates: Gate[]) => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'secondary';
}

export function OptimizationButton({ 
  circuit, 
  onOptimizedCircuit, 
  disabled = false,
  size = 'default',
  variant = 'default'
}: OptimizationButtonProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    if (circuit.length === 0) {
      toast.error('No circuit to optimize');
      return;
    }

    setIsOptimizing(true);
    try {
      const result = await aiOptimizationEngine.optimizeCircuit(circuit, {
        optimizeDepth: true,
        reduceGates: true,
        errorCorrection: true,
        preserveEntanglement: true
      });

      if (result.preservesFunctionality) {
        onOptimizedCircuit(result.optimizedGates);
        
        const gateReduction = result.metrics.gateReduction;
        const depthReduction = result.metrics.depthReduction;
        
        toast.success(
          `Circuit optimized! ${gateReduction > 0 ? `${gateReduction.toFixed(1)}% fewer gates` : 'No gate reduction'}, ${depthReduction > 0 ? `${depthReduction.toFixed(1)}% shallower` : 'no depth reduction'}`
        );
      } else {
        toast.error('Optimization failed: could not preserve circuit functionality');
      }
    } catch (error) {
      console.error('Optimization error:', error);
      toast.error('Optimization failed. Please try again.');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleOptimize}
            disabled={disabled || isOptimizing || circuit.length === 0}
            size={size}
            variant={variant}
            className="neon-border"
          >
            {isOptimizing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                AI Optimize
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Apply AI-powered circuit optimization</p>
          <p className="text-xs text-muted-foreground mt-1">
            Reduces gates, optimizes depth, and preserves functionality
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
