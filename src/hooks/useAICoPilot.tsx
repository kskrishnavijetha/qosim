import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface AICoPilotState {
  isOpen: boolean;
  isProcessing: boolean;
  conversationId: string | null;
}

export function useAICoPilot() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<AICoPilotState>({
    isOpen: false,
    isProcessing: false,
    conversationId: null,
  });

  const openCoPilot = useCallback(() => {
    setState(prev => ({
      ...prev,
      isOpen: true,
      conversationId: prev.conversationId || `conv_${Date.now()}`,
    }));
    
    if (!user) {
      toast({
        title: "Guest Mode",
        description: "Sign in to save conversations and access advanced features.",
      });
    }
  }, [user, toast]);

  const closeCoPilot = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const toggleCoPilot = useCallback(() => {
    if (state.isOpen) {
      closeCoPilot();
    } else {
      openCoPilot();
    }
  }, [state.isOpen, openCoPilot, closeCoPilot]);

  const startNewConversation = useCallback(() => {
    setState(prev => ({
      ...prev,
      conversationId: `conv_${Date.now()}`,
    }));
  }, []);

  return {
    ...state,
    openCoPilot,
    closeCoPilot,
    toggleCoPilot,
    startNewConversation,
  };
}