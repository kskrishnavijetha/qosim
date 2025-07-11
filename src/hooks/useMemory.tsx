import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { quantumSimulator } from '@/lib/quantumSimulator';
import { toast } from 'sonner';

export interface QubitState {
  id: number;
  state: string;
  coherence: number;
  entangled: boolean;
  amplitude: number;
  blochState: {
    amplitude0: { real: number; imag: number };
    amplitude1: { real: number; imag: number };
    probability0: number;
    probability1: number;
    phase: number;
  };
}

export interface MemoryBank {
  id: string;
  bankId: string;
  name: string;
  capacity: number;
  used: number;
  coherence: number;
  qubitStates: QubitState[];
  createdAt: Date;
  updatedAt: Date;
}

export function useMemory() {
  const [memoryBanks, setMemoryBanks] = useState<MemoryBank[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Transform database memory state to local format
  const transformMemoryState = (dbState: any): MemoryBank => ({
    id: dbState.id,
    bankId: dbState.bank_id,
    name: dbState.bank_name,
    capacity: dbState.capacity_qubits,
    used: dbState.used_qubits,
    coherence: parseFloat(dbState.coherence_percentage),
    qubitStates: dbState.qubit_states || [],
    createdAt: new Date(dbState.created_at),
    updatedAt: new Date(dbState.updated_at)
  });

  // Generate quantum state based on current simulation
  const generateQuantumState = useCallback((): QubitState[] => {
    const result = quantumSimulator.getResult();
    
    const simulatedQubits = result.qubitStates.map((qubit, index) => ({
      id: index,
      state: qubit.state,
      coherence: qubit.probability * 100,
      entangled: Math.abs(qubit.probability - 0.5) < 0.1,
      amplitude: qubit.probability,
      blochState: {
        amplitude0: { real: Math.sqrt(1 - qubit.probability), imag: 0 },
        amplitude1: { 
          real: Math.sqrt(qubit.probability) * Math.cos(qubit.phase), 
          imag: Math.sqrt(qubit.probability) * Math.sin(qubit.phase) 
        },
        probability0: 1 - qubit.probability,
        probability1: qubit.probability,
        phase: qubit.phase
      }
    }));

    // Fill remaining slots with simulated data
    return [
      ...simulatedQubits,
      ...Array.from({ length: 64 - simulatedQubits.length }, (_, i) => ({
        id: simulatedQubits.length + i,
        state: Math.random() > 0.5 ? "|1⟩" : "|0⟩",
        coherence: Math.random() * 100,
        entangled: Math.random() > 0.7,
        amplitude: Math.random(),
        blochState: {
          amplitude0: { real: Math.sqrt(Math.random()), imag: 0 },
          amplitude1: { real: Math.sqrt(Math.random()), imag: 0 },
          probability0: Math.random(),
          probability1: Math.random(),
          phase: Math.random() * Math.PI * 2
        }
      }))
    ];
  }, []);

  // Fetch memory states from database
  const fetchMemoryStates = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('memory_states')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setMemoryBanks(data.map(transformMemoryState));
      } else {
        // Initialize default memory banks
        await initializeDefaultMemoryBanks();
      }
    } catch (error) {
      console.error('Error fetching memory states:', error);
      toast.error('Failed to fetch memory states');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initialize default memory banks
  const initializeDefaultMemoryBanks = useCallback(async () => {
    if (!user) return;

    const defaultBanks = [
      { 
        bankId: "QMB-0", 
        name: "Primary Quantum Register", 
        capacity: 256, 
        used: 128, 
        coherence: 98.3 
      },
      { 
        bankId: "QMB-1", 
        name: "Auxiliary Storage", 
        capacity: 128, 
        used: 64, 
        coherence: 94.7 
      },
      { 
        bankId: "QMB-2", 
        name: "Error Correction Buffer", 
        capacity: 64, 
        used: 32, 
        coherence: 99.1 
      },
    ];

    try {
      const qubitStates = generateQuantumState();
      
      for (const bank of defaultBanks) {
        await supabase
          .from('memory_states')
          .insert({
            user_id: user.id,
            bank_id: bank.bankId,
            bank_name: bank.name,
            capacity_qubits: bank.capacity,
            used_qubits: bank.used,
            coherence_percentage: bank.coherence,
            qubit_states: qubitStates as any
          });
      }
    } catch (error) {
      console.error('Error initializing memory banks:', error);
      toast.error('Failed to initialize memory banks');
    }
  }, [user, generateQuantumState]);

  // Update memory bank
  const updateMemoryBank = useCallback(async (bankId: string, updates: Partial<{
    used: number;
    coherence: number;
    qubitStates: QubitState[];
  }>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      if (updates.used !== undefined) updateData.used_qubits = updates.used;
      if (updates.coherence !== undefined) updateData.coherence_percentage = updates.coherence;
      if (updates.qubitStates) updateData.qubit_states = updates.qubitStates;

      const { error } = await supabase
        .from('memory_states')
        .update(updateData)
        .eq('bank_id', bankId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating memory bank:', error);
      toast.error('Failed to update memory bank');
    }
  }, [user]);

  // Refresh quantum states
  const refreshQuantumStates = useCallback(async () => {
    if (!user) return;

    try {
      const qubitStates = generateQuantumState();
      
      // Update all memory banks with new quantum states
      for (const bank of memoryBanks) {
        await updateMemoryBank(bank.bankId, { 
          qubitStates,
          coherence: 95 + Math.random() * 5 // Simulate coherence fluctuation
        });
      }
      
      toast.success('Quantum states refreshed');
    } catch (error) {
      console.error('Error refreshing quantum states:', error);
      toast.error('Failed to refresh quantum states');
    }
  }, [user, memoryBanks, generateQuantumState, updateMemoryBank]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    fetchMemoryStates();

    const channel = supabase
      .channel('memory_states_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'memory_states',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time memory update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newBank = transformMemoryState(payload.new);
            setMemoryBanks(prev => [newBank, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedBank = transformMemoryState(payload.new);
            setMemoryBanks(prev => prev.map(bank => 
              bank.id === updatedBank.id ? updatedBank : bank
            ));
          } else if (payload.eventType === 'DELETE') {
            setMemoryBanks(prev => prev.filter(bank => bank.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchMemoryStates]);

  // Auto-refresh quantum states every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (memoryBanks.length > 0) {
        refreshQuantumStates();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [memoryBanks, refreshQuantumStates]);

  return {
    memoryBanks,
    loading,
    updateMemoryBank,
    refreshQuantumStates,
    generateQuantumState
  };
}