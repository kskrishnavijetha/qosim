-- Create circuits table for user workspace
CREATE TABLE public.circuits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  circuit_data JSONB NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.circuits ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own circuits" 
ON public.circuits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own circuits" 
ON public.circuits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own circuits" 
ON public.circuits 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own circuits" 
ON public.circuits 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policy for public circuits
CREATE POLICY "Anyone can view public circuits" 
ON public.circuits 
FOR SELECT 
USING (is_public = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_circuits_updated_at
BEFORE UPDATE ON public.circuits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();