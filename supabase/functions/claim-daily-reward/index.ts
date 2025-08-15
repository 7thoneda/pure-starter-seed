import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      throw new Error('Invalid user token');
    }

    const today = new Date().toISOString().split('T')[0];

    // Check if daily reward already claimed
    const { data: existingClaim, error: checkError } = await supabase
      .from('daily_rewards')
      .select('*')
      .eq('user_id', user.id)
      .eq('claim_date', today)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingClaim) {
      return new Response(
        JSON.stringify({ reward: 0, reason: 'already_claimed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate streak and reward
    const { data: streakData } = await supabase.rpc('get_login_streak', {
      user_id: user.id
    });

    const streak = streakData || 1;
    const baseReward = 50;
    const bonusReward = Math.min(streak * 5, 100); // Max 100 bonus
    const totalReward = baseReward + bonusReward;

    // Record daily reward claim
    const { error: claimError } = await supabase
      .from('daily_rewards')
      .insert({
        user_id: user.id,
        claim_date: today,
        reward_amount: totalReward,
        login_streak: streak
      });

    if (claimError) throw claimError;

    // Update user coin balance
    const { error: balanceError } = await supabase.rpc('increment_user_coins', {
      user_id: user.id,
      amount: totalReward
    });

    if (balanceError) {
      console.error('Balance update failed:', balanceError);
    }

    console.log('Daily reward claimed:', { userId: user.id, reward: totalReward, streak });

    return new Response(
      JSON.stringify({ reward: totalReward, streak }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Daily reward error:', error);
    
    return new Response(
      JSON.stringify({ reward: 0, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})