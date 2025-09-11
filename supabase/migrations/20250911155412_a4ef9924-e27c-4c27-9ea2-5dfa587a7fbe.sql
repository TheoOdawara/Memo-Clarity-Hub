-- Create tests table to store user test results
CREATE TABLE public.tests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  phase_scores INTEGER[] NOT NULL CHECK (array_length(phase_scores, 1) = 4),
  total_score INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own tests" 
ON public.tests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tests" 
ON public.tests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tests" 
ON public.tests 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tests" 
ON public.tests 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_tests_user_id ON public.tests(user_id);
CREATE INDEX idx_tests_completed_at ON public.tests(completed_at);
CREATE INDEX idx_tests_total_score ON public.tests(total_score);