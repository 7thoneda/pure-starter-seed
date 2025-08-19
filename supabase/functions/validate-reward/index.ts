import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RewardValidationRequest {
  offerId: string;
  userId: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { offerId, userId }: RewardValidationRequest = await req.json();
    
    console.log('Validating reward:', { offerId, userId });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if offer was already completed by this user
    const { data: existingCompletion, error: checkError } = await supabase
      .from('offer_completions')
      .select('*')
      .eq('offer_id', offerId)
      .eq('user_id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    // If already completed, return false
    if (existingCompletion) {
      console.log('Offer already completed by user');
      return new Response(
        JSON.stringify({ valid: false, reason: 'already_completed' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Anti-fraud checks
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Check completion rate (max 10 offers per hour)
    const { data: recentCompletions, error: rateError } = await supabase
      .from('offer_completions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', oneHourAgo.toISOString());

    if (rateError) throw rateError;

    if (recentCompletions && recentCompletions.length >= 10) {
      console.log('Rate limit exceeded');
      return new Response(
        JSON.stringify({ valid: false, reason: 'rate_limit' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Additional fraud checks
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const { data: dailyCompletions, error: dailyError } = await supabase
      .from('offer_completions')
      .select('*')
      .eq('user_id', userId)
      .gte('completed_at', oneDayAgo.toISOString());

    if (dailyError) throw dailyError;

    // Max 50 offers per day
    if (dailyCompletions && dailyCompletions.length >= 50) {
      console.log('Daily limit exceeded');
      return new Response(
        JSON.stringify({ valid: false, reason: 'daily_limit' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Record the completion
    const { error: insertError } = await supabase
      .from('offer_completions')
      .insert({
        offer_id: offerId,
        user_id: userId,
        completed_at: now.toISOString()
      });

    if (insertError) throw insertError;

    console.log('Reward validation successful');

    return new Response(
      JSON.stringify({ 
        valid: true, 
        message: 'Reward validated successfully',
        timestamp: now.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Reward validation error:', error);
    
    return new Response(
      JSON.stringify({ valid: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})