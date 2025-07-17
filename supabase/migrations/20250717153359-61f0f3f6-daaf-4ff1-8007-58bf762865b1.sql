
-- Create educator profiles table
CREATE TABLE public.educator_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  institution_name TEXT,
  institution_type TEXT CHECK (institution_type IN ('university', 'college', 'high_school', 'middle_school', 'elementary', 'other')),
  department TEXT,
  subjects TEXT[],
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  plan_type TEXT NOT NULL DEFAULT 'free_classroom' CHECK (plan_type IN ('free_classroom', 'premium_classroom', 'enterprise')),
  max_students INTEGER NOT NULL DEFAULT 30,
  max_simulations_per_month INTEGER NOT NULL DEFAULT 500,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create classrooms table
CREATE TABLE public.classrooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  educator_id UUID REFERENCES public.educator_profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  semester TEXT,
  access_code TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(6), 'base64'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  max_students INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student enrollments table
CREATE TABLE public.student_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE NOT NULL,
  student_user_id UUID REFERENCES auth.users NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  enrollment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(classroom_id, student_user_id)
);

-- Create student activity tracking table
CREATE TABLE public.student_activity (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_enrollment_id UUID REFERENCES public.student_enrollments(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('circuit_created', 'simulation_run', 'tutorial_completed', 'assignment_submitted')),
  activity_data JSONB NOT NULL DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create LMS integrations table
CREATE TABLE public.lms_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  educator_id UUID REFERENCES public.educator_profiles(id) ON DELETE CASCADE NOT NULL,
  lms_type TEXT NOT NULL CHECK (lms_type IN ('canvas', 'moodle', 'blackboard', 'google_classroom', 'schoology')),
  integration_data JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.educator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lms_integrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for educator_profiles
CREATE POLICY "Educators can manage their own profile" 
  ON public.educator_profiles 
  FOR ALL 
  USING (auth.uid() = user_id);

-- RLS policies for classrooms
CREATE POLICY "Educators can manage their own classrooms" 
  ON public.classrooms 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.educator_profiles 
    WHERE id = educator_id AND user_id = auth.uid()
  ));

-- RLS policies for student_enrollments
CREATE POLICY "Educators can manage their classroom enrollments" 
  ON public.student_enrollments 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.classrooms c
    JOIN public.educator_profiles ep ON c.educator_id = ep.id
    WHERE c.id = classroom_id AND ep.user_id = auth.uid()
  ));

CREATE POLICY "Students can view their own enrollments" 
  ON public.student_enrollments 
  FOR SELECT 
  USING (auth.uid() = student_user_id);

-- RLS policies for student_activity
CREATE POLICY "Educators can view their students' activity" 
  ON public.student_activity 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.student_enrollments se
    JOIN public.classrooms c ON se.classroom_id = c.id
    JOIN public.educator_profiles ep ON c.educator_id = ep.id
    WHERE se.id = student_enrollment_id AND ep.user_id = auth.uid()
  ));

CREATE POLICY "Students can create their own activity" 
  ON public.student_activity 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.student_enrollments se
    WHERE se.id = student_enrollment_id AND se.student_user_id = auth.uid()
  ));

-- RLS policies for lms_integrations
CREATE POLICY "Educators can manage their own LMS integrations" 
  ON public.lms_integrations 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.educator_profiles 
    WHERE id = educator_id AND user_id = auth.uid()
  ));

-- Create triggers for updated_at
CREATE TRIGGER update_educator_profiles_updated_at
  BEFORE UPDATE ON public.educator_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classrooms_updated_at
  BEFORE UPDATE ON public.classrooms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lms_integrations_updated_at
  BEFORE UPDATE ON public.lms_integrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
