-- Add published column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS published boolean DEFAULT false;
