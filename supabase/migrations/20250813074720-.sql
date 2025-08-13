-- Create call_sessions table for storing active call metadata
CREATE TABLE public.call_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initiator_id UUID NOT NULL,
  receiver_id UUID,
  call_type TEXT NOT NULL CHECK (call_type IN ('video', 'voice')),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'connecting', 'connected', 'ended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  connected_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  end_reason TEXT
);

-- Create signaling_messages table for WebRTC signaling data
CREATE TABLE public.signaling_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_session_id UUID NOT NULL REFERENCES public.call_sessions(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL,
  to_user_id UUID NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('offer', 'answer', 'ice-candidate')),
  message_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_matching table for matching queue
CREATE TABLE public.user_matching (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
  preferred_gender TEXT NOT NULL CHECK (preferred_gender IN ('anyone', 'men', 'women')),
  call_type TEXT NOT NULL CHECK (call_type IN ('video', 'voice')),
  is_premium BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'matched', 'cancelled')),
  matched_with_user_id UUID,
  call_session_id UUID REFERENCES public.call_sessions(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.call_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.signaling_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_matching ENABLE ROW LEVEL SECURITY;

-- RLS Policies for call_sessions
CREATE POLICY "Users can view their own call sessions" 
ON public.call_sessions 
FOR SELECT 
USING (auth.uid() = initiator_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create call sessions as initiator" 
ON public.call_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = initiator_id);

CREATE POLICY "Users can update their own call sessions" 
ON public.call_sessions 
FOR UPDATE 
USING (auth.uid() = initiator_id OR auth.uid() = receiver_id);

-- RLS Policies for signaling_messages
CREATE POLICY "Users can view their signaling messages" 
ON public.signaling_messages 
FOR SELECT 
USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can create signaling messages" 
ON public.signaling_messages 
FOR INSERT 
WITH CHECK (auth.uid() = from_user_id);

-- RLS Policies for user_matching
CREATE POLICY "Users can view their own matching requests" 
ON public.user_matching 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own matching requests" 
ON public.user_matching 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own matching requests" 
ON public.user_matching 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_call_sessions_initiator ON public.call_sessions(initiator_id);
CREATE INDEX idx_call_sessions_receiver ON public.call_sessions(receiver_id);
CREATE INDEX idx_call_sessions_status ON public.call_sessions(status);
CREATE INDEX idx_signaling_messages_call_session ON public.signaling_messages(call_session_id);
CREATE INDEX idx_signaling_messages_to_user ON public.signaling_messages(to_user_id);
CREATE INDEX idx_user_matching_user_id ON public.user_matching(user_id);
CREATE INDEX idx_user_matching_status ON public.user_matching(status);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_matching_updated_at
BEFORE UPDATE ON public.user_matching
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER TABLE public.call_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.signaling_messages REPLICA IDENTITY FULL;
ALTER TABLE public.user_matching REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.call_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.signaling_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_matching;