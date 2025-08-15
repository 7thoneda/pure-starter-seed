-- Create offer_completions table for tracking completed offers
CREATE TABLE public.offer_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(offer_id, user_id)
);

-- Enable RLS
ALTER TABLE public.offer_completions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own offer completions" 
ON public.offer_completions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own offer completions" 
ON public.offer_completions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create offer_analytics table for tracking offer performance
CREATE TABLE public.offer_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  offer_id TEXT NOT NULL,
  offer_type TEXT NOT NULL,
  reward_amount INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
  device_info TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.offer_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies (admin only access for analytics)
CREATE POLICY "Service role can manage analytics" 
ON public.offer_analytics 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create daily_rewards table for tracking daily login rewards
CREATE TABLE public.daily_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  claim_date DATE NOT NULL,
  reward_amount INTEGER NOT NULL,
  login_streak INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, claim_date)
);

-- Enable RLS
ALTER TABLE public.daily_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own daily rewards" 
ON public.daily_rewards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily rewards" 
ON public.daily_rewards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create user_coins table for tracking coin balances
CREATE TABLE public.user_coins (
  user_id UUID NOT NULL PRIMARY KEY,
  balance INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_coins ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own coin balance" 
ON public.user_coins 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coin balance" 
ON public.user_coins 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coin balance" 
ON public.user_coins 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to increment user coins
CREATE OR REPLACE FUNCTION public.increment_user_coins(user_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_coins (user_id, balance, lifetime_earned)
  VALUES (user_id, amount, amount)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    balance = user_coins.balance + amount,
    lifetime_earned = user_coins.lifetime_earned + amount,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get login streak
CREATE OR REPLACE FUNCTION public.get_login_streak(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 1;
  check_date DATE;
BEGIN
  -- Get the most recent claim date
  SELECT claim_date INTO check_date
  FROM public.daily_rewards
  WHERE daily_rewards.user_id = get_login_streak.user_id
  ORDER BY claim_date DESC
  LIMIT 1;
  
  -- If no previous claims, return 1
  IF check_date IS NULL THEN
    RETURN 1;
  END IF;
  
  -- Check if claim was yesterday (streak continues)
  IF check_date = CURRENT_DATE - INTERVAL '1 day' THEN
    -- Get the streak from the last claim
    SELECT login_streak + 1 INTO streak
    FROM public.daily_rewards
    WHERE daily_rewards.user_id = get_login_streak.user_id
    AND claim_date = check_date;
  ELSE
    -- Streak broken, reset to 1
    streak := 1;
  END IF;
  
  RETURN streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_coins_updated_at
BEFORE UPDATE ON public.user_coins
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();