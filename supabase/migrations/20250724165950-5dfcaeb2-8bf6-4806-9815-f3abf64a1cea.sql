
-- Create circuit_collaboration table for real-time collaboration
CREATE TABLE IF NOT EXISTS circuit_collaboration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circuit_id UUID NOT NULL REFERENCES circuits(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  change_type TEXT NOT NULL,
  change_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create circuit_comments table for collaboration comments
CREATE TABLE IF NOT EXISTS circuit_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  circuit_id UUID NOT NULL REFERENCES circuits(id) ON DELETE CASCADE,
  gate_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add RLS policies for circuit_collaboration
ALTER TABLE circuit_collaboration ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert collaboration data for circuits they have access to"
ON circuit_collaboration FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND (
    EXISTS (
      SELECT 1 FROM circuits 
      WHERE circuits.id = circuit_collaboration.circuit_id 
      AND circuits.user_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM circuit_collaborators 
      WHERE circuit_collaborators.circuit_id = circuit_collaboration.circuit_id 
      AND circuit_collaborators.user_id = auth.uid() 
      AND circuit_collaborators.is_active = true
    )
  )
);

CREATE POLICY "Users can view collaboration data for circuits they have access to"
ON circuit_collaboration FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM circuits 
    WHERE circuits.id = circuit_collaboration.circuit_id 
    AND circuits.user_id = auth.uid()
  ) OR 
  EXISTS (
    SELECT 1 FROM circuit_collaborators 
    WHERE circuit_collaborators.circuit_id = circuit_collaboration.circuit_id 
    AND circuit_collaborators.user_id = auth.uid() 
    AND circuit_collaborators.is_active = true
  )
);

-- Add RLS policies for circuit_comments
ALTER TABLE circuit_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert comments for circuits they have access to"
ON circuit_comments FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND (
    EXISTS (
      SELECT 1 FROM circuits 
      WHERE circuits.id = circuit_comments.circuit_id 
      AND circuits.user_id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM circuit_collaborators 
      WHERE circuit_collaborators.circuit_id = circuit_comments.circuit_id 
      AND circuit_collaborators.user_id = auth.uid() 
      AND circuit_collaborators.is_active = true
    )
  )
);

CREATE POLICY "Users can view comments for circuits they have access to"
ON circuit_comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM circuits 
    WHERE circuits.id = circuit_comments.circuit_id 
    AND circuits.user_id = auth.uid()
  ) OR 
  EXISTS (
    SELECT 1 FROM circuit_collaborators 
    WHERE circuit_collaborators.circuit_id = circuit_comments.circuit_id 
    AND circuit_collaborators.user_id = auth.uid() 
    AND circuit_collaborators.is_active = true
  )
);

CREATE POLICY "Users can update comments they created"
ON circuit_comments FOR UPDATE
USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_circuit_collaboration_circuit_id ON circuit_collaboration(circuit_id);
CREATE INDEX IF NOT EXISTS idx_circuit_collaboration_user_id ON circuit_collaboration(user_id);
CREATE INDEX IF NOT EXISTS idx_circuit_collaboration_timestamp ON circuit_collaboration(timestamp);

CREATE INDEX IF NOT EXISTS idx_circuit_comments_circuit_id ON circuit_comments(circuit_id);
CREATE INDEX IF NOT EXISTS idx_circuit_comments_user_id ON circuit_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_circuit_comments_gate_id ON circuit_comments(gate_id);
