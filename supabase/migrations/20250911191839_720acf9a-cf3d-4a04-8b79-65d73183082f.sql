-- Create raffles table
CREATE TABLE public.raffles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  prize TEXT NOT NULL,
  image_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  winner_user_id UUID REFERENCES auth.users(id),
  winner_username TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.raffles ENABLE ROW LEVEL SECURITY;

-- Create policies for raffles
CREATE POLICY "Raffles are viewable by everyone" 
ON public.raffles 
FOR SELECT 
USING (true);

-- Only specific admin users can create/update raffles
CREATE POLICY "Admin users can create raffles" 
ON public.raffles 
FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    'e125efb8-857b-41b5-943b-745f11fd5808'::uuid,
    'fed35ccf-2bd5-4d64-a50c-e8bb951c632c'::uuid
  )
);

CREATE POLICY "Admin users can update raffles" 
ON public.raffles 
FOR UPDATE 
USING (
  auth.uid() IN (
    'e125efb8-857b-41b5-943b-745f11fd5808'::uuid,
    'fed35ccf-2bd5-4d64-a50c-e8bb951c632c'::uuid
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_raffles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_raffles_updated_at
BEFORE UPDATE ON public.raffles
FOR EACH ROW
EXECUTE FUNCTION public.update_raffles_updated_at();