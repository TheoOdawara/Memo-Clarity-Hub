-- Create raffle_entries table for user entries
CREATE TABLE public.raffle_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  raffle_id UUID NOT NULL REFERENCES public.raffles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Prevent duplicate entries
  UNIQUE(raffle_id, user_id)
);

-- Enable RLS
ALTER TABLE public.raffle_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for raffle entries
CREATE POLICY "Users can view all raffle entries" 
ON public.raffle_entries 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own raffle entries" 
ON public.raffle_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own raffle entries" 
ON public.raffle_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to get raffle entry count
CREATE OR REPLACE FUNCTION public.get_raffle_entry_count(raffle_id_param UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER 
    FROM public.raffle_entries 
    WHERE raffle_id = raffle_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to check if user entered raffle
CREATE OR REPLACE FUNCTION public.user_entered_raffle(raffle_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.raffle_entries 
    WHERE raffle_id = raffle_id_param AND user_id = user_id_param
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;