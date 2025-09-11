-- Fix security warnings by setting proper search_path for functions

-- Update the handle_new_user function to fix search path warning
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name'),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NULL
  );
  RETURN NEW;
END;
$$;

-- Update the update_checkin_streak function to fix search path warning
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;