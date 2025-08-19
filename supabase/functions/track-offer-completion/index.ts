import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OfferCompletionData {
  offerId: string;
  offerType: string;
  reward: number;
  completedAt: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { offerId, offerType, reward, completedAt }: OfferCompletionData = await req.json();
    
    console.log('Tracking offer completion:', { offerId, offerType, reward });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      throw new Error('Invalid user token');
    }

    // Anti-fraud validation
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Check if user has completed too many offers recently (max 10 per hour)
    const { data: recentCompletions, error: recentError } = await supabase
      .from('offer_analytics')
      .select('id')
      .eq('user_id', user.id)
      .gte('completed_at', oneHourAgo.toISOString());

    if (recentError) {
      console.error('Error checking recent completions:', recentError);
    } else if (recentCompletions && recentCompletions.length >= 10) {
      throw new Error('Rate limit exceeded - too many offers completed recently');
    }

    // Check if this specific offer was already completed
    const { data: existingCompletion, error: existingError } = await supabase
      .from('offer_analytics')
      .select('id')
      .eq('user_id', user.id)
      .eq('offer_id', offerId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error('Error checking existing completion:', existingError);
    } else if (existingCompletion) {
      throw new Error('Offer already completed');
    }

    // Track analytics
    const { error: analyticsError } = await supabase
      .from('offer_analytics')
      .insert({
        user_id: user.id,
        offer_id: offerId,
        offer_type: offerType,
        reward_amount: reward,
        completed_at: completedAt,
        device_info: req.headers.get('User-Agent') || 'unknown',
        ip_address: req.headers.get('CF-Connecting-IP') || 'unknown'
      });

    if (analyticsError) {
      console.error('Analytics tracking failed:', analyticsError);
      throw new Error('Failed to track offer completion');
    }

    // Update user coin balance
    const { error: balanceError } = await supabase.rpc('increment_user_coins', {
      user_id: user.id,
      amount: reward
    });

    if (balanceError) {
      console.error('Balance update failed:', balanceError);
      throw new Error('Failed to update coin balance');
    }

    console.log('Offer completion tracked successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        reward_added: reward,
        message: 'Offer completed and coins added successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Tracking error:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: error.message.includes('Rate limit') || error.message.includes('already completed') ? 400 : 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})