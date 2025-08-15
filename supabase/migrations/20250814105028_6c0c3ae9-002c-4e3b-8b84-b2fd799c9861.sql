-- Create virtual gifts table
CREATE TABLE public.virtual_gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT NOT NULL,
  price_coins INTEGER NOT NULL,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL DEFAULT 'standard',
  animation_type TEXT NOT NULL DEFAULT 'float',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert virtual gifts
INSERT INTO public.virtual_gifts (name, emoji, price_coins, is_premium, category, animation_type) VALUES
('Rose', '🌹', 5, false, 'romantic', 'float'),
('Diamond Ring', '💍', 50, true, 'romantic', 'sparkle'),
('Crown', '👑', 30, true, 'luxury', 'glow'),
('Heart Eyes', '😍', 3, false, 'cute', 'bounce'),
('Fire', '🔥', 4, false, 'exciting', 'flame'),
('Crown Jewels', '💎', 100, true, 'luxury', 'rainbow'),
('Golden Heart', '💛', 15, true, 'romantic', 'golden'),
('Kiss', '💋', 8, false, 'romantic', 'float'),
('Lightning', '⚡', 6, false, 'exciting', 'flash'),
('Star Eyes', '🤩', 4, false, 'cute', 'twinkle');

-- Create gift transactions table
CREATE TABLE public.gift_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  receiver_id UUID NOT NULL,
  gift_id UUID NOT NULL REFERENCES public.virtual_gifts(id),
  call_session_id UUID REFERENCES public.call_sessions(id),
  coins_spent INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.virtual_gifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for virtual gifts (readable by all)
CREATE POLICY "Virtual gifts are viewable by everyone" 
ON public.virtual_gifts 
FOR SELECT 
USING (true);

-- Create policies for gift transactions
CREATE POLICY "Users can create gift transactions" 
ON public.gift_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view their gift transactions" 
ON public.gift_transactions 
FOR SELECT 
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Create voice modulation settings table
CREATE TABLE public.voice_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  modulation_type TEXT NOT NULL DEFAULT 'normal',
  pitch_shift REAL NOT NULL DEFAULT 1.0,
  echo_level REAL NOT NULL DEFAULT 0.0,
  reverb_level REAL NOT NULL DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS and policies for voice settings
ALTER TABLE public.voice_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own voice settings" 
ON public.voice_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own voice settings" 
ON public.voice_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voice settings" 
ON public.voice_settings 
FOR UPDATE 
USING (auth.uid() = user_id);