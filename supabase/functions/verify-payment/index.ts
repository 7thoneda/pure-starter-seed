import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHmac } from "https://deno.land/std@0.160.0/crypto/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RAZORPAY_SECRET_KEY = Deno.env.get('RAZORPAY_SECRET_KEY');
    
    if (!RAZORPAY_SECRET_KEY) {
      throw new Error('Razorpay secret key not configured');
    }

    // Get request body
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature 
    } = await req.json();
    
    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      throw new Error('Missing required payment verification fields');
    }

    // Verify signature
    const generatedSignature = createHmac("sha256", RAZORPAY_SECRET_KEY)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      throw new Error('Invalid payment signature');
    }

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } }
    });

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Update transaction status
    const { data: transaction, error: updateError } = await supabase
      .from('payment_transactions')
      .update({ 
        status: 'completed',
        razorpay_payment_id: razorpay_payment_id 
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Transaction update error:', updateError);
      throw new Error('Failed to update transaction');
    }

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Process the purchase based on product type
    const { product_type, product_details } = transaction;
    
    switch (product_type) {
      case 'coins':
        // Add coins to user profile
        const { error: coinsError } = await supabase
          .from('profiles')
          .update({ 
            coins: supabase.sql`coins + ${product_details.coins}`
          })
          .eq('user_id', user.id);
        
        if (coinsError) {
          console.error('Coins update error:', coinsError);
          throw new Error('Failed to add coins');
        }
        break;

      case 'premium':
        // Update user to premium
        const { error: premiumError } = await supabase
          .from('profiles')
          .update({ is_premium: true })
          .eq('user_id', user.id);
        
        if (premiumError) {
          console.error('Premium update error:', premiumError);
          throw new Error('Failed to activate premium');
        }
        break;

      case 'unlimited_calls':
        // For now, just mark as premium (can be extended later)
        const { error: unlimitedError } = await supabase
          .from('profiles')
          .update({ is_premium: true })
          .eq('user_id', user.id);
        
        if (unlimitedError) {
          console.error('Unlimited calls update error:', unlimitedError);
          throw new Error('Failed to activate unlimited calls');
        }
        break;

      default:
        throw new Error('Invalid product type');
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Payment verified and processed successfully',
      transaction_id: transaction.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});