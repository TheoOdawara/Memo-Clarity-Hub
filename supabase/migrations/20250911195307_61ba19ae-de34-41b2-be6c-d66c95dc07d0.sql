-- Add winner_description column to raffles table
ALTER TABLE public.raffles 
ADD COLUMN IF NOT EXISTS winner_description TEXT;