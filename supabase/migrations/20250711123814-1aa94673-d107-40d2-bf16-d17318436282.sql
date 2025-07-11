-- Create memory_states table for real-time quantum memory tracking
CREATE TABLE public.memory_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bank_id TEXT NOT NULL,
  bank_name TEXT NOT NULL,
  capacity_qubits INTEGER NOT NULL DEFAULT 256,
  used_qubits INTEGER NOT NULL DEFAULT 0,
  coherence_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  qubit_states JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memory_states ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own memory states" 
ON public.memory_states 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own memory states" 
ON public.memory_states 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memory states" 
ON public.memory_states 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memory states" 
ON public.memory_states 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create quantum_files table for real-time file system
CREATE TABLE public.quantum_files (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  size_display TEXT NOT NULL,
  content_data JSONB,
  superposition BOOLEAN NOT NULL DEFAULT false,
  favorite BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] NOT NULL DEFAULT '{}',
  versions INTEGER NOT NULL DEFAULT 1,
  last_version TEXT NOT NULL DEFAULT 'v1.0',
  parent_folder_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quantum_files ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own files" 
ON public.quantum_files 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own files" 
ON public.quantum_files 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own files" 
ON public.quantum_files 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own files" 
ON public.quantum_files 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create runtime_logs table for real-time system logs
CREATE TABLE public.runtime_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  level TEXT NOT NULL CHECK (level IN ('info', 'warning', 'error', 'quantum')),
  component TEXT NOT NULL,
  message TEXT NOT NULL,
  details TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.runtime_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own logs" 
ON public.runtime_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own logs" 
ON public.runtime_logs 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_memory_states_updated_at
  BEFORE UPDATE ON public.memory_states
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quantum_files_updated_at
  BEFORE UPDATE ON public.quantum_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER TABLE public.memory_states REPLICA IDENTITY FULL;
ALTER TABLE public.quantum_files REPLICA IDENTITY FULL;
ALTER TABLE public.runtime_logs REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.memory_states;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quantum_files;
ALTER PUBLICATION supabase_realtime ADD TABLE public.runtime_logs;