-- Add missing columns to profiles table for checkin functionality
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS streak_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_checkin_date DATE;

-- Create checkins table
CREATE TABLE IF NOT EXISTS public.checkins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  notes TEXT,
  streak_day INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on checkins table
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for checkins table
CREATE POLICY "Users can view their own checkins" 
ON public.checkins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checkins" 
ON public.checkins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checkins" 
ON public.checkins 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checkins" 
ON public.checkins 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update streak count
CREATE OR REPLACE FUNCTION public.update_checkin_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_checkin_date DATE;
  current_streak INTEGER;
BEGIN
  -- Get user's last checkin date and current streak
  SELECT profiles.last_checkin_date, profiles.streak_count 
  INTO last_checkin_date, current_streak
  FROM public.profiles 
  WHERE user_id = NEW.user_id;

  -- Calculate new streak
  IF last_checkin_date IS NULL THEN
    -- First checkin ever
    NEW.streak_day := 1;
    current_streak := 1;
  ELSIF last_checkin_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Consecutive day
    current_streak := current_streak + 1;
    NEW.streak_day := current_streak;
  ELSIF last_checkin_date = CURRENT_DATE THEN
    -- Same day checkin (update existing)
    NEW.streak_day := current_streak;
  ELSE
    -- Streak broken, reset to 1
    current_streak := 1;
    NEW.streak_day := 1;
  END IF;

  -- Update profile with new streak info
  UPDATE public.profiles 
  SET 
    streak_count = current_streak,
    last_checkin_date = CURRENT_DATE,
    updated_at = now()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic streak updates
CREATE TRIGGER update_checkin_streak_trigger
BEFORE INSERT ON public.checkins
FOR EACH ROW
EXECUTE FUNCTION public.update_checkin_streak();

-- Add trigger for updated_at column on checkins
CREATE TRIGGER update_checkins_updated_at
BEFORE UPDATE ON public.checkins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_checkins_user_id_date ON public.checkins(user_id, checked_at);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);