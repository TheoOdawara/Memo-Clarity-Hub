-- Add winner_image_url column to raffles table
ALTER TABLE public.raffles 
ADD COLUMN IF NOT EXISTS winner_image_url TEXT;