
import { supabase } from '@/integrations/supabase/client';
import { Gate } from '@/store/circuitStore';

export interface CircuitVersion {
  id: string;
  circuit_id: string;
  version_number: number;
  gates: Gate[];
  created_by: string;
  created_at: string;
  commit_message: string;
  parent_version?: string;
}

export interface CircuitComment {
  id: string;
  circuit_id: string;
  user_id: string;
  content: string;
  position?: { x: number; y: number };
  gate_id?: string;
  created_at: string;
  resolved: boolean;
}

export interface CollaborationEvent {
  type: 'cursor_move' | 'gate_select' | 'gate_edit' | 'comment_add';
  user_id: string;
  data: any;
  timestamp: string;
}

export class CollaborationService {
  private circuitId: string | null = null;
  private userId: string | null = null;
  private channel: any = null;
  private eventHandlers: Map<string, Function[]> = new Map();

  async initialize(circuitId: string, userId: string) {
    this.circuitId = circuitId;
    this.userId = userId;
    
    // Set up real-time channel
    this.channel = supabase
      .channel(`circuit_collaboration_${circuitId}`)
      .on('presence', { event: 'sync' }, () => {
        this.emit('users_sync', this.channel.presenceState());
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        this.emit('user_join', { key, newPresences });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        this.emit('user_leave', { key, leftPresences });
      })
      .on('broadcast', { event: 'collaboration' }, (payload) => {
        this.handleCollaborationEvent(payload);
      })
      .subscribe();

    // Track user presence
    await this.channel.track({
      user_id: userId,
      online_at: new Date().toISOString(),
    });
  }

  async cleanup() {
    if (this.channel) {
      await supabase.removeChannel(this.channel);
    }
  }

  // Version Control Methods
  async createVersion(gates: Gate[], commitMessage: string): Promise<CircuitVersion> {
    if (!this.circuitId || !this.userId) {
      throw new Error('Collaboration service not initialized');
    }

    const { data, error } = await supabase
      .from('circuit_versions')
      .insert({
        circuit_id: this.circuitId,
        gates: gates,
        created_by: this.userId,
        commit_message: commitMessage,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getVersionHistory(): Promise<CircuitVersion[]> {
    if (!this.circuitId) {
      throw new Error('Circuit ID not set');
    }

    const { data, error } = await supabase
      .from('circuit_versions')
      .select('*')
      .eq('circuit_id', this.circuitId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async revertToVersion(versionId: string): Promise<Gate[]> {
    const { data, error } = await supabase
      .from('circuit_versions')
      .select('gates')
      .eq('id', versionId)
      .single();

    if (error) throw error;
    return data.gates;
  }

  // Comment System
  async addComment(content: string, position?: { x: number; y: number }, gateId?: string): Promise<CircuitComment> {
    if (!this.circuitId || !this.userId) {
      throw new Error('Collaboration service not initialized');
    }

    const { data, error } = await supabase
      .from('circuit_comments')
      .insert({
        circuit_id: this.circuitId,
        user_id: this.userId,
        content,
        position,
        gate_id: gateId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getComments(): Promise<CircuitComment[]> {
    if (!this.circuitId) {
      throw new Error('Circuit ID not set');
    }

    const { data, error } = await supabase
      .from('circuit_comments')
      .select('*')
      .eq('circuit_id', this.circuitId)
      .eq('resolved', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async resolveComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('circuit_comments')
      .update({ resolved: true })
      .eq('id', commentId);

    if (error) throw error;
  }

  // Real-time Collaboration Events
  async broadcastEvent(event: CollaborationEvent): Promise<void> {
    if (!this.channel) return;

    await this.channel.send({
      type: 'broadcast',
      event: 'collaboration',
      payload: event,
    });
  }

  private handleCollaborationEvent(event: CollaborationEvent): void {
    // Don't handle our own events
    if (event.user_id === this.userId) return;

    this.emit(event.type, event);
  }

  // Cursor tracking
  async updateCursor(position: { x: number; y: number }): Promise<void> {
    await this.broadcastEvent({
      type: 'cursor_move',
      user_id: this.userId!,
      data: { position },
      timestamp: new Date().toISOString(),
    });
  }

  // Gate selection sync
  async selectGate(gateId: string): Promise<void> {
    await this.broadcastEvent({
      type: 'gate_select',
      user_id: this.userId!,
      data: { gateId },
      timestamp: new Date().toISOString(),
    });
  }

  // Event handling
  on(event: string, handler: Function): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

export const collaborationService = new CollaborationService();
