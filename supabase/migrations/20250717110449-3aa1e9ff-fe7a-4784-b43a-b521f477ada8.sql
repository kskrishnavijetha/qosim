
-- Create shared_circuits table for circuit sharing
CREATE TABLE public.shared_circuits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circuit_id UUID REFERENCES public.circuits(id) ON DELETE CASCADE NOT NULL,
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64url'),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission_level TEXT NOT NULL DEFAULT 'view' CHECK (permission_level IN ('view', 'edit', 'admin')),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create circuit_collaborators table for managing collaborators
CREATE TABLE public.circuit_collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circuit_id UUID REFERENCES public.circuits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  permission_level TEXT NOT NULL DEFAULT 'edit' CHECK (permission_level IN ('view', 'edit', 'admin')),
  invited_by UUID REFERENCES auth.users(id) NOT NULL,
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(circuit_id, user_id)
);

-- Create circuit_activity_log for real-time collaboration tracking
CREATE TABLE public.circuit_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  circuit_id UUID REFERENCES public.circuits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('gate_added', 'gate_removed', 'gate_moved', 'circuit_saved', 'user_joined', 'user_left')),
  action_data JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.shared_circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuit_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuit_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for shared_circuits
CREATE POLICY "Users can view shared circuits they created" 
  ON public.shared_circuits 
  FOR SELECT 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create shared circuits for their own circuits" 
  ON public.shared_circuits 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = created_by AND 
    EXISTS (SELECT 1 FROM public.circuits WHERE id = circuit_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update their own shared circuits" 
  ON public.shared_circuits 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own shared circuits" 
  ON public.shared_circuits 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- RLS policies for circuit_collaborators
CREATE POLICY "Users can view collaborations they're part of" 
  ON public.circuit_collaborators 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    auth.uid() = invited_by OR
    EXISTS (SELECT 1 FROM public.circuits WHERE id = circuit_id AND user_id = auth.uid())
  );

CREATE POLICY "Circuit owners and admins can manage collaborators" 
  ON public.circuit_collaborators 
  FOR ALL 
  USING (
    EXISTS (SELECT 1 FROM public.circuits WHERE id = circuit_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.circuit_collaborators WHERE circuit_id = circuit_collaborators.circuit_id AND user_id = auth.uid() AND permission_level = 'admin')
  );

-- RLS policies for circuit_activity_log
CREATE POLICY "Users can view activity for circuits they have access to" 
  ON public.circuit_activity_log 
  FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM public.circuits WHERE id = circuit_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.circuit_collaborators WHERE circuit_id = circuit_activity_log.circuit_id AND user_id = auth.uid() AND is_active = true)
  );

CREATE POLICY "Users can insert activity for circuits they have access to" 
  ON public.circuit_activity_log 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = user_id AND (
      EXISTS (SELECT 1 FROM public.circuits WHERE id = circuit_id AND user_id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.circuit_collaborators WHERE circuit_id = circuit_activity_log.circuit_id AND user_id = auth.uid() AND is_active = true)
    )
  );

-- Add triggers for updated_at
CREATE TRIGGER update_shared_circuits_updated_at
  BEFORE UPDATE ON public.shared_circuits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for collaboration
ALTER TABLE public.circuit_activity_log REPLICA IDENTITY FULL;
ALTER TABLE public.circuits REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.circuit_activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.circuits;
ALTER PUBLICATION supabase_realtime ADD TABLE public.circuit_collaborators;
